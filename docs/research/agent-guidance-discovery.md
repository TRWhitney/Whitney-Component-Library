# Natural guidance discovery results

Agents found and used both prototypes without documentation hints in their task prompts.
Both static-reference agents followed the links and read extracted props. Both lookup agents
executed the command and received relevant guidance and props. This supports natural discovery
for this task, model, and installed-package setup. Two attempts per condition cannot establish
a general adoption rate.

The static prototype averaged 6.3% fewer total tokens and 12.5% fewer uncached input plus output
than the current package. The lookup prototype averaged 10.4% more total tokens, despite 3.6%
fewer uncached input plus output. Neither prototype beat React/CSS on these averages, including
the native apps' repairs. These are descriptive results, not established causal savings.

## What was tested

Eight fresh agents built the same profile editor, with two attempts each using React/CSS, the
current package, compact static references, or compact references plus an installed lookup.
The library instruction only asked agents to use appropriate installed components. It did not
name documentation paths, a command, or required components. The package README stayed identical.
Library JavaScript and CSS hashes matched. All agents used `gpt-6.1-sol` with high effort and
no parent-history fork. The second batch reversed condition order.

The [frozen protocol](agent-guidance-discovery-protocol.md) defines the task boundaries, stopping
rule, repair allowance, and accounting. [Prompts, hashes, provider counters, and model records](../../.work/agent-guidance-cost/discovery-evidence/metrics.json)
retain the setup. These disposable package variants are not production changes.

## Observed discovery

| Condition | Guide read | Usage pages | Extracted props | Full contracts | Successful lookup | Runtime JS read |
| --------- | ---------: | ----------: | --------------: | -------------: | ----------------: | --------------: |
| Current   |        2/2 | Unavailable |     Unavailable |            0/2 |       Unavailable |             2/2 |
| Static    |        2/2 |         2/2 |             2/2 |            2/2 |       Unavailable |             1/2 |
| Lookup    |        2/2 |         2/2 |             2/2 |            0/2 |               2/2 |             1/2 |

All six library agents imported and rendered Dialog, TextField, Button, and AppearanceProvider.
The current-package agents found the existing index through package metadata. Prototype agents
read the unchanged README and compact index, then followed its links or command description.
Discovery therefore depended on information inside the installed package, not an instruction
injected into the app task. A listed file alone did not count as use.

The [static trial 03 trace](../../.work/agent-guidance-cost/discovery-evidence/trial-03/trace.jsonl)
contains usage output at ordinal 36, extracted props at 41, and full Dialog guidance at 48.
The [static trial 06 trace](../../.work/agent-guidance-cost/discovery-evidence/trial-06/trace.jsonl)
contains usage output at 42 and props plus full contracts at 49.
The [lookup trial 04 trace](../../.work/agent-guidance-cost/discovery-evidence/trial-04/trace.jsonl)
contains a successful accessibility-and-props lookup at 37.
The [lookup trial 05 trace](../../.work/agent-guidance-cost/discovery-evidence/trial-05/trace.jsonl)
contains a successful lookup at 42, a failed comma-separated topic request at 53, and a second
exit-zero lookup at 58. Its repeated topic flags returned only the first topic, as described below.

Both static agents read full contracts after reading usage and props. Three prototype agents
also inspected runtime JavaScript or full contracts. The mechanisms were discoverable, but
agents still sought additional evidence before implementation.

## Measured authoring usage

Totals include initial authoring, discovery, type/build checks, failures, administrative
clarifications, and repairs. They exclude coordinator setup, analysis, and browser evaluation.
Input includes cached input. Output includes reasoning output. Neither is counted twice.
Uncached input plus output is a separate diagnostic, not a price estimate.

| Trial | Condition | Total tokens | Cached input | Uncached input + output | App/CSS tokens | Tool requests | Active seconds | Initial checks |
| ----- | --------- | -----------: | -----------: | ----------------------: | -------------: | ------------: | -------------: | -------------: |
| 01    | Native    |      106,074 |       97,152 |                   8,922 |          1,291 |             4 |          54.91 |          44/48 |
| 02    | Current   |      203,618 |      178,688 |                  24,930 |            699 |             7 |          45.01 |          48/48 |
| 03    | Static    |      231,958 |      208,000 |                  23,958 |            705 |             8 |          48.25 |          48/48 |
| 04    | Lookup    |      202,297 |      182,016 |                  20,281 |            687 |             8 |          59.36 |          48/48 |
| 05    | Lookup    |      292,181 |      263,936 |                  28,245 |            686 |            11 |          62.20 |          48/48 |
| 06    | Static    |      187,621 |      167,552 |                  20,069 |            698 |             7 |          43.12 |          48/48 |
| 07    | Current   |      244,164 |      218,752 |                  25,412 |            761 |             8 |          48.19 |          48/48 |
| 08    | Native    |      286,241 |      265,856 |                  20,385 |          1,277 |            12 |          87.75 |          44/48 |

| Condition | Combined total | Mean total | Combined uncached + output | Mean uncached + output | Mean source tokens | First-pass apps |
| --------- | -------------: | ---------: | -------------------------: | ---------------------: | -----------------: | --------------: |
| Native    |        392,315 |    196,158 |                     29,307 |                 14,654 |              1,284 |             0/2 |
| Current   |        447,782 |    223,891 |                     50,342 |                 25,171 |                730 |             2/2 |
| Static    |        419,579 |    209,790 |                     44,027 |                 22,014 |                702 |             2/2 |
| Lookup    |        494,478 |    247,239 |                     48,526 |                 24,263 |                687 |             2/2 |

