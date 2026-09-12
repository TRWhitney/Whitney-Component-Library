# In-place Markdown Live Preview

## Problem Statement

Ticket 24 preserves the Markdown document and editing session but separates source from reading.
Ticket 25 delivers the accepted authoring interaction inside that same session.

## Solution

Add `live-preview` to MarkdownEditor modes and make it the default authoring mode. Explicit source
and read-only preview remain available. Live Preview renders accepted Markdown constructs in
place and reveals source at the cursor or across a selection. Mode and selection changes never
serialize rendered content back to Markdown.

## User Stories

1. As an author, I can read formatted Markdown and edit its syntax in place without losing history.
2. As a keyboard user, I can enter every rendered construct, select across blocks, copy Markdown,
   and leave the editor with Tab.
3. As an application author, I can retain the same controlled string, form behavior, and field
   states while selecting any of the three modes.

## Implementation Decisions

Follow [Ticket 25](../library-foundation/tickets/25-markdown-live-preview.md), the
[accepted scope](../library-foundation/decisions/12-markdown-editor-scope.md), and
[ADR 0007](../../docs/adr/0007-own-a-markdown-editing-surface.md).

Use the retained private text session. Derive rendering from the same CommonMark, GFM, footnote,
and wiki grammar used by read-only preview. Keep ordinary prose editable. Reveal inline syntax
for intersected constructs and block syntax where a structure needs its complete source to edit,
such as a table or fenced code block. Pointer entry into a rendered structure selects its source;
keyboard movement must also permit entry. Selections expose every crossed construct. Unfinished
or unsupported Markdown remains literal source. Preserve composition DOM until input commits.

Use one contenteditable representation. Semantic marks and containers accompany editable text;
replacement widgets replace their source range and disappear when source is revealed. Do not
create a second hidden accessible document or extra live region. Links in the editing modes enter
source editing; navigation remains in read-only preview until the later command/link contract.

Retain the existing field boundary, neutral palette, and reading hierarchy. Use `--wcl-surface`,
`--wcl-text`, `--wcl-text-muted`, `--wcl-border-strong`, `--wcl-accent-hover-contrast`, and
`--wcl-accent-focus`. Body text is 1rem with 1.6 line height; headings use the existing reading
scale; revealed table and fenced-code source uses the utility monospace role. Formatting appears inside the document,
with no extra panel. A rendered table that reveals its pipe-delimited source is the distinctive
interaction. Keep block spacing restrained and preserve scroll position around the active edit.
Do not animate source reveal. Existing pending feedback retains reduced-motion behavior.

This direction applies the existing editor's typography and tokens to its accepted in-place
interaction. Additional decorative containers or mode-specific colors would obscure the document.
Read-only/locked visual treatment and scrollbar-size cleanup are recorded in their later tickets.

## Testing Decisions

Test the public editor and ordinary DOM selection/input seams. Cover syntax parity, narrow reveal,
block entry, selection across widgets, exact clipboard data, rejected controlled updates,
undo/redo, mode/focus continuity, field states, deterministic SSR/hydration, and public types.
Operate Chromium and Firefox with real typing, pointer/keyboard entry, copy/paste, mixed-direction
text, long lines, compact layout, zoom, light/dark themes, forced colors, and composition.
Use a representative document of at least 100 KB. Record input-to-frame and selection-to-frame
samples against a 200ms per interaction budget and two seconds to enter Live Preview. These are
local workstation bounds, not a hardware-independent throughput claim.
Run configured checks, package compatibility, and bundle isolation. Update canonical guidance and
the rendered component showcase in the same outcome.

## Out of Scope

Ticket 26 commands, typing shortcuts, wiki navigation, assets, and public extensions. Ticket 27
consumer integration and the requested state styling cleanup. Ticket 30 scrollbar visual cleanup
and wider release accessibility/browser hardening.
