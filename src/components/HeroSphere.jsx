import { useEffect, useLayoutEffect, useRef } from 'react'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  BufferAttribute,
  Points,
  ShaderMaterial,
  AdditiveBlending,
  NormalBlending,
  Color,
} from 'three'

/**
 * HeroSphere — 银河粒子系统（tmp/galaxy-demo.html 原型移植）
 *
 * 四形态循环 morph（叙事主线）：
 *   1. 散乱数据云 chaos   →   2. 结构化矩阵 matrix   →   3. 神经网络球 brain   →   4. 星河 galaxy
 * 初始停在星河（首屏即银河），hold 4.2s + morph 2.2s 缓动，循环往复。
 *
 * 渲染：ShaderMaterial（软圆核 + 幂律亮度 seed^3.5 + twinkle + 亮星十字光芒）
 * + 径向色温（银心暖 → 外缘冷）+ 远景星场（r26-40 球壳，深度视差的「远」）。
 * 亮色主题 normal blending（米底墨色星图）；暗色 additive 星云，spike 仅暗色。
 *
 * 树摇命名导入（不要 import * as THREE）。仅客户端 useEffect 内初始化。
 */

const RADIUS = 7.5 // 银河半径（世界单位）
const GALAXY_INDEX = 3 // shapes 中星河的下标 = 初始展示形态

// 双主题银河：色温插值两端（inside=银心，outside=旋臂外缘）+ 远景星
// 暗色 additive 星云（软核光晕叠加发光）；亮色「墨色星图」——纸上天文图：
// 墨点半透明（~0.5），重叠处 alpha 叠压自然变浓——银心密度靠墨的叠压编码，
// 与暗色的发光叠加（additive）互为对偶物理。实心不透明墨点会把密度信
// 息抹平（纸上看不出旋臂），这是亮色「没有暗色好看」的根因。
// 亮色沿用暗色的软光晕渲染会读作「纸面污渍」——发光模型只属于暗底
const PALETTES = {
  light: {
    inside: new Color(0x2e343c),  // 银心 冷墨（青石深墨：与暗色冷底同族，托起暖纸冷墨的反差）
    outside: new Color(0x76828c), // 旋臂外 青墨（越远越淡，铜版画褪色感）
    star: new Color(0x5a6572),    // 远景星 石墨灰（冷，与银河同族）
    accent: new Color(0xa05238),  // 亮星 手染赭红（暖纸冷墨里的唯一暖，视觉焦点同族）
    additive: false,
    opacity: 0.72,  // 半透明墨：重叠压深，密度=浓度（低 alpha + 墨晕靠叠压出层次）
    pointScale: 1.2,
    coreExp: 1.9,   // 实心偏软的核：叠压更均匀
    halo: 0.18,     // 墨晕（洇开的边缘；0.22+ 在银心外的高密度点会读作污渍，实测收敛）
    sizeFloor: 3.4, // 暗星下限抬一档，旋臂疏密可读
    twinkle: 0.55,  // 闪烁幅度收敛（纸面闪烁读作噪点抖动）
    accentMix: 1,
  },
  dark: {
    inside: new Color(0xc8806d),  // 银心 赭红（与新 accent #CE8574 同族）
    outside: new Color(0x80929d), // 旋臂外 冷青灰
    star: new Color(0xa9b4c4),    // 远景星 冷白
    accent: new Color(0xc8806d),
    additive: true,
    opacity: 0.72,
    pointScale: 1.15,
    coreExp: 3.0,
    halo: 0.35,
    sizeFloor: 1.4,
    twinkle: 1,
    accentMix: 0,
  },
}

// 同构安全的 layout effect（SSG 预渲染阶段退化为 useEffect，消除 SSR warning）
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Box-Muller 高斯随机（银心密度 / 尘埃散布用）
function gauss() {
  return Math.sqrt(-2 * Math.log(Math.random() || 1e-9)) * Math.cos(Math.PI * 2 * Math.random())
}

