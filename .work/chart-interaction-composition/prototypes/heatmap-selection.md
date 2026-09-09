# Heatmap selection study

Status: Cell frames and missing-cell interaction accepted. Shared production activation motion is
applied. Dashed inner hover outlines are approved and applied to this study. This isolated prototype does
not implement public Heatmap interaction.

## Accepted choices

Whitney chose Cell frames for persistent selection. Connected outline was rejected and removed.
Selection keeps each cell's numeric color encoding. Box touched dragging and independent activation
follow the established chart conventions. The former stationary activation fade was rejected;
the study now imports the production outline pulse and its lifetime directly.

Whitney accepted selection and activation of missing cells using their row and column IDs.
Their value remains absent, not zero, and an absent source record is not invented. Zero remains
an ordinary numeric value. The rejected read-only option has been removed from the prototype.
Whitney approved a dashed inner reading outline for hover, matching other rectangular marks.
Solid cell frames remain the persistent selection indicator. The production implementation carries over the same dashed outline.

## Design plan

Use the existing Heatmap grid, rectangular cells, missing-value pattern and numeric color scale.
Colors use `--wcl-canvas`, `--wcl-surface`, `--wcl-text`, `--wcl-text-muted`, `--wcl-border` and
blue `#2878ff`. Body headings are 1.5rem; utility readings and labels use the established utility
face at 0.875rem. Controls occupy their own rows above the grid. Readings, selection summary and
application-owned details sit below it. Activation uses the shared 620ms production outline pulse, a five-pixel outset, and three pixels
of outward edge travel, with static feedback for reduced motion. Individual cell frames are the
chosen selection treatment. Hover uses a two-pixel dashed inner outline in `--wcl-text`.

Critique: a selection tint would change the apparent value, and circular markers would introduce
an unrelated shape. Keep the chosen outline neutral and preserve the cell gaps and inner reading
outline. There is no whole-chart focus border. The prototype's fixed reading text below the grid
makes feedback easier to compare; production retains the existing tooltip placement behavior.

## Proposed interaction

- Ordinary click/tap toggles a cell. Control/Command-click or touch hold activates independently.
- With selection disabled, ordinary click/tap activates.
- A visible rectangle selects cells whose boxes it touches. Replace by default, Shift or
  Control/Command adds, Alt removes, Escape or pointer cancellation restores the prior selection.
- Arrow keys move between cells. Home/End reach row endpoints; Control/Command-Home/End reach
  grid endpoints. Enter/Space selects; Control/Command plus Enter/Space activates.
- Row and column IDs identify cells. This prototype does not add whole-row/column targeting.
- Zero and missing cells remain targets. Missing cells retain row/column identity and no recorded value.

## Run and inspect

```sh
npx vite .work/chart-interaction-composition/prototypes/heatmap-selection --host 0.0.0.0 --port 5182
```

Open <http://localhost:5182/>. Select adjacent cells, then drag across a block. Activate the top-left zero or patterned missing cell. Compare Light appearance, Compact
and More cells. Identify elements names controls, cells, current reading, selection summary and
activated details without changing the layout.

Direct browser operation exercised both indicators, a visible drag box, cancellation, independent
activation on zero, keyboard navigation/selection, compact light rendering and missing values.
The dashed hover revision was directly inspected on a selected numeric cell in dark mode and a
missing cell in compact light mode. Hover stays dashed while selection stays solid.
Screenshot states were inspected and removed. No prototype tests or agent reviews were run.
The public interaction implementation is tracked in [Ticket 13](../tickets/13-heatmap-interaction.md).
