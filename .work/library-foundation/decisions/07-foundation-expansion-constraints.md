# 07 Foundation Expansion Constraints

**Status:** resolved
**Blocked by:** [Initial Public Scope](06-initial-public-scope.md)
**Type:** task

## Question

Which wider component families and representative stress cases must constrain the shared
foundation before the first-release public APIs can be frozen?

## Answer

Use the following capability territory as an architectural coverage map, not as a commitment to
implement every listed component in the first release:

- **Activation and commands:** buttons, links, toggle actions, toolbars, and action groups.
- **Value entry:** text, numeric, search, multiline, range, date, and time inputs.
- **Choice and selection:** checkbox, switch, radio, segmented, select, and autocomplete controls.
- **Collections and data display:** lists, list boxes, tables, grids, trees, and structured data
  summaries, including empty, loading, large, and asynchronous collections.
- **Navigation:** tabs, breadcrumbs, menus, pagination, and disclosure-based navigation.
- **Overlays:** dialogs, alert dialogs, popovers, tooltips, and anchored menus.
- **Feedback and status:** inline validation, alerts, semantic status, progress, meters, and
  transient notifications.
- **Layout and composition:** stacks, inline groups, fields, sections, panels, toolbars, and
  responsive compound regions.
- **Reusable composites:** recurring semantic or behavioral relationships that justify a bounded
  component without prescribing a consumer workflow or application layout.

Before the foundation stabilizes, model representative hard cases across those families:

- Button and toggle-button contracts test activation, state, and the boundary between command and
  navigation semantics.
- Number and date fields test compound controls, formatting, localization, validation, and form
  participation.
- Segmented selection tests typed group state, adjacent sizing, moving indication, and keyboard
  behavior.
- Combobox tests collections, overlays, filtering, asynchronous data, and controlled state in one
  composition.
- Dialog and popover test focus containment and restoration, portals, dismissal, and anchored
  responsive placement.
- Tabs and a table or grid test selection versus navigation, dynamic collections, dense content,
  keyboard movement, and future scale constraints.
- Progress and transient notification test live semantic state, timing, interruption, and reduced
  motion.
- The accepted operational fixture tests public-package interoperability, coordinated consumer
  state, and responsive composition. Its staged process remains the only new composite identified
  by that application example.

These models must exercise shared conventions for labeling, descriptions, validation,
disabled/read-only/required/pending states, controlled and uncontrolled state, form submission,
semantic tones, keyboard and pointer modality, localization and direction, server rendering and
hydration, responsive composition, reduced motion, and explicit extensibility. A convention may
be shared only where these families demonstrate the same meaning; no universal prop surface is
created merely for syntactic uniformity.

The stress cases may remain interface models, contract sketches, or focused planning prototypes.
They are evidence against architectural lock-in, not hidden first-release production scope.

## Evidence

- [Initial Public Scope](06-initial-public-scope.md)
- [Architecture decision: Build a Breadth-Aware Vertical Slice](../../../docs/adr/0005-build-a-breadth-aware-vertical-slice.md)
- [Behavior and Accessibility Foundation](03-behavior-foundation.md)
- [Agent-Facing Contract](04-agent-contract.md)
- [Visual Direction and Permitted Variation](05-visual-direction.md)
- [Reusable Composite Boundary](16-reusable-composite-boundary.md)
