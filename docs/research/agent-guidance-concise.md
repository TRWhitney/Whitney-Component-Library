# Shorter wording results

The original candidate used 22.6% fewer prose words and 3.3% fewer complete-page reference tokens.
All 18 apps passed 816 assertions without repairs. Total fell 3.0% versus current, but directory
cost rose 3.2%, failing the frozen criterion for savings in every task. Candidate total was
2.40 times React/CSS. Later [adoption](agent-guidance-proposal.md) used precision edits with
different size measurements; no new authoring study was run for them.

## Design and size

The [protocol](agent-guidance-concise-protocol.md) specified three conditions, three tasks and
two repetitions, 18 fresh gpt-6.1-sol/high authors. Neutral briefs had no guidance hints or
runtime restrictions. Library briefs requested appropriate installed components; native used
React/CSS. Only eight usage pages differed. Exact props, examples, links and full contracts
matched, as did 1,037 other files. Tabs added already verified default/fallback facts, so this
was an integrated candidate rather than a pure word-count intervention.

Both archives clean-installed with React 19.2.8. All installed variants, links, 85 prop closures,
nine examples, types and consumer builds passed historical preflight. Final wording, source
hashes, packages and assignments were frozen before launch. No author launched before final freeze.

Prose words exclude fenced code; complete-page `o200k_base` estimates include props/examples.
These measure reference size rather than provider input.

| Page                | Current words | Concise words | Current tokens | Concise tokens |
| ------------------- | ------------: | ------------: | -------------: | -------------: |
| appearance-provider |            63 |            47 |            198 |            186 |
| button              |            77 |            57 |            337 |            318 |
| checkbox            |            77 |            65 |            355 |            347 |
| dialog              |           127 |            98 |            413 |            388 |
| search-field        |            81 |            65 |            507 |            498 |
| table               |           216 |           163 |          2,032 |          1,986 |
| tabs                |           190 |           139 |            615 |            580 |
| text-field          |            94 |            82 |            561 |            548 |
| Total               |           925 |           716 |          5,018 |          4,851 |

Task budgets fell from 1,509 to 1,440 overlay, 1,451 to 1,399 form and 3,689 to 3,568 directory.
Preserving exact types/examples made the complete-page saving much smaller than the word saving.

## Completed costs

| Sum across six authors       |   Current |   Concise |  Native |
| ---------------------------- | --------: | --------: | ------: |
| Total input plus output      | 1,166,816 | 1,132,184 | 472,169 |
| Input                        | 1,151,754 | 1,116,842 | 457,279 |
| Cached input                 |   998,016 | 1,005,952 | 414,720 |
| Output                       |    15,062 |    15,342 |  14,890 |
| Reasoning output             |     1,444 |     1,519 |     608 |
| Uncached input plus output   |   168,800 |   126,232 |  57,449 |
| Outer tool requests          |        41 |        41 |      19 |
| Tool-output reference tokens |    98,129 |    92,815 |  20,963 |
| App/CSS reference tokens     |     6,581 |     6,620 |   9,995 |
| Active author seconds        |    357.19 |    363.15 |  305.74 |

Cache is part of input and reasoning part of output. Uncached input plus output is diagnostic,
not a price. Reference estimates cannot be subtracted from provider totals to attribute savings.
Author reading, failures/fixes and checks are included; preparation/evaluation/analysis are excluded.

Concise used 25.2% fewer uncached tokens than current, but 139.8% more total and 119.7% more
uncached than native. Its source was 33.8% smaller than native. Both library groups made 41
outer requests versus native's 19; source size does not identify causes of provider differences.

| Task, two attempts each | Current total | Concise total | Native total | Concise vs current |
| ----------------------- | ------------: | ------------: | -----------: | -----------------: |
| overlay                 |       441,753 |       396,249 |      164,666 |             -10.3% |
| form                    |       318,965 |       316,652 |      154,836 |              -0.7% |
| directory               |       406,098 |       419,283 |      152,667 |              +3.2% |

| Task / repetition | Current / concise / native ids | Concise vs current total | Concise vs current uncached | Concise vs native total |
| ----------------- | ------------------------------ | -----------------------: | --------------------------: | ----------------------: |
| overlay / 1       | 01 / 02 / 03                   |                   -11.7% |                      -18.8% |                 +155.5% |
| overlay / 2       | 12 / 11 / 10                   |                    -8.9% |                      -19.5% |                 +127.1% |
| form / 1          | 06 / 04 / 05                   |                   -12.4% |                      -42.0% |                 +109.6% |
| form / 2          | 13 / 15 / 14                   |                   +15.5% |                      -25.1% |                  +99.4% |
| directory / 1     | 08 / 09 / 07                   |                   +11.7% |                      -38.2% |                 +237.9% |
| directory / 2     | 17 / 16 / 18                   |                    -7.1% |                       +6.0% |                 +115.2% |

Overlay favored concise in both repetitions. Form/directory split on total; four of six
pairs favored concise total and five favored uncached. Native used fewer total and uncached
tokens in all six matched pairs.

## Reading and correctness

| Returned library content, readers out of six | Current | Concise |
| -------------------------------------------- | ------: | ------: |
| Usage-page content                           |       6 |       6 |
| Complete metadata                            |       5 |       6 |
| Whole index                                  |       4 |       3 |
| Whole root declarations                      |       4 |       4 |
| Complete component runtime                   |       5 |       3 |
| CSS excerpts                                 |       2 |       3 |

All 12 library authors encountered usage naturally. Runtime reading fell while CSS inspection
rose; these routes do not establish that brevity caused either change. Current08 corrected
size "small"; Concise09 corrected accent "blue" and size "small". Current01 requested a missing
React Aria FocusScope file. All operations remained in counters; native had no failed reads/builds.

All 816 primary assertions passed, 48 per overlay/directory and 40 per form across 390px/1280px.
No repairs were needed; final results reused initial checks without a second execution. Two
partial runs stopped after 17 and 32 assertions due to lost automation host or human input.
Unchanged reruns passed. Those 49 partial assertions were excluded from primary counts.
Concise16's failed Summary click continued only after a separate DOM read verified the exact
selected-tab postcondition. No app or assertion changed.

## Decision and limitations

Size and correctness criteria passed. Completed-cost criteria failed because directory total
rose 3.2%. The original decision kept the candidate for review. Adoption later prioritized
reducing avoidable overhead while retaining consistency and maintenance benefits; matching
native initial-authoring cost was not required. Maintenance savings remain unmeasured.

Two repetitions/task, one model/effort, reused briefs, route variation and cache behavior limit
generalization. Tabs facts prevent attributing results solely to fewer words. Sampled correctness
does not certify all component behavior or prove every phrase clearer.

Raw captures and one-off study tooling were removed. Exact historical replay is unavailable.
See the [evidence retention policy](agent-evidence-retention.md).
