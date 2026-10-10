# Natural guidance discovery test

Frozen before authoring. Question: with only an instruction to use the installed library, do
agents discover and use its static references or optional batch lookup, and does that reduce
total authoring usage?

Run two fresh attempts per condition on the existing profile-editor task: React/CSS, current
package, compact static references, and compact references plus installed lookup. Runtime JS,
CSS, component APIs, dependencies, and the package README are identical across library conditions.
The static variants replace the index and install usage/full/prop pages inside the package.
The lookup variant adds a package bin, generated topic data, and a short command description
in the package index. These are disposable package variants, not production changes.

Prompts identify only the installed library, with no documentation paths, command hints, forced
component choice, or explanation of the variants. Fixture names and agent task names are neutral.
Agents may inspect installed dependencies. They must not inspect the source repository, another
trial, or retained evidence. All use the same inherited model and effort. Disable parent-history
forking. Use normal package README discovery, without custom agent instructions in the fixtures.

Use the same brief and scaffold in all eight attempts. Require `npm run check`; prohibit extra
authored test files or browser self-checks equally, since the independent evaluator supplies
interaction checks. Count discovery, implementation, type/build checks, failures, and repairs.
After independent checks, allow one objective repair message per failed attempt. Never tell an
agent which documentation or command to use in a repair. Retain all attempts and failures.
Stop after eight attempts and at most one repair per attempt. No maintenance stage or subjective
style scoring. Two repetitions of one task cannot establish a general success probability.

Preflight the installed runtime/peer resolution and lookup before authoring, including unknown
names/options. Freeze prompt, package, and checker hashes. Run in two batches with rotated
condition order to reduce simple cache/order effects. Keep cache accounting explicit; no price
claims. Capture provider input, output, cached input, uncached input plus output, tool requests,
elapsed time, consumer source tokens, and discovery/usage evidence from the scoped child logs.
Do not infer usage from a self-report or from a path merely appearing in a file listing.

Distinguish guide read, usage page read, prop-reference read, full-contract read, lookup discovery,
successful lookup execution, relevant lookup output, and actual library component use. Log the
route and unnecessary broad reads. A current guide read is not prototype uptake. A lookup name
in package metadata is discovery opportunity, not execution. Confirm imports and rendered
controls separately. Report both per-attempt results and condition totals; don't conceal failures.

Reuse the corrected T3 browser checker at 390px and 1280px. For this experiment, check the first
and last modal tab boundaries directly with trusted Tab/Shift+Tab rather than six arbitrary
cycles each. Keep all other behavior checks and wait for modal visibility before interacting.
Record tooling/evaluator failures separately and retry corrected evaluation without repairing
app code. Browser checks and prototype construction stay outside authoring token totals.

Retain all source as text, sanitized tool traces, prompts, usage timelines, hashes, and results
under `.work/agent-guidance-cost/discovery-evidence/`. Older evidence stays unchanged.
