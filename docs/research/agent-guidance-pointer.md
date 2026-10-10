# Declaration pointers: measured results

Short declaration links provided a usable route to guidance, but this experiment did not
demonstrate increased uptake or establish that the links caused lower authoring cost.
The pointer group used **14.2% fewer total tokens** and **5.9% fewer uncached-input-plus-output
tokens** than the identical bundled-page control. It still used **2.26 times React/CSS total
tokens** and 60.7% more uncached input plus output.

Only **3/6 pointer agents actually saw a pointer**. All three read guidance afterward.
The other three reached the pages independently. The control group also read pages in
**6/6 attempts**, so this run had no remaining uptake improvement to measure.
All 18 apps passed all **816 initial and final behavior assertions**, without repairs.

The concrete candidate for review is nine short declaration comments. They add 144 estimated
reference tokens across those files and preserve declaration meaning. Retain them as a
navigation candidate; a token-saving claim remains unsupported. No production change shipped.

## Question and design

Following the [bundled-page study](agent-guidance-bundled.md), Whitney authorized testing
a pointer in the declaration files agents already inspect. The
[frozen protocol](agent-guidance-pointer-protocol.md) bounded this pass to 18 attempts:
three tasks × three conditions × two repetitions.

Tasks and scaffold match the preceding study: a profile-editing dialog, a contact form with
custom validation, and a searchable/sortable directory with peer tabs. Conditions were fresh
React/CSS, the existing bundled pages, and identical pages plus declaration pointers.
The current-package condition was omitted so this pass isolates pointers directly and retains
a same-run comparison without the library. Historical results are context, not controls.

Fresh native child agents used gpt-6.1-sol at high effort without parent-history forks.
Task assignments contained no documentation paths, mechanism hints, or variant names.
They identified the installed library where applicable, allowed dependency inspection, and
required the same TypeScript/build check. Authors could edit only their own app/CSS.
No browser self-checks, tests, network, other fixtures, source repositories, or Git mutations
were allowed. All inherited instruction/skill costs remain in author totals.

The six blocks rotated condition order. Actual starts were trial 01 through 18 and overlapped.
Internal child IDs shared the prefix `pointer_` across every condition, including React/CSS.
That name could cue the subject of the experiment even though it did not reveal the assigned
condition; natural-task neutrality therefore applies to the saved task text, not every piece
of child metadata. This limits comparisons with prior uptake rates. No attempts were rerun
or discarded after observing their reading routes.

## Exact prototype change

The [generator](../../prototypes/agent-guidance-cost/declaration-pointers.mjs) prepends this
comment to the public `dist/index.d.ts`:

```ts
/** Component usage, behavior, and exact props: ./agent-index.md */
```

Each of eight tested component declaration files gets a matching one-line link. For example,
`dist/overlays/dialog.d.ts` gains:

```ts
/** Dialog usage, behavior, and exact props: ../usage/dialog.md */
```

The eight leaves are AppearanceProvider, Button, Checkbox, Dialog, SearchField, Table, Tabs,
and TextField. Relative targets resolve from each declaration file. Comments supply a link
without an instruction to follow it or new inline behavior advice. All original declaration
text remains directly below the comment.

The variants otherwise have identical package metadata, README, bundled pages, extracted
props, complete contracts, and runtime. Actual package-tree comparisons verify only nine
`.d.ts` files differ and all 201 runtime JS/CSS files match. The TypeScript printer produces
identical declarations after removing comments. All 12 installed copies match their prepared
variants. All 85 bundled pages still have exact props and complete-contract fallbacks, and
the eight minimal examples compile. The nine comments add 144 o200k_base tokens, measured both
as their standalone text and as the difference between original/revised declaration files.
This reference count does not imply every agent reads all nine comments.

Protocol, generator, guide, tasks, checkers, package trees, saved task briefs, and actual
assignment texts were frozen before authoring. Preparation's hash ordering was normalized
before that freeze; the retained runtime-hash labels use the earlier traversal order, while
the analyzer directly compares actual runtime bytes. The
[frozen experiment](../../.work/agent-guidance-cost/pointer-evidence/experiment.json)
records that distinction.

## Completed authoring costs

Each row sums six attempts. No independent-check repairs were needed, so initial and completed
author counters are identical. Total equals input plus output and includes cached input.
Cached input is a subset of input, and reasoning is a subset of output. Neither is added twice.
Uncached input plus output is a diagnostic, not a price. Setup, coordinator analysis, and
independent browser evaluation are excluded. Failed reads, failed builds, and author fixes
before completion remain included.

