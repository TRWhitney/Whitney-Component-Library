# Metadata cleanup experiment

Omitting author-tooling fields makes package metadata 62.0% smaller in reference tokens, but this six-attempt pilot
does not establish authoring savings. The trimmed group used 7.0% more completed total tokens
and 13.2% more uncached input plus output. All 288 independent behavior assertions pass.
Keep production metadata unchanged on the strength of this result.

## Scope and setup

Whitney authorized the [frozen protocol](agent-guidance-metadata-protocol.md) with
"Alright, lets do that next." Three fresh attempts per condition used the same people directory
brief, app scaffold, model/effort, and independent checks. Conditions alternated full/trimmed,
trimmed/full, full/trimmed. Actual prompts/assignments are retained and contain no condition labels
or guidance instructions. Agent names were neutral attempt_01 through attempt_06.

Full metadata is the current local [guidance integration proposal](agent-guidance-proposal.md).
Trimmed omits only scripts and devDependencies. All 1,044 other package files are identical,
including runtime/CSS, declarations, 255 guidance files, README, manifest, and four public exports.
This tests the integrated proposal rather than the earlier seven-entry-point research package.
No native condition was run; older native measurements remain historical context.

Both actual archives clean-installed with React 19.2.8. Installed package trees matched their
frozen variants. All guidance links, 85 props closures, eight minimal examples, the Table wrapper
example, TypeScript checks, and consumer production builds passed. Author apps used the same
React/tooling via shared dependency links and their own copied library package.

The fixture tree was relocated to a neutral path before authors launched. Package bytes were
unchanged; prompt/assignment paths and hashes were refreshed before freezing. Six fresh
gpt-6.1-sol/high contexts received no parent history. Only each app's source/CSS was writable.
No source repositories, other fixtures, network, Git changes, browser self-checks, or delegation
were authorized for authors. The current inherited instruction costs stay in their totals.

## Completed authoring results

| Measure, sums across 3 authors | Full metadata | Trimmed metadata | Change |
| ------------------------------ | ------------: | ---------------: | -----: |
| Total input plus output        |       605,916 |          648,044 |  +7.0% |
| Uncached input plus output     |        87,132 |           98,668 | +13.2% |
| Input                          |       597,801 |          640,683 |        |
| Cached input                   |       518,784 |          549,376 |        |
| Output                         |         8,115 |            7,361 |        |
| Reasoning output               |           454 |              146 |        |
| Tool requests                  |            20 |               22 | +10.0% |
| Tool-output reference estimate |        60,803 |           57,376 |  -5.6% |
| App/CSS reference estimate     |         3,686 |            3,706 |  +0.5% |
| Active author seconds          |        197.31 |           181.06 |  -8.2% |

Total means input plus output. Cached input is part of input; reasoning is part of output.
Uncached input plus output is a diagnostic rather than a price. Tool-output and source estimates
use o200k_base, separate from provider counters. Coordinator setup, preflight, evaluation, and
analysis are excluded. The complete author sequence, including failed checks and fixes, is included.

| Repetition | Full attempt | Full total | Trimmed attempt | Trimmed total | Total change | Uncached change |
| ---------- | ------------ | ---------: | --------------- | ------------: | -----------: | --------------: |
| 1          | 01           |    188,859 | 02              |       273,393 |       +44.8% |          -21.2% |
| 2          | 04           |    209,497 | 03              |       190,332 |        -9.1% |          +36.8% |
| 3          | 05           |    207,560 | 06              |       184,319 |       -11.2% |          +39.5% |

Two repetitions favor trimming on total tokens and two favor full metadata on uncached input
plus output. The large first-pair total difference reverses the aggregate. Treat these as noisy
small-sample observations, not proof that metadata trimming itself increases cost.

## Correctness and author failures

All six apps passed all 48 independent assertions at 390px/1280px, 288/288 total.
The checks cover responsive containment, labeled tabs/panels, sorting, filtering/clearing,
keyboard activation, row actions/live status, empty results, and state surviving tab changes.
No app interaction repairs were needed. Trial01's Summary-tab click reported a browser tool
failure. A separate DOM read confirmed the exact requested selected-tab postcondition, the
narrow recovery allowed by the protocol. The [tooling ledger](../../.work/agent-guidance-cost/metadata-evidence/browser-tooling.json)
retains that failure. No assertion or app source changed during evaluation.

