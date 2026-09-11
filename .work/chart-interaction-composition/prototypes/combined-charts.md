# Combined chart study

## Status

Accepted. Whitney: "Okay, in that case I approve of the prototype." Approval followed the data and pan-button revision and the discussion of one range selection producing two outer rings.

## Decision

Do the existing selection and activation cues remain clear when observations share a chart with a line, and when a measured line overlaps a separately selectable changing range?

Whitney confirmed that the range carries distinct information and should be separately selectable with its own details. Applications supply the line and both limits. The chart does not calculate a range from the line.

The study contains both additions. The range uses the existing upper value marker plus a matching lower marker and a connecting stem at the selected month. Its reading and details show both limits. Whole-month targeting preserves the existing label underline and reading fills. Drag selection currently follows existing value-marker targeting, using the upper range marker. This is an incidental adapter behavior, not an approved change to selection semantics.

Scatter observations and target samples retain separate stable IDs. The supplied target joins only its own samples. Hovering/clicking near a target segment resolves to its nearest visible supplied sample. Legend priority remains limited to overlap. The target has its own eye, line swatch, selection and detail event. Both combinations reuse production navigation, selection and touch handling through isolated Vite adaptations.

## Visual direction

Keep the library canvas/surface, text/muted-text and border tokens. Measured values use `accent`; the separate range/target uses `series-2`. The provider accent is `#2878ff`. Names and controls use the body face; axes, ranges and readings use the utility face. The heading is 1.5rem. Put each segmented choice on its own row. Keep the approved quiet Overview icon and existing Dialog, shared activation motion, and reduced-motion behavior.

The distinctive addition is the paired limit marker, not a new set of controls. Identify elements names plot, legend and controls without changing their layout. No new UI style, animation family or second permanent chart is introduced.

## Acceptance contract

### Precedence and scope of approval

Whitney explicitly requires that behavior or styling not under scrutiny in this study must not supersede previously accepted behavior consistent across charts. Earlier accepted interaction, visibility, navigation, indicator, motion, accessibility and responsive contracts remain authoritative. The prototype establishes only the new combinations and the deliberately reviewed changes: independent range selection with connected endpoint rings, and the revised Up/Down placement. Fixture variation was also requested.

Do not promote adapter limitations, incidental hit testing, sizing, colors, animation or other unreviewed differences into production requirements. Reuse the established behavior. If a new combination requires a substantive exception, identify that exception explicitly rather than treating prototype approval as permission for it.

### Binding qualities

- Keep both combinations in one reviewable set of examples, with their series independently readable, selectable, activatable and hideable.
- A selected range at one month is one item with two outer selection rings, one at each limit, joined by the demonstrated stem. Keep the connector: it identifies the two marked endpoints as one selected interval. Reading and details name both limits.
- Preserve the established individual-value and whole-month selection conventions, including the month underline and scatter Centers inside selection. The adapter's upper-marker-only range drag behavior is not independently approved. Determine range targeting from the prior contracts, and explicitly resolve any necessary new exception.
- The supplied scatter line joins its own samples. It does not connect observations or calculate a trend. Preserve stable IDs, existing line reading/selection conventions and overlap-only legend priority. The adapter's segment-targeting implementation is not a new interaction contract.
- Keep the demonstrated standard click/tap selection, Control/Command activation, touch hold, visible drag previews, keyboard paths and two-finger navigation. Reuse shared activation motion and reduced motion.
- Keep the icon-triggered modal Overview: a rectangular map for scatter with a line and a horizontal strip for line with a range. Hidden series leave the plot and overview together.
- In the scatter combination, stack Up above Down beside the plot. Reserve space for them without covering data or clipping the controls. Left/Right stay in their horizontal positions.
- Preserve compact label fitting, the established palette and typography, light/dark appearance, and separate rows for segmented choices. Keep the more varied fixtures useful for judging overlap and range crossings.

### Flexible qualities

Exact fixture values and labels, internal implementation, and the precise gutter measurement can change while preserving these relationships. The Vite transformations are prototype adapters, not a production architecture. Missing/invalid data behavior and public type boundaries still need implementation planning against existing contracts.

## Source and operation

[Source](combined-charts/main.tsx), [isolated renderer adaptations](combined-charts/vite.config.ts), [styles](combined-charts/styles.css).

```sh
./node_modules/.bin/vite .work/chart-interaction-composition/prototypes/combined-charts --config .work/chart-interaction-composition/prototypes/combined-charts/vite.config.ts --host 127.0.0.1 --port 5190
```

Open <http://localhost:5190>. The source contains twelve monthly measured/lower/upper values, 38 observations and eight separate target samples. No account or external data is needed.

## Data and pan-control revision

Whitney requested more interesting data and corrected up/down button placement. The scatter fixture now follows a heating/cooling curve with mild-weather clusters, a high-use outlier and repeated coordinates. The monthly fixture crosses in and out of a changing seasonal range. These remain supplied study data.

Up and down are stacked in that order beside the plot, in a reserved 36px gutter. Left and right retain their horizontal positions. At 390px both vertical buttons are visible and tappable; Up raises the displayed energy interval and Down reverses it. Compact dark and wide light layouts were inspected. This placement is part of the approved prototype.

## Operated flows

At 390px, selected a target sample and opened its details with Control-click. Hiding Target removed its line; restoring returned it. Its rectangular Overview includes the target. Selected June's expected range and opened details showing both limits. Inspected the paired range markers in light appearance at 1280px and the changing range in its horizontal Overview.

Dragged selections in both views and observed the preview rectangles. Pinch changed both scatter axes and the range chart's months. Whole-month dragging showed six preview underlines. Touch hold on June's band opened its two limits. Hide/restore and both overview dialogs were operated. The mobile document remains 390px wide. Identify elements reports the focused Overview control.

This is direct prototype operation, not production validation. No production files were edited, no regression suite was run and no subagents were used. New API types, data validation, missing-value combinations and broad consumer coverage belong to later implementation. The adaptations and fixture calculations must not be copied into production as its public boundary.

## Historical reproduction

The retained Vite adapters target production base `9baab9c`. Rebuild this study from an isolated checkout of that base with the retained prototype source. The production showcase now demonstrates the public implementations; subsequent renderer changes need not preserve the study adapters.
