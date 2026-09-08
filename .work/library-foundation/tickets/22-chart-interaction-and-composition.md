# 22 Chart Interaction and Composition

**What to build:** Extend the delivered chart readings with series visibility, activation callbacks,
selection, coordinated views, domain exploration, purposeful animation, and specific additional
mixed-chart combinations.

**Blocked by:** none. [Statistical Chart Family](20-statistical-chart-family.md) and
[Radial, Heatmap, and Compact Charts](21-radial-heatmap-and-compact-charts.md) are complete.

**Status:** active; delivered foundation complete, remaining work in
[active implementation effort](../../chart-interaction-composition/status.md)

## Delivered foundation

- [x] Chart-owned pointer, keyboard, and touch readings expose formatted data and accessible
      announcements according to each chart's accepted reading unit.
- [x] Legends support transient emphasis and click-to-pin emphasis where applicable, with non-color
      identity cues and no series hiding.
- [x] Charts provide named keyboard reading boundaries, ordered traversal, responsive presentation,
      and complete generated data tables. Keyboard access does not require a tab stop per mark.
- [x] CartesianChart combines compatible line, area, and column series with bounded scales and
      reference lines, bands, and point annotations while keeping renderer objects private.
- [x] The existing column-and-line combination can display columns with a moving-average line when
      the application supplies the calculated values.

## Remaining acceptance checks

- [ ] Separate, obvious, visually restrained legend controls hide and restore individual series
      while clicking the series name retains the existing emphasis behavior. Hidden entries remain
      discoverable and restorable. An opening/closing eye is the leading visual candidate, subject
      to review in a working example; its meaning must also be accessible without the icon.
- [ ] Hiding or restoring series automatically fits the scale to visible data without requiring an
      application setting to enable that behavior. Required chart baselines remain valid.
- [ ] Applications can receive activation callbacks for actual chart items, including categories
      and points, with sufficient identity and associated data to act on them. Activation does not
      require adopting chart selection. Pointer, keyboard, and touch have equivalent activation
      paths.
- [ ] Charts support visible selection and application-controlled selection. Applications can
      deliberately coordinate charts, tables, detail views, or filters through explicit public
      state and callbacks without hidden global coupling or a prescribed application action.
- [ ] Meaningful chart domains support pan, zoom, and brush/range selection, with keyboard paths,
      discoverable controls, an easy reset, and range callbacks available to the application.
- [ ] Exploration and selection controls are intuitive, visually restrained, and consistent with
      the chart. Their gestures do not accidentally interfere with value reading, activation, or
      legend emphasis. Working examples demonstrate both appearance and operation before acceptance.
- [ ] Brief, purposeful animations explain data and scale changes, remain responsive to further
      input, never loop idly, and settle immediately under reduced motion.
- [ ] Scatter points can share a chart with a supplied trend, target, or other compatible line.
- [ ] A line can share a chart with a supplied lower/upper range band that changes along the domain,
      such as an uncertainty or forecast band. This extends the existing fixed reference bands.
- [ ] Applications supply calculated trend, average, forecast, and range values. Charts do not
      silently choose statistical calculations or expose private renderer objects.
- [ ] Accessible names, readings, focus, and structured data alternatives remain accurate as
      visibility, filters, selection, and the displayed domain change. Selection is distinguishable
      without color alone, and the complete-data alternative remains available.
- [ ] Representative datasets meet a recorded responsiveness budget covering reading, selection,
      visibility changes, exploration, and animation.
- [ ] Public contracts, generated guidance, showcase examples, and focused interaction, type,
      accessibility, reduced-motion, server-rendering, hydration, and package checks cover the
      delivered additions.

## Reconciled scope

Whitney accepted these remaining requirements in the reconciliation discussion on 2026-09-07.
They extend the earlier chart efforts, whose exclusions of visibility controls, consumer callbacks,
coordinated state, domain exploration, and geometry animation bounded those completed deliveries.
Those exclusions do not prohibit the additions accepted here.

Mixed-chart scope is the existing line/area/column composition, including supplied moving averages,
plus scatter with a line and a line with a changing range band. Scatter with adjacent distribution
charts is excluded from this composition work because it is an arrangement of separate charts.
General coordination between separate charts remains in scope; no dashboard or prescribed layout
is added.

Implementation planning still needs to settle exact controls and gestures, selection multiplicity,
visibility semantics for the other chart families, and the interaction between visibility fitting, zoom, and explicit
consumer domains. This reconciliation records requirements, not a finished interface design.

## Accepted sources

- [Specification](../spec.md)
- [Charting Scope](../decisions/13-charting-scope.md)
- [Quality and Release Boundary](../decisions/10-quality-and-release-boundary.md)
- [Accepted Cartesian reading and sizing](../../chart-interactivity/spec.md)
- [Completed chart-reading effort](../../chart-interactivity/status.md)
- [Completed radial, heatmap, and compact effort](../../radial-heatmap-compact-charts/status.md)

## Completion evidence

The delivered foundation is recorded in `d8cce02` for Cartesian interaction, `2d35b1f` for
statistical charts, `9780036` for pie and donut, `d9ddcd5` for radar, `6680a5c` for heatmap, and
`554be1e` for sparkline. Their effort records describe focused tests, browser operation, package
validation, and review corrections. The later chart effort records independent intent and
engineering reviews.

The reconciliation checked public chart types, implementations, tests, accepted specifications,
and ticket history. The old Ticket 22 checklist had not been reconciled with those deliveries.
A focused test rerun during this review could not start because `vitest` was not installed in the
checkout; the historical validation above is not a fresh test result.

The remaining acceptance checks are not implemented or validated by this documentation change.

The first [Cartesian visibility implementation](../../chart-interaction-composition/tickets/01-cartesian-visibility.md) is complete with passing checks and independent intent and engineering reviews. It delivers eye controls, animated automatic scale fitting, and all-hidden recovery for five Cartesian charts. Other chart families, activation, selection, exploration, general data animation, and the two added compositions remain open.
