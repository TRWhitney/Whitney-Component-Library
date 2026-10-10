# Concise guidance benchmark

## Destination

Test clearer phrasing that uses fewer words, then compare completed agent cost with current
guidance and plain React/CSS across three tasks and two repetitions, 18 fresh authors.

## Current state

Delivered. Authorized by "please continue with that" and Whitney's clarification about fewer words.
The candidate changes only eight usage pages in disposable packages.

## Accepted sources

[Specification](spec.md), [ticket](tickets/01-concise-benchmark.md),
[protocol](../../docs/research/agent-guidance-concise-protocol.md).

## Out of scope

Production adoption, extra authors, metadata/runtime/API changes, README/AGENTS changes, publishing.

## Completion

Branch main, baseline 1f35651. Committed outcome paths: .work/agent-guidance-concise/,
.work/agent-guidance-cost/concise-evidence/, docs/research/agent-guidance-concise*.md,
prototypes/agent-guidance-cost/_concise_. New neutral fixture root: /tmp/wcl-eval-20261010c.
Both actual archives pass clean-install parity, all 85 props closures, nine examples, links, types
and builds. Candidate prose falls 22.6%; complete-page tokens fall 3.3%. Eleven frozen source
hashes pass. All 18 authors and all 816 primary assertions pass, no app repairs. Two partial
browser tool runs retain 49 extra assertions; one narrow Summary-click recovery is verified.
The host on port 5206 is stopped. The frozen analyzer passes on its first execution.
Completed total tokens fall 3.0% versus current, but directory rises 3.2%; the cost criterion fails.
Concise uses 2.40 times native total tokens. Independent intent and engineering review pass with
no findings. The candidate remains a prototype; production adoption is a separate decision.
[Report](../../docs/research/agent-guidance-concise.md) and
[comparison](../../prototypes/agent-guidance-cost/concise-results.html),
[review](../agent-guidance-cost/concise-evidence/review.md).
