# Bundled static guidance: measured results

The bundled pages are smaller, but this pass does **not establish cheaper library authoring**.
They used 9.9% fewer completed total tokens than the current package and 17.9% fewer than the
earlier static prototype. However, only two of six bundled agents read a page, uncached input
plus output was 0.7% higher than current guidance, and completed total tokens were 2.55 times
React/CSS. Keep the prototype for review; do not ship it as a demonstrated agent-cost reduction.

This is the third bounded pass. The [first report](agent-guidance-cost.md) measured explicit
reference budgets. The [second](agent-guidance-discovery.md) tested natural discovery on one
task. This pass combines exact props, one minimal example, and concise behavior on a component
page and repeats natural discovery across three tasks.

## Comparison

The [frozen protocol](agent-guidance-bundled-protocol.md) specified 24 fresh agents:
three tasks × four conditions × two repetitions. Tasks were a profile-editing dialog,
a contact form with custom validation, and a searchable/sortable directory with tabs.
Condition order rotated within each task block. Actual start order was trial 01 through 24;
starts overlapped, so this was not a randomized or isolated cache experiment.

All agents used gpt-6.1-sol at high effort, fresh contexts without parent-history forks,
the same local React/Vite scaffold, and the same behavioral brief. Prompts named the
installed library where applicable but gave no documentation paths, mechanism hints, examples,
or forced component choices. They could inspect only their own app and installed dependencies.
They edited only app/CSS, ran the same TypeScript/build command, and received no browser
self-checking tools. The fixtures were explicitly outside Git to prevent repository-workflow
clarification from interrupting authoring. Skill and inherited instruction overhead remains
in the measured agent counters.

- **React/CSS:** familiar native controls, with no component library.
- **Current:** the installed package and existing agent index/declarations.
- **Static:** the earlier compact linked index, component usage pages, separate exact-prop files,
  and complete contracts.
- **Bundled:** the same index, metadata, extracted type files, and complete contracts as Static;
  only the 85 usage-page bodies changed.

Eight shared components have manually shortened behavior and minimal examples:
AppearanceProvider, Button, Dialog, TextField, Checkbox, Tabs, SearchField, and Table.
The other 77 retain canonical usage/accessibility facts and a first canonical example.
All 85 pages include exact prop dependencies and a complete-contract fallback. This is not
a completed editorial rewrite of all 85 components.

Actual byte comparisons verified 201 identical runtime JS/CSS files and 195 identical
declaration files across the three library variants. The original README also matches.
All 18 installed copies match their prepared variants; Static and Bundled differ only in
85 usage pages. Frozen protocol/generator/task/checker/package/prompt hashes verified.
No production files, package metadata, README, AGENTS, runtime, or showcase changed.

## Completed costs

These are **sums of six authoring attempts per condition, including all allowed repairs**.
Total is provider input plus output, including cached input. Cached input is a subset of input;
reasoning output is a subset of output. Neither is added again. Uncached input plus output is
a separate diagnostic, not a price. Coordinator setup, browser evaluation, and analysis are
excluded; failed reads, failed builds, skill reads, and author repairs are included.

| Condition                     | Input     | Cached input | Output | Total     | Uncached input + output | App/CSS tokens |
| ----------------------------- | --------- | ------------ | ------ | --------- | ----------------------- | -------------- |
| React/CSS                     | 527,225   | 474,880      | 17,497 | 544,722   | 69,842                  | 10,768         |
| Current package               | 1,521,475 | 1,354,112    | 17,203 | 1,538,678 | 184,566                 | 6,776          |
| Static pages + separate props | 1,670,516 | 1,490,816    | 18,066 | 1,688,582 | 197,766                 | 6,965          |
| Bundled pages                 | 1,370,175 | 1,200,768    | 16,453 | 1,386,628 | 185,860                 | 6,825          |

