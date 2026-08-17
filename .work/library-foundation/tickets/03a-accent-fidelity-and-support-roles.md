# 03A Accent Fidelity and Support Roles

**What to build:** Correct the provider and existing components so identity-bearing emphasis uses
the consumer's exact accent while derived hues and supporting boundaries satisfy the roles that
need adaptation.

**Blocked by:** [Package, Provider, and Contract Spine](01-package-provider-and-contract-spine.md),
[Action Family](03-action-family.md)

**Status:** complete

- [x] The provider preserves the normalized six-digit accent exactly in its identity and primary
      fill roles in both appearances.
- [x] Primary filled controls render the exact accent with independently chosen readable foreground
      content.
- [x] When an exact primary fill is insufficiently distinct from its actual surrounding surface, a
      saturated same-hue supporting boundary makes the control discernible without recoloring its
      fill or making every primary control look traditionally bordered.
- [x] Rich hover tint preserves the selected hue, while ordinary labels remain neutral and filled
      hover content chooses an independently readable foreground.
- [x] Focus, rail, edge, underline, and boundary roles use the exact accent where it is already
      visible and otherwise use saturated same-hue support rather than pastel or gray-neutralized
      derivation.
- [x] Contrast is enforced only where a role actually meets a surface; no derived role is required
      to contrast against every owned surface.
- [x] Deep purple in dark appearance, light accents in light appearance, middle-luminance accents,
      black, and white exercise exact-fill fidelity, readable foregrounds, visible boundaries,
      focus, selection rails, and hover feedback.
- [x] Semantic success, warning, and danger colors remain independent from the application accent.
- [x] Canonical provider and action guidance distinguishes literal accent uses from derived support
      roles without exposing general token customization.
- [x] The showcase displays the literal selected accent and supports direct comparison across both
      appearances.
- [x] Focused role derivation, component appearance, generated guidance, browser, SSR, hydration,
      package, and public-type checks pass without changing the provider's public props or package
      surface.

## Accepted sources

- [Specification](../spec.md)
- [Style and Theme Contract](../decisions/02-style-and-theme-contract.md)
- [Architecture decision: Own Styles and Bound Theming](../../../docs/adr/0002-own-styles-and-bound-theming.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)
- [Accepted Accent Family Exploration](../prototypes/accent-family-exploration.md)

## Completion evidence

- `npm run check` covers exact identity fills, rich same-hue hover tint, readable foregrounds,
  conditional boundaries, saturated same-hue structure, semantic-color independence, and
  surface-local role selection across both appearances and representative extreme accents.
- `npm run showcase:build` and `npm run verify:package` pass; clean React 18.3.1 and React 19.2.8
  consumers pass SSR, hydration, public-type, stylesheet, and browser-build checks.
- Direct Chromium, Firefox, and WebKit operation confirms exact deep-purple identity, rich hover,
  saturated focus and rails, neutral resting labels, readable selected press feedback, and the
  matching role set on canvas, base, raised, subtle, Toolbar, and ScrollRegion surfaces. Compact
  layouts retain zero horizontal overflow.
- White-on-light and black-on-dark fills retain exact identity with independently visible support;
  danger remains red and pending remains yellow regardless of accent.
- The accepted implementation is the current exact-identity, rich-tint, neutral-content,
  saturated-structure model. Earlier neutral-directed and pastel derivations are superseded rather
  than retained as alternate behavior.
