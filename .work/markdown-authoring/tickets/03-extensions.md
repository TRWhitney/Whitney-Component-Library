# 03 Declared Markdown extensions

**What to build:** Bounded syntax, commands, decorations, and link resolver declarations over the
public Markdown string and selection model.

**Blocked by:** [Commands](01-commands.md), [Links and assets](02-links-assets.md)

**Status:** blocked

- [ ] Declared inline/fenced syntax renders coherently in Live Preview and Preview and reveals source.
- [ ] Custom command edits and decorations use validated ranges and public semantic data.
- [ ] Declared link resolver prefixes have deterministic precedence and safety behavior.
- [ ] Conflicts and unsupported declarations fail without document corruption.
- [ ] No public engine/parser types, arbitrary HTML, DOM callbacks, or plugin runtime are exposed.
- [ ] Public regressions, browser examples, contracts, and consumer compatibility prove the limits.

## Accepted sources

- [Specification](../spec.md), bounded extensions section.

## Completion evidence

Pending implementation.
