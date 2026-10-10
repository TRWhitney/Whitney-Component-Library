# Shorter guidance and selective retrieval

The original prototype cut reference tokens by 47% to 59% across five sampled task groups while
retaining full contracts. It did not establish lower total authoring usage than React/CSS.
The [protocol](agent-guidance-cost-protocol.md) describes the original comparison; later
[production integration](agent-guidance-proposal.md) is a separate change.

## Reference size

The prototype provided a compact linked index, per-component usage, full contracts and exact
props. An optional batch lookup selected component names and one topic. Its later `--props`
option was not included in the authoring comparison. Static references and lookup shared the
same canonical content; the command's incremental authoring benefit was unmeasured.

Counts use tiktoken 0.12.0 with `o200k_base`; `cl100k_base` gave similar counts. Neither is
claimed as the model's billing tokenizer.

| Index variant                                          | Tokens | What changes                                                    |
| ------------------------------------------------------ | -----: | --------------------------------------------------------------- |
| Current index                                          |  4,867 | Summary plus first use and avoid guidance for all 85 components |
| Original summaries only                                |  1,346 | Selection details stay in component contracts                   |
| Linked original summaries, setup, retrieval directions |  1,995 | Adds usable paths and shared setup                              |
| Linked terse summaries, same setup and directions      |  1,589 | Shortens wording only relative to the previous row              |

The linked terse prototype was 67.4% smaller than the current index. Shortening summaries
alone saved 406 tokens, 20.4% against equally linked original summaries. Most of the reduction
came from moving use/avoid detail out of the all-component index.

The following budgets compare index, selected pages and exact prop dependencies. They are
controlled reading budgets, not observed agent usage. Setup/provider guidance is included.

| Task group | Current index + full pages + props | Terse index + usage + props | Reduction |
| ---------- | ---------------------------------: | --------------------------: | --------: |
| Form       |                              9,207 |                       3,793 |     58.8% |
| Modal      |                             10,756 |                       4,620 |     57.0% |
| Line chart |                             12,407 |                       6,317 |     49.1% |
| Markdown   |                             11,124 |                       5,836 |     47.5% |
| Collection |                             12,414 |                       6,296 |     49.3% |

Additional topic/full reads increase these budgets. Agents already using known components
can skip the index. Button/TextField forms guidance together cost 288 reference tokens,
including setup. The complete manifest cost 147,797 but was not a required read or the baseline.
LineChart/provider props alone cost 2,246 tokens, close to the 2,482-token usage reference.
Exact declarations retained required fields, unions and dependencies.

## Authoring results

One fresh gpt-6.1-sol/high attempt per condition built the same profile editor. The library
conditions used the identical packed package and had to use Dialog. Full guidance received
full pages and extracted props despite their absence from the original distribution.
Discovery, maintenance and subjective style review were excluded. Source baseline was
`89a801e42b008565ff9c21ca6ee1531c4b7b53ab`; Node was 24.21.0.

| Condition                   | Input + output tokens | Cached input, already included | Uncached input + output | Final app/CSS tokens |
| --------------------------- | --------------------: | -----------------------------: | ----------------------: | -------------------: |
| React/CSS                   |                78,889 |                         38,272 |                  40,617 |                1,345 |
| Library, full guidance      |               300,687 |                        273,024 |                  27,663 |                  609 |
| Library, selective guidance |               250,204 |                        227,584 |                  22,620 |                  743 |

Provider total means input plus output, including cached input and reasoning output once.
Uncached input plus output is a diagnostic, not a price. App/CSS counts use `o200k_base` and
exclude the shared scaffold. Totals include author reads, checks, failures and follow-up work;
coordinator/prototype/evaluator work is excluded.

Selective used 16.8% fewer completed total tokens than full, but the setup fault below prevents
attributing that difference to guidance. It used 3.17 times native total, while uncached input
plus output was 18.2% below full and 44.3% below native. Selective app/CSS was 45% smaller than
native. Smaller source did not establish cheaper authoring.

Active author time was 46.5 seconds native, 45.2 seconds full plus a 9.9-second follow-up, and
73.0 seconds selective. Native/full mainly ran type/build checks; selective also wrote temporary
Chromium checks. Tool output totaled roughly 4,158, 19,621 and 12,993 reference tokens. These
are included in provider input and cannot be added again as a separate charge.

## Checks and material corrections

Historical integrity checks covered 85 components, 2,470 guidance entries, unchanged full
contracts, reachable examples and nonempty compiling prop references. An initial trailing-slash
bug produced empty prop files; checks caught it before final measurements. The 49 existing
contract/generated-documentation tests passed.

All three final apps passed type/build and 204 sampled Chromium assertions, 34 per app at each
of 390px and 1280px. Both library apps rendered Dialog, Button, TextField and AppearanceProvider.
An evaluator originally required native `:modal` or `aria-modal`; it was corrected to accept the
library's inert background together with checked focus containment. Condition-based waiting
resolved dismissal/reopening races without app changes. This was not a complete accessibility audit.

The scaffold initially placed the packed library outside peer-dependency resolution. Full's
build failed despite passing type checking. After shared setup correction, it reran its unchanged
build. Initial usage was 228,832 tokens; follow-up added 71,855, including 943 uncached input
plus output. All remain in the table. Before follow-up, selective used 9.3% more total than full.
No coordinator behavioral repairs altered apps.

## Decision and limits

The original decision favored linked static references and selective retrieval as a smaller
reading budget, with complete contracts available when needed. Lookup remained an optional
prototype. One attempt per condition, differing self-checks and the setup fault cannot establish
expected authoring savings. A claim of savings would require matched corrected trials across
multiple tasks and a maintenance stage. This pass supports lower reference cost only.

Raw captures and one-off study tooling were removed. Exact historical replay is unavailable.
See the [evidence retention policy](agent-evidence-retention.md).
