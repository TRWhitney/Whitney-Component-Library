# Explicit wording pilot

The group with explicit Tabs defaults and a controlled SearchField example used different
reading routes, but this pilot does not establish completed token savings. None of the three explicit authors
returned runtime or CSS, compared with two of three controls. Total input plus output rose 3.9%;
uncached input plus output fell 12.7%. All six apps passed 288 independent behavior assertions.
Keep the wording as a tested prototype for review; do not adopt it as a measured cost improvement.

## Setup and package integrity

Whitney authorized this test with "Please test", following the
[runtime investigation](agent-guidance-runtime-reads.md). The [frozen protocol](agent-guidance-wording-protocol.md)
specified three attempts per condition and the same directory brief, scaffold, model/effort,
and independent checker. Order was current/explicit, explicit/current, current/explicit.
Fresh gpt-6.1-sol/high authors received no parent history, condition labels, guidance hints,
or direction to avoid runtime. They could inspect their app and installed dependencies and
edit only its app source and CSS. All reading routes and failed author checks remain in totals.

Only dist/usage/tabs.md and dist/usage/search-field.md differ. Tabs states horizontal/automatic
defaults and first-enabled fallback while preserving selection, state and layout advice.
SearchField shows parent useState setup and controlled value/onChange/onClear. The two pages
grow from 1,122 to 1,184 o200k_base reference tokens, +62 or 5.5%, within the 80-token/10% budget.
[Exact diff](../../.work/agent-guidance-cost/wording-evidence/wording.diff).

All 1,043 other files match, including metadata, runtime/CSS, declarations, exact standalone
props, full contracts, other usage pages, manifest, README and exports. The changed pages retain
identical inline props. Both actual archives clean-installed with React 19.2.8; their installed
trees match frozen variants. Links, all 85 props closures, nine examples, types, and production
consumer builds pass. Preflight supplies query/setQuery/useState for the SearchField fragment
in both conditions; that compile support is outside author packages.

The first preparation completed package checks but failed at an already-existing evidence
directory. Regenerating the owned disposable tree with an idempotent evidence-directory creation
resolved that setup issue before authors launched. A rejected unused sample_01 name also launched
no author. Date-qualified neutral names, actual assignments, prompts and source/protocol hashes
were refrozen before the first launch; package and prompt bytes stayed unchanged by that rename.

## Completed authoring cost

| Sum across three authors       | Current | Explicit | Change |
| ------------------------------ | ------: | -------: | -----: |
| Total input plus output        | 605,038 |  628,815 |  +3.9% |
| Uncached input plus output     | 101,742 |   88,783 | -12.7% |
| Input                          | 597,367 |  620,804 |        |
| Cached input                   | 503,296 |  540,032 |        |
| Output                         |   7,671 |    8,011 |        |
| Reasoning output               |     432 |      333 |        |
| Outer tool requests            |      21 |       21 |   0.0% |
| Tool-output reference estimate |  53,876 |   52,184 |  -3.1% |
| App/CSS reference estimate     |   3,742 |    3,823 |  +2.2% |
| Active author seconds          |  181.80 |   196.02 |  +7.8% |

Cached input is a subset of input; reasoning is a subset of output. Uncached input plus output
is a diagnostic, not a price. Reference estimates use o200k_base and are separate from provider
counters. Coordinator preparation, browser evaluation, capture and analysis are excluded.
Author reading, implementation, failed checks and fixes are included.

| Repetition | Current attempt/total | Explicit attempt/total | Total change | Uncached change |
| ---------- | --------------------- | ---------------------- | -----------: | --------------: |
| 1          | 01 / 160,410          | 02 / 232,871           |       +45.2% |          +91.1% |
| 2          | 04 / 238,206          | 03 / 251,826           |        +5.7% |          -30.0% |
| 3          | 05 / 206,422          | 06 / 144,118           |       -30.2% |          -48.4% |

Two repetitions cost more total tokens with explicit guidance; two favor it on uncached input
plus output. One explicit author used only five outer requests; two used eight and fixed invalid
Button sizes. Aggregate means conceal those routes. Three pairs cannot establish causation or
general improvement, and no fresh native React/CSS condition was run.

