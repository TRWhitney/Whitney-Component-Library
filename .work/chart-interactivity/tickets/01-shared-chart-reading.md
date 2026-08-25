# 01 Shared chart reading

**What to build:** Default category-level pointer, keyboard, and touch reading for every ready
Cartesian chart, with a chart-owned structured tooltip, reading needle, value nodes, and equivalent
accessible announcements.

**Blocked by:** none

**Status:** complete

- [x] Pointer movement anywhere in a valid plot resolves to the nearest recorded category without
      interpolation and displays every series label, numeric value-axis reference line, and
      formatted value.
- [x] The reading needle and value nodes align with actual displayed values; normalized and stacked
      layouts report the intended non-cumulative values.
- [x] A directly hovered mark can emphasize its series while preserving the complete shared reading.
- [x] One chart boundary exposes the localized data-view accessible name; orientation-appropriate arrow
      keys, Home, End, and Escape operate the reading without creating a focus stop per mark.
- [x] A polite announcement communicates the same category and series values shown visually, while
      the complete generated data table remains available.
- [x] Touch selection persists, another category replaces it, and a press outside the chart dismisses
      it.
- [x] Mouse tooltips follow the cursor in a fixed overlay and flip at viewport edges. Keyboard and
      touch tooltips anchor to the selected category. Tooltip presence never changes chart scrolling.
- [x] Loading, empty, error, partial, and invalid data states preserve their existing behavior.
- [x] Light, dark, forced-colors, focus, and reduced-motion behavior preserve legibility and non-color
      series distinctions.
- [x] Public docs and the component showcase explain and demonstrate shared reading without adding
      prototype controls or chart-adjacent application composition.
- [x] Focused tests plus package build, check, server rendering, hydration, generated-table, and
      chart-isolation verification pass.

## Accepted sources

- [Accepted specification](../spec.md)
- [Accepted interaction prototype](../prototypes/chart-reading-interactions.md)
- [Cartesian chart foundation](../../library-foundation/tickets/19-cartesian-chart-foundation.md)

## Completion evidence

Focused interaction coverage passes for pointer, keyboard, touch, reference-line readings,
viewport tooltips, non-ready states, tables, server rendering, and hydration. Direct Chromium
inspection confirms cursor-following shared readings remain outside chart overflow. The complete
repository check passes.
