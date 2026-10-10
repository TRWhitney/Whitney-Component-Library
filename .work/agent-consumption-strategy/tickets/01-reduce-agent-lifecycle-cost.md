# 01 Reduce agent lifecycle cost

**What to build:** A bounded comparison of the existing improvement prototype with React/CSS
through creation and maintenance, identifying the next specific source of avoidable cost.
This is a research continuation ticket, not approval to ship the experimental package.

**Blocked by:** none

**Status:** ready-for-agent

- [ ] Build fresh fixtures from the retained prototype source;
      record source/package hashes and the exact comparison environment.
- [ ] Freeze matched creation and maintenance briefs, objective checks, actual-use requirements,
      run limits and accounting before authoring. Use a small repeated comparison with React/CSS.
- [ ] Run the bounded comparison with the existing improvement bundle, accounting for all attempts,
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

## Retained source and reconstruction limits

- [Package patch](../prototypes/maintenance-fixes/package/patch-package.mjs) owns temporary event-type
  and directive changes. Apply it only to a disposable package directory.
- [Testing helpers and standalone checks](../prototypes/maintenance-fixes/verification/) retain their
  supported scope and negative cases. Read `testing.md` and `findings.md` before reuse.
- [Lifecycle briefs/checker](../prototypes/lifecycle/), [explicit-use prompts](../prototypes/maintenance-use/)
  and [archive briefs/checker](../prototypes/maintenance-archive/) support a fresh experiment.

Raw app snapshots, traces, package records and exact-replay scripts were removed under the
[retention policy](../../../docs/research/agent-evidence-retention.md). Reconstruct fresh consumer
fixtures and validate the candidate; do not claim byte-identical recovery or reuse removed captures.
Future runs should preserve concise findings and account for failures while keeping raw outputs
outside version control.

The historical environment was Codex CLI 0.157.1, gpt-6-astra medium, Node 24.21.0, React 19.2.8,
TypeScript 5.9.3, Vite 8.2.1, Rolldown 1.2.11 and Playwright 1.61.1. Rolldown 1.2.4 did not emit
the recorded warnings. Freeze the actual toolchain and an explicit baseline before comparing.
Inspect the current tree without resetting it. Normalize formatting when counting final app/check
source, label unchanged checks separately and count cached input only once in total tokens.

## Completion evidence

Pending. This ticket records future work only. The latest completed experiment is the two-round
comparison linked above; documenting this handoff did not run additional trials.
