import {Facet, StateField, Transaction, type EditorState, type Extension} from '@codemirror/state';
import {Decoration, EditorView, keymap, type DecorationSet} from '@codemirror/view';
import {isolateHistory} from '@codemirror/commands';
import {
  emptyRegistry,
  extensionDecorations,
  markdownSnapshot,
  validateCommandResult,
  type MarkdownRegistry,
} from './extension-registry.js';
import {liveComposition} from './live-effects.js';

const registryFacet = Facet.define<MarkdownRegistry, MarkdownRegistry>({
  combine: (values) => values[0] ?? emptyRegistry,
});
interface ExtensionState {
  readonly composing: boolean;
  readonly available: readonly string[];
  readonly decorations: DecorationSet;
}
function present(state: EditorState, composing: boolean): ExtensionState {
  const registry = state.facet(registryFacet);
  if (!registry.commands.length && !registry.decorators.length)
    return {composing, available: [], decorations: Decoration.none};
  const snapshot = markdownSnapshot(state.doc.toString(), state.selection.main);
  const editable = !composing && !state.readOnly && state.facet(EditorView.editable);
  const available = editable
    ? registry.commands
        .filter((command) => {
          const enabled = command.isEnabled ? command.isEnabled(snapshot) : true;
          if (typeof enabled !== 'boolean')
            throw new TypeError('Markdown extension: isEnabled must return a boolean');
          return enabled;
        })
        .map((command) => command.id)
    : [];
  const decorations = Decoration.set(
    extensionDecorations(registry, snapshot).map((range) =>
      Decoration.mark({attributes: {'data-wcl-markdown-treatment': range.treatment}}).range(
        range.from,
        range.to,
      ),
    ),
    true,
  );
  return {composing, available, decorations};
}
const extensionState = StateField.define<ExtensionState>({
  create: (state) => present(state, false),
  update(previous, transaction) {
    let composing = previous.composing;
    for (const effect of transaction.effects)
      if (effect.is(liveComposition)) composing = effect.value;
    if (
      !transaction.docChanged &&
      !transaction.selection &&
      composing === previous.composing &&
      transaction.state.facet(registryFacet) === transaction.startState.facet(registryFacet) &&
      transaction.state.readOnly === transaction.startState.readOnly &&
      transaction.state.facet(EditorView.editable) ===
        transaction.startState.facet(EditorView.editable)
    )
      return previous;
    return present(transaction.state, composing);
  },
  provide: (field) => EditorView.decorations.from(field, (value) => value.decorations),
});
export const declaredExtensions: Extension = extensionState;
export function configureExtensions(registry: MarkdownRegistry): Extension {
  return [
    registryFacet.of(registry),
    keymap.of(
      registry.commands.flatMap((command) =>
        command.shortcut
          ? [
              {
                key: command.shortcut.slice(0, -1) + command.shortcut.slice(-1).toLowerCase(),
                run: (view: EditorView) => {
                  executeExtension(view, command.id);
                  return true;
                },
              },
            ]
          : [],
      ),
    ),
  ];
}
export function extensionCommandStatus(view: EditorView): readonly string[] {
  return view.composing ? [] : view.state.field(extensionState).available;
}
export function executeExtension(view: EditorView, id: string): boolean {
  if (!extensionCommandStatus(view).includes(id)) return false;
  const command = view.state.facet(registryFacet).commands.find((command) => command.id === id);
  if (!command) return false;
  const result = command.execute(
    markdownSnapshot(view.state.doc.toString(), view.state.selection.main),
  );
  if (result === null) return false;
  validateCommandResult(result, view.state.doc.length);
  if (!result.edits.length && !result.selection) return false;
  const transaction = view.state.update({
    changes: result.edits,
    ...(result.selection ? {selection: result.selection} : {}),
    annotations: [isolateHistory.of('full'), Transaction.userEvent.of('input.extension')],
    scrollIntoView: true,
  });
  // Evaluate contributed state before committing an edit, so invalid decoration ranges cannot
  // leave the canonical document partially changed.
  void transaction.state;
  view.dispatch(transaction);
  view.focus();
  return true;
}
