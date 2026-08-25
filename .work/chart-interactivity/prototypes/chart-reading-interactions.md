# Chart reading interactions prototype

## Question

Should pointer reading snap to the nearest category and report every series, or should it activate
only the mark directly under the pointer?

## Possibilities

- **Shared reading:** Any pointer position inside the plot selects the nearest category. A reading
  needle and value nodes connect the tooltip to the recorded data. The tooltip lists all series and
  emphasizes the directly hovered series when there is one.
- **Direct marks:** Only a line, point, area, or bar can open the tooltip. The tooltip reports one
  series value and follows that mark. This is quieter but makes thin and overlapping marks harder to
  acquire.

Both modes use the same legend behavior. Hover or focus emphasizes one series. Click, Enter, or
Space pins that emphasis; repeat the action or press Escape to clear it. Keyboard focus on the plot
uses Left, Right, Home, and End to traverse recorded categories. Direct marks also uses Up and Down
to move among series. A touch press performs the corresponding pointer reading and remains until
another reading or Escape replaces it.

## Design plan

- Colors: `--wcl-surface`, `--wcl-surface-raised`, `--wcl-text`, `--wcl-text-muted`,
  `--wcl-accent-focus`, and the existing role-aware series tokens.
- Type: body text names the chart and interaction; utility text carries categories, series labels,
  and exact formatted values.
- Layout: the tooltip floats inside the chart region. It does not add a card or side panel. Legend
  items remain in their existing row and gain emphasis and pin states.
- Motion: opacity, outline, and line-weight changes settle over one short interval. Reduced motion
  removes the transition without changing state.
- Signature element: a thin reading needle with small value nodes ties a category-level tooltip to
  the actual plotted values.

## Run

From the repository root:

```sh
npx vite .work/chart-interactivity/prototypes/chart-reading-interactions
```

Open the printed local URL. Use the Palette behavior control to switch modes. Use Identify regions
to reveal stable region names on hover and keyboard focus.

## Status

Accepted. Whitney chose shared reading because the entire plot becomes a reliable hit region, line
segments do not require exact pointer placement, and one tooltip supports comparison without
inventing interpolated values. Direct-mark reading remains a useful contrast in this artifact, but
it will not become public configuration.

The production interaction keeps the shared category tooltip, reading needle, and all-series value
list. The supporting prototype conventions are also accepted: legend emphasis with click-to-pin,
one keyboard stop for the plot, category traversal with arrow keys, and persistent touch reading
until another category is selected or a press outside the chart dismisses it.

Implementation review exposed one prototype mistake. Keeping the tooltip inside the chart canvas
could change the chart's scroll area and cover marks without giving the reader a way to move it.
Production instead uses a fixed provider-level overlay. Mouse placement follows the cursor and
flips at viewport edges; keyboard and touch placement remains category-anchored.

The prototype remains a planning artifact, not production implementation.

## Direct inspection

- Shared reading selects the nearest recorded month from empty plot space or a mark, places the
  reading needle at that month, shows all three values, and emphasizes a directly hovered series.
- Direct marks opens only from a mark or enlarged line hit path and shows one value.
- Legend hover and focus emphasize a series. Click, Enter, or Space pins it; Escape clears it.
- Plot focus reads the first month. Left, Right, Home, and End traverse months. Direct mode also uses
  Up and Down to change series.
- The tooltip flips before the right plot edge. A 610px compact region retains its 640px scrolling
  canvas, readable chart text, and a contained tooltip.
- Touch press selects and retains a reading. Production will dismiss that reading when the consumer
  presses outside the chart.
