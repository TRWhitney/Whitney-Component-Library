# Why agents inspect runtime

The six saved metadata trials show discovery reads, not debugging. All runtime reads happened
before the first app write or build check. Four authors read runtime after usage or full guidance,
one read it before usage guidance, and one requested both together. None visibly explained why
runtime was needed. The evidence cannot establish that incomplete guidance caused these reads.

Most plausible questions are already answered in the guides. A controlled SearchField example
and explicit Tabs defaults are concrete candidates for a next test. A larger rewrite, more
implementation detail, or an instruction to avoid runtime would be premature as a cost remedy.

## Scope and evidence

Whitney requested this investigation after the [metadata experiment](agent-guidance-metadata.md)
and authorized commits of completed work. This pass audits the existing six author traces against
the exact installed guidance and runtime. No new author runs, app edits, package metadata changes,
or behavior changes were made. Private reasoning and system/developer messages were excluded.

The [reproducible audit](../../prototypes/agent-guidance-cost/audit-runtime-reads.py) validates
complete returned runtime bodies, hashes, prior guidance bodies, and first-write ordering. Its
[evidence](../../.work/agent-guidance-cost/runtime-evidence/audit.json) links each result to original
trace ordinals and hashes. Run with the existing experiment tokenizer environment and fixture
tree. The retained traces preserve returned text if the disposable tree is no longer available.

| Trial | Guidance output            | Runtime output                | First app write | Sequence                    |
| ----- | -------------------------- | ----------------------------- | --------------- | --------------------------- |
| 01    | 35 usage                   | 42 Tabs/SearchField           | 48              | After guidance              |
| 02    | 39 usage                   | 46 Tabs/SearchField           | 50              | After guidance              |
| 03    | 42 usage                   | 49 Tabs/Table                 | 51              | After guidance              |
| 04    | 39 Table/SearchField usage | 34 Tabs/SearchField; 39 Table | 45              | Before usage, then together |
| 05    | 33 full contracts          | 42 Tabs; 49 Table/SearchField | 53              | After guidance              |
| 06    | 39 usage                   | 39 Tabs/SearchField/Table     | 43              | Requested together          |

Ordinals refer to the original sanitized traces, not row numbers in a filtered view. Trial04
read no Tabs usage page. Trial06 requested usage and runtime in one command, so the sequence
does not show an assessment of guidance followed by a decision that it was insufficient.
Trial05's visible commentary at ordinal38 already chose the components and parent-owned state,
before its runtime reads. See the [content audit](../../.work/agent-guidance-cost/metadata-evidence/read-audit.json)
and [trial05 trace](../../.work/agent-guidance-cost/metadata-evidence/trial-05/trace.jsonl).

Tabs appears in all six runtime reads, SearchField in five, and Table in four. Complete returned
runtime bodies total 11,525 o200k_base reference tokens across the six authors. That is a file-body
estimate, not provider attribution or a prediction of tokens saved by eliminating these reads.
There were no runtime reads after failed builds. Both TypeScript failures occurred later and
concerned Button size or AppearanceProvider accent, not these components.

## Guidance compared with implementation

| Component   | Already in usage guidance                                                                                            | Concrete omission or ambiguity                                                | What runtime adds                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Tabs        | Stable ids, activation modes, selected panel, parent-owned persistent state, wrapper containment, no className/style | Automatic/horizontal defaults and first-enabled fallback are not explicit     | Default values and React Aria composition                                     |
| SearchField | Controlled value/onChange, clear availability, Enter/Escape callbacks, consumer-owned filtering                      | The minimal example is uncontrolled; no complete controlled-clear composition | Conditional clear button and callback forwarding to React Aria                |
| Table       | Consumer-owned sorting/filtering, descriptor feedback, action cells, widths and bounded scrolling                    | Toggle selection is not named, but these apps use selectionMode="none"        | Validation, DOM structure, selectionBehavior="toggle", React Aria composition |

The reviewed wording is in [editorial guidance](../../scripts/agent-guidance/editorial.mjs), and
the actual installed copies were checked against it. Compare the implementation in
[Tabs](../../src/navigation/tabs.tsx), [SearchField](../../src/fields/search-field.tsx), and
[Table](../../src/collections/table.tsx). Full contracts remain available and describe broader
selection and event responsibilities. The short Tabs usage page includes the persistent-state
composition advice that the canonical full page does not spell out.

The runtime wrappers delegate keyboard behavior, panel lifecycle, and clear-event sequencing to
React Aria. Reading those wrappers alone does not establish every underlying behavior. The traces
are consistent with redundant verification, but they do not prove a habit, distrust, or a specific
unanswered question. Existing passing behavior checks establish correct completed apps, not why
the authors read a file.

## Focused next experiment

Test whether replacing examples and making defaults explicit reduces runtime inspection without
adding a directive about which files agents may read. Keep prompts, package entry points,
metadata, runtime, exact props, and evaluation unchanged. Change only the Tabs and SearchField
usage text in a disposable package, with a source-size budget so added prose does not quietly
expand the reference. Three fresh attempts per condition would match the prior pilot size.

Candidate wording, to validate before an experiment:

- Tabs: "Defaults are horizontal orientation and automatic activation. Without a selected id,
  the first enabled item is selected." Keep the existing persistent-state and containment advice.
- SearchField: replace the uncontrolled example with
  `<SearchField label="Search records" clearLabel="Clear search" value={query} onChange={setQuery} onClear={() => setQuery('')} />`.
  Keep filtering in the parent and explain that the shown state setter accepts the complete query.

The six completed apps already use this controlled-clear composition and pass the independent
clear checks. That supports the example's applicability; it does not establish a cost benefit.
Do not add Table selection detail for this task, where selection is disabled.

Measure completed total and uncached input plus output, runtime inspection before/after guidance,
requested-together reads, failed builds, and correctness. Keep every reading route and repair in
the totals. A reduction in runtime reads alone is insufficient if completed cost or quality
worsens. This is a recommendation for Whitney's next decision, not a new experiment performed
or authorized by this investigation.

## Review and limits

A fresh independent research agent compared all six trace sequences and the installed guide
forms. It independently found the same timing and coverage limits. The coordinator verified the
original events and bodies, then ran the reproducible audit. The investigation has one task,
one model/effort, and six historical attempts. It cannot generalize to other agents or establish
causation without a new controlled comparison. [Review record](../../.work/agent-guidance-cost/runtime-evidence/review.md).
