# 30 Cross-Browser, Accessibility, and Visual Hardening

**What to build:** Release-wide evidence and fixes for the accepted browser, interaction,
assistive-technology, appearance, responsive, and motion matrix after the catalog and slices exist.

**Blocked by:** [Forward-Expansion Contract Probes](29-forward-expansion-contract-probes.md)

**Status:** blocked

- [ ] Chromium, Firefox, and WebKit pass representative behavior across every public family under
  the fixed Baseline 2023 contract.
- [ ] Focused screen-reader exercises cover compound fields, select/combobox, overlays, collections,
  navigation, charts, Markdown editing, and all four higher-level constructs.
- [ ] Keyboard-only and touch flows complete every supported slice without an inaccessible
  substitute path.
- [ ] Light, dark, multiple accents, compact/wide, zoom, forced-color, reduced-motion, loading,
  empty, partial, error, pending, disabled, and read-only states pass documented checks.
- [ ] Visual comparison catches unintended drift in binding visual relationships while allowing
  documented flexible constants.
- [ ] Semantic status contrast and non-color meaning pass across all applicable components.
- [ ] No accepted responsive layout clips, overflows, loses focus, or introduces arbitrary dividers
  and decorative hard stops.
- [ ] Findings are fixed at the owning component seam and do not become test-only exceptions.

## Accepted sources

- [Specification](../spec.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)
- [Quality and Release Boundary](../decisions/10-quality-and-release-boundary.md)

## Completion evidence

Pending implementation.
