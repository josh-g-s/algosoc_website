# ICATS Brand Guidelines

Source of truth for colours and typography. CSS custom properties are defined in `src/styles/globals.css`. A visual preview is at `/brand`.

## Rules

- Never hardcode hex colour values in components. Use Tailwind tokens (e.g. `bg-brand-navy`, `text-brand-gold`).
- To change a colour, edit `src/styles/globals.css` and rebuild.

## Colours

### Core

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-navy` | `#0F172A` | Nav, hero, footer backgrounds, headings |
| `brand-dark` | `#0F172A` | Hover state for navy buttons |
| `brand-dark-slate` | `#1E293B` | Gradient endpoints, secondary dark |
| `brand-gold` | `#F59E0B` | CTAs, awards, premium accents |
| `brand-green` | `#10B981` | Success states, data highlights |
| `brand-light` | `#F8FAFC` | Section backgrounds (flips to `#111827` in dark mode) |
| `brand-gray` | `#64748B` | Body text on light backgrounds |

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
