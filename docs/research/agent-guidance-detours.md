# Why authors inspect implementation

Saved traces showed recurring inspection costs but no dominant established reason. Runtime
reads concentrated in directory/dialog work. A responsive composition example was a plausible
next hypothesis, rather than a proven remedy.

## Method and findings

The audit examined initial traces of 42 attempts from the [bundled](agent-guidance-bundled.md)
and [pointer](agent-guidance-pointer.md) studies. An independent researcher qualitatively
reviewed 18 bundled-page library attempts, including six with pointers. No new authors ran.
Complete returned file bodies were matched longest-first without overlap; partial/truncated
reads, listings and grep excerpts were excluded. Public commentary, commands, results and
compiler feedback supported interpretation; private reasoning was not inspected.

All six reviewed directory authors and all six dialog authors read runtime. Three of six
form authors did. Fourteen read declarations and fourteen inspected CSS. Pointer form04/14
finished from usage without successful declaration/runtime reads; form05 read root declarations
but no runtime. Guidance was sufficient for some routes.

| Cohort, six attempts each | Usage page text | Guide text | Runtime text | Declaration text | Export text | Metadata text |
| ------------------------- | --------------: | ---------: | -----------: | ---------------: | ----------: | ------------: |
| P bundled control         |          11,923 |      9,558 |       11,451 |            5,990 |       4,314 |         9,046 |
| P with pointers           |          12,458 |      9,558 |        6,955 |            1,385 |       4,344 |         9,242 |
| B bundled                 |           4,441 |      1,593 |       11,569 |           17,242 |       8,628 |         8,850 |

These are lower-bound `o200k_base` file-body estimates, not provider savings. They omit CSS
excerpts/other partial reads. Metadata includes package.json/README. Historical cohorts describe
recurrence, not a new controlled cost comparison.

## Reasons and unanswered questions

Some commentary named exported APIs or focus behavior, but most runtime/CSS reads had no
stated reason. Search terms suggest rendering/layout questions, not demonstrated distrust.
Two compiler-triggered ActionSize reads followed invalid size "small"; the existing bundled
Button page already contained its exact union. Wrong `.d.ts` prop paths and misplaced
SearchField/Checkbox paths caused navigation detours. Usage props were sometimes read alongside
original declarations, but duplication alone does not prove either read unnecessary.

All six directory authors read runtime. Four inspected tab/table CSS after behavior guidance,
searching padding, minimum width, overflow and rendered wrappers. Existing pages already
covered filtering/sorting, state outside panels, action isolation, width modes and keyboard
behavior. What they lacked was a practical shrinking-grid/tab-content/wide-table composition.
That motivated a wrapper example using public props and application CSS rather than private
DOM selectors. Individual motives remained inferred.

## Decision and subsequent work

The original recommendation was a narrow Table/Tabs composition experiment. The
[layout results](agent-guidance-layout.md) report its later measurements. Source references
remain [Table](../../src/collections/table.tsx), [Tabs](../../src/navigation/tabs.tsx),
[styles](../../src/styles.css) and current
[editorial guidance](../../scripts/agent-guidance/editorial.mjs). The audit did not justify
a blanket source-read prohibition, general rendering reference or undocumented selector guarantee.

Raw captures and one-off study tooling were removed. Exact historical replay is unavailable.
See the [evidence retention policy](agent-evidence-retention.md).
