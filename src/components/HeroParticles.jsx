import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Hero 流体粒子背景：原生 WebGL + 手写 GLSL（无 Three.js 依赖）
//
// 原理（feedback advection / 墨迹流场）：
//   1. 一张半分辨率 ping-pong FBO 保存上一帧的"墨迹"纹理
//   2. update pass：整张纹理沿 curl(fbm noise) 流场做后向位移（对流），
//      同时轻微衰减 → 注入的墨滴被自动拉成丝缕拖尾
//   3. 每帧在 hash 网格中随机注入四色系（赤陶/金/粉/灰绿）墨滴
//   4. display pass：把墨迹纹理以水彩质感（软饱和 alpha）合成到透明 canvas 上，
//      叠加在 Hero 已有的 CSS 径向光晕之下层
//
// 安全性：SSG 时组件不初始化任何 WebGL（全部在 useEffect 内）；
//         prefers-reduced-motion 时只做一次静态渲染；
//         WebGL 不可用时静默降级（canvas 留空）。
// ─────────────────────────────────────────────────────────────────────────────

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

// update pass：对流旧墨迹 + 衰减 + 注入新墨滴
const UPDATE_FRAG = `
precision mediump float;
uniform sampler2D uPrev;
uniform vec2 uSim;      // sim 纹理尺寸（像素）
uniform float uTime;    // 秒
uniform float uFrame;   // 帧序号（驱动随机注入）
uniform float uDt;      // 归一化步长（1 = 60fps 一帧）
varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + 17.17;
    a *= 0.5;
  }
  return v;
}

// 流速势 → curl（无散度，墨不聚堆）
vec2 curl(vec2 p, float t) {
  vec2 drift = vec2(t * 0.045, t * 0.03);
  float e = 0.18;
  float n1 = fbm(p * 1.5 + drift + vec2(0.0, e));
  float n2 = fbm(p * 1.5 + drift - vec2(0.0, e));
  float n3 = fbm(p * 1.5 + drift + vec2(e, 0.0));
  float n4 = fbm(p * 1.5 + drift - vec2(e, 0.0));
  return vec2(n1 - n2, n4 - n3) / (2.0 * e);
}

// 四色系（赤陶 #C2705B / 金 #C9A24B / 粉 #E7C6BB / 灰绿 #7E9479）
vec3 palette(float h) {
  vec3 c0 = vec3(0.761, 0.439, 0.357);
  vec3 c1 = vec3(0.788, 0.635, 0.294);
  vec3 c2 = vec3(0.906, 0.776, 0.733);
  vec3 c3 = vec3(0.494, 0.580, 0.475);
  h = fract(h) * 4.0;
  if (h < 1.0) return mix(c0, c1, h);
  if (h < 2.0) return mix(c1, c2, h - 1.0);
  if (h < 3.0) return mix(c2, c3, h - 2.0);
  return mix(c3, c0, h - 3.0);
}

void main() {
  // 流场采样（用区域中尺度的 curl，宽缓流动而非细碎扰动）
  vec2 flow = curl(vUv * 2.2, uTime);
  // 后向对流采样：拖尾方向 = 流场方向
  vec2 back = vUv - flow * 0.0035 * uDt;
  vec4 prev = texture2D(uPrev, back);

  // 缓慢整体漂移，防止流场驻点处墨迹淤积
  back = vUv - vec2(0.00018, 0.00010) * uDt;
  prev = max(prev, texture2D(uPrev, back) * 0.94);

  // 衰减（拖尾长度 ≈ 1/(1-decay) ≈ 80 帧）
  float decay = pow(0.9875, uDt);
  vec4 ink = prev * decay;

  // ── 墨滴注入：hash 网格，每帧每格按概率出现一颗 ──
  vec2 aspect = vec2(uSim.x / uSim.y, 1.0);
  vec2 grid = vec2(30.0, 30.0 / aspect.x * aspect.y);
  vec2 cell = floor(vUv * grid);
  vec2 cellUv = fract(vUv * grid);

  float sel = hash21(cell + floor(uFrame * 0.5) * 0.137);
  if (sel > 0.72) {
    vec2 jitter = vec2(hash21(cell + 7.3), hash21(cell + 3.9));
    vec2 d = (cellUv - jitter) * aspect;
    float r = 0.10 + 0.10 * hash21(cell + 11.7);
    float glow = smoothstep(r, 0.0, length(d));
    vec3 col = palette(hash21(cell + 5.5) + uTime * 0.008);
    float amt = glow * 0.14;
    ink.rgb += col * amt;
    ink.a += amt;
  }

  gl_FragColor = min(ink, vec4(1.5));
}
`

