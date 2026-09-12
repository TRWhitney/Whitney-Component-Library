import type {
  MarkdownExtension,
  MarkdownSyntax,
  MarkdownExtensionCommand,
  MarkdownLinkResolver,
  MarkdownSnapshot,
  MarkdownDecoration,
  MarkdownCommandResult,
  MarkdownSelection,
} from './extension-types.js';
import type {MarkdownWikiLinks} from './markdown-types.js';

export interface MarkdownRegistry {
  readonly syntax: readonly MarkdownSyntax[];
  readonly commands: readonly MarkdownExtensionCommand[];
  readonly decorators: readonly NonNullable<MarkdownExtension['decorate']>[];
  readonly links: readonly MarkdownLinkResolver[];
}
export const emptyRegistry: MarkdownRegistry = Object.freeze({
  syntax: [],
  commands: [],
  decorators: [],
  links: [],
});
const treatments = ['highlight', 'accent', 'muted'];
function reject(message: string): never {
  throw new TypeError(`Markdown extension: ${message}`);
}
function shape(
  value: unknown,
  required: readonly string[],
  optional: readonly string[] = [],
): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    reject('expected a declaration object');
  for (const key of Object.keys(value))
    if (!required.includes(key) && !optional.includes(key)) reject(`unsupported property ${key}`);
  for (const key of required) if (!(key in value)) reject(`missing ${key}`);
}
function array(value: unknown): asserts value is readonly unknown[] {
  if (!Array.isArray(value)) reject('expected an array');
}
function callback(value: unknown) {
  if (typeof value !== 'function') reject('expected a callback');
}
function position(value: unknown, length: number): asserts value is number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0 || value > length)
    reject('range is outside the document');
}
function selection(value: MarkdownSelection, length: number) {
  shape(value, ['anchor', 'head']);
  position(value.anchor, length);
  position(value.head, length);
}

export function compileExtensions(
  extensions: readonly MarkdownExtension[] | undefined,
): MarkdownRegistry {
  if (extensions === undefined) return emptyRegistry;
  array(extensions);
  if (!extensions.length) return emptyRegistry;
  const ids = new Set<string>(),
    shortcuts = new Set<string>(),
    syntax: MarkdownSyntax[] = [],
    commands: MarkdownExtensionCommand[] = [],
    decorators: NonNullable<MarkdownExtension['decorate']>[] = [],
    links: MarkdownLinkResolver[] = [];
  function identify(id: string) {
    if (typeof id !== 'string' || !/^[a-z][a-z0-9.-]*$/.test(id) || ids.has(id))
      reject(`invalid or duplicate identifier ${String(id)}`);
    ids.add(id);
  }
  for (const extension of extensions) {
    shape(extension, ['id'], ['syntax', 'commands', 'decorate', 'links']);
    identify(extension.id);
    if (extension.syntax !== undefined) {
      array(extension.syntax);
      for (const declaration of extension.syntax) {
        if (declaration.kind === 'inline' || declaration.kind === 'color') {
          shape(
            declaration,
            declaration.kind === 'inline'
              ? ['id', 'kind', 'delimiter', 'treatment']
              : ['id', 'kind', 'delimiter'],
          );
          if (
            typeof declaration.delimiter !== 'string' ||
            !/^([=+%^])\1{1,3}$/.test(declaration.delimiter) ||
            (declaration.kind === 'inline' && !treatments.includes(declaration.treatment))
          )
            reject('unsupported inline syntax');
          if (
            syntax.some(
              (s) =>
                s.kind !== 'fence' &&
                (s.delimiter.startsWith(declaration.delimiter) ||
                  declaration.delimiter.startsWith(s.delimiter)),
            )
          )
            reject('overlapping inline delimiters');
        } else if (declaration.kind === 'fence') {
          shape(declaration, ['id', 'kind', 'name', 'treatment']);
          if (
            typeof declaration.name !== 'string' ||
            !/^[a-z][a-z0-9-]*$/.test(declaration.name) ||
            !['note', 'warning'].includes(declaration.treatment)
          )
            reject('unsupported fenced syntax');
          if (syntax.some((s) => s.kind === 'fence' && s.name === declaration.name))
            reject('duplicate fence name');
        } else reject('unsupported syntax kind');
        identify(declaration.id);
        syntax.push(Object.freeze({...declaration}));
      }
    }
    if (extension.commands !== undefined) {
      array(extension.commands);
      for (const command of extension.commands) {
        shape(command, ['id', 'execute'], ['shortcut', 'isEnabled']);
        identify(command.id);
        callback(command.execute);
        if (command.isEnabled !== undefined) callback(command.isEnabled);
        if (command.shortcut !== undefined) {
          if (
            !/^Mod-Shift-[A-Z]$/.test(command.shortcut) ||
            /[BCIKUXYZ]$/.test(command.shortcut) ||
            shortcuts.has(command.shortcut)
          )
            reject('unsupported or conflicting shortcut');
          shortcuts.add(command.shortcut);
        }
        commands.push(Object.freeze({...command}));
      }
    }
    if (extension.decorate !== undefined) {
      callback(extension.decorate);
      decorators.push(extension.decorate);
    }
    if (extension.links !== undefined) {
      array(extension.links);
      for (const link of extension.links) {
        shape(link, ['prefix', 'resolve', 'onNavigate']);
        callback(link.resolve);
        callback(link.onNavigate);
        if (
          typeof link.prefix !== 'string' ||
          !link.prefix.trim() ||
          links.some(
            (previous) =>
              previous.prefix.startsWith(link.prefix) || link.prefix.startsWith(previous.prefix),
          )
        )
          reject('empty or overlapping link prefix');
        links.push(Object.freeze({...link}));
      }
    }
  }
  return Object.freeze({
    syntax: Object.freeze(syntax),
    commands: Object.freeze(commands),
    decorators: Object.freeze(decorators),
    links: Object.freeze(links),
  });
}

