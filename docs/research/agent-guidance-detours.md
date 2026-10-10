# Why authors inspect implementation

The saved traces show recurring inspection costs, but do not establish one dominant reason.
Implementation reading concentrates in directory and dialog work. A responsive composition
example is a reasonable next hypothesis to test; it is not a proven cure for the overhead.

## Scope and method

Whitney authorized auditing the saved traces and testing one targeted prototype. The
[audit script](../../prototypes/agent-guidance-cost/audit-detours.py) examines the initial
traces of all 42 attempts in the bundled and pointer studies. An independent fresh-context
researcher qualitatively reviewed the 18 library attempts with bundled pages, including
the six with declaration pointers. No new authoring was needed for this audit.

The quantitative audit matches complete installed file bodies in returned tool text, longest
first, with no overlapping matches within one output. It records trace hashes, call/output
ordinals, inputs, output hashes, exact file names, and estimated o200k_base reference tokens.
Partial/truncated reads, file listings, and grep excerpts are excluded from the exact-file
totals. Some mixed outputs cannot be attributed to one file. These are lower bounds on
returned reference text, not estimates of provider-token savings from removing a read.

Only public commentary, commands, returned content, and compiler results support the
qualitative assessment. Opaque reasoning was not retained or inspected. Authoring costs
include repeated context across turns, so returned-file size cannot explain all input costs.

## What recurs

Among the 18 reviewed library attempts, all six directory authors and all six dialog authors
read runtime implementation. Three of six form authors did. Fourteen read declarations,
including public entry declarations. Fourteen queried or read CSS. Form attempts P04/P14
finished from usage pages without successful declaration or implementation reads; P05 read
the public entry declaration but no runtime. Guidance is usable for some tasks and routes.

Here P means the pointer study, and B means the earlier bundled study. The B bundled
attempts are 04, 07, 10, 13, 18, and 23. Their scope and models match each study's report;
combining their routes describes recurrence, not a new controlled cost comparison.

| Cohort, six attempts each | Usage page text | Guide text | Runtime text | Declaration text | Export text | Metadata text |
| ------------------------- | --------------: | ---------: | -----------: | ---------------: | ----------: | ------------: |
| P bundled control         |          11,923 |      9,558 |       11,451 |            5,990 |       4,314 |         9,046 |
| P with pointers           |          12,458 |      9,558 |        6,955 |            1,385 |       4,344 |         9,242 |
| B bundled                 |           4,441 |      1,593 |       11,569 |           17,242 |       8,628 |         8,850 |

These exact-file reference estimates omit CSS excerpts and other partial reads. Metadata
includes the packed package.json and README, not just runtime installation requirements.
The guide and metadata are substantial recurring reads too. They remain candidates for a
separate package-discovery investigation; this pass tests composition guidance only.

## Supported reasons and unknown motives

P07 commentary29 says it is checking exported tabs/input/table APIs. B04 commentary32
mentions APIs and focus behavior; B07 commentary17 mentions component APIs. Most runtime
and stylesheet reads have no explicit reason. Their search terms support an inference about
rendering/layout questions, not a conclusion that agents distrusted documentation.

Two compiler-driven type reads have a clear trigger. P16 output62 and B10 output63 reject
Button size="small". The following action-types declaration reads at outputs69/70 reveal
compact or regular, then the authors fix the value. P16 had read button.d.ts but had not
read its usage page. The bundled page already includes the exact size union.

Wrong paths produce identifiable detours. P03/P04 request nonexistent dist/types/*.d.ts;
the flat references use .ts. P07 requests inputs/search-field.js, and P15 requests
fields/checkbox.d.ts; actual files are under fields and choices respectively. These are
navigation problems, not missing APIs.

Duplicate type information appears in P02 output30, P16 output41, P18 output40, and B23
output36. Each returns usage props with original declarations. Some component declarations
only import named types, causing another lookup. Duplication does not prove that every
declaration inspection was unnecessary.

## Why test directory composition

All six reviewed directory attempts read implementation. P09 output51, P16 output53,
P18 output56, and B10 output57 inspect tab/table CSS after reading behavior guidance.
The queries concern padding, minimum width, overflow, and actual rendered wrappers.
B23 output44 returns broad overflow matches that end before useful table CSS.

Existing Table/Tabs/SearchField pages already specify application-owned filtering/sorting,
state outside panels, action isolation, width modes, and keyboard behavior. P16 output41
and P18 output40 return these facts before further implementation/CSS inspection. The
full Table contract also says Table owns an overflow container. Repeating those facts alone
would add little information.

The pages do not show a practical composition of a shrinking application grid, supplied
tab-panel content, and a wide table. That narrower gap motivates a wrapper example on the
same selectively loaded pages. It uses application classes and public props, preserving
the distinction between supported composition and private DOM styling hooks. Motive remains
inferred, and the experiment may show no benefit.

## Evidence and next test

- [Quantitative audit](../../.work/agent-guidance-cost/detour-evidence/audit.json) and
  [summary](../../.work/agent-guidance-cost/detour-evidence/summary.json).
- [Pointer read audit](../../.work/agent-guidance-cost/pointer-evidence/read-audit.json) and
  [bundled read audit](../../.work/agent-guidance-cost/bundled-evidence/read-audit.json).
- Original contracts/code: [Table](../../src/collections/table.tsx),
  [Tabs](../../src/navigation/tabs.tsx), [styles](../../src/styles.css), and
  [existing bundled guidance](../../prototypes/agent-guidance-cost/bundled-guide.mjs).
- [Focused protocol](agent-guidance-layout-protocol.md) tests nine fresh directory attempts
  with React/CSS, prior bundled/pointer guidance, and two responsive page supplements.

Production remains unchanged. No source-read prohibition, general rendering reference,
complete app template, README change, or undocumented selector guarantee is proposed.
