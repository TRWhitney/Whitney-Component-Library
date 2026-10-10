# Shorter wording benchmark

Clearer, shorter wording was Whitney's intended mechanism for reducing guidance cost. The candidate
uses 22.6% fewer prose words and 3.3% fewer complete-page reference tokens. All 18 apps pass 816
independent assertions without repairs. Completed total tokens fall 3.0% versus current guidance,
but the directory task costs more. The candidate uses 2.40 times the native React/CSS total.
This meets the source-size goal but fails the frozen criterion for consistent completed savings.
Keep the candidate as a measured prototype for review; no production wording is adopted.

## Design and package integrity

Whitney authorized the proposed three-condition, three-task, two-repetition comparison with
"please continue with that" and clarified that clearer wording should reduce words. The
[frozen protocol](agent-guidance-concise-protocol.md) records the conditions, balanced order,
stopping rule and decision criteria. Eighteen fresh gpt-6.1-sol/high authors received neutral
path-only assignments, no parent history and no guidance or runtime-avoidance hints. Native
briefs request React/CSS; library briefs request appropriate installed components. Other
requirements match after normalizing paths. The unchanged tasks cover a profile modal editor,
contact form and searchable directory. Agents choose their own reading routes.

Only eight usage pages differ between the packages. The candidate shortens behavior and layout
prose, preserving exact props, code examples, links and full contracts. Tabs also includes the
previously verified horizontal/automatic defaults and first-enabled fallback, so this is an
integrated concise candidate rather than an isolated word-count intervention. All 1,037 other
files match, including declarations, runtime/CSS, metadata, discovery/index, other guidance,
README and exports. All code fences and the complete exact-props/reference suffixes match.

Both actual archives clean-installed with React 19.2.8. Installed trees, guidance links, all 85
props closures, nine examples, TypeScript and production builds pass. All 12 installed library
copies match their frozen variant; native has no library copy. A draft preflight passed, then a
Table phrase was clarified and neutral agent names finalized before clean regeneration and the
final freeze. No author had launched. Eleven source hashes, packages, prompts and assignments
were frozen before the first author. Production files and earlier evidence remain unchanged.

## Guidance size

Prose words are whitespace-delimited words after removing fenced code. This includes headings
and reference text. Complete-page estimates use o200k_base and include all code and exact props.
These are reference sizes, not provider input counters.

| Page                | Current words | Concise words | Current tokens | Concise tokens |
| ------------------- | ------------: | ------------: | -------------: | -------------: |
| appearance-provider |            63 |            47 |            198 |            186 |
| button              |            77 |            57 |            337 |            318 |
| checkbox            |            77 |            65 |            355 |            347 |
| dialog              |           127 |            98 |            413 |            388 |
| search-field        |            81 |            65 |            507 |            498 |
| table               |           216 |           163 |          2,032 |          1,986 |
| tabs                |           190 |           139 |            615 |            580 |
| text-field          |            94 |            82 |            561 |            548 |
| Total               |           925 |           716 |          5,018 |          4,851 |

Exact props and examples dominate complete-page size, so the word reduction produces a much
smaller complete-page token reduction. Per-task reference totals also shrink: overlay 1,509 to
1,440; form 1,451 to 1,399; directory 3,689 to 3,568. Nothing was removed from the type definitions.
[Exact wording diff](../../.work/agent-guidance-cost/concise-evidence/wording.diff),
[size evidence](../../.work/agent-guidance-cost/concise-evidence/reference-sizes.json).

## Completed authoring

| Sum across six authors       |   Current |   Concise |  Native |
| ---------------------------- | --------: | --------: | ------: |
| Total input plus output      | 1,166,816 | 1,132,184 | 472,169 |
| Input                        | 1,151,754 | 1,116,842 | 457,279 |
| Cached input                 |   998,016 | 1,005,952 | 414,720 |
| Output                       |    15,062 |    15,342 |  14,890 |
| Reasoning output             |     1,444 |     1,519 |     608 |
| Uncached input plus output   |   168,800 |   126,232 |  57,449 |
| Outer tool requests          |        41 |        41 |      19 |
| Tool-output reference tokens |    98,129 |    92,815 |  20,963 |
| App/CSS reference tokens     |     6,581 |     6,620 |   9,995 |
| Active author seconds        |    357.19 |    363.15 |  305.74 |

Cached input is part of input; reasoning is part of output. Total counts input plus output.
Uncached input plus output is a diagnostic, not a price. Reference sizes cannot be subtracted
from provider counters to attribute savings. Author reading, failed builds, fixes and checks
are included; coordinator preparation, evaluation, analysis and review are excluded.

Concise uses 3.0% fewer total tokens and 25.2% fewer uncached input/output than current. It uses
139.8% more total tokens and 119.7% more uncached input/output than native. Its app/CSS source
is 33.8% smaller than native, but both library groups use 41 outer requests versus native's 19.
The source-size reduction does not establish the cause of any provider-counter difference.

| Task, two attempts each | Current total | Concise total | Native total | Concise vs current |
| ----------------------- | ------------: | ------------: | -----------: | -----------------: |
| overlay                 |       441,753 |       396,249 |      164,666 |             -10.3% |
| form                    |       318,965 |       316,652 |      154,836 |              -0.7% |
| directory               |       406,098 |       419,283 |      152,667 |              +3.2% |

