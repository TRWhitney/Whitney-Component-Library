# Board inspector comparison protocol

## Question

Does a small extension to existing Dialog remove integration work when consumer-owned board
controls open an inspector and need precise focus restoration? Preserve the board layout and
rules. Exclude new runtime composites, app templates, and broad styling changes.

## Conditions and stopping rule

Compare the current installed package with a temporary package that adds an explicitly controlled
Dialog path with no rendered trigger and a consumer focus target. Existing triggered usage remains
available. The proposed focus prop resolves its current target when closing. A missing target falls
back to the connected opener captured on opening. The experimental implementation must pass the
reference interaction checks before it is used in an agent trial.

First build coordinator-authored reference consumers using current and experimental APIs. Count
all application source and the added library implementation separately. Do not credit copied or
generated glue as removed complexity without recording where it moved.

Then run one fresh coding-agent trial per package condition on the same related variation, with
an eight-minute limit each. These two runs are diagnostic cases, not success-rate estimates. Do
not tune the extension using agent results and silently rerun. Infrastructure failures before
editing may be restarted and must be recorded.

Both packages receive equivalent discovery cues and focused Dialog documentation appropriate to
their APIs. The task prompt does not name a guide, new API, hidden trigger, or focus workaround.
Use fixed distinct browser ports. Keep model, configuration, initial files, checks and correction
rules the same. Permit native HTML when suitable, including a native dialog fallback. Reusing the
library is not an acceptance requirement.

## Reference interaction

A four-by-four board has one piece starting at square 1. Arrow keys move board focus. Enter, Space,
or pointer activation on the occupied square opens its inspector. Empty-square activation keeps
the existing adjacent-move rule. The inspector shows the selected piece and allows renaming it.
Save commits; Cancel, close, and Escape discard the draft. Dismissal returns focus to the square
containing the piece. An inspector action moves the piece to the next square and closes, returning
focus to that destination. A removal action closes and returns focus to Reset board. Reset restores
the initial piece. The application owns the board, state, refs, move rules, and styling.

## Agent task variation

Agents receive the same existing two-piece board and are asked to add an inspector for an occupied
square. It must edit the piece label, discard cancelled edits, move the selected piece to the next
empty square, and remove it. Save/cancel/close/Escape return focus to its current square; move
returns focus to its new square; removal returns focus to Reset board. Board and rules must remain
unchanged. This variation adds identity and occupied-square handling beyond the one-piece reference.
It is related-task transfer, not a held-out generalization benchmark.

## Independent checks

At 390px and 1280px verify opening by pointer and keyboard, accessible dialog naming, focus entry
and sampled containment, draft save/cancellation, close-button and Escape dismissal, focus return,
move destination, removal fallback, reset, and no horizontal clipping. Verify a normal triggered
Dialog still works in the experimental reference. Record actual focus targets after animation
settles. Do not repair trial source before assessing it.

Report correctness before source or token counts. Count changed application TSX/CSS and retained
scaffolding separately, use formatting-normalized sizes, and preserve raw agent outputs. Record
reported input/output/cached tokens, runtime, commands, repair attempts, type/build results, and
whether the agent chose library or native controls. Added library code, documentation and setup
cost are separate from per-consumer code. Do not claim better semantics merely from more imports.

## Recorded departure

The first current-package attempt ended with SIGTERM after editing and a successful type/build
check. Its runner produced no final usage record, and its browser check had started without a
result. The sender and cause are unknown. Preserve that attempt as `current-interrupted`, assess
its untouched output, and do not classify the interruption as an application failure.

One fresh current-package follow-up started from identical original files and the same package,
prompt, model, and limits. Its CLI runs in a separate process session. This departs from the
original before-edit restart rule. Report both current attempts and the missing token total; do
not present the completed pair as the only attempts. No API or guidance changed after the trials.
