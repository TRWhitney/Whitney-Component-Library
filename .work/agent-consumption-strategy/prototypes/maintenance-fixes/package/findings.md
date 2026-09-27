# Package maintenance prototype

The candidate removes the repeated internal directive warnings and makes the existing Button
activation target usable in TypeScript. It changes a disposable package copy. No production
source, app configuration, warning handler, or runtime event wrapper changed.

`patchPackage(stagingDir)` is the named async export in [patch-package.mjs](patch-package.mjs).
Supply a directory containing the current `package.json` and `dist/`. It returns the changed
declaration path, callback signature, removed-directive paths, retained root boundary and
`runtimeChanged: false`. The function intentionally expects an unpatched current package.

## Event contract

The candidate exports a library-owned `ButtonPressEvent` through the existing type indexes.
`onPress` accepts that event and still accepts callbacks with no parameters. The supported fields
are readonly `target: HTMLButtonElement`, `type: 'press'`, `pointerType` with mouse, pen, touch,
keyboard and virtual values, and boolean Shift, Ctrl, Alt and Meta modifier flags. The callback
receives the unchanged underlying event. Its other fields and methods are outside this prototype
contract.

The current Button already forwards `onPress` to its native-button React Aria component.
The installed React Aria `usePress` implementation sets the event target to the button handler's
`currentTarget` and constructs `type: 'press'` before calling `onPress`. Its shared event
declaration supplies the five pointer types and modifier fields. A dependency-type import would
violate the existing package verifier's ban on exposing the private React Aria foundation, so the
candidate owns this small contract.

The Button manifest event description and one example now show `event.target.focus()`.
The broad agent index does not need a new entry because this is a type and existing component
contract change.

## Checks

[verify.mjs](verify.mjs) produced [evidence.json](evidence.json).

- The unchanged retained initial Trail app passes typechecking and production builds with both
  packages. Its generated JavaScript and CSS have identical filenames and SHA-256 hashes.
- Strict TypeScript with `skipLibCheck: false` and `exactOptionalPropertyTypes: true` accepts
  inferred and explicitly typed event targets and existing no-argument callbacks. It rejects a
  native MouseEvent callback.
- Chromium 149 activates the nested label by pointer, Enter, Space and Shift+Enter. Each callback
  receives the rendered BUTTON as its target and focuses it. The last event carries Shift.
  Disabled and pending buttons remain inert; the no-argument callback runs once. No page error
  occurs. Pen, touch and assistive-technology virtual input were inspected in dependency types
  and implementation but were not exercised in this browser probe.
- Both packages pass the repository's existing broad React 19.2.8 server-render/JSDOM hydration
  fixture, including its operational checks. This verifies those React DOM flows, not an RSC
  boundary compiler or every supported React version.
- The candidate replaces 67 internal directives with equal-length spaces. Runtime JavaScript
  otherwise remains byte-for-byte unchanged. All `.js.map` files remain unchanged and generated
  line and column positions are preserved. Root `dist/index.js` retains its original directive
  and bytes. CSS remains unchanged.

With the original lifecycle toolchain, Vite 8.2.1 and Rolldown 1.2.11, build output falls from
67 warnings and 46,229 characters to one warning and 993 characters. The remaining warning is for
the deliberately retained public root directive. These are output measurements, not agent-token
savings. Repository-local Rolldown 1.2.4 emits zero warnings for either package despite the same
Vite version. Record the actual transitive toolchain when comparing agent runs.

## Limits and reproduction

The public JavaScript export map exposes only the root, and its client boundary is preserved.
No Next.js or react-server-dom compiler/runtime is installed in the checked local dependency
sets. The available release integration script drives browser applications. Neither it nor the
React DOM hydration fixture proves actual React Server Component boundary compatibility. That
specific framework build remains unverified.

This prototype patches generated declarations directly. Production work must update the source
contract, regenerate declarations and declaration maps, update the human-facing component
examples, and run the production checks. The copied declaration maps are not regenerated here.

Run from the repository root:

```sh
node .work/agent-consumption-strategy/prototypes/maintenance-fixes/package/verify.mjs /tmp/wcl-lifecycle-LTHbbR/library-required/node_modules
```

The optional argument selects an installed tooling/dependency directory. Omitting it uses the
repository's `node_modules`, which currently contains Rolldown 1.2.4 and cannot reproduce the
historical warnings. The script uses repository JSDOM if the chosen authoring dependencies omit
it. It creates disposable consumers under `/tmp`, preserves their complete build logs, and writes
the result to `evidence.json`. ESLint, Prettier and `git diff --check` passed for this prototype.