The overlay task favors concise wording in both repetitions. Form and directory each split
on total tokens; four of six matched repetitions favor concise. Five favor it on uncached
input/output. Native uses fewer total and uncached tokens in all six matched repetitions.

| Task / repetition | Current / concise / native ids | Concise vs current total | Concise vs current uncached | Concise vs native total |
| ----------------- | ------------------------------ | -----------------------: | --------------------------: | ----------------------: |
| overlay / 1       | 01 / 02 / 03                   |                   -11.7% |                      -18.8% |                 +155.5% |
| overlay / 2       | 12 / 11 / 10                   |                    -8.9% |                      -19.5% |                 +127.1% |
| form / 1          | 06 / 04 / 05                   |                   -12.4% |                      -42.0% |                 +109.6% |
| form / 2          | 13 / 15 / 14                   |                   +15.5% |                      -25.1% |                  +99.4% |
| directory / 1     | 08 / 09 / 07                   |                   +11.7% |                      -38.2% |                 +237.9% |
| directory / 2     | 17 / 16 / 18                   |                    -7.1% |                       +6.0% |                 +115.2% |

[Summary with every attempt](../../.work/agent-guidance-cost/concise-evidence/summary.json) and
[provider counters](../../.work/agent-guidance-cost/concise-evidence/metrics.json) retain all results.

## Natural uptake and author failures

| Returned library content, readers out of six | Current | Concise |
| -------------------------------------------- | ------: | ------: |
| Usage-page content                           |       6 |       6 |
| Complete metadata                            |       5 |       6 |
| Whole index                                  |       4 |       3 |
| Whole root declarations                      |       4 |       4 |
| Complete component runtime                   |       5 |       3 |
| CSS excerpts                                 |       2 |       3 |

All 12 library authors encountered usage-page content naturally. Complete runtime reading
was less common with concise wording, while CSS inspection was more common. These differing
routes are observations, not evidence that brevity alone changed behavior. The audit identifies
content actually returned, with source/output ordinals, hashes, truncation flags and commands.
[Content audit](../../.work/agent-guidance-cost/concise-evidence/read-audit.json).

Current trial 08 had one failed TypeScript invocation for Button size "small". Concise trial 09
had one failed invocation with two diagnostics for accent "blue" and size "small". Authors
corrected the values and passed. Current trial 01 also requested a missing React Aria FocusScope
file. All these operations remain in counters. Native had no failed reads or builds. No browser
repair turns were needed, and initial/final source, counters and traces match.

## Browser evidence and transport

The unchanged overlay checker has 48 assertions/app, form has 40 and directory has 48, each
at 390px and 1280px. All 816 primary assertions pass. The final ledger reuses passing initial
results and does not claim another execution. The owned evaluation host on port 5206 was stopped.

Two partial runs are retained separately: native trial 05 lost its automation host after 17
passing assertions; preview_open returned available and a fresh snapshot succeeded before
replay. Current trial 17's sort click was interrupted by human input after 32 passing assertions.
The snapshot action history identified the interruption. A separate DOM read showed descending
rows/sort state, but no assertion was accepted from it. Replaying the unchanged checker completed
both apps. The extra 49 partial assertions are outside the primary count.

Concise trial 16 also received a failed Summary click response. The frozen adapter verified the
exact selected-tab postcondition with a separate DOM read and continued, as the protocol allows.
This is retained as one narrow recovery, not an app repair. No assertion or author source changed.
[Partial runs](../../.work/agent-guidance-cost/concise-evidence/browser-partial.json),
[narrow recovery](../../.work/agent-guidance-cost/concise-evidence/browser-tooling.json),
[run accounting](../../.work/agent-guidance-cost/concise-evidence/browser-run-notes.json).

## Decision and limits

The prespecified descriptive cost criterion requires lower completed total tokens in aggregate
and in each task sum, with the guidance-size criteria met and no unresolved correctness regression.
Size and correctness pass. Cost fails because the directory sum rises 3.2%. The result is mixed,
even though the aggregate and most uncached comparisons favor the candidate. It does not show
cheaper library authoring than native for these tasks.

This bounds the original word-count hypothesis: shortening prose works as a document-size
change, but preserving exact types/examples leaves a small whole-page saving. Discovery reads,
implementation inspection, repeated context, caching and API mistakes remain in full cost.
Further work should investigate that remaining overhead before assuming more prose edits will
close the native gap. Production wording adoption remains a separate review decision.

Two repetitions per task, one model/effort, reused briefs and uncontrolled reading routes limit
generalization. Passing these tasks does not certify every component behavior or establish that
every phrase is clearer. Cache behavior and stochastic choices can affect provider totals.
Tabs' added default facts also prevent attributing the result solely to fewer words.

The [experiment](../../.work/agent-guidance-cost/concise-evidence/experiment.json) freezes package
integrity and sources. [Preparation](../../prototypes/agent-guidance-cost/prepare-concise.mjs),
[candidate](../../prototypes/agent-guidance-cost/concise-guide.mjs),
[capture](../../prototypes/agent-guidance-cost/capture-concise.py) and
[analysis](../../prototypes/agent-guidance-cost/analyze-concise.py) preserve the experiment.
The analyzer passes frozen hashes, package/props/example parity, source size, model/effort,
provider identities, successful builds, source/trace integrity, launch order and all primary
assertions. [Independent review](../../.work/agent-guidance-cost/concise-evidence/review.md).