export function extensionWikiLinks(
  registry: MarkdownRegistry,
  fallback: MarkdownWikiLinks | undefined,
): MarkdownWikiLinks | undefined {
  if (!registry.links.length) return fallback;
  const owner = (target: string) =>
    registry.links.find((link) => target.startsWith(link.prefix)) ?? fallback;
  return {
    resolve: (target) => owner(target)?.resolve(target) ?? null,
    onNavigate: (link) => owner(link.target)?.onNavigate(link),
  };
}
export function markdownSnapshot(value: string, current: MarkdownSelection): MarkdownSnapshot {
  return Object.freeze({
    value,
    selection: Object.freeze({anchor: current.anchor, head: current.head}),
  });
}
export function extensionDecorations(
  registry: MarkdownRegistry,
  snapshot: MarkdownSnapshot,
): readonly MarkdownDecoration[] {
  return registry.decorators.flatMap((decorate) => {
    const result = decorate(snapshot);
    array(result);
    return result.map((range) => {
      shape(range, ['from', 'to', 'treatment']);
      position(range.from, snapshot.value.length);
      position(range.to, snapshot.value.length);
      if (range.to <= range.from || !treatments.includes(range.treatment))
        reject('invalid decoration');
      return {...range};
    });
  });
}
export function validateCommandResult(result: MarkdownCommandResult, length: number): void {
  shape(result, ['edits'], ['selection']);
  array(result.edits);
  let end = -1,
    delta = 0;
  for (const edit of result.edits) {
    shape(edit, ['from', 'to', 'insert']);
    position(edit.from, length);
    position(edit.to, length);
    if (edit.to < edit.from || edit.from < end || typeof edit.insert !== 'string')
      reject('edits must be ordered and disjoint');
    end = edit.to;
    delta += edit.insert.length - (edit.to - edit.from);
  }
  if (result.selection !== undefined) selection(result.selection, length + delta);
}
