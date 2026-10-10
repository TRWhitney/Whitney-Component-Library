# 02 Audit remaining discovery overhead

**What to build:** A bounded next-test recommendation based on saved reading traces and current
package structure, including metadata, whole-index reads, and unrelated type declarations.

**Blocked by:** [Guidance integration](01-guidance-integration.md).

**Status:** complete

- [x] Separate visible reference size and actual tool output from total authoring counters.
- [x] Quantify metadata/index/declaration reading where traces permit it.
- [x] Identify a concrete candidate and bounded experiment without changing metadata or APIs.
- [x] State uncertainty and avoid treating smaller references as established authoring savings.

## Accepted sources

- [Specification](../spec.md)
- [Trace audit](../../../docs/research/agent-guidance-detours.md)
- [Layout evidence](../layout-evidence/summary.json)

## Completion evidence

[Proposal and verification](../../../docs/research/agent-guidance-proposal.md).
All accepted checks pass. Whitney subsequently authorized committing completed outcomes. The
metadata pilot and runtime investigation are linked from the current effort status.
