# Explicit guidance pilot

## Outcome

The six-author experiment is complete. The explicit group returned no runtime/CSS, versus two
control authors. Completed total tokens rose 3.9%; uncached input plus output fell 12.7%.
The result was mixed and no production wording was adopted.

The [report](../../docs/research/agent-guidance-wording.md),
[protocol](../../docs/research/agent-guidance-wording-protocol.md), [specification](spec.md) and
[ticket](tickets/01-wording-pilot.md) preserve the outcome. The
[runtime investigation](../../docs/research/agent-guidance-runtime-reads.md) motivated the test.

## Historical validation

Both archives clean-installed with React 19.2.8 and passed all 85 props closures, nine examples,
links, types and consumer builds. Only two usage pages differed; all 1,043 other files matched.
The source-size budget passed. Six author checks eventually passed and all 288 primary browser
assertions passed without app repairs. Three partial browser tool runs were reported separately;
the final ledger reused initial results rather than another browser execution.

Analyzer, nine source-hash checks, twelve sanitized trace checks, Python parsing, experimental
JavaScript lint, formatting, links and credential scan passed. Comparison HTML passed checks of
16 states and six rows at 728px light and 360px dark. Independent intent and engineering review
passed with no findings. Prelaunch setup corrections did not change author package or prompt
bytes. The evaluation host was stopped.

Raw captures, comparison HTML and obsolete replay tooling were removed under the
[retention policy](../../docs/research/agent-evidence-retention.md). These are historical checks;
the old apps and traces cannot now be audited from this tree. No accepted work remains.
Confirmation tests, production adoption, metadata/runtime/API changes, extra authors and
publication were outside this experiment.
