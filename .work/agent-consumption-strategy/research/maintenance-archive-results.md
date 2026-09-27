# Archive and restore maintenance results

## Conclusion

The first round's token saving did not repeat in this change. Experimental used 6.2% more total
tokens for archive/restore, with 1.1% less uncached input plus output and 17.4% more elapsed time.
The two pairs disagreed: experimental used more tokens in pair 1 and fewer in pair 2.

Across both maintenance changes, experimental still used 7.5% fewer total tokens. That advantage
fell from 17.9% after round one. Cumulative uncached input plus output is 1.5% higher, output
tokens are 7.8% higher, and elapsed time is 8.5% longer. The evidence does not establish a
consistent continuing token advantage after both sides own working verification utilities.

The smaller verification codebase persists. Experimental finishes with 26.4% less retained
verification code. This round added almost equal amounts, 18,294 experimental characters versus
18,172 current. Most of the remaining size difference comes from the first round.

All four apps passed 112/112 independent scenarios and separate builds. Identity source review
and executed utility reuse passed for all four. No repairs or score reruns were needed.

## Controlled continuation

Whitney authorized this second maintenance change in the same four apps. The
[protocol](maintenance-archive-protocol.md) and [common brief](../prototypes/maintenance-archive/common.txt)
were frozen before new authoring output. Each run began from its own exact round-one final app,
including its existing maintenance check. The only preparation edits changed fixed localhost
ports and the dev command. Seed bytes, package hashes, toolchain, prompt hashes and installed
helper bytes were verified.

Archive and restore must preserve identity and underlying order, support both views' search,
counts, edit/delete/duplicate behavior, and move focus to the next visible action, previous action,
or search when a row disappears. The existing appearance, layout, contrast and long-name behavior
must remain. Both conditions extended and executed their existing maintenance scripts. Explicit
helper use continued for experimental; discoverability was excluded.

Two fresh-context pairs ran current A/experimental B, then experimental C/current D. Same
unchanged gpt-6-astra medium configuration, eight-minute limits, distinct ports. All completed
without timeout, external correction or retries. This models a new agent returning to an existing
project, not a resumed conversation. All reference reads, implementation, tests, self-repairs and
final messages count. Evaluator and prototype-construction work is outside those authoring totals.

[Freeze metadata](pilot/maintenance-archive/freeze.json),
[measurements](pilot/maintenance-archive/measurements.json) and
[combined results](pilot/maintenance-archive/combined.json) retain the exact evidence. Previous
round costs come from the [explicit-use comparison](maintenance-use-results.md), never from the
older optional-use runs.

## Incremental usage

| Run                | Total tokens | Cached input | Uncached input + output | Output tokens | Seconds | Commands |
| ------------------ | -----------: | -----------: | ----------------------: | ------------: | ------: | -------: |
| Current A          |      274,983 |      242,688 |                  32,295 |         4,326 |  161.76 |       11 |
| Experimental B     |      350,269 |      308,224 |                  42,045 |         4,555 |  188.06 |        9 |
| Experimental C     |      351,940 |      317,568 |                  34,372 |         5,400 |  217.43 |        9 |
| Current D          |      385,976 |      340,992 |                  44,984 |         4,627 |  183.67 |        8 |
| Current total      |      660,959 |      583,680 |                  77,279 |         8,953 |  345.43 |       19 |
| Experimental total |      702,209 |      625,792 |                  76,417 |         9,955 |  405.49 |       18 |

Experimental used 27.4% more total tokens in pair 1 and 8.8% fewer in pair 2. It took longer in
both pairs. Uncached input plus output also went opposite ways across pairs. These two attempts
per condition are too few to estimate a general expected effect.

The four extended maintenance scripts passed their first execution. Each agent had one nonzero
command, a Git diff in a temporary directory without Git history. Neither condition needed a
verification repair. This differs from round one, when both current agents repaired a check and
the experimental agents did not.

Experimental command output was 105,147 characters versus 195,959 current, 46.3% less. Quieter
build output therefore persisted, but it did not produce lower total authoring tokens this round.
Completed command count and printed output do not determine total context replay. Per-request
usage is unavailable, so the exact token difference cannot be allocated among reading, tool
scheduling, helper integration, polling and ordinary agent variation.

## Cumulative usage

These totals cover two maintenance changes in two apps per condition. They do not include initial
creation, all research work, or a whole project lifetime. No React/CSS-only app was rerun here.

