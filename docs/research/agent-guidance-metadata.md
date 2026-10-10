# Metadata cleanup results

Omitting scripts/devDependencies reduced metadata reference tokens by 62.0%, but this six-attempt
pilot did not establish authoring savings. Trimmed used 7.0% more completed total and 13.2% more
uncached input plus output. All 288 behavior assertions passed. Production metadata stayed unchanged.

## Design

The [protocol](agent-guidance-metadata-protocol.md) specified three fresh gpt-6.1-sol/high
directory authors per condition, alternating full/trimmed order. Neutral prompts/names contained
no guidance hints. Full used the [integrated guidance](agent-guidance-proposal.md); Trimmed
omitted only scripts/devDependencies. All 1,044 other files matched, including runtime,
declarations, 255 guidance files and four exports. No native condition ran.

Both actual archives clean-installed with React 19.2.8 and matched frozen installed trees.
Historical preflight passed guidance links, 85 prop closures, eight examples, the Table wrapper,
types and consumer builds. Fixture relocation before launch changed paths/hashes but no package
bytes. Authors could edit only app/CSS; inherited instruction costs remained included.

## Completed results

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

Total is input plus output, including cache/reasoning once. Uncached input plus output is a
diagnostic, not a price. Source/tool-output estimates use `o200k_base`, separate from provider
counters. Preparation/evaluation/analysis are excluded; author failures and fixes are included.

| Repetition | Full attempt | Full total | Trimmed attempt | Trimmed total | Total change | Uncached change |
| ---------- | ------------ | ---------: | --------------- | ------------: | -----------: | --------------: |
| 1          | 01           |    188,859 | 02              |       273,393 |       +44.8% |          -21.2% |
| 2          | 04           |    209,497 | 03              |       190,332 |        -9.1% |          +36.8% |
| 3          | 05           |    207,560 | 06              |       184,319 |       -11.2% |          +39.5% |

Two repetitions favored trimming on total; two favored full on uncached tokens. The first
pair reversed the aggregate. These noisy observations do not prove trimming increases cost.

## Reading and correctness

All six authors received whole metadata once: 1,444 reference tokens Full and 548 Trimmed,
saving 896 per body or 2,688 across three authors. Other routes varied.

| Observed route                   | Full, 3 authors | Trimmed, 3 authors |
| -------------------------------- | --------------: | -----------------: |
| Whole metadata returned          |               3 |                  3 |
| Whole index returned             |               0 |                  2 |
| Whole root declarations returned |               1 |                  3 |
| Usage-page content returned      |               2 |                  3 |
| Component runtime returned       |               3 |                  3 |
| CSS query returned               |               0 |                  0 |

Full returned 4,332 metadata, zero whole-index and 2,172 whole-root-declaration tokens; Trimmed
returned 1,644, 3,168 and 6,516. Whole-file counts omit partial reads. They cannot be added to
or subtracted from provider counters to explain cost. Attempt02 read a partial index; 05 used
full contracts rather than usage. All six read Tabs runtime, unlike the earlier layout sample.
Cross-study differences cannot establish that metadata caused this route change.

All six builds and 288 primary browser assertions passed at 390px/1280px. No app repairs were
needed; final results reused initial checks without a second execution. A failed Summary click
was accepted only after a separate DOM read confirmed the selected-tab postcondition. Author02
corrected Button size "small"; 04 corrected that size and accent "blue". Their failed TypeScript
invocations remain in costs. No missing-file reads occurred.

The first analyzer rejected "trimmed substring" in the neutral search brief as a condition cue.
A corrected check distinguished search semantics from variant labels. Prompt, author source,
assertions and counters stayed unchanged. Corrected historical analysis passed integrity,
installed-package, model/effort, counter/build and primary assertion checks.

## Decision and limits

Do not treat metadata trimming as measured authoring savings. It reduced a consistently read
file and worked in sampled builds, but complete costs did not improve consistently. Three
pairs, one task/model and varying routes/cache limit attribution. The subsequent
[runtime investigation](agent-guidance-runtime-reads.md) examined inspection motives.

Raw captures and one-off study tooling were removed. Exact historical replay is unavailable.
See the [evidence retention policy](agent-evidence-retention.md).
