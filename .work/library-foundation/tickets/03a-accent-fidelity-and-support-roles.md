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

- `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict types, generated
  artifacts, the TypeScript 5.9/6/7 matrix, and 122 tests. The accent matrix covers both appearances
  with blue, deep purple, red, middle grays, yellow, white, and black; it directly verifies literal
  fill fidelity, independently readable foregrounds, conditional boundaries, and derived text,
  focus, and rail contrast.
- `npm run showcase:build` and `npm run verify:package` pass. Clean React 18.3.1 and React 19.2.8
  consumers pass packed-package SSR, hydration, public-type, and browser-build checks. The dependency
  audit reports zero vulnerabilities and `git diff --check` passes.
- Direct Chromium, Firefox, and WebKit operation changed dark appearance to `#2b0a64` and light
  appearance to `#ffffff`. Every engine rendered the literal primary fills with readable
  foregrounds and a conditional contrasting edge, while the default `#2878ff` retained a
  transparent edge. Derived links, focus indication, and selected rails remained visible and
  related to the chosen hue; the danger treatment did not change with the accent.
- Inspected wide and 390px screenshots in every engine show clean rounded controls, exact-color
  swatches, orderly wrapping, visible rails and focus, and no clipping, overflow, or style leakage.
  Temporary validation scripts, screenshots, and build artifacts were moved to Trash.
- First delivery review found that the muted role could disappear against owned surfaces for
  extreme accents. The corrected role now maintains 3:1 against both owned surfaces and its soft
  state; a focused 16-case regression failed before the correction and the affected 32 tests,
  strict types, and linters pass afterward. The complete repository, package, and three-engine
  validation above was repeated after this correction. Destination-link underlines now visibly and
  structurally use the corrected muted role for deep-purple dark, white light, and default-blue dark
  cases in every engine.
- Repeat intent review found that IconButton, Link, and ToggleButton guidance ambiguously said their
  support treatments “use the application accent.” A focused contract test failed before all three
  descriptions explicitly distinguished role-specific derived hues, then 48 affected tests,
  generated guidance, strict types, and linters passed. Rendering evidence is unaffected. Complete
  repository, generated-artifact, showcase-build, and package checks pass after the correction.
- Final fresh independent intent and engineering review axes examined the complete corrected change
  from HEAD `874d534` through the working tree and reported no findings.
- Whitney's post-delivery showcase evaluation invalidates the visual completion evidence. For
  `#2d0548` in dark appearance, neutral-directed contrast adjustment produces dusty gray-purple
  text, rails, and muted edges, while the low-contrast fill boundary jumps to near-white and
  dominates the literal swatch. The accepted implementation must be replanned around
  hue-preserving support colors, role-local contrast, and accent-bearing hover and outline states
  before these acceptance checks can close again.
- The accepted accent-family prototype replaces the invalidated neutral-directed strategy. Focused
  provider, stylesheet, contract, and showcase regressions failed first, then 65 tests, strict
  types, zero-warning linters, formatting, generation, and diff checks passed with the production
  saturated structural-accent family. Chromium rendering matches the accepted deep-purple dark and
  light states, including exact fill, rich hover tint, neutral resting text, saturated focus and
  hover edges, the persistent selected rail, and zero compact overflow. This established the
  implementation boundary before renewed validation.
- Renewed `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict source types,
  generated-artifact checks, 123 tests, and the TypeScript 5.9/6/7 declaration matrix. Packed-package
  SSR, hydration, public types, and browser builds pass in clean React 18.3.1 and React 19.2.8
  consumers. The showcase production build passes, the dependency audit reports zero
  vulnerabilities, and `git diff --check` is clean.
- Direct Chromium, Firefox, and WebKit validation operated deep-purple selected hover, primary hover,
  keyboard focus, destination-link hover, appearance switching, and compact reflow. All three
  engines render exact `#2d0548` fill, rich `#2b0b43` hover tint, saturated `#aa2afe` structure,
  neutral resting content, readable hover content, and the full-width selected rail with no clipping
  or style leakage; each 390px document has zero horizontal overflow. Chromium inspection of white
  in light appearance and black in dark appearance confirms exact fills with neutral structural
  support. Danger remains red and pending remains yellow. Every validation screenshot was inspected
  and then discarded.
