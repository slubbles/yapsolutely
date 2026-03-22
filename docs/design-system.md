# Yapsolutely Design System

> Extracted from the Lovable-derived UI foundation. This is the canonical reference for Yapsolutely's visual identity across dashboard, marketing, and voice agent interfaces.

---

## 1. Color Palette

### Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--canvas` | `hsl(216 20% 95%)` | Page background |
| `--surface-subtle` | `hsl(220 10% 97%)` | Slightly elevated sections |
| `--surface-panel` | `hsl(0 0% 100%)` | Cards, modals |
| `--surface-panel-muted` | `hsl(40 5% 97%)` | Muted card variants |
| `--surface-elevated` | `hsl(0 0% 100%)` | Popovers, menus |
| `--surface-dark` | `hsl(0 0% 7%)` | Dark sections (footer, hero) |
| `--surface-dark-soft` | `hsl(0 2% 11%)` | Dark section variants |
| `--text-strong` | `hsl(222 12% 10%)` | Headings, primary text |
| `--text-body` | `hsl(216 6% 29%)` | Body copy |
| `--text-subtle` | `hsl(218 6% 52%)` | Secondary text, labels |
| `--text-on-contrast` | `hsl(20 5% 89%)` | Text on dark backgrounds |
| `--border-soft` | `hsl(220 15% 92%)` | Card/panel borders |
| `--accent-warm` | `hsl(30 55% 75%)` | Primary brand accent (warm gold) |
| `--accent-warm-dim` | `hsl(26 35% 62%)` | Hover/muted variant of accent |
| `--destructive` | `hsl(0 65% 55%)` | Error states, delete actions |

### Dark Mode

| Token | Value |
|-------|-------|
| `--canvas` | `hsl(220 12% 8%)` |
| `--surface-subtle` | `hsl(220 10% 12%)` |
| `--surface-panel` | `hsl(220 12% 12%)` |
| `--text-strong` | `hsl(40 15% 92%)` |
| `--text-body` | `hsl(220 8% 72%)` |
| `--text-subtle` | `hsl(220 8% 52%)` |
| `--border-soft` | `hsl(220 10% 20%)` |
| `--accent-warm` | `hsl(30 45% 60%)` |

### Brand Identity Colors

- **Primary action**: `--accent-warm` (warm gold) — used for hero buttons, active states
- **Neutral dark**: `--text-strong` (near-black) — used for headings, strong elements
- **Canvas**: Cool blue-grey background — gives the dashboard a premium SaaS feel

---

## 2. Typography

### Fonts

| Role | Font | Fallback Stack |
|------|------|----------------|
| Display (headings) | **General Sans** | system-ui, sans-serif |
| Body (prose, UI) | **Satoshi** | system-ui, sans-serif |
| Monospace (code, IDs) | System monospace | — |

### Type Scale

| Token | Size | Line Height | Letter Spacing | Usage |
|-------|------|-------------|----------------|-------|
| `page-title` | `1.5rem` | 1.2 | `-0.025em` | Page headings |
| `section-head` | `0.92rem` | 1.3 | `-0.01em` | Section headings |
| `body-md` | `0.82rem` | 1.65 | Normal | Body text |
| `body-sm` | `0.78rem` | 1.6 | Normal | Small body text |
| `label` | `0.72rem` | 1.4 | Normal | Form labels |
| `caption` | `0.65rem` | 1.4 | `0.1em` | Fine print, pill labels |

### OpenType Features
```css
font-feature-settings: "ss01", "ss02", "cv01";
```

---

## 3. Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-nav-rail` | `220px` | Side navigation width |
| `--spacing-mobile-bar` | `3.5rem` | Mobile bottom nav height |
| `--spacing-page-x` | `2rem` | Desktop page horizontal padding |
| `--spacing-page-x-sm` | `1.25rem` | Mobile page horizontal padding |

### Content Max-Widths

| Token | Value | Usage |
|-------|-------|-------|
| `--width-content-wide` | `1200px` | Full-width layouts |
| `--width-content-default` | `920px` | Default content area |
| `--width-content-narrow` | `860px` | Focused content |
| `--width-content-form` | `480px` | Forms, modals |
| `--width-content-auth` | `400px` | Auth pages |

---

## 4. Border Radii

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `0.75rem` | Default radius |
| `--radius-card` | `1rem` | Cards |
| `--radius-panel` | `1.25rem` | Large panels |
| `--radius-pill` | `9999px` | Pill badges, rounded buttons |
| `--radius-md` | `calc(0.75rem - 2px)` | Medium elements |
| `--radius-sm` | `calc(0.75rem - 4px)` | Small elements |

---

