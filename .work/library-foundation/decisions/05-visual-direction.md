# 05 Visual Direction and Permitted Variation

**Status:** resolved
**Blocked by:** [Style and Theme Contract](02-style-and-theme-contract.md),
[Agent-Facing Contract](04-agent-contract.md)
**Type:** discussion

## Question

What visual character should the library own, and which deliberate variants may components expose
without recreating the variance the library exists to reduce?

## Answer

The library's visual direction is **Focus + Rail + Momentum + Route**. It combines Quiet Utility's rounded geometry with
Calibrated Instrument's density and connected-step language, Focus Field's localized accent
atmosphere, Continuum's transient segment hover with rail-only selection, a gliding selection rail,
Momentum's one-shot atmospheric pulse when work begins, and Route's meaningful use of the space
between run identity and semantic status. Adjacent items with equivalent roles are sized and aligned
consistently. Semantic indicator colors, stable layouts, visible interaction feedback, and
purposeful motion belong to the direction.

Its governing principle is **continuity without conflation**: use space, alignment, rails, fields,
and motion to reveal how distinct elements participate in one process. Let the connecting structure
organize the space between them while preserving each element's separate role. Relationship
structures shape otherwise neutral space rather than decorate content; the language may recur at
different scales without exact repetition; one cue has one job; and connection belongs where a
relationship changes interpretation or action.

The glow is reserved for meaningful active composite regions. A responsive containing field owns
the atmosphere and offsets it toward the region's leading side; its opaque nested panel does not
surface the glow. Compact reflow preserves this relationship without inserting a divider between
the preceding controls and the status field.

Route is a specific application of that principle. Its real flexible track gives otherwise empty
header space a structural role between run identity and semantic status. The endpoints remain
visually and semantically distinct, the track neither crosses content nor adds a second status
indicator, and the route itself remains still while other motion communicates state change.

## Evidence

- The library owns static styles, semantic tokens, typography, spacing, shape, elevation, and
  interaction states.
- Consumers may configure application accent and light or dark appearance, but not the general
  token system in the first release.
- Public variants must correspond to distinct semantic uses that component contracts can explain.
- Equivalent adjacent controls, actions, and repeated regions must maintain consistent sizing and
  alignment across their states.
- Aperture is rejected. Telemetry is excluded as an identity premise because charts express
  application content rather than a general component-library visual language.
- Kinetic Signal is rejected: its route had an unresolved visual origin, its breathing dash did
  not communicate a state change, and the total treatment was not sufficiently novel.
- Continuum, Strata, Register, and Focus Field were coordinated studies used to isolate the
  accepted Focus + Rail ingredients.
- Decorative structural lines must not terminate arbitrarily. Continuum uses a complete rail, and
  Strata uses a continuous under-layer rather than partial bars.
- Visually adjoining peer panels maintain a consistent outer dimension; Strata's work and context
  panels therefore share a top, bottom, and height.
- Existing stage nomenclature is sufficient to identify the current stage; Continuum does not add
  a unique square marker for the same meaning.
- Focus Field's localized active-region glow remains worth evaluating, but glow is reserved
  emphasis rather than a default surface treatment.
- Register's guide through the controls is rejected. Whether its remaining dashed seams belong in
  the identity remains unresolved.
- Semantic status does not inherit the application accent: settled success is green, work in
  progress is yellow, and failure is red.
- Focus Field is the strongest study so far. Continuum's transient hover fill and rail-only
  selected state are accepted as the segmented-control behavior.
- A selected segment does not retain a filled or elevated surface merely to indicate selection;
  the bottom rail carries the accent while its label remains neutral.
- An active-stage pulse continues throughout the running state and disappears when running stops.
  One-shot motion remains appropriate for discrete transitions such as a rail sweep or field bloom.
- Focus Field and Continuum's accepted segmented selection combine as **Focus + Rail**, the
  library's visual base.
- Local visual effects belong to the responsive region they emphasize. The status-field wrapper
  owns the glow so it follows reflow, while the nested status panel remains opaque and surfaces none
  of that glow; the atmosphere stays behind the panel rather than inside it.
- Underlight and Contour are rejected. Handoff is also rejected as a separate direction because
  its observable result is not meaningfully different from Focus + Rail.
- Momentum's state-change pulse is accepted into the base. Orbit is rejected because its animated
  perimeter duplicates the active Boundary Pass pulse. State Field is set aside.
- Route is the accepted top-bar structure. Its track is a flexible element occupying only the
  space between run identity and status; neither endpoint has a masking halo.
- Dock and Beacon are not selected. Route ties the header together by organizing useful space
  without introducing another container, halo, status signal, or competing emphasis.
- [Interactive visual direction prototype](../prototypes/visual-directions.html)
- [Prototype record and revision notes](../prototypes/visual-directions.md)
