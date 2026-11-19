---
name: Nocturnal Focus
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#007650'
  on-tertiary-container: '#76ffc2'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is built for college students managing coursework, deadlines, and late-night study sessions. It trades the bright, generic look of standard academic planners for a bold, dark-mode-first interface that feels like a focused digital workspace.

The visual style blends **High-Contrast / Bold** clarity with **Minimalism**. Deep obsidian and charcoal surfaces reduce eye strain during late-night sessions, while electric violet (`#7C3AED`) highlights draw immediate attention to active deadlines, primary actions, and study timers. Sharp technical typography—pairing `Space Grotesk` for expressive, geometric headings with `Geist` for crisp, legible body copy and metadata—gives the interface a structured, developer-grade precision.

The emotional response is calm control and momentum: students should feel locked in, organized, and unburdened by visual clutter.

## Colors

The palette is anchored in a deep, late-night dark mode (`#0F172A` base) designed for sustained focus without glare.

- **Primary (`#7C3AED` — Electric Violet):** Reserved for primary CTAs, active navigation states, focus indicators, and key progress accents.
- **Secondary (`#3B82F6` — Royal Blue):** Used for secondary actions, course category tags, and informational badges.
- **Tertiary (`#10B981` — Emerald):** Dedicated strictly to completed task states, positive streaks, and success confirmations.
- **Neutral (`#0F172A` — Deep Slate):** Forms the canvas and surface hierarchy. Surfaces step up in lightness from `#0F172A` (canvas) to `#1E293B` (cards/containers) and `#334155` (elevated popovers/inputs) to establish clear separation without harsh white lines.

Text uses high-contrast off-white (`#F8FAFC`) for primary content and muted slate (`#94A3B8`) for secondary metadata, timestamps, and course codes.

## Typography

The type system pairs `Space Grotesk` for display and section headings with `Geist` for all body copy, task titles, and UI labels.

- **Headlines (`Space Grotesk`):** Used for dashboard greetings, course headers, and modal titles. Tight negative letter-spacing (`-0.01em` to `-0.02em`) reinforces the sharp, technical aesthetic. On mobile viewports (`< 640px`), `headline-lg` scales down to `headline-lg-mobile` (`28px`) to preserve vertical space.
- **Body & UI (`Geist`):** Chosen for its exceptional legibility at small sizes and clean geometric proportions. `body-md` (`14px`) is the default for task descriptions and list items.
- **Labels & Badges (`Geist`):** `label-sm` (`11px`, uppercase or tracked at `0.04em`) is used for status badges (`PENDING`, `COMPLETED`), course codes (`CS 101`), and due-date chips.

## Layout & Spacing

The layout uses a **Fluid Grid** that adapts cleanly across study environments—from split-screen laptop views to mobile check-ins between classes.

- **Desktop (`>= 1024px`):** A 12-column fluid grid with `1rem` (`16px`) gutters and `1.5rem` (`24px`) outer margins. A persistent left sidebar (`240px`) houses course filters and views, while the main canvas displays task lists, Kanban boards, or calendar timelines.
- **Tablet (`640px - 1023px`):** Collapses to an 8-column fluid grid. The sidebar converts into a slide-over drawer to maximize horizontal space for task cards.
- **Mobile (`< 640px`):** A 4-column fluid grid with `1rem` (`16px`) outer margins. Navigation moves to a bottom bar for thumb-friendly access.

All component padding and element gaps strictly follow the `space-*` scale (`0.25rem` to `2rem`), ensuring consistent breathing room between task rows, card headers, and action groups.

## Elevation & Depth

In a dark interface, traditional drop shadows lose visibility. Instead, this design system communicates depth through **Tonal Layers** paired with **Low-Contrast Outlines**:

1. **Base Canvas (`#0F172A`):** The lowest level, reserved for the app background.
2. **Surface Tier 1 (`#1E293B`):** Used for task cards, sidebar panels, and summary widgets. Separated from the canvas by a `1px` ghost border (`rgba(255, 255, 255, 0.08)`).
3. **Surface Tier 2 (`#334155`):** Used for elevated elements such as dropdown menus, active input fields, and modal dialogs.
4. **Focus & Active Glow:** Interactive elements in focus—such as a selected task card or primary CTA—use a subtle electric violet ring (`0 0 0 2px rgba(124, 58, 237, 0.4)`) rather than heavy shadows.

## Shapes

The shape language is **Soft** (`roundedness: 1`), pairing a base radius of `0.25rem` (`4px`) with `0.5rem` (`8px`) for larger containers (`rounded-lg`) and `0.75rem` (`12px`) for modals (`rounded-xl`).

This restrained curvature keeps the interface feeling sharp, technical, and structured—avoiding overly bubbly or playful pill shapes—while still softening the edges of cards, buttons, and input fields for a modern SaaS feel.

## Components

### Buttons
- **Primary:** Solid `#7C3AED` background, `#F8FAFC` text, `0.25rem` radius, `label-lg` typography. Hovering lightens the fill to `#8B5CF6`; active states add a subtle violet focus ring.
- **Secondary:** Transparent background with a `1px` ghost border (`rgba(255, 255, 255, 0.16)`) and `#F8FAFC` text.
- **Ghost / Icon:** No border, `#94A3B8` icon/text that shifts to `#F8FAFC` on hover over a subtle `#1E293B` surface.

### Status Badges & Chips
- **Pending:** Translucent amber/blue tint (`rgba(59, 130, 246, 0.15)`) with `#60A5FA` text and a `1px` border (`rgba(59, 130, 246, 0.3)`), `0.25rem` radius, `label-sm` typography.
- **Completed:** Translucent emerald tint (`rgba(16, 185, 129, 0.15)`) with `#34D399` text and a `1px` border (`rgba(16, 185, 129, 0.3)`).
- **Course Tags:** Compact chips with `#1E293B` fill, `1px` ghost border, and a `6px` colored dot indicating the course.

### Task Cards
- Built on Surface Tier 1 (`#1E293B`) with `0.5rem` (`rounded-lg`) corners, `1px` ghost border, and `space-md` (`1rem`) internal padding.
- Structure: Left-aligned custom checkbox, `title-md` task name, `body-sm` due date/course metadata, and right-aligned status badge. Completed tasks dim to `60%` opacity with a subtle strikethrough on the title.

### Checkboxes & Radio Buttons
- `18px x 18px` with `0.25rem` radius (checkbox) or full circle (radio). Unchecked states use a `1.5px` `#475569` border. Checked states fill with `#7C3AED` and display a crisp white checkmark.

### Input Fields
- `#0F172A` or `#1E293B` fill with a `1px` `#334155` border, `0.25rem` radius, and `space-sm` (`0.5rem`) vertical / `space-md` (`1rem`) horizontal padding. Focus state transitions the border to `#7C3AED` with a `2px` outer glow.

### Lists & Study Timers (Product-Specific)
- **Task Lists:** Vertical stacks separated by `space-sm` (`0.5rem`) gaps, grouped under collapsible `headline-sm` headers (e.g., *Due Today*, *This Week*).
- **Focus Timer Widget:** A compact, persistent card featuring `Space Grotesk` tabular numerals, a `#7C3AED` progress ring, and quick start/pause icon buttons.