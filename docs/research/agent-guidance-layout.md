# Responsive guidance results

The Table/Tabs supplements supported a task-specific composition hypothesis. All three
supplement agents read the new guidance and none subsequently read runtime/CSS. All three
controls read both. Supplement total was 29.6% lower and uncached input plus output 17.5% lower
than prior guidance. It still used 1.92 times completed React/CSS total and 2.17 times uncached
tokens; before native repair the ratios were 2.27 and 2.24.

## Design and candidate

The [detour audit](agent-guidance-detours.md) motivated the
[protocol](agent-guidance-layout-protocol.md): nine fresh gpt-6.1-sol/high directory attempts,
three each with React/CSS, bundled guidance/pointers and identical guidance plus supplements.
Order rotated; starts overlapped. Neutral prompts/names gave no guidance hints. Authors edited
app/CSS and ran matching builds; inherited instructions remained in costs.

Only Table/Tabs usage pages differed. Table added an inventory example in an application-owned
wrapper with `min-width: 0`, `max-width: 100%` and `overflow-x: auto`, plus width/grid advice.
Tabs explained panel padding/border/background and application wrapper containment. Original
minimal examples, behavior, props and full links remained. The additions cost 420 `o200k_base`
reference tokens, increasing the five-component budget from 3,269 to 3,689, 12.8%.

Historical checks matched 201 runtime files and 195 declarations and compiled all original
examples plus the wrapper. Preflight at 390px measured outer width 390, table internal scroll
width 640 and client width 323; 1280px also fit. Tab switching/automatic arrows passed. The
example used public props and application CSS, with no internal selector guarantees.

## Completed authoring

Each row sums three attempts including native repair. Provider total includes cached input and
reasoning once. Uncached input plus output is diagnostic, not a price. Coordinator audit,
setup/evaluation/analysis are excluded; author fixes are included. Reference estimates use
`tiktoken 0.12.0` with `o200k_base`.

| Condition          |   Input | Cached input | Output |   Total | Uncached input + output | App/CSS tokens |
| ------------------ | ------: | -----------: | -----: | ------: | ----------------------: | -------------: |
| React/CSS          | 250,931 |      229,120 |  9,928 | 260,859 |                  31,739 |          6,776 |
| Prior guidance     | 701,780 |      626,688 |  8,418 | 710,198 |                  83,510 |          3,727 |
| Layout supplements | 492,788 |      430,848 |  6,967 | 499,755 |                  68,907 |          3,525 |

| Condition          | Tool requests | Tool-output tokens | Active seconds | Runtime readers | CSS readers |
| ------------------ | ------------: | -----------------: | -------------: | --------------: | ----------: |
| React/CSS          |            10 |              7,239 |         228.77 |             0/3 |         0/3 |
| Prior guidance     |            24 |             61,232 |         252.18 |             3/3 |         3/3 |
| Layout supplements |            18 |             46,176 |         180.80 |             0/3 |         0/3 |

Supplement authors made 25% fewer outer requests, returned 24.6% fewer tool-output tokens,
used 28.3% less active time and wrote 5.4% smaller app/CSS than controls. Library groups needed
no repairs. More targeted reference text coincided with less inspection despite larger pages.

| Repeat | Control ID | Supplement ID | Total change | Uncached change |
| ------ | ---------- | ------------- | -----------: | --------------: |
| 1      | 02         | 03            |      -36.77% |         -20.84% |
| 2      | 04         | 05            |      -17.75% |           4.41% |
| 3      | 09         | 07            |      -32.26% |         -33.12% |

Total favored supplements in all three pairs; uncached tokens favored them in two, rising 4.4%
in repetition 2. All six library agents read usage and some original declarations. Controls
continued to runtime/CSS; supplements did not. This establishes sequences, not motives or the
specific helpful sentence.

## Correctness and limitations

All nine builds passed. Initial independent checks passed 430/432 primary assertions, 48 per
app across 390px/1280px. Native06 named its table "People table" instead of required "People",
failing at both widths. A narrow name repair added 40,555 total and 1,003 uncached tokens,
raising native total from 220,304 to 260,859. All final apps passed 432/432; repair passed 48/48.
This was a label mismatch, not an unnamed table.

Trial07 had two partial browser checks interrupted by click errors after 38 and 20 passing
assertions. A complete unchanged rerun passed 48/48. A narrow transport recovery checked exact
postconditions, but was unused in that successful rerun. No assertion or app source changed.
Partial runs were excluded from the primary count.

Three attempts/condition and one task cannot establish general or reliable causal savings.
Cache, batching, task familiarity and optional exploration remain; changing both pages cannot
isolate prose from examples. The original recommendation favored the two supplements for
review. [Production integration](agent-guidance-proposal.md) later adopted them, without a
source-read prohibition or claim of savings over React/CSS.

Raw captures and one-off study tooling were removed. Exact historical replay is unavailable.
See the [evidence retention policy](agent-evidence-retention.md).
