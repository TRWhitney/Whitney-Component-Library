# Visual Direction Comparison

## Question

Which visual premise should govern the library's reusable components while keeping application
accent configurable and component variation bounded?

## Accepted artifact

The [interactive prototype](visual-directions.html) now presents the accepted Focus + Rail +
Momentum + Route direction without comparative direction or signature controls. It supports light
or dark appearance, application accent, wide or compact viewport, ready, error, and disabled
controls, profile selection, a boundary review dialog, and an in-progress solve state.

The [static comparison board](visual-directions.svg) remains only as a fallback preview:

- **Synthesis:** Utility's rounded containment with Instrument's density, accent rail, and connected
  state language, plus semantic indicator colors and visible interaction feedback.
- **Calibrated Instrument:** retained as the original compact, precise reference.
- **Quiet Utility:** spacious, soft, and approachable with state expressed through gentle surfaces.
- **Workshop Ledger:** rejected because its strong sectional contrast and overall premise do not fit
  the desired language. It remains visible only in the static historical comparison.

## Evidence to Settle the Decision

Whitney's reaction after directly operating hierarchy, density, control affordance, accent
propagation, appearance, state, overlay, and responsive behavior. The initial accent hue and
simulator content are disposable; the selected system relationships are decision-bearing.

## Status

Focus + Rail + Momentum + Route is accepted as the library's visual direction. The exploration is
closed. This non-production planning artifact is the canonical interactive reference for the
accepted themes, states, viewport modes, accent propagation, structure, and interactions.

## Revision 1

- Combined Utility's rounded geometry with Instrument's density, accent rail, and connected-step
  treatment.
- Replaced bordered synthesis actions with surface and filled actions that provide hover, press,
  and directional feedback.
- Added progress sheen and an active-step pulse, with reduced-motion behavior.
- Separated semantic success, warning, and error colors from the configurable application accent.
- Corrected status contrast with explicit light and dark semantic color pairs.
- Positioned validation feedback outside the control-sizing rows and forced equal control heights
  so validation cannot raise or resize one control.
- Kept the selected segmented-control outline inside its segment and above adjacent hover layers so
  hover feedback cannot cover the neighboring selection state.

## Accepted Base Grammar

- Compact, instrument-like information density within approachable rounded containment.
- Connected progress and state language.
- Application accent for focus, selection, progress, and active structure, with independent
  semantic success, warning, and error colors.
- Surface-based actions with hover, press, and purposeful state animation plus reduced motion.
- Stable layouts across state changes.
- Consistent sizing and alignment for adjacent items with equivalent roles.
- Coherent light and dark appearances without severe inversion.

Exact fonts, accent hue, simulator content, dimensions, and easing values remain flexible. Later
revisions record how the accepted direction completes this base grammar.

## Revision 2: Signature Studies

Three motifs were explored over the accepted base grammar. Aperture was rejected. Telemetry was
removed from the identity comparison because charts are application-specific content rather than
a reusable visual-language premise; that does not preclude a future data-visualization component
when the catalog calls for one.

**Kinetic signal path** was also rejected. Its revised line did not begin at the visual origin, the
breathing dash moved without communicating a state change, and the remaining changes were too
minor to establish an identity. This rejection supersedes the earlier description of Signal as an
active candidate.

The field layout was also tightened: Solver and Tolerance retain equal dimensions, validation no
longer shifts either control, and the visible control-to-Profile gap is now a deliberate 28px.
Browser inspection exercised the revised Signal treatment, its running motion, adjacent segmented
hover behavior, semantic status contrast, validation, dialog, and compact states.

## Revision 3: Coordinated Identity Studies

Four materially different studies now apply coordinated structure, surface, geometry, accent, and
motion decisions to the same accepted workflow:

- **Continuum:** a continuous route beginning at the shell's leading edge, connected circular
  stages, edge-locked selection, and a single sweep when work begins. It has no idle motion or
  arbitrary internal endpoint.
