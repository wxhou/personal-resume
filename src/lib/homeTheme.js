// 首页明暗主题：SiteNav 与 HomePage 之间的桥接常量
// SiteNav dispatch 事件 → HomePage 切换 state → 写 documentElement.dataset.theme

export const HOME_THEME_TOGGLE_EVENT = 'homepage:toggle-theme'
export const THEME_STORAGE_KEY = 'siteTheme'
