// Research only. Mutate a disposable copy of package.json + dist, never the repository.
import assert from 'node:assert/strict';
import {readFile, readdir, realpath, writeFile} from 'node:fs/promises';
import {resolve, relative} from 'node:path';

const repo = resolve(import.meta.dirname, '../../../../..');

export async function patchPackage(stagingDir) {
  const staging = await realpath(stagingDir);
  assert.notEqual(staging, await realpath(repo), 'A disposable package copy is required.');
  const manifest = JSON.parse(await readFile(resolve(staging, 'package.json'), 'utf8'));
  assert.equal(manifest.name, '@trwhitney/component-library');
  assert.equal(manifest.exports['.'].import, './dist/index.js');
  const root = resolve(staging, 'dist/index.js');
  assert.match(await readFile(root, 'utf8'), /^['"]use client['"];/);
  const declaration = resolve(staging, 'dist/actions/button.d.ts');
  const oldDeclaration = await readFile(declaration, 'utf8');
  const oldCallback = 'readonly onPress?: () => void;';
  assert.equal(oldDeclaration.split(oldCallback).length, 2, 'Expected one current callback.');
  const newCallback = 'readonly onPress?: (event: ButtonPressEvent) => void;';
  const eventType = `export interface ButtonPressEvent {
    readonly target: HTMLButtonElement;
    readonly type: 'press';
    readonly pointerType: 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual';
    readonly shiftKey: boolean;
    readonly ctrlKey: boolean;
    readonly metaKey: boolean;
    readonly altKey: boolean;
}
`;
  await writeFile(declaration, eventType + oldDeclaration.replace(oldCallback, newCallback));
  for (const index of ['dist/actions/index.d.ts', 'dist/index.d.ts']) {
    const path = resolve(staging, index);
    const source = await readFile(path, 'utf8');
    assert(source.includes('type ButtonProps,'));
    await writeFile(
      path,
      source.replace('type ButtonProps,', 'type ButtonPressEvent, type ButtonProps,'),
    );
  }
  const metadataPath = resolve(staging, 'dist/manifest.json');
  const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
  const button = metadata.exports.find((entry) => entry.name === 'Button');
  assert(button);
  button.events = [
    'onPress receives a ButtonPressEvent for one modality-independent activation. Its target is the rendered HTMLButtonElement; type is press; pointerType identifies mouse, pen, touch, keyboard, or virtual input; modifier flags are available. It is not called while disabled or pending. Existing callbacks without parameters remain valid.',
  ];
  button.examples.push({
    title: 'Keep a command focused',
    description:
      'Use the activated button as the focus target, including when its nested label receives the pointer.',
    code: '<Button onPress={(event) => event.target.focus()}>Duplicate item</Button>',
  });
  await writeFile(metadataPath, JSON.stringify(metadata, null, 2) + '\n');

  const stripped = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, {withFileTypes: true})) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (entry.name.endsWith('.js') && path !== root) {
        const before = await readFile(path, 'utf8');
        const after = before.replace(/^(['"])use client\1;[ \t]*$/gm, (directive) =>
          ' '.repeat(directive.length),
        );
        if (before !== after) {
          assert.equal(before.length, after.length);
          await writeFile(path, after);
          stripped.push(relative(staging, path));
        }
      }
    }
  }
  await visit(resolve(staging, 'dist'));
  assert(stripped.length > 0, 'Expected internal client directives.');
  return {
    declaration: relative(staging, declaration),
    callbackType: newCallback,
    stripped: stripped.sort(),
    rootClientBoundary: 'dist/index.js',
    runtimeChanged: false,
  };
}
