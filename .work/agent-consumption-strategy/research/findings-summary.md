# Agent consumption findings

Recorded 2026-09-26. Continue through [Ticket 01](../tickets/01-reduce-agent-lifecycle-cost.md).

The library has reduced consumer source in the tested apps. It has not demonstrated lower total
token use than React/CSS through creation and maintenance. The latest fixes reduced retained
maintenance-check code compared with the existing library, but their token advantage weakened
on the second change. No improved-package comparison with React/CSS has been run.

## What changed

The repository gained the approved short package README and planning changes allowing this
bounded evaluation. Formatting and linting exclude captured evidence so it stays unchanged.
Public components, production build behavior, and the showcase have not changed. The following
candidates exist only in isolated prototypes:

| Candidate                                                                                         | Finding                                                                                                                                | Remaining limit                                                                                                                             |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Focused package guide, setup and extracted prop references                                        | All 85 prop references compile; the initial pilot produced less app source.                                                            | More tokens; discovery is deferred for the next utility comparison.                                                                         |
| Controlled Dialog without a rendered trigger, with an explicit return-focus ref                   | Removed hidden-trigger/focus-cleanup code in a custom board inspector; completed agent app source fell 14%.                            | Total tokens rose 87.8% in the completed pair; one interrupted control has no usage record.                                                 |
| Library-owned Button press-event type exposing its target                                         | Removes a demonstrated type error and lets consumers use the initiating button directly. Existing no-argument callbacks still compile. | No production API change; future adoption needs canonical contracts, declarations and showcase updates.                                     |
| Remove internal client directives from a disposable package, retaining the public client boundary | On the recorded toolchain, 67 build warnings became one; output fell from 46,229 to 993 characters with identical consumer JS/CSS.     | Actual React Server Components framework compilation remains unverified. Other Rolldown versions already emit no warnings.                  |
| Separate testing helpers: `waitForFocus`, `waitForVisualState`, `assertTextContrast`              | Avoid repeated local focus/transition/contrast utility code; explicit-use trials confirmed executed use.                               | Smaller test code has not established recurring token savings. Helpers do not fix app behavior or cover every rendering/accessibility case. |

The Button, warning and testing-helper changes were tested together. Their individual effects on
authoring tokens cannot be separated from these runs. The optional testing export adds no runtime
import or Playwright dependency to ordinary component use.

## Direct comparison with React/CSS

The [lifecycle comparison](lifecycle-results.md) created an item-list app, then changed appearance
and added duplication with long-name handling. One completed app per condition passed the same
26 initial and 64 maintenance scenarios without external repairs.

| Measure                          | React/CSS | Existing library |
| -------------------------------- | --------: | ---------------: |
| Creation tokens                  |   241,599 |          347,154 |
| Maintenance tokens               |   213,397 |          904,127 |
| Combined tokens                  |   454,996 |        1,251,281 |
| Combined uncached input + output |    78,804 |          119,249 |
| Final app source characters      |    21,525 |           17,165 |
| Final CSS characters             |     9,476 |            5,396 |

The library used 2.75 times as many total tokens, with 20% less app source and 43% less CSS.
Only 280 characters of the app reduction came from TSX. This single pair is not an expected
average: the 904,127-token maintenance run was much more expensive than later library controls.

Its traces show broad package/type reads, repeated build warnings and verification repairs around
missing assertion dependencies, appearance transitions and focus timing. A failed attempt to use
Button's event target exposed actual public-type friction. These observations motivated the
prototypes; they do not allocate the token increase causally among those issues.

## What the fixes achieved

Two pairs compared the existing library with the combined prototype. Both sides received direct
references; experimental runs had to use the proposed API and all three helpers. The second
maintenance change extended each app's own first-round result and reused existing checks.

| Measure                               | Existing library | Prototype | Prototype difference |
| ------------------------------------- | ---------------: | --------: | -------------------: |
| First maintenance change tokens       |          881,385 |   723,855 |               -17.9% |
| Second change, archive/restore tokens |          660,959 |   702,209 |                +6.2% |
| Both changes, total tokens            |        1,542,344 | 1,426,064 |                -7.5% |
| Both changes, uncached input + output |          145,864 |   148,112 |                +1.5% |
| Both changes, summed seconds          |           784.33 |    850.93 |                +8.5% |
| Final app source characters           |           39,184 |    39,797 |                +1.6% |
| Final maintenance-script characters   |           52,248 |    38,458 |               -26.4% |

Source totals cover two apps per condition, counted once at their final state. Maintenance-script
counts exclude the unchanged original checks. All four final apps passed 112 independent
scenarios each and builds; executed helper reuse and identity preservation were verified.

The cumulative token reduction comes entirely from less cached input, offset by slightly more
uncached input and output. In round two, both sides passed their own checks on the first execution
and added almost equal verification source. Controls could reuse their local utilities too.
The smaller retained maintenance codebase persists; a continuing token advantage is unresolved.
These results compare two library versions. Do not apply the 7.5% saving to the older native
comparison or claim a library-versus-React/CSS advantage.

## Evidence and discarded interpretations

- [Initial pilot](pilot-results.md): nine apps across React/CSS, current package and guide
  prototype. Guide-prototype app source was 32% smaller than React/CSS, but tokens increased.
  Better semantic component selection was not established.
- [Open-composition investigation](open-composition-investigation.md), [API probe](api-probe.md),
  [tooling probe](tooling-probe.md), and [adoption probe](adoption-probe.md): preserve native/custom
  composition. No evidence supports app templates, broad prop renaming or a whole-app compiler.
- [Board inspector](board-inspector-results.md): custom-app interoperability proof, separate
  from the item-list lifecycle comparison.
- [First maintenance-fix trial](maintenance-fixes-results.md): experimental agents did not use
  the helpers. Its higher token use does not measure helper utility. Do not repeat optional-use
  testing as the next step.
- [Explicit-use round one](maintenance-use-results.md) and [archive/restore round two](maintenance-archive-results.md):
  the valid actual-use comparisons summarized above. Reports link frozen protocols, prompts,
  snapshots, traces, package hashes, independent checks and measurements.

Total tokens mean input plus output; cached input is already included. Uncached input plus output
is a separate count, not a price estimate. Authoring totals include reading, implementation,
self-verification and repairs, but exclude coordinator/evaluator and prototype construction work.
Human style/feel revision costs remain unknown. Whitney excludes subjective scoring and invented
human revision rounds; do not assume unmeasured savings offset observed overhead. Small samples
and a narrow task family do not establish general or lifetime savings.
