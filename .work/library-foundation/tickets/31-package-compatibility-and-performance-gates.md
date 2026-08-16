# 31 Package, Compatibility, and Performance Gates

**What to build:** Final packed-artifact, compiler, React, SSR, hydration, bundle-isolation, and
specialized-system performance evidence for the stable candidate.

**Blocked by:** [Cross-Browser, Accessibility, and Visual Hardening](30-cross-browser-accessibility-and-visual-hardening.md)

**Status:** blocked

- [ ] The packed artifact exposes only the accepted root, stylesheet, manifest, and agent-index
      paths and installs cleanly in client-rendered and SSR fixtures.
- [ ] Public examples and declarations pass TypeScript 5.9, 6, and 7 without private dependency
      type leakage.
- [ ] React 18.3 and 19 render and hydrate every public family and four slices without mismatches.
- [ ] Browser code and edge-rendering fixtures contain no Node API dependency.
- [ ] Production bundles importing ordinary components exclude Markdown editor and chart renderer
      JavaScript; specialized CSS is split if shared inclusion exceeds the recorded materiality budget.
- [ ] Tree-shaking, explicit CSS import, peer dependency, and package side-effect behavior pass in
      the packed consumer fixtures.
- [ ] Representative large Markdown documents and chart datasets meet recorded input, selection,
      render, and interaction responsiveness budgets.
- [ ] Generated manifest and agent index exactly match the packed public exports and contracts.

## Accepted sources

- [Specification](../spec.md)
- [Distribution and Compatibility Contract](../decisions/09-distribution-and-compatibility.md)
- [Distribution and compatibility research](../research/distribution-compatibility.md)
- [Quality and Release Boundary](../decisions/10-quality-and-release-boundary.md)

## Completion evidence

Pending implementation.
