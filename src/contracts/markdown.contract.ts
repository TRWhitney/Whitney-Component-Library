import type {ComponentContract} from './component-contract.js';

export const markdownEditorContract = {
  exportName: 'MarkdownEditor',
  name: 'MarkdownEditor',
  kind: 'component',
  importPath: '.',
  stylesheet: './styles.css',
  purpose:
    'MarkdownEditor edits a Markdown string and renders a safe preview of the same document.',
  summary:
    'Edit Markdown source and check its rendered meaning without losing the editing session.',
  appropriateUses: ['a user authors Markdown with source editing and a separate reading preview'],
  inappropriateUses: [
    'plain multiline text with no Markdown meaning',
    'in-place Live Preview, formatting commands, uploads, or wiki-link navigation, which are not delivered in this milestone',
  ],
  preferredAlternatives: ['Use TextArea for plain multiline text and TextField for a single line.'],
  composition: [
    'Render inside AppearanceProvider. The parent owns width, layout, and mode controls; compose SegmentedControl to switch between source and preview.',
    'mode defaults to source and accepts only source or preview. Live Preview belongs to Ticket 25; formatting commands, asset callbacks, and wiki-link callbacks belong to Ticket 26.',
    'Import the shared stylesheet once. Bundlers can omit the editor engine when only ordinary components are used; editor engine types remain private.',
  ],
  parts: [
    'A visible label, document control, mode and cursor context, and support text form one field. Preview uses native document semantics.',
  ],
  preferredCompositions: [
    'Use FieldGroup for related fields and FormSection for a named form section.',
  ],
  contentRules: [
    'The canonical value is Markdown text. Supported syntax is CommonMark plus tables, task lists, strikethrough, autolinks, footnotes, and simple double-bracket wiki links.',
    'Raw HTML displays as literal text. Links accept safe web, mail, and relative destinations; images accept web and relative destinations. Wiki targets are visibly distinct and inert.',
    'Incomplete and unsupported syntax remains editable source. There is no public parser, renderer, plugin, or document-tree API.',
  ],
  states: [
    'Use value with onChange for controlled strings, or defaultValue for uncontrolled strings.',
    'isRequired and isInvalid follow field conventions. isReadOnly keeps the document readable and copyable; isDisabled prevents interaction and omits the value from form submission. FieldGroup disabled state is inherited.',
    'isPending requires pendingMessage and prevents edits while preserving reading and copying. isLocked requires lockMessage with the application explanation and also prevents edits. The application owns lock transport.',
    'reserveSupportSpace keeps room for support text. size accepts compact, regular, or expanded and defaults to regular.',
  ],
  controlBehavior: [
    'Mode, theme, and field-state changes retain source selection and undo history. Switching modes does not rewrite the Markdown string.',
    'Ordinary controlled-value echoes preserve the session. An external value replacement maps the selection into the changed text without adding a local undo entry.',
  ],
  events: [
    'onChange receives the complete Markdown string after an accepted edit. No engine state or syntax tree crosses the public API.',
  ],
  validation: [
    'validationBehavior defaults to native. validate receives the string and may return localized errors; isInvalid with errorMessage supplies application validation.',
    'Native invalid submission focuses the visible source control or preview. Read-only, disabled, pending, and locked fields do not require editable input validation.',
  ],
  formBehavior: [
    'name and form use a private textarea for native string serialization. Native serialization follows browser newline conventions; public change events preserve source text. After enhancement the textarea is absent from assistive reading and tab order.',
    'A form reset returns to the initial value, clears validation attempts, and starts fresh undo history. Controlled consumers must accept the reset value through onChange.',
  ],
  accessibility: [
    'One accessible document representation is exposed in each mode. Source is a multiline textbox; preview is a labeled region with semantic headings, lists, tables, links, and code.',
    'Server output includes source text or semantic preview. Hydration preserves that markup before enhancing source editing.',
    'Mode and source cursor position are associated with the field alongside its description, validation, pending, and lock feedback.',
  ],
  keyboardBehavior: [
    'Source supports text entry, selection, composition input, newline entry, plain-text clipboard operations, and undo/redo. Tab and Shift+Tab leave the editor.',
    'Preview supports ordinary document reading and safe-link keyboard navigation. Task checkboxes and wiki targets are inert.',
  ],
  labeling: [
    'label is required and visible. The field creates its own description, error, mode, and position relationships.',
  ],
  localization: [
    'Localize label, description, errorMessage, pendingMessage, and lockMessage in the application. English mode, position, empty-preview, required-validation, and footnote copy is built in.',
    'To localize built-in copy, supply a complete labels object with source, preview, emptyPreview, required, footnotes, footnoteBack, and position(line, column).',
  ],
  directionality: [
    'The field inherits writing direction; source selection and reading order follow the document text.',
  ],
  appearance: [
    'Source uses the utility monospace role at 0.9375rem and 1.6 line height. Preview uses body text at 1rem and 1.6 line height with document heading hierarchy.',
    'Neutral document content fills the rounded field boundary. Inline and fenced code use the utility role; blockquote borders identify quoted content.',
  ],
  responsiveBehavior: [
    'The field fills its parent width. Text wraps and bounded vertical scrolling keep the document usable in compact containers; size controls document height.',
  ],
  accentBehavior: [
    'Neutral surfaces and text use shared tokens. Accent identifies focus and danger identifies invalid state.',
  ],
  forcedColorBehavior: [
    'Forced colors use system text, surfaces, boundaries, focus, and invalid-state colors.',
  ],
  reducedMotionBehavior: [
    'The document has no transition animation. Pending feedback follows shared field motion and becomes static with reduced motion.',
  ],
  relatedExports: [
    'AppearanceProvider',
    'FieldGroup',
    'FormSection',
    'SegmentedControl',
    'Stack',
    'TextArea',
    'TextField',
  ],
  examples: [
    {
      title: 'Edit source and switch to preview',
      description:
        'The application composes its own mode control while MarkdownEditor retains one string and editing session.',
      code: `import {useState as useMarkdownState} from 'react';

export function MarkdownSourcePreviewExample() {
  const [mode, setMode] = useMarkdownState<'source' | 'preview'>('source');
  const [value, setValue] = useMarkdownState('# Review notes\\n\\n- [ ] Check the north boundary');
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Stack gap="regular">
        <SegmentedControl
          label="Document mode"
          options={[{label: 'Source', value: 'source'}, {label: 'Preview', value: 'preview'}]}
          value={mode}
          onChange={setMode}
        />
        <MarkdownEditor label="Review notes" name="notes" mode={mode} value={value} onChange={setValue} />
      </Stack>
    </AppearanceProvider>
  );
}`,
    },
    {
      title: 'Explain a temporary editing lock',
      description:
        'The application supplies the lock state and explanation. The document remains available for reading and copying.',
      code: `export function LockedMarkdownExample() {
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
}`,
    },
  ],
  counterExamples: [
    {
      title: 'Use plain text entry for an address',
      description:
        'An address needs preserved line breaks without Markdown interpretation. Use TextArea.',
      code: `export function MarkdownAddressCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <MarkdownEditor label="Postal address" />
    </AppearanceProvider>
  );
}`,
    },
  ],
} satisfies ComponentContract;
