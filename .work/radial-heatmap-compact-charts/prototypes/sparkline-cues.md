# Sparkline cue prototype

## Question

Which static point cues should Sparkline show when no reading is active?

## Possibilities

- **Line only:** Show the recorded shape without a persistent point marker.
- **Current endpoint:** Fill the final recorded point so the latest value has a stable visual
  anchor.
- **Current and observed range:** Fill the final point and add hollow markers at the lowest and
  highest recorded values.

Every option keeps the accepted standard visible caption. The factual description already reports
the current, low, and high values, so the marks supplement that text rather than replace it.

## Authority boundary

The artifact renders the production LineChart. LineChart owns the standard caption, figure,
categorical and numeric scales, series color, line and point mark shapes, focus boundary, pointer
and keyboard reading, retained touch reading, viewport tooltip, announcement, feedback states, and
generated table.

Prototype code identifies the current, lowest, and highest production point marks and changes only
which are visible at rest. A direct reading still uses LineChart's production reading node. The
fixture, controls, hidden axes, cue selection attributes, and element-identification labels are
non-production.

LineChart still reserves normal axis margins after the prototype hides its axes. Its 4:1 ratio and
40px canvas minimum remain temporary. This comparison does not decide missing-value rendering,
final minimum size, internal geometry, or a public option for selecting cues.

## Compact design plan

- Colors use `--wcl-canvas`, `--wcl-surface`, `--wcl-text`, `--wcl-text-muted`,
  `--wcl-border`, and `--wcl-accent-rail`. Point cues use the production series color and surface
  fill.
- The accepted chart caption keeps its body type. Controls and values use the library utility face
  with tabular numbers.
- One standard-caption thermal-demand chart is the decision surface. Controls sit above it and an
  explicit review boundary sits below it.
- Switching cue treatments is immediate. Production reading and focus transitions remain
  unchanged, and plot geometry does not animate.
- The distinctive detail is the filled current point against hollow observed-range points. It
  carries time position and range without adding a second color or a miniature axis.

This plan stays inside the established chart mark language. It adds no labels, gradients,
decorative motion, or new semantic colors.

## Run

```text
npx vite .work/radial-heatmap-compact-charts/prototypes/sparkline-cues --host 127.0.0.1
```

Open the printed local URL. Switch among Line only, Current endpoint, and Current and observed
range. Adjust width, use both appearances, and focus or point at the plot to distinguish the static
cue from the production reading node. Turn on Identify regions when naming feedback.

## Decision evidence

The artifact passes a production Vite build and a prototype smoke pass. The smoke pass switches all
three cue treatments, confirms the accepted caption stays visible, changes available width, uses
both appearances, enables region identification, moves the production keyboard reading to the
last record, opens the production tooltip, and confirms the complete generated table remains
present.

Direct visual judgment remains open. Compare whether the persistent cues improve interpretation or
merely add noise, especially at narrow widths.

Whitney could not see a difference between the first set of options. That revision revealed the
production LineChart's minimum 3.25px point circles inside the compact scaled plot. The mode and cue
attributes changed correctly, but the smoke pass did not test whether the marks carried enough
visual weight. The current revision uses deterministic display rules, a filled 6.5px current point,
and hollow 5.5px low and high points. It does not change the line, caption, data, or reading path.

After reviewing the revised comparison, Whitney selected Current and observed range.

## Proposed acceptance contract

### Binding qualities

- Sparkline shows static marks at the current record and every record tied for the lowest or
  highest valid value in the displayed sequence.
- The current mark is filled and visually strongest. Lowest and highest marks are hollow and use
  the same series color and point language. If the current record is also an extreme, the filled
  current treatment takes precedence on that one mark.
- The cues supplement the accepted visible description, tooltip, reading announcement, and table.
  They do not add persistent value labels or replace exact text.
- The cues stay visible when no reading is active. Production reading nodes may temporarily appear
  at any record without removing or changing the static cues.
- Light, dark, forced-color, focus, and reduced-motion behavior retain the chart family's existing
  conventions. The static cues do not animate.

### Flexible qualities

- Exact marker radii and stroke multipliers may change enough to fit the production Sparkline scale,
  but the filled-current and hollow-extrema hierarchy must remain plainly visible.
- Thermal-demand copy and records, the prototype accent, controls, identification labels, and
  demonstration layout are disposable fixtures.
- Cue-selection attributes, CSS display rules, hidden-axis padding, the 4:1 aspect ratio, and the
  40px minimum are prototype techniques rather than production instructions.
- Final minimum size and production plot geometry remain unresolved and will receive separate
  review.

## Status

Accepted. Whitney confirmed the contract above. Current and observed range is binding; Line only
and Current endpoint remain rejected comparison evidence.
