# Independent archive checker

This evaluator was written from `common.txt` before archive authoring began. It does not import
candidate testing helpers or inspect application source. The existing lifecycle checker remains
unchanged and supplies its separate 64-scenario regression check.

Run `node check.mjs <app-directory> <evidence-directory> <port>`. The full archive suite has 12
scenarios, repeated at 390px and 1280px in dark and light, for 48 results. Each scenario starts
with a fresh page. `--only=<scenario>` selects one scenario for checker proof; authored apps get
the full suite. Vite starts directly with strictPort. Cleanup terminates only the owned child.
The checker writes evidence, not application source. Vite may maintain its dependency cache.

The new checks cover selected view semantics and keyboard operation, unchanged search across
views, selected-view counts, empty recovery, underlying order through round trips, next/previous/
empty destinations within unfiltered and filtered views, archived edits and deletions, repeated
same-name copies and nested-copy independence, and long names across filtered archive/restore.
View controls may use button, tab or radio roles. Selected state may use pressed, selected,
checked or current semantics. Native and package controls are both valid. No particular layout
or private data attributes are required.

The focus-stealing check intentionally uses a programmatic stress case: one browser callback
calls the Archive or Restore button's click method, then focuses Search items before returning.
It subsequently samples Search focus for 180ms. This is stronger than separate physical events.
A failure must report that exact trigger and observed focus; it is not by itself proof that a
normal-speed pointer interaction fails. Neighbor focus also remains sampled for 180ms. These
bounded samples cannot rule out every later timer or all assistive-technology behavior.

Stable item identity is checked through order, repeated names, editing/deletion isolation and
archive/restore behavior. These cannot prove that internal IDs stay unchanged. Final evaluation
also needs read-only data-state source review. Source review must inspect identity construction,
archive/restore updates, and copy insertion, alongside executed helper reuse in the new archive
cases. It must not infer identity from a particular DOM attribute.

Geometry checks page overflow, viewport bounds, action-to-action overlap and heading/action
overlap. Long names also check unclamped text and clipping. Contrast logic is copied from the
existing checker, including transparent ancestor background composition. Opacity, backgrounds
with images or gradients, filters and text shadows can make samples unverified. Hidden text,
disabled controls, placeholders, generated content, SVG and canvas are outside those samples.
Screenshots and computed focus styles are evidence, not a complete visible-focus verdict.
Human style and feel acceptance remains unmeasured.

`proof/reference/` is a disposable native implementation made only to validate this checker.
Its deliberate mutations are selected by VITE_ARCHIVE_PROOF. The proof driver runs the complete
positive reference, positive tab/radio view variants, and targeted negative scenarios. The
negative cases cover missing selected state, reset search, incorrect counts, Clear switching
view, reordered moves, Restore duplicating, incorrect neighbor focus, delayed focus theft,
wrong copy state, tied same-name copies, clipped names and insufficient contrast.

The exploratory native reference passed 44/48 before its explicit modal Tab trap was added.
Chromium moved focus to BODY at a modal navigation boundary. The four failures remain under
`proof/exploratory-before-trap/`. The reference was corrected to satisfy the existing modal
requirement; the checker was not loosened. Filtered focus coverage was completed before the
final proof by using three matching rows separated from one nonmatching row, testing both
next and previous destinations. No authored archive output informed either change.

Proof output is captured evidence. Formatting and lint apply to maintained checker/proof source,
not to captured results or logs. `proof/proof-summary.json` records each case and its failures.

## Frozen result

The checker SHA-256 is
`c93e2982fbf6a675e69932fd96063c163874e8a8092270e66534eff6f673aa58`.
The complete native reference passes 48/48. Positive tab and radio variants each pass 4/4.
All twelve negative mutations produce the intended failure at both widths and appearances,
for 48 detected negative cases. All fifteen proof-driver cases are marked proven. Syntax,
ESLint and Prettier checks pass for the maintained checker and JavaScript proof sources.
The existing lifecycle checker remains
`9efc649eefce0bf87fd8395c1f4c7227f521c01ae5e9337cdbd4d219e983403a`.
The checker was frozen before any authored archive result was inspected.

After freezing, the coordinator normalized only the native reference stylesheet's whitespace and
full-length repeated hex colors to satisfy stylelint. They verified equivalence after removing
whitespace and normalizing those color spellings. No mutation uses CSS string replacement. The
checker and trial inputs were unchanged; this formatting-only cleanup did not require new proof.
