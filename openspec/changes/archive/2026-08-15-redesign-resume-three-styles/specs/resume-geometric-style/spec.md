# Resume Geometric Style

## ADDED Requirements

### Requirement: Geometric Clean Palette
The geometric theme SHALL use pure white background with deep navy text and a structural blue accent, creating a refined architectural aesthetic.

### Requirement: Geometric Color Variables
The geometric theme SHALL define the following CSS variables:
- `--bg-primary`: #FFFFFF
- `--bg-surface`: #F8FAFC
- `--text-primary`: #0F172A
- `--text-secondary`: #475569
- `--text-muted`: #94A3B8
- `--accent`: #1E3A5F
- `--accent-line`: #CBD5E1
- `--border`: rgba(15, 23, 42, 0.08)
- `--diagonal`: rgba(30, 58, 95, 0.06)

### Requirement: Geometric Typography System
The geometric theme SHALL use:
- Display: Space Grotesk 700 for name and headings
- Body: DM Sans 400 for content
- Mono: Space Mono for skill tags and code elements

### Requirement: Geometric SVG Background
The geometric theme SHALL include abstract SVG decorative elements:
- Diagonal lines cutting across the page background
- Small circle/dot accents in corners
- A subtle grid pattern overlay

#### Scenario: Geometric background decoration
- **WHEN** the resume renders under geometric theme
- **THEN** SVG diagonal lines appear in the background at low opacity (0.04)
- **AND** a fine grid pattern (20px cells) overlays the background

### Requirement: Geometric Avatar
The avatar SHALL be:
- Hexagonal shape using CSS clip-path
- Deep navy background
- White monogram in Space Grotesk
- Outer geometric frame (rotated square border)

### Requirement: Geometric Project Card
Project cards SHALL have:
- Project index number (01, 02, 03) as large decorative element in muted tone
- Clean DM Sans typography
- Subtle left border (2px, accent color) as indicator

### Requirement: Geometric Skill Tags
Skill tags SHALL be rendered as:
- Rectangular pills with 0px border-radius
- 1px border in `--accent-line` color
- Space Mono font
- Simple grid arrangement (2-3 per row)

### Requirement: Geometric Timeline
The experience timeline SHALL use:
- Vertical line with geometric node markers (small squares, not circles)
- Active role node filled with accent color
- Company name and role title in Space Grotesk
