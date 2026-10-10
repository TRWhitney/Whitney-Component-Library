# Second maintenance round

Historical study plan. Raw captures and obsolete replay setups were later removed under the
[retention policy](../../../docs/research/agent-evidence-retention.md). Capture instructions below describe execution, not a retention requirement.

## Question

Does the benefit persist when the same apps receive another change and both sides can reuse the
verification code they already own? Whitney authorized archive/restore in the same four apps,
explicit API/helper use, incremental and cumulative measurement, and deferred discoverability.

## Inputs

Continue A/B/C/D from their exact final snapshots in the explicit-use comparison. Current A/D
keep their own utilities. Experimental B/C keep their existing helper imports. The package
artifacts, model, runner, toolchain, initial app contents and maintenance scripts are preserved.
Only fixed localhost ports are rewritten before authoring, from 4501..4504 to 4521..4524, plus
the dev command. Record every rewritten file and validate the remaining seed bytes.

The common [archive brief](../prototypes/maintenance-archive/common.txt) specifies view controls,
archive/restore with stable identity and underlying order, edits/deletion/duplication in both
views, view-local counts and search, next/previous/search focus after row removal, and the
existing appearance/contrast/long-name requirements. Each condition adds an explicit instruction
to reuse its existing verification utilities. Experimental must use all three helpers for the
new cases and retain the Button event target. These instructions remove discovery from the test.
No new package capability or task-specific template is introduced.

Use the [current prompt](../prototypes/maintenance-archive/current.txt) and
[experimental prompt](../prototypes/maintenance-archive/fixed.txt), frozen before agent output.
Both must extend and execute src/maintenance.check.mjs, preserving previous coverage. Direct
references are supplied equally. This measures a fresh-context maintenance agent returning to
the same project, not resuming the previous agent's conversation.

## Runs and acceptance

Two pairs, current A/experimental B then experimental C/current D. Eight minutes per authoring
attempt, same gpt-6-astra medium configuration. All reading, modification, self-verification,
repairs and final response count. No coordinator app repairs, result-driven prompt changes,
retries for a better score, or post-evaluation correction rounds. Retain timeouts and incomplete
telemetry. Validate actual utility reuse before interpreting an experimental outcome; failure
to follow explicit use is an invalid treatment, not evidence against utility.

The unchanged previous 64-scenario checker covers regressions on the default active view. A new
archive checker covers the new behaviors at both widths and appearances. Prove its positive
reference and negative cases and freeze it before authoring starts. Neither checker may import
the helper being evaluated. Build final sources independently, preserve hashes, and record
primary failures. Evaluation uses ports 4531..4534 and writes only its evidence. No subjective
style score or discovery outcome.

The study used the earlier preparation/runner/measurement approach and recorded separate round-two
snapshots and counters. Those scripts and captures were later removed.

## Interpretation and stopping condition

Report this round's totals, cached input, uncached input plus output, output tokens, command
counts/output/failures, elapsed time, and retained source growth. Sum first and second round
usage for the same condition and pair. First-round totals come from the explicit-use
measurements recorded at execution, never the older optional-use trials. Cumulative cost covers these two maintenance
changes only, not initial creation, prototype construction, evaluation or a project lifetime.
Source totals describe the final apps once; do not double-count snapshots as cumulative code.

Both treatments now own reusable verification utilities, so any remaining difference can reflect
continuing reuse, different app implementations and ordinary agent variation. Two pairs cannot
isolate each fix or estimate general expected savings. No fresh React/CSS-only baseline, new
API, discovery experiment or production adoption is included. Stop after both pairs and their
independent checks, preserving failures and limitations.
