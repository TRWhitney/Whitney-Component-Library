# Agent consumption strategy

## Destination

Reduce agent effort without restricting application breadth. Measure the benefit of actual
proposed API/helper use against React/CSS through creation and maintenance. Discoverability and
production adoption remain separate questions.

## Current state

The continuation is recorded in [Ticket 01](tickets/01-reduce-agent-lifecycle-cost.md). Start with the
[findings summary](research/findings-summary.md). No experiment yet compares the improved package
with fresh React/CSS controls across creation and maintenance.

The [initial pilot](research/pilot-results.md) completed nine apps. All sampled checks passed.
Guide discovery rose from none of three current-library runs to all three prototype runs; final
app/CSS source fell 32% versus React/CSS and 21% versus current. Total token use increased.
Semantic superiority and reliable savings were not established.

The [lifecycle comparison](research/lifecycle-results.md) passed 26 initial and 64 maintenance
scenarios per included condition. The current library used more cumulative tokens than React/CSS.
The excluded unused-library attempt and evaluator corrections remain described in the report.

The [optional-use maintenance trial](research/maintenance-fixes-results.md) increased tokens;
neither experimental author used the helpers. The [explicit-use comparison](research/maintenance-use-results.md)
then passed all 256 scenarios and four builds, with verified helper/event use. It reduced total
tokens 17.9% and verification code 40.8%, but uncached input/output rose 4.5%.

The [archive round](research/maintenance-archive-results.md) passed all 448 scenarios and four
builds, with identity and utility-reuse review. Experimental used 6.2% more tokens in that round.
Across both rounds it used 7.5% fewer tokens, 1.5% more uncached input/output and 8.5% more time.
Final verification code was 26.4% smaller; new verification growth was nearly equal. Reliable
continuing savings remain unresolved.

## Useful prototypes and limits

The [open-composition investigation](research/open-composition-investigation.md) supports bounded
DOM interoperability, focused retrieval and concrete API fixes. Native/custom React composition
remains available. Broad API renaming, reskinning, templates and whole-app generation were not
supported. The exact ref/attribute/event/trigger contract remains unsettled.

The [API](research/api-probe.md), [tooling](research/tooling-probe.md) and
[adoption](research/adoption-probe.md) probes retain standalone source. Their historical checks
covered 53 type expectations, 16 selection cases, six pilot audits, four compilation fixtures
and sampled keyboard/interaction behavior at 390px and 1280px. The temporary styling experiment
was inconclusive and stopped after Whitney clarified that customization means application breadth.

The [board comparison](research/board-inspector-results.md) passed 128 checks per reference and
140 per agent output, plus a standalone StrictMode/type proof. The extension reduced reference
source 3.8% and completed app source 14%, but increased total tokens 87.8%; uncached input/output
fell 32.3%. One interrupted attempt lacked usage. These single runs do not establish savings.

Package maintenance prototypes retain the event patch and testing helpers. Historical checks
covered strict event typing, Chromium activation, unchanged bundles, React DOM SSR/hydration,
12 helper cases and six consumer scenarios. Actual RSC framework compilation remains unverified.
Warning output depends on the transitive Rolldown version.

## Retention and authority

Reports, briefs, protocols and useful source remain. Raw captures, snapshots, proof fixtures and
obsolete replay setups were removed under the
[retention policy](../../docs/research/agent-evidence-retention.md). Historical validation and
review findings are written observations; old app/token results cannot be independently replayed
from this tree. Earlier formatting, lint, type/build and generated-artifact checks passed at
delivery. This cleanup did not rerun the experiments.

Whitney authorized the small comparative evaluation, targeted API investigation, actual-use
comparisons and a durable continuation ticket. They excluded composite apps, prescribed templates,
recurring evaluation/release gates and subjective scoring. Human style/feel revision costs remain
unknown. The [agent contract](../library-foundation/decisions/04-agent-contract.md),
[canonical contract ADR](../../docs/adr/0004-publish-canonical-component-contracts.md) and
[composition boundary](../library-foundation/decisions/16-reusable-composite-boundary.md) apply.

No production component, showcase or build behavior changed in these experiments. A future bounded
comparison must create fresh fixtures from the retained source, freeze its own environment and
report changed baselines. Ticket 01 records the accepted comparison boundaries.
