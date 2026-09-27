# Open composition and agent effort

## Question and boundary

Which changes could reduce agent effort without restricting the kinds of applications consumers
can build? Investigate familiar APIs, customization, optional code generation, structured
selection, diagnostics, and a careful reference implementation. New public composite components,
application shells, and prescribed application templates are excluded.

Whitney clarified that customization means application breadth. A consumer must be able to build
an unfamiliar application, such as a board-game simulator, using its own composition and behavior.
This does not establish a requirement to override every component's typography, shape, or spacing.
The existing visual contract remains in place during this investigation.

## Conclusion

The strongest evidence supports improving control interoperability and fixing specific API costs.
It does not support wholesale native-prop renaming, broad restyling, or a general intent-to-UI
compiler. Optional focused lookup is feasible. Fragment generation and diagnostics have narrower
benefits than the earlier proposal suggested.

The library already permits ordinary React and native controls alongside its components. A small
board interaction works without a board template or a new runtime component. The missing abilities
appear where consumer behavior needs to address a library control or participate in an overlay.
That is a more precise problem than insufficient component coverage.

No fresh agent-authoring trials were run. These experiments establish capabilities and limitations,
not new token-savings results. The original pilot still does not demonstrate lower total tokens.

## What changed from the earlier suggestions

| Suggestion                                     | Finding                                                                                                                                                               | Recommendation                                                                                           |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Rename APIs to resemble HTML                   | No pilot repair implicated `onPress` or value-shaped `onChange`. Both abstractions work and value callbacks remove adapters.                                          | Retain them. Investigate observed mistakes instead of assuming familiar spelling is cheaper.             |
| Add general classes, styles, and styling slots | Temporary classes can reproduce some control geometry and styling. They do not guarantee identical layout, and component reskinning is not the clarified requirement. | Do not broaden the visual contract as part of this direction.                                            |
| Make simple uses require less knowledge        | A careful form needs only immediate-setting state and saved-result state. Native validation, FormData, and reset already work with the library.                       | Publish concise examples of existing capabilities; avoid introducing a form framework.                   |
| Improve refs, attributes, and events           | Sampled components reject control refs and domain handlers. Hyphenated data and ARIA props compile but disappear.                                                     | Prioritize a bounded DOM interoperability contract that preserves owned semantics.                       |
| Generate editable fragments                    | A small valid fragment can be emitted, but its generated source remains consumer code and still needs adaptation.                                                     | Keep optional. Compare it with an equally good static example before supporting a generator.             |
| Select components from structured requirements | The prototype returns small answers, asks for missing facts, and abstains on a game move target. Selection rules require authored metadata.                           | Prefer focused retrieval first. Add executable choice rules only where they remove repeated uncertainty. |
| Diagnose misuse                                | The prototype catches private-selector use, but misses semantic misuse and cannot prove provider ancestry.                                                            | Target high-confidence local findings and state uncertainty. Do not present a clean scan as correct UI.  |
| Compile broad application intent into React    | Feasible only with a maintained language for bindings, callbacks, state, layout, and custom content. External precedents do not supply a general compiler.            | Do not pursue now. Keep React as the consumer's unrestricted composition language.                       |

## Reproduced integration costs

The [API probe](api-probe.md) checked 53 expected positive and negative type cases plus browser
behavior. Stack, TextField, Button, and Checkbox reject `id`, `ref`, `onBlur`, `onPointerDown`, and
`onKeyDown`. Their implementations ignore unsupported props supplied through JavaScript.
TypeScript permits unknown hyphenated JSX attributes, so `data-consumer` and `aria-description`
compile but vanish at runtime in these samples. A consumer cannot rely on compilation to reveal
this mistake.

A native button used as a Dialog trigger compiles and then throws. A consumer React component
returning a library Button works. The relevant distinction is participation in the library's
trigger registration, not whether the application introduces a React component boundary.

Native buttons inside Stack retain their own events, and Field permits a native input with a ref
and custom attributes. These are useful existing composition paths. Adding unrestricted HTML prop
spreading would also let consumers override accessibility and interaction state, so it is not a
ready-made fix. Root-versus-control targeting, ref ownership, event ordering, and owned ARIA fields
need explicit decisions.

The pilot recorded actual repairs for mapped SegmentedControl options losing tuple shape and
Spinner requiring `isActive`. These are better simplification candidates than renaming callbacks.
Minimum-option guarantees and Spinner's persistent inactive state must be understood before
changing either API. See the probe report for the trace locations and source declarations.

## Reference implementation and novel application