| Condition          | Input     | Cached input | Output | Total     | Uncached input + output | App/CSS tokens |
| ------------------ | --------- | ------------ | ------ | --------- | ----------------------- | -------------- |
| React/CSS          | 482,511   | 411,264      | 15,565 | 498,076   | 86,812                  | 9,949          |
| Bundled pages      | 1,298,331 | 1,165,184    | 15,138 | 1,313,469 | 148,285                 | 6,367          |
| Bundled + pointers | 1,112,203 | 987,776      | 15,059 | 1,127,262 | 139,486                 | 6,670          |

| Condition          | Outer tool requests | Tool-output tokens | Active seconds | First / final apps |
| ------------------ | ------------------- | ------------------ | -------------- | ------------------ |
| React/CSS          | 21                  | 15,578             | 334.09         | 6/6 → 6/6          |
| Bundled pages      | 44                  | 109,686            | 416.11         | 6/6 → 6/6          |
| Bundled + pointers | 41                  | 95,846             | 379.16         | 6/6 → 6/6          |

The pointer group made three fewer outer tool requests, returned 12.6% fewer estimated
tool-output tokens, and used 8.9% less active author time. These descriptive differences
depend on chosen read routes and batching. They do not establish which part of the difference
came from comments rather than ordinary agent variation.

The aggregate saving comes from the directory task. Pointer total tokens were **higher**
for both overlay and form. Form uncached input plus output was 53.8% higher with pointers.
Both library conditions produced smaller app/CSS than React/CSS, but both used more
completed author tokens and uncached input plus output.

| Task      | React/CSS total | Bundled total | Pointer total | Pointer total change | Pointer uncached change |
| --------- | --------------- | ------------- | ------------- | -------------------- | ----------------------- |
| overlay   | 185,514         | 410,215       | 435,035       | 6.1%                 | -9.1%                   |
| form      | 147,272         | 301,254       | 302,828       | 0.5%                 | 53.8%                   |
| directory | 165,290         | 602,000       | 389,399       | -35.3%               | -31.9%                  |

Four of six matched task/repetition comparisons favor pointers on total tokens. Four favor
pointers on uncached input plus output, but these are not the same four comparisons.
The table keeps both rather than selecting only the favorable metric.

| Task / repeat | Bundled ID | Pointer ID | Bundled total | Pointer total | Total change | Uncached change |
| ------------- | ---------- | ---------- | ------------- | ------------- | ------------ | --------------- |
| overlay / 1   | 02         | 03         | 191,764       | 269,905       | 40.8%        | -11.4%          |
| overlay / 2   | 11         | 10         | 218,451       | 165,130       | -24.4%       | -7.2%           |
| form / 1      | 04         | 05         | 116,814       | 159,036       | 36.1%        | 136.2%          |
| form / 2      | 15         | 14         | 184,440       | 143,792       | -22.0%       | 8.8%            |
| directory / 1 | 09         | 07         | 249,008       | 163,237       | -34.5%       | -38.2%          |
| directory / 2 | 16         | 18         | 352,992       | 226,162       | -35.9%       | -25.9%          |

## Actual pointer exposure and page reads

Pointer exposure requires the comment text in a returned tool result. Page uptake requires
returned page content with exact props. A filename, listing, link, or requested path by itself
does not count. The
[read audit](../../.work/agent-guidance-cost/pointer-evidence/read-audit.json) retains paired
call/output ordinals, inputs, visible pointer lines and headings, output hashes, errors, and
truncation flags.

| Condition          | Saw pointer | Read usage pages | Read index | Read runtime JS/CSS | Read full contract |
| ------------------ | ----------- | ---------------- | ---------- | ------------------- | ------------------ |
| React/CSS          | 0/6         | 0/6              | 0/6        | 0/6                 | 0/6                |
| Bundled pages      | 0/6         | 6/6              | 6/6        | 5/6                 | 1/6                |
| Bundled + pointers | 3/6         | 6/6              | 6/6        | 4/6                 | 1/6                |

- **05, form:** public-entry declaration pointer was visible in output 29; the agent then read
  the guide and four pages, whose content appeared in output 42.
