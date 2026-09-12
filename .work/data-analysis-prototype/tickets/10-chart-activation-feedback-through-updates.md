# 10 Preserve activation feedback through callback updates

**What to build:** Keep a valid click's feedback visible when its activation callback updates application state or changes the activated record's chart presentation.

**Blocked by:** none.

**Status:** complete

## Evidence and client boundary

Distribution activation immediately makes the clicked building current. Its series changes from its building use to `current`. The interaction hook clears its pulse when the serialized geometry or source-data identity changes, and the pulse also references the old series ID. The selected building changes successfully, but the click feedback disappears. Clicking an already-current building does not make this series transition.

Monthly previously selected only the building. Clicking the current building therefore appeared to do nothing. The app now opens a reading detail with building, month, and energy intensity, and memoizes its monthly data to avoid unnecessary identity changes. Callback updates that actually change the set of compared records can still invalidate the native pulse.

The prototype retains immediate selection and the Current marker. It does not delay the action to let an animation finish, draw a second animation, or patch the hook. The library must reconcile feedback with a still-present datum across supported presentation updates.

## Acceptance

- [x] Clicking a non-current distribution point produces immediate activation feedback while the point becomes current in the same update.
- [x] Keep feedback attached to the activated datum through a supported series or geometry transition when its stable record identity remains present.
- [x] A callback rerender with equivalent data does not silently erase a valid pulse.
- [x] If the activated datum is removed, cancel feedback without transferring it to another record.
- [x] Repeated activations restart feedback, and reduced-motion behavior remains appropriate.
- [x] Feedback represents an executed activation callback. The showcase demonstrates a visible inspection result for an already-current record too.
- [x] Cover scatter and line charts with callback-driven state changes, keyboard activation, and touch activation.
- [x] Update chart interaction contracts and rendered showcase examples.

## Accepted sources

- [Approved library fix specification](../spec.md).

- Whitney's distribution and monthly activation feedback report.
- [Interaction hook](../../../src/charts/chart-interaction.tsx).
- [Statistical chart](../../../src/charts/statistical-chart.tsx).
- [Prototype charts](../../../prototypes/data-analysis/charts.tsx).

## Implementation evidence

Activation feedback has its own lifetime, separate from gesture invalidation. Equivalent data and geometry changes preserve a valid pulse. Statistical points reconcile a changed series through stable record identity; removed or hidden records lose their pulse. Keyboard and touch regression checks cover immediate transition to Current, equivalent line data, and removal. Existing line coverage verifies repeated activation and expiration. `ChartApplicationGeometryExample` updates a visible inspection result on every activation, including an already-current record.

## Final verification

Completed in the packed Energy desk application and rendered component showcase. See the [shared verification record](../verification.md) for browser checks, repository checks, package compatibility, and the acceptance mapping.
