# Changing chart membership and order

## Accepted decision

The [value-change motion](value-motion.md#acceptance-contract) is approved. This study asks whether surviving items should move by identity while new and removed items fade, and whether donut rank changes should crossfade rather than sweep slices through one another. Columns, bubbles and a donut appear together. Status: accepted. Whitney approved the corrected study with "these look good".

Whitney requested continuing automatically after approval, without waiting for another prompt. Continue accepted work until a new unresolved decision requires input. Prototype work still uses no subagents or production regression tests.

## Acceptance contract

- Columns move with their category labels when the order changes. The existing category underline follows the selected building.
- Bubbles keep their positions when only input order changes. Changes to their values and the automatic axes move together.
- New buildings fade in and removed buildings fade out. Departing marks are not interactive. Retained selection uses the existing item identity; removed items follow native selection removal.
- The donut maintains building colors by identity in this fixture. Adding or removing a building adjusts the remaining shares. When surviving categories change rank, crossfade their old and new arrangements so moving arcs do not sweep through each other.
- Numeric changes use the accepted 240 ms ease-out movement and retarget from the current displayed state. Instant and reduced motion settle directly. No automatic update loop or entrance animation is added.

The design reuses the earlier study's canvas, surface, text, muted text and border tokens, accent `#2878ff`, existing series colors, body headings and controls, and utility axes/readings. The three chart choices and Animated/Instant comparison each occupy their own row. Data actions wrap above the chart on mobile. The distinctive comparison is identity-preserving movement against a donut rank crossfade, with native selection indicators retained.

This acceptance binds the demonstrated behavior, not the prototype architecture. It uses isolated Vite adapters and temporary, non-interactive SVG copies for departures. Existing accepted chart behavior outside these data transitions remains authoritative. Fixture counts, copy and adapter code are flexible. Empty datasets, missing-value topology changes, paged radial expansion and navigation during an update are outside this study.

## Run

Source: [data-transitions](data-transitions/main.tsx). Four initial buildings have supplied energy, temperature and occupancy. Annex and Studio are available additions. Add building can expand the scale; Remove largest can contract it. Columns reverse category order, bubbles reverse their source list, and the donut swaps the largest and smallest values to change ranks. Donut Update values changes the relative shares while preserving rank order; it must not multiply every category uniformly.

```sh
./node_modules/.bin/vite .work/chart-interaction-composition/prototypes/data-transitions --config .work/chart-interaction-composition/prototypes/data-transitions/vite.config.ts --host 127.0.0.1 --port 5192
```

Open <http://localhost:5192>.

Adapters target production `f3087f9` and do not affect its normal build. This study imports the retained value-motion study's base CSS.

## Direct operation

At 390px, operated Add building, Remove largest, Reverse order or Swap ranks, Update values and Reset data across all three charts. Observed fading departures, changing scales and crossfading donut ranks. Selected North in columns, reversed the order and observed its underline remain attached; removing North cleared that selection. Reversing the bubble input list left North at the same plotted X position. A second update interrupted the first and left no departing marks after settlement. Checked Instant, reduced motion, Identify elements and the light appearance at 1200px. The page stayed within the mobile viewport.

Inspected compact dark, wide light, reorder and removal screenshots. Screenshots were removed after inspection. No production files, regression tests or subagents were involved.

Whitney reported that donut Update values left slice sizes unchanged. Direct operation reproduced identical angles before and after because all values used the same multiplier. The corrected fixture changes relative shares without reordering. Repeating the action showed intermediate and final angle changes, with North growing from about 35.7% to 46.7%. The updated compact rendering was inspected and its screenshot removed.
