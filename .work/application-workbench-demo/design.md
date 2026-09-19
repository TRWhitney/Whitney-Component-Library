# Applied interface direction

A document handover bench, opening directly on the handover brief. Its distinctive element is a narrow labeled packet spine beside a persistent document navigator; document readiness ties that navigator to the packet review command.

- Palette: slate canvas #edf0f4, white document #ffffff, ink #242933, secondary #626b78, plum accent #8054a0, ready green through the library success role. Dark mode uses library theme tokens.
- Typography: library sans at 13px for controls and 14px for body chrome; 24px/600 document identity; library Markdown body around 16px; 11px monospace for document identifiers and packet edition.
- Layout: shallow application bar; fixed-width navigation and wide content plane; editing toolbar directly above writing; resizable inspector for document metadata and supporting evidence; quiet bottom session status. No home dashboard or route tabs.
- Motion: existing library feedback, focus and overlay transitions; no decorative animation. Respect reduced motion.
- Limited width: details move to an end drawer first; navigation moves to a start drawer on phones. Formatting reduces to essential commands and an insertion menu. Writing retains the viewport's remaining height, with independent content scrolling.

The palette and horizontal document composition differ from the dark blue Fieldnotes and analytical Energy desk. Controls retain library styling; document hierarchy comes from proportions and content, not custom substitute controls. Empty/loading/error states occupy the affected region and offer recovery. Packet review remains contextual to the same documents.

## Additional workspaces

Retain the accepted slate, white, ink, muted, and plum roles, 13px utility text, and 10px document identifiers. Keep the existing editor as the initial view. The register presents shared documents, filters, row actions, and packet readiness.

The commissioning review uses a compact 20px tool heading and 17px system identity. A 188px system rail holds the selectable systems and their ProcessTracker. The review heading and action bar surround a public SplitView. Its form and evidence panes scroll independently when content requires it. Checks and decision occupy adjacent columns where they fit; the notes editor fills the remaining form height. The evidence pane groups the current Meter, a chart bounded to 600px wide, files, and its document link. Form and evidence start on the same baseline. The distinctive packet spine and system codes keep the same project identity.

Below 1280px the system selector becomes a Select and evidence moves to a Drawer. The review form stays mounted as the primary pane. Below 430px of form content width its two field groups become one scrollable column. Heading and create/open actions remain outside that scrolling column. Neither tool navigation nor the chart's aspect ratio may enlarge the page or push the action bar over content. At ordinary desktop sizes, all default review controls and chart axes must be visible without scrolling.

Use the library's existing focus, overlay, and reduced-motion transitions. Verify the 2048×1120 screenshot size, 2560×1440, 1440×900, short desktop windows, and phones. Root dimensions alone are insufficient proof: inspect actual pane overflow, complete chart axes, control visibility, fixed chrome during scrolling, and useful allocation of remaining space.
