# Accent-derived chart colors

## Question

Should series two through six use hue rotations derived from the application accent, and should
filled and stroked marks receive different treatments so overlapping series remain distinguishable?

## Artifact

The non-production prototype is self-contained in [accent-derived-chart-colors](accent-derived-chart-colors/).
Run it from the repository root with:

```text
npx vite .work/chart-accent-palette/prototypes/accent-derived-chart-colors --host 127.0.0.1
```

Use its Palette derivation, Appearance, and Accent controls to compare the result.

The prototype contains a palette strip and one six-series mixed Cartesian chart. Enable Identify
regions to reveal the stable names Palette mode control, Derived palette, and Mixed chart on hover
or keyboard focus.

## Comparison modes

- Current preserves the fixed light and dark categorical palettes as a baseline.
- Hue orbit applies a chroma floor and distributes later series around the OKLCH hue circle.
- Role-aware orbit uses the same palette, softens filled bar and area marks, and strengthens line
  strokes so lines remain readable over fills.

Black, white, and near-neutral accents do not contain a stable hue. Both orbit modes use the
library's default blue hue as an explicit fallback for later series while the first series remains
the selected accent. Stress-test presets make those cases directly selectable.

## Status

Role-aware orbit is the accepted direction. Its palette relationship, neutral fallback behavior,
and distinction between filled and stroked marks are binding. Exact color-space constants and
stroke/fill values may be refined during production contrast verification without changing that
direction. Tonal family was removed after the first comparison.

## Direct evidence

Chromium exercised Current, Hue orbit, and Role-aware orbit with black, near-black, near-white,
white, blue, and red accents. Every case produced six distinct computed colors. The neutral
fallback message appeared for all four neutral presets in both appearance contexts. Role-aware
orbit changed the red bar fill independently from its outline and increased line width from 2px to
2.5px. Direct comparison showed the five line series remaining distinguishable over the softened
bars where the original saturated bars obscured them. The document did not overflow at 700px, and
the chart preserved its 640px canvas through local horizontal scrolling.

## Limitations

This prototype does not define final production constants, gamut correction, semantic color
interaction, or a final palette API. The current chart legend does not carry mark kind, so the
role-aware legend still identifies the series color rather than reproducing the softened fill.
Chart typography and automatic color allocation are production defects covered by the accompanying
specification rather than modeled here.