## 5. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px 0 hsl(220 15% 10% / 0.03)` | Subtle lift |
| `--shadow-sm` | Multi-layer, 0.04 opacity | Cards at rest |
| `--shadow-md` | Multi-layer, 4px blur | Hover cards |
| `--shadow-lg` | Multi-layer, 15px blur | Elevated panels |
| `--shadow-xl` | Multi-layer, 25px blur | Modals, overlays |
| `--shadow-popover` | Multi-layer, 30px blur | Dropdowns, popovers |

---

## 6. Animations

| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| `fade-up` | 0.6s | ease-out | Page entrance, card reveals |
| `fade-in` | 0.5s | ease-out | General fade entrance |
| `slide-down` | 0.2s | ease-out | Dropdowns, expanding panels |
| `shimmer` | 2s | ease-in-out, infinite | Skeleton loading states |
| `pulse-dot` | 1.5s | ease-in-out, infinite | Active status indicator |
| `scale-in` | 0.2s | ease-out | Modal open, popover |
| `accordion-down/up` | 0.2s | ease-out | Radix accordion |

---

## 7. Component Patterns

### Cards
```
bg-surface-panel rounded-card border border-border-soft
```
Hover state: `hover:shadow-surface-sm`

### Page Layout
```
p-5 sm:p-8 max-w-[--width-content-wide]
```

### Headings
```
font-display text-[1.35rem] sm:text-[1.65rem] font-semibold tracking-[-0.03em] text-text-strong
```

### Body Text
```
font-body text-[0.82rem] text-text-subtle leading-relaxed
```

### Labels
```
font-body text-[0.72rem] text-text-subtle
```

### Hero Button (Primary CTA)
```
bg-accent-warm text-surface-dark font-semibold rounded-lg
```

### Outline Button
```
border border-border-soft text-text-body rounded-lg
```

### Form Input
```
font-body text-[0.8rem] rounded-md border border-border-soft bg-surface-panel
```

### Active Status Dot
```
w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot
```

### Skeleton Loader
```
bg-surface-subtle rounded-md animate-shimmer
```

### Sidebar Navigation
```
bg-surface-panel border-r border-border-soft w-[--spacing-nav-rail]
```

---

## 8. Utility Classes

| Class | Effect |
|-------|--------|
| `.shadow-surface` | Box shadow `var(--shadow-sm)` |
| `.shadow-surface-md` | Box shadow `var(--shadow-md)` |
| `.shadow-surface-lg` | Box shadow `var(--shadow-lg)` |
| `.shadow-popover` | Box shadow `var(--shadow-popover)` |
| `.skeleton` | Animated gradient shimmer |
| `.dot-active` | Pulsing green dot |
| `.transition-page` | Smooth 200ms page transitions |

---

## 9. Icon System

Uses **Lucide React** icons throughout. Standard sizes:
- Navigation: `w-4 h-4`
- Inline: `w-3.5 h-3.5`
- Feature icons: `w-5 h-5` to `w-6 h-6`
- Block type icons in flow builder: `w-3 h-3` inside colored `w-6 h-6` containers

---

## 10. Status Colors

| Status | Color |
|--------|-------|
| Active / Success | `emerald-400` / `emerald-600` |
| Warning | `amber-500` / `amber-600` |
| Error / Destructive | `rose-500` / `red-600` |
| Info | `blue-500` / `blue-600` |
| Draft / Inactive | `text-subtle` (grey) |

### Flow Builder Block Colors

| Block Type | Color Class |
|------------|-------------|
| Greet | `text-emerald-600 bg-emerald-50` |
| Qualify | `text-blue-600 bg-blue-50` |
| FAQ | `text-purple-600 bg-purple-50` |
| Book Appointment | `text-amber-600 bg-amber-50` |
| Transfer | `text-orange-600 bg-orange-50` |
| Close Call | `text-rose-600 bg-rose-50` |
| Custom | `text-slate-600 bg-slate-50` |

---

## 11. Scrollbar Styling

```css
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: hsl(218 6% 52% / 0.15); border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: hsl(218 6% 52% / 0.25); }
```

---

## 12. Focus States

```css
:focus-visible {
  outline: none;
  ring: 2px;
  ring-color: var(--ring) / 20%;
  ring-offset: 1px;
  ring-offset-color: var(--background);
}
```

---

## Notes

- The design system uses **HSL color values** throughout for consistency
- All text sizes use `rem` units for accessibility
- The warm gold accent (`--accent-warm`) is the signature Yapsolutely brand color
- Dark mode is fully supported with matching semantic tokens
- Tailwind v4 `@theme inline` block maps CSS custom properties to Tailwind utility classes
