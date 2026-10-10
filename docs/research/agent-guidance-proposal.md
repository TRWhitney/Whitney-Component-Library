# Agent guidance integration and adopted wording

The tested guidance is integrated into the package build. Initial integration matched the
layout prototype's 85 usage pages, 85 full references and 85 standalone props files. Adoption
later shortened eight usage pages with precision edits. Component runtime behavior did not change.

## Adopted wording

Whitney authorized adoption to reduce avoidable overhead while retaining consistency and
maintenance benefits. Matching native initial-authoring cost was not required; longer-term
maintenance savings remain unmeasured.

The eight pages use the [concise candidate](agent-guidance-concise.md) with edits for activation,
form linkage, uncontrolled initialization and Tabs fallback. Against the pre-adoption build,
prose words fell from 925 to 758, 18.1%; complete-page `o200k_base` reference tokens fell from
5,018 to 4,882, 2.7%. Every page shrank. The original candidate saved 22.6% prose and 3.3%
whole-page tokens. Adopted precision edits used more words; no new authoring study measured
their cost. Original mixed benchmark results remain unchanged.

Exact props, examples, full contracts, metadata, index, runtime and CSS matched pre-adoption.
Tabs states horizontal/automatic defaults and first-enabled fallback. Responsive wrapper/state
advice remains. The earlier expanded SearchField example stayed a prototype.

## Build and maintenance

The [build](../../scripts/build.mjs) and [guidance generator](../../scripts/agent-guidance.mjs)
emit a linked index, bundled usage/props and full canonical references. Eight components have
reviewed [editorial text](../../scripts/agent-guidance/editorial.mjs); the other 77 derive usage
from contracts. Table/Tabs include responsive notes. Nine declaration comments link the public
entry and eight leaves to guidance. Generated [Table](../../dist/usage/table.md) and
[Tabs](../../dist/usage/tabs.md) pages are available after a build.

Canonical contracts remain the source for manifest/full references/human docs/examples. A
changed summary requires review of its [short summary](../../scripts/agent-guidance/summaries.json);
a changed contract for an editorial page requires page review. Coverage/fingerprints reject
stale text. After review, update the corresponding SHA-256 in
[sources.json](../../scripts/agent-guidance/sources.json). Summary fingerprints hash
`JSON.stringify(contract.summary)`; page fingerprints hash `JSON.stringify(contract)`.
The build does not refresh them automatically.

## Measured tradeoffs and integration differences

The integrated index is 1,584 reference tokens versus baseline 4,867, 67.5% smaller. One sentence
was shortened from the prototype's 1,593 tokens. These are `o200k_base` text sizes, not billing
or total authoring savings. The [layout study](agent-guidance-layout.md) observed 29.6% fewer
total and 17.5% fewer uncached tokens than prior bundled guidance on directory, but still
1.92 times native completed total. Pointer cost benefit remains unestablished.

Production keeps four public entry points; relative guidance links work inside the package
without the prototype's three wildcard exports. Node resolution of usage/full/types subpaths
remains unsupported. Nine declaration source maps shift one line for comments, preserving
original mappings/semantics. Package verification checks installed guidance and compiles props/examples.

Historical integration comparison matched all 201 runtime JS/CSS files to baseline/prototype
and all 195 declarations to prototype. Removing pointer lines recovered baseline declaration
text. Manifest, source components, human docs, README and exports stayed unchanged. Three
guidance directories added 1,345,640 uncompressed bytes. Files cost context only when returned
by tools; standalone props duplicate inline props to match the tested distribution.

## Historical verification

Integration `npm run check` passed formatting, linters, types, 1,205 tests across 86 files,
generated docs, TypeScript 5/6/7 and chart/editor isolation. `npm run verify:package` passed
actual archive installs with React 18.3.1/19.2.8, all 85 prop closures, eight minimal examples,
the wrapper, SSR/hydration and browser builds. Focused guidance tests rejected missing content,
source drift and coverage changes. Byte/map/entry-point review passed. These are recorded
historical results, not new validation during evidence cleanup.

Adoption verification passed four guidance tests, lint, generated links, props/examples and
React 18/19 archive install/SSR/hydration/types/browser checks. Only eight usage pages changed
among 1,043 dist files. No fresh authoring study ran for integration or precision edits.

Initial full-check formatting failures came from 122 captured files; excluding them preserved
original hashes. An audit overlapping a build temporarily missed a dist file and passed after
build completion. Existing browser builds completed with sourcemap/module-directive warnings.

## Remaining overhead and subsequent studies

All six layout library authors returned full metadata/index, and four returned whole root
declarations. Each control/layout group returned 4,425 metadata, 4,779 index and 4,344 root
declaration reference tokens. Partial reads are omitted; these cannot be subtracted from provider
totals to predict savings because cache/context/tool sequencing matters.

Integrated metadata cost 1,444 reference tokens. Omitting scripts/devDependencies reduced an
illustrative copy to 548, 62.0% smaller. Earlier prototype metadata was 1,475 because of wildcard
exports. Root declarations were 2,172, including 593 chart and 127 Markdown export tokens
unrelated to directory but still public API.

The proposed [metadata pilot](agent-guidance-metadata.md) later completed six attempts without
establishing savings, so metadata stayed unchanged. The
[runtime investigation](agent-guidance-runtime-reads.md) led to the
[explicit wording pilot](agent-guidance-wording.md), then the
[concise benchmark](agent-guidance-concise.md). Those reports retain original experiment
findings; this document records the adopted implementation.

Raw captures and one-off study tooling were removed. Exact historical replay is unavailable.
See the [evidence retention policy](agent-evidence-retention.md).
