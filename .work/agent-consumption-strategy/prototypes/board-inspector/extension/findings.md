# Controlled Dialog focus experiment

Research prototype only. This is evidence for a planning decision, not an accepted API or production change.

The bounded question is whether the existing Dialog can support a native consumer-owned opener and return focus to a consumer DOM ref after the inspected piece moves, without a dummy library trigger or a new public component.

The experiment supports that possibility. `dialog.tsx` preserves the existing triggered branch and adds a controlled branch with required `isOpen`, `onOpenChange`, and `returnFocusRef`. The controlled branch reuses `TaskOverlayContent`, the existing style attributes, React Aria modal rendering, focus containment, dismissal, and labeling. Consumers own the opener and supply a focusable element through the ref. They update that ref when their domain action changes the desired return location.

## Mechanism and evidence

The installed `react-aria-components` 1.20.0 standalone ModalOverlay accepts controlled state without DialogTrigger. Its public props do not include a return-focus target. See `node_modules/react-aria-components/dist/types/src/Modal.d.ts` and `node_modules/react-aria-components/dist/private/Modal.js`.

The installed `react-aria` 3.51.0 FocusScope restores focus in an animation-frame callback after unmount, only when focus remains on the document body. It searches for a connected original opener. See `node_modules/react-aria/dist/private/focus/FocusScope.js`, lines 524-570. The experiment uses this behavior without importing private APIs.

An overlay ref detach callback queues one microtask. The task waits for DOM removal and focus containment cleanup, then resolves the latest `returnFocusRef.current` and focuses it when connected. It skips ref callbacks caused by a still-connected or immediately remounted overlay. If the target is absent or cannot take focus, React Aria retains its normal original-opener fallback. No animation-frame retry loop is added.

On 2026-09-26, `node .work/agent-consumption-strategy/prototypes/board-inspector/extension/verify.mjs` passed against the current built package in headless Chromium with React 19 StrictMode and the package stylesheet. It checks:

- Strict TypeScript compilation of the replacement with exact optional properties.
- A native HTML button opens the dialog and the library close button receives initial focus.
- Forward and backward Tab sequences remain inside the dialog.
- Escape and the close button return focus to the supplied target.
- Replacing the target DOM node and closing in the same state update focuses the new target.
- Removing the target and closing returns focus to the still-connected original opener.
- The existing triggered Dialog still opens and returns focus on Escape.
- No browser page errors.

`verify.mjs` builds a disposable fixture outside the repository, copies the existing `dist`, transpiles the replacement, and removes the fixture after verification. It requires an existing build and the installed Playwright Chromium browser. `fixture.tsx` retains the exercised consumer code.

## Temporary package integration

Transpile `dialog.tsx` as ES2022, ES modules, React JSX into the temporary package's `dist/overlays/dialog.js`. Copy `dialog.d.ts` alongside it. Relative imports deliberately match the production module location.

In the temporary package's `dist/overlays/index.d.ts`, remove `DialogProps` from the export list sourced from `overlay-types.js` and add `export type {DialogProps} from './dialog.js';`. The root index already reexports DialogProps through that overlays index, so it needs no change. Keep the original `overlay-types.d.ts` intact because the replacement type uses its triggered Dialog type. No runtime index change is needed.

## Consumer documentation snippet

```tsx
const [isInspectorOpen, setInspectorOpen] = useState(false);
const inspectedPieceRef = useRef<HTMLButtonElement>(null);

<button ref={inspectedPieceRef} onClick={() => setInspectorOpen(true)}>
  Inspect piece
</button>
<Dialog
  title="Piece inspector"
  description="Inspect or move this piece."
  closeLabel="Close inspector"
  isOpen={isInspectorOpen}
  onOpenChange={setInspectorOpen}
  returnFocusRef={inspectedPieceRef}
>
  {inspectorContent}
</Dialog>
```

Keep the ref attached to the desired focusable DOM node after moves. The dialog reads its current value when the modal leaves the DOM. If the target is gone, the original connected opener remains the fallback. Existing calls that supply `trigger` keep their existing behavior. Triggerless use requires controlled state and a return-focus ref.

## Limits and remaining decisions

This experiment covers one standalone dialog in Chromium. It does not establish behavior for nested modals, overlapping close/open transitions, React 18, Firefox, WebKit, scoped RTL direction, or a removed opener and missing target together. Scoped direction currently comes from the document after portal rendering; the controlled branch does not infer it from the consumer ref. Existing triggered behavior still uses the original direction handling.

The mechanism relies on the inspected React Aria version's focus-restoration scheduling, although it uses only public component props and standard DOM operations. A production change would need supported-version coverage and an explicit policy for competing focus changes while closing. The experiment does not authorize changing production Dialog, exports, generated documentation, or showcase content. Those changes would be part of an accepted implementation task.