## Correctness, builds and browser tooling

All six required author builds eventually passed. Current attempt 04 had one failed TypeScript invocation
with invalid accent "blue" and Button size "small". Explicit attempts 02 and 03 each had one failed invocation
for "small", then read ActionSize and corrected it. The current group has one failed invocation
and two diagnostics; explicit has two failed invocations and two diagnostics. These costs are
included. [Author-check evidence](../../.work/agent-guidance-cost/wording-evidence/author-checks.json).

All 48 assertions per app pass at 390px/1280px, 288 unique primary assertions. No app repairs were
requested. Initial/final sources, traces and counters are identical. The final browser ledger
reuses initial passing results; it does not claim a second browser execution.

Three partial browser tool runs are retained separately: trial 02's header click was interrupted
by human input, trial 05's evaluate timed out, and trial 06's evaluate reported a disconnected
client. They recorded eight, six and zero passing assertions before interruption. Inspecting
the preview and replaying the unchanged checker completed each app. No assertion, source or
counter changed, and no narrow click recovery was used. The owned 5205 host was stopped.
[Partial tool runs](../../.work/agent-guidance-cost/wording-evidence/browser-partial.json),
[run accounting](../../.work/agent-guidance-cost/wording-evidence/browser-run-notes.json).

## What agents read

| Returned content, number of authors | Current | Explicit |
| ----------------------------------- | ------: | -------: |
| Complete metadata                   |       3 |        3 |
| Whole component index               |       1 |        1 |
| Whole root declarations             |       2 |        3 |
| Usage-page content                  |       2 |        3 |
| Component runtime                   |       2 |        0 |
| CSS inspection                      |       2 |        0 |

All three explicit authors received both complete changed pages before writing the app. They
returned no runtime/CSS excerpts or queries. Current attempt 01 also implemented successfully without
runtime or CSS. Current attempt 04 read Tabs/SearchField runtime before usage, then Table runtime/CSS
after its failed build. Current attempt 05 read standalone props and runtime/CSS without usage pages.
Thus the control routes include inspection before guidance and a route that never encountered
the intervention's entry point. The differences do not demonstrate that the new wording alone
caused agents to stop reading implementation.

Explicit attempts 02/03 did not read the Button usage page before their invalid size choice. The changed
Tabs/SearchField guidance covers a subset of the app; other component discovery and type errors
remain relevant to complete cost. No missing-file reads were observed.
[Content audit](../../.work/agent-guidance-cost/wording-evidence/read-audit.json),
[ordering](../../.work/agent-guidance-cost/wording-evidence/ordering.json).

## Evidence and implication

The [experiment record](../../.work/agent-guidance-cost/wording-evidence/experiment.json) freezes
packages, source hashes, actual assignments/prompts and preflight. The
[counters](../../.work/agent-guidance-cost/wording-evidence/metrics.json) retain source/trace hashes,
model/effort, lifecycles and initial/final captures. The
[summary](../../.work/agent-guidance-cost/wording-evidence/summary.json) contains every attempt and
matched repetition. [Preparation](../../prototypes/agent-guidance-cost/prepare-wording.mjs),
[capture](../../prototypes/agent-guidance-cost/capture-wording.py), and
[analysis](../../prototypes/agent-guidance-cost/analyze-wording.py) preserve the reproducible work.

The frozen analyzer passes package/prompt/source/trace integrity, provider-counter identities,
six installed variants, model/effort, successful builds, the size budget and primary behavior
checks. Previous evidence remains unchanged. The modified pages are disposable prototype files;
production wording has not changed. [Independent review](../../.work/agent-guidance-cost/wording-evidence/review.md).

This is a promising reading-route observation with mixed cost evidence. Further confirmation
should retain natural discovery, complete-cost accounting, both conditions and unfavorable
attempts. Do not mandate avoiding runtime or claim a token optimization from this pass. The
remaining decision is whether Whitney wants confirmation or a separate usability change based
on clearer examples; neither is performed by this experiment.
