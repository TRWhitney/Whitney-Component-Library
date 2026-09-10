# 31 Make mobile heatmaps usable

**What to build:** Correct the room-temperature examples shown in Whitney's mobile report so their navigation controls are present and the heatmap has enough space for its cells.

**Blocked by:** None.

**Status:** complete

- [x] Both sequential and two-sided room examples enable the approved Overview, zoom/reset, pan and two-finger navigation with selection and visibility.
- [x] Exploration reserves height for source rows and the label/eye header, within the existing bounded frame. Pan, zoom and hiding tracks do not shrink the frame.
- [x] At 390px, controls and complete cells are visible without local scrollbars. Check mobile touch pan/pinch, zoom out, reset, overview and hidden-track restoration on the reported example.
- [x] Keep public contracts and rendered explanations current; verify narrow/wide and light/dark layouts.

## Accepted sources

- Whitney's mobile screenshot and report of a clipped grid, missing controls and unusable navigation.
- [Production exploration boundary](../spec.md#production-exploration-boundary)
- [Heatmap navigation](30-heatmap-exploration.md)

## Completion evidence

Native reproduction at 390px confirms the older room examples omit Overview entirely and overflow their frames. The dedicated navigation example has only a 180px frame, including its 80px header.

The corrected 390px room examples have 308 by 256px frames, all four rows visible, no local scrollbars and visible Overview/zoom/reset controls. The six-room exploration example reserves 344px. Native touch pinch and pan change the window without selecting; zoom out, reset, dialog focus, hiding and restoration keep frame dimensions stable. Dark mobile and light wide screenshots were inspected.

The 21 focused heatmap exploration/visibility tests pass. `npm run check` passes all 841 tests, formatting, lint, public types, generated guides, TypeScript 5/6/7 and chart isolation. `npm run verify:package` passes packed React 18.3.1 and 19.2.8 SSR, hydration, types and browser builds. The showcase build and mobile geometry checks pass. Independent intent and engineering review passes with no findings. Public mobile taps on Zoom in, Zoom out, Overview and Done also pass. The height regression is checked through rendered browser geometry because DOM-only tests do not perform CSS layout.
