# MarkdownEditor

MarkdownEditor edits a Markdown string with in-place Live Preview, source editing, and safe reading preview.

## Use for

- a user authors Markdown and needs formatted content with editable syntax

## Do not use for

- plain multiline text with no Markdown meaning
- formatting commands, uploads, or wiki-link navigation, which are not delivered in this milestone

## Prefer instead

- Use TextArea for plain multiline text and TextField for a single line.

## Composition and parts

- Render inside AppearanceProvider. The parent owns width, layout, and mode controls; compose SegmentedControl to switch between live-preview, source, and preview.
- mode defaults to live-preview. Source exposes the complete Markdown text; preview provides a read-only document. Formatting commands, asset callbacks, and wiki-link callbacks belong to Ticket 26.
- Import the shared stylesheet once. Bundlers can omit the editor engine when only ordinary components are used; editor engine types remain private.
- A visible label, document control, mode and cursor context, and support text form one field. Live Preview renders document structure inside the editor; preview uses native document semantics.

## Preferred higher-level compositions

- Use FieldGroup for related fields and FormSection for a named form section.

## Content

- The canonical value is Markdown text. Supported syntax is CommonMark plus tables, task lists, strikethrough, autolinks, footnotes, and simple double-bracket wiki links.
- Raw HTML displays as literal text. Links accept safe web, mail, and relative destinations; images accept web and relative destinations. Wiki targets are visibly distinct and inert.
- Incomplete and unsupported syntax remains editable source. There is no public parser, renderer, plugin, or document-tree API.

## States

- Use value with onChange for controlled strings, or defaultValue for uncontrolled strings.
- isRequired and isInvalid follow field conventions. isReadOnly keeps the document readable and copyable; isDisabled prevents interaction and omits the value from form submission. FieldGroup disabled state is inherited.
- isPending requires pendingMessage and prevents edits while preserving reading and copying. isLocked requires lockMessage with the application explanation and also prevents edits. The application owns lock transport.
- reserveSupportSpace keeps room for support text. size accepts compact, regular, or expanded and defaults to regular.

## Control, events, validation, and forms

- Live Preview renders Markdown in place. A cursor or selection reveals the intersected inline syntax; tables and fenced code reveal their complete source for editing. Moving out of a construct restores its rendered form.
- Click rendered content or move the cursor into it with the keyboard to edit its source. A selection across constructs exposes every crossed source range. Editing-mode links enter source editing; safe-link navigation is available in preview.
- Mode, theme, and field-state changes retain source selection and undo history. Switching modes does not rewrite the Markdown string.
- Ordinary controlled-value echoes preserve the session. An external value replacement maps the selection into the changed text without adding a local undo entry.
- onChange receives the complete Markdown string after an accepted edit. No engine state or syntax tree crosses the public API.
- validationBehavior defaults to native. validate receives the string and may return localized errors; isInvalid with errorMessage supplies application validation.
- Native invalid submission focuses the visible editor or preview. Read-only, disabled, pending, and locked fields do not require editable input validation.
- name and form use a private textarea for native string serialization. Native serialization follows browser newline conventions; public change events preserve source text. After enhancement the textarea is absent from assistive reading and tab order.
- A form reset returns to the initial value, clears validation attempts, and starts fresh undo history. Controlled consumers must accept the reset value through onChange.

## Accessibility

- One accessible document representation is exposed in each mode. Live Preview and source use one multiline textbox; Live Preview includes semantic document structure in place. Preview is a labeled region with semantic headings, lists, tables, links, and code.
- Server output includes source text for editing modes or semantic reading preview. Hydration preserves that markup before enhancing the retained editing session.
- Mode and source cursor position are associated with the field alongside its description, validation, pending, and lock feedback.

## Keyboard, labeling, localization, and direction

- Live Preview and source support text entry, selection, composition input, newline entry, plain-text clipboard operations, and undo/redo. Copying preserves the selected Markdown source. Tab and Shift+Tab leave the editor.
- Preview supports ordinary document reading and safe-link keyboard navigation. Task checkboxes and wiki targets are inert.
- label is required and visible. The field creates its own description, error, mode, and position relationships.
- Localize label, description, errorMessage, pendingMessage, and lockMessage in the application. English mode, position, empty-preview, required-validation, and footnote copy is built in.
- To localize built-in copy, supply a complete labels object with livePreview, source, preview, emptyPreview, required, footnotes, footnoteBack, and position(line, column).
- The field inherits writing direction; source selection and reading order follow the document text.

## Appearance and responsive behavior

- Source uses the utility monospace role at 0.9375rem and 1.6 line height. Live Preview and preview use body text at 1rem and 1.6 line height with document heading hierarchy. Revealed table and fenced-code source uses the utility monospace role.
- Neutral document content fills the rounded field boundary. Inline and fenced code use the utility role; blockquote borders identify quoted content.
- The field fills its parent width. Text wraps and bounded vertical scrolling keep the document usable in compact containers; size controls document height.

## Accent, forced colors, and reduced motion

- Neutral surfaces and text use shared tokens. Accent identifies focus and danger identifies invalid state.
- Forced colors use system text, surfaces, boundaries, focus, and invalid-state colors.
- The document has no transition animation. Pending feedback follows shared field motion and becomes static with reduced motion.

## Examples

### Author in Live Preview and switch modes

The application composes its own mode control while MarkdownEditor retains one string and editing session.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, MarkdownEditor, SegmentedControl, Stack} from '@trwhitney/component-library';

import {useState as useMarkdownState} from 'react';

export function MarkdownLivePreviewExample() {
  const [mode, setMode] = useMarkdownState<'live-preview' | 'source' | 'preview'>('live-preview');
  const [value, setValue] = useMarkdownState('# Review notes\n\n- [ ] Check the north boundary');
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Stack gap="regular">
        <SegmentedControl
          label="Document mode"
          options={[
            {label: 'Live Preview', value: 'live-preview'},
            {label: 'Source', value: 'source'},
            {label: 'Preview', value: 'preview'},
          ]}
          value={mode}
          onChange={setMode}
        />
        <MarkdownEditor label="Review notes" name="notes" mode={mode} value={value} onChange={setValue} />
      </Stack>
    </AppearanceProvider>
  );
}
```

### Explain a temporary editing lock

The application supplies the lock state and explanation. The document remains available for reading and copying.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, MarkdownEditor} from '@trwhitney/component-library';

export function LockedMarkdownExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <MarkdownEditor
        label="Review notes"
        defaultValue="## Boundary review"
        isLocked
        lockMessage="Morgan is editing these notes."
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Use plain text entry for an address

An address needs preserved line breaks without Markdown interpretation. Use TextArea.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, MarkdownEditor} from '@trwhitney/component-library';

export function MarkdownAddressCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <MarkdownEditor label="Postal address" />
    </AppearanceProvider>
  );
}
```
