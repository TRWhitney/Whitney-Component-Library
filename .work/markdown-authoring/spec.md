# Markdown authoring commands and integrations

## Problem Statement

[Ticket 26](../library-foundation/tickets/26-markdown-commands-links-assets-and-extensions.md)
adds authoring actions and application integrations to the existing in-place editor. Its public
value must remain the exact Markdown string, with one retained selection and undo history.

## Solution

Provide composable formatting controls and matching keyboard commands, Markdown typing shortcuts,
application-owned wiki navigation and asset insertion, and a declared extension contract.
Follow the [accepted scope](../library-foundation/decisions/12-markdown-editor-scope.md) and
[ADR 0007](../../docs/adr/0007-own-a-markdown-editing-surface.md). Existing source editing,
Live Preview, reading Preview, field states, serialization, and localization remain supported.

## User Stories

1. An author can format selected text from the keyboard or toolbar without losing the selection.
2. An application can resolve wiki targets and handle files without giving the library its routes
   or storage responsibilities.
3. An application can add declared Markdown syntax and actions without importing the editor engine.

## Implementation Decisions

### Commands and typing

The editor accepts an optional toolbar render function exposing library-owned command controls.
The application composes existing Toolbar, Button, and ToggleButton components; no toolbar appears
unless supplied. The toolbar sits between the field label and document. Controls expose command
execution and availability without exposing engine state. Toolbar and keyboard actions use the
retained source selection, return focus to the document, and form individually undoable edits.

Built-in commands cover bold, italic, strikethrough, inline code, links, heading levels 1–6,
paragraphs, blockquotes, bulleted/numbered/task lists, fenced code, horizontal rules, undo, and redo.
Inline toggles unwrap matching surrounding delimiters or wrap the selection. Empty selections
leave the caret inside inserted delimiters. Code delimiters accommodate backticks in selected text.
Block commands operate on complete selected lines and preserve unaffected text. The link command
inserts a Markdown link with its destination selected for editing. Commands do not reinterpret
literal code as prose. Unsupported commands return false without changing the document.

Mod-B, Mod-I, Mod-Shift-X, and Mod-Shift-C invoke inline formatting. Mod-K inserts a link.
Mod-Alt-1 through 6 choose headings; Mod-Alt-0 restores paragraphs. Existing undo/redo bindings
remain. Enter continues a nonempty Markdown list or quotation and exits an empty item. Task-list
continuations start unchecked. Literal code, composition, and paste do not invoke typing shortcuts.
Tab continues to leave the editor. Built-in formatting shortcuts work in source and Live Preview.
Preview, disabled, read-only, pending, and locked states reject editing commands.

### Wiki links

Consumer callbacks synchronously resolve a simple wiki target to a safe destination and optionally
a display label, and handle navigation. Unresolved targets remain visibly distinct inert text.
Preview exposes resolved links as native accessible links. Editing modes retain ordinary click to
edit; modified click and an Open link action provide intentional navigation, including a touch
and keyboard path. Resolver and navigation callbacks receive strings and declared data, never
editor objects. Unsupported or unsafe destinations do not become navigation targets.

### Assets

File paste and drop consume the browser's file insertion behavior. A consumer callback receives
the files, acquisition source, and cancellation signal, and returns Markdown or a recoverable
error. The library performs no upload or persistence and does not manufacture image URLs.
Existing file acceptance rules can reject type, size, or multiplicity before insertion.

Capture the insertion range when acquisition starts and map it through unrelated local edits.
Keep typing available while the callback runs. Cancel a stale insertion when its selected range
is overwritten, the application replaces or resets the document, the editor becomes noneditable,
or the component unmounts. Consumer callbacks may ignore cancellation; late results must still
be discarded. Only one acquisition runs at a time. Pending, rejection, and failure feedback is
associated with the field; failures permit retry or dismissal. A successful insertion is one
undoable Markdown edit. Controlled consumers retain final authority over the value.

### Bounded extensions

Extensions declare stable identifiers and data-only syntax, command, decoration, and link
resolution contributions. Initial syntax boundaries are non-nesting inline delimiters and named
fenced blocks. Their rendering uses finite semantic roles and library tokens. Literal code and
escaped text remain literal. Built-in Markdown precedence is preserved.

Custom commands receive an immutable text/selection snapshot and return validated text edits and
selection. Decorations return validated source ranges with finite semantic treatments; they cannot
replace DOM or hide arbitrary document content. Link resolvers declare nonoverlapping target
prefixes. Duplicate identifiers, key conflicts, reserved syntax, malformed ranges, and unsupported
declarations fail deterministically before changing the canonical document. Extension callbacks
cannot install engine extensions, supply HTML, or run a plugin lifecycle. Unsupported document
text remains editable literal Markdown.

The examples requested from Whitney may refine the custom syntax boundary. In their absence,
use the bounded inline/fence forms above and document their limits explicitly.

### Visual direction

Retain the existing neutral editor and its document hierarchy. Use --wcl-surface, --wcl-text,
--wcl-text-muted, --wcl-border, --wcl-accent-focus, and the shared danger token. Body text remains
1rem/1.6, source and utility text 0.9375rem/1.6, and action labels use existing Button typography.
The compact formatting strip is the new identifying element: related actions share one toolbar
and wrap at narrow widths rather than shrinking or clipping. Keep mode and size choices outside
the editor and preserve space between settings, authoring actions, and explanations. Add no
animation; pending feedback uses existing reduced-motion behavior. Errors state the failed action
and available recovery. Use actual review notes and the boundary mesh asset in the showcase.

This extends the existing component language. Bespoke action controls, extra decorative panels,
and custom accent colors would contradict that language and are excluded.

## Testing Decisions

Use public editor controls, native selection/input, and application callbacks as test seams.
Prove keyboard/toolbar parity, selection continuity, undo boundaries, literal contexts, and rejected
controlled updates. Exercise wiki safety and activation, async acquisition success/failure/retry,
cancellation/range mapping, and deterministic extension conflicts. Cover all shared field states,
React 18/19 hydration, public declarations, generated contracts, and ordinary bundle isolation.
Operate the actual showcase in Chromium and Firefox with pointer, keyboard, compact/wide,
light/dark, forced colors, reduced motion, and touch-equivalent command controls. Inspect rendered
states and accessibility structure. Retain the existing 100KB interaction budget for affected paths.

## Out of Scope

Uploads, persistence, vaults, backlink indexes, route ownership, arbitrary parser/renderer plugins,
collaboration transport, and a plugin runtime. Tickets 27 and 30 retain the recorded UI cleanup.