// display pass：墨迹纹理 → 透明 canvas（premultiplied alpha，水彩质感）
const DISPLAY_FRAG = `
precision mediump float;
uniform sampler2D uInk;
varying vec2 vUv;

void main() {
  vec4 ink = texture2D(uInk, vUv);
  float coverage = max(ink.a, 1e-4);
  // 软饱和：墨越厚 alpha 越高但封顶，保持轻薄水彩感、不糊文字
  float alpha = 1.0 - exp(-coverage * 2.4);
  alpha *= 0.42;
  vec3 color = ink.rgb / coverage;
  gl_FragColor = vec4(color * alpha, alpha);
}
`

function compileShader(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null
  return sh
}

function createProgram(gl, vertSrc, fragSrc) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc)
  if (!vs || !fs) return null
  const prog = gl.createProgram()
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  return prog
}

export default function HeroParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    // WebGL 不可用：静默降级，canvas 留空
    if (!gl) return

    const updateProg = createProgram(gl, VERT, UPDATE_FRAG)
    const displayProg = createProgram(gl, VERT, DISPLAY_FRAG)
    if (!updateProg || !displayProg) return

    // 全屏 quad
    const quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const bindQuad = (prog) => {
      const loc = gl.getAttribLocation(prog, 'aPos')
      gl.bindBuffer(gl.ARRAY_BUFFER, quad)
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    }

    const uUpdate = {
      prev: gl.getUniformLocation(updateProg, 'uPrev'),
      sim: gl.getUniformLocation(updateProg, 'uSim'),
      time: gl.getUniformLocation(updateProg, 'uTime'),
      frame: gl.getUniformLocation(updateProg, 'uFrame'),
      dt: gl.getUniformLocation(updateProg, 'uDt'),
    }
    const uDisplay = {
      ink: gl.getUniformLocation(displayProg, 'uInk'),
    }

    // ping-pong FBO（半分辨率上限 512，水彩柔质感 + 省性能）
    let simW = 1
    let simH = 1
    let texA = null
    let texB = null
    let fboA = null
    let fboB = null

    const makeTarget = (w, h) => {
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      const fbo = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      return { tex, fbo }
    }

    const destroyTargets = () => {
      for (const t of [texA, texB]) if (t) gl.deleteTexture(t)
      for (const f of [fboA, fboB]) if (f) gl.deleteFramebuffer(f)
      texA = texB = fboA = fboB = null
    }

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(parent.clientWidth * dpr))
      const h = Math.max(1, Math.round(parent.clientHeight * dpr))
      if (canvas.width === w && canvas.height === h && texA) return
      canvas.width = w
      canvas.height = h
      const scale = Math.min(1, 512 / Math.max(w, h))
      simW = Math.max(1, Math.round(w * scale))
      simH = Math.max(1, Math.round(h * scale))
      destroyTargets()
      const a = makeTarget(simW, simH)
      const b = makeTarget(simW, simH)
      texA = a.tex; fboA = a.fbo
      texB = b.tex; fboB = b.fbo
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    let frame = 0
    let raf = 0
    let last = 0

    // 一步 update（把 texA 对流进 texB），随后交换
    const stepUpdate = (time, dt) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboB)
      gl.viewport(0, 0, simW, simH)
      gl.useProgram(updateProg)
      bindQuad(updateProg)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texA)
      gl.uniform1i(uUpdate.prev, 0)
      gl.uniform2f(uUpdate.sim, simW, simH)
      gl.uniform1f(uUpdate.time, time)
      gl.uniform1f(uUpdate.frame, frame)
      gl.uniform1f(uUpdate.dt, dt)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      const t = texA, f = fboA
      texA = texB; fboA = fboB; texB = t; fboB = f
    }

    const stepDisplay = () => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.useProgram(displayProg)
      bindQuad(displayProg)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texA)
      gl.uniform1i(uDisplay.ink, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const start = () => {
      if (raf) return
      last = performance.now()
      const tick = (now) => {
        raf = requestAnimationFrame(tick)
        const dt = Math.min(2, Math.max(0.5, (now - last) / 16.667))
        last = now
        frame += 1
        stepUpdate(now / 1000, dt)
        stepDisplay()
      }
      raf = requestAnimationFrame(tick)
    }

    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    resize()

    if (reduced) {
      // 静态帧：预热若干步（墨迹成型）后渲染一帧即停
      const warmup = 120
      for (let i = 0; i < warmup; i++) {
        frame += 1
        stepUpdate(i * 0.05, 1)
      }
      stepDisplay()
    } else {
      start()
    }

    const onResize = () => {
      resize()
      if (reduced) {
        frame += 1
        stepUpdate(performance.now() / 1000, 1)
        stepDisplay()
      }
    }
    const onVisibility = () => {
      if (document.hidden) stop()
      else if (!reduced) start()
    }
    const onContextLost = (e) => {
      e.preventDefault()
      stop()
    }

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    canvas.addEventListener('webglcontextlost', onContextLost)

    return () => {
      stop()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      destroyTargets()
      gl.deleteProgram(updateProg)
      gl.deleteProgram(displayProg)
      gl.deleteBuffer(quad)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />
}