- **Strata:** equal-height adjoining working and context surfaces, recessed controls, a lifted
  selection, and a continuous accent under-layer. The context surface seats once when work begins.
- **Register:** attached control captions, a governing top rule, registered baselines, square state
  marks, and restrained dashed seams. Selection snaps to its baseline; the active stage pulses
  only while work is running.
- **Focus Field:** one localized accent atmosphere behind the active composite region, a nested
  active-region surface, lightly colored control boundaries, and a one-shot field bloom when work
  begins. Glow is not proposed as a default surface treatment.

The shared color plan uses the accepted semantic tokens: canvas (`#e9edef`), surface (`#ffffff`),
subtle surface (`#edf1f3`), text (`#152027`), consumer accent (sampled as `#2474ff`), and independent
success, warning, and danger pairs. Dark appearance maps the same roles rather than inverting the
composition. IBM Plex Sans remains the reading role and Plex Mono the compact state and annotation
role so structural differences, rather than arbitrary type changes, carry the comparison.

Each study preserves the accepted density, adjacent control sizing, semantic colors, hover and
press feedback, error stability, accent configurability, and reduced-motion behavior. Browser
inspection exercised every study in wide and compact layouts and both appearances. Focus Field's
first glow implementation created hidden horizontal overflow; it was constrained to the shell and
the test now verifies that clicking Run cannot scroll or clip the content.

## Revision 4: Continuity and Semantic Status

- Removed Continuum's partial filled rail and special square current-stage mark. The rail now spans
  the complete shell with a smooth tonal transition, and a one-shot sweep communicates Run.
- Extended Strata's accent under-layer continuously beneath the shell and made the adjoining work
  and context panels equal in height. Their hierarchy now comes from depth rather than unequal size.
- Removed Register's decorative center guide because it crossed the fields and segmented control.
  Its remaining dashed seams are still under review.
- Preserved Focus Field's single visible glow behind the active composite region and recorded that
  glow must not become a general-purpose surface treatment.
- Assigned the running `Solving` state to semantic warning yellow instead of the configurable
  application accent. `Stable` remains semantic green. Both status pairs meet 4.5:1 contrast in
  light and dark appearances.

## Revision 5: Preferred Ingredients

- Focus Field is the strongest identity study so far, but it is not yet a complete or accepted
  visual identity.
- Continuum's segmented-control hover and bottom selection rail are preferred over Strata's
  persistent selected fill and lifted shadow. Continuum now leaves the selected segment surface
  transparent and uses only accent text plus the bottom rail; hover fill remains transient.
- Continuum's rail-only selection is accepted as the segmented-control behavior: selected state
  uses an accent label and bottom rail without persistent fill or elevation.
- No additional synthesis was added in this revision. The open question is what repeatable visual
  premise can combine the preferred Focus Field and Continuum qualities without merely collecting
  effects.

## Revision 6: Running Pulse

The pulse freeze was caused by identity-study rules overriding the base animation to one
iteration. Those overrides are removed. The active-stage marker now pulses continuously for the
entire running state in every study and its animation element disappears when running stops. This
is distinct from rail, field, and progress transitions, which may remain one-shot.

## Revision 7: Focus + Rail Finishing Studies

The current interactive comparison holds the preferred Focus Field treatment and accepted
Continuum segmented selection constant, then varies only the possible missing identity premise:

- **Focus + Rail:** the direct synthesis with no additional premise. It is the control against
  which the other studies should be judged.
- **Underlight:** treats accent as material beneath equal-height neutral working planes, visible
  through their continuous gutter and transient hover reveals.
- **Contour:** gives only active compound regions a nested rounded boundary; ordinary fields stay
  quiet so the motif does not become universal decoration.
- **Handoff:** leaves the static design unchanged and makes the signature an ordered Run sequence:
  action compression, status arrival, field bloom, then continuous active-stage pulse.

All studies use the accepted canvas, surface, text, accent, and semantic status tokens. Plex Sans
remains the reading role and Plex Mono the compact state-notation role. Layout density, equal
adjacent controls, rail-only selected segments, transient hover fill, running pulse, and semantic
yellow `Solving` status do not vary between the studies.

