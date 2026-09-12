# 02 Application-owned links and assets

**What to build:** Resolved wiki navigation and recoverable asset paste/drop through application
callbacks, preserving the Markdown string and editing position.

**Blocked by:** none. [Commands](01-commands.md) are complete.

**Status:** active. Wiki navigation is complete; asset acquisition follows.

- [x] Resolved wiki targets support safe preview navigation and intentional editing-mode activation.
- [ ] File insertion uses only callback-returned Markdown and shared acceptance rules.
- [ ] Async insertion maps through unrelated edits, rejects stale completion, and has recoverable
      pending, rejection, and failure states.
- [ ] Read-only/disabled/pending/locked modes, controlled ownership, reset, and unmount remain safe.
- [ ] Public tests, real browser interaction, contracts, and showcase prove the callback boundary.

## Accepted sources

- [Specification](../spec.md), wiki and asset sections.

## Completion evidence

[Wiki verification](../verification.md) covers navigation, browser behavior, hydration, safety, and compatibility. Asset acquisition remains.
