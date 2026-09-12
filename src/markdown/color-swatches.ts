import {Facet, StateField, type EditorState, type Extension, type Range} from '@codemirror/state';
import {Decoration, EditorView, WidgetType, type DecorationSet} from '@codemirror/view';
import type {Nodes} from 'mdast';
import {wikiDocument} from './wiki-navigation.js';
import {markdownSyntax} from './extension-syntax.js';
import {sourceRange, isLiveSourceBlock} from './live-document.js';
import {liveFocus} from './live-effects.js';

export const colorLiveMode = Facet.define<boolean, boolean>({
  combine: (values) => values[0] ?? false,
});
class ColorSwatch extends WidgetType {
  constructor(readonly color: string) {
    super();
  }
  override eq(other: ColorSwatch): boolean {
    return this.color === other.color;
  }
  override toDOM(view: EditorView): HTMLElement {
    const element = view.dom.ownerDocument.createElement('span');
    element.setAttribute('data-wcl-markdown-color-swatch', '');
    element.setAttribute('aria-hidden', 'true');
    element.title = this.color;
    const fill = view.dom.ownerDocument.createElement('span');
    fill.style.backgroundColor = this.color;
    element.append(fill);
    return element;
  }
  override ignoreEvent(): boolean {
    return false;
  }
}
function swatches(state: EditorState, focused: boolean): DecorationSet {
  const ranges: Range<Decoration>[] = [];
  const live = state.facet(colorLiveMode);
  const active = (from: number, to: number) =>
    focused && state.selection.ranges.some((range) => range.from <= to && range.to >= from);
  function visit(node: Nodes, exposed = false) {
    const {from, to} = sourceRange(node);
    if (live && !exposed && isLiveSourceBlock(node)) {
      if (!active(from, to)) return;
      exposed = true;
    }
    if (
      node.type === 'wclExtensionInline' &&
      node.color !== undefined &&
      node.colorOffset !== undefined
    ) {
      if (!live || exposed || active(from, to))
        ranges.push(
          Decoration.widget({widget: new ColorSwatch(node.color), side: -1}).range(
            from + node.colorOffset,
          ),
        );
    }
    if ('children' in node) node.children.forEach((child) => visit(child, exposed));
  }
  visit(state.field(wikiDocument).tree);
  return Decoration.set(ranges, true);
}
const swatchState = StateField.define<{
  readonly focused: boolean;
  readonly decorations: DecorationSet;
}>({
  create: (state) => ({focused: false, decorations: swatches(state, false)}),
  update(previous, transaction) {
    let focused = previous.focused;
    for (const effect of transaction.effects) if (effect.is(liveFocus)) focused = effect.value;
    if (
      !transaction.docChanged &&
      !transaction.selection &&
      focused === previous.focused &&
      transaction.state.facet(markdownSyntax) === transaction.startState.facet(markdownSyntax) &&
      transaction.state.facet(colorLiveMode) === transaction.startState.facet(colorLiveMode)
    )
      return previous;
    return {focused, decorations: swatches(transaction.state, focused)};
  },
  provide: (field) => EditorView.decorations.from(field, (value) => value.decorations),
});
export const colorSwatches: Extension = swatchState;
