# Accent-derived, role-aware chart colors

## Problem Statement

Categorical chart colors are fixed independently of the application accent. A direct hue orbit can
derive a coherent palette, but accents near black or white do not provide a useful hue and saturated
filled marks can obscure stroked marks drawn over them. Chart labels also render too small once the
fixed SVG canvas is displayed at normal showcase widths.

The mixed bar-and-line example exposes a separate allocation defect: one series explicitly claims a
palette color while a later automatically colored series receives the same color from its ordinal
position. The resulting bar and line are indistinguishable even though neither requested a shared
encoding.

## Solution

Use the accepted role-aware orbit for ordinary categorical series. The first ordinary series uses
the application accent. Later ordinary series derive distinct hues around it. If the selected accent
is achromatic or nearly achromatic, those later series orbit the library's default blue seed while
the first series remains the selected accent.

Treat the derived color as a series identity rather than an identical paint for every mark. Filled
marks use a softened fill with a clear series-colored boundary; stroked marks retain a stronger
series color and sufficient weight to remain visible over fills. Existing non-color distinctions,
including line patterns and point markers, remain available.

Automatic color allocation reserves ordinary palette colors claimed explicitly by other series.
An omitted color therefore receives the next unclaimed automatic color. Multiple explicit uses of
the same color remain intentional and are not rewritten.

Increase chart axes, tick labels, annotations, and legends to a readable rendered size at the
smallest supported chart presentation. Preserve adequate plot margins and tick density so the fix
does not trade unreadable type for collisions. The showcase demonstrates the public behavior but is
not itself the mechanism that makes chart text readable.

## User Stories

1. As an application author, I want categorical chart colors to relate to my accent, so that charts
   belong to the surrounding visual system without losing series distinction.
2. As a chart reader, I want lines, bars, areas, labels, and legends to remain distinguishable, so
   that I can understand a mixed chart without guessing which marks share a series.
3. As a component consumer, I want automatic colors to avoid explicitly claimed colors, so that
   mixed explicit and automatic configuration does not create accidental duplicates.

## Implementation Decisions

- The [role-aware orbit prototype](prototypes/accent-derived-chart-colors.md) is the visual source
  for the palette relationship, achromatic fallback, and mark-role treatment.
- Semantic success, warning, and danger colors remain explicit semantic choices. They are not
  replaced by the categorical orbit or reserved by ordinary automatic allocation.
- Series identity remains stable across mark roles. Role-aware treatment changes how that identity
  is painted, not which categorical color belongs to the series.
- Automatic allocation avoids explicit ordinary palette claims regardless of series order. It does
  not prevent an author from explicitly assigning the same color more than once.
- No public chart configuration should be required solely to receive the corrected defaults.
- Exact orbit offsets, chroma floor, neutral threshold, fill mix, stroke width, and typography
  values are flexible implementation constants subject to contrast and layout verification.

## Testing Decisions

- Verify ordinary palette derivation in both appearances with a chromatic accent and with black,
  near-black, near-white, and white accents.
- Verify that derived ordinary series are distinct and that filled and stroked marks preserve the
  same series identity while using role-appropriate paint.
- Verify automatic allocation with explicit colors before and after omitted colors, including the
  mixed bar-and-line case. Verify that duplicate explicit assignments remain unchanged.
- Verify semantic colors and non-color line/point distinctions remain available.
- Verify axes, ticks, annotations, and legends at the smallest supported rendered chart size in both
  appearances, including representative long labels and the showcase mixed chart.
- Retain package build, type, unit, server-rendering, and hydration coverage expected by the chart
  foundation.

## Out of Scope

- A separate redesign of line-only charts
- Tooltips, selection, zooming, or other chart interaction
- Deriving semantic success, warning, or danger colors from the accent
- A new application shell or prescribed workflow composition
- Typography changes outside chart components

## Further Notes

The prototype's controls, sample data, explanatory layout, and identify-regions aid are disposable
prototype scaffolding and do not enter the component showcase or public package.
