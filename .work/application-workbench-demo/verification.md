# Docket verification

Original workflow reverified and expansion verified on 2026-09-19 against the locally packed public package, on branch `main`.

## Commands

- `npm run prototype:workbench:build` passes. The runner packs the library, replaces the fixture's installed archive, checks consumer types, and builds the application. The fixture imports only the public package and stylesheet. Vite reports a 1.93 MB minified JavaScript bundle, 584 KB gzip; production bundle optimization remains outside this proof of concept.
- `npm run lint` passes both repository code and stylesheet checks.
- `npm run typecheck` and `npx tsc -p prototypes/application-workbench` pass.
- `npm run format:check` and `git diff --check` pass.
- `npx vitest run prototypes/application-workbench/model.test.ts` passes all three focused domain checks. Readiness and export checks first failed for the missing behavior, then passed. The save snapshot test also covers edits made after a save starts.
- The retained [browser workflow](../../prototypes/application-workbench/verify-browser.mjs) passes in Chromium and Firefox. Run it with Node and Playwright available. `PLAYWRIGHT_MODULE` can identify an installed Playwright module; `CHROMIUM_EXECUTABLE` and `FIREFOX_EXECUTABLE` can select installed browser binaries. `DOCKET_URL` defaults to `http://localhost:5177`, and `DOCKET_EVIDENCE` defaults to `/tmp/docket-proof`.

The browser command used this machine's Playwright module at `/home/whitney-white/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs`, Chromium executable at `/home/whitney-white/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome`, and Firefox at `/home/whitney-white/.cache/ms-playwright/firefox-1532/firefox/firefox`.

## Workflow evidence

Both browsers prove:

- Source selection survives Write, Source, and Read mode changes, document navigation, and desktop-to-phone resizing. Formatting affects the retained selection, and undo restores the prior text.
- Drafts remain associated with their documents. Editing during a save leaves the later edits unsaved; a subsequent keyboard save resolves them.
- Readiness requires a named, nonempty saved document. Editing metadata returns a ready document to draft.
- Packet export contains the three chosen ready documents, includes the saved edits, and excludes the unfinished opening checklist.
- Failed saves keep their text. Reconnect and save recover. Loading failure and retry retain the current draft. Empty workspace and empty document views provide a route into authoring.
- Menus work with pointer and keyboard. Escape restores focus after the overlay exits. Creating a document from the phone navigator opens its editor. Details edits survive drawer closure.
- Focus and text-field selection transfer from the inspector into its drawer and back. Navigator search focus also transfers across the responsive breakpoint.
- Light/dark appearance, reduced motion, desktop at 1440×900, phone at 390×844, and the 320×650 header fit pass. Mode and Save controls are both 34px tall and their center difference is zero in both browsers.
- No page runtime errors occur.

Supplemental Chromium checks exercise keyboard pane resizing and collapse/restore, browser Back, keyboard scrolling to all six chart readings, a 900×700 tablet layout, and touch-emulated mode changes, editing, save, document navigation, details, and loading. The commissioning document does not add page overflow.

## Direct visual review

Operated the shared browser preview to navigate commissioning notes, switch modes, edit the document, inspect its unsaved state, open phone details and navigation, and return to the initial workspace. Inspected screenshots and browser semantics for desktop, phone, tablet, 320px, light/dark, chart readings, empty documents/workspace, loading, and both error states. Screenshots were temporary inspection evidence and are not repository artifacts.

Client corrections made during review:

- Equalized adjacent mode/Save controls and added spacing inside icon/text action labels.
- Shortened the phone packet command so every header control fits at 320px.
- Removed broad application heading resets that affected Markdown Read-mode spacing.
- Used the chart's public scrolling option and a positioned consumer wrapper to keep every reading reachable and its hidden accessibility content within the application.
- Kept responsive effects independent so crossing two breakpoints cannot close a drawer while focus transfers.
- Kept toolbar composition within its supported public child contract.

No confirmed library change is required by the current demo. Critique is complete; [Ticket 02](tickets/02-library-corrections.md) is closed without implementation.

## Limits

This is a session-only proof of concept. Browser reload resets sample data. Latency and failures are simulated; Markdown downloads are real. No production service, persistence, stable-release compatibility certification, or manual screen-reader certification is claimed. No public components changed, so the component showcase and generated guidance have no changes.

## Workspace expansion

The retained [expansion browser workflow](../../prototypes/application-workbench/verify-expansion.mjs) passes in Chromium and Firefox with the same environment variables as the original workflow. The packed build, consumer typecheck, code/style lint, formatting, and six domain tests pass. The review-model boundary was tested with three failing checks before implementation and three passing checks afterward.

Both browsers verify the following through rendered public components:

