# Declaration pointer results

Declaration links provided a usable route to guidance but did not establish greater uptake or
causal authoring savings. Pointer total was 14.2% below control and uncached input plus output
5.9% below. It remained 2.26 times React/CSS total and 60.7% above native uncached tokens.
Only 3/6 pointer agents saw a pointer; all read guidance afterward. Controls also read pages
in 6/6 attempts, leaving no uptake improvement to measure.

## Design and candidate

The [protocol](agent-guidance-pointer-protocol.md) specified 18 fresh gpt-6.1-sol/high attempts:
profile dialog, validated form and directory, each under React/CSS, bundled guidance and
identical guidance plus pointers, twice. Briefs gave no guidance hints; authors edited app/CSS
and ran type/build. Starts overlapped. Internal IDs used `pointer_` even for native, a possible
subject cue, though condition was hidden. No attempts were discarded by read route.

Nine one-line comments linked the public declaration entry to the index and eight component
leaves to their usage pages. For example:

```ts
/** Component usage, behavior, and exact props: ./agent-index.md */
/** Dialog usage, behavior, and exact props: ../usage/dialog.md */
```

Leaves were AppearanceProvider, Button, Checkbox, Dialog, SearchField, Table, Tabs and TextField.
The comments added 144 `o200k_base` reference tokens across nine files. Historical verification
found only those declarations differed, identical semantics without comments, 201 matching
runtime files, matching installed variants and 85 complete props/fallbacks with eight compiling
examples. Hash traversal order differed in old labels; actual runtime bytes were compared.
These were prototype changes; later [integration](agent-guidance-proposal.md) adopted pointers.

## Completed costs

Each row sums six attempts. There were no independent repairs; initial/completed counters
match. Total includes cached input and reasoning once. Uncached input plus output is diagnostic,
not a price. Failed reads/builds and author fixes are included; preparation/evaluation/analysis
are excluded. Reference estimates use tiktoken 0.12.0, `o200k_base`.

| Condition          | Input     | Cached input | Output | Total     | Uncached input + output | App/CSS tokens |
| ------------------ | --------- | ------------ | ------ | --------- | ----------------------- | -------------- |
| React/CSS          | 482,511   | 411,264      | 15,565 | 498,076   | 86,812                  | 9,949          |
| Bundled pages      | 1,298,331 | 1,165,184    | 15,138 | 1,313,469 | 148,285                 | 6,367          |
| Bundled + pointers | 1,112,203 | 987,776      | 15,059 | 1,127,262 | 139,486                 | 6,670          |

| Condition          | Outer tool requests | Tool-output tokens | Active seconds | First / final apps |
| ------------------ | ------------------- | ------------------ | -------------- | ------------------ |
| React/CSS          | 21                  | 15,578             | 334.09         | 6/6 → 6/6          |
| Bundled pages      | 44                  | 109,686            | 416.11         | 6/6 → 6/6          |
| Bundled + pointers | 41                  | 95,846             | 379.16         | 6/6 → 6/6          |

Pointers had three fewer outer requests, 12.6% fewer tool-output reference tokens and 8.9% less
active time. These descriptive differences reflect varying read routes and batching.

| Task      | React/CSS total | Bundled total | Pointer total | Pointer total change | Pointer uncached change |
| --------- | --------------- | ------------- | ------------- | -------------------- | ----------------------- |
| overlay   | 185,514         | 410,215       | 435,035       | 6.1%                 | -9.1%                   |
| form      | 147,272         | 301,254       | 302,828       | 0.5%                 | 53.8%                   |
| directory | 165,290         | 602,000       | 389,399       | -35.3%               | -31.9%                  |

The aggregate advantage came from directory. Overlay/form totals rose; form uncached tokens
rose 53.8%. Four of six matched pairs favored pointers on total and four on uncached, with
different favorable pairs. Both library groups used more total/uncached tokens than native.

## Exposure and correctness

| Condition          | Saw pointer | Read usage pages | Read index | Read runtime JS/CSS | Read full contract |
| ------------------ | ----------- | ---------------- | ---------- | ------------------- | ------------------ |
| React/CSS          | 0/6         | 0/6              | 0/6        | 0/6                 | 0/6                |
| Bundled pages      | 0/6         | 6/6              | 6/6        | 5/6                 | 1/6                |
| Bundled + pointers | 3/6         | 6/6              | 6/6        | 4/6                 | 1/6                |

Exposure required visible comment text; uptake required returned usage/props content. Files
or links alone did not count. Pointer05/10 saw comments then pages; 18 had already read the
index before seeing a leaf pointer. Unexposed 03/07/14 found pages independently. The sequence
is compatible with following links but cannot prove motivation. Pointers did not consistently
replace runtime or original-declaration reads.

All 18 apps passed type/build and 816 primary assertions on first independent evaluation,
48 per overlay/directory and 40 per form across 390px/1280px. No browser errors, interruptions,
post-freeze corrections or app repairs occurred. Passing initial checks supplied final results
without a second execution. Failed paths included `.d.ts` guesses for `.ts` prop references
and wrong SearchField/Checkbox folders. Control16 corrected Button size "small" before completion.
These costs were included.

## Decision and limits

The original recommendation treated the nine links as a small navigation candidate rather
than proven token optimization. Two repetitions/task, cache/context replay, overlapping order,
inherited instructions, internal names and ordinary route variation prevent a causal estimate.
Combined entry/leaf comments cannot isolate either effect. Sampled behavior is not a complete
accessibility audit. No general uptake rate or cost advantage over React/CSS was established.

Raw captures and one-off study tooling were removed. Exact historical replay is unavailable.
See the [evidence retention policy](agent-evidence-retention.md).
