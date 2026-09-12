# Markdown session transaction mechanisms

## Question and scope

How can private CodeMirror transactions preserve selection, history, and pending file insertion
while the public value remains a controlled Markdown string? Inspection covers installed state
6.7.4, view 6.43.11, commands 6.11.0, and lang-markdown 6.5.2.

## Findings

- One transaction can apply changes and resulting selection. Preserve anchor/head direction.
  `isolateHistory.of('full')` separates commands from both preceding and subsequent typing.
  A user-event name alone does not guarantee isolation.
- Pending insertion ranges can map through transactions, but request identity and cancellation
  must separately invalidate reset-to-identical-value and unmount. Read-only is a convention, so
  command entry and async completion must check current editing permission explicitly.
- Custom paste/drop handlers must consume file events before default behavior. The installed
  default drop path reads files as text asynchronously. Capture the insertion position at drop,
  extract files synchronously, and avoid duplicating items and files representations.
- The installed Markdown package supplies continuation commands and code-aware context checks.
  Composition guards must include the phase before the first composition text change.
- Markdown configuration currently leaves pasteURLAsLink enabled. New behavior must explicitly
  account for that handler rather than assume plain-text clipboard behavior from addKeymap=false.

## Evidence

- [State transactions](https://github.com/codemirror/state/blob/main/src/state.ts).
- [Position mapping](https://github.com/codemirror/state/blob/main/src/change.ts).
- [Undo grouping](https://github.com/codemirror/commands/blob/main/src/history.ts).
- [Markdown commands](https://github.com/codemirror/lang-markdown/blob/main/src/commands.ts).
- [Input handlers](https://github.com/codemirror/view/blob/main/src/input.ts).
- [File transfer specification](https://html.spec.whatwg.org/multipage/dnd.html#the-datatransferitem-interface).
- [Clipboard data](https://www.w3.org/TR/clipboard-apis/#clipboardevent-clipboarddata).

The official GitHub repositories are archived snapshots. Installed declarations and implementation
establish exact version behavior where hosted reference pages were unavailable. A bounded
read-only transaction experiment preserved backward selection through wrapping and undo, and
confirmed that TrackDel preserves deletion boundary positions. Browser interactions remain
necessary evidence for the implemented editor.
