# Ship a Modern ESM Package

The library will ship as one ESM-only package with an encapsulated root entry and explicit static
CSS, component-manifest, and agent-index subpaths; React 18.3 or 19 and React DOM remain peers while
React Aria stays private. It targets TypeScript 5.9 and newer, fixed Baseline 2023 browsers, and
Node 22 or newer for tooling and Node SSR verification, while keeping browser code independent of
Node APIs and guaranteeing server rendering plus deterministic hydration for interactive Client
Components.
