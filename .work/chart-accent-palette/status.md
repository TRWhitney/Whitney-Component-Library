# Chart accent palette prototype

## Destination

Give charts an accent-derived, role-aware categorical palette, legible text, and collision-free
automatic colors in mixed explicit and automatic configurations.

## Current state

Validation is complete. In addition to preserving readable compact text and line layering,
categorical ticks shorten labels within their available plot space, retain a distinguishing final
word, and expose the full value in both the native SVG title and generated data table.

## Progress

- Whitney accepted role-aware orbit over the fixed and tonal palettes after identifying two
  failures in plain hue orbit: near-neutral accents collapse the orbit, and strong filled marks can
  obscure line series.
- The revised prototype compares Current, Hue orbit with a neutral fallback, and Role-aware orbit.
  Role-aware orbit softens filled marks and strengthens line strokes.
- The prototype owns its appearance and accent controls and does not enter the component showcase.
- A six-series mixed Cartesian chart and palette strip expose the decision under realistic marks.
- Chromium operation confirms that black, near-black, near-white, white, blue, and red accents each
  produce six distinct colors. Neutral fallback copy appears for the four neutral cases. Role-aware
  orbit changes bar fill independently from its outline and raises line width from 2px to 2.5px.
  The page contains at 700px, and the 640px chart canvas scrolls inside its own region.
- Production now reserves explicit ordinary colors before assigning automatic colors, so the mixed
  bar-and-line chart no longer receives the same color twice by accident.
- Chart ticks and axes use a 16px compact-region rule, annotation labels use 14px type, and legends
  use 14px type. Wider plots step down because SVG text scales with the plot; observed tick glyphs
  remain 14px high in both the 492px and locally scrolling 480px showcase presentations.
- Charts preserve a 480px minimum plot with local scrolling by default. Categorical `tickCount`
  limits visible labels without removing data, and filled marks are painted before all line marks
  regardless of the consumer's series order.
- The prototype again preserves three honest comparison modes: fixed current colors, plain hue
  orbit, and the accepted role-aware orbit.
- Long horizontal and vertical category labels are density-limited and shortened against their
  actual tick spacing. The expanded axis margin keeps vertical category labels clear of the plot.

## Frontier

Delivery correction review and commit.

## Accepted sources

- [Current Cartesian chart foundation](../library-foundation/tickets/19-cartesian-chart-foundation.md)
- [Prototype record](prototypes/accent-derived-chart-colors.md)

## Verification

- `npm run build && npm run check` passes after the long-label correction: formatting, ESLint,
  Stylelint, TypeScript, 438 tests, generated-file verification, TypeScript declaration matrices,
  and chart-bundle isolation.
- The focused Cartesian suite passes 12 tests after first observing the long-label regression fail.
- Direct Chromium inspection at the 480px minimum canvas finds representative long labels inside
  the SVG bounds and separated from adjacent labels for both LineChart and BarChart in light and
  dark appearances. Labels such as North, West, Southeast, and Remote remain distinct after
  ellipsis, single-token labels with shared prefixes retain distinct endings, and non-categorical
  formatted ticks such as `10.0 energy` remain complete.
- The isolated prototype production build passes with
  `npx vite build .work/chart-accent-palette/prototypes/accent-derived-chart-colors`.
- Direct Chromium inspection of the reported line-chart showcase case finds 14px-high tick glyphs
  at both 492px and 318px pane widths. The compact pane uses a 480px locally scrolling canvas, so
  its labels no longer collapse. Both screenshots were inspected for readability and clipping.
- Direct Chromium inspection of the role-aware prototype finds six distinct rendered swatches for
  black, near-black, near-white, white, and red accents in both appearances. The rendered mark order
  is area, column, then four lines. Light/black and dark/red screenshots were inspected: boundaries,
  lines, labels, and annotations remain legible without filled marks obscuring line series.
- Direct interaction confirms that Current retains fixed colors and 2px lines, Hue orbit derives
  color while retaining the old mark treatment, and Role-aware orbit uses 1.75px filled-mark
  boundaries, 18% area fill, and 2.5px lines.

## Out of scope

- A separate redesign of line-only charts
- New chart interactions, layout models, or semantic tone behavior

## Continuation

- Branch: `master`
- Base commit: `5e47062` (`[Feature] Add Cartesian chart foundation`).
- Owned uncommitted paths: `.work/chart-accent-palette/`, `docs/components/*chart.md`,
  `showcase/showcase.tsx`, `src/appearance/`, `src/charts/cartesian-chart.tsx`,
  `src/contracts/chart.contracts.ts`, `src/styles.css`, and the chart-related tests.
- Resume with
  `python3 /home/trwhitney/.codex/skills/work-system/scripts/navigate.py resume novel-work implementation`.
- Next action: complete correction review and commit.
