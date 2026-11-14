import { useEffect, useRef } from 'react'

// 顶部滚动进度条（3px，赤陶→金渐变，参考 jingjinglearns.cc）
export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    // 支持滚动时间线时由 CSS 驱动，避免两条路径同时写 transform
    if (typeof CSS !== 'undefined' && CSS.supports('(animation-timeline: scroll())')) return
    let raf = 0
    const update = () => {
      raf = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const ratio = max > 0 ? doc.scrollTop / max : 0
      bar.style.transform = `scaleX(${ratio})`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={barRef} className="scroll-progress__bar" />
    </div>
  )
}
