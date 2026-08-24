# 17 Application Structure

**What to build:** Split view and workspace/page-header constructs that coordinate resizable panes,
actions, an optional page identifier, and optional status content without owning routing or the
application's overall layout.

**Blocked by:** [Layout and Surface Primitives](02-layout-and-surface-primitives.md),
[Action Family](03-action-family.md), [Navigation and Disclosure Family](14-navigation-and-disclosure-family.md)

**Status:** complete

- [x] Split views provide bounded pane sizing, minimums, keyboard resizing, and responsive fallback.
- [x] Either split pane can collapse, at most one pane is collapsed, and distinct controls identify
      the pane they affect with pane diagrams rather than directional chevrons.
- [x] Split pane controls use the quiet secondary button highlight and bright foreground icon on
      hover. Hover does not draw a separate outline.
- [x] Applications retain ownership of their overall header, navigation, workspace, utility, and
      footer layout. The library exposes no ApplicationShell component.
- [x] Workspace/page headers coordinate an optional page identifier, optional consumer-named status
      content, breadcrumbs, and actions while keeping their semantics distinct. No specific status
      label or pill is prescribed.
- [x] Status content requires an independent success, warning, danger, or neutral tone so arbitrary
      status content can color Route without depending on StatusIndicator.
- [x] Route uses flexible meaningful space with the accepted open accent origin and solid semantic
      endpoint without crossing labels, duplicating status, or adding endpoint halos.
- [x] Compact reflow preserves pane ownership and does not insert arbitrary dividers.
- [x] Focus order remains coherent as either pane collapses, resizes, or moves.
- [x] Theme, accent, directionality, zoom, reduced motion, SSR, hydration, and type checks pass.
- [x] Contracts distinguish page header, section, panel, split view, and workflow use.

## Accepted sources

- [Specification](../spec.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)
- [Interactive visual reference](../prototypes/visual-directions.html)

## Completion evidence

- `npm run check` passes formatting, zero-warning ESLint and Stylelint, source types, 24 test files
  with 411 tests, generated guidance, and public declarations under TypeScript 5.9, 6, and 7.
- `npm run showcase:build`, `npm run verify:package`, and `git diff --check` pass. Packed React 18.3.1
  and React 19.2.8 consumers pass SSR, hydration, types, and browser builds.
- Chromium, Firefox, and WebKit direct showcase operation confirms the open accent Route origin,
  continuous accent-to-status track, solid semantic endpoint, arbitrary two-line status content,
  RTL gradient, distinct pane-target controls, collapse and restore of either pane, and no console
  errors.
- In all three engines, settled pointer hover changes a pane control from the raised neutral surface
  to the accent-soft surface with an accent boundary and white icon. It adds no hover outline.
- Chromium, Firefox, and WebKit preserve the separator's initial 60 percent size when a pointer drag
  begins away from its center, then report 65 percent after a five-percent-width movement. Controlled
  pane collapse moves separator focus to the affected restore control, and compact reflow moves it
  to the primary pane control in all three engines. Focus that has already left the separator stays
  outside SplitView through a later controlled collapse in all three engines.
- In all three engines, the pressed pane control uses the accent-soft surface, accent boundary,
  inset pressed depth, white icon, and no hover outline. Device-scale-two contexts expose 640 CSS
  pixels across 1,280 device pixels, reflow PageHeader without horizontal overflow, and stack
  SplitView with its separator hidden.
- Chromium direct inspection confirms light and dark themes, forced colors, reduced motion, compact
  stacked layout, horizontal disabled separator, two reachable compact controls, narrow PageHeader
  reflow without horizontal overflow, and unchanged CollapsibleNavigationPane collapse behavior.
- Component screenshots were inspected for alignment, clipping, wrapping, spacing, Route endpoint
  geometry, and state contrast, then removed as temporary validation artifacts.
