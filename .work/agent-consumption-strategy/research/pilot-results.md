# Agent consumption pilot

## Conclusion

The package-local guide prototype improved discovery and reuse of library components. It produced
smaller application source files in two of three tasks. It did not reduce total token use, and the
checks do not establish better semantic correctness than the native implementations.

The strongest next steps are quieter package builds, a cheaper path to task-specific guidance,
small composition examples, and investigation of concrete overlay/focus workarounds. The full
prototype should not be adopted unchanged on the strength of its shorter index.

## Setup

Three tasks, each run once with React/CSS, the current installed library, and a documentation
prototype. All nine runs completed. Task prompts contained no guidance-file hint. Each run began
in a fresh app directory and agent context. No application instructions named the library guide.

- Tasks: [preferences, equipment register, and usage report](../evaluation-tasks.md).
- Runner: Codex CLI 0.157.1, configured model `gpt-6-astra`, medium reasoning.
- Node 24.21.0, React 19.2.8, TypeScript 5.9.3, Vite 8.2.1, Playwright 1.61.1.
- Eight-minute time limit per run. No run reached it. No reviewer repairs to application code.
- Current package source: `2488a0e`, packed after `check:generated` passed and before adding README.
- The prototype added README, metadata/type-entry links, task-grouped guidance, component pages,
  extracted prop references, and full contract pages. Shared runtime JavaScript and CSS stayed
  unchanged. All 85 extracted prop references compiled.
- Skills, project guidance, memories, plugins, hooks, and subagents were excluded from trial
  configuration. Generic global AGENTS instructions remained identical across conditions.
- Two initial runs failed before editing because the nested sandbox could not initialize its
  loopback interface. They were excluded and restarted from unchanged app fixtures using the
  same filesystem access as the coordinating session. Smoke/preflight usage is not task usage.

The [runner](../prototypes/evaluate.py) and [guide generator](../prototypes/generate-guide.mjs)
are experimental artifacts, not production tooling or release checks. The
[recorded runner flags](pilot/runner-flags-unrestricted.json) preserve the configuration used.
The [current](pilot/baseline.json) and [prototype](pilot/improved.json) package records include
artifact hashes. Raw events, prompts, app outputs, starting files, and checks are under
`pilot/<condition>-<task>/`.

