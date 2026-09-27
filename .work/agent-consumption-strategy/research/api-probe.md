# API compatibility probe

## Question and result

Which unfamiliar APIs impose demonstrated adoption costs, and which provide useful behavior?
The bounded investigation covers public built types and runtime behavior for Stack, TextField,
Button, Checkbox, Field, and Dialog. It also checks existing pilot traces for actual mistakes.
It does not propose application templates, composites, a new styling contract, or a production
API change. The stopping condition was reproducible positive and negative checks for attributes,
events, refs, native composition, and trigger composition, plus inspection of all six library
pilot traces.

The clearest gaps concern access to the actual DOM control and behavior-specific composition.
They do not establish that unfamiliar callback names caused the pilot results. The value callbacks
and press abstraction remain useful. Native composition already works in structural containers,
but a native control cannot currently participate as a Dialog trigger.

The user's clarification makes application breadth the relevant issue. A board game can own its
board, pieces, pointer behavior, keyboard behavior, and state inside consumer React components.
These probes do not show a need for a board-game component family or a general styling API.

## Reproduction

From the repository root, with its existing dependencies and built `dist/` present, run:

```sh
node .work/agent-consumption-strategy/prototypes/api-probe/probe.mjs
```

The [probe](../prototypes/api-probe/probe.mjs) imports the public package name for its TypeScript
checks. Package self-reference resolves the declarations in `dist/`. Its browser fixture aliases
the same package name to `dist/index.js` and loads `dist/styles.css`. It does not import private
component implementations or modify production code. It starts Vite on an available local port,
uses installed Playwright Chromium, then closes both processes.

The [recorded result](../prototypes/api-probe/results.json) contains 53 expected positive or
negative type checks under TypeScript 5.9.3 with strict checking and exact optional properties.
All expectations passed. The [browser fixture](../prototypes/api-probe/fixture.jsx) deliberately
uses JavaScript to observe unsupported props after bypassing the type boundary. Its negative
native-trigger case intentionally logs a React error caught by its own error boundary.

## Concrete findings

| Check                                                                              | Result                                                                                    | Consequence                                                                                                                 |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `id`, `ref`, `onBlur`, `onPointerDown`, `onKeyDown` on the four sampled components | Rejected by public types                                                                  | Consumers cannot address, focus, measure, or attach these handlers directly through these APIs.                             |
| `data-consumer` and `aria-description` in JSX on the same components               | Accepted by TypeScript, discarded at runtime                                              | Compilation does not establish that arbitrary hyphenated attributes reach the DOM.                                          |
| Forced `id`, `ref`, `className`, `style` through JavaScript                        | No consumer IDs, classes, or styles appeared; all four refs stayed null                   | Unsupported props are ignored, not passed through. This is an observation, not a request to loosen owned styles.            |
| Button `onClick`                                                                   | Type error                                                                                | A native handler cannot be moved over unchanged.                                                                            |
| Button `onPress`                                                                   | Mouse, Enter, Space, and touch each invoked the callback once                             | The abstraction works across these input methods.                                                                           |
| Native button `onClick` inside Stack                                               | The same four activations worked                                                          | Native buttons already cover ordinary accessible activation. `onPress` is not required merely to make Enter and Space work. |
| Native button pointer and key handlers inside Stack                                | Two pointer-down and two key-down events arrived                                          | Consumer-owned interaction works inside the structural container.                                                           |
| TextField `onChange`                                                               | Receives a string; event-shaped access fails typing                                       | Direct state setters need no `event.target.value` adapter.                                                                  |
| Checkbox `onChange`                                                                | Receives a boolean; event-shaped access fails typing                                      | The callback reports the selected state directly.                                                                           |
| Field with native input                                                            | Input ref and custom data attribute survived; field remained named                        | The existing custom-control composition supplies an escape path for inputs.                                                 |
| Native form props                                                                  | Names, form association and submit props accepted; text name/autocomplete observed in DOM | Native form integration already exists. No library Form component is needed to supply these capabilities.                   |
| Dialog with consumer component returning Button                                    | Opens correctly                                                                           | Consumer React abstraction boundaries are supported.                                                                        |
| Dialog with native button trigger                                                  | Compiles, then throws a runtime TypeError                                                 | The trigger contract requires library action registration, not just a valid interactive native element.                     |
| Mapped segmented options                                                           | Ordinary `.map()` array rejected; literal options accepted                                | Minimum-length tuple requirements impose an actual construction cost.                                                       |

