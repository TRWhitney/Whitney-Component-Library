# 11 Make keyboard exploration a chart default

**What to build:** Enable keyboard pan and zoom plus focused mouse-wheel zoom by default for explorable charts, both on the canvas and on their exploration buttons, while preserving keyboard access to readings and activation.

**Blocked by:** none.

**Status:** complete

## Evidence and client boundary

Chart canvas arrow keys currently navigate readings. The overview's window supports keyboard exploration, but the canvas itself lacks matching pan and zoom shortcuts. A user focused on the chart cannot use arrows as equivalents of its pan buttons.

The app now handles unmodified arrows on the focused chart canvas or its exploration buttons by invoking its correspondingly named rendered buttons. Plus or equals zooms in, minus zooms out. Distribution uses four directions; Monthly uses left and right for its categorical month axis. Shift plus arrows leaves the existing reading navigation available; Enter still inspects the reading. Enter and Space still activate focused buttons. Legends, menus, editable fields, and overview dialogs retain their own keyboard behavior. The app also restores canvas focus if executing a command disables its focused button and the browser drops focus onto the document. This semantic-label bridge shares the native commands' steps and domain limits but should become a public chart contract.

## Acceptance

- [x] Enabling chart exploration enables keyboard pan and zoom by default. Consumers do not need event wrappers, synthetic button clicks, or additional opt-in flags.
- [x] Arrows map to available pan directions and plus/minus to zoom when either the chart canvas or any of its exploration buttons owns focus.
- [x] After clicking zoom, pan, fit, or closing overview, users can continue with chart shortcuts without clicking the canvas again. Preserve usable focus when a command becomes disabled at a domain limit.
- [x] Canvas shortcuts use the same step sizes, enabled states, bounds, and controlled-window callbacks as the visible commands.
- [x] Keep a documented keyboard route to reading navigation and activation. The prototype uses Shift plus arrows for reading navigation.
- [x] Preserve Enter/Space activation on exploration buttons and native keyboard behavior for legends, editable inputs, menus, and overview windows. Do not capture application-wide typing or modified browser shortcuts.
- [x] Expose accurate accessible shortcut metadata and concise discoverable help without forcing tutorial text below charts.
- [x] Verify linear and categorical domains, repeated keys, zoom limits, focus retention, and callback behavior.
- [x] Mouse-wheel zoom works while the canvas or an exploration button owns focus, using the same steps and bounds. Unfocused charts, outside scrolling, modified browser gestures, and overview dialogs retain their own behavior.
- [x] Update chart contracts and the interactive showcase.

## Accepted sources

- [Approved library fix specification](../spec.md).

- Whitney's keyboard exploration request.
- [Statistical chart keyboard handler](../../../src/charts/statistical-chart.tsx).
- [Cartesian chart keyboard handler](../../../src/charts/cartesian-chart.tsx).
- [Prototype keyboard bridge](../../../prototypes/data-analysis/charts.tsx).

## Implementation evidence

The shared exploration controls render either chart-edge commands or a panel. `renderControls` supplies named action nodes for composition in a public Toolbar and replaces native command regions. Panel layout removes reserved command margins. Rectangular lower commands form left/up and down/right groups; button dimensions follow rendered chart width with a coarse-pointer minimum.

The same command handlers supply keyboard pan and zoom on the canvas and exploration buttons. Shift plus arrows retains reading navigation; other controls and overview windows keep their own keyboard behavior. The prototype no longer synthesizes button clicks. Focused command and public ScatterChart integration tests reproduce missing shortcuts and composition before the change and pass afterward. Packed-consumer checks pass; see the shared verification record.

## Wheel rework

The shared input handler accepts vertical wheel gestures over the owning chart or command region when its canvas or an exploration button owns focus. It invokes the existing zoom handlers and limits. Small trackpad deltas accumulate before one zoom step; line and page deltas are normalized. Horizontal, modified, outside, and unfocused wheel gestures remain untouched.

Public LineChart, ScatterChart, and Toolbar composition tests cover focused wheel zoom, limits, button focus, trackpad accumulation, and ignored gestures. Both browsers pass actual wheel interaction on the packed distribution and monthly charts.

## Middle-button panning

With the canvas or an exploration command focused, middle-button dragging over the plot pans continuously with the data following the pointer. It preserves zoom and uses the existing normalized navigation bounds, including categorical snapping and vertical bar-chart navigation. Pointer capture continues the drag outside the plot; release commits the window. Escape, pointer cancellation, and window blur cancel it. A grabbing cursor identifies the active gesture. Unfocused charts retain native middle-button behavior.

Public tests cover line, scatter, panel and Toolbar composition, a vertical categorical axis, heatmap limits outside the visible plot, focus ownership, cancellation, and release without activation. Chromium and Firefox pass actual mouse dragging in the packed distribution and monthly charts.

## Final verification

Completed in the packed Energy desk application and rendered component showcase. See the [shared verification record](../verification.md) for browser checks, repository checks, package compatibility, and the acceptance mapping.