Codex reports usage on completed turns through its JSONL output. Counts below use reported input
plus output tokens, with cached input included once. Cached input and reasoning output fields are retained separately; the total does not add those
fields again.
[Official non-interactive-mode documentation](https://learn.chatgpt.com/docs/non-interactive-mode).

## Measurements

These are observed single-run totals across the three tasks, not expected savings or reliability
estimates. Source size includes each final app's `src/app.tsx` and `src/styles.css`, including
authored data literals and decorative content. It excludes the identical bootstrap, dependency
source, tests, and changed HTML titles. Formatting-normalized line counts are retained separately
because some agents wrote CSS on one line.

| Condition       | App and CSS characters | Input + output tokens | Uncached input + output |
| --------------- | ---------------------: | --------------------: | ----------------------: |
| React/CSS       |                 50,417 |               412,848 |                  65,456 |
| Current library |                 43,127 |               808,814 |                 134,254 |
| Guide prototype |                 34,157 |             1,525,597 |                 135,517 |

The prototype's final source was 32% smaller than React/CSS and 21% smaller than the current
library condition in these outputs. Total token usage increased. Uncached input plus output was
approximately unchanged against the current library and more than twice the native total. This
last measure is neither total tokens nor dollar cost.

| Task               | Prototype source vs current | Prototype total tokens vs current |
| ------------------ | --------------------------: | --------------------------------: |
| Preferences        |                 28% smaller |                          13% more |
| Equipment register |                 33% smaller |                         311% more |
| Usage report       |                   5% larger |           Approximately unchanged |

See [per-run measurements](pilot/metrics.json), the individual `run-summary.json` files, and the
[measurement script](../prototypes/measure.mjs). Evaluator usage is separate from trial usage.

## Discovery and use

All three prototype runs read `agent-index.md` through ordinary installed-package inspection.
None of the three current-library runs read its index in the recorded commands. Only the report
prototype run explicitly read README; this does not isolate README as the cause of discovery.

- Preferences: the current-library run used Button and Switch, omitted AppearanceProvider,
  recreated the input and radio group, and targeted private `data-wcl-*` attributes in CSS. The
  prototype run used AppearanceProvider, TextField, RadioGroup, Switch, and Button without those
  private overrides.
- Register: the current-library run used Button and implemented the other controls with native
  elements. The prototype used Dialog, AlertDialog, SearchField, TextField, StatusIndicator, and
  EmptyState with AppearanceProvider. Both final implementations used native tables.
- Report: both library conditions used LineChart, Spinner, Button, and AppearanceProvider. The
  prototype also used SegmentedControl and EmptyState. The current version's native state
  selector and persistent feedback were valid alternatives under the task rubric.

This supports better library discovery and greater reuse, including avoiding concrete contract
violations in preferences. More imports alone do not prove more appropriate semantic choices.

## Sources of cost

### Package inspection

The preferences agent listed the package's files before reading focused guidance. That output
was about 60,000 characters for the current package and 78,000 for the prototype. Splitting the
guide into more files increased that listing cost, even though the index shrank from 27,173 to
11,006 characters. A shorter index alone is not an adequate token-saving criterion.

### Successful build warnings

Both library preferences builds emitted about 46,000 characters, mostly repeated module-level
`use client` warnings. Those outputs became context for subsequent work.

A separate temporary-package experiment removed 66 internal duplicate directives and retained
the root public client boundary. The same preferences app built successfully with one warning
and about 1,000 output characters. Production JavaScript and CSS were byte-identical to the
prototype app's original build. See [result](pilot/build-noise/result.json) and
[changed internal files](pilot/build-noise/change.json).

This is evidence for investigating a quieter distribution. It is not server/client-boundary
compatibility proof, and no production build change was made.

### Composition and repair

The prototype register first used Table. Two authoring checks failed to open its keyboard-triggered
editor. The agent inspected its own rendered Table, replaced it with a native table, and later
added delayed DOM queries for cancellation and post-deletion focus. Its repeated reads and checks
account for much of the high token count. The trace establishes repair effort and an abandoned
composition, not the cause of a library defect. See the
[trace](pilot/improved-2/events.jsonl) and [final app](pilot/improved-2/src/app.tsx).

This reinforces the need to investigate focus composition, alongside the pre-existing workbench
examples with hidden dummy dialog triggers. A minimal reproduction must distinguish a library
problem from a test or usage problem before changing an API.

The preferences prototype still wrote custom email validation and draft state. A concise example
of native form validation, submission, and reset could reduce that work using existing APIs.

## Verification and limitations

Independent browser checks pass for all nine final apps at 390px and 1280px. They cover the
selected interactions in the retained scripts: preferences submission/reset, collection editing
and confirmation/focus, and report states/exact values/retry. Type and build checks passed in the
authoring traces. Public APIs were inspected separately for usage findings.

These are not complete accessibility or visual audits. Focus containment checks sample traversal,
and some focus checks establish a reachable control without proving the best target. The report
script checks tabular values and states; it does not measure chart geometry. The preference
checker was corrected to use keyboard radio selection and not assume an initial switch state.
The register checker waits for animated dismissal and deferred focus recovery. These evaluator
corrections did not alter app code or authoring-token totals.

The briefs leave two details ambiguous: whether reset also changes the saved summary, and whether
the report's current day means Sunday or the local weekday. Neither difference is scored as a
failure. Future repeats should specify both.

Authoring browser checks shared localhost ports. At least the native preferences run tried a
wrong port before correcting it. Independent checks used separate dedicated ports. Raw authoring
usage therefore includes infrastructure and test-writing noise; future runs should reserve a
fixed port per trial. Do not attribute every retry or token difference to the library.

One run per condition cannot establish success rates or causal savings. Layout, copy, and styling
vary despite identical behavior requirements. The prototype combines several documentation
changes and targets task families known to the coordinator, so this is not a held-out test of
generalization. Do not turn these nine runs into a claim that the user's three goals are achieved.

## Reproduction

Use a clean checkout of `2488a0e` to build and pack the baseline, retaining the recorded dependency
versions. The runner's `prepare` action packs its current repository build, so do not use a later
working tree as the old-library baseline. The retained app package manifests reference the
original temporary tarballs; replace those file references with the reconstructed tarballs before
installing. No credentials are included in the retained artifacts.

`generate-guide.mjs <output-directory>` regenerates the prototype references from this baseline's
built declarations and contracts. The tested package also included the approved README, a package
description pointing to `./agent-index.md`, and a matching comment at the top of `dist/index.d.ts`.
The runtime was unchanged. Do not fold the separate build-noise experiment into the guide
condition when reproducing this comparison.

Use `inspect-preferences.mjs`, `inspect-register.mjs`, or `inspect-report.mjs` with a trial path,
evidence directory, and unused port to check outputs. The scripts start and stop their own server.
The flags and original trial prompts are recorded with each result; each authoring trial used a
fresh `codex exec` context. Exact stochastic outputs are not reproducible from a fixed prompt.
