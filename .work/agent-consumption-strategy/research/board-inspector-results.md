# Board inspector comparison

The Dialog extension makes this custom board easier to integrate with the library. It removes
a hidden trigger and consumer focus cleanup from the reference implementation. The saving is
small: 393 formatting-normalized characters, or 3.8% of all consumer source. The application
still owns its board, move rules, piece identity, drafts, and focus destination.

## What was tested

On 2026-09-26, compare two temporary installed packages built from `2488a0e`. Both carry the
approved README, equivalent package/type/guide discovery cues, and focused Dialog guidance. The
experimental package adds a controlled Dialog mode without a rendered trigger, requiring
`isOpen`, `onOpenChange`, and `returnFocusRef`. It resolves the current ref after the modal closes.
Existing triggered Dialog behavior remains available. No production API changed.

The coordinator first implemented a one-piece reference with each API. Two fresh coding-agent
conditions then received the same two-piece board and task: add rename, cancel, move, and remove
actions, with exact focus return and unchanged board rules. Native HTML was allowed. The prompt
named neither the new API nor its guide. Each attempt had an eight-minute limit with the same
model and runner configuration. This tests related-task transfer, not general application support.

The [protocol](board-inspector-protocol.md), [prototype](../prototypes/board-inspector/prepare.mjs),
and [task](../prototypes/board-inspector/task.txt) retain the experimental setup.
The raw trial evidence was removed.

## Interruption and follow-up

The first current-package attempt received an unexplained SIGTERM after its type/build check
passed. Its browser check had started; it produced no final usage record. The interruption's
sender and cause are unknown. Its untouched output subsequently passed all 140 independent
checks. Do not count the termination as an application correctness failure.

A fresh current-package follow-up used the original files, package, prompt, model, and limit.
The CLI ran in a separate process session. This departs from the protocol's original rule allowing
restarts only before editing. Both attempts are described here; their raw outputs were removed. Missing usage from the first attempt
prevents comparing aggregate effort across all attempts. Neither the API nor guidance was tuned
after seeing trial output.

## Correctness and composition

Both coordinator references passed 128 checks each. All three agent outputs, including the interrupted
current attempt and its completed follow-up, passed all 140 two-piece checks at 390px and 1280px, with zero page errors.
The independent checker covers pointer/Enter/Space opening, modal naming, sampled focus
containment, trimmed rename, invalid saves, each dismissal path, exact return focus, movement
and occupied-square handling, removal, reset, original adjacent moves, and the existing rules
Dialog. No coordinator repairs changed any app.

The experimental agent found the installed Dialog guide and used the new controlled API. Both
current-package attempts chose native dialogs after inspecting the package. Native dialogs are
valid here. Their use is not a semantic failure or evidence that agents should have imported
more library components. The extension allows the library to take responsibility for modal
behavior while custom board cells remain native buttons.

The experimental output needed no new CSS. It uses native form labeling and input alongside
library action buttons. Current outputs supplied native dialog styling and Tab handling. The
mobile screenshots show intact board layouts and unclipped inspectors; no visual preference
study or complete accessibility audit was performed.

## Source and agent effort

All source counts normalize formatting with Prettier and include `app.tsx`, bootstrap and CSS.
They exclude dependency source and author-written browser test scripts. Those scripts were
removed, but their authoring/debugging contributes to the recorded token totals.

| Output                                    | Current API | Experimental API |       Change |
| ----------------------------------------- | ----------: | ---------------: | -----------: |
| Coordinator reference, source characters  |      10,235 |            9,842 |    3.8% less |
| Completed agent output, source characters |      11,696 |           10,057 |   14.0% less |
| Author-written browser-check characters   |       4,706 |            5,701 |   21.1% more |
| App plus browser-check characters         |      16,402 |           15,758 |    3.9% less |
| Completed commands                        |           8 |               15 |              |
| Nonzero command exits                     |           2 |                5 |              |
| Reported input tokens                     |     295,768 |          558,942 |              |
| Reported cached input tokens              |     244,608 |          525,952 |              |
| Reported output tokens                    |       4,282 |            4,550 |              |
| Total input plus output tokens            |     300,050 |          563,492 |   87.8% more |
| Uncached input plus output tokens         |      55,442 |           37,540 |   32.3% less |
| Elapsed seconds                           |      191.08 |           212.86 | 11.4% longer |

The shared starting app contains 7,185 characters. The completed apps add 4,511 and 2,872
characters respectively. This is an extension task, so the unchanged board accounts for much of
the final source. The interrupted current output contains 12,127 app characters and 4,537
browser-check characters. Its token total is unavailable.
The percentages compare completed attempts only, with the restart limitation described above.
Cached tokens are already part of input tokens; they are not added twice. Uncached input plus
output is a separate diagnostic, not a dollar-cost estimate. These single runs cannot establish
a reliable effect size.

The experimental run read both the focused guide and the full component index, omitted the
required Dialog description once, and repaired that type error. Both completed runs initially
tried clicking the Switch's visually hidden input in their own browser scripts. Current repaired
the locator after one failure; experimental repeated the failing script once before changing
it to the visible label. These were test-authoring failures, not failures in the app's Switch.
Both also tried `git status` in the disposable non-git app. The experimental run issued an
unsuccessful process-cleanup command. The recorded token totals include these incidental costs.

The result does not demonstrate fewer total tokens. It demonstrates less consumer code and
working library reuse in one custom application, with a modest saving in the concise reference.
The experimental agent's broader reads and extra commands are plausible contributors to the
larger total, but this comparison does not isolate their effects.

## Costs and limits

The extension increases the Dialog implementation from 577 to 3,474 source characters, adding
2,897 characters inside the library. Consumers still provide a ref and choose its destination.
The focused guides are 1,058 and 1,368 characters for current and experimental conditions. This
is an API-plus-documentation comparison, with discovery cues improved in both packages. It does
not isolate the effect of the API alone or compare the entire library against React/CSS.

The prototype reuses current modal rendering, styling and content. Its focus cleanup depends on
the inspected React Aria version's scheduling. The standalone proof covers React 19 StrictMode,
replacement of a focus target in the closing commit, and a missing target falling back to the
connected opener. Nested dialogs, overlapping transitions, React 18, Firefox, WebKit, scoped RTL,
and competing focus changes remain unproven. See the
[implementation findings](../prototypes/board-inspector/extension/findings.md).

## Recommendation

Keep this as a narrow interoperability candidate. It removes a real obstacle without prescribing
application structure. Do not treat it as the larger agent-efficiency improvement Whitney is
seeking, or expand it into a broad native-prop rewrite on this evidence.

Before a production ticket, settle the supported focus/trigger contract and compatibility cases.
For the token goal, the next useful investigation is focused retrieval: this trial still read
a full component index for one Dialog task, and existing builds still emit repeated warnings.
Compare concise task-specific static guidance against the current discovery path before adding
a generator or lookup tool. No further authoring runs are scheduled by this report.

The prototype scripts pass ESLint and Prettier; the seed stylesheet passes style lint. The
runner passes Python syntax parsing. `git diff --check` passes.

## Retained tooling

[prepare.mjs](../prototypes/board-inspector/prepare.mjs) and the reference/checker source remain
for building a fresh demonstration from the current package. The historical trial runner,
measurements and app snapshots were removed, so this comparison cannot be replayed from the tree.
The standalone [extension proof](../prototypes/board-inspector/extension/findings.md) remains useful
for its bounded compatibility cases.
