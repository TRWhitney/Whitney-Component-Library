# 01 Package, Provider, and Contract Spine

**What to build:** A packable ESM library with the appearance/accent provider, static style entry,
canonical contract schema, and generated manifest and agent index working end to end.

**Blocked by:** none

**Status:** completed

- [x] A clean consumer can install the packed artifact and import the provider from the root entry.
- [x] The provider applies typed light/dark appearance and an application accent while deriving
      internal accent roles without exposing general token replacement.
- [x] Static styles load only through the documented explicit stylesheet subpath.
- [x] The package exposes only `.`, `./styles.css`, `./manifest.json`, and `./agent-index.md`.
- [x] React and React DOM are external peers at the accepted range; React Aria remains private.
- [x] One canonical provider contract generates valid human-facing data, manifest data, and the
      compact agent index without hand-maintained duplication.
- [x] Contract validation rejects missing required guidance and invalid export references.
- [x] React 18.3 and 19 can server-render and hydrate the provider without warnings or mismatches.
- [x] Public declarations compile under TypeScript 5.9, 6, and 7.
- [x] The packed browser entry contains no Node-only API dependency.

## Accepted sources

- [Specification](../spec.md)
- [Style and Theme Contract](../decisions/02-style-and-theme-contract.md)
- [Agent-Facing Contract](../decisions/04-agent-contract.md)
- [Distribution and Compatibility Contract](../decisions/09-distribution-and-compatibility.md)
- [Component Library Context](../../../CONTEXT.md)

## Completion evidence

- `npm run check` passes the provider, hydration, canonical-contract, package-surface,
  browser-safety, public-example, generated-documentation, and TypeScript 5.9/6/7 checks.
- `npm run verify:package` installs the packed artifact in clean React 18.3.1 and 19.2.8
  consumers and verifies SSR, hydration, public types, the four exported subpaths, internal-path
  encapsulation, private React Aria declarations, explicit CSS loading, and successful Vite
  browser builds.
- Owned distribution JavaScript is rejected if it imports Node built-ins, references unbound Node
  globals, or imports CSS. Consumer bundles are rejected if they retain a Node module import or
  Vite browser-external shim; the verifier deliberately does not interpret control flow inside
  bundled third-party fallback code.
- `src/contracts/appearance-provider.contract.ts` is the one authored provider contract;
  `npm run build` derives `docs/components/appearance-provider.md`, `dist/manifest.json`, and
  `dist/agent-index.md`, while `npm run check:generated` detects stale human documentation.
- The applied interface direction is the accepted Focus + Rail + Momentum + Route system under
  continuity without conflation. Ticket 01 owns only the provider scope and static theme roles;
  component rendering and interaction remain with their component tickets.
