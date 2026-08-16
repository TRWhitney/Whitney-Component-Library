# 08 Initial Prerelease Export Catalog

**Status:** resolved
**Blocked by:** [Initial Public Scope](06-initial-public-scope.md),
[Foundation Expansion Constraints](07-foundation-expansion-constraints.md)
**Type:** discussion

## Question

Which exact public component and construct capabilities belong in the initial pre-release slice, and
which representative stress cases remain design-only evidence for forward expansion?

## Answer

The initial pre-release slice includes these public capabilities:

- An appearance and accent provider.
- Button and icon-button actions.
- Text, multiline text, and numeric entry.
- Select, checkbox, radio-group, switch, and segmented choice.
- Semantic status, inline alert, and determinate or indeterminate progress feedback.
- Dialog overlay behavior.
- Field-group and section composition.
- A bounded higher-level construct for configure, validate or review, execute, and monitor
  workflows, including identity-to-status Route, stages, actions, and responsive configuration and
  status regions.

Exact export names remain reversible specification work. The slice boundary is binding: the
supported workflow must not require an external substitute for these roles, but this is not the
stable catalog or an intended-use release.

Link and toggle-button distinctions, date and time entry, asynchronous combobox collections, tabs
and navigation, popovers, tables or grids, transient notifications, and large or virtualized
collections remain design-only stress cases for the initial slice. Some become later pre-release
production scope as the stable catalog expands.

## Evidence

- The release must implement the complete configure, validate, review, execute, and monitor path
  accepted in [Initial Public Scope](06-initial-public-scope.md).
- The catalog must be large enough that the supported path does not require substituting external
  controls, but it need not implement every family in the architectural coverage map.
- [Foundation Expansion Constraints](07-foundation-expansion-constraints.md) identifies the future
  families and hard cases that must influence shared contracts without becoming accidental release
  commitments.
- [Interactive visual direction prototype](../prototypes/visual-directions.html)
