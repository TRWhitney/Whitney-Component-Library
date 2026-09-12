import type {Extension as MarkdownExtension} from 'mdast-util-from-markdown';
import type {Extension, State, Tokenizer} from 'micromark-util-types';
import type {Plugin} from 'unified';
import type {Literal, Root} from 'mdast';
import type {} from 'remark-parse';

interface WikiLink extends Literal {
  type: 'wclWikiLink';
  value: string;
}
declare module 'mdast' {
  interface PhrasingContentMap {
    wclWikiLink: WikiLink;
  }
  interface RootContentMap {
    wclWikiLink: WikiLink;
  }
}

declare module 'micromark-util-types' {
  interface TokenTypeMap {
    wclWikiLink: 'wclWikiLink';
  }
}

// A tokenizer runs only in Markdown phrasing, after escape and code handling. It does not
// reinterpret rendered text or replace bracket-like content inside code or destinations.
const tokenize: Tokenizer = function (effects, ok, nok) {
  let content = '';
  return start;
  function start(code: Parameters<State>[0]): ReturnType<State> {
    if (code !== 91) return nok(code);
    effects.enter('wclWikiLink');
    effects.consume(code);
    return second;
  }
  function second(code: Parameters<State>[0]): ReturnType<State> {
    if (code !== 91) return nok(code);
    effects.consume(code);
    return body;
  }
  function body(code: Parameters<State>[0]): ReturnType<State> {
    if (code === 93 && content.trim()) {
      effects.consume(code);
      return close;
    }
    // This ticket accepts simple wiki targets, not embeds, aliases, escapes, or nested markup.
    if (code === null || code < 0 || code === 91 || code === 93 || code === 92 || code === 124)
      return nok(code);
    content += String.fromCodePoint(code);
    effects.consume(code);
    return body;
  }
  function close(code: Parameters<State>[0]): ReturnType<State> {
    if (code !== 93) return nok(code);
    effects.consume(code);
    effects.exit('wclWikiLink');
    return ok;
  }
};

const syntax: Extension = {text: {91: {name: 'wclWikiLink', tokenize}}};
const treeExtension: MarkdownExtension = {
  enter: {
    wclWikiLink(token) {
      const value = this.sliceSerialize(token).slice(2, -2);
      this.enter(
        {
          type: 'wclWikiLink',
          value,
          data: {
            hName: 'span',
            hProperties: {'data-wcl-wiki-link': ''},
            hChildren: [{type: 'text', value}],
          },
        },
        token,
      );
    },
  },
  exit: {
    wclWikiLink(token) {
      this.exit(token);
    },
  },
};

export const remarkWikiLinks: Plugin<[], Root> = function () {
  const data = this.data();
  (data.micromarkExtensions ??= []).push(syntax);
  (data.fromMarkdownExtensions ??= []).push(treeExtension);
};