| Across both changes     |   Current | Experimental | Experimental change |
| ----------------------- | --------: | -----------: | ------------------: |
| Total tokens            | 1,542,344 |    1,426,064 |               -7.5% |
| Cached input            | 1,396,480 |    1,277,952 |               -8.5% |
| Uncached input + output |   145,864 |      148,112 |               +1.5% |
| Output tokens           |    19,795 |       21,342 |               +7.8% |
| Summed seconds          |    784.33 |       850.93 |               +8.5% |
| Completed commands      |        44 |           37 |              -15.9% |

Total tokens include repeated cached input. Uncached input plus output is a separate count, not a
price estimate. The cumulative reduction comes from 118,528 fewer cached-input tokens, offset
by 2,248 more uncached input plus output. Both pairs retain a cumulative total-token advantage,
1.8% in pair 1 and 11.8% in pair 2; the advantage shrank in the new round.

## Verification reuse and code

Current reused the existing local focus, settling, contrast and layout utilities. Experimental
reused the existing public waitForFocus, waitForVisualState and assertTextContrast imports in
new archive cases. Actual calls in successfully executed new cases are required evidence, not
merely retained imports. Button event-target use and stable identity updates receive separate
read-only source review. No package/helper code changed.

Normalized source counts describe the final app and its retained verification once. They do not
sum successive snapshots. The common original checks are excluded from the new retained
verification count. All generated retained check code counts as consumer code.

| Source characters                    | Current | Experimental | Experimental change |
| ------------------------------------ | ------: | -----------: | ------------------: |
| App growth this round                |   5,118 |        4,808 |               -6.1% |
| Verification growth this round       |  18,172 |       18,294 |               +0.7% |
| Final application                    |  39,184 |       39,797 |               +1.6% |
| Final retained verification          |  52,248 |       38,458 |              -26.4% |
| Final app plus maintenance.check.mjs |  91,432 |       78,255 |              -14.4% |

Both sides now have reusable checking functions. They still wrote similar amounts of domain
assertions for archive/restore. The package helpers continue to remove local utility
implementation, but this round did not show less new verification code or fewer verification
repairs. Agent-written coverage can differ; common independent scenarios provide the objective
comparison.

## Independent correctness

Each app passed all 64 regression scenarios and all 48 archive scenarios, 448 passes across the
four apps. All four independent builds passed. There were no failed or unverified scenarios,
no page errors, no app repairs and no replacement scores. Source/fixture hashes remained unchanged.

Read-only source review confirmed that archive/restore only toggle state for the matching ID in
the ordered array. Duplication creates a fresh UUID, inherits archive state, and inserts next to
the source. Actual new-case utility reuse passed for all four. C's existing keyboard traversal
was extended to include the added view controls while retaining its final target assertion.
The [evaluation evidence](pilot/maintenance-archive/evaluation/) retains per-run summaries,
source reviews, reuse reviews, hashes, screenshots and build logs.

The [archive checker notes](../prototypes/maintenance-archive/checker-notes.md) and
[proof summary](../prototypes/maintenance-archive/proof/proof-summary.json) record the pre-authoring
proof. Its complete native reference passed 48/48. Tab and radio view variants passed, and all
12 targeted negative mutations failed as intended across both widths and appearances. The
reference's earlier 44/48 result remains recorded; its missing modal Tab trap was corrected
without weakening the checker.

The no-focus-theft stress case performs click and Search.focus() in one browser callback. This
is stronger than separate physical events and is reported as such. Computed geometry/contrast
and sampled focus do not establish subjective style quality or every accessibility property.
No subjective score or human revision cost is introduced.

The frozen checker hashes are:

- Archive: `c93e2982fbf6a675e69932fd96063c163874e8a8092270e66534eff6f673aa58`.
- Regression: `9efc649eefce0bf87fd8395c1f4c7227f521c01ae5e9337cdbd4d219e983403a`.

## Implication

Retain the helper candidate for its demonstrated reduction in verification code. Treat recurring
token savings as unresolved. The new round shows the control can also reuse the utilities it
already owns, while the cumulative experimental saving remains concentrated in cached input.
This result does not justify expanding the helper API or claiming a general lifetime advantage.

Production source, showcase, README and package behavior remain unchanged. The experiment stops
here as authorized. No discovery test or additional maintenance round is scheduled.
