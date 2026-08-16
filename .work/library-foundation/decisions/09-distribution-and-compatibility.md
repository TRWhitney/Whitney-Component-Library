# 09 Distribution and Compatibility Contract

**Status:** resolved
**Blocked by:** [Supported Consumption Model](01-consumption-model.md),
[Style and Theme Contract](02-style-and-theme-contract.md),
[Behavior and Accessibility Foundation](03-behavior-foundation.md),
[Initial Export Catalog](08-initial-export-catalog.md)
**Type:** research

## Question

Which package topology, JavaScript and type entry points, stylesheet delivery, peer dependency
range, runtime and browser baseline, and server-rendering guarantee should define the first
coherent release?

## Answer

Ship one tree-shakeable, ESM-only npm package with explicit public exports and no CommonJS build.
The root provides named JavaScript exports and declarations. Separate public subpaths provide the
static stylesheet, generated component manifest, and compact agent index; all unlisted paths are
encapsulated. The application imports CSS once at its boundary rather than components injecting
styles at runtime.

React and React DOM are peer dependencies at `^18.3.1 || ^19.0.0`. React Aria remains a private
runtime dependency and none of its exports or prop types become public transitively. Consumer
declarations support TypeScript 5.9 and are verified under TypeScript 5.9, 6, and 7. Repository
tooling and Node-based SSR verification require Node 22 or newer.

Browser support is the fixed Baseline 2023 target expressed through Browserslist. The browser
package uses no Node APIs so standards-compatible edge rendering remains possible. Every export
supports server rendering and deterministic hydration, including stable initial output and locale;
interactive exports are Client Components and direct React Server Component execution is outside
the contract.

The public subpaths are specified as `.`, `./styles.css`, `./manifest.json`, and
`./agent-index.md`. Exact internal output filenames are implementation details.

## Evidence

- [Supported Consumption Model](01-consumption-model.md)
- [Style and Theme Contract](02-style-and-theme-contract.md)
- [Behavior and Accessibility Foundation](03-behavior-foundation.md)
- [Initial Export Catalog](08-initial-export-catalog.md)
- [Research: React Library Distribution and Compatibility](../research/distribution-compatibility.md)
- [Architecture decision: Ship a Modern ESM Package](../../../docs/adr/0006-ship-a-modern-esm-package.md)
