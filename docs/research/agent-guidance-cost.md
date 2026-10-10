# Shorter guidance and selective retrieval

The prototype cuts reference tokens by 47–59% across five sampled task groups while retaining
the full contracts. It does not establish lower total authoring usage than React/CSS.
In one fresh-context profile-editor attempt per condition, selective guidance used 250,204
total tokens against 78,889 for React/CSS. Its uncached input plus output was 44% lower, and
its final app/CSS source used 45% fewer tokens. These are different measures, not dollar costs.

Whitney requested tests and measured proposals before shipping. Production components,
contracts, package exports, generated human documentation, README, and showcase are unchanged.

## What was tested

The [prototype](../../prototypes/agent-guidance-cost/guide.mjs) generates a compact linked
index, per-component usage references, full contracts, and exact prop references. Its batch
lookup accepts explicit component names and one topic: selection, usage, structure, state,
forms, access, visual, examples, or full. It rejects unknown names/topics instead of guessing.
An optional `--props` includes exact declarations in the same response, avoiding a separate
type read. This batching option was added after the authoring trials; its authoring effect is
unmeasured. It also rejects unknown command options.
The static pages and command use the same canonical source. This experiment tests static
references in authoring; it does not establish that the command improves authoring cost.

The default usage reference includes composition, content, states, control behavior, events,
validation, forms, labeling, and the first canonical example. Detailed selection, keyboard,
localization, appearance, motion, and other examples remain available separately. Those details
were deferred, not judged unnecessary or deleted. Setup is printed once per batch query.

The [frozen protocol](agent-guidance-cost-protocol.md) and [brief](../../prototypes/agent-guidance-cost/brief.txt)
define the independent authoring comparison. Each library condition used the identical packed
production package and had to use Dialog. All three received the same behavior requirements.
The control received full component pages and extracted props even though the current package
does not ship the pages, giving it a better reference path than its present distribution.
Discovery, maintenance, subjective style review, and new APIs were excluded.

## Reference tokens

Counts below use tiktoken 0.12.0 with `o200k_base`. `cl100k_base` produced similar counts.
Neither encoding is claimed as the authoring model's billing tokenizer. The
[measurement file](../../.work/agent-guidance-cost/evidence/metrics.json) retains both.

| Index variant                                          | Tokens | What changes                                                    |
| ------------------------------------------------------ | -----: | --------------------------------------------------------------- |
| Current index                                          |  4,867 | Summary plus first use and avoid guidance for all 85 components |
| Original summaries only                                |  1,346 | Selection details stay in component contracts                   |
| Linked original summaries, setup, retrieval directions |  1,995 | Adds usable paths and shared setup                              |
| Linked terse summaries, same setup and directions      |  1,589 | Shortens wording only relative to the previous row              |

The linked prototype is 67.4% smaller than the current index. Of that change, shortening the
summaries saves 406 tokens, or 20.4% against equally linked original summaries. Most of the
reduction comes from moving use/avoid detail out of the all-component index. Adding usable
links and setup has a cost, which the measurements include.

Examples from the [85 proposed summaries](../../prototypes/agent-guidance-cost/summaries.json):

| Component | Current summary                                                                       | Proposed index wording                             |
| --------- | ------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Button    | Run a command with native button and form behavior.                                   | Command, submit, or reset.                         |
| Dialog    | Host one ordinary, bounded task or focused content surface with reversible dismissal. | Focused task or content with reversible dismissal. |
| TextField | Collect one line of text through a persistent labeled native input.                   | Labeled single-line text.                          |
| Switch    | Turn one immediately applied setting on or off.                                       | Immediately applied on/off setting.                |
| Table     | Compare typed keyed rows with sorting, selection, and explicit cell actions.          | Keyed rows, sorting, selection, and cell actions.  |

Compare the current index plus selected full pages and exact props with the terse index plus
selected usage pages and the same props. This is a controlled reading budget, not observed
agent usage. Provider guidance is included in every group; all type dependencies are counted.