Final app sources, author traces, and counters equal their initial captures. The final browser
ledger copies the passing initial results because no repairs occurred; it does not record a
second browser execution. The 288 assertions count each app check once.

During authoring, attempt02 used unsupported button size "small" and corrected one failed
TypeScript invocation. Attempt04 used that size and an invalid literal "blue" accent, then
corrected one failed invocation with two diagnostics. Both then built successfully before initial
behavior checks. These fixes are already included in completed counters. Four authors passed
their first check. [Author-check evidence](../../.work/agent-guidance-cost/metadata-evidence/author-checks.json).

## Reading routes

All six authors received complete metadata once, 1,444 reference tokens for Full and 548 for
Trimmed. That saves 896 tokens per whole metadata body, 2,688 across three authors. Other returned
references varied substantially.

| Observed route                   | Full, 3 authors | Trimmed, 3 authors |
| -------------------------------- | --------------: | -----------------: |
| Whole metadata returned          |               3 |                  3 |
| Whole index returned             |               0 |                  2 |
| Whole root declarations returned |               1 |                  3 |
| Usage-page content returned      |               2 |                  3 |
| Component runtime returned       |               3 |                  3 |
| CSS query returned               |               0 |                  0 |

Whole-file counts omit partial reads and do not prove that the other authors never inspected
the index. Attempt02 requested its first 80 lines and received a partial index. Some index searches
used type names or headings the component selection index does not contain. Attempt05 read full
contracts instead of bundled usage pages. All authors read Tabs runtime; other runtime reads were
SearchField or Table. Returned bodies, not filenames alone, establish these observations.

The Full group received 4,332 metadata, zero whole-index, and 2,172 whole-root-declaration reference
tokens. Trimmed received 1,644, 3,168, and 6,516 respectively. These are visible file-body estimates,
not additive attribution to provider totals. Full attempts01 and05 also had truncated directory
listing outputs. No missing-file reads were observed.

The earlier responsive study's three supplemented authors avoided runtime/CSS reads. Here,
all six inspected runtime despite identical usage-page text. Transfer of that reading pattern
remains uncertain. New attempts, the integrated package entry points/index/maps, and context
variation prevent attributing this cross-study difference to metadata.

## Evidence and analysis correction

- [Frozen experiment and preflight](../../.work/agent-guidance-cost/metadata-evidence/experiment.json)
- [Provider counters and source/trace hashes](../../.work/agent-guidance-cost/metadata-evidence/metrics.json)
- [Summary and repetitions](../../.work/agent-guidance-cost/metadata-evidence/summary.json)
- [Content-based reading audit](../../.work/agent-guidance-cost/metadata-evidence/read-audit.json)
- [Initial behavior checks](../../.work/agent-guidance-cost/metadata-evidence/browser-initial.json)
- [Independent evidence review and correction](../../.work/agent-guidance-cost/metadata-evidence/review.md)
- [Preparation](../../prototypes/agent-guidance-cost/prepare-metadata.mjs),
  [capture](../../prototypes/agent-guidance-cost/capture-metadata.py), and
  [corrected analyzer](../../prototypes/agent-guidance-cost/analyze-metadata-v2.py)

The first analysis rejected the neutral task brief because its filtering requirement says
"trimmed substring". That word describes search semantics, not a condition label. The original
frozen analyzer is retained; a second version narrows this hint check, with original/corrected
hashes in the [amendment](../../.work/agent-guidance-cost/metadata-evidence/analysis-amendment.json).
No prompt, author source, browser assertion, or provider counter changed. The corrected analysis
verifies original frozen hashes, six installed packages, assignments, initial/final sources,
sanitized traces, model/effort, counters, positive builds, and all primary behavior assertions.

The owned 5204 evaluation host was stopped after the checks. Previous evidence and the local
production proposal remain intact. No production metadata edit, adoption, commit, or publication
was made.

## Implication

Do not adopt metadata trimming as a measured token-cost improvement. It reduces one consistently
read reference and appears compatible with the sampled consumer build, but complete authoring
costs did not improve consistently. The next useful decision is whether to test stronger guidance
discovery or investigate why agents verify component runtime after reading guidance. This pass
does not select or authorize another experiment.