Compact inspection invalidated the original Focus Field glow implementation: the glow belonged to
the outer shell and only aligned with the status region coincidentally at wide width. A first
correction moved the glow inside the panel, which changed the intended effect instead of preserving
it. The prototype now gives the responsive status-field wrapper the glow and keeps its nested panel
opaque above it. The atmosphere therefore remains behind the region while following that region
through reflow. Tests check the wrapper bounds and opaque panel separation in wide and compact
layouts and both appearances.

## Revision 8: Accepted Focus + Rail Base

- Promoted Focus + Rail from the comparison control to the library's visual base.
- Rejected Underlight and Contour. Rejected Handoff as a separate direction because it did not
  produce a sufficiently distinct observable result.
- Removed the rejected finishing studies from the interactive artifact and retained theme,
  viewport, state, and accent controls for exercising the accepted base.
- Restored the glow's deliberate leading-side offset while keeping it on the responsive status
  field behind an opaque nested panel.
- Removed the generic compact divider between the configuration region and the status field, and
  added breathing room above the nested status panel.

## Acceptance Contract

### Binding qualities

- Rounded, approachable containment with compact instrument-like density and consistent sizing for
  adjacent equivalent controls.
- **Continuity without conflation:** use space, alignment, rails, fields, and motion to reveal how
  distinct elements participate in one process. Let connecting structure organize the space
  between them while preserving each element's separate role.
- Relationship structures shape otherwise neutral space instead of decorating content. The same
  language may recur at different scales without exact repetition, connection is used where it
  changes interpretation or action, and one cue has one job.
- Plex Sans for readable content and Plex Mono for compact state and system notation, or equivalent
  roles that preserve their deliberate contrast.
- Consumer accent for focus, selection rails, progress, and active structure; green for success,
  yellow for work in progress or review, and red for failure.
- Segmented selection uses accent text and a gliding bottom rail without persistent fill or
  elevation; unselected hover may use a temporary soft fill and must not cover an adjacent selected
  rail.
- Meaningful active composite regions may use a localized glow. The responsive containing field
  owns a leading-side-biased atmosphere behind an opaque nested panel; the panel itself does not
  surface the glow, and compact reflow introduces no divider before the field.
- A real flexible Route track organizes otherwise empty space between run identity and semantic
  status. It does not cross either endpoint, add masking halos, or duplicate the status pill, and
  it remains responsive and still.
- Interactions provide hover and press feedback. Starting work produces a one-shot atmospheric
  pulse from configuration toward status, while the active-stage pulse continues for the full
  running state and disappears when work ends.
- Layout remains stable through validation and status changes, supports coherent light and dark
  appearances, and honors reduced motion.

### Flexible qualities

- Exact typefaces when equivalent role contrast and legibility are preserved.
- Exact accent hue, dimensions, spacing values, shadow strength, glow radius and offset, and easing.
- Simulator wording and disposable prototype data.
- Prototype implementation technique and application-specific composition.

### Acceptance exercise

- Switch between light and dark and confirm semantic status remains legible and distinct from the
  configurable accent.
- Switch between wide and compact and confirm the glow stays behind and leading-side-biased relative
  to the status panel, with no divider between configuration and status regions; confirm Route
  remains between its distinct endpoints without halos or overflow.
- Hover adjacent profile segments, change selection, and confirm hover never covers the selected
  rail.
- Exercise ready, error, and disabled states and confirm equivalent fields remain aligned without
  validation-driven shifts.
- Review conditions and start the profile; confirm semantic Ready and Review states differ, Solving
  is yellow, Route resolves toward that semantic endpoint without becoming another status label,
  the field and Momentum surge respond once, and the active-stage pulse continues while running.
- Enable reduced motion and confirm transition and activity animations settle to a single
  effectively instantaneous iteration.

## Revision 9: Bold Extensions over the Accepted Base

The comparison now holds Focus + Rail constant and explores three materially different identity
axes. None is accepted yet:

