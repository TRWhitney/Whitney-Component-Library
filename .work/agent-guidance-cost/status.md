# Agent guidance cost

## Destination

Reduce agent discovery overhead while preserving complete references and sampled behavior.
Prepare measured changes for Whitney's review before adoption.

## Current state

The guidance integration and bounded research are complete. Whitney authorized commits of
completed work and the runtime-read investigation.
[Report](../../docs/research/agent-guidance-metadata.md) records six fresh attempts and 288 passing
behavior assertions. Trimming metadata reduced reference tokens 62.0%, but the trimmed group used
7.0% more completed total tokens and 13.2% more uncached input plus output. Paired results vary;
this pilot does not establish savings. Production metadata remains unchanged.
The [integration proposal](../../docs/research/agent-guidance-proposal.md) is committed as
652324f with its existing passing validation and review. The new
[runtime-read report](../../docs/research/agent-guidance-runtime-reads.md) finds all six runtime
reads before implementation; four follow guidance, one precedes it, and one requests both together.
No visible commentary establishes why. Clearer examples/defaults are a future test recommendation.

## Progress

- [Specification](spec.md) and both tickets have direct passing evidence.
- The index is 67.5% smaller, 4,867 to 1,584 reference tokens.
- All 255 usage/full/props files match the measured layout prototype byte for byte.
- Runtime, canonical contracts, human documentation, manifest, and four public entry points remain intact.
- Nine declaration comments and corrected source maps provide navigation.
- Fingerprints reject stale summaries and the eight shortened behavior pages.
- [Latest authoring study](../../docs/research/agent-guidance-layout.md) measured 29.6% lower total
  than bundled control for the directory task, still 1.92 times completed native React/CSS.
- In the metadata experiment, all six authors read metadata and runtime. Whole index/root
  declaration reads varied by condition. No extra author trials or app repairs were needed.

## Accepted sources

Whitney chose "Test first; present measured changes for review" and authorized the integration
proposal and remaining-overhead investigation with "Lets proceed with that then". Whitney authorized this experiment with "Alright, lets do that next."
[Canonical contracts](../../src/contracts/component-contract.ts) and frozen prototypes constrain this pass.

## Verification

npm run check passes all configured checks, 1,205 tests across 86 files, TypeScript 5/6/7,
and chart/editor isolation. npm run verify:package passes actual installed guidance, props/examples,
SSR, hydration, types, and browser builds with React 18.3.1 and 19.2.8.
[Integrity evidence](proposal-evidence/integrity.json) verifies 201 runtime files, 195 declarations,
255 guidance files, nine map shifts, baseline recovery, and unchanged entry points.
[Overhead audit](proposal-evidence/overhead.json) preserves trace hashes and separates reference
estimates from provider counters. Frozen earlier evidence is unchanged.
[Independent review](review.md) passes intent and engineering with no findings.
The first full check found formatting in captured evidence; a narrow formatting exclusion resolved
it without rewriting captures. Audit setup errors were corrected and its final run passes.

Metadata preflight passes both actual clean-installed archives, 85 props closures, nine examples,
types, and consumer builds. All 1,044 nonmetadata files are identical; only scripts/devDependencies
differ. Six author builds and 288 unique browser assertions pass. Initial/final sources, traces,
and counters are identical; the final browser ledger reuses passing initial checks.
[Metadata evidence](metadata-evidence/experiment.json) retains frozen assignments and hashes.
The corrected analyzer passes package, trace, counter, and behavior integrity checks. Its
[amendment](metadata-evidence/analysis-amendment.json) preserves the original analyzer and explains
the narrowed prompt hint check. One reported Summary-tab click failure was recovered by a separate
DOM check of the exact postcondition; the tooling ledger retains it. Independent evidence review
found that omitted disclosure, which the report now corrects. The
[correction review](metadata-evidence/review.md) confirmed resolution with no further findings.

## Out of scope

Publication, release rollout, author trials beyond the six authorized attempts, runtime/API changes, README/AGENTS edits,
production metadata changes, and an ongoing evaluation gate.

## Continuation

Branch main, baseline 89a801e42b008565ff9c21ca6ee1531c4b7b53ab.
Owned production paths: .prettierignore, scripts/build.mjs, scripts/verify-package.mjs,
scripts/agent-guidance.mjs, scripts/agent-guidance/, scripts/packed-agent-guidance.mjs,
tests/agent-guidance.test.mjs. Research paths: .work/agent-guidance-cost/, docs/research/,
prototypes/agent-guidance-cost/. Experimental fixtures: /tmp/wcl-eval-20261010.

All accepted work is delivered through focused local commits. No active implementation or
experiment remains. A future wording experiment requires Whitney's next decision; no package
metadata cleanup or new editorial wording was adopted. No pushes or history rewrites were made.
The owned evaluation host on port 5204 was explicitly stopped.
[Delivery reviews](history-review.md) and [runtime correction review](runtime-evidence/review.md)
pass with no unresolved findings. Keep frozen evidence and sources intact.
The runtime audit verifies source/trace hashes and 11,525 returned runtime-body reference tokens;
that estimate does not establish provider savings. No production wording changed in this pass.

Completed history before the final runtime-investigation commit:

- 23d4b66: Record guidance cost pilot.
- f5b52be: Record natural guide discovery.
- c79dfa7: Record bundled guidance trials.
- 7198a58: Record declaration pointer trial.
- 4726984: Explain runtime reading detours.
- c7aec46: Record responsive guide trials.
- 652324f: Bundle selective component guidance.
- 1965a60: Record metadata cost trial.

This record travels with the final runtime-investigation commit. Repository formatting and
local evidence links pass. Staged whitespace checks preserve the frozen evaluator's terminal
blank line, with no changes to captured bytes. Production checks remain valid.
