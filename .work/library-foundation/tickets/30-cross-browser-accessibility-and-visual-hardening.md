# 30 Cross-Browser, Accessibility, and Visual Hardening

**What to build:** Release-wide evidence and fixes for the accepted browser, interaction,
assistive-technology, appearance, responsive, and motion matrix after the catalog and integration
fixtures exist.

**Blocked by:** [Operational Integration Proof](18-process-tracker-and-operational-proof.md),
[Data Analysis Integration Proof](23-data-analysis-prerelease.md),
[Markdown Authoring Integration Proof](27-markdown-authoring-prerelease.md),
[Application Workbench Integration Proof](28-application-workbench-prerelease.md)

**Status:** blocked

- [ ] Chromium, Firefox, and WebKit pass representative behavior across every public family under
      the fixed Baseline 2023 contract.
- [ ] Manual focused screen-reader exercises cover compound fields, select/combobox, overlays,
      collections, navigation, charts, Markdown editing, and all four integration fixtures
      before stable-candidate acceptance.
- [ ] Keyboard-only and touch flows complete every integration fixture without an inaccessible
      substitute path.
- [ ] Light, dark, multiple accents, compact/wide, zoom, forced-color, reduced-motion, loading,
      empty, partial, error, pending, disabled, and read-only states pass documented checks.
- [ ] Visual comparison catches unintended drift in binding visual relationships while allowing
      documented flexible constants.
- [ ] Semantic status contrast and non-color meaning pass across all applicable components.
- [ ] No accepted responsive layout clips, overflows, loses focus, or introduces arbitrary dividers
      and decorative hard stops.
- [ ] Findings are fixed at the owning component seam and do not become test-only exceptions.
- [ ] Increase scrollbar size slightly across scroll regions. Whitney reported that the current
      scrollbars have become too subtle; verify their visibility in both themes and compact layouts.
- [ ] Audit the AppearanceProvider area in the component showcase. Whitney reported that its
      controls do not respect the selected accent and appear bespoke. Use library components where
      appropriate and verify that controls and selected states follow the active accent.
- [ ] Move the AppearanceProvider options into the sidebar beside the accent selector so the
      appearance controls are together. Whitney identified the current placement as poor UX.
- [ ] Rework hierarchy and spacing in the showcase's chart section. Make section and subsection
      boundaries clear and separate distinct concepts with space; compact density must not erase
      these relationships.
- [ ] Add the vertical dashed hover guide to area charts and verify it in the rendered examples.
- [ ] Give the pie-chart explanation a readable width independent of the chart width. Its current
      narrow wrapping adds excessive vertical space.
- [ ] Make regular and compact chart examples meaningfully representative. Whitney reported that
      the current sizing controls only change small charts to slightly smaller charts.
- [ ] Standardize shared chart options throughout the showcase, including compact sizing, so
      comparable examples expose consistent controls.
- [ ] Remove the repeated "Try compact density and optional..." links from every showcase area.
      Whitney finds these prompts unnecessary and distracting.

## Accepted sources

- [Specification](../spec.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)
- [Quality and Release Boundary](../decisions/10-quality-and-release-boundary.md)

## Completion evidence

Pending implementation.
