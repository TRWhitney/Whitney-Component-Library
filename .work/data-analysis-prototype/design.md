# Energy desk workspace

Whitney rejected the page-based versions and delegated a complete application redesign. The repeated failure came from treating each function as a separate destination and testing isolated controls without assessing the working layout. This revision replaces that structure, rather than adding another round of page styling.

## Working model

One workspace contains three functional areas. The building browser selects the working record. The analysis bench shows that record, comparison pins, chart representations, and visible chart commands. A resizable investigation queue holds follow-up decisions and the selected record's reason. Selecting an item in any area updates the same working record. Investigation and comparison are separate persistent states, with fixed-size row controls and explicit labels.

Actual Tabs switch Distribution, Monthly, and Readings inside the analysis bench. They do not replace the browser or queue. There are no route links or artificial breadcrumb hierarchy. SplitView connects analysis and investigation with user resizing and pane collapse. Tree groups buildings by campus, Toolbar groups object commands, ContextMenu supplies secondary row actions, and Popover holds filters. Narrow layouts use Drawer for the building browser and queue while keeping analysis primary.

## Visual plan

Use the existing `--wcl-canvas`, `--wcl-surface`, `--wcl-surface-subtle`, `--wcl-border`, and `--wcl-text-muted` roles, with `#538dff` as the working accent. Keep semantic warning separate. The application heading is 18 pixels, the working building name 20 pixels, pane headings 14 pixels, body controls 13–14 pixels, and reading labels 11 pixels in the utility font. Numeric values use tabular figures.

The working building's energy reading and same-use difference stay beside its commands above the analysis. The application frame fills the viewport. Each functional area's contents scroll locally. Browser actions occupy fixed icon slots, so labels and pressed states cannot move neighboring controls. Investigation reasons stay beside the analysis rather than on another page. Motion is limited to the library's selection, pane, and chart changes, with reduced-motion behavior preserved.

## Chart behavior

Restore native chart exploration and retain its overview. Use the native zoom, fit, pan, and overview controls connected to public controlled windows. Do not add a duplicate client toolbar. Charts fill the analysis width instead of shrinking according to available height. Short panes scroll locally. Distribution activation selects the working building; a separate current-record series identifies the working building. Monthly compares the current building with up to five pinned buildings. Pins survive filtering. Public domain padding keeps full-range markers inside the plot. Native selection's forced instructional footer remains a library ticket rather than a required part of this workflow.

## Acceptance checks for this revision

Operate the whole workspace, not isolated pages. Verify browser and chart selection agreement, fixed action positions before and after state changes, queue edits and export without navigation, comparison pins across filters, both chart zoom windows and pan, native overview, SplitView resize and collapse, keyboard context actions, and narrow drawers. Inspect wide, normal, and compact rendering. Record library limitations without private style overrides. Whitney has now accepted the client prototype with the recorded library deficiencies outstanding; see the [acceptance record](prototype.md#acceptance).

## Compact layout and campus expansion

Keep the building browser beside analysis above 760 CSS pixels. Keep the investigation SplitView above 1100 CSS pixels, with a 65 percent initial analysis share. These thresholds preserve useful panes at tablet and laptop widths. Below them the corresponding drawer retains the same working state. App-owned padding and gaps shrink in short windows. Remaining library field and collection density is ticket 07.

Clicking a campus label or row whitespace toggles its expansion, as does its chevron. Building selection still inspects the building. Search opens matching campuses in a temporary expansion state. Manual expansion changes during search affect only that search. Changing the query reveals its new matches; clearing the query restores the user's pre-search campus state. Categorical filters preserve expansion of temporarily hidden campuses.

## Focus, inspection, and keyboard commands

Search owns focus while typing, including through empty results. The client resets the Tree's obsolete focus history when the filter query changes and replaces an empty Tree with a single EmptyState. Controlled campus expansion survives these changes. Campus row text and whitespace use the pointer cursor because clicking toggles disclosure.

Monthly points are visible and open a compact reading detail with building, month, and energy intensity. This gives an inspection result even when the building is already current. The distribution still updates the working building immediately; the library must retain its pulse through the Current-series transition.

On the focused canvas or its exploration buttons, arrows pan in supported directions, plus or equals zooms in, and minus zooms out. Shift plus arrows retains library reading navigation, and Enter activates a reading. The client invokes named native buttons so limits and step sizes agree. This behavior remains local to the chart canvas and exploration buttons, leaving legends and overview dialogs alone.

The requested pan-button arrangement is left beside up and right beside down, clear of the horizontal axis title. This layout and the excess padding between filter fields and inside dropdown option rows are library work, not app spacing fixes.
