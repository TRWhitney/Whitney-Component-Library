# Responsive guidance: measured results

The two page supplements supported the composition hypothesis for this directory task.
All three agents read the new guidance; none read runtime implementation or CSS afterward.
All three controls read both. The supplement group used **29.6% fewer total tokens** and
**17.5% fewer uncached input plus output tokens** than the prior guidance.

The library still cost more than React/CSS. The supplement group used 1.92 times completed
React/CSS total tokens and 2.17 times its uncached input plus output. Before the native naming
repair, those ratios were 2.27 and 2.24. This is evidence for a useful task-specific documentation
candidate, not general savings from using the library.

All nine final apps pass all 432 primary assertions. Initial checks passed 430/432; one
React/CSS app needed a table-name repair. No library app needed a repair. No production change shipped.

## Question and setup

Whitney authorized the [saved-trace audit](agent-guidance-detours.md), a focused prototype, and
comparison after asking where to go next. The audit found runtime reads in all six library
directory attempts across the preceding bundled and pointer studies. Existing pages already
describe sorting, filtering, state, and keyboard responsibilities. Responsive composition was
a plausible missing example, though most individual author motives were unknown.

The [frozen protocol](agent-guidance-layout-protocol.md) specifies nine fresh attempts:
one unchanged directory task × three conditions × three repetitions. Conditions are React/CSS,
prior bundled pages plus declaration pointers, and that identical package with supplements on
only Table/Tabs usage pages. Condition order rotates in each repetition. Actual launch order
was 01 through 09, with overlapping execution.

Author IDs were neutral sample_01 through sample_09. Task and assignment text contains no
guidance paths, variant names, reading advice, or experiment labels. Fresh gpt-6.1-sol/high
authors received no parent-history fork, wrote only their app/CSS, and ran the same build check.
All inherited instruction costs remain in author counters. No agents were rerun or discarded
based on their reading routes.

The task is the same searchable/sortable people directory with accessible tabs, live selection,
persistent state, and no outer overflow at 390px. React and native/custom composition remain
allowed. The prototype example uses inventory items instead of the evaluated people records.
It supplies a wrapper technique, not the directory app's full implementation.

## Exact candidate

The [generator](../../prototypes/agent-guidance-cost/layout-guide.mjs) inserts a responsive
composition section before exact props in Table, and panel layout advice before exact props
in Tabs. Both existing minimal examples, all behavior text, exact props, and full links remain.

Table gains a compiling example of a wide table inside an application-owned table-frame div.
Its CSS sets min-width: 0, max-width: 100%, and overflow-x: auto. The accompanying text explains
the component's existing internal scrolling, numeric/content width choices, and shrinking grid
tracks. Tabs explains the library panel's existing padding/border/background and demonstrates
spacing and containment on application-owned wrappers.

The two insertions add **420 o200k_base reference tokens**. A complete five-component directory
reference budget rises from 3,269 to 3,689, about 12.8%. More targeted information produced less
total inspection in this sample. Reference size alone would have ranked this variant worse.

Exactly two usage pages differ. All 201 runtime JS/CSS files and 195 declarations match byte
for byte; metadata, README, guide, pointers, and other pages are identical. Original page text
is recoverable by removing the two insertions. All 85 references retain exact props/full
fallbacks, eight original minimal examples compile, and the new Table example builds.

Independent preflight at 390px measured outer width 390, with the table's internal scroll width
640 and client width 323. At 1280px the outer page still fits. Panel switching and automatic
arrow activation pass. The example uses no internal selectors or new public styling hooks.

## Completed author costs

Each row sums three attempts. Total equals input plus output and includes cached input.
Cached input is a subset of input; reasoning is a subset of output. Uncached input plus output
is a diagnostic, not a price. Coordinator audit, setup, browser evaluation, and analysis are
excluded. All author fixes and the one native repair are included.

