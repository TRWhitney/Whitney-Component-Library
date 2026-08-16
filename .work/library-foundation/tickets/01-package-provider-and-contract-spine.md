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

- `npm run check` passes public provider, hydration, canonical-contract, package-surface,
  browser-safety, type, canonical-example compilation, and generated-documentation checks (73
  tests).
- `npm run typecheck:matrix` builds the package and compiles a generated public-consumer fixture
  with TypeScript 5.9.3, 6.0.3, and 7.0.2.
- `npm run verify:package` packs and installs the actual artifact in clean React 18.3.1 and 19.2.8
  consumers, then verifies SSR, hydration, the four exported subpaths, internal-path
  encapsulation, private React Aria declarations, the full Node built-in/global exclusion gate,
  and explicit CSS loading through successful Vite browser builds.
- `src/contracts/appearance-provider.contract.ts` is the one authored provider contract;
  `npm run build` derives `docs/components/appearance-provider.md`, `dist/manifest.json`, and
  `dist/agent-index.md`, while `npm run check:generated` detects stale human documentation.
- The applied interface direction is the accepted Focus + Rail + Momentum + Route system under
  continuity without conflation. The foundation plan uses the accepted light and dark neutral
  fields, independent success/warning/danger colors, IBM Plex Sans and Mono roles, compact rounded
  geometry, and a 150 ms purposeful-motion baseline. Accent-derived focus and text roles retain
  readable contrast even for middle-luminance accents. Ticket 01 affects only the provider scope
  and static theme tokens; component rendering, rails, routes, and activity states remain for
  their owning tickets to render and inspect in light, dark, compact, forced-color, and
  reduced-motion states.

The first delivery review invalidated evidence for canonical example compilation, one-to-one
contract coverage, Node-only scanning, accent text/focus contrast, and consumer stylesheet loading.
Each gap was corrected and the complete validation matrix was rerun before the repeated delivery
review.

The repeated review found the browser-safety gate still omitted valid template-literal imports,
several Node globals, and the Vite-emitted browser bundle; private-type inspection stopped at the
root declaration facade; and the declared Node floor was lower than Vite 8's supported Node 22
floor. The final correction scans all declarations, covers the valid Node import/global forms,
inspects Vite bundles for retained or externalized Node modules, and declares Node `>=22.12.0`.
The last review cycle also aligned `jsdom` with that Node floor, extended text and focus contrast
across every owned surface, covered Node globals inside template expressions, verified forced-color
and reduced-motion rules, and compiled the packed declarations against both React type majors.
The closure review found that the claimed Node-global gate still depended on syntax-specific
regular expressions and that removed contracts could leave orphaned generated component pages.
The final implementation replaces that scan with syntax-aware import and identifier inspection,
covers qualified global-object access, and makes both generated-documentation checking and normal
generation reconcile obsolete Markdown pages against the canonical contract set.
Renewed package validation then exercised React's guarded scheduler fallback. The scanner now
distinguishes references protected by a matching `typeof` control-flow guard from required Node
globals, including chained and statement-level capability checks used by React, while the
library's own distribution remains subject to unconditional exclusion.
The final intent review found that the canonical schema still collapsed several specification
dimensions into broad arrays. The schema and generated guide now require explicit guidance for
parts, control behavior, events, validation and forms, keyboard and labeling behavior,
localization and directionality, accent and accessibility modes, and preferred higher-level
compositions. Focused tests reject omission of every added dimension.
The following review found that SSR occurred before warning capture and that syntax-aware global
detection did not distinguish lexical bindings. Consumer verification now captures both warning
channels before server rendering, and the scanner uses TypeScript binding information to permit
local names while continuing to reject unbound Node globals. Focused regressions cover both gates.
The next engineering review found valid import forms outside two checks. Syntax-aware inspection now
covers dynamic imports with options and all static or dynamic CSS module specifiers, protecting the
Node-free root and explicit-stylesheet-only contracts without relying on import formatting.