| Task group | Current index + full pages + props | Terse index + usage + props | Reduction |
| ---------- | ---------------------------------: | --------------------------: | --------: |
| Form       |                              9,207 |                       3,793 |     58.8% |
| Modal      |                             10,756 |                       4,620 |     57.0% |
| Line chart |                             12,407 |                       6,317 |     49.1% |
| Markdown   |                             11,124 |                       5,836 |     47.5% |
| Collection |                             12,414 |                       6,296 |     49.3% |

These budgets are optimistic when usage alone leaves a question unanswered. Any subsequently
read topic or full page must be added. They also assume an index read; an agent already working
on known components can skip it. Querying Button and TextField forms guidance together costs
288 reference tokens, including setup. The complete pretty-printed manifest costs 147,797,
but agents need not read that manifest, so it is not the comparison baseline.

The LineChart and provider props total 2,246 tokens, nearly its 2,482-token usage reference.
The extractor follows referenced declarations, including unions and shared types. Further
type filtering may help, but must preserve required fields, discriminants, and dependencies.
The present prototype provides complete extracted props rather than guessing which props matter.

## Authoring usage

All attempts used `gpt-6.1-sol`, high effort, through fresh native child sessions in the same
harness. Node was 24.21.0. Source baseline was `89a801e42b008565ff9c21ca6ee1531c4b7b53ab`.
Prompts, retained tool traces, usage timelines, final source, package/source hashes, and
[metrics](../../.work/agent-guidance-cost/evidence/metrics.json) are retained under the effort.
Opaque reasoning and account/rate-limit data are excluded from traces.

| Condition                   | Input + output tokens | Cached input, already included | Uncached input + output | Final app/CSS tokens |
| --------------------------- | --------------------: | -----------------------------: | ----------------------: | -------------------: |
| React/CSS                   |                78,889 |                         38,272 |                  40,617 |                1,345 |
| Library, full guidance      |               300,687 |                        273,024 |                  27,663 |                  609 |
| Library, selective guidance |               250,204 |                        227,584 |                  22,620 |                  743 |

Total usage comes from the provider's cumulative session counters. Output includes reasoning
tokens; do not add reasoning or cached input again. Final source counts use `o200k_base` and
include only the two authored app/CSS files; the identical scaffold is excluded. Authoring
totals include reads, self-checks, failed checks, and follow-up work. Coordinator/prototype and
independent evaluator usage are excluded. No maintenance stage ran.

The selective attempt's total was 16.8% below the completed full-guidance attempt, but the
setup fault below prevents attributing that difference to guidance. Its total was 3.17 times
the native attempt. Uncached input plus output was 18.2% below the completed full-guidance
attempt and 44.3% below native. Cache hits and the number of calls affect these measures;
they do not establish a general or priced advantage.

Authoring time was 46.5 seconds for native, 45.2 seconds for the full attempt plus a 9.9-second
infrastructure follow-up, and 73.0 seconds for selective. These intervals exclude waiting
between the full attempt and follow-up. Native and full primarily ran type/build checks;
selective also authored temporary Chromium self-checks. This variation is included in usage
and limits causal comparison. The measured tool-output text totaled roughly 4,158, 19,621,
and 12,993 reference tokens respectively. It includes more than documentation, and is not a
separate charge to add to provider usage.

## Verification and evaluator corrections

The [integrity checker](../../prototypes/agent-guidance-cost/check.mjs) verifies all 85 components,
2,470 canonical guidance entries, unchanged full contracts, reachable examples/counterexamples,
nonempty extracted props, independent declaration compilation, and duplicate/invalid queries.
During construction, a trailing-slash error initially yielded empty prop files. Adding the
nonempty declaration check caught that gap; final type and reference measurements use the
corrected files. The existing contract and generated-documentation tests pass, 49 tests total.
Prototype code lint and formatting pass.

The independent [T3 browser checker](../../prototypes/agent-guidance-cost/browser-check.mjs)
exercised 34 checks per app at each of 390px and 1280px. All 204 final assertions pass, including
name/description, validation association, trimmed save, cancellation, Escape, reopening, focus
entry/return, Tab containment, and horizontal fit. These are sampled Chromium checks, not a
complete accessibility audit. Both library outputs actually import and render Dialog, Button,
TextField, and AppearanceProvider. All three type/build checks pass.

