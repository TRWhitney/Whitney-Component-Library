# 11 Stable Catalog Model

**Status:** resolved
**Blocked by:** [Initial Public Scope](06-initial-public-scope.md),
[Foundation Expansion Constraints](07-foundation-expansion-constraints.md),
[Initial Prerelease Export Catalog](08-initial-export-catalog.md)
**Type:** discussion

## Question

Does the initial workflow slice define the stable catalog, or does stable release require a wider
component offering independently validated through several slices?

## Answer

The initial workflow is only a pre-release slice. Stable release requires a substantially wider
catalog of conventional components; vertical slices validate integration but do not define which
components may be offered. The stable catalog also includes specialized capabilities, explicitly
an Obsidian-like Markdown editing field and a standard chart family containing a radar chart.

The precise editor and chart contracts are separate decisions because superficial wrappers would
not satisfy the accepted scope. Compatibility does not stabilize and the library is not intended
for use until several slices and the wider catalog are complete.

## Evidence

- Whitney explicitly rejected treating the workflow slice as the first stable release and stated
  that the library is not intended for use until several slices are finished.
- Whitney clarified that the desired expansion is a wider breadth of offered components, not
  merely a greater number of vertical slices.
- Whitney explicitly included Obsidian-like Markdown editing and standard chart types including a
  radar chart in the pre-stable scope.
- [Architecture decision: Build a Breadth-Aware Vertical Slice](../../../docs/adr/0005-build-a-breadth-aware-vertical-slice.md)
