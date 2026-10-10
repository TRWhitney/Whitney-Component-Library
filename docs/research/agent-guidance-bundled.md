# Bundled static guidance results

Bundled pages were smaller, but this pass did not establish cheaper library authoring.
Completed total tokens were 9.9% below current and 17.9% below earlier static pages. Only 2/6
bundled agents read a page, uncached input plus output was 0.7% above current, and total was
2.55 times React/CSS. The original decision retained the candidate for review.

## Comparison

The [protocol](agent-guidance-bundled-protocol.md) specified 24 fresh gpt-6.1-sol/high agents:
three tasks, four conditions, two repetitions. Tasks were profile dialog, validated contact
form and searchable/sortable directory. Conditions were React/CSS, current package, earlier
static usage with separate props, and bundled usage/props/examples. Orders rotated, but starts
overlapped and were not a randomized cache experiment. Briefs supplied no guidance paths or
component choices. Authors edited app/CSS and ran matching type/build checks.

Only the 85 usage bodies differed between Static and Bundled. Eight shared components had
short reviewed behavior and minimal examples; the other 77 retained canonical usage/access
facts and a first example. All had exact prop dependencies and full-contract fallbacks.
Historical byte checks matched 201 runtime JS/CSS and 195 declaration files, README and all
18 installed copies. No production changes occurred in this study.

## Completed costs

Each row sums six attempts including repairs. Total is provider input plus output, including
cache and reasoning once. Uncached input plus output is a diagnostic, not a price. Failed
reads/builds, inherited instructions and repairs are included; preparation/evaluation/analysis
are excluded. Reference counts use tiktoken 0.12.0, `o200k_base`.

| Condition                     | Input     | Cached input | Output | Total     | Uncached input + output | App/CSS tokens |
| ----------------------------- | --------- | ------------ | ------ | --------- | ----------------------- | -------------- |
| React/CSS                     | 527,225   | 474,880      | 17,497 | 544,722   | 69,842                  | 10,768         |
| Current package               | 1,521,475 | 1,354,112    | 17,203 | 1,538,678 | 184,566                 | 6,776          |
| Static pages + separate props | 1,670,516 | 1,490,816    | 18,066 | 1,688,582 | 197,766                 | 6,965          |
| Bundled pages                 | 1,370,175 | 1,200,768    | 16,453 | 1,386,628 | 185,860                 | 6,825          |

| Condition                     | Initial total | Repair total | First check | Final check | Outer tool requests | Active seconds |
| ----------------------------- | ------------- | ------------ | ----------- | ----------- | ------------------- | -------------- |
| React/CSS                     | 475,446       | 69,276       | 5/6         | 6/6         | 21                  | 322.18         |
| Current package               | 1,538,678     | 0            | 6/6         | 6/6         | 46                  | 382.40         |
| Static pages + separate props | 1,344,691     | 343,891      | 4/6         | 6/6         | 50                  | 382.48         |
| Bundled pages                 | 1,386,628     | 0            | 6/6         | 6/6         | 44                  | 358.85         |

Bundled initially cost 3.1% more total than Static. Static's two directory repairs added
343,891 total but 14,035 uncached input plus output tokens, reversing the completed comparison.
Bundled made only two fewer outer tool requests than Current across six attempts.

| Task      | React/CSS total | Current total | Static total | Bundled total | Bundled uncached + output |
| --------- | --------------- | ------------- | ------------ | ------------- | ------------------------- |
| overlay   | 151,312         | 479,657       | 376,795      | 548,288       | 71,232                    |
| form      | 170,334         | 372,145       | 354,535      | 363,967       | 61,375                    |
| directory | 223,076         | 686,876       | 957,252      | 474,373       | 53,253                    |

Bundled cost 14.3% more than Current on overlay, 2.2% less on form and 30.9% less on directory.
Uncached input plus output was higher on overlay and form. All library conditions used smaller
app/CSS than native but more completed total and uncached tokens.

## Uptake and correctness

| Condition                     | Read index | Read usage page | Read runtime JS/CSS | Read complete contract |
| ----------------------------- | ---------- | --------------- | ------------------- | ---------------------- |
| React/CSS                     | 0/6        | 0/6             | 0/6                 | 0/6                    |
| Current package               | 4/6        | 0/6             | 6/6                 | 0/6                    |
| Static pages + separate props | 4/6        | 5/6             | 5/6                 | 2/6                    |
| Bundled pages                 | 1/6        | 2/6             | 6/6                 | 0/6                    |

The Static/Bundled indexes matched, so page wording cannot explain the initial route choice.
All bundled authors read runtime; the two page readers also inspected declarations/runtime.
Earlier 2/2 static uptake did not persist. Comparing only readers would select by behavior
after assignment and would not establish causation.

All 18 library apps used appropriate public components. Type/build feedback caught four apps'
invalid props before browser evaluation, including Button size "small", a missing EmptyState
description and a non-hex accent. Those fixes remain in initial totals.

Initial browser checks passed 1,080/1,088 assertions, with 21/24 apps fully passing. Static
09/24 repaired narrow viewport overflow; native22 repaired overflow and selected-Grace status.
Repairs passed 144/144; final primary checks passed 1,088/1,088. Current/Bundled passed initially.
Checks ran at 390px and 1280px, 48 per overlay/directory and 40 per form.

The adapter mapped unsupported label locators to named controls and clicked nested sort buttons.
A form assertion falsely matched introductory copy; evaluation was corrected consistently to
check linked control errors and visible alerts, without app repair or changed acceptance.
One partial check was interrupted by human input and rerun. Corrected reruns/partial checks
were outside author totals and not counted twice in the primary set.

## Reference size and decision

These budgets compare Static usage plus exact dependencies with Bundled pages, excluding the
identical index and full fallback. They measure a reading budget rather than actual uptake.

| Core task references | Static usage + props | Bundled pages | Reduction |
| -------------------- | -------------------- | ------------- | --------- |
| overlay              | 2,589                | 1,509         | 41.7%     |
| form                 | 2,416                | 1,451         | 39.9%     |
| directory            | 4,861                | 3,269         | 32.8%     |

| Component          | Static usage + props | Bundled page | Reduction |
| ------------------ | -------------------- | ------------ | --------- |
| AppearanceProvider | 458                  | 198          | 56.8%     |
| Button             | 625                  | 337          | 46.1%     |
| Checkbox           | 570                  | 355          | 37.7%     |
| Dialog             | 743                  | 413          | 44.4%     |
| SearchField        | 730                  | 507          | 30.6%     |
| Table              | 2,345                | 1,780        | 24.1%     |
| Tabs               | 703                  | 447          | 36.4%     |
| TextField          | 763                  | 561          | 26.5%     |

The candidate combined key behavior, one minimal JSX example and exact props; setup moved to
the shared index, and full contracts retained selection advice and unusual states. All 85
props/fallbacks and eight examples passed preflight. A TextField `type="email"` mistake was
corrected to `inputType` before authors ran. Table's exact dependent types remained large.

Two repetitions per task, variable read routes, cache/overlap, inherited instructions and
repair effects limit inference. Sampled correctness is not a complete accessibility audit.
The next proposal was declaration pointers where agents already looked. The
[pointer study](agent-guidance-pointer.md) tested that; [integration](agent-guidance-proposal.md)
records subsequent adoption without claiming savings over native.

Raw captures and one-off study tooling were removed. Exact historical replay is unavailable.
See the [evidence retention policy](agent-evidence-retention.md).