| Condition                     | Initial total | Repair total | First check | Final check | Outer tool requests | Active seconds |
| ----------------------------- | ------------- | ------------ | ----------- | ----------- | ------------------- | -------------- |
| React/CSS                     | 475,446       | 69,276       | 5/6         | 6/6         | 21                  | 322.18         |
| Current package               | 1,538,678     | 0            | 6/6         | 6/6         | 46                  | 382.40         |
| Static pages + separate props | 1,344,691     | 343,891      | 4/6         | 6/6         | 50                  | 382.48         |
| Bundled pages                 | 1,386,628     | 0            | 6/6         | 6/6         | 44                  | 358.85         |

Bundled's total was 3.1% **higher** than Static before independent-check repairs.
Its completed advantage over Static depends on Static's two directory repairs, which added
343,891 total tokens but only 14,035 uncached-input-plus-output tokens. Context replay and
cache accounting materially affect the total. Against Current, Bundled used 2 fewer outer
tool requests across six attempts, rather than a demonstrated large reduction in follow-up reads.

Task totals expose inconsistent results. Bundled cost 14.3% more than Current on the overlay,
2.2% less on the form, and 30.9% less on the directory. Its uncached-input-plus-output count
was higher on both overlay and form. All three library conditions generated less app/CSS
than React/CSS, but none had lower completed authoring totals or uncached-input-plus-output totals.

| Task      | React/CSS total | Current total | Static total | Bundled total | Bundled uncached + output |
| --------- | --------------- | ------------- | ------------ | ------------- | ------------------------- |
| overlay   | 151,312         | 479,657       | 376,795      | 548,288       | 71,232                    |
| form      | 170,334         | 372,145       | 354,535      | 363,967       | 61,375                    |
| directory | 223,076         | 686,876       | 957,252      | 474,373       | 53,253                    |

## Did agents naturally use the pages?

**Two of six bundled agents read their pages. Five of six Static agents read theirs.**
Successful command outputs, including visible content and exact props, establish uptake;
file listings and links alone do not. The indexes were identical between these variants,
so page-body changes cannot explain the initial choice to enter the documentation route.
The groups' different reading routes are a major confound.

| Condition                     | Read index | Read usage page | Read runtime JS/CSS | Read complete contract |
| ----------------------------- | ---------- | --------------- | ------------------- | ---------------------- |
| React/CSS                     | 0/6        | 0/6             | 0/6                 | 0/6                    |
| Current package               | 4/6        | 0/6             | 6/6                 | 0/6                    |
| Static pages + separate props | 4/6        | 5/6             | 5/6                 | 2/6                    |
| Bundled pages                 | 1/6        | 2/6             | 6/6                 | 0/6                    |

Bundled trial 04 reached Dialog, TextField, and AppearanceProvider pages only **after**
reading original declarations and runtime JS. Trial 23 read the compact index and five
bundled pages, then still read declarations and runtime JS/CSS. Neither separately opened
an extracted props file, but the inline props were visible in their page output.
Trials 07, 10, 13, and 18 went through original declarations/runtime without reading a
bundled page. All six bundled agents read implementation code.

Static trials 03, 06, 09, 14, and 24 read usage pages. Trials 03, 06, 14, and 24 separately
read extracted props; 14 and 24 also read complete contracts. Trial 19 used declarations/runtime.
Trial 14 first guessed nonexistent `types/*.d.ts` paths, then corrected to `*.ts`;
that failed read stays in its cost. Current trials 15, 20, and 21 each guessed one missing
declaration path. Existing repeated implementation/style reads remain in the
[audit](../../.work/agent-guidance-cost/bundled-evidence/read-audit.json), with call ordinals,
inputs, output hashes/headings, truncation indicators, and failed reads.

All 18 library apps used appropriate public components. The eight shared components named
above cover the task families; one Static form additionally used Surface. Type/build feedback
caught four apps' invalid props before their first browser check: trial 09 used
`size="small"` and omitted an EmptyState description; 10 and 12 used `size="small"`;
15 used an accent name rather than a hex color. These fixes are included in initial totals.
Bundled trial 10 was a page non-reader.

