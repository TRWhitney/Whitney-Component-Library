# Explicit guidance pilot

## Destination

Test whether explicit Tabs defaults and controlled SearchField composition reduce completed
authoring cost or runtime inspection without reducing correctness. Present measured results.

## Current state

Complete. The six-author experiment and independent reviews pass. Retained with its completed
experimental commit on main, following baseline `1189ac7`. Production wording remains unchanged.

## Progress

[Report](../../docs/research/agent-guidance-wording.md),
[interactive comparison](../../prototypes/agent-guidance-cost/wording-results.html), and
[review](../agent-guidance-cost/wording-evidence/review.md) retain the outcome. The explicit group
returned no runtime/CSS, versus two control authors. Total tokens +3.9% and uncached input/output
-12.7% are mixed evidence. No production wording is adopted.

## Accepted sources

[Specification](spec.md), [completed ticket](tickets/01-wording-pilot.md),
[protocol](../../docs/research/agent-guidance-wording-protocol.md), and
[runtime investigation](../../docs/research/agent-guidance-runtime-reads.md).

## Verification

Both actual archives clean-installed with React 19.2.8 and passed all 85 props closures, nine
examples, links, types and consumer builds. Only two usage pages differ; all 1,043 other files
match. The source-size budget passes. Six author checks eventually pass; all 288 primary browser
assertions pass without app repairs. Three partial browser tool runs are retained separately.
The final ledger reuses initial results and does not claim another browser execution.

The frozen analyzer, nine source hashes, twelve sanitized trace checks, Python parsing,
experimental JavaScript lint, repository formatting, local links, and focused secret-pattern
scan pass. HTML checks cover 16 comparison states and six rows with no horizontal overflow at
728px light and 360px dark. Independent intent and engineering reviews pass with no findings.
The owned evaluation host on port 5205 was stopped.

Prelaunch evidence-directory creation and a rejected unused agent name are documented in the
report. The disposable tree, neutral names, and hashes were frozen before the first actual launch.
Neither setup correction altered author package or prompt bytes.

## Out of scope

Production adoption, metadata/runtime/API changes, extra author attempts, README/AGENTS changes,
push/publication, and a new native control.

## Continuation

No accepted work remains. Any confirmation test or separate production usability change requires
a new request. The committed report and evidence are the handoff; disposable fixtures remain at
`/tmp/wcl-eval-20261010b` for inspection but are not production artifacts.
