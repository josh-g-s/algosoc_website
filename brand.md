# ICATS Brand Guidelines

Source of truth for colours and typography. CSS custom properties are defined in `src/styles/globals.css`. A visual preview is at `/brand`.

## Rules

- Never hardcode hex colour values in components. Use Tailwind tokens (e.g. `bg-brand-primary`, `text-brand-accent`).
- To change a colour, edit `src/styles/globals.css` and rebuild.

## Colours

### Core

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-primary` | `#2B2B2B` | Dark backgrounds, heading text on light surfaces |
| `brand-slate` | `#1E293B` | Gradient endpoints, secondary dark |
| `brand-accent` | `#F59E0B` | CTAs, awards, premium accents |
| `brand-highlight` | `#10B981` | Success states, data highlights |
| `brand-surface` | `#F8FAFC` | Section backgrounds (flips to `#111827` in dark mode) |
| `brand-muted` | `#64748B` | Body text on light backgrounds |

### Foreground (text on dark surfaces)

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-foreground` | `#E1E8EF` | Primary text on dark surfaces |
| `brand-foreground-muted` | `#9CA3AF` | Muted/secondary text on dark surfaces |

### Purple Accent

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-purple` | `#6B46C1` | Accent colour |
| `brand-purple-dark` | `#553C9A` | Hover states |
| `brand-purple-light` | `#8B5CF6` | Badges, secondary highlights |

### ICWiT

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-pistachio` | `#93C572` | ICWiT primary brand colour |
| `brand-wit-pink` | `#E91E63` | ICWiT secondary / accent |

## Typography

| Role | Font | CSS Variable | Applies to |
|------|------|-------------|------------|
| Display | Archivo (600, 700, 800) | `--font-display` | `h1`, `h2` |
| Body | Albert Sans (300-700) | `--font-sans` | Everything else |
| Code | System monospace | `--font-mono` | Code snippets, data |

Both are loaded via Google Fonts in `BaseLayout.astro`.
