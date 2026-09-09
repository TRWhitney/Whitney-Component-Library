# Sparkline selection study

Status: approved by Whitney, including compact marker clarity and recorded-value-only targeting. This study remains isolated from the public API.

## Question

Do point selection rings and the established activation pulse stay clear at Sparkline size while
preserving its existing latest, low and high cues? The study compares compact/wider presentation,
seven daily readings or 24 hourly readings, and an optional missing reading.

## Design plan

Reuse the production Sparkline geometry, numeric range, cue fills and reading behavior. The existing
blue `#2878ff` line and cue outlines remain; selection and activation use `--wcl-text`. The page uses
`--wcl-canvas`, `--wcl-surface`, `--wcl-border` and `--wcl-text-muted`. A 1.5rem body-font heading
introduces the study; 0.875rem utility text reports the reading below the chart. Controls wrap above
the example. The point rings surround existing high/low/latest symbols; ordinary selected points
receive a base circle. Activation imports the shared production radius/lifetime behavior. Dragging
has a visible range rectangle and reduced motion retains static feedback.

Critique: low/high half fills already have meaning, so selection must surround those marks without
replacing their fills. Floating tooltips cover too much of the miniature plot during this comparison;
the study uses a reading below it. That placement is a prototype aid, not a production decision.

## Accepted behavior

- Click/tap toggles a recorded value. Control/Command-click or touch hold opens details independently.
  With selection disabled, ordinary click/tap opens details.
- Horizontal dragging selects recorded values between the start and end positions. Shift or
  Control/Command adds, Alt removes, and Escape or pointer cancellation cancels the preview.
- Arrow keys read values; Home/End reach endpoints. Enter/Space selects, with Control/Command for
  independent activation. Without selection, Enter/Space activates.
- Selection rings preserve low/high/latest cues. Ordinary points receive a filled reading center
  when targeted. Activation uses the shared point pulse. There is no whole-chart focus outline.
- The optional missing reading stays readable as a gap. This study selects and activates recorded
  numeric values only. Missing readings remain outside selection and activation.
- Identify elements names controls, chart readings, selection summary and opened details.

## Run

```sh
npx vite .work/chart-interaction-composition/prototypes/sparkline-selection --host 0.0.0.0 --port 5183
```

Open <http://localhost:5183/>. Try Tue and Fri highs, Wed low and Sun latest. Drag from Tue through
Fri. Compare Compact, More readings, Include a gap and Light appearance. Enter or Control/Command-
Enter provides the same selection/activation split from the keyboard.

Direct operation exercised selection, activation, visible range dragging, keyboard endpoint
activation and touch hold without changing selection. Alt-drag removal preview and Escape restoration
were also exercised. Compact dark and dense light states were visually inspected; screenshots were removed. The study remains isolated and uncommitted.
No production tests or agent reviews were run.
