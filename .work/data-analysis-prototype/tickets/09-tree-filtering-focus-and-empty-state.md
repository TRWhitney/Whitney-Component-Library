# 09 Preserve external focus when filtering Tree

**What to build:** Keep focus in the user's current control during external filtering, and render one deliberate empty state without an empty collection frame above it.

**Blocked by:** none.

**Status:** complete

## Evidence and client boundary

Tree retains `focusedId` when focus leaves its rows. Its recovery effect runs after changes to flattened items and calls `focus()` whenever that remembered row disappears. It does not check whether focus is still inside the tree. A user can select a row, focus the search input, and lose input focus when typing removes that row. The scheduled animation-frame recovery can repeat the problem.

With no items, Tree still renders its bordered grid with a minimum height, followed by CollectionFeedback's EmptyState. This creates an empty rounded box above the message.

The prototype now keys its Tree by the filter query to reset obsolete internal focus history. Expansion and selection remain controlled by the app. At zero results it renders the library EmptyState directly instead of mounting an empty Tree. The client does not intercept focus events or repeatedly force focus back into Search.

## Acceptance

- [x] Focus recovery runs only when the removed item owned focus immediately before the update. A stale historical row must not steal focus from Search, filters, another pane, or an overlay.
- [x] Preserve legitimate recovery to a nearby surviving row or the collection when the removed row actually owned focus.
- [x] Typing through zero results and back into results keeps every character and caret position in Search, including rapid typing and composition input.
- [x] Cancel stale scheduled recovery work when focus ownership changes.
- [x] An empty Tree renders its named empty state without a redundant empty bordered grid. Preserve accessible collection context.
- [x] Test controlled expansion and selection, filtering, actual focused-row removal, and no-results recovery.
- [x] Update the Tree contract and a searchable showcase example.

## Accepted sources

- [Approved library fix specification](../spec.md).

- Whitney's search-focus report and no-results screenshot.
- [Tree focus recovery](../../../src/collections/tree.tsx).
- [Collection feedback](../../../src/collections/collection-support.tsx).
- [Prototype browser](../../../prototypes/data-analysis/main.tsx).

## Implementation evidence

Tree clears its remembered focus owner when focus leaves the collection. Both immediate and scheduled recovery use that ownership, so stale rows cannot reclaim Search focus. A removed focused final row falls back to the named feedback group. Empty trees render feedback inside that group without a redundant tree grid.

`tests/application-collection-regressions.test.tsx` covers external Search focus, scheduled recovery cancellation, final-row removal, controlled selection and expansion, and composition updates through no results. Existing async-removal and collapsed-descendant recovery checks continue to pass in `tests/advanced-collections.test.tsx`.

The contract is updated. `showcase/collection-interaction-example.tsx` adds `SearchableTreeExample` for integration into the Tree showcase. Real-browser typing and showcase integration remain part of the parent verification pass.

## Final verification

Completed in the packed Energy desk application and rendered component showcase. See the [shared verification record](../verification.md) for browser checks, repository checks, package compatibility, and the acceptance mapping.
