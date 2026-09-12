import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {afterEach, expect, it} from 'vitest';
import {AppearanceProvider, MarkdownEditor, type MarkdownExtension} from '../src/index.js';
afterEach(cleanup);
const extensions: readonly MarkdownExtension[] = [
  {id: 'review', syntax: [{id: 'text-color', kind: 'color', delimiter: '%%'}]},
];
const value = 'Check %%rgba(180, 35, 24, 0.85) north boundary%%.';
it.each([
  '| Name | Color |\n| --- | --- |\n| North | %%rgba(180,35,24,0.85) boundary%% |',
  '[^1]: Note %%rgba(180,35,24,0.85) boundary%%',
])('previews RGBA when its enclosing block reveals source (%s)', (source) => {
  const {container, getByRole} = render(
    <MarkdownEditor label="Document" defaultValue={source} extensions={extensions} />,
  );
  expect(container.querySelector('[data-wcl-markdown-color-swatch]')).toBeNull();
  const editor = getByRole('textbox');
  act(() => editor.focus());
  expect(editor.textContent).toContain('%%rgba(180,35,24,0.85) boundary%%');
  expect(container.querySelector('[data-wcl-markdown-color-swatch]')).not.toBeNull();
  expect(container.querySelector('textarea')?.value).toBe(source);
  act(() => editor.blur());
  expect(container.querySelector('[data-wcl-markdown-color-swatch]')).toBeNull();
});
it.each(['preview', 'live-preview'] as const)(
  'renders stored RGBA in %s without rewriting the Markdown',
  (mode) => {
    const {container} = render(
      <AppearanceProvider appearance="dark" accent="#2878ff">
        <MarkdownEditor label="Document" mode={mode} defaultValue={value} extensions={extensions} />
      </AppearanceProvider>,
    );
    const text = container.querySelector<HTMLElement>('[data-wcl-markdown-rgba]');
    expect(text?.textContent).toBe('north boundary');
    expect(text?.style.color).toBe('rgba(180, 35, 24, 0.85)');
    expect(container.querySelector('textarea')?.value).toBe(value);
  },
);
it('shows a swatch in source and when Live Preview exposes the color', () => {
  const {container, getByRole, rerender} = render(
    <MarkdownEditor label="Document" mode="source" defaultValue={value} extensions={extensions} />,
  );
  expect(container.querySelector('[data-wcl-markdown-color-swatch]')).not.toBeNull();
  rerender(
    <MarkdownEditor
      label="Document"
      mode="live-preview"
      defaultValue={value}
      extensions={extensions}
    />,
  );
  expect(container.querySelector('[data-wcl-markdown-color-swatch]')).toBeNull();
  const editor = getByRole('textbox');
  act(() => editor.focus());
  fireEvent.keyDown(editor, {key: 'Home', ctrlKey: true});
  for (let i = 0; i < 12; i++) fireEvent.keyDown(editor, {key: 'ArrowRight'});
  expect(editor.textContent).toContain('rgba(180, 35, 24, 0.85)');
  expect(container.querySelector('[data-wcl-markdown-color-swatch]')).not.toBeNull();
  expect(container.querySelector('textarea')?.value).toBe(value);
});
it.each([
  'rgba(256,0,0,1)',
  'rgba(0,0,0,2)',
  'rgba(-1,0,0,1)',
  'rgba(0,0,0,0.5);background:url(https://example.com)',
])('leaves unsupported color %s literal', (color) => {
  const source = `%%${color} north%%`;
  const {container} = render(
    <MarkdownEditor
      label="Document"
      mode="preview"
      defaultValue={source}
      extensions={extensions}
    />,
  );
  expect(container.querySelector('[data-wcl-markdown-rgba]')).toBeNull();
  expect(container.querySelector('textarea')?.value).toBe(source);
});
