# Guidance cost experiment

Frozen before authoring on 2026-10-09. This is a bounded research prototype, not a release gate.

Compare one fresh-context authoring attempt each using React/CSS, current full guidance, and
selective prototype guidance. Each receives the same [profile-editor brief](../../prototypes/agent-guidance-cost/brief.txt),
scaffold, dependencies, and objective behavior requirements. The library conditions use the
same unchanged package and must use its Dialog. They receive direct references, so discovery
is excluded. Supply full pages to the control although the installed package omits them.
This gives the control a better reading path than its current distribution.

Use the inherited model and effort equally. Allow one attempt and one bounded correction
message per condition after independent checks. Retain failures and all correction costs;
do not rerun for a preferred result. No subjective style scoring or new API/helper experiments.

Check initial rendering, opening, accessible name/description, initial input, focus entry,
empty/whitespace validation, valid trimmed save, cancellation, Escape, reopened state, focus
return, and Tab containment. Type/build checks belong to authoring cost. Evaluate behavior
independently with the shared T3 browser at 390px and 1280px and record any unavailable check.

Measure available total input, output, cached input, uncached input plus output, elapsed time,
reference tokens, tool reads, and final app/CSS source tokens. Never infer agent usage from
reference size. If the provider exposes no usage, mark total usage unavailable. Tokenizer counts
use tiktoken 0.12.0, o200k_base and cl100k_base; neither is claimed as this model's billing encoding.
Keep coordinator, prototype construction, and evaluator usage outside authoring totals.

Separate the wording effect from selection of fewer fields in the static measurement. Verify
every canonical guidance field has a topic, full contracts are unchanged, all examples remain
reachable, and every nonempty extracted prop reference compiles. Test duplicate/invalid names
and unknown topics. Baseline, prompts, source, hashes, and measurements must be retained without
changing older captured evidence. One trial per condition cannot establish expected savings.
