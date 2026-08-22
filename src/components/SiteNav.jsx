import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { HOME_THEME_TOGGLE_EVENT } from '../lib/homeTheme.js'

const HOME_ANCHORS = [
  { href: '#projects', label: '项目' },
  { href: '#proof', label: '成果' },
  { href: '#about', label: '关于' },
  { href: '#contact', label: '联系' },
]

export default function SiteNav() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  // 主题图标状态：监听 <html> data-theme 变化（与 HomePage 解耦，经 dataset 桥接）
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || 'light')
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme || 'light')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="site-nav" aria-label="站点导航">
      {onHome ? (
        <Link to="/" className="site-nav__brand">Bigger蓝莓</Link>
      ) : (
        <NavLink to="/" className="site-nav__brand">Bigger蓝莓</NavLink>
      )}
      <div className="site-nav__links">
        {onHome ? (
          <>
            {HOME_ANCHORS.map(anchor => (
              <a key={anchor.href} href={anchor.href} className="site-nav__link">
                {anchor.label}
              </a>
            ))}
            {/* 简历入口暂时隐藏（路由已重定向回首页；恢复时补回 NavLink to="/resume"） */}
          </>
        ) : (
          <>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `site-nav__link${isActive ? ' site-nav__link--active' : ''}`}
            >
              首页
            </NavLink>
            <NavLink
              to="/resume"
              className={({ isActive }) => `site-nav__link${isActive ? ' site-nav__link--active' : ''}`}
            >
              简历
            </NavLink>
          </>
        )}
        {/* 主题切换（仅首页；暗色显示太阳=点击回亮色） */}
        {onHome && (
          <button
            type="button"
            className="site-nav__theme-toggle"
            aria-label="切换明暗主题"
            onClick={() => window.dispatchEvent(new Event(HOME_THEME_TOGGLE_EVENT))}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}
      </div>
    </nav>
  )
}
