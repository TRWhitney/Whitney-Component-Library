# Maintenance fixes comparison

Historical study plan. Raw captures and obsolete replay setups were later removed under the
[retention policy](../../../docs/research/agent-evidence-retention.md). Capture instructions below describe execution, not a retention requirement.

## Question and boundary

Whitney authorized trying fixes for the press-event callback limitation, repeated build warnings,
and fragile browser verification, then measuring whether maintenance usage noticeably improves.
This remains an isolated planning experiment. No production component, showcase, README, build
script, or public API changes are made. No subjective feedback or unprompted adoption test.

Compare the current package with a temporary package containing three bounded fixes:

- Button's declaration exposes the press event already forwarded at runtime. A library-owned
  event type supports the actual target and verified press metadata; existing no-argument
  callbacks remain valid. No React Aria public declaration dependency is introduced.
- Internal duplicate use-client directives are removed while keeping the only public JavaScript
  entry's client boundary. No bundler warning filter, consumer config change, or altered component
  implementation is used to hide warnings. Verify emitted consumer assets and retain compatibility
  limits before considering production adoption.
- An optional separate testing export supplies condition-based focus/animation waits and a direct
  contrast assertion. It requires no new runtime dependency and is absent from root runtime
  imports. Short package-local guidance and discovery pointers explain it. Existing consumer
  checks and the task prompt remain unchanged, so helper adoption is observed, not forced.

The package helpers must pass delayed-success and permanent-failure cases before trials. The
callback must pass strict typing, pointer/keyboard target, existing callback and disabled checks.
Neither focus errors nor actual contrast failures may be suppressed. Any unsupported contrast
measurement must fail explicitly instead of returning a pass. Changes are frozen before inspecting
new authoring output. If a proposed fix cannot pass its proof, exclude it and record that decision
before trials; do not tune using trial results.

## Controlled comparison

Use four fresh authoring runs, two per condition. All start from the same retained library-based
Trail kit initial app and its original checks, before the previous maintenance work. Use the exact
previous maintenance brief, model and configuration. Only the installed package differs, plus
reserved per-run ports. Rewrite the old hard-coded check port consistently in every fixture.
Do not use the prior native app or the prior 904,127-token outlier as the primary control.

Use eight-minute limits with no reruns to improve a score and no coordinator repairs. Preserve
interruptions, timeouts and missing telemetry. Run current/fixed in pairs on distinct ports.
Separate subprocess sessions, source snapshots, prompts, raw JSONL and usage summaries were captured
at execution and later removed.
Report both individual runs and totals, including all authoring and self-verification. Evaluator
work and prototype construction are outside task token totals, not free implementation work.

Evaluate untouched outputs with the existing frozen 64-scenario maintenance checker at both widths
and appearances. Independently build final sources. Require correctness before interpreting token
or source savings. Preserve failures as failures; no extra correction rounds in this comparison.
Check emitted runtime size and source separately from packaged helper/type/guide costs. Report
input/output/cached input, total tokens, uncached input plus output, command output and failures,
runtime, helper discovery/use, remaining application defects and final source sizes.

Two runs per condition can reveal obvious instability but cannot establish general expected savings.
This tests the combined changes on the observed task, not each change's causal contribution or
transfer to other tasks. Do not claim generality or compare cumulative creation cost using
maintenance-only runs. Further tasks require a separate bounded question.