- **10, overlay:** public-entry and Dialog leaf pointers appeared in output 28; the guide and
  four pages appeared in output 33. Runtime reads continued in that same batched response.
- **18, directory:** the Button leaf pointer appeared in output 35; five pages appeared in
  output 40, together with additional Tabs/SearchField/Table declaration pointers.
  It had already read the guide in the earlier call, so a pointer was not necessary for its
  initial documentation discovery.
- **03, 07, and 14:** no pointer comment appeared in returned content. All read pages through
  the existing guide or discovered package paths.

The temporal sequence is compatible with following a pointer, but does not prove the pointer
prompted the read. In particular, trial 18 had already entered the documentation route.
The control's 6/6 usage and the unexposed pointer agents' 3/3 usage mean this pass cannot
demonstrate a page-uptake increase. The previous pass's 2/6 bundled uptake was not a reliable
forecast of this new sample.

Pointers also did not consistently replace implementation reading. Four of six pointer agents
and five of six controls read runtime JS/CSS. The two form pointer agents needed no runtime
reading; one control form likewise needed none. Full Dialog contracts were read by pointer
trial 03 and control trial 11. Original declarations were still read by several agents,
including agents who had inline props on their usage pages.

## Failures, quality, and retained evidence

Every author reported a passing TypeScript/production build. Independent trusted T3
interactions checked 390px and 1280px behavior: 48 assertions per overlay/directory app,
40 per form app, for 816 primary assertions. Every app passed on its first independent
check. There were no browser tool errors, interruptions, corrections after freezing, or
app-repair follow-ups in this pass.

The form checker's previous error-association correction was incorporated before freezing.
The established transport adapter maps unsupported `label=` syntax to named textbox or
searchbox locators and clicks a sort header's nested button where present. The
[adapter](../../.work/agent-guidance-cost/pointer-evidence/evaluator-adapter.txt),
[initial checks](../../.work/agent-guidance-cost/pointer-evidence/browser-initial.json),
[final checks](../../.work/agent-guidance-cost/pointer-evidence/browser-final.json), and
[tooling record](../../.work/agent-guidance-cost/pointer-evidence/browser-tooling.json)
retain the evaluation setup.

Failed dependency reads remain visible. Pointer 03 guessed three nonexistent
`types/*.d.ts` files, and control 04 guessed four; the extracted files use `.ts`.
Pointer 07 guessed `inputs/search-field.js` and control 15 guessed
`fields/checkbox.d.ts`. Control 16's first build rejected `size="small"`; it corrected
that before completing authoring. These are author costs, not discarded attempts.

All 12 library apps used appropriate public components. Initial/final app/CSS, counter
timelines, actual task and assignment texts, scoped traces, model/effort, source/trace hashes,
and lifecycle timing are under
[pointer-evidence](../../.work/agent-guidance-cost/pointer-evidence/summary.json).
Initial traces were copied before any potential repair, and match their original hashes.
System/developer messages and opaque reasoning are excluded from retained scoped traces.

| ID  | Task / repeat | Condition          | Total   | Uncached + output | App/CSS | Tools | Seconds | Pointer seen | Page read |
| --- | ------------- | ------------------ | ------- | ----------------- | ------- | ----- | ------- | ------------ | --------- |
| 01  | overlay / 1   | React/CSS          | 73,070  | 23,534            | 1,448   | 3     | 48.73   | —            | —         |
| 02  | overlay / 1   | Bundled pages      | 191,764 | 25,364            | 813     | 6     | 63.31   | —            | yes       |
| 03  | overlay / 1   | Bundled + pointers | 269,905 | 22,481            | 1,035   | 10    | 78.28   | —            | yes       |
| 04  | form / 1      | Bundled pages      | 116,814 | 10,702            | 929     | 5     | 42.30   | —            | yes       |
| 05  | form / 1      | Bundled + pointers | 159,036 | 25,276            | 997     | 6     | 60.74   | yes          | yes       |
| 06  | form / 1      | React/CSS          | 69,482  | 21,866            | 1,540   | 3     | 52.82   | —            | —         |
| 07  | directory / 1 | Bundled + pointers | 163,237 | 18,853            | 1,182   | 6     | 61.09   | —            | yes       |
| 08  | directory / 1 | React/CSS          | 70,695  | 8,359             | 2,162   | 3     | 66.03   | —            | —         |
| 09  | directory / 1 | Bundled pages      | 249,008 | 30,512            | 1,159   | 9     | 64.65   | —            | yes       |
| 10  | overlay / 2   | Bundled + pointers | 165,130 | 27,530            | 1,116   | 6     | 64.99   | yes          | yes       |
| 11  | overlay / 2   | Bundled pages      | 218,451 | 29,651            | 1,048   | 7     | 70.60   | —            | yes       |
| 12  | overlay / 2   | React/CSS          | 112,444 | 14,268            | 1,434   | 5     | 60.82   | —            | —         |
| 13  | form / 2      | React/CSS          | 77,790  | 8,926             | 1,415   | 3     | 46.71   | —            | —         |
| 14  | form / 2      | Bundled + pointers | 143,792 | 21,296            | 1,117   | 5     | 50.97   | —            | yes       |
| 15  | form / 2      | Bundled pages      | 184,440 | 19,576            | 998     | 7     | 57.81   | —            | yes       |
| 16  | directory / 2 | Bundled pages      | 352,992 | 32,480            | 1,420   | 10    | 117.44  | —            | yes       |
| 17  | directory / 2 | React/CSS          | 94,595  | 9,859             | 1,950   | 4     | 58.98   | —            | —         |
| 18  | directory / 2 | Bundled + pointers | 226,162 | 24,050            | 1,223   | 8     | 63.09   | yes          | yes       |

