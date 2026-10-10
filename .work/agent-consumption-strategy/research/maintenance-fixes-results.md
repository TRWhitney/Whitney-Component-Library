# Maintenance fixes results

## Scope correction

Whitney clarified that the question is the benefit of actually using the proposed changes.
Neither experimental agent used the testing helpers, so this trial does not measure their
utility. Its usage and correctness results describe the optional-use treatment only. The
[explicit-use comparison](maintenance-use-results.md) supplies references and requires use;
discoverability is deferred.

## Conclusion

The combined prototype did not reduce maintenance usage. Across two fresh runs per package,
current used 587,366 total tokens and fixed used 935,716, an increase of 59.3%. Fixed also used
33.3% more uncached input plus output and took 22.0% longer. Both paired comparisons favored
current. Two runs per condition do not estimate general expected usage or isolate each fix.

The build cleanup works and the Button event correction works. The optional test helpers were
unused in both fixed runs. Shipping them with a short guide did not prevent either agent from
writing its own checks or encountering transition-time contrast failures.

The previous 904,127-token library maintenance attempt was unusually expensive relative to these
fresh controls. Comparing only against that attempt would have made both fixed runs appear
cheaper and concealed the unfavorable result against current.

## Setup and evidence

The [protocol](maintenance-fixes-protocol.md) froze four fresh runs before inspecting their
output. Each began with the same retained library-based app before maintenance, the same original
checks, and the exact prior maintenance brief. The brief requests dark/light appearance, blue
accent, independent duplication, focus preservation and long-name handling. No extra helper
instructions, repairs, correction rounds, reruns for a better score or subjective assessments.

Pair 1 ran current A and fixed B together; pair 2 ran fixed C and current D together. All finished
inside eight minutes. CLI 0.157.1 used gpt-6-astra with medium reasoning. All four had identical
installed versions, including Vite 8.2.1, Rolldown 1.2.11, React 19.2.8 and Playwright 1.61.1.
The current library was selected once when creating the original app; unprompted adoption was
not tested. No native comparison was repeated in this maintenance-only experiment.

The raw environment records, before/after apps, command traces and measurement files were removed.
The tables below preserve the reported values. Evaluator and prototype-construction work is outside
these authoring totals, not free development work.

## Maintenance cost

| Pair and package | Total tokens | Cached input | Uncached input + output | Output tokens | Seconds | Commands |
| ---------------- | -----------: | -----------: | ----------------------: | ------------: | ------: | -------: |
| 1 current A      |      317,174 |      278,272 |                  38,902 |         3,980 |  163.06 |       11 |
| 1 fixed B        |      369,014 |      326,656 |                  42,358 |         5,246 |  208.25 |       12 |
| 2 fixed C        |      566,702 |      513,536 |                  53,166 |         5,088 |  193.88 |       15 |
| 2 current D      |      270,192 |      237,440 |                  32,752 |         4,146 |  166.67 |       10 |
| Current total    |      587,366 |      515,712 |                  71,654 |         8,126 |  329.73 |       21 |
| Fixed total      |      935,716 |      840,192 |                  95,524 |        10,334 |  402.13 |       27 |

Total tokens means input plus output, including repeated cached input. Uncached input plus output
is reported separately; it is neither a price calculation nor a complete measure of usage.
Fixed used 16.3% more total tokens in pair 1 and 109.7% more in pair 2. Six fixed commands and
four current commands returned nonzero, including unrelated Git lookups outside a repository.
The trace does not provide per-request usage, so exact token shares cannot be assigned to causes.

## What the changes actually did

### Package output

A build of the same initial app emitted 67 directive warnings and 46,229 characters with current,
and one warning and 993 characters with fixed. Generated JavaScript and CSS were byte-identical.
The public root retains its client directive. This reduction also appears in the authoring logs.
Fixed agents each built twice; current agents each built once. All command output combined fell
only 19.2%, from 284,236 to 229,587 characters, because other large reads remained.

Both fixed runs searched broadly through installed declarations, CSS or file listings before
editing. Their early package commands returned about 61,000 and 95,000 characters. One current
run returned 107,000; the other restricted reads and returned under 4,000 across its two package
commands. These are recorded tool output lengths, not exact model-context token counts. Quieter
builds alone did not determine total task cost.

