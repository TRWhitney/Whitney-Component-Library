# 03 Declared Markdown extensions

**What to build:** Bounded syntax, commands, decorations, and link resolver declarations over the
public Markdown string and selection model.

**Blocked by:** none. [Commands](01-commands.md) and [Links and assets](02-links-assets.md) are delivered.

**Status:** complete

- [x] Declared inline/fenced syntax renders coherently in Live Preview and Preview and reveals source.
- [x] Custom command edits and decorations use validated ranges and public semantic data.
- [x] Declared link resolver prefixes have deterministic precedence and safety behavior.
- [x] Conflicts and unsupported declarations fail without document corruption.
- [x] No public engine/parser types, arbitrary HTML, DOM callbacks, or plugin runtime are exposed.
- [x] Public regressions, browser examples, contracts, and consumer compatibility prove the limits.

## Accepted sources

- [Specification](../spec.md), bounded extensions section.

## Completion evidence

Implementation and validation are complete. See [verification](../verification.md). Both independent review axes pass.
