# 30 Cross-Browser, Accessibility, and Visual Hardening

**What to build:** Release-wide evidence and fixes for the accepted browser, interaction,
assistive-technology, appearance, responsive, and motion matrix after the catalog and integration
fixtures exist.

**Blocked by:** [Operational Integration Proof](18-process-tracker-and-operational-proof.md),
[Data Analysis Integration Proof](23-data-analysis-prerelease.md),
[Markdown Authoring Integration Proof](27-markdown-authoring-prerelease.md),
[Application Workbench Integration Proof](28-application-workbench-prerelease.md)

**Status:** blocked

- [ ] Chromium, Firefox, and WebKit pass representative behavior across every public family under
      the fixed Baseline 2023 contract.
- [ ] Manual focused screen-reader exercises cover compound fields, select/combobox, overlays,
      collections, navigation, charts, Markdown editing, and all four integration fixtures
      before stable-candidate acceptance.
- [ ] Keyboard-only and touch flows complete every integration fixture without an inaccessible
      substitute path.
- [ ] Light, dark, multiple accents, compact/wide, zoom, forced-color, reduced-motion, loading,
      empty, partial, error, pending, disabled, and read-only states pass documented checks.
- [ ] Visual comparison catches unintended drift in binding visual relationships while allowing
      documented flexible constants.
- [ ] Semantic status contrast and non-color meaning pass across all applicable components.
- [ ] No accepted responsive layout clips, overflows, loses focus, or introduces arbitrary dividers
      and decorative hard stops.
- [ ] Findings are fixed at the owning component seam and do not become test-only exceptions.
- [ ] Increase scrollbar size slightly across scroll regions. Whitney reported that the current
      scrollbars have become too subtle; verify their visibility in both themes and compact layouts.
- [ ] Audit the AppearanceProvider area in the component showcase. Whitney reported that its
      controls do not respect the selected accent and appear bespoke. Use library components where
      appropriate and verify that controls and selected states follow the active accent.
- [ ] Move the AppearanceProvider options into the sidebar beside the accent selector so the
      appearance controls are together. Whitney identified the current placement as poor UX.
- [ ] Rework hierarchy and spacing in the showcase's chart section. Make section and subsection
      boundaries clear and separate distinct concepts with space; compact density must not erase
      these relationships.
- [ ] Add the vertical dashed hover guide to area charts and verify it in the rendered examples.
- [ ] Give the pie-chart explanation a readable width independent of the chart width. Its current
      narrow wrapping adds excessive vertical space.
- [ ] Make regular and compact chart examples meaningfully representative. Whitney reported that
      the current sizing controls only change small charts to slightly smaller charts.
- [ ] Standardize shared chart options throughout the showcase, including compact sizing, so
      comparable examples expose consistent controls.
- [ ] Remove the repeated "Try compact density and optional..." links from every showcase area.
      Whitney finds these prompts unnecessary and distracting.

## Markdown authoring findings

- [ ] Give read-only and collaboratively locked editors a visible treatment on the editor itself. Setting `isReadOnly` or `isLocked` currently relies on support text below the editor to explain the state. Retain that text, but make the non-editable document visually distinct. An application can add an outer status indicator; the editor's own treatment requires a library change. Moved from Ticket 27 under Whitney's prototype-first cleanup boundary.

- [ ] Let MarkdownEditor fill a bounded application pane. At 1440×1000 and 390×844, a workspace cannot make the document use the available height through the public API: `size` selects 14rem, 24rem, or 36rem. This leaves unused space or introduces another workspace scrollbar. Add a supported fill-height or bounded-height composition, retain readable minimums, and verify mode switching and pane resizing. The demo uses regular size on phones and expanded size on desktop without overriding private selectors or CSS variables.
- [ ] Make empty support-space reservation optional for SegmentedControl, choice controls, and FileTrigger. Rendering a mode selector without description or validation still reserves a 2.25rem support row plus its gap, producing conspicuous empty space between the mode choices and the next document control. FileTrigger similarly reserves a 2.25rem row even before acquisition, separating the Add attachment action from its file list. Unlike text fields, its public props expose no `reserveSupportSpace` option. The first demo iteration exposed this with SegmentedControl. The workspace uses Menu for mode selection at every width; The attachment dialog now uses DropZone. The same reserved support-space issue is visible with Switch: each switch adds a 2.25rem empty support row plus the choice gap even with no description. The demo uses ToggleButton for its simulation settings until the library exposes control over that reservation.

- [ ] Fix CardCollection selection rails extending outside the card bounds. In the publication desk at 1440px, selected cards with shorter summaries/excerpts have rails extending below their card backgrounds to the grid row's height. The selection marker belongs to the stretched grid item while the nested card sizes to its content. Keep the rail inside the actual card boundary for differing content lengths and card dimensions. This is a rendering bug, independent of the sizing capability below. The authoring demo uses tables and lists now; retain the original card reproduction.
- [ ] Support explicit card dimensions through the public API. Applications must be able to assign the same dimensions to cards whose content differs. This is consumer-controlled sizing, not automatic equal-height cards or a requirement to align action positions. Define content overflow behavior for explicitly sized cards and verify that selection rails remain within their bounds.
- [ ] Investigate nested Select pointer reachability inside Popover on a narrow screen. In the publication demo at 390×844, repeatedly open Demo settings, choose Loading then Ready, Empty workspace then Ready, and try Load error. Chromium twice reported the appearance-provider overlay intercepting the option click after the option stopped moving. The demo uses Dialog for its multi-field settings task through public APIs. Preserve this reproduction for the nested overlay fix; do not treat a keyboard-only path as a pointer fix.

- [ ] Make Table minimum width a supported consumer choice. The grid enforces `max(100%, 38rem)` and column minimums even with two short columns. At 390px, document inclusion and review actions require horizontal scrolling. Support a compact two-column table that fits its container while retaining deliberate overflow for wider datasets. The demo uses public List with visible actions on phones.

- [ ] Constrain CollapsibleNavigationPane collapse to its own navigation content. Current public `isCollapsed`/`onCollapsedChange` state let this demo shrink the sidebar and hide the unrelated New document action. Whitney explicitly requests removal of the hook that permits repurposing the collapse control. Update the public contract, type tests, generated component guidance, and showcase together. Collapse must not resize surrounding layout, change the expansion control's dimensions, or affect sibling commands. Preserve Whitney's stated requirement, "It should not change size when collapsing at all," when defining the component's allocated footprint.
- [ ] Support CollapsibleNavigationPane as the top item in a sidebar. It must sit flush against the sidebar's top edge without gaps from rounded top corners, including when collapsed. Retain the navigator's border; removing it is not the requested solution. Provide this placement through a supported public composition without private style overrides. Add guidance against using this component as the only substantive content of a sidebar; use Drawer when the entire region is navigation that should be hidden. The demo keeps a desktop sidebar because New document is separate sidebar content. It uses uncontrolled navigator collapse and fixes sidebar and command geometry; phones use Drawer.
- [ ] Give Table a supported stable-column sizing policy for changing cell content. In the review table at 1440px, approving the first document changed the first column from 367.22px to 372.94px and shifted both later columns. Status text and action-label changes trigger automatic table sizing. The demo fixes the widths of its own version text and button-label content; the library should support stable columns without requiring consumers to stabilize every text fragment. Verify all row and column positions before and after each review action.

## Accepted sources

- [Specification](../spec.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)
- [Quality and Release Boundary](../decisions/10-quality-and-release-boundary.md)

## Completion evidence

Pending implementation.
