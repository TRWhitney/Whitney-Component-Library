# Natural guidance discovery results

Agents found and used both static references and lookup without documentation hints in their
task prompts. Two attempts per condition support discoverability for this setup, not a general
adoption rate. Static averaged 6.3% fewer total tokens and 12.5% fewer uncached input plus output
than current. Lookup averaged 10.4% more total despite 3.6% fewer uncached tokens. Neither beat
React/CSS, including native repairs.

## Design and uptake

The [protocol](agent-guidance-discovery-protocol.md) specified eight fresh gpt-6.1-sol/high
profile-editor attempts, two each for React/CSS, current package, compact static references,
and those references with installed lookup. Library briefs requested appropriate installed
components without naming docs, commands or required components. README/runtime matched;
second-batch condition order reversed. These were disposable variants.

| Condition | Guide read | Usage pages | Extracted props | Full contracts | Successful lookup | Runtime JS read |
| --------- | ---------: | ----------: | --------------: | -------------: | ----------------: | --------------: |
| Current   |        2/2 | Unavailable |     Unavailable |            0/2 |       Unavailable |             2/2 |
| Static    |        2/2 |         2/2 |             2/2 |            2/2 |       Unavailable |             1/2 |
| Lookup    |        2/2 |         2/2 |             2/2 |            0/2 |               2/2 |             1/2 |

All six library apps rendered Dialog, TextField, Button and AppearanceProvider. Prototype
agents read the unchanged README/index then followed links or the command description.
Returned content established use, rather than filenames alone. Both static agents read full
contracts after usage/props; three prototype agents inspected runtime or full contracts.

## Completed results

| Condition | Combined total | Mean total | Combined uncached + output | Mean uncached + output | Mean source tokens | First-pass apps |
| --------- | -------------: | ---------: | -------------------------: | ---------------------: | -----------------: | --------------: |
| Native    |        392,315 |    196,158 |                     29,307 |                 14,654 |              1,284 |             0/2 |
| Current   |        447,782 |    223,891 |                     50,342 |                 25,171 |                730 |             2/2 |
| Static    |        419,579 |    209,790 |                     44,027 |                 22,014 |                702 |             2/2 |
| Lookup    |        494,478 |    247,239 |                     48,526 |                 24,263 |                687 |             2/2 |

Totals include discovery, authoring, type/build failures, clarifications and repairs; setup,
analysis and independent evaluation are excluded. Cached input is part of input, reasoning is
part of output. Uncached input plus output is a diagnostic, not a price. Source estimates use
`o200k_base`. Static source was 45.4% smaller than native while total was 7.0% higher and
uncached input plus output 50.2% higher.

## Failures and limitations

All eight apps passed type/build. Six library apps initially passed 48/48 browser assertions;
both native apps passed 44/48. Native dialogs allowed Tab into browser chrome at the first/last
control, contrary to the task's explicit containment requirement. One identical repair message
per app led to explicit wrapping, adding 37,890 and 70,454 total tokens. Final checks passed
384/384 across 390px/1280px. Initial plus repair evaluations executed 480 assertions, 472 passing.
This task requirement does not establish a general defect in native modal dialogs.

Lookup trial 05 requested comma-separated topics, which failed, then repeated topic flags,
which silently returned only the first topic. The agent separately read usage and completed
the app. Exit-zero execution therefore did not mean all requested topics were returned. No
revised parser was included in the measurement or adopted for production.

Batch-two agents inherited repository workflow instructions in non-repository fixtures.
Trials 05/06/08 requested clarification; 07 inspected the instructions and continued. Those
costs remain included. Large cache proportions, variable routes and two attempts per condition
prevent isolating guidance effects. This covers one simple task, one model/effort and local
package discovery, with no maintenance or unprompted library-selection test.

## Decision

The original recommendation favored static distribution for another pass, with exact props
and full contracts available. It proposed bundling props, an example and task-relevant behavior
to reduce follow-up reads. The [bundled study](agent-guidance-bundled.md) subsequently tested
that direction; [production integration](agent-guidance-proposal.md) records what was adopted.

Raw captures and one-off study tooling were removed. Exact historical replay is unavailable.
See the [evidence retention policy](agent-evidence-retention.md).
