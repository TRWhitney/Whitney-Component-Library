import {Facet} from '@codemirror/state';
import type {Literal, Nodes, Root} from 'mdast';
import type {Extension as TreeExtension} from 'mdast-util-from-markdown';
import type {Extension, State, Tokenizer} from 'micromark-util-types';
import type {Plugin} from 'unified';
import type {} from 'remark-parse';
import type {MarkdownSyntax} from './extension-types.js';
import {parseColorContent} from './rgba-color.js';

export const emptyMarkdownSyntax: readonly MarkdownSyntax[] = Object.freeze([]);
export const markdownSyntax = Facet.define<readonly MarkdownSyntax[], readonly MarkdownSyntax[]>({
  combine: (values) => values[0] ?? emptyMarkdownSyntax,
});

interface ExtensionInline extends Literal {
  type: 'wclExtensionInline';
  value: string;
  color?: string;
  colorOffset?: number;
}
interface ExtensionFence extends Literal {
  type: 'wclExtensionFence';
  value: string;
}
declare module 'mdast' {
  interface PhrasingContentMap {
    wclExtensionInline: ExtensionInline;
  }
  interface RootContentMap {
    wclExtensionInline: ExtensionInline;
    wclExtensionFence: ExtensionFence;
  }
}
declare module 'micromark-util-types' {
  interface TokenTypeMap {
    wclExtensionInline: 'wclExtensionInline';
  }
}

function inlineTokenizer(delimiter: string, color: boolean): Tokenizer {
  const marker = delimiter.charCodeAt(0);
  return function (effects, ok, nok) {
    let opening = 0;
    let closing = 0;
    let content = '';
    const previous = this.previous;
    return start;
    function start(code: Parameters<State>[0]): ReturnType<State> {
      // Exact delimiter runs also prevent starting halfway through an escaped opener.
      if (previous === marker || code !== marker) return nok(code);
      effects.enter('wclExtensionInline');
      return open(code);
    }
    function open(code: Parameters<State>[0]): ReturnType<State> {
      if (code !== marker) return nok(code);
      effects.consume(code);
      return ++opening === delimiter.length ? body : open;
    }
    function body(code: Parameters<State>[0]): ReturnType<State> {
      if (code === marker) {
        if (!content || content.trim() !== content) return nok(code);
        if (color && !parseColorContent(content)) return nok(code);
        return close(code);
      }
      // Built-in markup and escaped/entity text retain their own Markdown parsing.
      if (code === null || code < -2) return nok(code);
      const character = code === -2 ? '\t' : code === -1 ? ' ' : String.fromCodePoint(code);
      if (/[\\`*_~[\]<>!&]/.test(character)) return nok(code);
      content += character;
      if (/[=+%^]{2}/.test(content.slice(-2))) return nok(code);
      effects.consume(code);
      return body;
    }
    function close(code: Parameters<State>[0]): ReturnType<State> {
      if (code !== marker) return nok(code);
      effects.consume(code);
      return ++closing === delimiter.length ? end : close;
    }
    function end(code: Parameters<State>[0]): ReturnType<State> {
      if (code === marker) return nok(code);
      effects.exit('wclExtensionInline');
      return ok(code);
    }
  };
}

/** Private parser integration. Public extensions supply declarations, never plugins. */
export const remarkExtensionSyntax: Plugin<[readonly MarkdownSyntax[]], Root> = function (
  declarations,
) {
  const inline = declarations.filter((item) => item.kind === 'inline' || item.kind === 'color');
  const fences = declarations.filter((item) => item.kind === 'fence');
  const syntax: Extension = {text: {}};
  for (const declaration of inline) {
    syntax.text![declaration.delimiter.charCodeAt(0)] = {
      name: 'wclExtensionInline',
      tokenize: inlineTokenizer(declaration.delimiter, declaration.kind === 'color'),
    };
  }
  const tree: TreeExtension = {
    enter: {
      wclExtensionInline(token) {
        const source = this.sliceSerialize(token);
        const declaration = inline.find((item) => source.startsWith(item.delimiter))!;
        const content = source.slice(declaration.delimiter.length, -declaration.delimiter.length);
        const colored = declaration.kind === 'color' ? parseColorContent(content)! : null;
        const value = colored?.value ?? content;
        this.enter(
          {
            type: 'wclExtensionInline',
            value,
            ...(colored ? {color: colored.color, colorOffset: declaration.delimiter.length} : {}),
            data: {
              hName:
                declaration.kind === 'inline' && declaration.treatment === 'highlight'
                  ? 'mark'
                  : 'span',
              hProperties: colored
                ? {'data-wcl-markdown-rgba': colored.color}
                : declaration.kind === 'inline'
                  ? {'data-wcl-markdown-treatment': declaration.treatment}
                  : {},
              hChildren: [{type: 'text', value}],
            },
          },
          token,
        );
      },
    },
    exit: {
      wclExtensionInline(token) {
        this.exit(token);
      },
    },
  };
  const data = this.data();
  (data.micromarkExtensions ??= []).push(syntax);
  (data.fromMarkdownExtensions ??= []).push(tree);
  return (root) => {
    function visit(node: Nodes): void {
      if (node.type === 'code' && !node.meta) {
        const declaration = fences.find((item) => item.name === node.lang);
        if (declaration)
          Object.assign(node, {
            type: 'wclExtensionFence',
            data: {
              hName: 'aside',
              hProperties: {role: 'note', 'data-wcl-markdown-treatment': declaration.treatment},
              hChildren: [
                {
                  type: 'element',
                  tagName: 'pre',
                  properties: {},
                  children: [{type: 'text', value: node.value}],
                },
              ],
            },
          });
      }
      if ('children' in node) node.children.forEach(visit);
    }
    visit(root);
  };
};