The earlier one-task sample's 2/2 uptake did not persist here. Natural use is possible,
but agents do not consistently choose the added documentation surface. Comparing just
the two readers would select agents by behavior after assignment and would not establish
a causal effect either.

## Behavior and repairs

The coordinator used trusted T3 browser interactions at 390px and 1280px:
48 assertions per overlay/directory app and 40 per form app.
Initial checks passed **1,080/1,088 assertions**, with 21/24 apps passing completely.
Each failing app received one objective repair without documentation hints.
The three repairs passed **144/144 checks**; the final primary set passes **1,088/1,088**.

- Static directories 09 and 24 overflowed the outer 390px viewport. Both repaired their
  grid/panel sizing.
- React/CSS directory 22 also overflowed and did not expose the selected-Grace status in
  two narrow-screen checks. It repaired table wrapping and off-screen hidden action text.
- Current and Bundled passed all first browser checks.

Evaluation was corrected without changing acceptance. The T3 transport did not support
the checker's `label=` locator syntax; the adapter selected the equivalent named textbox
or searchbox. A sortable header with a nested button was clicked through that button.
The form checker originally searched all body text to confirm old error messages were gone,
which falsely matched native trial 08's introductory “Enter a name and email” copy.
It now checks linked control errors and visible alerts, and the same correction was
applied to all eight form apps. Trial 08's original 36/40 result remains in raw evidence;
it needed no app repair. A human-input interruption ended an early trial-02 evaluation
after 42 assertions; a full rerun passed. Corrected form reruns and that partial browser
run are outside author totals and are not double-counted in the final primary set.

The frozen checker remains unchanged. The
[adapter](../../.work/agent-guidance-cost/bundled-evidence/evaluator-adapter.txt),
[corrected evaluator](../../.work/agent-guidance-cost/bundled-evidence/evaluator-corrected.txt),
[raw evaluator results](../../.work/agent-guidance-cost/bundled-evidence/browser-evaluator-raw.json),
[initial checks](../../.work/agent-guidance-cost/bundled-evidence/browser-initial.json),
[repair checks](../../.work/agent-guidance-cost/bundled-evidence/browser-repairs.json), and
[final checks](../../.work/agent-guidance-cost/bundled-evidence/browser-final.json)
retain the distinction. The older checkpoint also remains as an intermediate record.

## Measured wording and page changes to review

These reference budgets compare each Static usage page **plus its exact prop dependencies**
against the Bundled page. They exclude the identical package index and complete-contract
fallback, and sum independently tokenized core component files. They are controlled reading
budgets, not what every agent actually read. Tokenizer: tiktoken 0.12.0, o200k_base.

| Core task references | Static usage + props | Bundled pages | Reduction |
| -------------------- | -------------------- | ------------- | --------- |
| overlay              | 2,589                | 1,509         | 41.7%     |
| form                 | 2,416                | 1,451         | 39.9%     |
| directory            | 4,861                | 3,269         | 32.8%     |

| Component          | Static usage + props | Bundled page | Reduction |
| ------------------ | -------------------- | ------------ | --------- |
| AppearanceProvider | 458                  | 198          | 56.8%     |
| Button             | 625                  | 337          | 46.1%     |
| Checkbox           | 570                  | 355          | 37.7%     |
| Dialog             | 743                  | 413          | 44.4%     |
| SearchField        | 730                  | 507          | 30.6%     |
| Table              | 2,345                | 1,780        | 24.1%     |
| Tabs               | 703                  | 447          | 36.4%     |
| TextField          | 763                  | 561          | 26.5%     |

The [prototype generator](../../prototypes/agent-guidance-cost/bundled-guide.mjs) makes these
concrete edits available for review:

1. Replace separate composition/state/event/form/labeling prose with a few task-relevant
   behavior bullets, keeping defaults, consumer responsibilities, validation choices,
   focus rules, and required props.
2. Put one minimal JSX expression and exact props on the same page. For example, Button's
   guidance becomes “Use onPress for activation” and “type defaults to button”; Table's
   guidance explicitly says consumers sort rows and notes its default 38rem minimum.