## Review implication and limits

The links are a working optional route in the agents' own dependency-inspection flow.
The demonstrated change is small and reviewable: nine one-line comments, with no new tool,
retrieval command, or task-prompt instruction. The measured evidence supports considering
that navigation aid. It does not establish increased adoption, universal natural use,
or lower authoring cost caused by pointers, and does not meet the original goal of using
fewer tokens than React/CSS.

Two repetitions per task/condition provide descriptive evidence only. Cache state, context
replay, inherited instructions, overlapping starts/order, ordinary agent choices, internal
task naming, and a single corrected build affect totals. The study combined entry-point
and leaf pointers, so it cannot separate their effects. Passing sampled behavior is not a
complete accessibility audit or production-readiness assessment.

Review should decide whether navigation alone merits adopting the small pointer change.
If a demonstrated token saving is required, this sample is insufficient. Another experiment
or production adoption requires a new instruction; neither is underway.

## Reproduction and verification

Baseline: `89a801e42b008565ff9c21ca6ee1531c4b7b53ab`.
The [interactive comparison](../../prototypes/agent-guidance-cost/pointer-results.html),
[summary](../../.work/agent-guidance-cost/pointer-evidence/summary.json), and
[metrics](../../.work/agent-guidance-cost/pointer-evidence/metrics.json) retain the measured
distinctions.

With the unchanged package built, prepare a fresh neutral fixture root using
`node prototypes/agent-guidance-cost/prepare-pointer.mjs /tmp/wcl-study-new`.
It refuses an existing root. Run `check-pointer.mjs <root>` for links and TypeScript
declaration equivalence, and `check-bundled.mjs <root>/variants/pointer` for all pages and
eight examples. Launch the 18 saved neutral assignments in fresh same-model/same-effort
agents, using neutral internal agent names in a replication. Capture initial evidence
before any repair using `capture-pointer.py <root> <provider-session-directory>`.
For a replication, create each `assignment.txt` using the retained assignment wording with
the new fixture path, then record its SHA-256 in `experiment.json` before launching.
The retained experiment additionally hashes its actual assignment files; preparation
initially hashes task briefs, and the coordinator froze the actual messages before launch.

For the retained study, rerun
`/tmp/wcl-guidance-tokenizer/bin/python prototypes/agent-guidance-cost/analyze-pointer.py`.
It verifies package bytes, the nine exact comments and targets, frozen source/prompt/assignment
hashes, initial/final source/trace hashes, counters, models, visible read content, and checks.
Source/reference estimates use tiktoken 0.12.0, o200k_base. Active time sums author
task-start/task-complete intervals and excludes idle coordinator evaluation.

Prototype lint/format, pointer equivalence/targets, all 85 page props/fallbacks, and eight
minimal examples pass. Earlier contract/generated checks remain valid because production
was not edited. The evaluation server at 5202 was deliberately stopped after the checks.
Previous research/evidence remains intact. All additions are uncommitted research/prototype
artifacts for review; no README/AGENTS, runtime, showcase, or production guidance changed.
