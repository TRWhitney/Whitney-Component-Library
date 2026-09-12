import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type {Nodes, Root, Definition, FootnoteDefinition, RootContent} from 'mdast';
import type {ChangeSet} from '@codemirror/state';

import {remarkWikiLinks} from './wiki-syntax.js';

const parser = unified().use(remarkParse).use(remarkGfm).use(remarkWikiLinks).freeze();

export interface LiveDocument {
  readonly tree: Root;
  readonly value: string;
  readonly definitions: readonly Definition[];
  readonly footnotes: ReadonlyMap<string, number>;
  readonly referenceSource: string;
  readonly referenceKey: string;
}

function describe(tree: Root, value: string): LiveDocument {
  const definitions: Definition[] = [];
  const footnotes = new Map<string, number>();
  const footnoteDefinitions = new Map<string, FootnoteDefinition>();
  const sources: string[] = [];
  const references: string[] = [];
  function visit(node: Nodes): void {
    if (node.type === 'definition') definitions.push(node);
    if (node.type === 'definition' || node.type === 'footnoteDefinition') {
      const {from, to} = sourceRange(node);
      sources.push(value.slice(from, to));
    }
    if (node.type === 'footnoteDefinition' && !footnoteDefinitions.has(node.identifier)) {
      footnoteDefinitions.set(node.identifier, node);
    }
    if ('children' in node) node.children.forEach(visit);
  }
  visit(tree);
  // Reading preview visits document references first, then each referenced definition's
  // contents. Newly discovered references extend that order, including nested footnotes.
  function visitReferences(node: Nodes): void {
    if (node.type === 'footnoteDefinition') return;
    if (node.type === 'footnoteReference') {
      references.push(node.identifier);
      if (!footnotes.has(node.identifier)) footnotes.set(node.identifier, footnotes.size + 1);
    }
    if ('children' in node) node.children.forEach(visitReferences);
  }
  visitReferences(tree);
  for (const identifier of footnotes.keys()) {
    footnoteDefinitions.get(identifier)?.children.forEach(visitReferences);
  }
  const referenceSource = sources.join('\n\n');
  return {
    tree,
    value,
    definitions,
    footnotes,
    referenceSource,
    referenceKey: JSON.stringify([referenceSource, references]),
  };
}

export function parseLiveDocument(value: string): LiveDocument {
  return describe(parser.parse(value), value);
}

// A one-line edit inside an existing top-level paragraph cannot change an earlier block.
// Reparse that paragraph with the document's definition context. If its block kind changes,
// or the edit crosses a structural boundary, let the full parser resolve the document.
export function updateLiveDocument(
  previous: LiveDocument,
  changes: ChangeSet,
  value: string,
): LiveDocument {
  const edits: {from: number; to: number; insert: string}[] = [];
  changes.iterChanges((from, to, _fromB, _toB, insert) =>
    edits.push({from, to, insert: insert.toString()}),
  );
  const edit = edits[0];
  if (
    edits.length !== 1 ||
    !edit ||
    /[\r\n]/.test(edit.insert + previous.value.slice(edit.from, edit.to))
  ) {
    return parseLiveDocument(value);
  }
  const blocks = previous.tree.children;
  let index = blocks.findIndex(
    (node) =>
      node.type === 'paragraph' &&
      sourceRange(node).from <= edit.from &&
      sourceRange(node).to >= edit.to,
  );
  const original = blocks[index];
  let from: number;
  let to: number;
  let baseLine: number;
  let baseColumn: number;
  if (original) {
    ({from, to} = sourceRange(original));
    baseLine = original.position!.start.line;
    baseColumn = original.position!.start.column;
  } else {
    const last = blocks[blocks.length - 1];
    const lastEnd = last ? sourceRange(last).to : 0;
    const gap = previous.value.slice(lastEnd, edit.from);
    if (
      edit.from !== previous.value.length ||
      edit.to !== edit.from ||
      (last && !/^\n\s*\n$/.test(gap)) ||
      /^[ \t]/.test(edit.insert)
    )
      return parseLiveDocument(value);
    from = to = edit.from;
    index = blocks.length;
    baseLine = previous.value.split('\n').length;
    baseColumn = 1;
  }
  const delta = edit.insert.length - (edit.to - edit.from);
  const text = value.slice(from, to + delta);
  const parsed = parser.parse(`${text}\n\n${previous.referenceSource}`);
  const local = parsed.children.filter((node) => sourceRange(node).from < text.length);
  if (
    local.length !== 1 ||
    local[0]?.type !== 'paragraph' ||
    sourceRange(local[0]).to > text.length
  ) {
    return parseLiveDocument(value);
  }
  function positionNode<T extends Nodes>(node: T, offset: number, line: number, column: number): T {
    const position = node.position;
    const point = (p: NonNullable<Nodes['position']>['start']) => ({
      line: p.line + line,
      column: p.column + (p.line === 1 ? column : 0),
      offset: (p.offset ?? 0) + offset,
    });
    return {
      ...node,
      ...(position ? {position: {start: point(position.start), end: point(position.end)}} : {}),
      ...('children' in node
        ? {children: node.children.map((child) => positionNode(child, offset, line, column))}
        : {}),
    };
  }
  const updated = positionNode(local[0], from, baseLine - 1, baseColumn - 1);
  const children: RootContent[] = [
    ...blocks.slice(0, index),
    updated,
    ...blocks.slice(index + (original ? 1 : 0)).map((node) => positionNode(node, delta, 0, 0)),
  ];
  return describe({type: 'root', children}, value);
}

export function sourceRange(node: Nodes): {from: number; to: number} {
  return {from: node.position?.start.offset ?? 0, to: node.position?.end.offset ?? 0};
}

export function footnoteContent(node: FootnoteDefinition): Root {
  return {type: 'root', children: node.children};
}
