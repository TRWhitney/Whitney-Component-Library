# Local tooling experiment

## Question and result

Can a small deterministic package-local helper provide component selection, exact usage, or misuse diagnostics with much less printed output than the current guide, while leaving application structure and novel interactions to the consumer?

The experiment supports this for a narrow, explicitly described choice. One RadioGroup selection answer prints 608 characters. Its compilable fragment prints 741 more, for 1,349 combined. The pilot guide index alone has 11,006 characters. These outputs cover different amounts of information. The result establishes a cheaper focused lookup, not reduced end-to-end agent tokens, smaller applications, or better semantic correctness.

The diagnostic catches concrete private-DOM dependencies in actual pilot code. It also misses deliberately incorrect semantics and reports uncertainty for valid components whose provider lives elsewhere. It is a bounded inspection aid, not a correctness gate.

No product direction, public API, or prototype acceptance follows from this experiment. Production files and package configuration remain unchanged.

## Scope and sources

The helper reads the current [manifest](../../../dist/manifest.json). Its selection predicates are handwritten from the choice and selection contracts. The [contract schema](../../../src/contracts/component-contract.ts) stores suitability, events, composition, and state guidance as prose arrays. It has no structured selection predicates or diagnostic rules to execute. Copying prose into a shorter answer is automatic; deciding what predicates mean requires maintained metadata or code.

The exact fragment follows [choice types](../../../src/choices/choice-types.ts). RadioGroup options form a nonempty tuple, controlled selection may be a value or null, and its callback returns a value. SegmentedControl requires at least two options and disallows descriptions. [Selection types](../../../src/selection/selection-types.ts) separately require an empty message for Select and ComboBox, allow null in selection callbacks, and separate ComboBox input text from selection. Those differences limit how far a generic fragment emitter can go without component-specific knowledge.

The experiment uses repository commit `2488a0e1c0f6422b77e1791ea1e5e7aef27e0a29`, installed Node and TypeScript, and the existing built package declarations. [Evidence](../prototypes/tooling-probe/evidence.json) records runtime versions and SHA-256 hashes for inspected build inputs. It uses no network service or LLM call. No new dependency was installed. The runner uses the existing Prettier dependency to keep its saved evidence formatted and checks that the emitter itself returns formatted TypeScript. The prototype currently imports the repository's TypeScript development dependency even for selection. A shipped helper's dependency and distribution boundary remains an open implementation choice.

The stopping condition was a runnable selector, one emitted and compiled fragment, audits of the six library pilot apps, and cases exposing false positives, missed errors, and abstention. All are complete. This was a CLI question, so the artifact has no visual layout or interactive UI to evaluate.

## What runs

[probe.mjs](../prototypes/tooling-probe/probe.mjs) provides two commands.

- `choose` accepts structured intent, cardinality, application timing, display preference, description needs, and custom-text needs. It selects among seven existing choice and selection controls. Missing information produces `needs-input`; contradictions produce `conflict`; unsupported interactions produce `outside-scope`. It returns the selected export and focused guidance from the manifest.
- `audit` scans named package imports, literal JSX attributes and labels, CSS attribute selectors, and file-local provider presence. It reports file and line information plus the scope of what it did not inspect.

`choose --fragment` emits one fixed RadioGroup usage example with consumer-owned options and state. It supplies exact imports, the required label, tuple inference, nullable state, and callback wiring. It contains no application shell, layout, persistence, form workflow, or new library component. It expects an AppearanceProvider supplied by the host, and says so in the output. It is ordinary consumer code the consumer can edit or ignore.

Stable feedback identifiers are the command names, result `status`, selected `export`, and diagnostic `code`. This allows discussion of CLI behavior without adding a UI solely for the experiment.

Run from the repository root with existing dependencies installed:

```sh
node .work/agent-consumption-strategy/prototypes/tooling-probe/run.mjs
```

The runner exercises 16 selection cases through the CLI, writes the fragment and evidence inside the prototype directory, compiles four files, and audits all six library pilot apps. It finishes in roughly five seconds in the current environment. It does not invoke package builds or mutate pilot source.

Individual commands:

```sh
node .work/agent-consumption-strategy/prototypes/tooling-probe/probe.mjs choose '{"intent":"value","cardinality":"one","display":"visible","details":true}'
node .work/agent-consumption-strategy/prototypes/tooling-probe/probe.mjs choose '{"intent":"value","cardinality":"one","display":"visible","details":true}' --fragment
node .work/agent-consumption-strategy/prototypes/tooling-probe/probe.mjs audit .work/agent-consumption-strategy/research/pilot/baseline-1/src/app.tsx .work/agent-consumption-strategy/research/pilot/baseline-1/src/styles.css
node .work/agent-consumption-strategy/prototypes/tooling-probe/probe.mjs choose '{"intent":"board-game-move-target","cardinality":"one","display":"visible"}'
```