The [adoption experiment](adoption-probe.md) uses the same consumer-owned page composition and state
logic for native and library preferences. Both pass submission, validation, reset, keyboard, and
viewport checks. The library version requires no custom validation, draft state, or form component.
It preserves the outer column geometry while rendering the library's own controls.

The native composition contains 1,480 formatted characters and the library composition 1,319.
Including the identical 1,730-character state and frame module gives 3,210 versus 3,049, about 5%
less JSX/TypeScript. This is a small difference. It excludes CSS and bootstrap code, and does not
compare identical control appearance or complete accessibility coverage. It is a reference, not a
proved lower bound or a new agent result. Simple native forms already provide much of this behavior.

The same fixture includes a consumer-defined board with legal moves, keyboard movement, undo,
state visibility, and a library Dialog for rules. Checks pass at 390px and 1280px. The application
owns its board and rules; library components supply ordinary surrounding controls. This is one
interoperability example, not proof that every custom interaction works.

A library benefit should be evaluated on capabilities it actually supplies. For a board game,
that can include settings, menus, dialogs, and history presentation while game rules and rendering
remain application code. Counting native board cells as missed component reuse would reward the
wrong behavior.

## Tooling evidence and limits

The [tooling experiment](tooling-probe.md) implements a bounded selector, a RadioGroup fragment,
and a source audit. It demonstrates focused output far smaller than the full index. That comparison
measures printed characters for different coverage, not total authoring tokens. Discovery,
command-schema learning, repeated queries, and correction remain costs. The selector's rules
cannot be extracted automatically from the current prose contracts with guaranteed meaning.

The board-game input returns `outside-scope`. A submitted acknowledgement implemented as a Switch
still compiles and passes the prototype's narrow audit. Those cases establish why tools must stay
optional and why semantic claims must be limited. No tool may make its vocabulary the supported
vocabulary of applications using the library.

External examples confirm mechanisms, not measured savings:

- Chakra can add component snippets through a CLI. Consumers own copied snippets and choose when
  to update them; forced updates can overwrite edits. [CLI](https://chakra-ui.com/docs/get-started/cli)
  and [update behavior](https://chakra-ui.com/guides/snippet-how-to-manage-updates).
- shadcn provides registry search and retrieval APIs. These are precedents for bounded lookup,
  not evidence of correct semantic selection for arbitrary application requests.
  [Registry API](https://ui.shadcn.com/docs/registry/api-reference).
- Svelte exposes documentation retrieval and analysis as regular CLI subcommands as well as MCP
  tools. An installed-package helper need not require an external agent integration.
  [CLI](https://svelte.dev/docs/ai/cli).
- Storybook extracts manifests with props, imports, and examples. Its current manifest schema is
  explicitly unstable preview. The relevant mechanism is build-time extraction; adopting that
  schema or adding Storybook is unnecessary for this library.
  [Manifests](https://storybook.js.org/docs/ai/manifests).
- json-render's code export is explicitly project-specific. Its utilities traverse and serialize
  a specification; the consuming project supplies the generator.
  [Code export](https://json-render.dev/docs/code-export).

These sources supply no controlled evidence that the proposed adaptations reduce agent tokens.
A CLI is a delivery mechanism, not an efficiency result.

## Recommended direction

Make partial adoption reliable. A consumer should be able to use library controls alongside its
own board, canvas, editor, layout, and state without depending on private DOM structure or
misrepresenting the interaction as a supported template.

The next implementation proposal should define safe control targeting and application event
integration, and address the observed option-array and Spinner friction where justified. Keep the
visual contract and useful value/press callbacks. Make ordinary examples show native form behavior
and native/custom composition explicitly.

For guidance, compare a small batchable lookup against focused static references before building
a selector or generator. The strongest tool candidate retrieves the exact usage needed for named
components with minimal output. It can reuse canonical metadata without introducing a second
application-description language. Any diagnostic should add information beyond TypeScript and
avoid unsupported automatic rewrites.

A subsequent bounded agent comparison should include extending an existing unfamiliar application,
such as changing the board's controls while preserving its game logic, plus a task where the library
owns substantial behavior. Hold the consumer design and acceptance checks fixed. Count all generated
source, all discovery/tool costs, and valid native fallbacks. This remains a proposed comparison;
no further trials or implementation are started by this report.

## Remaining decisions

The investigation does not select a new public API. The exact ref/attribute/event ownership and
support for consumer overlay triggers need a small accepted contract before implementation.
Optional tool adoption also remains open. The user has excluded new composites and application
templates, and that exclusion overrides earlier recommendations to pursue them.
