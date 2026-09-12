# Markdown source editing and safe preview

## Problem Statement

The library has plain text fields but no Markdown authoring component. Ticket 24 must establish
the document behavior needed by later in-place Live Preview without making a separate preview
the final authoring experience.

## Solution

Publish MarkdownEditor as one Markdown-valued field. It supports source and preview modes through
a bounded mode prop. Applications can compose an existing SegmentedControl to select the mode.
The component does not prescribe a toolbar or workspace layout. Source is the initial default
until Ticket 25 supplies Live Preview.

Source mode preserves the document, selection, undo and redo, composition input, and plain-text
clipboard operations. Preview renders the same Markdown safely. Switching modes retains the
editing session; switching does not rewrite or serialize the document. Source rendering and
reading rendering have one accessible representation each, with no hidden duplicate document
exposed to assistive technology. Preview uses native document semantics.

The supported syntax is CommonMark plus tables, task lists, strikethrough, autolinks, footnotes,
and simple double-bracket wiki links. Wiki links are visibly distinct but inert until Ticket 26.
Raw HTML remains literal text and cannot execute. Only safe web, mail, and relative link
destinations become links; images accept web and relative destinations. Unsupported syntax and
unfinished input remain editable source. No consumer-provided parser or renderer is exposed.

## User Stories

1. As an author, I can edit Markdown and check its rendered meaning without losing my place or
   undo history.
2. As an application author, I can control the Markdown string, submit it through a form, and
   present required, invalid, read-only, disabled, pending, or locked states consistently.
3. As a keyboard or assistive-technology user, I can identify the field, mode, cursor location,
   instructions, and validation feedback, and leave the editor with Tab.

## Implementation Decisions

- Follow the [accepted editor scope](../library-foundation/decisions/12-markdown-editor-scope.md)
  and [ADR 0007](../../docs/adr/0007-own-a-markdown-editing-surface.md).
- The engine, syntax trees, and engine state remain private. Public value and callbacks use
  strings. Future decoration and command work must preserve this boundary.
- Preserve history and selection across mode, theme, state, and ordinary controlled-value echo
  updates. External value replacement maps the selection into the changed text and does not
  create a local undo entry. A form reset starts a fresh history with the initial value.
- Use existing visible field labels, support text, native or ARIA validation, inherited disabled
  state, required indicators, and pending feedback. Locked state requires an application-supplied
  explanation and prevents edits while preserving reading and copying. No lock transport is owned.
- Native form serialization uses a private textarea bridge. It is absent from assistive reading
  and tab order after the editor mounts. Invalid native submission focuses the visible control.
- Server output includes source text or semantic preview content. Client hydration creates the
  editor after matching that markup. The private engine must not enter ordinary component bundles.
- Source uses the existing utility monospace role at 0.9375rem with 1.6 line height. Preview uses
  the body role at 1rem with 1.6 line height and document heading hierarchy. The neutral document
  fills the field; wrapping and bounded vertical scrolling keep it usable in compact containers.
- Use existing surface, text, muted text, border, accent-focus, and danger tokens. Existing rounded
  field geometry and the focus outline identify the editable region. Inline code and fenced code
  use the utility type role; blockquote borders encode quoted content. No document transition
  animation is introduced. Pending motion follows the shared field rule and reduced motion.
- This direction applies the existing library language. A document needs text hierarchy and a
  stable field boundary; additional cards, gutters, or decorative active-line effects add no
  required information.

## Testing Decisions

Use behavior tests for exact values, incomplete syntax, safe rendering, mode changes, history,
controlled updates, field states, form submission/reset/validation, SSR, hydration, and cleanup.
Exercise real browser typing, selection, paste, undo/redo, keyboard escape through Tab, mode
switching, compact layout, light/dark themes, and forced colors. Check public type exclusions,
generated contracts and showcase completeness, packed React 18/19 use, and ordinary bundle
isolation. Record basic large-document source input and preview timings with the workload and
environment; detailed Live Preview interaction budgets remain with Ticket 25.

## Out of Scope

Live Preview, formatting commands and typing shortcuts beyond source newline entry, navigation of
wiki links, uploads, public parser/renderer extensions, notes storage, collaboration transport,
and a consumer application remain in their existing later tickets.

## Further Notes

The defining authoring interaction is in-place Live Preview. Source and preview are supporting
modes, and this first delivery must leave that transition possible without replacing the public
document model.
