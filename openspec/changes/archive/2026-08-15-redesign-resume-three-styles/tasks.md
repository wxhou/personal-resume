## 1. Theme Architecture Setup

- [x] 1.1 Refactor `src/index.css` — define CSS custom properties for all three themes using `:root[data-theme="..."]` selectors
- [x] 1.2 Update `tailwind.config.js` — add theme-specific color tokens that reference CSS variables
- [x] 1.3 Add Google Fonts imports for all three themes: Outfit, Inter, JetBrains Mono (dark); Playfair Display, Cormorant Garamond, Outfit (editorial); Space Grotesk, DM Sans, Space Mono (geometric)
- [x] 1.4 Create `src/theme-variables.css` — central file defining all three theme variable sets (included in index.css)

## 2. Dark Precision Theme Implementation

- [x] 2.1 Implement dark theme CSS variables (bg-primary #09090B, text-primary #FAFAFA, accent #F59E0B)
- [x] 2.2 Restyle header: left-aligned layout, Outfit font for name, square avatar with thin ring on right
- [x] 2.3 Restyle project cards: left amber vertical line indicator, no card background
- [x] 2.4 Restyle skill tags: monospace font, subtle border, amber glow on hover
- [x] 2.5 Restyle timeline: hollow dots for past roles, filled amber dot for active
- [x] 2.6 Add subtle background noise texture for dark theme

## 3. Editorial Magazine Theme Implementation

- [x] 3.1 Implement editorial theme CSS variables (bg-primary #F9F7F4, text-primary #1C1917, accent #DC2626)
- [x] 3.2 Restyle header: large Playfair Display name, italic salary, decorative monogram avatar
- [x] 3.3 Restyle section labels: uppercase Outfit with trailing horizontal rule
- [x] 3.4 Restyle project cards: large serif name, italic description, no card borders
- [x] 3.5 Restyle skill tags: plain text typography, no borders or backgrounds
- [x] 3.6 Add paper texture overlay for editorial warmth

## 4. Geometric Art Theme Implementation

- [x] 4.1 Implement geometric theme CSS variables (bg-primary #FFFFFF, text-primary #0F172A, accent #1E3A5F)
- [x] 4.2 Restyle header: Space Grotesk font, hexagonal avatar with outer frame
- [x] 4.3 Add SVG diagonal line decorations to background
- [x] 4.4 Add subtle grid pattern overlay
- [x] 4.5 Restyle project cards: index numbers (01, 02...) as decorative element, left accent border
- [x] 4.6 Restyle skill tags: rectangular pills, Space Mono font, grid layout (no hexagons)
- [x] 4.7 Restyle timeline: square node markers instead of circles

## 5. Theme Switcher Component

- [x] 5.1 Create `StyleSwitcher` React component with three toggle buttons
- [x] 5.2 Implement theme state management via React useState on root App element
- [x] 5.3 Add localStorage persistence for selected theme
- [x] 5.4 Apply `data-theme` attribute to root element on switch
- [x] 5.5 Add keyboard accessibility (Tab, Arrow keys, Enter/Space)
- [x] 5.6 Add ARIA labels for screen reader support
- [x] 5.7 Ensure switcher hides in print mode (@media print)

## 6. Export and Print Integration

- [x] 6.1 Ensure export PDF uses currently selected theme's appearance
- [x] 6.2 Ensure export image captures correct theme
- [x] 6.3 Add `@media print` rules for clean output across all themes
- [ ] 6.4 Verify print preview looks correct in browser DevTools

## 7. Build and Deploy

- [x] 7.1 Run `npm run build` — verify no build errors
- [ ] 7.2 Commit all changes with descriptive message
- [ ] 7.3 Push to GitHub — verify CI deploys to GitHub Pages
- [ ] 7.4 Verify all three themes render correctly on live site
