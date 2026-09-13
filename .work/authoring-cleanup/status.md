# Authoring cleanup

## Destination

Complete the [authorized findings](spec.md) following Ticket 27 delivery.

## Current state

Complete. The requested rework is implemented, validated, and independently reviewed. Corrections are folded into the responsible unpublished commits. The ten [cleanup tickets](tickets/) contain outcome-specific evidence.

## Verification

- `npm run check` passes formatting, lint, types, generated-document checks, 82 test files with 1,180 tests, TypeScript 5.9/6/7 compatibility, and import isolation.
- After the final example placement and compact-control corrections, `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run check:generated`, and `npx vitest run tests/showcase.test.tsx` pass. The showcase suite has 18 tests.
- `npm run showcase:build`, `npm run prototype:markdown:build`, and `npm run verify:package` pass. Packed-consumer SSR and hydration checks pass for React 18.3.1 and 19.2.8.
- Direct Chromium and Firefox Fieldnotes runs pass document switching, retained drafts and selections across modes, summary/link overlays without editor displacement, collection inclusion, review and combined export, review invalidation, new empty documents, attachments, and loading/empty/error/save-failure states at 1440×1000 and 390×844.
- Geometry and screenshot inspection cover natural/fixed cards and rails, collapsed navigator outline with stable width/header/sidebar and sibling commands, top-border placement, compact/stable tables, editor access cues and bounded height, settings spacing, appearance/accent inheritance, chart hierarchy and sizing, pie explanations, and area hover. Nested Select pointer sequences and keyboard dismissal pass in both browsers. Native scrollbar rendering remains browser/OS controlled.
- Existing Live Preview footnote regression coverage remains passing. Toolbar omission was already supported and required no change.

## Accepted sources

[Cleanup specification](spec.md), [Ticket 30 findings](../library-foundation/tickets/30-cross-browser-accessibility-and-visual-hardening.md), and the [accepted Fieldnotes prototype](../markdown-authoring-demo/spec.md).

## Out of scope

Release-wide certification remains blocked by future integration fixtures. External work-system skill changes and production persistence are outside this effort.

## Rework verification

Whitney rejected the moved chart description/border, indistinct chart groups, fully extended collapsed navigator outline, oversized switches, label-based read-only badge, and absence of cards in the demo. The current implementation addresses those reported states.

- `npm run check` passes 82 files and 1,180 tests, lint, types, generated guidance, declaration compatibility, and import isolation. Demo and showcase builds pass.
- `node /tmp/rework-verify.mjs chromium` and `node /tmp/rework-verify.mjs firefox` pass card dimensions, natural heights, retained drafts through Home, navigator collapse, stationary sibling commands, matching 36px switch/field heights, editor access cues in all modes, editing restrictions, and phone layout.
- The full Fieldnotes workflow passes again in both browsers via `/tmp/studio-rework.mjs`, including review/export, attachment acquisition, and simulated loading/empty/error/save-failure states.
- Chart browser inspection covers 1600px and 390px in light and dark appearances. All 42 examples have visible group boundaries; the component description/border remains on the left at desktop widths. Regular and compact charts differ materially while pie explanations keep their width.
- After placing the chart panel helper beside the other showcase layout helpers, the 84 showcase/style tests, targeted ESLint, typecheck, chart boundary check, generated check, and showcase build pass.

The subsequent chart report reproduced stale CSS in both running showcase servers despite current markup. Restarting those servers restored the committed heading bands, panel borders, and gaps. Fresh Chromium and Firefox screenshots at 1440px and 390px confirm the served section boundaries. Recheck the served CSS after history changes before handing over preview links.

Home card summary lengths previously displaced badges and excerpts by one line. A two-line minimum summary now aligns both at the same offsets. Browser geometry and screenshots cover fixed and natural card heights, desktop and phone widths, in Chromium and Firefox. Targeted formatting, ESLint, Stylelint, and the packed demo build pass.

The separate read-only/locked explanation is restored at Whitney's request; the in-editor lock icon remains and the label pill stays removed. Navigator links include padding within the field-density height. New document is an independent sibling immediately beneath the navigator in both states. Fresh screenshots and pointer checks cover expanded/collapsed navigation and document creation in Chromium and Firefox; separate explanation and lock cues pass desktop/phone checks. The 94 navigation/style/showcase tests and packed demo build pass.

The minimal-example correction removes ten chart comparison links, reduces AppearanceProvider to three controls inheriting sidebar settings, and replaces ContextMenu's collection/export composition with one target and working review commands. The focused context-command test failed before the change and passes afterward; all 19 showcase tests pass. Formatting, targeted ESLint/Stylelint, typecheck, and showcase build pass. Chromium and Firefox checks cover pointer and Shift+F10 commands, appearance/accent/density inheritance, and 390px layout; screenshots were inspected.

## Review and delivery

Fresh independent intent and engineering reviews passed with no findings against the complete rework, including Home, component changes, examples, generated guidance, and work records. The reviewers inspected the existing Chromium/Firefox evidence; neither reran validation or modified files.

Branch `main`. The unpublished demo commit was amended to include exclusion of nested installed dependencies from test discovery, producing `7eaac57`. No published history was rewritten. Cleanup commits preserve separate outcomes; the following history excludes this final composition-guidance commit.

- `730dec8` [Feature] Allow optional support rows
- `9051b6b` [Fix] Keep card rails inside their bounds
- `a900924` [Feature] Support explicit card dimensions
- `dce9c61` [Fix] Keep navigator collapse local
- `e7c52ea` [Feature] Fit navigators to sidebar edges
- `6b28f9e` [Feature] Let compact tables fit their pane
- `5d79790` [Feature] Keep changing table columns stable
- `56930e0` [Fix] Identify non-editable Markdown
- `3eb420a` [Feature] Fit Markdown to bounded panes
- `19af813` [Fix] Prevent accidental Select choices
- `009a1f4` [Fix] Show area-chart hover guides
- `4089582` [Tweak] Widen scroll-region bars
- `0405d6b` [Fix] Unify showcase appearance controls
- `eb12291` [Cleanup] Remove repeated density prompts
- `0dd5bc6` [Fix] Clarify chart example hierarchy
- `04417fd` [Tweak] Show representative chart sizes

No accepted cleanup remains. Ticket 30 retains the release-wide certification work; see the foundation record for subsequent integration tickets.
