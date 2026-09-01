import { useEffect, useRef, useCallback } from 'react'

/**
 * FxCursor — 三层自定义光标（参考 jingjinglearns.cc）
 *
 * 1) .fx-dot   — 7px 赭红实心圆点，精确定位，z-10001
 * 2) .fx-ring  — 34px 空心圆环，弹性跟随 + hover 充盈，z-10000
 * 3) .fx-canvas — 全屏 Canvas 2D 粒子拖尾，z-9999
 *
 * 所有层 pointer-events: none；原生 cursor 在 hover 设备上隐藏。
 * prefers-reduced-motion → 全部 display: none。
 */

// ── 拖尾粒子池 ──────────────────────────────────────────────
const MAX_POINTS = 60
const TRAIL_RADIUS = 4
const TRAIL_DECAY = 0.06 // 每帧 alpha 衰减量

// 点击迸发（参考站 fx 同款）：每次点击 ~10 个粒子向外飞散
const BURST_COUNT = 10
const BURST_DECAY = 0.03
const BURST_FRICTION = 0.92

export default function FxCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const canvasRef = useRef(null)
  const pointsRef = useRef([])
  const burstsRef = useRef([]) // { x, y, vx, vy, a }
  const rafRef = useRef(0)
  const posRef = useRef({ x: 0, y: 0 })
  const visibleRef = useRef(false)
  const hotRef = useRef(false)
  const lastActiveRef = useRef(0)
  const ensureRef = useRef(null) // 事件层调用：恢复动画循环

  // ── Canvas 2D 拖尾绘制 ──────────────────────────────────
  const drawTrail = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width
    const h = canvas.height
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    ctx.clearRect(0, 0, w, h)

    const points = pointsRef.current
    // 赭红色 —— 与项目 --accent / --clay 对齐
    const r = 184, g = 107, b = 93 // #B86B5D

    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      if (p.a <= 0) continue
      ctx.beginPath()
      ctx.arc(p.x * dpr, p.y * dpr, TRAIL_RADIUS * dpr, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`
      ctx.fill()
    }

    // 迸发粒子（同色，略小）
    const bursts = burstsRef.current
    for (let i = 0; i < bursts.length; i++) {
      const p = bursts[i]
      if (p.a <= 0) continue
      ctx.beginPath()
      ctx.arc(p.x * dpr, p.y * dpr, 2.5 * dpr, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`
      ctx.fill()
    }
  }, [])

  // ── 动画循环：衰减粒子 + 更新 ring ───────────────────────
  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const canvas = canvasRef.current
    if (!dot || !ring || !canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return // CSS 已经 display:none，JS 也不跑

    // Canvas 尺寸同步
    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }
    resize()
    window.addEventListener('resize', resize)

    // ── ring 平滑跟随 ────────────────────────────────────
    let ringX = 0, ringY = 0
    const RING_LERP = 0.15 // 越小越有弹性延迟

    // 空闲停帧：指针静默 >200ms 且无存活粒子 → 停 RAF（pointermove/click 重启）
    const pause = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
    }
    const ensureRunning = () => {
      if (rafRef.current) return
      lastActiveRef.current = performance.now()
      rafRef.current = requestAnimationFrame(loop)
    }
    ensureRef.current = ensureRunning

    const loop = (now) => {
      rafRef.current = requestAnimationFrame(loop)
      if (document.hidden) return

      if (now - lastActiveRef.current > 200 && pointsRef.current.length === 0 && burstsRef.current.length === 0) {
        pause()
        drawTrail() // 停帧前清屏
        return
      }

      // 衰减粒子
      const pts = pointsRef.current
      for (let i = pts.length - 1; i >= 0; i--) {
        pts[i].a -= TRAIL_DECAY
        if (pts[i].a <= 0) pts.splice(i, 1)
      }

      // 迸发粒子：位移 + 摩擦 + 衰减
      const bursts = burstsRef.current
      for (let i = bursts.length - 1; i >= 0; i--) {
        const p = bursts[i]
        p.x += p.vx
        p.y += p.vy
        p.vx *= BURST_FRICTION
        p.vy *= BURST_FRICTION
        p.a -= BURST_DECAY
        if (p.a <= 0) bursts.splice(i, 1)
      }
      drawTrail()

      // ring 弹性跟随
      const { x, y } = posRef.current
      ringX += (x - ringX) * RING_LERP
      ringY += (y - ringY) * RING_LERP
      ring.style.transform = `translate(${ringX - 17}px, ${ringY - 17}px)`
    }
    ensureRunning()

    return () => {
      pause()
      ensureRef.current = null
      window.removeEventListener('resize', resize)
    }
  }, [drawTrail])

  // ── 指针事件 ──────────────────────────────────────────────
  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const canvas = canvasRef.current
    if (!dot || !ring || !canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const onMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      posRef.current = { x, y }
      lastActiveRef.current = performance.now()
      ensureRef.current?.()

      // dot 硬跟随
      dot.style.transform = `translate(${x - 3.5}px, ${y - 3.5}px)`

      // 显示
      if (!visibleRef.current) {
        visibleRef.current = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }

      // 粒子拖尾
      pointsRef.current.push({ x, y, a: 0.45 })
      if (pointsRef.current.length > MAX_POINTS) {
        pointsRef.current.splice(0, pointsRef.current.length - MAX_POINTS)
      }

      // hover 检测：链接/按钮
      const target = e.target
      const isHot = target.closest('a, button, [role="button"], [tabindex]:not([tabindex="-1"])')
      if (isHot && !hotRef.current) {
        hotRef.current = true
        ring.classList.add('hot')
      } else if (!isHot && hotRef.current) {
        hotRef.current = false
        ring.classList.remove('hot')
      }
    }

    const onLeave = () => {
      visibleRef.current = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
      pointsRef.current.length = 0
    }

    const onEnter = () => {
      visibleRef.current = true
      dot.style.opacity = '1'
      ring.style.opacity = '1'
      lastActiveRef.current = performance.now()
      ensureRef.current?.()
    }

    // 点击迸发：~10 个 accent 色粒子从点击点向外飞散
    const onClick = (e) => {
      lastActiveRef.current = performance.now()
      ensureRef.current?.()
      const bursts = burstsRef.current
      for (let i = 0; i < BURST_COUNT; i++) {
        const ang = Math.random() * Math.PI * 2
        const sp = 1.5 + Math.random() * 2.5
        bursts.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          a: 0.9,
        })
      }
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <>
      {/* 内点：7px 赭红实心，精确定位 */}
      <div ref={dotRef} className="fx-dot" aria-hidden="true" />
      {/* 外环：34px 空心圆，弹性跟随 */}
      <div ref={ringRef} className="fx-ring" aria-hidden="true" />
      {/* 拖尾画布：全屏 2D 粒子 */}
      <canvas ref={canvasRef} className="fx-canvas" aria-hidden="true" />
    </>
  )
}