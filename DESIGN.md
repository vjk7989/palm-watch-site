# PalmWatch Design System

## Theme

An image-led, evidence-premium agricultural identity: deep oil-palm greens, a decisive lime signal color, and quiet neutral reading surfaces. The plantation is the dominant visual object; data UI appears as restrained evidence layered over the field rather than as a generic dashboard.

## Color

- `--ink: #082b26` — primary text and deepest interface surfaces.
- `--forest: #0d312a` — major dark sections and image overlays.
- `--forest-2: #17483e` — secondary dark surface.
- `--surface: #f3f4ef` — neutral page surface.
- `--surface-strong: #ffffff` — cards and footer tab.
- `--lime: #dff542` — primary action and verified active state.
- `--muted: #596b65` — secondary copy, kept at accessible contrast.
- `--line: rgba(8, 43, 38, 0.18)` — separators and quiet borders.

## Typography

Use Manrope for display and brand text, and DM Sans for body copy and controls. Display sizes use fluid `clamp()` values with a maximum of 6rem and letter spacing no tighter than `-0.04em`. Body text is at least 1rem with a 65–75 character measure.

## Layout

- Maximum content width: 1320px.
- Floating pill navigation overlays the first viewport.
- The hero is exactly one dynamic viewport high and uses height-aware layouts.
- Solutions use three staggered photographic columns.
- Services use a pinned desktop story and normal stacked mobile cards.
- Features use a four-card sticky stack with visible card edges.
- The footer is a rounded white tab over plantation imagery.

## Components

- Buttons: pill shape, 44px minimum target, lime primary treatment.
- Navigation sheet: Radix/shadcn-compatible modal sheet with focus trapping.
- Accordion: Radix/shadcn-compatible FAQ disclosure.
- Tags: small bordered pills used only for evidence dimensions and outputs.
- Data visuals: functional CSS/SVG diagrams, never decorative pseudo-photography.

## Imagery

Use credible oil-palm aerial, survey, and field-verification photography. Apply art-directed crops and restrained dark overlays. Do not use unrelated crops, futuristic holograms, diagnostic labels, or fabricated interface screenshots.

## Motion

Use natural deceleration with 200–450ms transitions. Animate opacity and transforms for service changes; sticky positioning supplies the feature stack. Never intercept wheel or touch scrolling. Reduced motion removes pinned storytelling and exposes all content as normal stacked sections.

## Responsive Behavior

Use content-driven breakpoints around 680px, 900px, and 1100px plus short-height queries. Maintain safe-area padding, 44px targets, readable type, no horizontal overflow, and a fully visible hero from 320px-wide phones through 4K displays.
