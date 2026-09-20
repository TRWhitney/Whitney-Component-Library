import type {ComponentContract} from './component-contract.js';

export const markdownEditorContract = {
  exportName: 'MarkdownEditor',
  name: 'MarkdownEditor',
  kind: 'component',
  importPath: '.',
  stylesheet: './styles.css',
  purpose:
    'MarkdownEditor edits a Markdown string with in-place Live Preview, source editing, and safe reading preview.',
  summary:
    'Author formatted Markdown in place and reveal its syntax at the cursor without losing the editing session.',
  appropriateUses: ['a user authors Markdown and needs formatted content with editable syntax'],
  inappropriateUses: [
    'plain multiline text with no Markdown meaning',
    'file storage or an unrestricted parser and plugin runtime',
  ],
  preferredAlternatives: ['Use TextArea for plain multiline text and TextField for a single line.'],
  composition: [
    'extensions accepts stable MarkdownExtension declarations with id, syntax, commands, decorate, and links. Keep declaration arrays stable between value updates, for example with useMemo. The library owns parsing and rendering; no editor engine objects, DOM callbacks, arbitrary HTML, or plugin lifecycle are exposed.',
    'Compose custom command buttons with controls.canExecuteExtension(id) and controls.executeExtension(id). Unknown or unavailable commands return false. These controls use the retained source selection and the same noneditable and composition guards as built-in commands.',
    'Render inside AppearanceProvider. The parent owns width, layout, and mode controls; compose SegmentedControl to switch between live-preview, source, and preview.',
    'mode defaults to live-preview. Source exposes the complete Markdown text; preview provides a read-only document.',
    'Supply renderToolbar to compose Toolbar, Button, and ToggleButton between the field label and document. No toolbar appears by default. The callback receives MarkdownEditorControls with execute, canExecute, and isActive; all accept a MarkdownCommand identifier and return a boolean.',
    'Compose an Open link Button using controls.canOpenLink and controls.openLink(). These use the retained source selection and work in read-only, pending, and locked editing modes; disabled and reading-preview modes disable this toolbar action.',
    'Bind action availability to canExecute and toggle selection to isActive. Execute commands through these controls so toolbar actions use the retained source selection. The application owns toolbar labels and action choices.',
    'Import the shared stylesheet once. Bundlers can omit the editor engine when only ordinary components are used; editor engine types remain private.',
  ],
  parts: [
    'A visible label, document control, mode and cursor context, and support text form one field. Live Preview renders document structure inside the editor; preview uses native document semantics.',
  ],
  preferredCompositions: [
    'Use FieldGroup for related fields and FormSection for a named form section.',
    'Use ToggleButton for formatting toggles and Button for insertion, undo, and redo inside a labeled Toolbar.',
  ],
  contentRules: [
    'Inline extension syntax declares {id, kind: inline, delimiter, treatment}. Delimiters are two to four repeats of one =, +, %, or ^ character. Content is nonempty plain text without surrounding whitespace, nested delimiter runs, Markdown markup, escapes, entities, or newlines. Unmatched text retains ordinary Markdown parsing. Built-in code and escapes remain literal.',
    'Fenced extension syntax declares {id, kind: fence, name, treatment: note or warning}. A matching named code fence without metadata renders a semantic note containing preformatted literal text. Its complete source reveals for editing. Other fence names retain built-in code rendering. Rich code-block renderers are outside this initial contract.',
    'Inline syntax and source decorations use highlight, accent, or muted treatments. For per-passage color, declare {id, kind: color, delimiter}. The Markdown form is %%rgba(180, 35, 24, 0.85) north boundary%% for a %% delimiter. RGB channels accept numbers from 0 through 255, alpha from 0 through 1, and a space separates the value from plain text. Only comma-separated rgba() is accepted; arbitrary CSS and invalid values stay literal.',
    'RGBA values remain in canonical Markdown and retain their exact color across appearances. The author or application must choose colors with enough contrast against its supported backgrounds. Source mode and exposed Live Preview syntax show a checker-backed swatch beside the value without adding text. Forced colors use readable system text while the swatch previews the authored color.',
    'The canonical value is Markdown text. Supported syntax is CommonMark plus tables, task lists, strikethrough, autolinks, footnotes, and simple double-bracket wiki links.',
    'Raw HTML displays as literal text. Links accept safe web, mail, and relative destinations; images accept web and relative destinations. Wiki targets are visibly distinct. Supply wikiLinks to resolve simple targets; unresolved or unsafe destinations remain inert. Wiki targets inside an ordinary Markdown link label remain part of that outer link and do not create another navigation target.',
    'Incomplete and unsupported syntax remains editable source. There is no public parser, renderer, plugin, or document-tree API.',
  ],
  states: [
    'Use value with onChange for controlled strings, or defaultValue for uncontrolled strings.',
    'isRequired and isInvalid follow field conventions. isReadOnly keeps the document readable and copyable; isDisabled prevents interaction and omits the value from form submission. FieldGroup disabled state is inherited.',
    'isPending requires pendingMessage and prevents edits while preserving reading and copying. isLocked requires lockMessage with the application explanation and also prevents edits. The application owns lock transport.',
    'Read-only and locked documents use a distinct document background, dashed boundary, and a small lock indicator inside the document area. The indicator remains visible during document scrolling. Its localized access description is available to assistive technology and on hover; lockMessage remains in support text.',
    'fillHeight fills an explicitly sized parent, including label, toolbar, mode context, and support text. The remaining height belongs to the scrolling document in every mode. It takes precedence over size; the parent must leave enough height for the field chrome and a usable document.',
    'reserveSupportSpace keeps room for support text. size accepts compact, regular, or expanded and defaults to regular.',
  ],
  controlBehavior: [
    'Live Preview renders Markdown in place. A cursor or selection reveals the intersected inline syntax; tables and fenced code reveal their complete source for editing. Moving out of a construct restores its rendered form.',
    'Click rendered content or move the cursor into it with the keyboard to edit its source. A selection across constructs exposes every crossed source range. Ordinary clicks on editing-mode links enter source editing. Resolved wiki links also support intentional navigation; safe ordinary-link navigation is available in preview.',
    'Mode, theme, and field-state changes retain source selection and undo history. Switching modes does not rewrite the Markdown string.',
    'Ordinary controlled-value echoes preserve the session. An external value replacement maps the selection into the changed text without adding a local undo entry.',
    'Built-in MarkdownCommand identifiers are bold, italic, strikethrough, inline-code, link, heading-1 through heading-6, paragraph, blockquote, bullet-list, ordered-list, task-list, code-block, horizontal-rule, undo, and redo.',
    'Inline commands wrap the source selection or remove matching surrounding delimiters. An empty selection leaves the caret inside the inserted delimiters. Code delimiters accommodate backticks in selected text. The link command inserts Markdown link syntax and selects its destination for editing.',
    'Block commands transform complete selected lines and preserve unaffected text. Commands keep literal code literal. Toolbar and keyboard commands share the retained source selection, return focus to the document, and create individually undoable edits.',
    'execute returns false without changing the document for an unsupported or unavailable command. Preview, disabled, read-only, pending, and locked states reject editing commands.',
  ],
  events: [
    'An extension command declares {id, execute, isEnabled?, shortcut?}. execute receives a frozen {value, selection: {anchor, head}} snapshot and returns null or {edits, selection?}. Each edit is {from, to, insert}; offsets are UTF-16 positions in the original string. Edits must be ordered and disjoint. Returned selection positions refer to the resulting string. Each accepted command is one undoable transaction.',
    'decorate receives the same frozen snapshot in editing modes and returns {from, to, treatment} ranges. It may mark source text but cannot hide, replace, or create document content. Decorations do not change the reading preview. Callbacks must be synchronous and pure; invalid returned ranges throw TypeError before the transaction commits.',
    'Extension links declare {prefix, resolve, onNavigate} using the wiki callback contract. A matching prefix owns resolution before wikiLinks; null or unsafe results stay inert without falling through. Prefixes must not overlap, so declaration order cannot change ownership.',
    'Extension, syntax, and command identifiers must be unique across the editor and start with a lowercase letter, followed by lowercase letters, digits, dots, or hyphens. Duplicate identifiers, overlapping delimiters or prefixes, duplicate fence names, invalid ranges, and unsupported properties throw TypeError without changing canonical Markdown.',
    'assets.insert receives {files, source, signal} and returns {markdown} or {error}, synchronously or as a Promise. source is paste or drop. The application owns storage and URLs; the editor inserts only returned Markdown and never uploads files.',
    'assets accepts acceptedFileTypes, allowsMultiple, and maxFileSize using the shared file acceptance rules. One file is allowed by default. Rejected files produce associated feedback without entering the callback. File paste and drop are consumed even when no asset callback is supplied; ordinary text paste remains available.',
    'One asset insertion can run at a time. Typing remains available while it is pending. The captured range follows unrelated edits, and completion preserves a caret moved elsewhere. Edits inside the captured selection, external value replacement, reset, noneditable state, or unmount cancel insertion. Late results are ignored even if the callback ignores its AbortSignal.',
    'A successful asset insertion is one undoable edit. Failure offers Retry asset insertion and Dismiss asset feedback. Retry retains the accepted files and mapped insertion range; dismissal clears them. Controlled values retain final authority over insertion.',
    'wikiLinks.resolve synchronously receives a target string and returns {href, label?} or null. wikiLinks.onNavigate receives the resolved {target, href, label}. The application owns routes and navigation; the editor prevents default wiki-link navigation and never rewrites the Markdown target.',
    'onChange receives the complete Markdown string after an accepted edit. No engine state or syntax tree crosses the public API.',
  ],
  validation: [
    'validationBehavior defaults to native. validate receives the string and may return localized errors; isInvalid with errorMessage supplies application validation.',
    'Native invalid submission focuses the visible editor or preview. Read-only, disabled, pending, and locked fields do not require editable input validation.',
  ],
  formBehavior: [
    'name and form use a private textarea for native string serialization. Native serialization follows browser newline conventions; public change events preserve source text. After enhancement the textarea is absent from assistive reading and tab order.',
    'A form reset returns to the initial value, clears validation attempts, and starts fresh undo history. Controlled consumers must accept the reset value through onChange.',
  ],
  accessibility: [
    'One accessible document representation is exposed in each mode. Live Preview and source use one multiline textbox; Live Preview includes semantic document structure in place. Preview is a labeled, focusable document for screen-reader reading commands, with semantic headings, lists, tables, links, and code.',
    'Server output includes source text for editing modes or semantic reading preview. Hydration preserves that markup before enhancing the retained editing session.',
    'Mode and source cursor position are associated with the field alongside its description, validation, pending, and lock feedback.',
  ],
  keyboardBehavior: [
    'Custom shortcuts accept Mod-Shift plus an uppercase letter, excluding B, C, I, K, U, X, Y, and Z to preserve reserved commands. Duplicate shortcuts are rejected. The application owns command labels and any instructions for its shortcuts.',
    'Live Preview and source support text entry, selection, composition input, newline entry, plain-text clipboard operations, and undo/redo. Copying preserves the selected Markdown source. Tab and Shift+Tab leave the editor.',
    'In Live Preview and source, Mod+B applies bold, Mod+I italic, Mod+Shift+X strikethrough, Mod+Shift+C inline code, and Mod+K a link. Mod+Alt+1 through Mod+Alt+6 choose heading levels; Mod+Alt+0 restores paragraphs. Mod is Command on macOS and Control elsewhere.',
    'Enter continues a nonempty Markdown list or quotation and exits an empty item. New task-list items start unchecked. Literal code, composition input, and paste do not trigger Markdown continuation.',
    'Ctrl/Cmd-click on a resolved wiki link navigates without editing. Middle-click on a rendered wiki link also delegates to the application callback. With the cursor inside a resolved target, Mod+Enter or the composed Open link action calls the application navigation callback. Ordinary clicks reveal its Markdown source. Preview exposes resolved wiki links as native links for keyboard, pointer, and touch activation.',
    'Preview supports ordinary document reading and safe-link keyboard navigation. Task checkboxes and unresolved wiki targets are inert.',
  ],
  labeling: [
    'label is required and visible. The field creates its own description, error, mode, and position relationships.',
  ],
  localization: [
    'To localize asset feedback, supply complete assets.labels with pending(fileCount), rejected(files), failed, retry, and dismiss. Application-returned error strings are already localized by the application.',
    'Localize label, description, errorMessage, pendingMessage, lockMessage, and any supplied toolbar labels in the application. English mode, position, empty-preview, required-validation, and footnote copy is built in.',
    'To localize built-in copy, supply a complete labels object with livePreview, source, preview, emptyPreview, required, footnotes, footnoteBack, and position(line, column). Optional readOnly and locked override the access labels. Optional emptyTask names a task checkbox without task text. These optional labels default to English when omitted.',
  ],
  directionality: [
    'The field inherits writing direction; source selection and reading order follow the document text.',
  ],
  appearance: [
    'Source uses the utility monospace role at 0.9375rem and 1.6 line height. Live Preview and preview use body text at 1rem and 1.6 line height with document heading hierarchy. Revealed table and fenced-code source uses the utility monospace role.',
    'Neutral document content fills the rounded field boundary. Inline and fenced code use the utility role; blockquote borders identify quoted content.',
  ],
  responsiveBehavior: [
    'The field fills its parent width. Text wraps and bounded vertical scrolling keep the document usable in compact containers; size controls document height unless fillHeight fills the bounded parent. Parent resizing and wrapped toolbar or support content resize the scrolling document without rebuilding the editing session.',
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
    'Button',
    'FieldGroup',
    'FormSection',
    'SegmentedControl',
    'Stack',
    'TextArea',
    'TextField',
    'ToggleButton',
    'Toolbar',
  ],
  examples: [
    {
      title: 'Author in Live Preview and switch modes',
      description:
        'The application composes its own mode control while MarkdownEditor retains one string and editing session.',
      code: `import {useState as useMarkdownState} from 'react';

export function MarkdownLivePreviewExample() {
  const [mode, setMode] = useMarkdownState<'live-preview' | 'source' | 'preview'>('live-preview');
  const [value, setValue] = useMarkdownState('# Review notes\\n\\n- [ ] Check the north boundary');
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
}`,
    },
    {
      title: 'Compose formatting and history controls',
      description:
        'The toolbar reflects command availability and active formatting. Actions use the retained source selection and return focus to the document.',
      code: `export function MarkdownCommandsExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <MarkdownEditor
        label="Review notes"
        defaultValue="Check the north boundary."
        renderToolbar={({execute, canExecute, isActive}) => (
          <Toolbar label="Review note formatting">
            <ToggleButton
              variant="quiet"
              isSelected={isActive('bold')}
              isDisabled={!canExecute('bold')}
              onChange={() => {
                execute('bold');
              }}
            >
              Bold
            </ToggleButton>
            <Button
              variant="quiet"
              isDisabled={!canExecute('link')}
              onPress={() => {
                execute('link');
              }}
            >
              Insert link
            </Button>
            <Button
              variant="quiet"
              isDisabled={!canExecute('undo')}
              onPress={() => {
                execute('undo');
              }}
            >
              Undo
            </Button>
          </Toolbar>
        )}
      />
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
