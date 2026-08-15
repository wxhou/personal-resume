# Resume Visual System

## ADDED Requirements

### Requirement: Theme Variable Architecture
The resume SHALL use CSS custom properties (variables) for all color, typography, and spacing values, enabling theme switching by changing the `data-theme` attribute on the root element.

#### Scenario: Theme variable覆盖
- **WHEN** the root element has `data-theme="dark"`
- **THEN** CSS variables `--bg-primary`, `--text-primary`, `--accent-color` resolve to dark theme values
- **WHEN** the root element has `data-theme="editorial"`
- **THEN** the same variables resolve to editorial theme values

### Requirement: Shared Animation System
All three themes SHALL use a shared Framer Motion animation curve (`ease: [0.22, 1, 0.36, 1]`) for page load stagger reveals, ensuring consistent motion language across themes.

#### Scenario: Stagger reveal on page load
- **WHEN** the resume page loads
- **THEN** header animates in first (opacity 0→1, y: 16→0, delay: 0s)
- **WHEN** each subsequent section reveals with 0.1s delay increments

### Requirement: Print Mode Cleanup
All decorative elements (corner marks, background art, theme switcher) SHALL be hidden in print mode via `@media print`.

#### Scenario: Clean print output
- **WHEN** the user prints or exports PDF
- **THEN** all theme-specific decorations disappear
- **THEN** the layout uses clean white background with neutral text