The final command returns `outside-scope`, no suggested export, and the explicit statement that native or custom interactions remain available. A board-game move target is not treated as a RadioGroup merely because it selects one square. The helper does not restrict the vocabulary or architecture of applications using the library.

## Measurements

Character counts use JavaScript string length and include the printed newline. They are not token counts.

| Output                                               | Characters |
| ---------------------------------------------------- | ---------: |
| RadioGroup selection with focused contract guidance  |        608 |
| Generated RadioGroup consumer code                   |        741 |
| Selection plus fragment                              |      1,349 |
| Selection plus fragment plus audit of that fragment  |      1,933 |
| Current guide prototype index, from pilot            |     11,006 |
| Baseline index, from pilot                           |     27,173 |
| Helper implementation source, not printed during use |      9,055 |

All 741 generated characters count as consumer code. Generation changes who writes them; it does not remove them. No source-size saving was measured against an agent-written equivalent. The 1,349-character output is about 88% smaller than the guide index, but the guide covers the package while this answer covers one declared choice. Finding the tool, learning the schema, command inputs, repeated queries, tool source inspection, and follow-up documentation can erase some or all of that advantage. The example fragment command itself is 166 characters. There was no fresh agent trial of tool discovery or total task cost.

The generated fragment and all three synthetic fixtures compile under strict TypeScript with `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`, using actual package declarations. Repository Prettier and ESLint checks pass for the owned artifact files. The runner regenerates formatted evidence and source. Zero compile diagnostics is evidence for API compatibility of the inspected example. The semantically wrong fixtures also compile.

## Actual pilot audits

| Pilot                | Printed characters | Findings                                                                         |
| -------------------- | -----------------: | -------------------------------------------------------------------------------- |
| Baseline preferences |              1,042 | Private provider attribute, provider not verified locally, private CSS selectors |
| Baseline register    |                573 | Provider not verified locally                                                    |
| Baseline report      |                547 | Private CSS selectors                                                            |
| Improved preferences |                320 | No findings in the checked categories                                            |
| Improved register    |                320 | No findings in the checked categories                                            |
| Improved report      |                320 | No findings in the checked categories                                            |

The [baseline preferences source](pilot/baseline-1/src/app.tsx) writes `data-wcl-provider` on a div. That does not instantiate AppearanceProvider. Its [CSS](pilot/baseline-1/src/styles.css) targets private component attributes. The audit observes both. A `provider-unverified` result only says no provider JSX appears in that file. It does not prove the rendered component lacks an ancestor provider.

The improved register's focus restoration uses delayed DOM queries. The audit returns no findings for it. This tool does not assess whether its focus behavior is correct, solve the earlier Table interaction difficulty, or detect unnecessary native reimplementation. Those questions require separate investigation and interaction checks.

## Negative evidence and composition boundaries

[Fixtures](../prototypes/tooling-probe/fixtures/negative.tsx) expose both a literal empty label and a submitted acknowledgement implemented with Switch. The audit catches the empty label through an aliased named import. It misses the acknowledgement semantics. The same file includes a provider in an unrelated component, which suppresses the local-provider warning without establishing actual ancestor coverage.

The [ancestor fixture](../prototypes/tooling-probe/fixtures/ancestor.tsx) can be valid when rendered by a host with AppearanceProvider, but receives `provider-unverified`. The [dynamic-label fixture](../prototypes/tooling-probe/fixtures/dynamic.tsx) computes an empty label; the literal-only check misses it. CSS scanning is lexical and can match comments. Namespace imports, wrappers, spread props, runtime values, shadowing, portal relationships, and cross-file ancestry are outside this probe's analysis.

The selector only knows what the caller declares. It refuses to choose Switch versus Checkbox without immediate/submitted intent. It rejects per-option descriptions for SegmentedControl, abstains on searchable multiple selection, and abstains when custom text is a valid value. It cannot determine whether an agent has described the actual task honestly or correctly. The 16 cases verify the handwritten rules against their own expected branches, not general selection accuracy or an independent semantic benchmark.

Application layout, native elements, domain models, data flow, server state, and new interactions remain consumer decisions. The helper does not introduce an app template or form-only runtime abstraction. Its fragment is a local usage example, not a complete screen. Choosing RadioGroup for a settings question inside a board-game simulator does not imply the simulator's board, moves, or game state should use library controls.

The tool may be useful as optional focused lookup and diagnostics with explicit uncertainty. Turning these observations into a supported package command would require deciding its coverage and maintaining structured rules alongside changing types and contracts. This experiment does not settle whether that maintenance cost beats concise static examples and ordinary TypeScript checks.

## Unsettled decision

The factual result supports further comparison of an optional helper with focused static guidance. The user still owns whether to adopt a tool and which tasks warrant supported rules. The prototype has no accepted contract and should not be treated as production work or as evidence that any whole application can be generated correctly.
