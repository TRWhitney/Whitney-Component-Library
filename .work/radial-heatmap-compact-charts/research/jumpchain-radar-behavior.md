# Jumpchain radar behavior

## Question

How does the existing Jumpchain visualizer distinguish radar dimensions and series, handle zero
gaps, choose its scale, and keep sparse polygons visible?

## Source

Inspected the sibling `jumpchain_visualizer_v3` repository at commit
`bd8a0b7b1d479573c6262ebe238cd7da943c2caa`.

- [Radar geometry](https://github.com/TRWhitney/Jumpchain-Visualizer/blob/bd8a0b7b1d479573c6262ebe238cd7da943c2caa/src/tracker/radarGeometry.ts)
- [Radar component](https://github.com/TRWhitney/Jumpchain-Visualizer/blob/bd8a0b7b1d479573c6262ebe238cd7da943c2caa/src/tracker/TagRadar.tsx)
- [Geometry tests](https://github.com/TRWhitney/Jumpchain-Visualizer/blob/bd8a0b7b1d479573c6262ebe238cd7da943c2caa/src/tracker/radarGeometry.test.ts)

## Findings

The chart has twelve fixed dimensions, one for each tag category, and one series, the current
chain's counts across those dimensions. A dimension is one spoke. A series is one complete polygon
across every spoke.

Every dimension has a numeric count. Zero is a real value, produces no point, and remains visible
as zero in the adjacent table. The filled polygon starts with the exact value ratios. When one
positive spoke has zero neighbors on both sides, the chart adds a visual shoulder to those two
neighboring spokes. Each shoulder is the smaller of the positive value and the greater of eight
percent of the radius or twenty-five percent of the positive spoke. Adjacent positive values need
no shoulders. An all-zero chart stays empty.

The shoulders affect only the filled polygon. Point nodes and titles remain on positive source
values, and zero rows remain exact in the table. Tests assert that sparse values produce visible
area without creating zero-value points.

The interactive chart uses one common count scale. It chooses at least five and otherwise rounds
the largest value up to the next multiple of five. It does not declare a separate range for each
dimension.

## Implication

RadarChart can reuse this sparse-fill rule with arbitrary declared dimensions and one to six
series. The public contract should treat an omitted dimension as zero, reject negative and
non-finite values, use one shared scale, and keep visual shoulders out of every reported value.
