# 18 Operational Workflow Prerelease

**What to build:** The first public higher-level construct and prerelease slice for configuring,
validating, reviewing, executing, and monitoring an operation.

**Blocked by:** [Action Family](03-action-family.md),
[Field and Text Entry Family](04-field-and-text-entry-family.md), [Choice Controls](05-choice-controls.md),
[Select and Combobox](06-select-and-combobox.md), [Status, Progress, and Alerts](10-status-progress-and-alerts.md),
[Dialog and Drawer Overlays](12-dialog-and-drawer-overlays.md), [Application Structure](17-application-structure.md)

**Status:** blocked

- [ ] The construct owns identity/status Route, configuration, review, stages, actions, progress,
  and responsive configuration/status relationships through a bounded public composition API.
- [ ] Ready, invalid, disabled, review, running, success, warning, and failure states are coherent
  and do not produce layout shifts.
- [ ] Starting work produces the accepted one-shot momentum while active-stage motion persists only
  for the running duration.
- [ ] Semantic status remains independent from accent and meets contrast requirements.
- [ ] Wide and compact modes preserve wrapper-owned atmosphere, opaque panel separation, no
  arbitrary divider, and no overflow.
- [ ] The accepted prototype's profile-selection, review-dialog, validation, and running flows are
  reproduced through public components rather than copied application markup.
- [ ] A clean packed-package fixture implements the slice with no private import or external
  substitute component.
- [ ] Contracts guide agents to the higher-level construct when its use case matches.
- [ ] Behavior, accessibility, theme, browser, SSR, hydration, public type, and generated-guidance
  checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Initial Prerelease Export Catalog](../decisions/08-initial-export-catalog.md)
- [Prerelease Integration Slice Set](../decisions/14-prerelease-slice-set.md)
- [Interactive visual reference](../prototypes/visual-directions.html)

## Completion evidence

Pending implementation.
