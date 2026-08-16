# React Library Distribution and Compatibility

## Question

Which current ecosystem constraints should inform the first release's package topology, entry
points, dependencies, browser baseline, TypeScript compatibility, and server-rendering contract?

## Scope

This research covers a React and TypeScript component library that uses React Aria Components
privately and ships static CSS. It uses current official or primary sources as of August 16, 2026.
It does not choose the project's compatibility policy, package name, release automation, or quality
gates.

## Conclusion

A single package with an explicit `exports` map can provide one typed JavaScript entry, a separate
stylesheet subpath, and public metadata subpaths while encapsulating every unlisted internal path.
Modern consumers do not inherently require CommonJS; supporting it is a deliberate compatibility
choice that adds a second JavaScript and declaration surface. React and React DOM must remain peer
dependencies. React 18 and newer can server-render React Aria behavior with stable generated IDs
without `SSRProvider`, but the component entry remains a Client Component dependency and must
produce identical initial server and client output for hydration.

A browser claim should be reproducible rather than say only “modern browsers.” Browserslist can
express a fixed Baseline year or date, and the WebDX `web-features` data can check platform-feature
availability. TypeScript consumers need a modern resolver that understands package `exports`; the
current TypeScript 6-to-7 transition makes a tested declaration range more useful than claiming
only the newest compiler.

## Evidence

### Package and module surface

- Node recommends `exports` for new packages on supported Node versions. It encapsulates unlisted
  subpaths and makes the public interface more reliable for semantic-versioning changes. [Node
  package documentation](https://nodejs.org/api/packages.html)
- TypeScript follows package `exports` under `node16`, `nodenext`, and `bundler` resolution and
  always considers the `types` condition. [TypeScript module
  reference](https://www.typescriptlang.org/docs/handbook/modules/reference)
- Vite's library guidance demonstrates a separately exported CSS file. [Vite library
  distribution](https://vite.dev/guide/build.html)
- CSS that is imported for side effects must be declared as such so compatible bundlers do not
  remove it. [webpack tree-shaking guidance](https://webpack.js.org/guides/tree-shaking/)
- CommonJS is not required by the package standard. Node's publishing guidance describes hazards
  in dual-format packages, while Vite shows dual output as a compatibility option. [Node package
  publishing](https://nodejs.org/learn/modules/publishing-a-package), [Vite library
  distribution](https://vite.dev/guide/build.html)

### React and React Aria

- React 19.2 is the current documented React line; React 18 is the preceding documented major.
  [React versions](https://react.dev/versions)
- React Aria Components 1.20.0 declares React and React DOM peers spanning React 16 through 19 and
  depends on consolidated React Aria and React Stately packages. This establishes installable peer
  compatibility, not an equal project support guarantee across every major. [React Aria 1.20.0
  release](https://react-aria.adobe.com/releases/v1-20-0), [published package
  manifest](https://github.com/adobe/react-spectrum/blob/react-aria-components%401.20.0/packages/react-aria-components/package.json)
- Multiple React copies can break Hooks, supporting peer rather than bundled React dependencies.
  [React invalid-hook warning](https://react.dev/warnings/invalid-hook-call-warning)
- React Aria uses React's `useId` for React 18 and newer, so `SSRProvider` is unnecessary for those
  majors. [React Aria SSR guidance](https://react-aria.adobe.com/SSRProvider)
- React hydration requires the initial server and client output to match. React Aria provides
  `useIsSSR` to defer browser-dependent rendering through initial hydration, and its framework
  guidance requires locale agreement between server and client. [React
  hydration](https://react.dev/reference/react-dom/client/hydrateRoot), [React Aria SSR
  detection](https://react-aria.adobe.com/useIsSSR), [React Aria framework
  setup](https://react-aria.adobe.com/frameworks)
- React Aria Components imports a client-only boundary. The wrapper must preserve that boundary;
  Client Components may still be pre-rendered on a server and hydrated in the browser. [React Aria
  component entry](https://github.com/adobe/react-spectrum/blob/react-aria-components%401.20.0/packages/react-aria-components/exports/index.ts),
  [Next.js server and client component model](https://nextjs.org/docs/app/getting-started/server-and-client-components)

### Browser and TypeScript baseline

- Baseline defines interoperable availability across a core browser set. “Widely available” is a
  rolling 30-month threshold, while year or date targets provide reproducible compatibility
  claims. [Baseline model](https://web-platform-dx.github.io/web-features/web-features/),
  [Browserslist Baseline queries](https://github.com/browserslist/browserslist/blob/main/README.md)
- Baseline describes platform-feature availability, not accessibility or assistive-technology
  coverage. Downstream browsers are mapped best-effort and still need testing when material.
  [Baseline supported browsers](https://web-platform-dx.github.io/web-features/supported-browsers/)
- TypeScript 6 is the stable compatibility bridge to the native TypeScript 7 compiler. TypeScript
  7 is released, but some embedded-language and programmatic-API tooling still relies on TypeScript 6. [TypeScript 6 release](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/),
  [TypeScript 7 release](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)

## Conflicts and Limitations

- Official Node guidance generally favors one JavaScript format; Vite's compatibility-oriented
  library example emits both ESM and CommonJS. The appropriate choice depends on the consumers this
  library promises to support.
- React publishes a current line and archived previous documentation rather than a conventional
  support matrix. React Aria's wide peer range does not prove equal upstream testing or maintenance
  for every React major.
- A Baseline query does not replace direct browser, keyboard, screen-reader, high-contrast, or
  reduced-motion testing.
- TypeScript 7's current tooling limitation is explicitly temporary, so the implementation should
  test a declared compiler range rather than encode assumptions about the transition indefinitely.

## Implications

- A single tree-shakeable public package is compatible with the accepted private-foundation and
  canonical-contract architecture.
- The package can expose only `.`, `./styles.css`, and generated agent-facing metadata while keeping
  implementation modules private.
- Choosing ESM-only avoids dual-package and dual-declaration complexity; choosing dual output buys
  require-only tool compatibility at that cost.
- Supporting React 18 and 19 permits the same React Aria SSR path without legacy `SSRProvider`.
- SSR support should mean renderable HTML with deterministic hydration and locale, not React Server
  Component compatibility for interactive exports.
- A pinned Baseline target and tested TypeScript range make compatibility claims reproducible.

## Remaining Judgment

Whitney must choose whether older require-only tooling is in scope, whether React 18 remains a
supported peer beside React 19, and how conservative the fixed browser and TypeScript floor should
be.
