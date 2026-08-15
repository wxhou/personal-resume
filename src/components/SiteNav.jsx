import { NavLink, Link, useLocation } from 'react-router-dom'

const HOME_ANCHORS = [
  { href: '#projects', label: '项目' },
  { href: '#proof', label: '成果' },
  { href: '#about', label: '关于' },
  { href: '#contact', label: '联系' },
]

export default function SiteNav() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  return (
    <nav className="site-nav" aria-label="站点导航">
      {onHome ? (
        <Link to="/" className="site-nav__brand">侯伟轩</Link>
      ) : (
        <NavLink to="/" className="site-nav__brand">侯伟轩</NavLink>
      )}
      <div className="site-nav__links">
        {onHome ? (
          <>
            {HOME_ANCHORS.map(anchor => (
              <a key={anchor.href} href={anchor.href} className="site-nav__link">
                {anchor.label}
              </a>
            ))}
            <NavLink
              to="/resume"
              className={({ isActive }) => `site-nav__link${isActive ? ' site-nav__link--active' : ''}`}
            >
              简历
            </NavLink>
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
      </div>
    </nav>
  )
}
