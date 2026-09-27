# Rendering evidence

These are retained outputs for the objective layout checks, not style ratings or a request for
subjective acceptance. See the [results](lifecycle-results.md) for cost and correctness limits.

| State                   | React/CSS                                                                                          | Current library                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Initial light, 390px    | [Native](pilot/lifecycle/native-initial/independent-v3/390-light-baseline-initial.png)             | [Library](pilot/lifecycle/library-required-initial/independent/390-light-baseline-initial.png)                |
| Final dark, 390px       | [Native](pilot/lifecycle/native-maintenance/independent/390-dark-baseline-initial.png)             | [Library](pilot/lifecycle/library-required-maintenance/independent/390-dark-baseline-initial.png)             |
| Final light, 1280px     | [Native](pilot/lifecycle/native-maintenance/independent/1280-light-baseline-initial.png)           | [Library](pilot/lifecycle/library-required-maintenance/independent/1280-light-baseline-initial.png)           |
| Long names, dark, 390px | [Native](pilot/lifecycle/native-maintenance/independent/390-dark-long-name-wrapping-long-name.png) | [Library](pilot/lifecycle/library-required-maintenance/independent/390-dark-long-name-wrapping-long-name.png) |
| Edit, dark, 390px       | [Native](pilot/lifecycle/native-maintenance/independent/390-dark-edit-modal-edit.png)              | [Library](pilot/lifecycle/library-required-maintenance/independent/390-dark-edit-modal-edit.png)              |

The disposable apps remain runnable with their original installed dependencies:

```sh
npm --prefix /tmp/wcl-lifecycle-LTHbbR/native run dev
npm --prefix /tmp/wcl-lifecycle-LTHbbR/library-required run dev
```

Run those in separate terminals, then open `http://127.0.0.1:4451` and `http://127.0.0.1:4453`.
Add `?identify` to reveal region names. These are local experimental apps with in-memory data.

If the temporary root is gone, run the preparation script described in the results. Replace each
new app's src directory with its retained `*-maintenance/after/src` directory before starting
Vite. The preparation script packs the current repository build; exact historical reproduction
requires the recorded baseline and package hash, not a later changed library build.