export default function HeroSphere({ dark = false }) {
  const canvasRef = useRef(null)
  const applyThemeRef = useRef(null) // 主题参数应用（blending/色板/spike），由 init 注入

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noHover = window.matchMedia('(hover: none)').matches
    if (reduced) return // CSS 已 display:none，JS 也不跑

    const isMobile = window.innerWidth < 720
    const COUNT = isMobile ? 2400 : 4800 // 最大粒子数（密度上限）
    const drawCount = isMobile ? 1600 : 3200 // 默认显示数

    // ── Scene + Camera + Renderer ───────────────────────────
    const scene = new Scene()

    // 银盘视角：相机抬升 + 俯角，站低处仰望银盘（demo 验证构图）
    const camera = new PerspectiveCamera(58, 1, 0.1, 120)
    camera.position.set(0, 2.2, isMobile ? 17 : 11.5)
    camera.lookAt(0, 0, 0)

    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0)

    // ── 四种目标形态（预计算，运行时插值） ──────────────────
    const makeChaos = () => {
      // 散乱数据云（起点：原始数据）
      const arr = new Float32Array(COUNT * 3)
      for (let i = 0; i < COUNT; i++) {
        arr[i * 3] = (Math.random() - 0.5) * 22
        arr[i * 3 + 1] = (Math.random() - 0.5) * 14
        arr[i * 3 + 2] = (Math.random() - 0.5) * 14
      }
      return arr
    }
    const makeMatrix = () => {
      // 结构化矩阵（数据工程：让数据有序）
      const arr = new Float32Array(COUNT * 3)
      const cols = Math.ceil(Math.sqrt(COUNT * 1.6))
      const rows = Math.ceil(COUNT / cols)
      let i = 0
      for (let r = 0; r < rows && i < COUNT; r++) {
        for (let c = 0; c < cols && i < COUNT; c++) {
          arr[i * 3] = (c / cols - 0.5) * 20
          arr[i * 3 + 1] = (r / rows - 0.5) * 11
          arr[i * 3 + 2] = Math.sin(c * 0.5) * Math.cos(r * 0.5) * 1.2
          i++
        }
      }
      return arr
    }
    const makeBrain = () => {
      // 神经网络球（AI 产品：让数据思考）—— 双层球面
      const arr = new Float32Array(COUNT * 3)
      for (let i = 0; i < COUNT; i++) {
        const r = i % 4 === 0 ? 6.4 : 4.6
        const t = Math.acos(2 * Math.random() - 1)
        const p = Math.random() * Math.PI * 2
        arr[i * 3] = r * Math.sin(t) * Math.cos(p)
        arr[i * 3 + 1] = r * Math.sin(t) * Math.sin(p) * 0.86
        arr[i * 3 + 2] = r * Math.cos(t)
      }
      return arr
    }
    const makeGalaxy = () => {
      // 对数螺旋银河：中心高斯聚拢 + 4 旋臂 + 尘埃带散布
      const arr = new Float32Array(COUNT * 3)
      const ARMS = 4
      for (let i = 0; i < COUNT; i++) {
        const r = Math.pow(Math.random(), 2.2) * RADIUS
        const arm = ((i % ARMS) / ARMS) * Math.PI * 2
        const spin = r * 0.85
        const spread = (Math.random() - 0.5) ** 3 * (r + 0.3) * 0.5 + gauss() * 0.35
        const theta = arm + spin + spread * 0.6
        arr[i * 3] = Math.cos(theta) * r + gauss() * 0.4
        arr[i * 3 + 1] = gauss() * 0.5 * (1 - r / RADIUS) // 银盘薄：越靠外缘越扁
        arr[i * 3 + 2] = Math.sin(theta) * r + gauss() * 0.4
      }
      return arr
    }
    const shapes = [makeChaos(), makeMatrix(), makeBrain(), makeGalaxy()]
    const stageNames = ['原始数据', '数据工程', 'AI 产品', '星河']

    // 每星随机种子（幂律亮度 + twinkle 相位）+ 色温 t（0=银心暖 → 1=外缘冷，按星河半径标定；
    // 其余形态沿用此映射，warm/cool 随机混色已在 demo 验证）
    const seeds = new Float32Array(COUNT)
    const temps = new Float32Array(COUNT)
    const galaxy = shapes[GALAXY_INDEX]
    for (let i = 0; i < COUNT; i++) {
      seeds[i] = Math.random()
      const r = Math.hypot(galaxy[i * 3], galaxy[i * 3 + 2]) / RADIUS
      temps[i] = Math.min(r + gauss() * 0.08, 1)
    }

    // ── 主 Points：ShaderMaterial（圆软核 + 幂律 size + twinkle + spike）──
    const geo = new BufferGeometry()
    // 初始位置 = 星河形态（stage 初值 GALAXY_INDEX，首屏即银河）
    const positions = new Float32Array(shapes[GALAXY_INDEX])
    geo.setAttribute('position', new BufferAttribute(positions, 3))
    geo.setAttribute('aSeed', new BufferAttribute(seeds, 1))
    geo.setAttribute('aTemp', new BufferAttribute(temps, 1))
    geo.setDrawRange(0, drawCount)

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const uniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
      uScale: { value: window.innerHeight * 0.5 },
      uInside: { value: new Color() },
      uOutside: { value: new Color() },
      uOpacity: { value: 0.92 },
      uPointScale: { value: 1 },
      uCoreExp: { value: 3.0 },
      uHalo: { value: 0.35 },
      uSizeFloor: { value: 1.4 },
      uTwinkleAmp: { value: 1 },
      uAccent: { value: new Color() },
      uAccentMix: { value: 0 },
      uSpike: { value: 0 },
      uTwinkle: { value: 1 },
    }

    const material = new ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
      vertexShader: /* glsl */ `
        attribute float aSeed;
        attribute float aTemp;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uScale;
        uniform float uPointScale;
        uniform float uSizeFloor;
        uniform float uTwinkle;
        uniform float uTwinkleAmp;
        varying float vBright;
        varying float vTemp;
        varying float vTwinkle;
        varying float vIsBright;

        // 幂律亮度：seed^k → 少数极亮、多数极暗
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          vBright = pow(aSeed, 3.5);           // 幂律分布核心
          vTemp = aTemp;
          vTwinkle = 0.75 + uTwinkleAmp * 0.25 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 17.0);
          vIsBright = step(0.965, aSeed);      // 前 3.5% 是亮星
          float tw = mix(1.0, vTwinkle, uTwinkle);
          float base = uSizeFloor + vBright * 22.0;
          gl_PointSize = base * uPointScale * tw * uScale * uPixelRatio * 0.01 / max(-mvPosition.z, 0.1);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uInside;
        uniform vec3 uOutside;
        uniform vec3 uAccent;
        uniform float uAccentMix;
        uniform float uOpacity;
        uniform float uCoreExp;
        uniform float uHalo;
        uniform float uSpike;
        uniform float uTwinkle;
        varying float vBright;
        varying float vTemp;
        varying float vTwinkle;
        varying float vIsBright;

        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          // 软圆核：coreExp 衰减（暗色 3.0=光晕 / 亮色 1.6=实心墨点）+ 高斯光晕
          float core = pow(max(0.0, 1.0 - d), uCoreExp) + exp(-d * d * 6.0) * uHalo;
          // diffraction spike：仅亮星（十字光芒），仅暗色主题（亮色下是纯噪）
          float spike = 0.0;
          if (vIsBright > 0.5 && uSpike > 0.5) {
            spike = (exp(-abs(gl_PointCoord.x - 0.5) * 26.0) + exp(-abs(gl_PointCoord.y - 0.5) * 26.0))
                  * exp(-d * 3.0) * 0.7;
          }
          // 亮色星图：accent 染色曲线压平（pow 0.6）——中亮星也吃到赭红，强染色族群约翻倍，
          // 构成亮色独有的「手染亮星」焦点；暗色 accentMix=0 天然隔离。spike 阈值独立（仅暗色）
          vec3 col = mix(uInside, uOutside, vTemp);
          col = mix(col, uAccent, uAccentMix * pow(vBright, 0.6));
          float alpha = uOpacity * (core + spike) * mix(1.0, vTwinkle, uTwinkle * 0.6);
          gl_FragColor = vec4(col, alpha);
          #include <colorspace_fragment>
        }
      `,
    })

    // 主题参数一体应用：色板 + blending + 亮度/spike（星场联动）
    const applyTheme = (isDark) => {
      const p = isDark ? PALETTES.dark : PALETTES.light
      if (material) {
        material.blending = p.additive ? AdditiveBlending : NormalBlending
        material.needsUpdate = true
      }
      if (uniforms) {
        uniforms.uInside.value.copy(p.inside)
        uniforms.uOutside.value.copy(p.outside)
        uniforms.uOpacity.value = p.opacity
        uniforms.uPointScale.value = p.pointScale
        uniforms.uCoreExp.value = p.coreExp
        uniforms.uHalo.value = p.halo
        uniforms.uSizeFloor.value = p.sizeFloor
        uniforms.uTwinkleAmp.value = p.twinkle
        uniforms.uAccent.value.copy(p.accent)
        uniforms.uAccentMix.value = p.accentMix
        uniforms.uSpike.value = isDark ? 1 : 0
      }
      if (starMat) {
        starMat.blending = p.additive ? AdditiveBlending : NormalBlending
        starMat.needsUpdate = true
        starUniforms.uColor.value.copy(p.star)
        // 亮色星场必须比主星系淡一档：纸上深色实点会抢成均匀噪点场，
        // 把银河带的疏密结构整个淹没（同帧暗/亮对照实测）
        starUniforms.uOpacity.value = isDark ? 0.55 : 0.5
        starUniforms.uSizeFloor.value = isDark ? 0.8 : 1.2
      }
    }

    const points = new Points(geo, material)
    points.rotation.x = 0.42 // 银盘视角倾斜
    points.frustumCulled = false // morph 中包围球失效，禁用剔除
    scene.add(points)

    // ── 远景星场：静态球壳（深度视差的「远」）────────────────
    const STAR_COUNT = isMobile ? 500 : 900
    const starGeo = new BufferGeometry()
    const starPos = new Float32Array(STAR_COUNT * 3)
    const starSeed = new Float32Array(STAR_COUNT)
    for (let i = 0; i < STAR_COUNT; i++) {
      // 远球壳（r 26-40），避免与银盘重叠
      const rr = 26 + Math.random() * 14
      const t = Math.acos(2 * Math.random() - 1)
      const ph = Math.random() * Math.PI * 2
      starPos[i * 3] = rr * Math.sin(t) * Math.cos(ph)
      starPos[i * 3 + 1] = rr * Math.sin(t) * Math.sin(ph)
      starPos[i * 3 + 2] = rr * Math.cos(t)
      starSeed[i] = Math.random()
    }
    starGeo.setAttribute('position', new BufferAttribute(starPos, 3))
    starGeo.setAttribute('aSeed', new BufferAttribute(starSeed, 1))

    const starUniforms = {
      uTime: uniforms.uTime, // 共享引用：主循环只更新一次
      uPixelRatio: uniforms.uPixelRatio,
      uScale: uniforms.uScale,
      uTwinkle: uniforms.uTwinkle,
      uColor: { value: new Color() },
      uOpacity: { value: 0.55 },
      uSizeFloor: { value: 0.8 },
    }
    const starMat = new ShaderMaterial({
      uniforms: starUniforms,
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
      vertexShader: /* glsl */ `
        attribute float aSeed;
        uniform float uTime, uPixelRatio, uScale, uTwinkle, uSizeFloor;
        varying float vA;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float b = pow(aSeed, 2.2);
          vA = 0.5 + 0.5 * sin(uTime * (0.6 + aSeed) + aSeed * 29.0);
          float tw = mix(1.0, 0.7 + 0.3 * vA, uTwinkle);
          gl_PointSize = (uSizeFloor + b * 5.0) * tw * uScale * uPixelRatio * 0.008 / max(-mv.z, 0.1);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying float vA;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float core = pow(max(0.0, 1.0 - d), 2.5);
          gl_FragColor = vec4(uColor, uOpacity * core);
          #include <colorspace_fragment>
        }
      `,
    })
    const starField = new Points(starGeo, starMat)
    starField.frustumCulled = false
    scene.add(starField)

    applyTheme(dark) // init 即按当前主题初始化，防暗色访客首帧闪现亮板
    applyThemeRef.current = applyTheme

    // ── morph 调度（初始停在星河，随后进入四形态循环） ───────
    let stage = GALAXY_INDEX
    let next = (GALAXY_INDEX + 1) % shapes.length
    let t = 0
    const HOLD = 4.2
    const MORPH = 2.2
    let phase = 'hold'
    const clockPrev = { v: performance.now() }
    let elapsed = 0 // 累计时长驱动 twinkle（暂停不累积，恢复无跳变）
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

    // ── 相机鼠标视差 ─────────────────────────────────────────
    let mx = 0
    let my = 0
    let tx = 0
    let ty = 0
    const onPointerMove = (e) => {
      tx = e.clientX / window.innerWidth - 0.5
      ty = e.clientY / window.innerHeight - 0.5
    }
    if (!noHover) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    // ── Resize ───────────────────────────────────────────────
    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const d = Math.min(window.devicePixelRatio || 1, 2)
      const w = parent.clientWidth
      const h = parent.clientHeight
      if (w > 0 && h > 0) {
        renderer.setPixelRatio(d)
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        uniforms.uPixelRatio.value = d
        uniforms.uScale.value = h * 0.5
        return true
      }
      return false
    }
    resize()

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    const parent = canvas.parentElement
    const ro = parent ? new ResizeObserver(() => resize()) : null
    if (ro && parent) ro.observe(parent)

    // ── 动画循环（启停由 IO / visibilitychange / contextlost/restored 三源驱动）──
    let raf = 0
    let running = false
    let inViewport = true
    let contextLost = false

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return

      const dt = Math.min((now - clockPrev.v) / 1000, 0.05)
      clockPrev.v = now
      elapsed += dt
      uniforms.uTime.value = elapsed

      // morph 状态机
      t += dt
      if (phase === 'hold' && t > HOLD) {
        phase = 'morph'
        t = 0
      }
      if (phase === 'morph') {
        const k = ease(Math.min(t / MORPH, 1))
        const from = shapes[stage]
        const to = shapes[next]
        const pos = geo.attributes.position.array
        for (let i = 0; i < pos.length; i++) {
          pos[i] = from[i] + (to[i] - from[i]) * k
        }
        geo.attributes.position.needsUpdate = true
        if (t >= MORPH) {
          phase = 'hold'
          t = 0
          stage = next
          next = (next + 1) % shapes.length
        }
      }

      // 相机视差（场景随鼠标轻摆）
      mx += (tx - mx) * 0.04
      my += (ty - my) * 0.04
      camera.position.x = mx * 2.2
      camera.position.y = 2.2 - my * 1.4
      camera.lookAt(0, 0, 0)

      // 极慢自转（morph 为视觉主角）
      points.rotation.y += dt * 0.036       // 银盘极慢自转
      starField.rotation.y -= dt * 0.0072   // 远景反向缓移

      renderer.render(scene, camera)
    }

    // 启停控制：resume 时重置时钟基线，防止暂停期累积出 dt 跳变
    const pause = () => {
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      running = false
    }
    const ensureRunning = () => {
      if (running || !inViewport || document.hidden || contextLost) return
      clockPrev.v = performance.now()
      raf = requestAnimationFrame(loop)
      running = true
    }

    // hero 画布离屏（200px 缓冲防快速滚动闪烁）即停渲染
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting
        inViewport ? ensureRunning() : pause()
      },
      { rootMargin: '200px', threshold: 0 }
    )
    if (parent) io.observe(parent)

    const onVisibility = () => {
      document.hidden ? pause() : ensureRunning()
    }
    document.addEventListener('visibilitychange', onVisibility)

    resize()
    ensureRunning()

    // ── webglcontextlost/restored：丢失安全停止，恢复自动重启 ──
    const onLost = (e) => {
      e.preventDefault()
      contextLost = true
      pause()
    }
    const onRestored = () => {
      contextLost = false
      ensureRunning()
    }
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)

    // ── Dev 调试 hook ────────────────────────────────────────
    if (import.meta.env?.DEV) {
      window.__heroSphere = {
        scene,
        camera,
        renderer,
        points,
        material,
        geometry: geo,
        starField,
        stage: () => stageNames[stage],
        resize,
      }
    }

    // ── 清理 ─────────────────────────────────────────────────
    return () => {
      pause()
      if (ro) ro.disconnect()
      if (parent) io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      if (!noHover) {
        window.removeEventListener('pointermove', onPointerMove)
      }
      geo.dispose()
      material.dispose()
      starGeo.dispose()
      starMat.dispose()
      renderer.dispose()
    }
    // dark 刻意不进依赖：WebGL scene/geometry/material 只建一次，重跑会泄漏；
    // 主题切换由下方 layout effect 经 applyThemeRef 命令式应用
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 星云切换（同构 layout effect：commit 后、绘制前执行，防暗色首帧闪现亮板；
  // 色板参数经由 applyThemeRef 命令式应用，dark 是这个 effect 唯一触发源）
  useIsomorphicLayoutEffect(() => {
    applyThemeRef.current?.(dark)
  }, [dark])

  return <canvas ref={canvasRef} className="hero-sphere" aria-hidden="true" />
}
