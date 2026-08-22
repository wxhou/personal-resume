import { useEffect, useLayoutEffect, useRef } from 'react'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  Mesh,
  TorusGeometry,
  MeshBasicMaterial,
  FogExp2,
  AdditiveBlending,
  NormalBlending,
} from 'three'

/**
 * HeroSphere — 三形态循环 morph 粒子系统（参考 jingjinglearns.cc 风格）
 *
 * 粒子在三种形态间循环 morph（叙事主线）：
 *   1. 散乱数据云 chaos   →   2. 结构化矩阵 matrix   →   3. 神经网络球 brain
 * 每 ~6.4s 切换（hold 4.2s + morph 2.2s 缓动），循环往复。
 *
 * 相机鼠标视差（场景随鼠标轻摆，替代 raycaster repel）。
 * 细环 TorusGeometry 缓慢自转，克制两色（sage + brass），慢节奏。
 *
 * 树摇命名导入（不要 import * as THREE）。仅客户端 useEffect 内初始化。
 */

// brass 0xC2705B，每 6 个粒子 1 个 brass（sage 见 sageColor 归一化对象）
const BRASS = 0xc2705b

// 粒子双主题参数：亮色需深化色板/加大尺寸/减弱雾以抵消米底低对比；
// 暗色 additive+提亮呈星云（浅底下 additive 会过曝不可见，故仅暗色启用）
const PALETTES = {
  light: {
    sage: { r: 0.392, g: 0.502, b: 0.361 },  // #64805C 深绿（对米底 4.1:1，原 #7E9479 仅 3.1:1）
    brass: { r: 0.627, g: 0.322, b: 0.220 }, // #A05238 深红棕（5.2:1，原 #C2705B 仅 3.4:1）
    size: 0.075, // 原 0.06 在米底上仅 2-3px 几乎不可辨
    fogDensity: 0.038, // 减弱雾洗，远处粒子不再融进米底
  },
  dark: {
    sage: { r: 0.588, g: 0.675, b: 0.565 },  // #96AC90
    brass: { r: 0.831, g: 0.537, b: 0.451 }, // #D48973
    size: 0.06,
    fogDensity: 0.05,
  },
}

// 同构安全的 layout effect（SSG 预渲染阶段退化为 useEffect，消除 SSR warning）
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function HeroSphere({ dark = false }) {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null) // fog 联动用：dark prop 变化时改雾色不重建场景
  const applyThemeRef = useRef(null) // 主题参数应用（blending/色板/尺寸/雾），由 init 注入

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noHover = window.matchMedia('(hover: none)').matches
    if (reduced) return // CSS 已 display:none，JS 也不跑

    const isMobile = window.innerWidth < 720
    const COUNT = isMobile ? 2400 : 4800 // 最大粒子数（密度上限）
    let drawCount = isMobile ? 1600 : 3200 // 默认显示数

    // ── Scene + Camera + Renderer ───────────────────────────
    const scene = new Scene()
    scene.fog = new FogExp2(0xfbf7f1, 0.05) // 淡雾融入米底
    sceneRef.current = scene

    const camera = new PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.set(0, 0, isMobile ? 16 : 12)
    camera.lookAt(0, 0, 0)

    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0)

    // ── 三种目标形态（预计算，运行时插值） ──────────────────
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
    const shapes = [makeChaos(), makeMatrix(), makeBrain()]
    const stageNames = ['原始数据', '数据工程', 'AI 产品']

    // ── 粒子系统 ─────────────────────────────────────────────
    const geo = new BufferGeometry()
    const positions = new Float32Array(shapes[0])
    geo.setAttribute('position', new BufferAttribute(positions, 3))
    geo.setDrawRange(0, drawCount)

    const colors = new Float32Array(COUNT * 3)
    // 主题参数一体应用：色板 + blending + 尺寸 + 雾密度
    const applyTheme = (isDark) => {
      const p = isDark ? PALETTES.dark : PALETTES.light
      for (let i = 0; i < COUNT; i++) {
        const c = i % 6 === 0 ? p.brass : p.sage
        colors[i * 3] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
      }
      geo.attributes.color && (geo.attributes.color.needsUpdate = true) // 颜色生效的必要条件
      if (material) {
        material.blending = isDark ? AdditiveBlending : NormalBlending
        material.size = p.size
      }
      if (scene.fog) scene.fog.density = p.fogDensity
    }
    geo.setAttribute('color', new BufferAttribute(colors, 3))

    const material = new PointsMaterial({
      size: PALETTES[dark ? 'dark' : 'light'].size,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    })
    applyTheme(dark) // init 即按当前主题初始化，防暗色访客首帧闪现亮板
    applyThemeRef.current = applyTheme
    const points = new Points(geo, material)
    scene.add(points)

    // ── 细环装饰 ─────────────────────────────────────────────
    const ringMat = new MeshBasicMaterial({ color: BRASS, transparent: true, opacity: 0.3 })
    const ring = new Mesh(new TorusGeometry(7.6, 0.015, 8, 160), ringMat)
    ring.rotation.x = Math.PI / 2.4
    scene.add(ring)

    // ── morph 调度 ───────────────────────────────────────────
    let stage = 0
    let next = 1
    let t = 0
    const HOLD = 4.2
    const MORPH = 2.2
    let phase = 'hold'
    const clockPrev = { v: performance.now() }
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = parent.clientWidth
      const h = parent.clientHeight
      if (w > 0 && h > 0) {
        renderer.setPixelRatio(dpr)
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
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
    const resizeTimer = setInterval(() => resize(), 500)

    // ── 动画循环 ─────────────────────────────────────────────
    let raf = 0

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return

      const dt = Math.min((now - clockPrev.v) / 1000, 0.05)
      clockPrev.v = now

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
      camera.position.x = mx * 1.6
      camera.position.y = -my * 1.1
      camera.lookAt(0, 0, 0)

      // 极慢自转（morph 为视觉主角）
      points.rotation.y += dt * 0.06
      ring.rotation.z += dt * 0.04

      renderer.render(scene, camera)
    }

    requestAnimationFrame((now) => {
      clockPrev.v = now
      resize()
      loop(now)
    })

    // ── webglcontextlost 兜底 ────────────────────────────────
    const onLost = (e) => {
      e.preventDefault()
      cancelAnimationFrame(raf)
    }
    canvas.addEventListener('webglcontextlost', onLost)

    // ── Dev 调试 hook ────────────────────────────────────────
    if (import.meta.env?.DEV) {
      window.__heroSphere = {
        scene,
        camera,
        renderer,
        points,
        material,
        geometry: geo,
        ring,
        stage: () => stageNames[stage],
        resize,
      }
    }

    // ── 清理 ─────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(resizeTimer)
      if (ro) ro.disconnect()
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('webglcontextlost', onLost)
      if (!noHover) {
        window.removeEventListener('pointermove', onPointerMove)
      }
      geo.dispose()
      material.dispose()
      ringMat.dispose()
      ring.geometry.dispose()
      renderer.dispose()
    }
  }, [])

  // 主题联动：暗色时雾色切暖深褐（与页面底色一致），粒子保持可见
  useEffect(() => {
    const s = sceneRef.current
    if (!s) return
    s.fog.color.set(dark ? 0x211d18 : 0xfbf7f1)
  }, [dark])

  // 星云切换（同构 layout effect：commit 后、绘制前执行，防暗色首帧闪现亮板）
  useIsomorphicLayoutEffect(() => {
    applyThemeRef.current?.(dark)
  }, [dark])

  return <canvas ref={canvasRef} className="hero-sphere" aria-hidden="true" />
}
