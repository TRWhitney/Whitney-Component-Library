# Agent guidance integration proposal

The tested guidance is integrated into the local package build. Whitney subsequently authorized
committing completed work; the implementation below is unchanged from the validated proposal.
All 85 usage pages, 85 full references, and 85 standalone props files match the measured layout
prototype byte for byte. The complete repository and clean-package checks pass.

## Proposed change

The build emits a linked component index, bundled usage and exact props, and complete canonical
references. Eight components use the reviewed short behavior/examples; the other 77 derive
their usage guidance directly from canonical contracts. Table and Tabs include the tested
responsive wrapper notes. The public declaration entry and eight component declarations link
to the guidance through the nine tested comments.

Review the [build integration](../../scripts/build.mjs),
[guidance generator](../../scripts/agent-guidance.mjs),
[editorial text](../../scripts/agent-guidance/editorial.mjs), and
[short summaries](../../scripts/agent-guidance/summaries.json).
The generated [Table page](../../dist/usage/table.md) and [Tabs page](../../dist/usage/tabs.md)
show the responsive examples in context after a build.

Editorial guidance lives in the build tooling. Canonical contracts remain the source for the
manifest, full references, human documentation, and examples. A changed canonical summary
requires review of its short summary; a changed contract for any of the eight short pages
requires review of that page. Build-time coverage and source fingerprints reject stale text.
After reviewing the affected text, update the corresponding SHA-256 fingerprint in
[sources.json](../../scripts/agent-guidance/sources.json). Fingerprints hash
`JSON.stringify(contract.summary)` for summaries and `JSON.stringify(contract)` for short pages.
The build does not refresh them automatically.

The root index is 1,584 reference tokens, versus 4,867 in the baseline, a 67.5% reduction.
This measures text size with `o200k_base`, not provider billing or total authoring savings.
The [layout study](agent-guidance-layout.md) measured 29.6% fewer total tokens and 17.5% fewer
uncached input plus output tokens against the earlier bundled guidance for the sampled directory
task. It still used 1.92 times the completed native React/CSS total. Savings over native remain
unproven, and the declaration pointers have no established independent cost benefit.

## Integration differences from the measured prototype

- The production package keeps its four existing public entry points. Relative guidance links
  work inside the installed package without the prototype's three wildcard exports. Node package
  resolution of the new usage/full/types paths remains unsupported.
- One index sentence is shorter, reducing the measured index from 1,593 to 1,584 reference tokens.
- Nine declaration source maps shift their mappings one line to account for the pointer comments.
  The prototypes left those maps unchanged. Original mappings and declaration semantics survive.
- The build checks source drift. Formatting excludes captured evidence directories so their hashes
  remain stable. The package verifier now checks installed guidance and compiles its props/examples.

All 201 JavaScript/CSS files match both the baseline and measured package. All 195 declarations
match the measured package, and removing the nine pointer lines recovers baseline declaration
text. The manifest, source components, human documentation, README, and package exports are
unchanged. There is no component behavior change requiring new rendered examples.

The three new guidance directories add 1,345,640 uncompressed bytes. That is a package-size tradeoff,
not an automatic context cost. Agents receive those files only when their tools return them.
The standalone props duplicate the inline props and are retained to match the tested package.

## Verification

- `npm run check` passes formatting, both linters, type checking, all 1,205 tests across 86 files,
  generated-documentation checks, TypeScript 5/6/7 checks, and chart/editor isolation.
- `npm run verify:package` passes with React 18.3.1 and 19.2.8. It validates the actual installed
  archive's guide coverage, links, inline/standalone props equality, all 85 props closures, eight
  minimal examples, and the Table wrapper example, alongside SSR, hydration, and browser builds.
- The focused guidance suite initially failed for missing links/files/pointers, then passed.
  It also rejects changed canonical behavior, summaries, and component coverage.
- The [integration audit](../../prototypes/agent-guidance-cost/audit-proposal.py) verifies
  byte parity, map corrections, baseline recovery, and existing entry points. Run with the
  experiment tokenizer environment after builds have completed, since builds replace `dist`.
  [Integrity evidence](../../.work/agent-guidance-cost/proposal-evidence/integrity.json).
- Prior responsive behavior evidence remains applicable because the usage example text and
  component runtime are identical. No fresh authoring study was run for this integration.
- [Independent review](../../.work/agent-guidance-cost/review.md) passes both intent and engineering
  axes with no findings. Later commit authorization does not change that reviewed implementation.

The first full check stopped on formatting in 122 frozen evidence files. Excluding captured
evidence resolved it without rewriting those files. The first integration audit overlapped a
build and saw a temporarily absent file; rerunning after builds completed resolved that setup
failure. Existing browser builds emit sourcemap and module-directive warnings and complete.

## Remaining overhead and next test

The latest six library traces all contain the complete package metadata and guide. Four contain
the entire root declaration file. The control and layout groups have the same whole-file counts
for these three references, so the layout improvements left this reading overhead in place.

| Whole reference returned | Control, 3 attempts | Layout, 3 attempts |
| ------------------------ | ------------------: | -----------------: |
| Package metadata         |               4,425 |              4,425 |
| Component index          |               4,779 |              4,779 |
| Root declarations        |               4,344 |              4,344 |

These are exact file-body reference estimates in saved tool outputs. Partial reads are omitted.
They cannot be added to or subtracted from provider totals to predict authoring savings. Repeated
context, caching, and tool sequencing matter. [Audit evidence](../../.work/agent-guidance-cost/proposal-evidence/overhead.json).

The current metadata is 1,444 reference tokens. An illustrative copy omitting `scripts` and
`devDependencies`, while keeping every other field, is 548 tokens, 62.0% smaller. The study
metadata was 1,475 tokens because it included the three wildcard exports. The root declarations
are 2,172 tokens; chart exports account for 593, and Markdown exports another 127. Those
720 tokens are unrelated to the tested directory task but remain part of the public root API.

The next bounded experiment should vary only installed package metadata: current guidance with
the complete metadata versus identical guidance with the two author-tooling fields omitted.
Use three neutral directory attempts per condition, alternating order, with the same model,
brief, app checks, and repair accounting. Freeze assignments and all nonmetadata package files.
Measure whole metadata reads, reading routes, completed total and uncached input plus output,
and all behavior checks. Require no quality regression and examine each repetition before
claiming savings. Prototype clean install/type/build behavior before the author runs.

This isolates a small, consistently encountered target. It does not require a new public API or
additional agent instructions. Leave root declaration restructuring and selective index groups
for a later experiment; changing them together would obscure attribution. Metadata changes and
the proposed author trials have not been performed or adopted in this pass.

## Subsequent results

The [metadata pilot](agent-guidance-metadata.md) completed the six proposed trials and did not
establish completed authoring savings. Production metadata remains unchanged. The
[runtime-read investigation](agent-guidance-runtime-reads.md) audits those saved traces and
recommends a focused wording experiment. These later reports preserve the proposal's original
measurements and distinguish each pass from its subsequent work.
