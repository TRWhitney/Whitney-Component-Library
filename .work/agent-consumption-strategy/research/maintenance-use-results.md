# Maintenance results with explicit use

## Conclusion

When the experimental APIs were actually used, total maintenance tokens fell 17.9% across two
fresh paired runs. Retained new verification code fell 40.8%. Both pairs favored the experimental
package on those measures. Uncached input plus output rose 4.5%, output tokens rose 5.0%, and
summed elapsed time rose 1.5%. This is a measured reduction in repeated cached context and
verification code, not a reduction in every cost measure.

Both experimental agents used the Button event target and all three testing helpers in successful
executed checks. Each experimental check passed on its first execution. Each current-package
agent repaired one failing maintenance check. Discoverability was explicitly excluded.

All four apps passed 64/64 independent scenarios and separate type/build checks. Both
experimental runs passed actual-use validation. No app repair or score rerun was needed.

## Scope and controls

The [frozen protocol](maintenance-use-protocol.md) asks whether using the proposed changes helps.
The [earlier optional-use experiment](maintenance-fixes-results.md) did not test helper utility,
because neither agent used them. Its negative result cannot answer this question.

All four fresh attempts started from the same retained initial Trail app. Both sides received
direct paths to appearance/Button declarations and existing browser checks. Both implemented
the original dark/light appearance and duplication request, retained an executable maintenance
check, and received the same requirement that dialog restoration must not steal newly moved
focus. The experimental prompt required event.target and the focus, animation and contrast
helpers for their documented purposes. Current used installed Playwright and existing app checks.

The package variants are byte-identical to the earlier experiment's tarballs. The helpers,
declarations, guide and independent checker were unchanged. Two pairs ran current A/fixed B,
then fixed C/current D, with distinct ports and identical installed toolchains. All finished
within eight minutes, without external corrections or reruns. Every reference read, integration
step and self-repair counts in authoring usage. Prototype construction and independent evaluation
are separate engineering work outside these authoring totals.

The prompts are [current](../prototypes/maintenance-use/current.txt) and
[experimental](../prototypes/maintenance-use/fixed.txt). Exact package/prompt hashes, model and
versions are in [freeze.json](pilot/maintenance-use/freeze.json). The runner uses CLI 0.157.1,
gpt-6-astra medium, Vite 8.2.1, Rolldown 1.2.11, React 19.2.8 and Playwright 1.61.1.

## Usage

| Run                | Total tokens | Cached input | Uncached input + output | Output tokens | Seconds | Commands |
| ------------------ | -----------: | -----------: | ----------------------: | ------------: | ------: | -------: |
| Current A          |      383,391 |      352,640 |                  30,751 |         4,709 |  189.91 |       10 |
| Experimental B     |      296,347 |      263,040 |                  33,307 |         5,740 |  218.88 |        9 |
| Experimental C     |      427,508 |      389,120 |                  38,388 |         5,647 |  226.56 |       10 |
| Current D          |      497,994 |      460,160 |                  37,834 |         6,133 |  248.99 |       15 |
| Current total      |      881,385 |      812,800 |                  68,585 |        10,842 |  438.90 |       25 |
| Experimental total |      723,855 |      652,160 |                  71,695 |        11,387 |  445.44 |       19 |

Total means input plus output, including repeated cached input. Uncached input plus output is a
separate count, not a price estimate. Cached input fell by 160,640 tokens while uncached input
plus output rose by 3,110, producing the net reduction of 157,530. Per-request usage is unavailable;
these totals cannot assign exact savings to individual helper calls or package changes.

Total token savings were 22.7% in pair 1 and 14.2% in pair 2. Uncached input plus output was higher
in both experimental runs, by 8.3% and 1.5%. This distinction matters when interpreting the result.
Command output fell from 128,427 to 79,563 characters overall, and commands fell from 25 to 19.
[Measurements](pilot/maintenance-use/measurements.json) and
[aggregate totals](pilot/maintenance-use/aggregate.json) retain the exact counts.

