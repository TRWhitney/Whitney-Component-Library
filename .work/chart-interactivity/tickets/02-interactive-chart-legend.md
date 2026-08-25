# 02 Interactive chart legend

**What to build:** Series emphasis and pinning through the existing Cartesian legend, coordinated
with shared chart readings without hiding data or changing domains.

**Blocked by:** [Shared chart reading](01-shared-chart-reading.md)

**Status:** complete

- [x] Each legend entry is a real button within the existing semantic list and retains the series
      color, pattern, point, label, and optional unit cues.
- [x] Hover and focus temporarily emphasize the corresponding series and softly de-emphasize the
      others without making them disappear.
- [x] Click, Enter, and Space pin or unpin emphasis with accurate `aria-pressed`; Escape clears the
      pinned state.
- [x] Pinned emphasis takes precedence over transient plot-mark emphasis and emphasizes the matching
      row while shared tooltips continue to report every series.
- [x] Legend interaction never hides a series, changes a scale domain, or emits a consumer action.
- [x] Light, dark, forced-colors, focus, reduced-motion, compact-scroll, server-rendering, and
      hydration behavior remain correct.
- [x] Public docs, showcase coverage, focused interaction tests, and full package verification pass.

## Accepted sources

- [Accepted specification](../spec.md)
- [Accepted interaction prototype](../prototypes/chart-reading-interactions.md)
- [Shared chart reading](01-shared-chart-reading.md)

## Completion evidence

Focused interaction coverage passes for transient emphasis, pinning, precedence, Escape, retained
marks, server rendering, and hydration. Direct Chromium inspection confirms legend and direct-line
emphasis remain coordinated with the shared reading. The complete repository check passes.