TypeScript explicitly permits unknown JSX attributes whose names are not valid JavaScript
identifiers. This explains why an omitted `data-*` prop does not produce the same diagnostic as
an omitted `id`. See the [TypeScript JSX handbook](https://www.typescriptlang.org/docs/handbook/jsx.html).
The wrapper implementations destructure known props and do not spread a remainder, which explains
their disappearance. See [Stack](../../../src/layout/stack.tsx),
[TextField](../../../src/fields/text-field.tsx),
[Button](../../../src/actions/button.tsx), and
[Checkbox](../../../src/choices/checkbox.tsx).

React Aria's press handling has broader semantics than a callback rename. It handles pointer,
keyboard, screen-reader, and touch behavior, including press cancellation and focus normalization.
See [usePress](https://react-aria.adobe.com/usePress). This probe verified only the four listed
activations, not scrolling cancellation or assistive technology. The library's public callback
is narrower than the underlying implementation. [ButtonBaseProps](../../../src/actions/button.tsx)
declares `onPress?: () => void`, although the runtime forwarded a React Aria event, allowing this
JavaScript-only probe to record its `pointerType`. Typed consumers cannot request an event
parameter through that declaration. Do not depend on the extra runtime argument as a public API.

The exact form capabilities are declared in
[NativeTextInputProps](../../../src/fields/field-types.ts),
[ButtonBaseProps](../../../src/actions/button.tsx), and
[ChoiceStateProps](../../../src/choices/choice-types.ts).
This probe does not repeat the separate native/library form adoption experiment or claim to
have verified every submit, reset, or validation interaction.

Field's custom control must apply the supplied control props and meet the existing runtime
relationship checks. It is not arbitrary content inside a label. See
[Field](../../../src/fields/field.tsx) and
[control validation](../../../src/fields/field-control-validation.ts).
Dialog's restriction comes from
[OverlayTriggerBoundary](../../../src/overlays/overlay-frame.tsx), which verifies registrations
from library Button or IconButton. The test preserves the distinction in
[ADR 0010](../../../docs/adr/0010-preserve-consumer-composition-boundaries.md) between ordinary
composition and participation in owned behavior.

## What the pilot actually demonstrates

I inspected all completed command failures and repair commands in the six library traces.
No trace showed an `onClick` to `onPress` repair or an event-shaped to value-shaped `onChange`
repair. That absence does not prove those APIs are free to learn. It means these traces cannot
support a claim that these spellings caused the measured cost.

| Trial evidence                                                      | Observed mistake or repair                                                                                 | Supported interpretation                                                                                                                                                              |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [baseline-3](pilot/baseline-3/events.jsonl), repair at line 22      | Named accent color rejected, chart formatter assumed a string, Spinner omitted `isActive`                  | These APIs required correction. The chart formatter type and Spinner state are distinct costs.                                                                                        |
| [improved-3](pilot/improved-3/events.jsonl), repair at line 22      | Mapped segmented options lost tuple shape and useful value inference; Spinner again omitted `isActive`     | Tuple construction and the required Spinner flag caused concrete rework.                                                                                                              |
| [baseline-1](pilot/baseline-1/events.jsonl), repair at line 22      | Browser check expected `aria-checked`; changed to native checked-state inspection                          | Test author assumed the wrong DOM representation. This was not a component-prop repair.                                                                                               |
| [improved-1](pilot/improved-1/events.jsonl)                         | Playwright's radio `.check()` could not click through the rendered label                                   | Automation interaction cost, with no demonstrated `onChange` misunderstanding.                                                                                                        |
| [improved-2](pilot/improved-2/events.jsonl), replacement at line 33 | Nested edit activation failed during keyboard checks; agent replaced the library Table with a native table | Actual fallback happened. The trace alone does not isolate the table defect or prove a general API naming problem.                                                                    |
| [improved-2](pilot/improved-2/events.jsonl)                         | Added a native wrapper ref, queried its second button, and focused it after closing the alert              | Concrete use of DOM traversal to restore focus. A public control ref could avoid that selector, but the trace does not establish that missing refs caused the original focus failure. |

## Implications and boundaries

Retain `onPress` and value-shaped `onChange` unless stronger evidence justifies changing their
contracts. The higher-priority investigation is a bounded DOM interoperability contract for
library controls: stable targeting, refs, safe data attributes, and the events genuinely needed
for application behavior. Adding every HTML attribute indiscriminately would allow consumers to
override the accessibility and interaction properties the components currently own.

Separate application interaction from library behavior participation. Native controls can already
live inside structural containers, and Field can label a custom native input. Consumers may own
application-specific interaction this way. Where a consumer control must become an overlay trigger,
the current restriction is real. Any extension would need to preserve press handling, focus
restoration, disabled state, and the accessible trigger relationship. A component-name alias or
new template would not resolve that restriction.

Investigate dynamic option arrays and the Spinner active flag as specific simplification
candidates because the pilot records actual repairs. The option tuple enforces minimum cardinality,
so relaxing it would need an explicit runtime policy for zero or one options. These observations
do not approve a particular replacement API.

The style restrictions remain consistent with
[ADR 0002](../../../docs/adr/0002-own-styles-and-bound-theming.md). Application breadth does not by
itself require exposing `className`, `style`, arbitrary spacing, or internal tokens. No such change
is recommended or accepted here.

This is a small compatibility experiment, not a new coding-agent trial or a broad accessibility
audit. It samples four component families and one overlay with installed Chromium, React 19,
and the current built library. It does not establish every family's behavior, native mobile
behavior, assistive-technology behavior, or causal effects on agent time and token usage. The
remaining product decision is which direct-control integration capabilities the library should
promise while preserving its owned behavior and visual contract.