3. Link package setup once through the unchanged index instead of repeating imports,
   provider setup, and general responsibility rules on every component page.
4. Keep complete contracts reachable for selection advice, unusual states, and additional
   examples. The short page deliberately omits those details; their fallback is part of
   the design, rather than a claim that all meaning survives in the abbreviated text.

All 85 inline props match the extracted declarations, all complete-contract links exist,
and all eight new minimal examples compile. Preflight caught `type="email"` on TextField;
the frozen prototype removed it before any agent ran because the API uses `inputType`.
The minimal examples are syntax examples, not ready-made solutions to the trial tasks.
Table's props remain the largest page section; simply shortening prose cannot eliminate
its exact dependent type definitions.

The supported review decision is to retain these smaller pages as a candidate. A further
natural-discovery experiment should put a terse pointer or essential guidance at the
original declaration surface agents already inspect, keeping task prompts neutral.
That is a proposed next experiment, not a shipped change or a test run in this pass.
Do not advertise savings over React/CSS from these results.

## Per-attempt evidence

Total and uncached values include the repair where marked. The retained metrics also expose
input/output/cache/reasoning counters, source hashes, tool-output token estimates, lifecycle
timing, initial metrics, initial/final app/CSS, prompts, and scoped traces. Initial trace
prefixes were recovered from the retained complete traces and verified against their
original frozen hashes; no original attempt was discarded.

| ID  | Task / repeat | Condition                     | Total   | Uncached + output | App/CSS | Tools | Seconds | Page read | First / final | Repair total |
| --- | ------------- | ----------------------------- | ------- | ----------------- | ------- | ----- | ------- | --------- | ------------- | ------------ |
| 01  | overlay / 1   | React/CSS                     | 75,680  | 9,376             | 1,542   | 3     | 47.62   | —         | 48/48 → 48/48 | 0            |
| 02  | overlay / 1   | Current package               | 252,193 | 28,833            | 1,094   | 8     | 89.12   | —         | 48/48 → 48/48 | 0            |
| 03  | overlay / 1   | Static pages + separate props | 186,783 | 23,327            | 1,023   | 6     | 53.64   | yes       | 48/48 → 48/48 | 0            |
| 04  | overlay / 1   | Bundled pages                 | 216,671 | 27,103            | 1,036   | 7     | 59.92   | yes       | 48/48 → 48/48 | 0            |
| 05  | form / 1      | Current package               | 192,814 | 27,566            | 1,188   | 6     | 53.36   | —         | 40/40 → 40/40 | 0            |
| 06  | form / 1      | Static pages + separate props | 156,744 | 26,440            | 956     | 6     | 43.92   | yes       | 40/40 → 40/40 | 0            |
| 07  | form / 1      | Bundled pages                 | 198,743 | 29,783            | 1,030   | 7     | 48.26   | —         | 40/40 → 40/40 | 0            |
| 08  | form / 1      | React/CSS                     | 96,071  | 10,183            | 1,477   | 4     | 42.18   | —         | 40/40 → 40/40 | 0            |
| 09  | directory / 1 | Static pages + separate props | 480,202 | 36,682            | 1,390   | 13    | 95.69   | yes       | 46/48 → 48/48 | 165,951      |
| 10  | directory / 1 | Bundled pages                 | 303,167 | 31,039            | 1,368   | 9     | 72.35   | —         | 48/48 → 48/48 | 0            |
| 11  | directory / 1 | React/CSS                     | 77,568  | 11,008            | 2,303   | 3     | 63.37   | —         | 48/48 → 48/48 | 0            |
| 12  | directory / 1 | Current package               | 363,234 | 35,682            | 1,182   | 10    | 69.59   | —         | 48/48 → 48/48 | 0            |
| 13  | overlay / 2   | Bundled pages                 | 331,617 | 44,129            | 1,039   | 9     | 86.20   | —         | 48/48 → 48/48 | 0            |
| 14  | overlay / 2   | Static pages + separate props | 190,012 | 27,196            | 990     | 7     | 52.83   | yes       | 48/48 → 48/48 | 0            |
| 15  | overlay / 2   | Current package               | 227,464 | 26,120            | 1,157   | 7     | 71.08   | —         | 48/48 → 48/48 | 0            |
| 16  | overlay / 2   | React/CSS                     | 75,632  | 15,984            | 1,597   | 3     | 51.95   | —         | 48/48 → 48/48 | 0            |
| 17  | form / 2      | React/CSS                     | 74,263  | 8,983             | 1,479   | 3     | 38.23   | —         | 40/40 → 40/40 | 0            |
| 18  | form / 2      | Bundled pages                 | 165,224 | 31,592            | 1,013   | 6     | 43.33   | —         | 40/40 → 40/40 | 0            |
| 19  | form / 2      | Static pages + separate props | 197,791 | 45,727            | 1,057   | 6     | 47.13   | —         | 40/40 → 40/40 | 0            |
| 20  | form / 2      | Current package               | 179,331 | 27,523            | 1,005   | 6     | 37.45   | —         | 40/40 → 40/40 | 0            |
| 21  | directory / 2 | Current package               | 323,642 | 38,842            | 1,150   | 9     | 61.80   | —         | 48/48 → 48/48 | 0            |
| 22  | directory / 2 | React/CSS                     | 145,508 | 14,308            | 2,370   | 5     | 78.83   | —         | 44/48 → 48/48 | 69,276       |
| 23  | directory / 2 | Bundled pages                 | 171,206 | 22,214            | 1,339   | 6     | 48.79   | yes       | 48/48 → 48/48 | 0            |
| 24  | directory / 2 | Static pages + separate props | 477,050 | 38,394            | 1,549   | 12    | 89.27   | yes       | 46/48 → 48/48 | 177,940      |