- **Momentum:** spatial continuity. The profile rail glides between selections, and Run sends one
  broad atmospheric surge from configuration toward status before settling. It adds no idle motion.
- **Orbit:** closed-boundary activity. A complete responsive perimeter surrounds the status panel
  and circulates only while work is running. It introduces no internal guide or partial endpoint.
- **State Field:** semantic atmosphere. The status region's containing field uses green, yellow, or
  red atmosphere for settled, running/review, or failure states while the application accent
  remains interaction-only.

The shared color plan remains canvas (`#e9edef`), surface (`#ffffff`), subtle surface (`#edf1f3`),
text (`#152027`), configurable accent (sampled as `#2474ff`), and independent semantic success,
warning, and danger pairs. Dark appearance remaps those roles coherently. Plex Sans remains the
reading role and Plex Mono remains the state-notation role. The layout stays a dense configuration
region beside a responsive status field, stacking without a divider in compact mode.

The signature elements are respectively a moving field, a closed perimeter, and a semantic field.
Each candidate preserves the opaque nested status panel, leading-side glow bias, rail-only selected
segments, transient hover fill, stable validation layout, semantic status pill, reduced motion, and
continuous running pulse.

## Revision 10: Momentum Base and Top-Bar Studies

Momentum's gliding selection rail and one-shot state-change pulse are promoted into the accepted
base. Orbit is rejected because its moving perimeter communicates the same running activity as the
Boundary Pass pulse. State Field is set aside. The next comparison changes only the top bar that
contains the run identifier and semantic status pill:

- **Route:** a continuous track begins at the run marker and terminates beneath the status pill. It
  connects two meaningful endpoints without crossing their labels or adding motion.
- **Dock:** a substantial recessed rounded bay gives status a dedicated structural home while the
  run identifier remains flat.
- **Beacon:** the status pill overlaps the header seam and receives one localized semantic halo,
  creating emphasis without a second label or running indicator.

Every header uses the same canvas, surfaces, typography, accent and semantic tokens, profile
interaction, state-change pulse, status panel, and responsive layout. The alternatives vary only
connection, containment, or emphasis in the header. Compact mode preserves the identifier and pill
without overflow or collapsing their distinction.

The first Route implementation used solid box-shadow masks to keep a pseudo-element track from
crossing the endpoint content. Those masks appeared as unwanted halos around both endpoints. Route
now renders a real flexible track between the run identifier and status pill, so it fills only the
available space and requires no masking. Wide and compact checks assert that the track remains
visible and both endpoint shadows remain absent. The corrected direction is accepted because it
gives otherwise empty header space a meaningful role while preserving the distinction between run
identity and semantic status.

## Revision 11: Exploration Settled

- Promoted Route into the accepted visual direction and removed Base, Dock, and Beacon from the
  interactive comparison.
- Named the broader principle **continuity without conflation**. Route is one application of the
  principle, not a narrow prescription to connect identity and status in every header.
- Preserved the constraints that make the principle useful: relationship structure organizes
  neutral space, connected elements remain distinct, a cue does not duplicate another cue's job,
  and connection is reserved for relationships that affect interpretation or action.
- Converted the prototype into a single canonical reference and its browser check into an
  acceptance exercise spanning theme, responsive reflow, semantic states, accent propagation,
  profile interaction, validation stability, dialog state, running motion, Route behavior, and
  reduced motion.

## Direct Inspection

The fallback board was rendered at 1800 × 1200 and inspected at full resolution during early
comparison. The accepted interactive prototype was exercised in Chromium through theme, viewport,
state, accent, profile-selection, dialog, review-completion, running-progress, Route endpoint, and
reduced-motion transitions. Focused structural queries reached the dialog, progressbar, form
controls, status, actions, responsive glow owner, and Route track.

## Limitations

The artifact establishes a reusable visual base rather than implementation feasibility or a single
application layout. Typefaces may use local fallbacks, simulator actions are disposable, and
responsive comparison uses a bounded prototype viewport rather than a production layout host.
