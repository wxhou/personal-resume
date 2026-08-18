import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Hero 星尘点阵：原生 WebGL 单 pass shader（复刻 jingjinglearns.cc 视觉）
//
// 参考站实测（AI 视觉分析 + 帧序列）：
//   - 每平方厘米 50-80 个细小粒子（1-2px），密集铺满
//   - 浅绿/浅红/浅褐三色，低饱和，与米底弱对比
//   - 中心密、边缘疏的分布梯度
//   - 整体缓慢流动（帧质心漂移、大面积缓变）
//
// 实现：fragment shader 内 hash 网格点阵——每个 cell 中心一个点，
//       点位置随 domain-warped fbm 流场缓慢偏移（流动感），
//       点径 1-2px、三色按 hash 分配、密度随距中心距离衰减。
//       单 pass 全屏 quad，GPU 并行，密度天然高、性能极好。
//
// 安全：SSG 不初始化；reduced-motion 渲一帧静态；隐藏暂停；丢失降级。
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
uniform vec2 uRes;
uniform float uTime;
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

void main() {
  // 纵横比校正
  vec2 uv = vUv;
  uv.x *= uRes.x / uRes.y;

  // 流动时间（参考站 2s ≈ 4% 像素变化）
  float t = uTime * 1.0;

  // 全 hero 覆盖（参考站实测：右侧密、左侧稀，水平条带渐变）
  vec2 center = vec2(0.5 * uRes.x / uRes.y, 0.5);
  // 水平方向：右侧稍密（参考站粒子云偏右）
  float dx = (uv.x - center.x) * 1.4;
  float dy = (uv.y - center.y) * 0.9;
  float dist = sqrt(dx * dx + dy * dy);
  float density = 1.0 - smoothstep(0.45, 1.05, dist);  // 弱梯度，全覆盖

  // 网格密度：全 hero 覆盖，方形颗粒，参考站实测约每平方厘米 30-50 个
  vec2 g = uv / mix(0.012, 0.018, 0.5);  // 中心 ~83 格/宽，边缘 ~56 格/宽
  vec2 cellId = floor(g);
  vec2 cellUv = fract(g) - 0.5;

  // 每格一个点：hash 决定点径、色系、微偏移
  float h = hash21(cellId);
  float h2 = hash21(cellId + 7.31);

  // 点径：2-4px（参考站实测方形颗粒）。注意单位：d 是 cell 内坐标（0-1 = 一个 cell），
  // 归一化点径需除以 cell 换算，否则点只有 0.01px 宽不可见
  float size = mix(0.0014, 0.0028, h) * (0.85 + 0.3 * density) / 0.015;

  // 流场偏移：domain-warped fbm 让点阵整体缓慢流动（参考站 2s ≈ 4% 像素变化）
  vec2 q = vec2(fbm(cellId * 0.6 + t * 0.8), fbm(cellId * 0.6 - t * 0.6 + 5.2));
  vec2 flow = vec2(fbm(cellId * 0.8 + q * 1.2 + t * 0.5), fbm(cellId * 0.8 - q * 1.1 - t * 0.4 + 9.1));
  // 流场偏移：幅度 ±0.4*cell（cell 内坐标，与 cellUv 同单位；点不越出 cell 边界）
  vec2 offset = (flow - 0.5) * 0.8;

  // 方形颗粒：取 cell 中心到点的最大轴向距离（max 而不是 length）
  // 配合 smoothstep 让边缘略柔（参考站是方块不是硬边）
  vec2 dd = abs(cellUv - offset);
  float d = max(dd.x, dd.y);

  // 三色系（米底适配）：深绿 / 赭红 / 米白（参考站 jingjinglearns.cc 实测）
  vec3 forest = vec3(0.176, 0.290, 0.227);  // #2d4a3a
  vec3 clay   = vec3(0.722, 0.420, 0.365);  // #b86b5d
  vec3 mist   = vec3(0.910, 0.878, 0.859);  // #e8e0db
  vec3 col = h2 < 0.5 ? forest : (h2 < 0.75 ? clay : mist);

  // 点 alpha：中心亮边缘柔。smoothstep(edge0, edge1, x) 在 x>edge1 时输出 1，
  // 点外像素 d>size 会全亮——必须取反（1.0 - smoothstep）才是「点内亮、点外 0」
  // 米底需要更高 alpha 才能看清
  float a = (1.0 - smoothstep(size * 0.7, size, d)) * (0.42 + 0.35 * density) * (0.85 + 0.15 * h);

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

    // 首帧：立即 resize 一次（可能 parent 还没布局完），再 rAF 重试一次
    resize()
    if (!needsDraw) needsDraw = true
    requestAnimationFrame(() => {
      resize()
      if (reduced) draw(47.0)
    })
    if (reduced) {
      draw(47.0)
    } else {
      loop()
    }

    // ResizeObserver：父容器尺寸变化时立即 resize（处理 SSG/hydration 时机问题）
    const parent = canvas.parentElement
    const ro = parent ? new ResizeObserver(() => {
      if (resize()) needsDraw = true
    }) : null
    if (ro && parent) ro.observe(parent)

    // 兜底：500ms 周期检测（覆盖容器已 layout 但 ResizeObserver 未触发的场景）
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

    // Dev 调试 hook：暴露内部引用以便浏览器 evaluate 强制触发（生产 tree-shake 移除）
    if (import.meta.env?.DEV) {
      window.__heroDust = { canvas, gl, prog, resize, draw, get needsDraw() { return needsDraw }, set needsDraw(v) { needsDraw = v } }
    }

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(resizeTimer)
      if (ro) ro.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('webglcontextlost', onLost)
      gl.deleteBuffer(quad)
      gl.deleteProgram(prog)
      // 注意：不调用 WEBGL_lose_context——HMR 时旧实例销毁上下文会导致
      // 新实例拿到已丢失的上下文（开发环境特有）；上下文随页面卸载自动释放
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-dust" aria-hidden="true" />
}
