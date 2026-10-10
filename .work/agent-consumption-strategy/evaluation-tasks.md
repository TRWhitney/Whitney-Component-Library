# Comparative task briefs and assessment

Historical study plan. Raw captures and obsolete replay setups were later removed under the
[retention policy](../../docs/research/agent-evidence-retention.md). Capture instructions below describe execution, not a retention requirement.

Protocol used for the authorized small pilot. Task requirements were fixed across all three
conditions. Each condition received the same data requirements and empty React scaffold. The only dependency
difference is whether this library is installed, and which version of it is installed.

## Common task instructions

Implement the requested screen in this React and TypeScript app. Use the installed dependencies;
do not add dependencies. Keep state in memory. Use appropriate existing components where they
fit. The screen must work with a keyboard and at 390px and 1280px viewport widths. Give controls
clear names, make related fields understandable, and preserve visible focus. Use a coherent light
appearance. Do not copy another application's implementation or inspect files outside this app
and its installed dependencies. Run the provided type and build checks and fix failures. Briefly
report completion and any known limitations.

No instructions name the package's guidance files or expected components. Each fixture offers
the same browser inspection tool. The evaluator provides no mid-run component advice.

## Task 1: notification preferences

Build a notification preferences screen. It has an immediate on/off setting for desktop alerts
and separately saved email digest preferences. Changing desktop alerts updates its visible state
immediately without saving the digest form. The digest form contains a required recipient email
address and a choice of daily, weekly, or never. Start with alex@example.test and weekly. Save
commits the form and shows the saved values; editing afterward leaves the saved summary unchanged
until another save. Invalid or empty email must prevent saving and explain the problem. Include a
reset action that restores the initial digest defaults without changing desktop alerts. Keep the
saved summary visible while editing. Do not implement notification delivery or persistence.

Assessment checks:

- Immediate setting and submitted settings have independent state and appropriate semantics.
- Recipient label and validation feedback are associated with the input. Empty and malformed
  email cannot commit. Native validation is acceptable.
- Exactly one digest frequency can be selected. A visible exclusive set, segmented choice, or
  finite select can be appropriate if labels and meaning remain clear; a command menu is not a
  value selector.
- Submit, editing after submit, and reset follow the requested state behavior.
- The user can complete the task by keyboard at both widths, without clipping essential controls.

## Task 2: equipment register

Build an equipment register for these records: EQ-1, Atlas pump, Operations, Active; EQ-2,
Beacon sensor, Maintenance, Paused; EQ-3, Cedar valve, Operations, Active; EQ-4, Delta meter,
Maintenance, Active. Let users search names and compare name, owner, and status. Show an explicit
no-results message when appropriate. Each record has an Edit action that opens a focused editor
for its name. Save updates the record; Cancel leaves it unchanged. Each record also has a Delete
action that requires an explicit confirmation naming that record. Cancellation must be the safe
initial choice. After saving or cancelling, return focus to a useful location. After deletion,
move focus to a remaining record action or a stable register control. Do not implement a backend.

Assessment checks:

- Search filters records and distinguishes no results from an empty register.
- The collection exposes the requested comparisons; semantic tables and appropriately structured
  lists are acceptable. Layout tables are not.
- Editing and deletion have distinct purposes. Edit cancellation preserves data. Only explicit
  confirmation deletes the named record.
- Focus enters and remains in any modal editor/confirmation, dismissal works, and focus returns
  to a useful target including after the original row disappears.
- The register is keyboard operable and fits or provides deliberate usable scrolling at both
  widths. Status meaning is available as text, not color alone.

## Task 3: weekly usage report

Build a weekly usage report for Monday through Sunday with daily values 12, 18, 15, 23, 21, 28,
and 24 kWh. Show the ordered trend, current day's value, and an exact readable list or table of all
values. Do not imply that higher usage is good or bad. Add a report-state selector for Ready,
Loading, Empty, and Error so the screen can demonstrate each state. Loading indicates ongoing
work without inventing progress. Empty explains that no measurements are available. Error gives
a persistent explanation and a Retry action that returns to Ready. Unavailable states must not
present the ready dataset as current data. Do not add remote fetching or simulated timers.

Assessment checks:

- Marks express ordered numeric values with correct order, scale, and units; exact values are
  readable without pointer interaction. A line, column, or appropriately contextualized compact
  trend can be acceptable. Part-to-whole and unrelated numeric axes are not.
- Original rubric expected 24 kWh with its day clear. The prompt did not define current day;
  the assessment accepts a clearly labeled local weekday or Sunday. Meaning is independent of color.
- All four states are reachable and match their stated meaning; Retry returns to Ready.
- State selection uses value-selection semantics. Feedback distinguishes loading, absent data,
  and failure. Essential error information does not disappear on a timer.
- Keyboard operation and readable content work at both widths.

## Recording outcomes

For every check, record pass, fail, or unverified with evidence. A build passing is not evidence
of interaction or semantic correctness. Keep authoring tokens and evaluator tokens separate.
Report task completion, semantic mistakes, missed suitable library behavior, discovery path,
input/output/cached tokens as supported by the runner, tool calls, repair attempts, and final
consumer source/CSS size. Preserve the actual output, including failures.

The reported code metric excludes identical starting scaffolding. It includes authored data
literals, task-specific adapters, copy, and styling. This differs from the initial intent to
exclude provided data; all conditions use the same counting rule. Do not credit an incomplete task as a code or token saving.
The first nine runs provide case evidence only, not a reliable frequency estimate. If changes
are tuned to these tasks, disclose that the improved-condition comparison is not a held-out
generalization test.