| Condition          |   Input | Cached input | Output |   Total | Uncached input + output | App/CSS tokens |
| ------------------ | ------: | -----------: | -----: | ------: | ----------------------: | -------------: |
| React/CSS          | 250,931 |      229,120 |  9,928 | 260,859 |                  31,739 |          6,776 |
| Prior guidance     | 701,780 |      626,688 |  8,418 | 710,198 |                  83,510 |          3,727 |
| Layout supplements | 492,788 |      430,848 |  6,967 | 499,755 |                  68,907 |          3,525 |

| Condition          | Tool requests | Tool-output tokens | Active seconds | Runtime readers | CSS readers |
| ------------------ | ------------: | -----------------: | -------------: | --------------: | ----------: |
| React/CSS          |            10 |              7,239 |         228.77 |             0/3 |         0/3 |
| Prior guidance     |            24 |             61,232 |         252.18 |             3/3 |         3/3 |
| Layout supplements |            18 |             46,176 |         180.80 |             0/3 |         0/3 |

Compared with control, supplement authors used 25% fewer outer tool requests, 24.6% fewer
estimated tool-output tokens, and 28.3% less active author time. App/CSS was 5.4% smaller.
Neither library condition needed repairs, so these differences do not depend on native repair cost.

Total tokens favor the supplement in all three matched repetitions. Uncached input plus output
favors it in two; repetition 2 is 4.4% higher. Keep that disagreement visible.

| Repeat | Control ID | Supplement ID | Total change | Uncached change |
| ------ | ---------- | ------------- | -----------: | --------------: |
| 1      | 02         | 03            |      -36.77% |         -20.84% |
| 2      | 04         | 05            |      -17.75% |           4.41% |
| 3      | 09         | 07            |      -32.26% |         -33.12% |

| ID  | Repeat | Condition          |   Total | Uncached + output | Tool requests | Active seconds | Initial checks |
| --- | ------ | ------------------ | ------: | ----------------: | ------------: | -------------: | -------------: |
| 01  | 1      | React/CSS          |  74,670 |            12,718 |             3 |          73.97 |          48/48 |
| 02  | 1      | Prior guidance     | 223,477 |            23,925 |             8 |         107.81 |          48/48 |
| 03  | 1      | Layout supplements | 141,308 |            18,940 |             5 |          58.86 |          48/48 |
| 04  | 2      | Prior guidance     | 198,087 |            26,951 |             7 |          66.65 |          48/48 |
| 05  | 2      | Layout supplements | 162,924 |            28,140 |             6 |          53.95 |          48/48 |
| 06  | 2      | React/CSS          | 112,058 |             9,530 |             4 |          86.64 |          46/48 |
| 07  | 3      | Layout supplements | 195,523 |            21,827 |             7 |          67.99 |          48/48 |
| 08  | 3      | React/CSS          |  74,131 |             9,491 |             3 |          68.16 |          48/48 |
| 09  | 3      | Prior guidance     | 288,634 |            32,634 |             9 |          77.72 |          48/48 |

## Actual uptake and source reads

Returned content, not requested filenames, establishes uptake. The
[read audit](../../.work/agent-guidance-cost/layout-evidence/read-audit.json) retains call/output
ordinals, actual headings, runtime file bodies, stylesheet-query content, hashes, and errors.

- 03 returns both supplement sections in output36, then writes the app without runtime/CSS reads.
  It also reads unchanged Stack, Surface, and ScrollRegion pages, showing broader component exploration.
- 05 returns both sections in output39, then writes without runtime/CSS reads.
- 07 returns both in output38, alongside original component declarations, then writes without runtime/CSS reads.
- Control02 reads usage output43, then full Table/Tabs and Tabs runtime output50,
  followed by more stylesheet inspection output59.
- Control04 reads usage and declarations output42, then full Table, SearchField runtime,
  and stylesheet matches output49.
- Control09 reads usage plus shared types output39, then Table/Tabs/provider runtime and
  stylesheet matches output46, followed by stylesheet sections at outputs62/69.

All six library agents read usage pages. Declarations still appear on both routes, so the
prototype addresses implementation/CSS inspection rather than eliminating API discovery.
The visible sequence supports the hypothesis that concrete wrapper guidance helped, but does
not reveal why each agent chose its route or which part of the supplement mattered.

