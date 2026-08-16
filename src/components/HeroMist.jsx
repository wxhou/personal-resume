import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Hero 流雾背景：原生 WebGL + 手写 GLSL（复刻 jingjinglearns.cc 实测特征）
//
// 实测目标（对参考站 hero 两帧像素分析）：
//   - 暖色流雾 60%（赤陶粉/金），冷色 0%，深色仅 7% → 极淡，无边界的云雾
//   - 2s 仅 4.2% 像素变化 → 流动极慢
//   - 典型色 rgb(212,159,144) 级别的柔和暖调
//
// 实现：单 pass domain-warped fbm——两层噪声互相扭曲产生无重复的云状流场，
// 噪声值映射到 淡粉→赤陶粉→金 的极低 alpha 渐变，透明合成到米底之上。
//
// 安全：SSG 不初始化（全在 useEffect）；reduced-motion 渲一帧静态；
//       WebGL 不可用静默降级；页面隐藏暂停；卸载释放上下文。
// ─────────────────────────────────────────────────────────────────────────────

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision mediump float;
uniform vec2 uRes;     // 画布像素尺寸
uniform float uTime;   // 秒
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
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = p * 2.02 + 11.31;
    a *= 0.5;
  }
  return v;
}

void main() {
  // 纵横比校正
  vec2 uv = vUv;
  uv.x *= uRes.x / uRes.y;

  // 流动速度（实测标定：对齐参考站 2s ≈ 4% 像素变化）
  float t = uTime * 0.4;

  // domain warp：第二层噪声扭曲第一层的采样坐标 → 云状无重复流场
  vec2 q = vec2(fbm(uv * 1.6 + t * 0.6), fbm(uv * 1.6 - t * 0.4 + 7.7));
  float n = fbm(uv * 2.2 + q * 1.4 + vec2(t * 0.8, -t * 0.3));

  // 流雾强度：对齐参考站 ~22% 覆盖（窄门槛）
  float m = smoothstep(0.55, 0.78, n);

  // 暖色渐变：淡粉 → 赤陶粉 → 金（参考站实测色系）
  vec3 pink   = vec3(0.906, 0.776, 0.733);  // #E7C6BB
  vec3 terrac = vec3(0.831, 0.624, 0.565);  // #D49F90
  vec3 gold   = vec3(0.788, 0.635, 0.294);  // #C9A24B
  vec3 col = mix(pink, terrac, smoothstep(0.0, 0.6, m));
  col = mix(col, gold * 0.9, smoothstep(0.55, 1.0, m) * 0.45);

  // 极低 alpha（实测 7% 深色 → 整体清淡），峰值封顶
  float alpha = m * 0.34;

  gl_FragColor = vec4(col * alpha, alpha);  // premultiplied
}
`

function compileShader(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null
  return sh
}

export default function HeroMist() {
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
    if (!gl) return

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return

    const quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')

    const draw = (timeSec) => {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.useProgram(prog)
      const loc = gl.getAttribLocation(prog, 'aPos')
      gl.bindBuffer(gl.ARRAY_BUFFER, quad)
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, timeSec)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(parent.clientWidth * dpr)
      const h = Math.round(parent.clientHeight * dpr)
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w
        canvas.height = h
        return true
      }
      return false
    }

    const t0 = performance.now()
    let raf = 0
    let needsDraw = true

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return
      draw((performance.now() - t0) / 1000)
    }

    const onResize = () => { needsDraw = true }
    const onVis = () => { if (!document.hidden) needsDraw = true }

    resize()
    if (reduced) {
      // reduced-motion：预热渲染一帧静态流雾（时间取固定值）
      draw(47.0)
    } else {
      loop()
    }

    const resizeTimer = setInterval(() => {
      if (needsDraw || resize()) {
        needsDraw = false
        if (reduced) draw(47.0)
      }
    }, 500)

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVis)

    const onLost = (e) => { e.preventDefault(); cancelAnimationFrame(raf) }
    canvas.addEventListener('webglcontextlost', onLost)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('webglcontextlost', onLost)
      gl.deleteBuffer(quad)
      gl.deleteProgram(prog)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-mist" aria-hidden="true" />
}
