# Creation and maintenance comparison

The current library did not lower observed token usage through creation and maintenance.
It used 1,251,281 total tokens against 454,996 for React/CSS, or 2.75 times as many. Final app
source was 20% smaller, chiefly because it needed 43% less CSS. Both apps passed the same
objective requirements.

Whitney's goal is lower usage in the general case. Subjective style feedback is outside the
evaluation method. Human review costs remain unknown, but cannot be used to excuse observed
overhead or manufacture an assumed future saving.

## Scope

On 2026-09-26, one native React/CSS app and one app instructed to use the current library received
the same Trail kit brief. The app includes search, item counts, editing with validation, deletion
confirmation, responsive styles and modal keyboard/focus behavior. The library condition received
one additional sentence requiring suitable library components, with no guidance-path hint.

Both initial apps passed 26 independent scenarios at 390px and 1280px. Neither needed the allotted
external correction round. Each then received the same maintenance brief in a fresh context:
start dark, add a dark/light appearance control, change the accent to blue, and add independent
item duplication with long-name handling. The library-use instruction was not repeated.

The current library includes the approved README. No experimental API, guidance generator, build
warning suppression or production change was included. Agents could mix native and library
controls. The library app used AppearanceProvider, Button and TextField; it retained native
search, modal rendering and focus handling. Maintenance kept those imports and used the provider's
appearance/accent props. Applications still owned layout, data, copies and custom styling.

Inputs, model configuration, package hash, stage snapshots, traces and results are in
[retained evidence](pilot/lifecycle/). The [protocol](lifecycle-protocol.md) fixes the staged
comparison and correction limits. Model and environment match the preceding comparison:
Codex CLI 0.157.1, gpt-6-astra with medium reasoning, Node 24.21.0, React 19.2.8, TypeScript 5.9.3,
Vite 8.2.1 and Playwright 1.61.1. Each initial/maintenance run had an eight-minute limit.

## Observed costs

| Measure                                          | React/CSS | Current library |
| ------------------------------------------------ | --------: | --------------: |
| Creation total tokens                            |   241,599 |         347,154 |
| Maintenance total tokens                         |   213,397 |         904,127 |
| Cumulative total tokens                          |   454,996 |       1,251,281 |
| Creation uncached input plus output              |    27,327 |          72,594 |
| Maintenance uncached input plus output           |    51,477 |          46,655 |
| Cumulative uncached input plus output            |    78,804 |         119,249 |
| Cumulative authoring seconds                     |    457.48 |          545.36 |
| Initial app source characters                    |    18,705 |          14,586 |
| Final app source characters                      |    21,525 |          17,165 |
| Final CSS characters                             |     9,476 |           5,396 |
| Final verification source left in app repository |     6,800 |          10,505 |
| Completed commands, creation + maintenance       |    10 + 9 |         11 + 20 |
| Nonzero command exits, creation + maintenance    |     4 + 3 |           3 + 7 |
| External correction rounds needed                |         0 |               0 |

Creation used 44% more total tokens with the library. Maintenance used 4.24 times as many,
bringing the cumulative premium to 175%. Cumulative uncached input plus output was 51% higher,
although that measure fell 9% for maintenance alone. Neither measure supports a cumulative saving
here. The elapsed-time difference was 19%, much smaller than the token difference. These are distinct
measures; no dollar-cost claim is made.

Of the 4,360-character final app reduction, 4,080 characters came from CSS. The two TSX apps
differed by only 280 characters, with identical bootstrap size. The library reduced styling
source while the app retained most state, native-modal and focus-handling code.

Tokens are reported input plus output, with cached input included once. Uncached input plus
output is a separate measure, not monetary cost. Authoring includes discovery, styling,
self-verification and repairs. Independent evaluator/coordinator work is outside these totals.
No elapsed-time figure includes human review or represents end-to-end project delivery time.

Source counts normalize formatting. App counts include all runtime TSX and CSS, including
bootstrap and authored icons. Verification source left in each app is separate. These are final sizes, not all code written:
maintenance agents also authored temporary checks, including one outside the app and one later
removed from src. Their commands and revisions remain in the traces and their token costs are
included. Raw source is unchanged. Both conditions began with the same runtime scaffold.

## Where effort went

The initial library run produced 151,335 characters of completed command output against 5,863
for native. The package listing/setup read produced 65,641, the component index 27,173, additional
public type reads 10,304, and one build 46,229. That build emitted 67 repeated module-directive
warnings. These are recorded output sizes, not token-cost estimates or a causal decomposition.
The library build itself passed.

The native initial run repaired an invalid CSS import, accessible-name markup and test
focus timing. The library initial run repaired its own focus-timing check. Both attempted git
status in the disposable non-git app. These incidental costs remain in the totals. The traces
show variation in verification work; a single pair cannot establish expected savings or reliability.

