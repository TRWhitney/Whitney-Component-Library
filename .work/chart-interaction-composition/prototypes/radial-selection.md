# Pie and donut selection study

Status: accepted. Whitney approved the revised Outer edge and expansion-asterisk prototype with "looks good".

## Decision

Compare Slice frame with Outer edge for selection on pie and donut charts. Both keep the
current reading separate through an inset dashed outline and the existing slice pop-out.
Try dragging across slices to collect the categories actually crossed. This is a proposed radial
selection gesture, not yet an accepted production contract.

## Design plan

Reuse `--wcl-canvas`, `--wcl-surface`, `--wcl-text`, `--wcl-text-muted`, `--wcl-border` and the existing
chart series colors. Keep the 1.5rem study heading, 0.9375rem guidance, and utility-font reading
line. One actual chart sits below separate rows of comparison controls. Selection frames follow
the slice boundary; the alternative draws only an outer arc. Reading stays inset to separate it
from selection. Opening details gets a 620 ms opacity pulse, with static reduced-motion feedback.
Preserve the original proportional geometry, aggregate paging, and complete table. The inline
reading/details text and fixture records are prototype aids rather than new production UI.

## Run

`npx vite .work/chart-interaction-composition/prototypes/radial-selection --host 0.0.0.0 --port 5180`

Open <http://localhost:5180>. The source is an isolated DOM adapter around public PieChart and
DonutChart. Local annual-energy data has ten categories so aggregate paging can be exercised.
No subagents or automated test suites were used for this prototype.

## Proposed interaction

- Click/tap toggles a category when selection is enabled. Control/Command-click and press-and-hold
  open details independently. With selection off, an ordinary click/tap opens details.
- Drag collects ordinary slices crossed by the pointer. Replace by default, add with Shift or
  Control/Command, remove with Alt. Escape or pointer cancellation restores the pre-drag selection.
  Passing through the donut hole selects nothing there.
- The +N aggregate is navigation. Click or Enter opens its next page; sweeping across it does not
  select hidden categories. Existing selections survive paging and switching Pie/Donut.
- Arrow keys, Home and End choose the current visible slice. Enter/Space selects; modified
  Enter/Space activates. Legend clicks retain their emphasis meaning.
- Separate controls compare chart kind and selection indicator. Light appearance, Compact and
  Identify elements help inspect the same behavior. The latter reports stable control/region names.

## Direct observations

Native Chromium selected Homes and Offices, switched Slice frame to Outer edge with selection
retained, and opened Shops via Control-click. A straight sweep across the donut crossed Homes
and Shops while passing through the center hole; the result contained only those two categories.
Keyboard added Offices. Holding Schools opened details. The aggregate opened categories 8 to 10;
Back restored the initial page. Operated Pie, light appearance, Compact and Identify elements.
Inspected the resulting frame/rim, light and compact screenshots, then removed them. These are
prototype observations, not production verification or approval.

## Remaining boundary

Outer edge is the chosen indicator. The expansion count now shows an asterisk when a category inside is selected. The revised prototype and sweep gesture are accepted. The production boundary is recorded in [ticket 09](../tickets/09-pie-donut-interaction.md). Radar uses a different reading unit and remains a
separate next study. Statistical visibility and the other open chart work remain in the map.

## Expansion selection cue

Whitney chose Outer edge. It is now the default. The aggregate count adds an asterisk only when
a selected category belongs to that aggregate's remaining records. Selecting a category already
visible does not add it. Clearing selection removes it. The aggregate remains navigation.

Native operation selected Homes on the first page and observed +3, then opened the next page,
selected Transit and returned with Back. The count showed +3*. Inspected that rendered state.
Clearing selection restored +3. No agents or test suites were used.

## Accepted contract

Use Outer edge for selected slices, inset dashed reading outlines, existing slice pop-out, and
finite activation feedback. The expansion count has an asterisk exactly when its remaining
categories include a selection. Expansion remains navigation, never a selectable aggregate.
Preserve the proposed click/tap, modified activation, hold, sweep, cancellation and keyboard
behaviors above, and selection across paging. The native chart's proportional shapes, paging,
complete table, dark/light and compact treatment remain intact. No whole-chart focus outline.

Fixture data, DOM-adapter technique, comparison controls, and inline reading/details panels are
flexible study aids. Production retains the established tooltip and application-owned details.
Slice frame is rejected. Public data/ownership details are recorded in ticket 09.

## Production follow-up

Whitney requested visible drag feedback without returning to prototyping. Production shows a
temporary dashed trail along the sweep, preserving crossed-slice selection. The trail clears on
release, cancellation, or a change that invalidates the gesture.
