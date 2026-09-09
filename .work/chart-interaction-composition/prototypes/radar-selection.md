# Radar selection study

Status: accepted. Whitney approved the spacing correction and continued production work. This is an isolated prototype, not production behavior.

## Decision

Whitney chose Label underline for consistency and accepted the behavior with one correction:
reading centers must match the dotted guide's color. The existing radar renderer uses
`--wcl-text` for both. The revised study preserves that neutral fill and the colored marker
boundary. Highlighted spoke was rejected and removed.

## Design plan

Use the existing radar renderer, vehicle fixtures, profile colors and typography. Colors use
`--wcl-canvas`, `--wcl-surface`, `--wcl-text`, `--wcl-text-muted`, the blue accent `#2878ff`, and
`--wcl-chart-series-2`. The heading uses the body face at 1.5rem; readings and utility labels use
the existing utility face at 0.875rem. The chart is the main comparison, with target and indicator
controls on separate rows. Compact mode stacks the legend. Preserve the renderer's profile
emphasis and brief opacity transitions. Point activation pulses the circle. Dimension activation draws a brief pulse out along the
spoke through its value markers. Both have a static reduced-motion state. The dimension underline is the distinctive cue under comparison.

Critique: a selected spoke can compete with the profile boundary and radial reading line. The
underline avoids that competition and is the chosen treatment.

## Proposed behavior

- Point targets one profile's actual value; Dimension targets all profiles on one spoke.
- Filled centers preview exactly the target. Profile hover remains independent of target mode.
- Legend focus or pinning prioritizes only profiles that overlap the pointer position.
- Ordinary click/tap toggles selection. Modified click/key and touch hold open details independently.
- Whitney requested dimension activation animate the radial guide rather than circles. The revision
  draws a neutral pulse from the center to the furthest actual value on the activated dimension,
  holds briefly at full length, then fades it. Point activation retains its circle pulse.
  The line grows geometrically from the center so stroke-dash scaling cannot shorten its reach.
- A visible rectangle selects value centers inside. In Dimension mode, any included center qualifies
  its dimension. Replace by default, Shift/Control/Command add, Alt removes, Escape cancels.
- Left/Right traverse dimensions, Up/Down switch profiles, Home/End reach endpoints. Enter selects;
  Control/Command-Enter opens details. Focus appears on the current value rather than the chart box.

## Run and inspect

From the repository root:

```sh
npx vite .work/chart-interaction-composition/prototypes/radar-selection --host 0.0.0.0 --port 5181
```

Open <http://localhost:5181/>. Switch Point/Dimension. In Dimension mode, select a value to see
the chosen Label underline. Drag across values to inspect the live rectangle
and provisional selection. Try modified activation, legend emphasis, light appearance and Compact.
Identify elements names the controls, chart, reading, selection summary and details for feedback.

The study reuses the two vehicle profiles and five shared qualities from the component examples.
Direct browser operation exercised keyboard reading/selection and independent details, both
indicators, dragging with visible feedback, and compact/light presentation. Screenshots were
inspected and removed. No tests, agent reviews, or production edits were used for this prototype.

## Accepted production boundary

Whitney approved Label underline, neutral reading fills, radial-guide dimension activation and
scale-aware ring spacing. Zero values may be selected by keyboard or whole-dimension selection;
center clicks do not create ambiguous zero-value targets. The existing visual shoulders remain
non-data geometry. Public selection and callbacks use the existing stable series and dimension IDs.

## Ring-spacing correction and cross-chart audit

Whitney reported a gap between radar's outer highlight and normal marker ring and requested a
check of other charts. Radar's prototype had fixed SVG radii with screen-fixed strokes. Both the
selection ring and reading fill now use the rendered scale and the normal/emphasized border width.
The selection ring meets the colored border; the neutral fill reaches its inner edge with a small
anti-alias overlap. Direct browser inspection covered normal and compact sizes. The existing public
RadarChart reading center also uses a fixed radius and needs this scale-aware treatment in production.

Read-only audit of public renderers and their rendered styles:

- Cartesian line/area/mixed point selection already computes the outer radius from the actual
  point border width. Its reading fill includes a small anti-alias overlap. No analogous spacing
  defect was found in those formulas.
- Scatter, bubble, and box-plot outlier selection uses a fixed two-pixel radius increase. At the
  observed 1.75px normal border, the two-pixel selection stroke leaves a 0.125px radial gap on
  circles. Measured public showcase styles at 1200px and 480px viewports confirm this mismatch.
  Production should use the actual border width for these rings. Noncircular symbols need their
  corresponding contour spacing preserved rather than assuming a circular radius.
- Bubble reading centers intentionally remain small to preserve magnitude encoding. Their interior
  space is not the reported selection-ring gap. Animated activation halos are separate transient
  feedback. Bar/column and histogram/box-summary frames use their established contour treatments.
  The chosen offset outer edge on pie/donut is a different indicator and stays as approved.

[Ticket 10](../tickets/10-marker-ring-spacing.md) corrects the confirmed statistical circle spacing and the existing public radar reading fill. Radar selection/activation remains the next production portion.