The static apps used 45.4% fewer source tokens than native, but 7.0% more total tokens and 50.2%
more uncached input plus output. Shorter consumer code did not imply cheaper authoring.
Tool requests count outer harness calls, which may batch several shell commands. Active seconds
sum task start-to-completion intervals, including repair turns, and exclude the gap spent waiting
for independent evaluation. Source counts use `o200k_base`, not provider usage accounting.
The [computed summary](../../.work/agent-guidance-cost/discovery-evidence/summary.json) retains
per-trial and condition totals. [Initial metrics](../../.work/agent-guidance-cost/discovery-evidence/initial-metrics.json)
preserve the pre-repair counters and source hashes.

## Failures and limits

All eight apps passed their type/build checks. All six library apps passed their first 48
browser assertions. Both native apps passed 44/48 initially. Their native modal dialogs permitted
Tab into browser chrome at the first and last control. They blocked background interaction,
but the task explicitly required keeping Tab and Shift+Tab inside the dialog. Each received
one identical objective repair message and added explicit wrapping. Native repairs added
37,890 and 70,454 total tokens. All eight final apps passed 48/48 at 390px and 1280px.
There were 480 executed assertions, 472 passing across initial and repair evaluations, with
384/384 in the final set. [Initial](../../.work/agent-guidance-cost/discovery-evidence/browser-initial.json),
[repair](../../.work/agent-guidance-cost/discovery-evidence/browser-repaired.json), and
[final](../../.work/agent-guidance-cost/discovery-evidence/browser-final.json) results remain separate.
The [focus reproduction](../../.work/agent-guidance-cost/discovery-evidence/native-focus-reproduction.json)
records the native-browser behavior. This strict task requirement should not be interpreted
as a general defect in native modal dialogs.

The lookup prototype has a usability defect. Trial 05 requested
`--section=usage,state,forms,structure`, which failed. It then tried repeated `--section` flags.
The prototype accepted those flags but silently used the first, returning state guidance only.
The agent separately read usage pages and completed the task. The parser uses `args.find`, so
the omitted topics are an established implementation defect. Exit-zero execution does not prove
the request was fully satisfied. The prototype and installed variants remain frozen as tested.
The [parser probe](../../.work/agent-guidance-cost/discovery-evidence/lookup-parser-probe.json)
confirms repeated-topic output equals first-topic-only output and combined topics fail.

Batch-two agents inherited repository skill instructions despite working in non-repository
fixtures. Trials 05, 06, and 08 requested workflow clarification; trial 07 inspected those skills
and continued. The coordinator clarified fixture authorization without documentation hints.
Those costs remain included. Cache proportions and inherited context were also large. The two
attempts per condition have substantial variation, so the means cannot isolate guidance effects.

This tests one simple app task, one model/effort, local package inspection, and an explicit request
to use the library. It does not test agents that ignore package docs, restricted environments,
other models, complex compositions, maintenance, or choosing the library without prompting.

## Changes to review

The compact static package is the stronger candidate for another measured pass. It worked
through ordinary package discovery, introduced no command syntax, and had the lowest observed
library averages. Keep the terse index, linked usage pages, extracted prop dependencies, and
complete contracts as a fallback. The [earlier wording measurements](agent-guidance-cost.md)
still quantify the reference-size reduction; this test adds evidence about actual uptake.

Before considering the lookup for production, support both comma-separated and repeated topic
flags, validate every flag, and return all requested topics with setup printed once. Trial 05
provides a concrete reason for that change. No revised parser was included in these results.

Further savings should target unnecessary follow-up reads. A small component answer could
combine exact props, one example, and the behavior relevant to the task, such as modal focus or
field validation. Agents currently retrieve these separately or inspect implementation code.
That is a hypothesis for a future controlled comparison, not a measured saving from this pass.
Whitney's decision is whether to approve the static distribution design or authorize another
prototype comparison. No production change, publication, or commit occurred.

## Reproduce and verify

`node prototypes/agent-guidance-cost/prepare-discovery.mjs <fresh-temp-directory>` builds the
disposable variants and prompts. Preflight runtime resolution and lookup, then freeze protocol,
checker, prompt, and package hashes before spawning eight fresh agents in the recorded order.
Use the [browser checker](../../prototypes/agent-guidance-cost/discovery-browser-check.mjs)
through T3's collaborative browser and the evaluation-only
[build server](../../prototypes/agent-guidance-cost/serve-discovery.mjs). Retain initial results
before sending the single allowed repair message.

`capture-discovery.py <temp-directory> <scoped-session-directory>` captures child counters,
sources, prompts, sanitized tool traces, and timelines using `tiktoken==0.12.0`. Save initial
metrics and native sources before repairs. `python3 prototypes/agent-guidance-cost/analyze-discovery.py`
validates frozen protocol/checker hashes, prompts, identical runtime hashes, models, usage
arithmetic, and all final interaction results, then regenerates the summary. Uptake annotations
in that script were manually audited against the linked command outputs and final imports.
The [interactive comparison](../../prototypes/agent-guidance-cost/discovery-results.html)
uses those results. Research and prototype additions are isolated from production library files.
Scoped lint, formatting, Python syntax, local links, source/trace hashes, and the comparison's
data/control assertions pass. The comparison fits 360px and 728px previews. All 85 prototype
contracts, 2,470 reachable guidance entries, and extracted declaration compilation still pass;
generated production documentation is unchanged. [Package verification](../../.work/agent-guidance-cost/discovery-evidence/package-verification.json)
also compares actual runtime bytes, README bytes, and all six installed package trees with their
prepared variants, rather than relying only on the recorded hash labels.
