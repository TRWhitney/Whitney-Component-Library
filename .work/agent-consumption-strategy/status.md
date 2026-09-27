# Agent consumption strategy

## Destination

Improve the library so app-repository agents spend fewer tokens, write less consumer code, and
choose appropriate components more often than with React and CSS alone. This pass precedes
foundation Ticket 31.

## Current state

The research and handoff are complete for this delivery. Further efficiency work remains open.
Continuation is recorded in [Ticket 01](tickets/01-reduce-agent-lifecycle-cost.md), ready for an
agent to resume planning. Start with the [findings summary](research/findings-summary.md). The
next comparison must measure the improved package against React/CSS through creation and
maintenance; the latest experiments compared two library versions only.

The second maintenance round is complete. Archive/restore reused each app's existing
verification code. All four apps passed 112/112 independent scenarios and builds; identity and
actual new-case utility reuse passed review. Experimental used 6.2% more total tokens this round.
Across both rounds it used 7.5% fewer total tokens, 1.5% more uncached input plus output, and
8.5% more time. Maintenance scripts remain 26.4% smaller, but this round's verification growth
was nearly equal. See the [results](research/maintenance-archive-results.md) and
[protocol](research/maintenance-archive-protocol.md). Discovery is deferred; production is unchanged.

Earlier results are retained in the [lifecycle report](research/lifecycle-results.md). General-case
usage reduction remains the target. This comparison assumes one initial choice of library and
excludes subjective feedback.

## Progress

- Narrowed the foundation's blanket agent-output-evaluation exclusion to allow this small pass.
  The updated specification, agent contract, architecture decision, and Ticket 32 preserve the
  exclusion of recurring evaluation infrastructure and release gates.
- Audited the 85 canonical contracts, installed guidance, public declarations, and existing
  workbench compositions. The current package omits the individual human-facing contract pages
  and requires broad reads for some usage questions.
- Ran identical task briefs against React/CSS, the current library, and a package-guidance
  prototype. All nine apps completed and passed the sampled independent browser checks.
- The prototype guide was found in all three trials, against none for the current guide. Final
  app/CSS source was 32% smaller than React/CSS and 21% smaller than the current library overall.
  Total token use increased. Semantic superiority and reliable savings are not established.
- Verified that all 85 experimental extracted prop references compile. The prototype changes no
  shared runtime JavaScript or CSS.
- A separate temporary-package experiment reduced one Vite build's output from about 46,000 to
  1,000 characters with identical emitted app JavaScript and CSS. Server/client compatibility
  still needs verification before adopting the change.

See the [pilot report](research/pilot-results.md) for measurements, traces, checks, limitations,
and reproduction details. The [protocol](evaluation-proposal.md) records the completed comparison.

## Frontier

The [follow-up investigation](research/open-composition-investigation.md) supersedes the earlier
recommendation to prioritize larger compositions. Whitney excluded new composite components and
clarified that customization means freedom to build different kinds of applications. Ordinary
React, native elements, and custom domain interactions must remain available.

The evidence favors bounded control interoperability, specific API friction, and focused retrieval.
It does not justify wholesale native-prop renaming, general restyling, or an intent-to-UI compiler.
The exact ref/attribute/event/trigger contract is unresolved. Optional generation and diagnostics
remain unproven against equally good static examples.

The [API probe](research/api-probe.md), [tooling probe](research/tooling-probe.md), and
[adoption probe](research/adoption-probe.md) retain runnable evidence. No public component or
production build change was made. The later authorized board-inspector test ran two completed
agent attempts and retained one interrupted current-package attempt. See the
[comparison report](research/board-inspector-results.md). The extension reduced reference source
by 3.8% and completed agent source by 14%, but increased total tokens by 87.8%. The uncached-input
plus output measure fell 32.3%. These single runs do not establish reliable savings.

## Accepted sources

- Whitney requested a durable continuation ticket and findings so the next agent can build on
  this work. Ticket 01 records that handoff; no new experiment ran while documenting it.
- Whitney requires measuring the benefit of actual API/helper use in this pass. Provide direct
  references and require relevant use; discoverability is deferred.

- Whitney authorized a small comparative evaluation, an installed-package app-repository
  workflow, and React/CSS without another component library as the comparator.
- Whitney authorized targeted API simplification supported by findings.
- Whitney requires discovery without explicit outside instructions.
- Whitney approved the README with only the wording needed to make its intent clear.
- Whitney authorized investigation of API familiarity, customization, optional generators,
  selection, and diagnostics, excluding the composite-component suggestion.
- Whitney clarified that application breadth, including novel apps such as board-game simulators,
  is the customization requirement. This does not authorize general component restyling.
- Whitney clarified that this lifecycle comparison assumes one initial instruction to use the
  library; unprompted adoption is outside its scope. They also require acknowledging that human
  style/feel review and resulting revisions are missing from agent-only cost measurements. They
  subsequently excluded operationalizing subjective feedback; use repeatable objective checks.
