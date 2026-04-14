# Resume Style Switcher

## ADDED Requirements

### Requirement: Theme Switcher UI
The resume SHALL display a style switcher in the top-right corner (near the export buttons) allowing users to switch between dark, editorial, and geometric themes in real time.

#### Scenario: Theme switcher appearance
- **WHEN** the page loads
- **THEN** a switcher control appears with three options: "精密" (dark), "杂志" (editorial), "几何" (geometric)
- **AND** the current theme is visually indicated (e.g., filled indicator)

### Requirement: Immediate Theme Switching
Switching themes SHALL update the `data-theme` attribute on the root element immediately, triggering CSS variable changes with no page reload or flash.

#### Scenario: Click to switch theme
- **WHEN** the user clicks "杂志" (editorial) button
- **THEN** the `data-theme` attribute on the root element changes to "editorial"
- **AND** all CSS variables update instantly
- **AND** the visual appearance transitions smoothly via CSS transitions

### Requirement: Theme State Persistence
The selected theme SHALL persist across page refreshes using localStorage.

#### Scenario: Theme persistence
- **WHEN** the user selects the geometric theme
- **AND** refreshes the page
- **THEN** the geometric theme is still active on reload

### Requirement: Switcher Accessibility
The theme switcher SHALL be keyboard accessible and support ARIA labels for screen readers.

#### Scenario: Keyboard navigation
- **WHEN** the user tabs to the theme switcher
- **THEN** focus is visible on the current option
- **AND** arrow keys can navigate between options
- **AND** Enter/Space activates the selected option

### Requirement: Switcher Hides in Print
The theme switcher SHALL NOT appear in print or PDF export.

#### Scenario: Print mode
- **WHEN** the user exports PDF
- **THEN** the theme switcher UI is hidden
- **AND** the currently selected theme's print styles apply
