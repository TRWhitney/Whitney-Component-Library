# Sparkline caption prototype

## Question

How much visible caption should Sparkline own when it appears beside a current metric value?

## Possibilities

- **Embedded:** Consumer-owned visible text supplies the metric name, time span, and current value.
  Sparkline keeps its required title and description for accessible naming but does not repeat them
  visually.
- **Compact caption:** Sparkline shows one visible line containing the metric name and current value.
  Its longer factual description remains available to assistive technology.
- **Standard caption:** Sparkline renders the chart family's existing visible title and description.
  This is the established chart convention and the size reference for the comparison.

## Authority boundary

The artifact renders the production LineChart. LineChart owns the figure, categorical and numeric
scales, series color, line mark, focus boundary, pointer and keyboard reading, retained touch
reading, viewport tooltip, announcement, feedback states, and generated table.

Prototype code owns only the visible caption treatment, hidden axes, compact canvas size, fixture
data, comparison controls, and element-identification labels. The production LineChart still
reserves its normal internal axis margins after the axes are hidden. That padding is a known
prototype limitation and is not a proposed Sparkline measurement. Missing-value gaps, endpoint and
range cues, and final minimum size are accepted or later questions, not part of this comparison.

## Compact design plan

- Colors use `--wcl-canvas`, `--wcl-surface`, `--wcl-text`, `--wcl-text-muted`,
  `--wcl-border`, and `--wcl-accent-rail`. The prototype adds no chart colors.
- Metric names use the library body face at 0.875rem and 700 weight. Values and short utility copy
  use the utility face with tabular numbers. The standard caption remains untouched.
- One thermal-demand row is the decision surface. Controls stay above it, and explanatory copy
  stays below it. The available-width control exposes wrapping and cramped caption behavior.
- Production focus, tooltip, legend, and reduced-motion behavior remain unchanged. Plot geometry
  does not animate. Switching a comparison replaces the caption treatment immediately.
- The signature element is the compact metric register: a precise current value aligned with its
  recorded history, using the same restrained line treatment as the chart family.

The plan follows the existing instrument-like chart language. It avoids new containers, decorative
color, and dashboard layout because none of those help decide caption ownership.

## Run

```text
npx vite .work/radial-heatmap-compact-charts/prototypes/sparkline-caption --host 127.0.0.1
```

Open the printed local URL. Switch among Embedded, Compact caption, and Standard caption. Adjust
the available width, use both appearances, and focus or point at the plot to confirm that the
production reading behavior remains intact. Turn on Identify regions when naming feedback.

## Decision evidence

The artifact passes a production Vite build and a prototype smoke pass. The smoke pass switches all
three caption treatments, changes the available width, uses both appearances, enables region
identification, moves the production keyboard reading with ArrowRight, opens the production
tooltip, and confirms the complete generated table remains present.

Whitney selected Standard caption because it looked better than the compact alternatives. The
Embedded comparison also broke when its internal available width became narrower than its two
minimum-width columns. Its viewport media query did not respond to the simulated component width.
That is a prototype defect, not evidence that an embedded production composition could never work.
Whitney did not need it repaired because Standard caption was preferable on its own merits.

## Proposed acceptance contract

### Binding qualities

- Sparkline renders the chart family's standard visible title and one-sentence description above
  the plot, with the same caption typography, spacing, naming, and state relationship as other
  charts.
- Title and description remain required and visible in compact, wide, light, and dark uses.
- Sparkline retains its accepted chart reading, tooltip, focus, touch, announcement, feedback, and
  generated-table behavior. The caption choice does not create a reduced interaction model.
- Sparkline omits visible axes and a legend because it contains one compact series. That absence is
  part of the earlier accepted Sparkline contract, not a consequence of the prototype CSS.

### Flexible qualities

- Thermal-demand copy and records, the prototype accent, comparison controls, identification
  labels, and demonstration layout are disposable fixtures.
- LineChart's hidden-axis padding, the 4:1 prototype aspect ratio, the 40px canvas minimum, and the
  prototype CSS are not production measurements or implementation instructions.
- Endpoint cues, range cues, and the final minimum legible size remain unresolved and will receive
  separate review.

## Status

Accepted. Whitney confirmed the contract above. Standard caption is binding; Embedded and Compact
caption remain rejected comparison evidence.
