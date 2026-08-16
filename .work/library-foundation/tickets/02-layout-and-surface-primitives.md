# 02 Layout and Surface Primitives

**What to build:** Public stack, inline group, responsive grid, divider, surface/panel, section, and
scroll-region primitives that express the accepted spatial grammar without arbitrary styling APIs.

**Blocked by:** [Package, Provider, and Contract Spine](01-package-provider-and-contract-spine.md)

**Status:** ready-for-agent

- [ ] Each primitive has a narrow typed API and complete canonical contract.
- [ ] Spacing and responsive choices come from bounded semantic options rather than arbitrary
      consumer token or class injection.
- [ ] Adjacent equivalent content can maintain consistent dimensions and alignment.
- [ ] Surfaces and sections preserve rounded containment, density, and continuity rules.
- [ ] Scroll regions preserve keyboard access, visible focus, and content reachability.
- [ ] Light, dark, accent, compact, wide, forced-color, and reduced-motion checks pass where
      applicable.
- [ ] Server output and hydration are deterministic under both supported React majors.
- [ ] Focused examples compile and demonstrate appropriate and inappropriate composition.

## Accepted sources

- [Specification](../spec.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)
- [Interactive visual reference](../prototypes/visual-directions.html)

## Completion evidence

Pending implementation.
