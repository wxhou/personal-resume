# Resume Dark Style

## ADDED Requirements

### Requirement: Dark Precision Palette
The dark theme SHALL use a near-black background with high-contrast text and a single amber accent color, creating a Linear/Vercel-inspired precision aesthetic.

### Requirement: Dark Theme Color Variables
The dark theme SHALL define the following CSS variables:
- `--bg-primary`: #09090B
- `--bg-surface`: #18181B
- `--bg-elevated`: #27272A
- `--text-primary`: #FAFAFA
- `--text-secondary`: #A1A1AA
- `--text-muted`: #71717A
- `--accent`: #F59E0B
- `--accent-subtle`: rgba(245, 158, 11, 0.1)
- `--border`: rgba(255, 255, 255, 0.06)
- `--border-hover`: rgba(255, 255, 255, 0.12)

### Requirement: Dark Typography System
The dark theme SHALL use:
- Display: Outfit 700 for name/headings
- Body: Inter 300/400 for content
- Mono: JetBrains Mono for skill tags and metadata

#### Scenario: Skill tag appearance in dark theme
- **WHEN** a skill tag renders under dark theme
- **THEN** it displays with a 1px border in `--border` color
- **WHEN** the user hovers over the skill tag
- **THEN** a subtle amber glow appears via box-shadow

### Requirement: Dark Header Design
The header SHALL feature:
- Left-aligned name in large Outfit 700 (text-3xl), with name and title on the left
- Square avatar with thin border ring (not rounded) on the right
- Title and salary below name in muted tones
- Contact row as a horizontal flex with monospace-styled links

### Requirement: Dark Project Card
The project card SHALL have:
- No card background or shadow
- Left-side thin vertical amber line indicator (2px wide, 40px tall)
- Project name in bold Outfit
- Description in muted Inter 300
- Detail items with em-dash prefix

### Requirement: Dark Timeline
The experience timeline SHALL use:
- Vertical line in `--border` color
- Circular dots (7px) with amber fill for active role
- Hollow dots for past roles
- Company name in secondary text color