## Limits and reproduction

Two repetitions per task/condition yield descriptive evidence, not a stable adoption rate,
causal token estimate, significance test, or cross-model result. Replayed context, global
cache state, inherited instructions, overlapping starts, agent choice of reading route,
and repair size all affect totals. The comparison holds runtime/APIs fixed but combines
terse wording, shorter examples, and colocation; it does not isolate their separate effects.
Passing these sampled behaviors does not establish full accessibility or production readiness.

Sources are at baseline `89a801e42b008565ff9c21ca6ee1531c4b7b53ab`.
The [summary](../../.work/agent-guidance-cost/bundled-evidence/summary.json),
[metrics](../../.work/agent-guidance-cost/bundled-evidence/metrics.json), and
[frozen experiment](../../.work/agent-guidance-cost/bundled-evidence/experiment.json)
support the interactive [comparison](../../prototypes/agent-guidance-cost/bundled-results.html).

To prepare a new study, first build the unchanged package, then run
`node prototypes/agent-guidance-cost/prepare-bundled.mjs /tmp/wcl-study-new` with a new
neutral path. Validate pages with
`node prototypes/agent-guidance-cost/check-bundled.mjs /tmp/wcl-study-new/variants/bundled`.
The preparation command refuses an existing root. Launch the 24 saved prompts into fresh
same-model/same-effort agents without parent history, save initial counters/sources before
any repairs, and use the checkers through the retained T3 adapter. Apply the documented
evaluator correction consistently. A new run will have different provider counters.

For this retained study, rerun
`/tmp/wcl-guidance-tokenizer/bin/python prototypes/agent-guidance-cost/analyze-bundled.py`.
It verifies frozen hashes, package bytes, initial/final sources and traces, counter arithmetic,
models, natural prompt constraints, read evidence, and primary check results.
Capture is separate: `capture-bundled.py <fixture-root> <session-directory>` and needs the
local provider session records. Raw traces omit system/developer messages and opaque reasoning.
Active time sums author task-start/task-complete intervals and excludes idle evaluation waits.

Prototype lint, formatting, page/prop/example checks, 85 declaration compilation checks,
and generated-documentation consistency pass. The prior 49 contract tests remain unchanged;
production behavior was not edited. All work is isolated to research/prototype/evidence paths,
uncommitted and ready for review.
