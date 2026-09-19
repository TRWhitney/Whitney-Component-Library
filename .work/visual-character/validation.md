# Visual character validation

## Accepted behavior and direct evidence

- Surface base has a low downward shadow, raised has a stronger shadow, and subtle stays flat.
  Light/dark screenshots and computed styles confirm opaque faces and stable panel geometry between
  idle and emphasized states.
- FocusField follows Included documents in Fieldnotes. Browser checks at 1920×1200, 1440×1000,
  1100×900 and 390×844 confirm its center remains behind that panel and the main scroller has no
  horizontal overflow. Inspected screenshots preserve the accepted study's surrounding glow,
  gentle offset, region spacing and compact controls.
- Direct collaborative-browser operation toggled showcase emphasis off and on, observed the bloom,
  operated the child review action, and inspected the named Section regions and Surface styles.
  Browser checks also exercised RTL, light/dark, phone, reduced motion and forced colors.
- Direct Fieldnotes operation reviewed all three documents, observed atmosphere turn off with
  Ready to export, exported the guide, observed Guide exported, and changed appearance through
  Demo settings. Scripted download verification also passed.
- Energy Desk refresh activates atmosphere and returns to idle afterward. Desktop and phone
  rendering was inspected. Commissioning review uses the form as its anchor and preserves evidence,
  fixed action controls and responsive scrolling.
- Missing/multiple/zero-size anchors suppress the decoration without disrupting content. Public
  React tests cover recovery, nested ownership, activation interruption, hydration, child keyboard
  interaction, resizing and nested scrolling. Negative type fixtures enforce the bounded API.

## Quality and integration commands

- `npm run check`: pass. Formatting, both linters, typecheck, 85 test files / 1,196 tests, generated
  documentation, TypeScript 5/6/7 matrix, chart isolation and Markdown editor isolation all pass.
- `npm run verify:package`: pass. The packed FocusField/Surface composition passes SSR, hydration,
  type and browser-build verification on React 18.3.1 and 19.2.8.
- `npm run showcase:build`: pass through the equivalent direct Vite build command.
- `npm run prototype:markdown:build`, `npm run prototype:analysis:build`, and
  `npm run prototype:workbench:build`: pass using installed package archives.
- `prototypes/application-workbench/verify-review-layout.mjs`: pass in Chromium and Firefox,
  including 2560/2048/1440 desktop geometry, 1366/1280/900/390/320 compact layouts, keyboard pane
  resizing, collapse/restore, fixed actions, retained drafts and evidence files.
- `git diff --check`: pass.

The browser scripts used the existing external Playwright installation and local browser binaries.
Screenshots were inspected as temporary evidence and are not retained in the repository.
The Vite application builds retain their existing large-chunk advisories.

## Test-first record

The public FocusField tests first failed because the component did not exist. After implementation,
anchor ownership, activity, invalid composition, keyboard interaction and hydration passed.
A later nested-scrolling test failed because the center stayed at its pre-scroll position. Adding
captured descendant scroll tracking made that regression pass. The final focused run passed all
13 FocusField/layout tests before the full repository check.

## Delivery review corrections

Independent intent review found review-only padding also matched hidden Fieldnotes views. The
selectors now require the visible review wrapper. Browser checks confirm original Home, Collection
and document-editor padding at desktop and phone sizes, with larger padding only in Review.

Independent engineering review found text-node updates could move an anchor without triggering
resize or child-list observation. Character-data observation now tracks that movement. An additional
inspection found inherited direction changes could similarly swap panels without a size change;
ancestor dir observation now refreshes placement. Both public regression tests failed before the
correction and pass afterward. The RTL browser check now asserts the center remains behind Included
documents after switching direction; the corrected screenshot has been inspected.

The focused correction run passed 15 FocusField/layout tests. Renewed complete repository checks
pass with 1,196 tests. Packed React 18/19 verification and all three demo and showcase rebuilds pass after the correction.

## Independent review

The complete outcome received separate independent, read-only intent and engineering reviews.
Their admitted findings are recorded above. Bounded correction reviews passed on both axes with
no remaining blockers. The engineering correction review also covered the inherited-direction
fix and observer cleanup. Documentation links and generated examples are current.
