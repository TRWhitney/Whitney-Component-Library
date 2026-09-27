# 01 Reduce agent lifecycle cost

**What to build:** A bounded comparison of the existing improvement prototype with React/CSS
through creation and maintenance, identifying the next specific source of avoidable cost.
This is a research continuation ticket, not approval to ship the experimental package.

**Blocked by:** none

**Status:** ready-for-agent

- [ ] Recover the retained prototype and evidence without relying on temporary directories;
      record source/package hashes and the exact comparison environment.
- [ ] Freeze matched creation and maintenance briefs, objective checks, actual-use requirements,
      run limits and accounting before authoring. Use a small repeated comparison with React/CSS.
- [ ] Run the bounded comparison with the existing improvement bundle, retaining all attempts,
      failures and repair costs. Verify actual proposed API/helper use and equivalent requirements.
- [ ] Report cumulative and per-stage tokens, cached input, uncached input plus output, time,
      app source and retained verification source. Separate creation cost from maintenance cost.
- [ ] Inspect the traces for remaining recurring costs and propose one evidence-supported next
      change, or explain why the evidence does not justify one. Do not expand helpers by default.
- [ ] Update the findings and status with the outcome and a concrete next ticket if work remains.
      A negative result can complete this comparison; it does not complete the efficiency goal.

## Accepted sources

- [Findings summary](../research/findings-summary.md): start here; distinguishes native comparisons
  from comparisons between library versions and lists what is still experimental.
- [Effort status and Whitney's accepted scope](../status.md).
- [Strategy proposal](../strategy-proposal.md): broader candidates; the actual-use boundary below
  supersedes its older discovery-oriented evaluation suggestions.
- [Native lifecycle results](../research/lifecycle-results.md) and [protocol](../research/lifecycle-protocol.md).
- [Explicit-use results](../research/maintenance-use-results.md) and [protocol](../research/maintenance-use-protocol.md).
- [Latest maintenance results](../research/maintenance-archive-results.md) and [protocol](../research/maintenance-archive-protocol.md).
- [Agent contract](../../library-foundation/decisions/04-agent-contract.md) and
  [composition boundary](../../library-foundation/decisions/16-reusable-composite-boundary.md).

Whitney asked for this ticket so a future agent can build on the findings. The work remains in
planning, within the authorized small comparative evaluation and targeted API investigation.
It creates no recurring evaluation infrastructure or new release gate.

## Start here

Resume the work-system state:

```sh
python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work planning
```

Read the summary and the latest results before running anything. The unresolved comparison is
the improved library against React/CSS. The existing library lost the earlier native comparison;
the fixes subsequently saved 7.5% total maintenance tokens against the existing library, but used
1.5% more uncached input plus output. No experiment bridges that gap yet.

Begin with the existing fixed package, without adding another feature. A small matched comparison,
such as two pairs through creation and the retained maintenance sequence, can establish whether
the demonstrated code reduction translates into lower cumulative usage against native controls.
Freeze the exact bounded protocol first. Give both conditions concise, equally available references
and equivalent objective requirements. Preserve each app's checks between changes so controls
can reuse their own utilities. Do not compare fresh experimental runs only with old native totals.

Use the outcome and traces to choose the next improvement. Larger package/type reads, avoidable
consumer focus code and repeated domain assertions are candidates to investigate, not established
causes or preapproved API designs. Keep broader claims proportional to the narrow sample.

## Boundaries that must survive the handoff

- Measure the benefit of actual use. Assume the project has chosen this library; supply direct
  references and require relevant proposed API/helper use. Confirm successful executed use.
  Non-use is an invalid utility test, not evidence that a helper has no value. Discoverability
  is deferred; do not repeat unprompted-adoption trials.
- The comparator is React and CSS without another component library. Native/custom composition
  remains valid in the library condition. Do not require every control to use the package.
- Preserve application breadth, including custom interactions such as board games. No new app
  shells, prescribed templates, composite-app shortcut or whole-app generation language.
- Use objective correctness, layout and interaction requirements. Human style/feel costs are
  unknown; do not invent subjective scores or assume they reverse observed token overhead.
- Count reads, implementation, self-checks, repairs and all generated consumer code. Preserve
  failed attempts and timeouts; never rerun only to obtain a favorable result. Freeze checkers
  before authoring and keep evaluator cost separate from authoring cost.
- Treat package/API changes as prototypes until behavior and compatibility are settled.
  Production component changes require matching canonical guidance and showcase updates.
  The client-directive candidate still needs actual RSC framework compiler verification.

## Recoverable artifacts

- [Package preparer](../prototypes/maintenance-fixes/prepare.mjs) builds current/fixed disposable
  packages. [Package patch](../prototypes/maintenance-fixes/package/patch-package.mjs) owns the
  temporary event-type and directive changes. Never run it against the repository root.
- [Testing helpers and proofs](../prototypes/maintenance-fixes/verification/) include their
  supported scope and negative cases. Read `testing.md` and `findings.md` before reusing them.
- [Original lifecycle tools](../prototypes/lifecycle/), [explicit-use prompts](../prototypes/maintenance-use/),
  and [archive continuation tools](../prototypes/maintenance-archive/) retain the briefs and checks.
- [Lifecycle evidence](../research/pilot/lifecycle/), [explicit-use evidence](../research/pilot/maintenance-use/),
  and [archive evidence](../research/pilot/maintenance-archive/) retain app snapshots, events,
  summaries, package/environment hashes and independent results. These are the durable sources.

Old preparers and lockfiles can reference tarballs under `/tmp`. The archive preparer reads an
absolute artifact path from earlier environment metadata. Inspect and reconstruct those inputs
from retained sources in a fresh workspace; do not assume the old temporary roots survive.
Verify reconstructed artifacts against recorded hashes, or document any changed baseline before
using it. The runner refuses to overwrite an existing stage. Keep new evidence separate and
leave captured files unformatted and unchanged.

Recorded environment: Codex CLI 0.157.1, gpt-6-astra medium, Node 24.21.0, React 19.2.8,
TypeScript 5.9.3, Vite 8.2.1, Rolldown 1.2.11, Playwright 1.61.1. The repository's local
Rolldown 1.2.4 did not reproduce the warning output. Pin transitive versions or record an
intentional new baseline; do not mistake toolchain differences for a package improvement.
Preserve the recorded isolated agent configuration and equal run limits across conditions.

The research baseline is `2488a0e1c0f6422b77e1791ea1e5e7aef27e0a29` on branch `main`. The handoff
delivery commits the research and supporting changes listed in the effort status. Inspect the
current tree and subsequent history before continuing; do not reset it.
No production component, build or showcase change was made by this pass. Source counts should
normalize formatting and count final app/check files once, with unchanged original checks labeled
separately. Total tokens are input plus output; do not add cached input again.

## Completion evidence

Pending. This ticket records future work only. The latest completed experiment is the two-round
comparison linked above; documenting this handoff did not run additional trials.
