# Resume Editorial Style

## ADDED Requirements

### Requirement: Editorial Warm Palette
The editorial theme SHALL use warm cream/off-white backgrounds with deep charcoal text and a single vermillion accent, creating a high-end magazine spread aesthetic.

### Requirement: Editorial Color Variables
The editorial theme SHALL define the following CSS variables:
- `--bg-primary`: #F9F7F4
- `--bg-surface`: #F5F2ED
- `--text-primary`: #1C1917
- `--text-secondary`: #57534E
- `--text-muted`: #A8A29E
- `--accent`: #DC2626
- `--accent-subtle`: rgba(220, 38, 38, 0.08)
- `--border`: rgba(28, 25, 23, 0.1)
- `--rule`: rgba(28, 25, 23, 0.12)

### Requirement: Editorial Typography System
The editorial theme SHALL use:
- Display: Playfair Display 400/600 for name and section headings
- Body: Cormorant Garamond 400/500 for descriptions and content
- UI: Outfit 300/400 for labels, tags, and metadata

#### Scenario: Large display name treatment
- **WHEN** the name renders under editorial theme
- **THEN** it uses Playfair Display 700 at text-4xl with tight letter-spacing
- **AND** the title appears below in small caps style with 0.2em letter-spacing

### Requirement: Editorial Section Labels
Section labels SHALL use uppercase Outfit with 0.2em letter-spacing, followed by a horizontal rule that extends to the right edge.

### Requirement: Editorial Avatar
The avatar SHALL be:
- A circle with a decorative outer ring (1.5px border)
- Inner monogram using Playfair Display serif
- Warm gradient background (#E8DFD0 to #D4C9B8)

### Requirement: Editorial Project Layout
Project cards SHALL have:
- Project name as large Playfair Display text (text-base)
- Description in smaller Cormorant Garamond italic
- Details as small text with em-dash prefix
- No card borders — sections separated by fine horizontal rules

### Requirement: Editorial Skill Tags
Skill tags SHALL be plain text without border or background, styled as typography elements that contribute to the overall layout rhythm.

### Requirement: Editorial Print Adaptation
The editorial theme print mode SHALL render:
- Pure white (#FFFFFF) background
- All serif typography preserved
- Fine rules preserved at 0.5px weight
