import { useEffect, useRef } from 'react'

// Hero 漂浮粒子背景（Canvas 2D，暖色光点，参考 jingjinglearns.cc 的氛围）
// reduced-motion / SSG 时不绘制
export default function HeroParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let particles = []

    // 暖色系光点：赤陶 / 金 / 粉 / 米白
    const COLORS = [
      'rgba(194, 112, 91, ',   // 赤陶
      'rgba(201, 162, 75, ',   // 金
      'rgba(231, 198, 187, ',  // 粉
      'rgba(126, 148, 121, ',  // 灰绿
    ]

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      const count = Math.min(48, Math.floor(canvas.width / 28))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1.5 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.1 + Math.random() * 0.35),
        alpha: 0.15 + Math.random() * 0.4,
        breathe: Math.random() * Math.PI * 2,   // 呼吸相位
        breatheSpeed: 0.005 + Math.random() * 0.01,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.breathe += p.breatheSpeed
        p.x += p.vx
        p.y += p.vy
        // 越界回绕
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.breathe))
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
        grad.addColorStop(0, p.color + a + ')')
        grad.addColorStop(1, p.color + '0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    tick()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />
}
