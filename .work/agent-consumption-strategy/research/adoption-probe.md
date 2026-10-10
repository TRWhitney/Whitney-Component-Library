# Native and library adoption experiment

## Question and result

Can the current library support a compact implementation with consumer-owned layout and domain
behavior? Separately, would small styling extensions preserve a bespoke control treatment?

The current API supports native form validation, submission, reset, and separate immediate settings
without custom draft/error state. It also supports a consumer-defined board alongside library
controls. These cases preserve application breadth without new library composites.

A separate temporary styling patch changes control appearance but does not reproduce all geometry.
It is not needed to establish the clarified application-breadth requirement. No change to the
production styling contract is proposed from that experiment.

These are coordinator-authored capability probes, not independent agent trials, a mathematically
minimal implementation, or an accepted visual direction. They cannot establish authoring-token
savings or general application coverage.

## Artifact and execution

Source lives in [adoption-probe](../prototypes/adoption-probe/). It uses the repository's React,
TypeScript, Vite, and Playwright installations and current built `dist/`. Run `npm run build` first
if no build exists, then:

```sh
node .work/agent-consumption-strategy/prototypes/adoption-probe/run.mjs
```

The runner copies fixture files into a temporary directory, typechecks them, and starts Vite on
127.0.0.1 port 4391. `PROBE_PORT` can select another free port. Its temporary library copy adds
class attachment only for the styling experiment; the ordinary library and board routes still
use the unchanged current build. Vite aliases refer to these built files, so this is not an
independent package-installation check. No production source is patched.

Open these paths at the printed origin:

- `/?variant=native` for native preferences.
- `/?variant=library` for library preferences with the same outer layout and state code.
- `/?board` for the custom movement sandbox.
- `/?style&variant=native`, `/?style&variant=current`, and `/?style&variant=extended` for the
  separate control-styling comparison.

Add `&identify` to reveal stable region names on hover or focus. Those names are `page`, `editor`,
`summary`, `form`, `game`, `board`, `game-controls`, and `style-probe`. Controls also have accessible
names. Stop the server with Ctrl+C.

With the server running, collect fresh browser observations in another terminal:

```sh
node .work/agent-consumption-strategy/prototypes/adoption-probe/check.mjs http://127.0.0.1:4391 /tmp/wcl-adoption-evidence
```

The checker writes new JSON results and screenshots to the supplied temporary directory.
Historical results and images were removed under the
[retention policy](../../../docs/research/agent-evidence-retention.md). The findings below remain;
a rerun measures the current built package rather than reproducing the old captures.

## Preferences

Both implementations share `usePreferences` and Frame as consumer-owned fixture code. Neither
is a proposed public export. State contains only the immediate desktop toggle and the saved digest.
Submission reads FormData. The browser owns field values, required/email validation, and reset.
Reset restores the form defaults while preserving the saved summary and immediate setting.

At both 390px and 1280px, checks verify keyboard switch/radio changes, valid saving, rejection of
invalid and empty email, separation of draft from saved values, reset, and no horizontal overflow.
The checker waits for the reset validation state to settle before capturing evidence. An initial
switch pointer check targeted the visually hidden native input; the final check uses keyboard
activation. That evaluator correction changed no app code.

The outer grid is identical: one 350px column at 390px, and columns of approximately 582px and
364px within a 986px grid at 1280px. Controls retain their respective native/custom CSS or library
appearance. This is not a pixel-equivalent comparison of control styling.

Recorded source counts use Prettier-formatted characters:

| File                              | Characters | Nonblank lines |
| --------------------------------- | ---------: | -------------: |
| Native control composition        |      1,480 |             49 |
| Library control composition       |      1,319 |             46 |
| Shared state and page composition |      1,730 |             52 |

Including shared code gives 3,210 native characters and 3,049 library characters, about 5% less.
This metric excludes CSS, bootstrap, and evaluator code. It measures only the retained composition
and shared logic, not whole-app savings. Both versions are compact because native HTML already
supplies most required form behavior. The original agent outputs included more styling, copy,
and optional behavior; their sizes are not directly comparable to these reference implementations.

## Board application

The consumer owns the sixteen cells, legal-move calculation, keyboard focus movement, piece
position, and undo history. Native cell buttons keep arbitrary application handlers and refs.
Existing library Button, Switch, and Dialog components provide surrounding actions and rules.
There is no board-game schema, library board component, or application template.

At both widths, the checks exercise keyboard movement, ignoring an illegal destination, undo,
hiding legal-move markers, opening/dismissing the rules dialog, and focus return to its trigger.
All pass without horizontal overflow or browser exceptions. This proves one custom composition
works. It does not verify drag/drop, canvas/WebGL, multiplayer synchronization, every cell path,
or a complete game's accessibility.

The fixture deliberately uses a library Button as the rules trigger. The separate
[API probe](api-probe.md) records the narrower limitation that native buttons cannot participate
as Dialog triggers under the current contract.

## Styling experiment

The temporary copy adds Button `className` and TextField classes for root, label, control, and
input. The native reference uses a horizontal label, underlined input, and square action button.
The current components keep their own vertical field arrangement and default styling. The patch
reproduces the reference input dimensions, input typography, and button dimensions/colors at both
widths, but the label differs by 2px vertically and the button by 12px. The unchanged field support
structure and layout rules still affect geometry.

The experiment does not validate all interactive, disabled, invalid, forced-color, or dark states.
It does not establish that class attachment alone is a supported full styling contract. After
Whitney clarified application breadth, further refinement of this restyling experiment stopped.
It remains isolated evidence for the earlier suggestion, with no accepted API or visual outcome.
