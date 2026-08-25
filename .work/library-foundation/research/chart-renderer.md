# Private chart geometry

## Question

Which current package can supply Cartesian scale and path math while React retains deterministic
SVG, semantic HTML, accessibility, and the library's public types?

## Scope

This comparison covers D3's modular packages and Visx for Ticket 19. It excludes interaction,
statistical, radial, and geographic packages except where a dependency choice would constrain those
later tickets.

## Conclusion

Use D3 micro-packages for calculation only. React owns every rendered node. Start with
`d3-scale@4.0.2`, `d3-shape@3.2.0`, and `d3-array@3.2.4`. Do not use the D3 umbrella,
`d3-selection`, or `d3-axis`.

The selected packages are ESM, declare `sideEffects: false`, have no React dependency, and return
scale functions or SVG path strings without taking over the DOM. Their declaration packages remain
private development dependencies. This keeps D3 names out of the public API and lets ordinary
component imports tree-shake the chart modules.

Visx 4 supports React 18 and 19, but its React wrappers add a second component boundary around D3
and route through a vendor package with a much wider dependency set. Some wrapper types also expose
D3 generator concepts. That works against the library's goal of owning its chart components and
types.

## Sources

- [D3 with React](https://github.com/d3/d3/blob/main/docs/getting-started.md#d3-in-react)
- [D3 scales](https://d3js.org/d3-scale)
- [D3 line generator](https://d3js.org/d3-shape/line)
- [D3 stack generator and normalized offset](https://d3js.org/d3-shape/stack)
- [`d3-scale@4.0.2` package metadata](https://github.com/d3/d3-scale/blob/v4.0.2/package.json)
- [`d3-shape@3.2.0` package metadata](https://github.com/d3/d3-shape/blob/v3.2.0/package.json)
- [`d3-array@3.2.4` package metadata](https://github.com/d3/d3-array/blob/v3.2.4/package.json)
- [D3 axis behavior](https://d3js.org/d3-axis)
- [Visx 4 release](https://github.com/airbnb/visx/releases/tag/v4.0.0)
- [`@visx/vendor` package metadata](https://github.com/airbnb/visx/blob/v4.0.0/packages/visx-vendor/package.json)

## Constraints carried forward

Use UTC time scales and deterministic default formatting. Verify the packed ordinary-component
bundle contains no D3 code. The packages' `sideEffects: false` metadata permits that result but does
not prove the repository's export graph achieves it.
