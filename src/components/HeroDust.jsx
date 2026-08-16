import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Hero 金尘粒子：原生 WebGL gl.POINTS（零依赖，Codrops 2024 dreamy particle 路线）
//
// 视觉：阳光照进房间、微尘在光柱里飘——
//   - ~260 个柔光点（大小/亮度随「景深」随机分布，近大远小）
//   - 每个粒子带相位差的缓慢上浮 + 水平正弦漂移，bokeh 光斑质感
//   - 金/赤陶/粉三色系（加性混合，越叠越亮，暖纸底上呈现发光微尘）
//   - 鼠标划过时附近粒子被轻轻推开（半径 120px，柔性衰减，无暴力弹射）
//
// 性能与安全：
//   - 位置更新在 CPU（260 个粒子每帧算三角函数开销可忽略），渲染 gl.POINTS 单 draw call
//   - SSG 不初始化（全在 useEffect）；reduced-motion 渲一帧静态
//   - WebGL 不可用静默降级；页面隐藏暂停；卸载释放上下文
// ─────────────────────────────────────────────────────────────────────────────

const VERT = `
attribute vec3 aData;    // x, y 位置（像素）
attribute vec3 aAttr;    // 半径, 亮度, 色相索引
uniform vec2 uRes;
varying float vAlpha;
varying float vHue;
void main() {
  vec2 clip = (aData.xy / uRes) * 2.0 - 1.0;
  clip.y = -clip.y;
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = aAttr.x * 2.0;
  vAlpha = aAttr.y;
  vHue = aAttr.z;
}
`

const FRAG = `
precision mediump float;
varying float vAlpha;
varying float vHue;
void main() {
  // 圆形软光斑：中心亮、边缘平滑衰减（bokeh）
  vec2 d = gl_PointCoord - vec2(0.5);
  float r = length(d) * 2.0;
  float glow = smoothstep(1.0, 0.0, r);
  glow *= glow;  // 更柔的衰减曲线
  // 三色系：0=金 1=赤陶粉 2=粉白
  vec3 gold  = vec3(0.851, 0.702, 0.373);  // #D9B35F
  vec3 terr  = vec3(0.878, 0.616, 0.533);  // #E09D88
  vec3 blush = vec3(0.941, 0.851, 0.800);  // #F0D9CC
  vec3 col = vHue < 0.5 ? mix(gold, terr, vHue * 2.0) : mix(terr, blush, (vHue - 0.5) * 2.0);
  // premultiplied additive
  float a = glow * vAlpha;
  gl_FragColor = vec4(col * a, a);
}
`

function compileShader(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null
  return sh
}

export default function HeroDust() {
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

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const aData = gl.getAttribLocation(prog, 'aData')
    const aAttr = gl.getAttribLocation(prog, 'aAttr')

    // ── 粒子状态（CPU 侧） ──
    const COUNT = 340
    // Float32Array ×2：aData(x,y,unused) aAttr(radius, alpha, hue)
    const pos = new Float32Array(COUNT * 3)
    const attr = new Float32Array(COUNT * 3)
    // 每粒子运动参数
    const phase = new Float32Array(COUNT)     // 呼吸相位
    const speedY = new Float32Array(COUNT)    // 上浮速度
    const swayAmp = new Float32Array(COUNT)   // 水平漂移幅度
    const swayFreq = new Float32Array(COUNT)  // 漂移频率
    const baseX = new Float32Array(COUNT)

    let W = 1
    let H = 1
    let dpr = 1

    const seed = () => {
      for (let i = 0; i < COUNT; i++) {
        baseX[i] = Math.random() * W
        pos[i * 3] = baseX[i]
        pos[i * 3 + 1] = Math.random() * H
        // 景深分布：多数小而淡（远），少数大而亮（近）
        const depth = Math.pow(Math.random(), 2.0)
        attr[i * 3] = 4 + depth * 34           // 半径 px（点大小 = ×2）
        attr[i * 3 + 1] = 0.16 + depth * 0.75  // 亮度
        attr[i * 3 + 2] = Math.random()          // 色相插值
        phase[i] = Math.random() * Math.PI * 2
        speedY[i] = 4 + Math.random() * 10       // px/s，极慢上浮
        swayAmp[i] = 8 + Math.random() * 22
        swayFreq[i] = 0.2 + Math.random() * 0.5
      }
    }

    const bufPos = gl.createBuffer()
    const bufAttr = gl.createBuffer()

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return false
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(parent.clientWidth * dpr)
      const h = Math.round(parent.clientHeight * dpr)
      if (w <= 0 || h <= 0) return false
      const changed = canvas.width !== w || canvas.height !== h || W !== w || H !== h
      canvas.width = w
      canvas.height = h
      const first = W === 1
      W = w
      H = h
      if (first || changed) seed()
      return true
    }

    // 鼠标（CSS 像素 → 乘 dpr）
    const mouse = { x: -1e4, y: -1e4 }
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - rect.left) * dpr
      mouse.y = (e.clientY - rect.top) * dpr
    }
    const onLeave = () => { mouse.x = -1e4; mouse.y = -1e4 }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    const draw = (timeSec) => {
      gl.viewport(0, 0, W, H)
      gl.useProgram(prog)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)  // premultiplied

      for (let i = 0; i < COUNT; i++) {
        const t = timeSec
        let x = baseX[i] + Math.sin(t * swayFreq[i] + phase[i]) * swayAmp[i]
        // 呼吸亮度
        const breathe = 0.75 + 0.25 * Math.sin(t * 0.8 + phase[i] * 2.0)
        attr[i * 3 + 1] = (0.16 + Math.pow(Math.min(1, (attr[i * 3] / 38)), 1.5) * 0.75) * breathe

        // 鼠标轻推：半径内柔性位移（只偏移 x 的渲染位置，不改物理状态）
        const dx = x - mouse.x
        const dy = pos[i * 3 + 1] - mouse.y
        const dist = Math.hypot(dx, dy)
        const R = 120 * dpr
        if (dist < R && dist > 0.001) {
          const f = (1 - dist / R)
          const push = f * f * 46 * dpr
          x += (dx / dist) * push
        }
        pos[i * 3] = x
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, bufPos)
      gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(aData)
      gl.vertexAttribPointer(aData, 3, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, bufAttr)
      gl.bufferData(gl.ARRAY_BUFFER, attr, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(aAttr)
      gl.vertexAttribPointer(aAttr, 3, gl.FLOAT, false, 0, 0)

      gl.uniform2f(uRes, W, H)
      gl.drawArrays(gl.POINTS, 0, COUNT)
    }

    // y 轴上浮放在独立累积器（避免时间大数乘法精度问题）
    let last = 0
    const step = (nowSec) => {
      const dt = Math.min(0.05, nowSec - last || 0.016)
      last = nowSec
      for (let i = 0; i < COUNT; i++) {
        let y = pos[i * 3 + 1] - speedY[i] * dt
        if (y < -30) { y = H + 30; baseX[i] = Math.random() * W }
        pos[i * 3 + 1] = y
      }
    }

    let raf = 0
    const t0 = performance.now()
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return
      const now = (performance.now() - t0) / 1000
      step(now)
      draw(now)
    }

    resize()
    if (reduced) {
      draw(3.0) // 静态一帧
    } else {
      loop()
    }

    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    const onLost = (e) => { e.preventDefault(); cancelAnimationFrame(raf) }
    canvas.addEventListener('webglcontextlost', onLost)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('webglcontextlost', onLost)
      gl.deleteBuffer(bufPos)
      gl.deleteBuffer(bufAttr)
      gl.deleteProgram(prog)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-dust" aria-hidden="true" />
}