The [package proof](../prototypes/maintenance-fixes/package/findings.md) covers strict callback
compatibility, Chromium activation, unchanged assets and existing React DOM SSR/hydration.
Actual React Server Components framework compilation remains unverified. Rolldown 1.2.4 did not
emit the original warnings; recording the transitive version was necessary to reproduce them.

### Button event

Fixed C read Button's declaration and used `onPress={event => duplicate(item, event.target)}`.
Its build passed without the old callback signature repair. Fixed B used a callback without an
argument. This demonstrates usable event access, not a measured token saving from that change.
The event remains library-owned and does not expose a React Aria type dependency.

### Browser checks

Neither fixed agent opened the testing guide or imported the testing module. B saw its filename
inside a large package listing. Both adapted the existing checks instead. B added a retained
browser script and repaired its theme-transition contrast sample by waiting for animations.
C repaired a data-URL import error, encountered transition-time contrast failure, inspected
appearance implementation, and ultimately keyed Buttons by appearance to remount them. It then
rechecked focus. No coordinator suggested those changes.

Current agents also encountered transition-time contrast failures. A waited for settling; D
waited and adjusted its own theme colors. All four spent work adapting verification, despite the
fixed package's available helpers. The comparison does not establish that those helpers would
save tokens if explicitly used, nor that adding more discovery instructions is the right remedy.

The [helper proof](../prototypes/maintenance-fixes/verification/findings.md) passed 12 positive
and negative cases plus six unchanged consumer scenarios with 68 focus checks. Those establish
bounded helper behavior. They do not establish adoption or end-to-end savings.

## Independent correctness

All four independent type/build checks passed. The frozen browser checker reported:

| Run       | Pass | Fail | Page errors |
| --------- | ---: | ---: | ----------: |
| Current A |   64 |    0 |           0 |
| Fixed B   |   62 |    2 |           0 |
| Fixed C   |   62 |    2 |           0 |
| Current D |   64 |    0 |           0 |

The same checker tests both widths and appearances. Source hashes remained unchanged during
evaluation.
Primary captures and build logs were removed under the
[retention policy](../../../docs/research/agent-evidence-retention.md). The failure scores below
remain recorded observations.

All four failures occur when the checker closes a dialog and immediately focuses and activates
the appearance checkbox. Fixed B's failures are at 390px/light delete propagation and
1280px/light edit propagation. Fixed C's are at 390px/dark edit propagation and 390px/light delete
propagation. Their close functions still contain the exact initial app's queued animation-frame
focus restoration. Screenshots show dialogs reopened. This supports an inherited focus race,
not a claim that the package patch caused a new regression.

A bounded read-only diagnostic on B sampled twelve post-dismissal toggles immediately and
twelve after two animation frames. All toggles changed appearance in that diagnostic. Six of
the immediate toggles subsequently lost focus back to a dialog trigger; none of the waited
ones did. It did not reproduce the primary unchanged-checkbox failures and does not replace
those scores. The detailed raw diagnosis was removed.
No application or checker was repaired. The comparison therefore also lacks equal measured
correctness, independently of its unfavorable usage result. Human style/feel remains unmeasured.

## Source and package cost

Normalized final application source totals 33,601 characters across current runs and 34,748
across fixed, 3.4% more. Each condition includes two versions of the same starting app; sums are
comparisons across trials, not a single app's size. Retained new verification code totals 5,150
characters for current and 8,608 for fixed. Inline checks live in the command traces and are
included in token usage, but not these retained-source counts.

The packed candidate grows by 3,859 bytes, from 876,290 to 880,149. The testing export is separate
from the application entry and has no runtime imports. It adds package maintenance obligations
even when consumers do not use it. This comparison gives no evidence that this cost is repaid.

## Implication

Keep the event correction and build cleanup as narrow production candidates, with source-level
implementation, generated contracts, showcase updates where required, and the remaining
server/client compatibility check. Do not describe them as proven token optimizations. Helper utility requires an actual-use comparison.

Broad package reads and improvised verification remain the demonstrated costs. The next
experiment must measure the cost of actually using the proposed fixes. Discovery is outside
that comparison. It should use fresh controls, preserve failure results, and test another task
before claiming a general maintenance benefit. No production source, component API, showcase or
README was changed in this experiment.
