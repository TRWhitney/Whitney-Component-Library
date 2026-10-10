# Verification helper experiment

The prototype supports shipping one optional testing subpath with three functions. It removes
the need to reconstruct assertions or polling loops while preserving failures. It is research
code for the temporary package comparison, not an accepted production change.

## Evidence behind the scope

The initial trial's `item_11` command failed a single immediate focus assertion. Its historical
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

The exact command IDs refer to the removed historical JSONL traces, not independent causal proof
for every timeout. In particular, the traces show captured handles but do not establish that a
detached handle caused a particular consumer failure. A replacement-target fixture establishes
that the proposed helper handles that failure mode. The focused-sample fixture establishes that
a transient initial match cannot immediately advance the check into the next action.

The historical sources were the `library-required-initial` and `library-required-maintenance`
traces and snapshots. Those were removed. The independent lifecycle checker and notes remain.
No independent checker or recorded trial input was changed during the experiment.

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

The historical standalone verifier passed 12 positive/negative checks; its raw output was removed. Delayed replacement focus and
finite or newly queued animations succeed. Missing, wrong, briefly correct then stolen focus,
ambiguous locators, permanent low contrast, continuous animation, unsupported rendering,
empty roots and translucent low contrast fail as expected.

The historical snapshot verifier passed six consumer scenarios. Both final snapshots passed at
390px and 1280px; maintenance also runs its alternate appearance. There are 68 stable focus
checks across editing, validation, Cancel, Escape, deletion fallback and repeated keyboard and
pointer duplication. Minimum computed contrast is 4.86:1 initially and 4.81:1 after maintenance.
The snapshot script checks SHA-256 equality for every source file and index.html before and
after execution and for the copies it serves. No app or control change was needed for these
final snapshots. This does not establish that earlier consumer implementation patches were
unnecessary; those patches were already present in the now-removed final snapshots.

## Discovery

Ship `testing.md` alongside package guidance and expose the subpath in the export map. One
sentence in the package's normal agent index and type entry can point agents writing browser
checks to the guide. The original optional-use study kept trial prompts and consumer checks unchanged to measure
ordinary package discovery. Those historical consumer checks were later removed. No helper
is imported from the production runtime entry.

## Standalone checks

From the repository root, with the installed dependencies and Chromium:

```sh
node .work/agent-consumption-strategy/prototypes/maintenance-fixes/verification/verify.mjs
node node_modules/typescript/bin/tsc --strict --noEmit --target es2022 --module nodenext .work/agent-consumption-strategy/prototypes/maintenance-fixes/verification/typecheck.mts
```

The verifier creates fresh helper fixtures and writes ignored `evidence.json` beside its source;
inspect and delete that file after use. The retained
`verify-snapshots.mjs` requires caller-supplied consumer snapshots and dependencies. Its original
Trail apps were removed. It writes ignored `snapshot-evidence.json` beside its source; delete it
after inspection. The six historical consumer scenarios are written observations,
not runnable historical fixtures.

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