## Checks, repair, and tooling

All nine authors reported successful TypeScript/production builds, independently verified in
retained tool output. The unchanged directory checker runs 48 assertions per app across 390px
and 1280px. All six library apps pass initially. Native06 returns table name "People table"
where the brief specifies "People", failing the same naming assertion at both widths.

A narrow follow-up changes only that accessible name and reruns the build. All 48 repair checks
pass. Initial native total is 220,304, versus completed 260,859. The repair adds 40,555 total
tokens and 1,003 uncached input plus output. Initial sources, traces, counters, repair instruction,
and final counterparts are retained. This was a label mismatch, not an unnamed table.

Trial07 had two partial independent checks interrupted by browser click errors, after 38 and
20 passing assertions. The first error occurred after Summary was visibly selected. The third
complete check passed 48/48 without app edits. Both partial runs remain in the
[tooling record](../../.work/agent-guidance-cost/layout-evidence/browser-tooling.json).

A narrow transport recovery was added for those two actions, accepting a reported click error
only after verifying Summary selection or the cleared query with restored rows. No such recovery
was needed in the successful complete rerun or later checks. Frozen assertions and authored apps
were unchanged. This is an evaluation-transport adjustment after freezing, disclosed separately
from app quality; no assertion correction or human interruption occurred.

## Limits and recommendation

Three attempts per condition and one task cannot establish general savings or a reliable causal
effect size. Task familiarity, batching, cache behavior, optional component exploration, and
ordinary agent variation remain. This pass changes both Table and Tabs text together, so it
cannot isolate the example from the prose, or say which page caused the route change.

Keep the two supplements as a supported review candidate. The evidence favors concrete
composition guidance on existing selectively loaded pages. It does not justify a blanket source
reading prohibition, a broad rendering reference, or a claim that the library costs less than
React/CSS. Another task would be needed to test whether the benefit transfers.

## Reproduce and inspect

The existing fixture and frozen package trees are at /tmp/wcl-layout-20261010. The owned 5203
evaluation server was explicitly stopped after checks. To inspect the runnable wrapper example:

```sh
node prototypes/agent-guidance-cost/serve-discovery.mjs /tmp/wcl-layout-20261010 5203
```

Open http://127.0.0.1:5203/trial-00/ for the wrapper example; trial-01 through trial-09 are authored
apps. To prepare a fresh study, choose an unused temporary directory:

```sh
node prototypes/agent-guidance-cost/prepare-layout.mjs /tmp/wcl-layout-new /tmp/wcl-study-20261010
node prototypes/agent-guidance-cost/check-layout.mjs /tmp/wcl-layout-new
node prototypes/agent-guidance-cost/check-bundled.mjs /tmp/wcl-layout-new/variants/control
```

The preparation helper currently depends on the previous frozen fixture. Preserve that fixture
or reconstruct it using the [pointer study instructions](agent-guidance-pointer.md). Before new
authors, record preflight results, freeze helper hashes, use unique neutral author IDs, and ensure
each actual assignment matches its saved assignment.txt hash. Follow the protocol; do not reuse
these completed author IDs or treat a reproduction as production authorization.

Current retained verification:

```sh
/tmp/wcl-guidance-tokenizer/bin/python prototypes/agent-guidance-cost/audit-detours.py
/tmp/wcl-guidance-tokenizer/bin/python prototypes/agent-guidance-cost/analyze-layout.py
```

[Evidence](../../.work/agent-guidance-cost/layout-evidence/summary.json) includes all nine sources,
initial/final counters and sanitized traces, actual task/assignment text, content-based reads,
frozen hashes, package parity, primary assertions, repair, and partial tooling runs. System/
developer messages and opaque reasoning are omitted. The
[interactive comparison](../../prototypes/agent-guidance-cost/layout-results.html) retains all
attempts and allows switching metrics and repetitions. Production adoption remains for review.
