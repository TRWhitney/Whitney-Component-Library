# Why agents inspect runtime

The six metadata trials showed discovery reads, not debugging. All runtime reads preceded the
first app write/build. Four authors read runtime after usage/full guidance, one before usage
and one requested both together. None explained why. Incomplete guidance was not established
as the cause.

## Audit and findings

The investigation used the existing [metadata trials](agent-guidance-metadata.md), with no new
authors, app edits or package changes. It checked complete returned runtime/guidance bodies,
hashes and first-write ordering. Private reasoning and system/developer messages were excluded.

Tabs runtime appeared in all six attempts, SearchField in five and Table in four. Returned
runtime bodies totaled 11,525 `o200k_base` reference tokens. This is a file-body estimate,
not provider attribution or predicted savings. Runtime reads did not follow failed builds;
later failures concerned Button size or AppearanceProvider accent. One author already named
components and parent-owned state before reading runtime.

## Guidance and implementation

| Component   | Already in usage guidance                                                                                            | Concrete omission or ambiguity                                                | What runtime adds                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Tabs        | Stable ids, activation modes, selected panel, parent-owned persistent state, wrapper containment, no className/style | Automatic/horizontal defaults and first-enabled fallback are not explicit     | Default values and React Aria composition                                     |
| SearchField | Controlled value/onChange, clear availability, Enter/Escape callbacks, consumer-owned filtering                      | The minimal example is uncontrolled; no complete controlled-clear composition | Conditional clear button and callback forwarding to React Aria                |
| Table       | Consumer-owned sorting/filtering, descriptor feedback, action cells, widths and bounded scrolling                    | Toggle selection is not named, but these apps use selectionMode="none"        | Validation, DOM structure, selectionBehavior="toggle", React Aria composition |

This table describes the historical guide, before later Tabs wording adoption. Current text
is in [editorial guidance](../../scripts/agent-guidance/editorial.mjs); implementations remain
[Tabs](../../src/navigation/tabs.tsx), [SearchField](../../src/fields/search-field.tsx) and
[Table](../../src/collections/table.tsx). Full contracts describe broader responsibilities.
The wrappers delegate keyboard behavior, panel lifecycle and clear-event sequencing to React
Aria, so wrapper reads alone do not establish every underlying behavior.

The traces fit redundant verification but do not prove a habit, distrust or one unanswered
question. Passing apps establish completed correctness, not motivation. Requested-together
reads in particular do not show a decision that guidance was insufficient.

## Recommendation and later results

The recommended focused comparison made Tabs horizontal/automatic defaults and first-enabled
fallback explicit, and showed SearchField value/onChange/onClear with parent useState.
It left runtime, exact props, metadata, entry points and evaluation unchanged, constrained page
growth and supplied no runtime-avoidance instruction. Table selection details were irrelevant
because the task disabled selection. Completed total/uncached costs and correctness mattered
alongside runtime reads.

The [wording pilot](agent-guidance-wording.md) subsequently tested this recommendation and
found mixed costs. [Adoption](agent-guidance-proposal.md) later included shorter Tabs facts;
the expanded SearchField example remained a prototype. One task/model and six historical
attempts cannot establish causation or generalize motives.

Raw captures and one-off study tooling were removed. Exact historical replay is unavailable.
See the [evidence retention policy](agent-evidence-retention.md).
