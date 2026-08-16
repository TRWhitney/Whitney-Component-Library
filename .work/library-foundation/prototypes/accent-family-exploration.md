# Accent Family Exploration

## Question

Does a saturated structural accent express a consumer's chosen color more faithfully than the
current neutral-directed contrast adjustment across exact fills, supporting boundaries, hover
surfaces, focus outlines, selected rails, and links?

## Comparison

[Open the interactive comparison](accent-family-exploration.html). It defaults to `#2d0548` in dark
appearance and presents the current and proposed treatments side by side. The accent input and
appearance control update both directions. Selected, forced-hover, focus, primary-hover, destination,
swatch, and compact states are included.

The current direction reproduces the shipped neutral-directed roles. The proposed direction keeps
the exact accent for fills and surface tinting, keeps content text neutral, and uses a high-chroma
same-hue signal for rails, focus, and edges when the exact accent is not visible enough. Contrast is
checked only for the structural roles that need it. Achromatic accents fall back to neutral support.

## Evidence

- The first proposed revision was rejected because holding absolute chroma while raising lightness
  produced pastel lavender text and structure. That exposed a second modeling error: content text
  should not carry accent identity, and constant chroma does not preserve perceived saturation.
- Deep purple `#2d0548` in dark appearance now changes from near-white boundary `#f2f6f8`,
  gray-purple rail `#846f96`, and barely tinted hover `#1b1d2a` to exact deep-purple fill and hover
  tint `#2b0b43`, neutral text, and high-chroma purple boundary, rail, focus, and edge `#aa2aff`.
- Direct Chromium inspection covers deep purple in dark and light appearances, deep-purple selected
  hover, white in light appearance, black in dark appearance, and a 390px compact presentation.
  Every inspected presentation has zero document overflow.
- Direct inspection also covers deep purple in light appearance after the saturated revision. The
  exact dark accent carries the light-theme rail and focus states because it already has sufficient
  contrast there.
- The candidate uses neutral support colors for white and black because those accents have no hue to
  preserve. Exact white and black fills remain unchanged.

## Verdict

Accepted. Whitney accepted the saturated structural accent direction after rejecting both the
shipped neutral-directed roles and the first constant-chroma revision.

## Acceptance contract

### Binding qualities

- Preserve the normalized chosen accent exactly for identity-bearing fills and rich surface tinting.
- Keep ordinary content text neutral. Accent identity belongs to the control, rail, edge, or surface,
  not to every label.
- When an accent-bearing rail, focus ring, edge, underline, or conditional boundary needs more
  visibility, derive a deliberately saturated same-hue signal rather than washing the accent toward
  gray or pastel.
- Apply contrast requirements to the role and surface that actually meet. Do not force every role
  to contrast against every owned surface.
- A filled interaction chooses its readable foreground independently from both the exact fill and
  the rich hover tint.
- Retain semantic success, warning, and danger colors independently from the application accent.
- Achromatic black and white accents use neutral structural support because they have no hue to
  preserve.
- In the accepted dark `#2d0548` reference, the exact fill is `#2d0548`, the rich hover tint is
  `#2b0b43`, ordinary content is neutral, and the structural signal is the saturated purple
  `#aa2aff`. The light presentation keeps the exact deep purple for structural roles where it is
  already visible.

### Flexible qualities

The production color conversion, exact thresholds, comparison layout, sample wording, and role-chip
presentation may change. Production may refine numeric results while preserving the accepted visual
relationship: exact identity, rich same-hue tint, neutral content, and saturated same-hue structure.

### Accepted flows

Whitney evaluated the default deep-purple dark presentation; the selected and forced-hover
`Pin result` control; hover and focus examples; the primary hover; the destination link; and the
literal swatch. The comparison was also exercised in light appearance, with white and black accents,
and at the compact viewport. Those states are the production comparison set.

## Production design plan

- **Color:** exact consumer accent for identity; rich same-hue hover tint; saturated same-hue
  structural signal; library neutral foreground; independent semantic green, yellow, and red. For
  the dark deep-purple reference these are `#2d0548`, `#2b0b43`, `#aa2aff`, `#f2f6f8`, and the
  existing semantic roles.
- **Type:** retain IBM Plex Sans for component content and IBM Plex Mono for utility labels. Color
  no longer substitutes for typographic hierarchy.
- **Layout:** preserve the established compact, rounded component geometry and full-width selected
  under-rail. This correction changes color relationships, not component size or composition.
- **Motion:** preserve the existing brief hover/focus transitions, continuous pending motion, and
  reduced-motion behavior. Color changes do not add decorative animation.
- **Signature:** the accent is most recognizable where a saturated structural signal traces rails,
  focus, and necessary edges around exact-color identity rather than tinting every word.

Critique against the accepted Focus + Rail direction removes accent-colored resting text and the
neutral-directed derivation that made unrelated roles look dusty or pastel. It retains the rail,
rounded containment, semantic colors, and motion language already accepted for the library.

## Run

Open `accent-family-exploration.html` directly in a current browser.
