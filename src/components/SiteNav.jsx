import { NavLink } from 'react-router-dom'

export default function SiteNav() {
  return (
    <nav className="site-nav" aria-label="站点导航">
      <NavLink to="/" className="site-nav__brand">
        侯伟轩
      </NavLink>
      <div className="site-nav__links">
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
      </div>
    </nav>
  )
}