## Evidence of actual use and repair

Experimental B passed event.target into its duplication function and focused that target. Its
retained maintenance script used waitForFocus after dismissal and duplication, waitForVisualState
before appearance sampling/screenshots, and assertTextContrast on page and dialog text. Trace
items 6 and 9 execute the script successfully across both widths and appearances.

Experimental C also focused the event target and executed all three helpers in its retained
script. Trace items 9 and 14 complete successfully. Both checked requirements outside helper
coverage separately. Neither replaced the helpers with its own implementation. The installed
helper bytes were checked against the frozen source after authoring.

The current agents reused existing checks but adapted their own synchronization and contrast
code. A's first extended check sampled a Delete transition at 1.087:1, then added settling before
sampling. D's first extended check rejected with AbortError while awaiting animation completion,
then repaired its animation wait. Experimental checks had neither failure. This supports the
proposed verification mechanism on this task, without assigning every token difference to it.

Other nonzero commands included Git queries in temporary directories without Git history and
searches with no matches. Across all commands, current had five nonzero exits and experimental
had three. No helper incompatibility or missing-use follow-up occurred.

Direct API paths also removed much of the earlier broad-search cost from both treatments.
Quieter experimental builds remained available, but current agents sometimes captured or tailed
build logs themselves. This is a combined package comparison; it cannot isolate a separate
warning-cleanup or Button-event token effect.

## Source

Counts use the same formatting normalization as the earlier measurements. They sum two separate
apps per condition, not one application's size. Existing unchanged checks are excluded from new
verification code, and all retained generated checks count as consumer code.

| Source characters                 | Current total | Experimental total | Change |
| --------------------------------- | ------------: | -----------------: | -----: |
| Application                       |        34,066 |             34,989 |  +2.7% |
| New retained verification         |        34,076 |             20,164 | -40.8% |
| Application plus new verification |        68,142 |             55,153 | -19.1% |

The source reduction came from verification. Application source grew slightly. Smaller check
source does not by itself establish equal author-written test coverage; the independent app
checker supplies the common objective checks. Both treatments still implemented app focus
behavior themselves. A synchronization helper does not repair app behavior.

## Independent correctness

All four runs passed 64/64 scenarios, with no failed or unverified scenario and no page errors.
All independent type/build checks passed. Source/fixture hashes stayed unchanged during
evaluation, and the checker SHA-256 remains
`9efc649eefce0bf87fd8395c1f4c7227f521c01ae5e9337cdbd4d219e983403a`.

The evaluator separately verified actual use in both experimental runs. See
[B treatment validation](pilot/maintenance-use/evaluation/run-b/treatment-validation.json) and
[C treatment validation](pilot/maintenance-use/evaluation/run-c/treatment-validation.json).
The [evaluation evidence](pilot/maintenance-use/evaluation/) retains summaries, hashes,
screenshots and build logs. No repairs, replacement scores or subjective style review.

## Interpretation and next boundary

The actual-use result supports retaining the testing-helper candidate for maintenance work.
The earlier recommendation to reject it based on non-use is withdrawn. On this task the combined
changes reduced total tokens and consumer verification code, while fresh input/output and time
did not improve. Two runs per condition do not establish a general expected saving.

This compares experimental changes with the current library, not with fresh React/CSS-only
controls. It does not prove that the library beats React/CSS over a project's lifetime. No human
style scoring, discovery experiment or new application template is involved.

The package remains an isolated prototype. Production adoption still requires the source-level
event contract and showcase updates, package testing support decisions, and actual React Server
Components compilation coverage for the directive change. Existing React DOM SSR/hydration and
standalone helper proofs remain in the [package findings](../prototypes/maintenance-fixes/package/findings.md)
and [helper findings](../prototypes/maintenance-fixes/verification/findings.md).