- Delivery intent review invalidated the affected validation. It found that a contrasting exact fill
  can have no visible primary-hover delta, support roles were derived only for the base surface even
  when components sit on canvas, raised, or subtle surfaces, and the visual-direction decision still
  described a selected label as accent-colored. Focused regressions first failed for a distinct
  hover edge, per-surface role derivation and CSS selection, showcase surface ownership, and
  neutral-label guidance, invalidating the earlier validation.
- The corrected provider derives support independently for canvas, base, raised, and subtle surfaces
  and verifies contrast after six-digit serialization. Surface and showcase boundaries select the
  matching role set; primary hover has its own saturated edge, and selected labels remain neutral.
  The complete 127-test check, formatting, zero-warning linters, strict source types, generated
  artifacts, TypeScript 5.9/6/7 declaration matrix, showcase production build, React 18/19 packed
  consumers, dependency audit, and diff check pass.
- Direct Chromium, Firefox, and WebKit operation confirms exact `#2d0548` fills, `#2b0b43` rich hover
  tint, surface-local saturated structure, keyboard-visible focus, distinct primary-hover edges,
  neutral resting text, full selected rails, and zero horizontal overflow at 390px. Chromium also
  confirms exact white-on-light and black-on-dark fills with neutral support. Every screenshot was
  inspected and discarded with the temporary validation harness.
- Fresh delivery review invalidated the affected evidence. Both independent axes found that Toolbar
  paints a subtle surface without activating the subtle-surface accent roles for its direct action
  children. Engineering review also found that a selected ToggleButton's pressed state paints the
  accent-soft background without its independently readable foreground, which can erase a light
  label on light accent families. Focused regressions and implementation corrections are required,
  followed by renewed validation and both review axes.
- Focused stylesheet regressions failed against both reviewed defects, then passed after Toolbar
  activated all six subtle-surface roles and selected press feedback adopted the independently
  readable accent-soft foreground. The affected style, action, and provider suites pass 53 tests;
  the complete 127-test repository check, strict types, linters, formatting, generated artifacts,
  TypeScript 5.9/6/7 declaration matrix, and diff check are green. Validation must now repeat the
  directly affected rendered states and dependent package evidence.
- Renewed direct Chromium, Firefox, and WebKit operation confirms that Toolbar activates each of its
  subtle-surface roles for `#5f6b72`, a keyboard-focused child uses that surface's focus signal, and
  a selected ToggleButton held pressed under white-on-dark renders a light accent-soft background
  with black readable content. All six screenshots were inspected and discarded with the temporary
  harness. The showcase production build, React 18/19 packed consumers, and zero-vulnerability audit
  pass after the correction.
- Repeat intent review reports no findings. Repeat engineering review found one remaining objective
  scoping defect: ScrollRegion owns a subtle surface and accepts composed descendants but does not
  activate the subtle-surface roles. The surface-role inventory confirms ScrollRegion is the only
  remaining library-owned compositional surface without an explicit role set. A focused regression,
  correction, renewed affected validation, and both fresh review axes are required.
- A focused ScrollRegion surface-scoping regression failed against the reviewed code, then passed
  after ScrollRegion activated all six subtle-surface roles for itself and composed descendants.
  The complete component-surface inventory now covers every production owner of a library surface.
  The affected 35 tests and complete 127-test repository check pass with strict types, linters,
  formatting, generated artifacts, TypeScript 5.9/6/7 declarations, and a clean diff. Direct
  ScrollRegion validation and dependent package evidence remain to be renewed.
- Renewed direct Chromium, Firefox, and WebKit operation confirms the focused ScrollRegion's active
  boundary, focus, and rail exactly match its subtle-surface roles for `#5f6b72`, and keyboard focus
  is visibly saturated without clipping or leakage. All three screenshots were inspected and
  discarded with the temporary harness. The production showcase build, React 18/19 packed
  consumers, and zero-vulnerability audit pass after the final surface correction.
- Final fresh independent intent and engineering review axes examined the complete change from HEAD
  `d8725d6` through the working tree after all corrections and reported no findings.
