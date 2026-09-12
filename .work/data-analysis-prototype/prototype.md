# Energy desk prototype

## Purpose

Review a campus building, compare its energy readings with other buildings, and write an investigation reason without leaving the workspace. The prototype consumes the packed component library through public exports.

## Run and bundle

Run `npm run prototype:analysis` from the repository root and open `http://localhost:5174/`.
The launcher packs the library, installs that archive in the app, checks its types, and starts Vite. It uses no library source aliases or private imports.

`npm run prototype:analysis:build` performs the same package preparation and creates the browser bundle in `.showcase-dist/data-analysis/`. That directory contains the application HTML, JavaScript, and CSS. There are no separately hosted page applications or required data services.

## Operate the workspace

- Click anywhere on a campus row to expand or collapse it. Search temporarily opens matching campuses; clearing search restores your previous expansion state.
- Select a building in the campus tree. Its name, readings, and chart context update in the analysis bench. The distribution distinguishes the current building from the other building-use groups.
- Use the fixed-size clipboard action to add or remove an investigation, or right-click the building. Shift+F10 opens the same commands from its focused row.
- Select an investigation in the queue to return to that building and edit its reason. Export the queue through its export control or the File menu. One sample Elm Hall investigation is included initially.
- Pin up to five comparison buildings with the pin actions. Monthly shows the current building and its comparison pins, up to six series. Pins survive browser filtering.
- Use the actual Distribution, Monthly, and Readings tabs to change the analysis representation. The browser and queue stay in place.
- Focus a chart or one of its exploration buttons and use arrows to pan, plus or equals to zoom in, and minus to zoom out. Monthly pans left and right along its month axis. Shift plus arrows navigates readings; Enter inspects one. Nested controls and overview windows retain their own keyboard commands.
- Click a monthly point to see its building, month, and energy reading. This also inspects its building.
- Both charts use one native set of zoom, pan, fit, and overview controls. Moving a point or line into the working context updates the same selected building.
- Resize or collapse the investigation pane with SplitView. At narrow widths, Buildings and Investigations open in drawers. Their state remains shared with the analysis.
- Prototype settings expose light appearance, simulated loading and error scenarios, refresh failure, reset, and feedback names.

## Boundaries

The fixture has 18 fictional building records. Data, pins, and notes live in memory and reset on reload. Same-use differences describe the median of loaded records, not an engineering efficiency target. The sample investigation demonstrates the queue and is disposable.

A failed refresh retains the previous readings, including partial results. Missing buildings keep their pins and investigation reasons. Existing data and work remain available while a refresh runs.

## Library evidence

The app composes Tree, Tabs, SplitView, Toolbar, ContextMenu, ListBox, Table, Popover, Drawer, Menu, Dialog, fields, feedback, and both chart families. Each serves a working function; the app has no route-link navigation or artificial breadcrumb hierarchy.

The thirteen [library fixes](status.md#library-follow-up) are complete. The app uses compact density, public Tree context actions, default chart keyboard exploration, geometry-aware aspect ratios, and native focus recovery. It has no Tree remount key, empty-tree substitution, cursor override, row identity lookup, or synthetic chart-button keyboard bridge. Numeric axes use the data extent, with an increasing range for a single value.

## Acceptance

On 2026-09-11 Whitney stated, "I have no more criticisms that aren't library related," and made Ticket 23 closure conditional on completing the recorded library fixes. The client prototype is accepted with those explicit deficiencies outstanding.

Preserve the single coordinated workspace, campus browser and reversible search expansion, shared working building, comparison pins, local investigation editing and export, responsive panes and drawers, and chart inspection and keyboard exploration. Use the current [design record](design.md) and [operating flows](#operate-the-workspace) as the retained application intent.

The fictional records, session-only storage, client implementation details, and workarounds are flexible. Library fixes should replace workarounds where appropriate and correct the recorded defects; those defects are not accepted qualities to preserve. This remains a proof of concept and does not authorize production hardening or added application features.

All thirteen [library follow-ups](status.md#library-follow-up), affected showcase examples and contracts, and packed-consumer checks are complete. Ticket 23 is closed. Wider release checks remain in the foundation effort.

See the [verification record](verification.md).