- Whitney authorized testing the proposed board-inspector comparison with the current API and
  a small experimental Dialog extension. Production adoption remains undecided.
- [Agent contract](../library-foundation/decisions/04-agent-contract.md).
- [Canonical contract architecture](../../docs/adr/0004-publish-canonical-component-contracts.md).
- [Reusable composite boundary](../library-foundation/decisions/16-reusable-composite-boundary.md).

## Verification

Delivery checks pass: `npm run format:check`, `npm run lint`, `npm run typecheck`,
`npm run check:generated`, and the staged whitespace check excluding captured pilot evidence.
The full staged whitespace check reports original terminal-output whitespace in captured evidence;
those bytes are preserved rather than reformatted. All 173 local links in maintained research
documents resolve; retained Python scripts parse. A credential-pattern scan found no matches.
Captured archive-checker result JSON is also excluded from formatting to preserve its bytes.
Independent intent and engineering reviews both passed with no findings.
No additional authoring trials or browser evaluations ran for this delivery.

The baseline passed generated-artifact checks before packing. All trials passed authoring type
and build checks. Independent browser scripts checked selected interactions at 390px and 1280px;
these are not complete accessibility or visual audits. The report records evaluator corrections,
ambiguous requirements, and authoring-port interference. No coordinator repairs changed trial app
code. A dry-run package includes README and its linked guide; the setup example compiles against
the installed baseline. Repository formatting and stylesheet lint checks pass. Code lint initially found only prototype
issues; those were fixed and the affected scripts/configurations pass. `git diff --check` passes.
Raw evaluation outputs are excluded
from formatting and linting so their contents remain unchanged.

The follow-up API probe passed 53 type expectations and browser checks. The tooling probe passed
16 selection cases, six actual pilot audits, and four compilation fixtures, including negative
semantic cases that expose the tool's limits. Native/library preferences and the custom board
passed sampled keyboard and interaction checks at 390px and 1280px. A temporary styling patch
remained inconclusive for exact appearance and was not adopted. See the linked reports for scope.
The new prototype scripts pass code lint, the adoption stylesheet passes style lint, and owned
reports/prototypes pass formatting and link checks. `git diff --check` passes.

The board-inspector references passed 128 independent checks each; all three agent outputs
passed 140 each at 390px and 1280px with zero page errors. The experimental extension also
passed its standalone StrictMode/type proof. Source, token, interruption, and compatibility
limits are recorded in the comparison report. Production components remain unchanged.

The lifecycle comparison passed 26 initial and 64 maintenance scenarios per included condition,
with no external correction rounds and passing final type/build checks. Its report retains the
excluded unused-package attempt and evaluator corrections. Scripts pass syntax/lint/format
checks; local links and `git diff --check` pass.

The maintenance-fix package passed strict event typing, Chromium activation, identical initial
bundles and current/fixed SSR/hydration checks. Helpers passed 12 positive/negative checks and
six unchanged consumer scenarios. All four authoring attempts and independent builds completed;
primary browser results and focus timing diagnostics remain separate. Full report retains exact
usage, source sizes, toolchain and package hashes. No production behavior changed.

The explicit-use comparison passed all 256 independent scenarios and four builds with unchanged
source hashes. Both experimental runs passed separate actual-use validation. Frozen package
hashes match the prior experiment; prompts and installed helpers remained unchanged. Integration
and self-repair tokens are included. Source, traces, screenshots and measurements are retained.

The archive round passed all 448 independent scenarios and four builds. Both conditions reused
existing verification utilities in new cases. Source identity review, source hashes, frozen
checker hashes, seed continuation, prompt hashes and installed helper bytes were verified.
The new archive checker passed a full native reference, tab/radio variants and twelve deliberate
negative mutations before authoring. Maintained prototype code/style/format checks pass; captured
evidence remains unchanged.

## Out of scope

Publication, foundation Ticket 31 implementation, a recurring agent evaluation suite, mandatory
consumer agent instructions, new composite components or app shells, prescribed app templates,
a whole-app generation language, and application-specific data or routing abstractions. No production
component or build behavior changed during this pass.

## Continuation

Branch: `main`. Research baseline: `2488a0e`. This delivery commits the effort directory,
the approved README, foundation/architecture boundary updates, and evidence exclusions in the
formatting and lint configurations. Experimental app dependencies and tarballs remain outside
the repository; retained evidence contains their hashes, source, prompts, events, and results.
The continuation ticket remains ready for future research. Completing this handoff does not
establish the library's efficiency goal or approve prototype APIs for production.

Resume with
`python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work planning`.

Next action: resume [Ticket 01](tickets/01-reduce-agent-lifecycle-cost.md). Recover the retained
prototype, freeze a bounded improved-package versus React/CSS lifecycle comparison, and use its
traces to identify the next avoidable cost. The ticket records actual-use requirements, environment
constraints and temporary-path recovery hazards. Discovery and production adoption remain separate.
No additional trial or production change was made while documenting and delivering this handoff.
