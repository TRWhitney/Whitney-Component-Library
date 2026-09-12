# 06 Size and compose chart exploration controls

**What to build:** Make native exploration controls adapt to chart size and allow placement in an application toolbar, while retaining pointer, touch, keyboard, window, and overview behavior.

**Blocked by:** none.

**Status:** complete

## Evidence and client boundary

Energy desk now uses only native chart exploration controls. The duplicate client Toolbar was removed while retaining zoom, pan, reset, overview, and controlled windows.

`src/charts/chart-exploration.css` reserves 4rem above the canvas and 2.75rem below it. Controls sit in absolute regions tied to plot coordinates. Their button sizes remain fixed while the SVG scales. At small chart widths the range wraps beside the button group, and the controls occupy a disproportionate part of the chart. Changing the app's width or height cannot change this through a public density or placement option.

The client now uses the analysis pane's width instead of shrinking the chart to fit its height. Short panes scroll locally. A responsive chart layout still needs library work. Removing exploration would discard its gestures and overview. Private CSS suppression would couple the client to implementation details.

The scatter chart currently lays out left, down, up, and right pan commands across the full lower plot edge. The middle commands crowd the horizontal axis title. Whitney requested two edge groups: up beside left, and down beside right. The placement is internal to ChartRectangularExplorationControls and has no public composition option, so the prototype leaves it for library work.

Whitney approved this work with equivalent responsive sizing and interaction behavior for the panel when it is the chosen presentation. Panel and on-chart command presentations are alternatives, not simultaneous duplicate controls.

## Acceptance

- [x] A consumer can put named zoom, pan, fit, and overview commands in a public Toolbar without retaining duplicate chart command regions.
- [x] Panel and on-chart presentations provide equivalent commands, enabled states, keyboard behavior, and responsive sizing. Only the chosen presentation appears.
- [x] Pointer and touch exploration, keyboard navigation, overview window editing, and controlled-window callbacks keep working.
- [x] Chart content does not reserve empty command rows when commands are external.
- [x] Commands expose enabled state at domain limits and retain accessible names and keyboard operation.
- [x] Group the lower scatter pan controls at the edges: left with up, right with down. Keep the horizontal axis title unobstructed at narrow and wide chart sizes.
- [x] Native controls adapt to available chart width, with readable range text and usable pointer and touch targets. Compact charts must not inherit a desktop-sized command layout or wrap range text into a tall column.
- [x] Fit a complete chart, including axes and commands, within a bounded analysis pane at ordinary laptop dimensions. Preserve a reachable overflow fallback at the genuine legibility limit.
- [x] Update relevant chart contracts and the component showcase with an application-toolbar composition.

## Accepted sources

- [Approved library fix specification](../spec.md).

- [Energy desk design](../design.md).
- [Prototype charts](../../../prototypes/data-analysis/charts.tsx).
- [Rectangular exploration types](../../../src/charts/chart-rectangular-exploration-types.ts).
- [Toolbar contract](../../../docs/components/toolbar.md).

## Implementation evidence

The shared exploration controls render either chart-edge commands or a panel. `renderControls` supplies named action nodes for composition in a public Toolbar and replaces native command regions. Panel layout removes reserved command margins. Rectangular lower commands form left/up and down/right groups; button dimensions follow rendered chart width with a coarse-pointer minimum.

The same command handlers supply keyboard pan and zoom on the canvas and exploration buttons. Shift plus arrows retains reading navigation; other controls and overview windows keep their own keyboard behavior. The prototype no longer synthesizes button clicks. Focused command and public ScatterChart integration tests reproduce missing shortcuts and composition before the change and pass afterward. Packed-consumer checks pass; see the shared verification record.

## Final verification

Completed in the packed Energy desk application and rendered component showcase. See the [shared verification record](../verification.md) for browser checks, repository checks, package compatibility, and the acceptance mapping.