- Browser Back returns from the register to the initial document. Tool changes retain register filters, review drafts, and the original document's unsaved source selection; Bold still wraps the selected word after returning.
- Register sorting changes row order. Owner/search filters narrow rows, empty results offer recovery, selection supports pointer and Space, and Shift+F10 opens the row menu. Batch readiness changes the eligible saved document and leaves an unsaved selection untouched.
- An incomplete pass cannot create a report. Completing its checkpoints, entering notes, retaining the review date, and attaching evidence creates an unsaved review document. Oversized files are rejected without entering the evidence list. Changing systems retains review notes and evidence.
- The generated pass document includes its decision and evidence filename. Save, readiness, and Markdown download include that review in the same packet as existing documents.
- Phone filters use a dialog and recover from zero results. Visitor access requires a reason for its hold, permits unfinished checkpoints, and produces a report that preserves those unfinished checks. The recorded review links back to its document.
- The page stays within both viewport dimensions at 320, 390, 768, 1100, and 1440px widths. Scrolling belongs to the register/review panes. No page runtime errors occur.

Direct preview interaction covered system selection and the phone hold-confirmation-to-editor flow. A supplemental Chromium check changed the date by keyboard, confirmed the generated report contained September 25, and opened that same report from the register row menu. Inspected desktop/phone screenshots, accessibility semantics, dark appearance, invalid review, filtered empty results, generated unsaved documents, and intermediate widths. Supplemental measurements confirm both adjacent batch buttons are 32px high and share the same vertical position. Register filter inputs share their control baseline. Temporary screenshots were removed after inspection.

Consumer corrections made during expansion verification include the initial hash-history path, creation focus handoff, controlled note validation, and positioning the scroll containers so visually hidden control text remains inside them. Visitor access uses the Meter's valid range without an endpoint threshold. The original regression script now scopes the repeated chart title to its inspector. These changes require no library modifications.

Whitney ended review of the expansion. Final assessment and closure are recorded below.

## Commissioning layout correction

Whitney's supplied screenshot invalidated the earlier visual acceptance. The root fit checks passed while the review's own scroll region still contained oversized content. At 2560×1440, reproduction measured the original chart at 726px tall and a 1634px review inside a 1171px viewport. The new focused geometry check failed on that chart height before the layout correction.

The corrected review uses the public SplitView for form and evidence, with its heading and action bar in separate fixed grid rows. Progress moved into the system rail. Checks and decision share a row; notes use the remaining form height. Chart width is capped at 600px, its aspect ratio is 2.4, and short September day labels keep every observation in view. At 1280px and below, evidence opens in a public Drawer. This replaces the earlier stacked review/evidence layout.

[Review layout verification](../../prototypes/application-workbench/verify-review-layout.mjs) passes in Chromium and Firefox using the recorded Playwright environment variables. At 1440×900, 2048×1120, and 2560×1440, all default form controls and chart axes fit above the action bar, with no horizontal or vertical overflow in the review panes. At 1366×768, 1280×720, 900×700, 390×844, and 320×650, the action bar stays fixed while the form scrolls. Keyboard pane resizing, collapse/restore, compact evidence attachments, retained notes/files across widths, and drawer-to-document navigation pass.

The original document workflow and expanded pass/hold/register workflows pass in both browsers after the layout changes. The packed consumer build, consumer typecheck, code/style lint, formatting, and six model tests pass. The build retains the prototype's known bundle-size advisory.

Direct preview operation covered desktop pane collapse/restore and phone evidence access. Inspected the complete 2048×1120 dark layout against the supplied symptom, the 2560×1440 and 1440×900 light layouts, the phone evidence drawer, and invalid review state. The chart axes, tool headers, action bar, and application footer remain complete. Independent content scrolling does not move that chrome. Temporary screenshots were removed after inspection.

All corrections are consumer code and public component configuration. No library-only deficiency was established. Whitney has ended critique of the revised demo.

## Final assessment and closure

Whitney authorized closing Ticket 28 after cleanup review. Whitney finds the demo design confusing but considers the library solid for the intended use. This is acceptance of the library integration proof, without endorsement of the demo's design as a reference application.

Cleanup inspection found no outstanding implementation tasks, confirmed library defects, tracked generated archives, installed dependencies, screenshots, or temporary diagnostics. The retained browser scripts are reproducible regression checks. Package archives, dependency installations, and build outputs remain ignored and are recreated by the runner. Session-only storage, simulated failures, and the bundle-size advisory remain intentional prototype limits.

Closure updates the foundation ticket/status and this effort's records. No README, license, repository instructions, public component, showcase, or generated contract changes are required.

Independent fresh-context delivery reviews passed on both the intent and engineering axes with no blocking findings or required follow-ups. Reviewers inspected the complete consumer, runner, tests, accepted sources, existing verification, and closure records without changing files or rerunning checks. Changed work-record links, formatting, and diff whitespace checks pass. The complete fixture and its closure records are committed as one integration-proof outcome.
