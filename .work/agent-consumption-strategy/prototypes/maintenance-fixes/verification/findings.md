# Verification helper experiment

The prototype supports shipping one optional testing subpath with three functions. It removes
the need to reconstruct assertions or polling loops while preserving failures. It is research
code for the temporary package comparison, not an accepted production change.

## Evidence behind the scope

The initial trial's `item_11` command failed a single immediate focus assertion. Its retained
`checks/browser.mjs` changed to `waitForFunction` over one captured `elementHandle`. The maintenance
trace then recorded these failures in completed command output:

- `item_10` extracted `contrast` from `checks/visual.mjs` with `new Function`. The function used
  `assert` from its original module and threw `ReferenceError: assert is not defined`.
- `item_12`, `item_17`, `item_19`, and `item_21` timed out while checking focus.
  The source permits a check to advance from native dialog restoration before the application's
  queued `requestAnimationFrame` restoration completes. The final successful script added a 100ms
  delay before checking the Edit control and moving to Duplicate.
- `item_14` and `item_16` measured a Delete label at 1.087:1 during a theme transition. The
  subsequent script added a 300ms delay. Steady state passes at a minimum of 4.81:1.

The exact command IDs are indexes into the retained JSONL traces, not independent causal proof
for every timeout. In particular, the traces show captured handles but do not establish that a
detached handle caused a particular consumer failure. A replacement-target fixture establishes
that the proposed helper handles that failure mode. The focused-sample fixture establishes that
a transient initial match cannot immediately advance the check into the next action.

Sources are the `library-required-initial` and `library-required-maintenance` traces and final
snapshots under `research/pilot/lifecycle/`, and the independent `prototypes/lifecycle/check.mjs`
and `checker-notes.md`. No independent checker or recorded trial input was changed.

## Result

`testing.mjs` imports no runtime dependency. `testing.d.mts` uses structural types and compiles
against actual Playwright Page and Locator types. The proposed installed export is
`@trwhitney/component-library/testing`; the coordinator can copy the declarations to
`dist/testing.d.ts` and retain the runtime filename `dist/testing.mjs`.

The module keeps waiting separate from application actions. Focus is reacquired every sample.
The default requires three or more good samples spanning 80ms, separated by animation frames.
The visual wait observes pending/running animations and font loading until the same quiet
window holds. Polls have a 4-second default deadline and do not suppress evaluation errors.
Infinite animations fail instead of being disabled. The contrast assertion owns its check and
can be imported without dynamic function extraction or an external assertion closure.

`evidence.json` records 12 passing positive/negative checks. Delayed replacement focus and
finite or newly queued animations succeed. Missing, wrong, briefly correct then stolen focus,
ambiguous locators, permanent low contrast, continuous animation, unsupported rendering,
empty roots and translucent low contrast fail as expected.

`snapshot-evidence.json` records six passing consumer scenarios. Both final snapshots pass at
390px and 1280px; maintenance also runs its alternate appearance. There are 68 stable focus
checks across editing, validation, Cancel, Escape, deletion fallback and repeated keyboard and
pointer duplication. Minimum computed contrast is 4.86:1 initially and 4.81:1 after maintenance.
The snapshot script checks SHA-256 equality for every source file and index.html before and
after execution and for the copies it serves. No app or control change was needed for these
final snapshots. This does not establish that earlier consumer implementation patches were
unnecessary; those patches are already present in the retained final snapshot.

## Discovery

Ship `testing.md` alongside package guidance and expose the subpath in the export map. One
sentence in the package's normal agent index and type entry can point agents writing browser
checks to the guide. The trial prompts and existing consumer checks should remain unchanged so
the repeat measures whether ordinary package discovery reaches the optional helper. No helper
is imported from the production runtime entry.

## Reproduction

From the repository root, with the already installed dependencies and Chromium:

```sh
node .work/agent-consumption-strategy/prototypes/maintenance-fixes/verification/verify.mjs
node node_modules/typescript/bin/tsc --strict --noEmit --target es2022 --module nodenext .work/agent-consumption-strategy/prototypes/maintenance-fixes/verification/typecheck.mts
node .work/agent-consumption-strategy/prototypes/maintenance-fixes/verification/verify-snapshots.mjs /tmp/wcl-lifecycle-LTHbbR/library-required/node_modules .work/agent-consumption-strategy/research/pilot/lifecycle/library-required-initial/after .work/agent-consumption-strategy/research/pilot/lifecycle/library-required-maintenance/after
```

The last command accepts an existing consumer dependency directory as its first argument. It
copies and serves the supplied snapshots under this prototype, uses ports 4493 and 4494, and
removes those temporary copies afterward. Reconstruct that dependency directory from the
retained consumer package if the original temporary experiment has been removed.

## Limits

This experiment supports the fix mechanism. It does not establish agent discovery, smaller
maintenance token use, or lower total cost; the paired repeat must measure those outcomes.
The helper is Chromium-tested with Playwright 1.61.1 and TypeScript 5.9.3. It assumes top-level
document content, and frame sampling is bounded evidence rather than proof of future or
continuous focus stability. App state, network responses, timers beyond the settling window,
image decoding and arbitrary JavaScript drawing require their own synchronization.

Contrast uses direct text and input values, composited ancestor colors, and a white canvas.
It includes the root itself and rendered aria-hidden text. Hidden, inert and disabled controls
are excluded. Unsupported effects throw, but the helper does not model visual overlap,
non-ancestor backdrops, generated content, placeholders, SVG, canvas, shadow trees or frames.
It cannot certify accessible names, focus indication, keyboard semantics, or an entire page's
accessibility. The guide names these boundaries before consumers rely on the result.
