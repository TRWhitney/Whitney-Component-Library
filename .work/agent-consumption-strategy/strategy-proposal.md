# Proposed agent consumption strategy

This proposal incorporates the [pilot](research/pilot-results.md) and the
[open-composition investigation](research/open-composition-investigation.md), and the
[board inspector comparison](research/board-inspector-results.md), and the
[creation/maintenance comparison](research/lifecycle-results.md). It is not an accepted
production implementation specification.

## Accepted outcome and boundaries

Help coding agents in consuming app repositories spend fewer tokens, write less consumer code,
and choose appropriate components more often than with React and CSS alone. The package is
already installed. Discovery must work through ordinary package inspection without external
agent instructions or mandatory integration.

Preserve application breadth. Consumers must remain free to build unfamiliar applications, such
as board-game simulators, using ordinary React, native elements, and their own behavior. New
composite components, application shells, and prescribed app templates are excluded from this
investigation. An optional tool must not define which applications the library supports.

A small comparative evaluation and targeted API simplification are authorized. This does not
create a recurring agent evaluation suite or release gate. Applications own routing, data,
persistence, domain behavior, and page composition. The existing component visual contract stays
in place; general restyling was not established as a requirement by the customization clarification.
Foundation Ticket 31 remains deferred.

## Evidence

The guidance pilot improved discovery and reduced consumer source in its sampled outputs, but
increased total tokens. A later compact form comparison showed only about 5% less composition/state
source with the library than with native HTML. The native browser already supplies much of that
form's behavior. Neither result demonstrates general token savings.

The API probe found concrete control-integration gaps, including unavailable refs and domain
handlers, silently discarded data attributes, and a native Dialog trigger that compiles but fails
at runtime. It did not support renaming `onPress` or value callbacks as the remedy. A custom board
works today with native cells and library controls around it.

The board-inspector Dialog extension saved 3.8% of concise reference source and 14% in the
completed agent output. Both APIs produced working custom board apps. Total tokens increased
87.8%, while uncached input plus output decreased 32.3%. One interrupted current-package attempt
required a disclosed follow-up. This supports a narrow integration fix, not general agent savings.

The tooling probe supplies focused selection and a valid fragment with little printed output.
It also demonstrates missing semantic diagnostics, uncertain provider ancestry, and the need to
abstain on unfamiliar interactions. There is no evidence yet that a generator beats an equally
good static example on total agent effort.

The later creation/maintenance sequence assumed a one-time instruction to use the library.
Both apps passed 26 initial and 64 maintenance scenarios. The library used 2.75 times the
cumulative tokens, with 20% less final app source and 43% less CSS. No external correction
round was needed. This result does not support the claim that maintenance repays initial cost.

The subsequent [optional-use maintenance comparison](research/maintenance-fixes-results.md)
left the testing helpers unused, so it did not answer whether using them helps. Whitney deferred
discoverability and required the [explicit-use comparison](research/maintenance-use-results.md).
Across two fresh pairs, actual use reduced total tokens by 17.9% and retained verification code
by 40.8%. Uncached input plus output rose 4.5%; time was roughly unchanged. All four apps passed
64/64 objective scenarios and builds. Retain the helper candidate on this bounded utility result;
general expected savings remain unproven.

The [second maintenance round](research/maintenance-archive-results.md) continued the same four
apps with archive/restore. All passed 112/112 independent scenarios and builds, with actual
utility reuse and identity preservation verified. Experimental used 6.2% more total tokens in
that round. Its cumulative advantage across both rounds fell to 7.5%; uncached input plus output
was 1.5% higher and time 8.5% longer. The maintenance scripts remain 26.4% smaller, but both sides
added nearly equal new verification code in round two. Keep the code-reduction candidate;
recurring token savings remain unresolved and do not justify expanding the helper API yet.

Human style/feel revisions are unmeasured. Whitney excludes operationalizing that subjective
feedback and wants lower usage in the general case. Use representative tasks with objective
correctness/layout requirements; do not assume missing human cost will reverse observed results.

## Recommended work

### Remove incidental package costs

Prioritize recurring costs demonstrated in the traces. Preserve the approved short README. Investigate smaller package listings and repetitive build
warnings. The temporary directive experiment is promising, but server/client compatibility must
be checked before adopting a distribution change. These changes support the strategy; output
character reductions alone are not measured authoring-token savings.

### Make partial adoption reliable

Define the direct-control access the package should promise: refs, stable targeting, safe consumer
attributes, and application event integration. Specify which element each capability addresses,
event ordering, and which accessibility/interaction properties remain owned. The tested controlled Dialog path lets native
board controls open an inspector and specify its return-focus target. Keep it as a narrow
candidate pending focus, direction, version, and nested-overlay decisions. It does not justify
a general rewrite of event props or application composites.

Use recorded mistakes to choose simplifications. Dynamic option arrays and Spinner's explicit
active flag caused actual pilot repairs. Determine whether simpler usage can preserve intended
minimum-option and inactive-state behavior. Retain useful press and value callback abstractions.

### Make existing capabilities cheap to learn

Show native form validation, FormData, reset, and native/custom composition in concise checked
examples. Keep setup separate from task-specific code. A board's custom cells are a valid consumer
choice, not evidence of missed library reuse.

Compare focused static references with one batchable installed-package lookup before supporting a
new command. Both should derive from canonical contracts and exact public types. Retrieve only
relevant examples and details; avoid forcing agents through a schema for describing whole apps.

Keep fragment generation optional if a comparison demonstrates value. Count all generated code
as consumer code. Do not introduce a general intent compiler. Any diagnostics must add information
beyond TypeScript, use high-confidence findings, and distinguish unknown from valid.

## Verification direction

Future comparisons should include extending an existing custom application while preserving its
layout and domain logic, plus a task where library-owned behavior removes substantial work.
Keep React/CSS as the comparator. Include discovery, tool input/output, repair effort, correctness,
and all consumer source. Accept native/custom interactions where they fit.

Future comparisons may assume a one-time project instruction to use this library, without
naming documentation paths or repeating that instruction in maintenance. Adoption is outside
the current comparison. Do not add subjective scoring or invent human revision rounds.

No additional agent trials are scheduled by this proposal. The retained runnable probes establish
feasibility and boundaries, not a reliable effect size. A bounded comparison should test one
resolved change at a time against the best concise guidance available.

## Decisions still needed

- The exact control-ref, attribute, event, and overlay-trigger contract.
- Whether dynamic option or Spinner changes preserve their intended behavior.
- Whether focused static guidance is sufficient or a package-local lookup earns its added cost.

Create production tickets after the relevant behavior is settled. No new composite, app template,
whole-app generation language, mandatory agent plugin, or general styling expansion is proposed.

## Continuation ticket

[Ticket 01](tickets/01-reduce-agent-lifecycle-cost.md) records the next bounded comparison and
recovery instructions. The [findings summary](research/findings-summary.md) consolidates completed
results. For this continuation, provide direct references and require actual proposed API/helper
use; discoverability remains deferred. The older discovery-oriented suggestions above do not
apply to this utility comparison.