Retained [initial results](../../.work/agent-guidance-cost/evidence/browser-initial.json) and
[targeted/final results](../../.work/agent-guidance-cost/evidence/browser-results.json) disclose
the evaluator corrections. The first modal assertion required native `:modal` or `aria-modal`.
The library instead makes the background main region inert. The corrected assertion accepts
that mechanism together with the separately checked focus containment. Short waits also
occasionally raced overlay dismissal or reopening. Targeted Escape/focus checks passed with
condition-based waiting, without app changes. The retained checker now polls settled conditions.
One interrupted full check was repeated after extending the wait; no authoring rerun was used
to obtain a preferred result.

The experimental scaffold initially placed the packed library outside the fixture's peer
dependency search path. Full type checking passed but Vite could not resolve React. The shared
setup was corrected, and full reran its unchanged build. Its initial usage was 228,832 tokens;
the follow-up added 71,855, of which 943 were uncached input plus output. All of that usage
remains in the table. Before that infrastructure follow-up, selective had used 9.3% more total
tokens than full, which shows why the completed-total difference is not a guidance effect.
The retained preparer now supplies that dependency link from the start. This infrastructure
correction is distinct from app repairs; no coordinator changes or behavioral repair messages
altered trial apps.

## Proposed next change

Review the linked terse index and component-specific static references first. They remove
measured reading overhead with less operational machinery than a mandatory lookup service.
Ship setup once, keep usage and exact props beside each selected component, and link remaining
topics and full guidance. Preserve focused alternatives and constraints when the agent needs
them. Avoid loading every contract, example, or visual detail at startup.

The batch command is worth keeping as an optional prototype. It demonstrates lossless topical
retrieval, including a small two-component forms response. Its incremental benefit over the
same static references remains untested. A model-backed semantic selector, MCP server, broad
API rewrite, and automatic code generator are not justified by this experiment.

Before claiming authoring savings, repeat matched trials with the corrected scaffold and
equivalent self-check instructions, then include a maintenance stage. Track total input/output,
cache use, tool calls, repairs, and source separately. Use multiple task families and report
failures. This pass supports lower reference cost, not the claim that using this library
generally costs fewer tokens than using React/CSS.

## Reproduce and review

From the repository root:

```sh
npm run build
node prototypes/agent-guidance-cost/guide.mjs generate /tmp/wcl-guide-review
node prototypes/agent-guidance-cost/props.mjs /tmp/wcl-guide-review
node prototypes/agent-guidance-cost/check.mjs
node prototypes/agent-guidance-cost/guide.mjs query Button TextField --section=forms
node prototypes/agent-guidance-cost/guide.mjs query Button TextField --section=forms --props
```

Read `/tmp/wcl-guide-review/agent-index.md`, its linked usage pages, types, and full contracts.
Generate a disposable tokenizer environment rather than changing repository dependencies:

```sh
python3 -m venv /tmp/wcl-guide-tokenizer-review
/tmp/wcl-guide-tokenizer-review/bin/pip install tiktoken==0.12.0
/tmp/wcl-guide-tokenizer-review/bin/python prototypes/agent-guidance-cost/measure.py /tmp/wcl-guide-review
```

The [preparer](../../prototypes/agent-guidance-cost/prepare-trials.mjs) creates a new fixture root
and refuses to overwrite an existing one:

```sh
node prototypes/agent-guidance-cost/prepare-trials.mjs /tmp/wcl-guide-trials-review /tmp/wcl-guide-review
```

Each fixture has its frozen prompt and `npm run check`. For inspecting the retained apps,
replace only each fixture's `src/app.tsx` and `src/styles.css` with the corresponding
`app.tsx.txt` and `styles.css.txt` from
[evidence](../../.work/agent-guidance-cost/evidence/metrics.json). Run Vite in that fixture and
use the T3 browser checker through its browser adapter. Current development previews were
5188 for native, 5189 for full, and 5190 for selective; no hosted site was published.
The capture script is scoped to these child session paths and strips account data. It is an
evidence collector, not a portable benchmark runner or production agent workflow.
