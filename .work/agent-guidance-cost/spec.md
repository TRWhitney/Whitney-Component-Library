# Reviewable agent guidance integration

## Problem Statement

Agents spend tokens discovering component behavior, props, and layout responsibilities.
Five prototype studies have identified smaller references and a useful responsive-composition
example. The next outcome is a validated local integration for Whitney to review.

## Solution

Prepare a build change that emits the tested compact index, 85 bundled usage
pages with exact props, complete canonical references, and nine declaration pointers.
Include the tested Table and Tabs layout supplements. Report remaining discovery overhead
from existing traces separately from measured authoring savings.

## User Stories

1. As a consuming agent, I want links from the package index and declarations to component
   guidance, so I can read behavior and exact props together.
2. As Whitney, I want a validated proposal and its limits, so I can decide whether to adopt it.
3. As a library maintainer, I want stale editorial guidance to fail the build, so contract changes
   prompt review of the shortened text.

## Implementation Decisions

- Preserve the [canonical contract model](../../docs/adr/0004-publish-canonical-component-contracts.md),
  manifest, generated human documentation, runtime, and four public package entry points.
- Reuse the tested wording and examples recorded in the study reports. Keep editorial summaries in build-owned
  data, validated for coverage and source drift. Derive full references and exact props from
  canonical contracts and emitted declarations.
- Include the eight tested short behavior pages, canonical fallback guidance for the other
  77 components, and the two responsive supplements. Keep the 85 standalone props files.
- Guidance links resolve as relative files inside the installed package. Do not add public
  wildcard exports, a CLI, or instructions requiring agents to use a specific tool.
- Keep the nine declaration pointers as navigation help. Their independent cost benefit remains
  uncertain. No broader pointer rollout is included.

## Testing Decisions

Verify all guidance links and 85 exact props closures in an actual packed package. Compile
the short examples and layout example. Check canonical reference equality and runtime/declaration
parity against the frozen baseline, allowing only the nine comments and index replacement.
Run repository checks and existing package verification. Exercise drift rejection with a changed
canonical contract. Keep measured findings and reusable source; raw captures follow the [retention policy](../../docs/research/agent-evidence-retention.md).

## Out of Scope

Publishing, release adoption, component API/runtime changes, README/AGENTS edits,
new author trials, metadata/type-entry changes, and an ongoing evaluation gate.

## Further Notes

Whitney authorized this proposal with "Lets proceed with that then", retaining the earlier
"Test first; present measured changes for review" boundary.
The [layout study](../../docs/research/agent-guidance-layout.md) supports the supplements for
one sampled task. Savings over native React/CSS remain unproven.

Whitney subsequently authorized committing completed outcomes with "Please investigate. And
commit as per work guidance liberally." This supersedes the uncommitted boundary for validated,
reviewed guidance and research. The runtime-read investigation uses existing traces only; new
wording remains a test recommendation. Production metadata remains unchanged after the pilot.