Maintenance produced 87,885 command-output characters for the library versus 27,415 for native.
The library emitted the same 67 build warnings again. Its agent also debugged a temporary browser
script through seven failed commands: a missing assertion dependency, premature contrast reads
during appearance transitions, and focus checks around duplication and modal closing. It added
explicit focus restoration to duplication and eventually passed its checks. Native maintenance
also repaired contrast and test-script failures, but completed in nine commands against twenty.
The independent checks later passed both apps without accommodations. These traces identify
possible costs to remove, but do not prove that each extra command was caused by a library defect.

## Requirements and review

Both apps passed all 26 initial scenarios and all 64 maintenance scenarios, with zero failed
steps, unverified scenarios, or browser page errors. Maintenance checks run at both widths in
both appearances. Final type/build checks also passed. No coordinator repair changed app source.
Minimum computed ordinary-text contrast in the maintenance captures was 5.76:1 for native and
4.81:1 for library, both above the required 4.5:1.

The independent checker covers search and empty recovery, trim/invalid names, cancellation,
Escape, deletion confirmation, exact focus return, modal Tab/Shift+Tab containment, duplicate
order and identity, copy editing/deletion isolation, long-name wrapping, appearance propagation,
page/element geometry and computed text contrast. Source review checked stable IDs, public theme
APIs and absence of dependency-private styling overrides. The checks are Chromium-only and
sample interactions; they are not a complete accessibility or visual audit.

Coordinator screenshot review checked objective clipping, wrapping and visible focus, and found
no additional requirement defect needing a correction round. It does not establish subjective
design quality. Human style/feel revision costs remain unmeasured, but are not part of this
evaluation method and are not assumed to offset token overhead.

The [rendering evidence](lifecycle-previews.md) retains matched states and run instructions.
It documents the checked outputs; no subjective score or human-directed revision round is
proposed. The evaluation should improve general agent usage through objective checks across
representative tasks.

## Execution corrections and excluded attempt

The first installed-package attempt used only native controls. Whitney clarified that a one-time
instruction to use the library is assumed, and adoption is outside this evaluation. That attempt
is retained as `library-initial` but excluded from the native-versus-library comparison. It used
154,610 total tokens, 41,714 uncached input plus output, and 219.72 seconds. No maintenance run was
performed on it. The replacement library run began from the original blank scaffold; its prompt
adds only the library-use instruction. This was a user-directed correction, not a rerun selected
for a better score.

The evaluator initially compared rendered category labels case-sensitively and treated a decorative
period in the page heading as a prerequisite for all scenarios. Those assumptions were corrected
uniformly and documented, with previous results retained. Before inspecting maintenance outputs,
the checker was also corrected to accept disabled Save as valid rejection and to toggle either
native or styled checkboxes/switches through keyboard activation. These are evaluator repairs,
not app defects or charged authoring corrections. See the
[checker notes](../prototypes/lifecycle/checker-notes.md).

## Interpretation

The useful reduction is concentrated in styling code. It did not repay package-learning and
verification costs in this sequence. Do not label the library more efficient on the assumption
that subjective revisions would reverse the result.

The next candidate should reduce recurring costs already visible across this sequence and the
earlier pilot: broad package listings, large guidance/type reads, and repeated build warnings.
Keep initial library-use instruction as an assumption. Keep native composition and application
breadth. Test any proposed change against the current package and React/CSS on more than one
predefined task, including maintenance, with fixed objective checks and repeated runs before
claiming a general effect.

Verification friction also deserves investigation, but the focus/transition test failures do
not establish a broad API rewrite as the remedy. Neither more documentation nor fewer source
characters is itself evidence of lower total usage. No production change was made. No additional authoring run is scheduled by this report.

This is a bounded observation, not a lifetime-cost forecast. It covers a conventional item list,
one appearance change and one data/interaction feature. It does not cover years of maintenance,
library upgrades, multiple developers, different application types, or actual human design review.
The earlier custom board experiment remains separate evidence about application breadth.

Prototype scripts pass ESLint and Prettier. The runner parses as valid Python. Local report
links and `git diff --check` pass. Raw evidence is excluded from formatting and linting.

## Reproduction

The runnable scripts are in [prototypes/lifecycle](../prototypes/lifecycle/). Run
`npm run check:generated`, then `node .work/agent-consumption-strategy/prototypes/lifecycle/prepare.mjs`.
It prints a temporary root with installed app scaffolds. Use `run.py <root> native initial` and
`run.py <root> library-required initial --prompt .work/agent-consumption-strategy/prototypes/lifecycle/library-initial.txt`.
After checking and any recorded corrections, run each condition's `maintenance` stage without
a prompt override. `check.mjs <app> <evidence> <free-port> initial|maintenance` assesses the untouched
app, and `measure.mjs <root>` measures completed stages. An authenticated Codex CLI is required;
authoring runs consume tokens. Do not overwrite existing evidence or rerun to improve results.
The unused `library` scaffold exists only to reproduce the excluded attempt.
