import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {renderToString} from 'react-dom/server';
import {hydrateRoot} from 'react-dom/client';
import {Button, MarkdownEditor, Toolbar, type MarkdownEditorProps} from '../src/index.js';

afterEach(cleanup);

const resolve = (target: string) =>
  target === 'Boundary' ? {href: '/notes/boundary', label: 'Boundary review'} : null;
const toolbar: MarkdownEditorProps['renderToolbar'] = (controls) => (
  <Toolbar label="Formatting">
    <Button isDisabled={!controls.canOpenLink} onPress={() => controls.openLink()}>
      Open link
    </Button>
  </Toolbar>
);

describe('application-owned wiki links', () => {
  it.each(['source', 'live-preview'] as const)(
    'does not offer wiki navigation inside an ordinary link label in %s',
    (mode) => {
      const onNavigate = vi.fn();
      const {getByRole} = render(
        <MarkdownEditor
          label="Document"
          mode={mode}
          defaultValue="[See [[Boundary]]](https://example.com)"
          wikiLinks={{resolve, onNavigate}}
          renderToolbar={toolbar}
        />,
      );
      const editor = getByRole('textbox');
      act(() => editor.focus());
      fireEvent.keyDown(editor, {key: 'Home', code: 'Home', ctrlKey: true});
      for (let i = 0; i < 8; i++)
        fireEvent.keyDown(editor, {key: 'ArrowRight', code: 'ArrowRight'});
      expect(getByRole('button', {name: 'Open link'}).hasAttribute('disabled')).toBe(true);
      expect(onNavigate).not.toHaveBeenCalled();
    },
  );
  it.each([
    '[See [[Boundary]]](https://example.com)',
    '[See [[Boundary]]][outer]\n\n[outer]: https://example.com',
  ])('keeps ordinary link ownership when its label contains a wiki target: %s', async (value) => {
    const element = (
      <MarkdownEditor
        label="Document"
        mode="preview"
        defaultValue={value}
        wikiLinks={{resolve, onNavigate: vi.fn()}}
      />
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(element);
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(container.querySelector('a')?.getAttribute('href')).toBe('https://example.com');
    document.body.append(container);
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, element, {onRecoverableError});
      await Promise.resolve();
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    await act(async () => {
      root.unmount();
      await Promise.resolve();
    });
    container.remove();
  });

  it.each(['preview', 'live-preview'] as const)(
    'routes middle-click through the callback in %s',
    (mode) => {
      const onNavigate = vi.fn();
      const {getByRole} = render(
        <MarkdownEditor
          label="Document"
          mode={mode}
          defaultValue="[[Boundary]]"
          wikiLinks={{resolve, onNavigate}}
        />,
      );
      const event = new MouseEvent('auxclick', {button: 1, bubbles: true, cancelable: true});
      fireEvent(getByRole('link', {name: 'Boundary review'}), event);
      expect(event.defaultPrevented).toBe(true);
      expect(onNavigate).toHaveBeenCalledTimes(1);
    },
  );

  it('selects the wiki target for an explicit toolbar action on touch', () => {
    const onNavigate = vi.fn();
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        defaultValue={'Prose\n\n[[Boundary]]'}
        wikiLinks={{resolve, onNavigate}}
        renderToolbar={toolbar}
      />,
    );
    expect(getByRole('button', {name: 'Open link'}).hasAttribute('disabled')).toBe(true);
    const link = getByRole('link', {name: 'Boundary review'});
    fireEvent.touchStart(link, {touches: [{clientX: 10, clientY: 10}]});
    fireEvent.touchEnd(link, {touches: [], changedTouches: [{clientX: 10, clientY: 10}]});
    expect(getByRole('button', {name: 'Open link'}).hasAttribute('disabled')).toBe(false);
    fireEvent.click(getByRole('button', {name: 'Open link'}));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('leaves the retained source selection alone when a touch gesture scrolls', () => {
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        defaultValue={'Prose\n\n[[Boundary]]'}
        wikiLinks={{resolve, onNavigate: vi.fn()}}
        renderToolbar={toolbar}
      />,
    );
    const link = getByRole('link', {name: 'Boundary review'});
    fireEvent.touchStart(link, {touches: [{clientX: 10, clientY: 10}]});
    fireEvent.touchMove(link, {touches: [{clientX: 10, clientY: 100}]});
    fireEvent.touchEnd(link, {touches: [], changedTouches: [{clientX: 10, clientY: 100}]});
    expect(getByRole('button', {name: 'Open link'}).hasAttribute('disabled')).toBe(true);
  });
  it.each([
    '[[Boundary]]',
    '| Note |\n| --- |\n| [[Boundary]] |',
    'A note[^one].\n\n[^one]: [[Boundary]]',
  ])('navigates rendered wiki labels with a modified click in %s', (value) => {
    const onNavigate = vi.fn();
    const {getByRole, container} = render(
      <MarkdownEditor label="Document" defaultValue={value} wikiLinks={{resolve, onNavigate}} />,
    );
    const link = getByRole('link', {name: 'Boundary review'});
    fireEvent.mouseDown(link, {button: 0, ctrlKey: true});
    fireEvent.click(link, {button: 0, ctrlKey: true});
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(container.querySelector('textarea')?.value).toBe(value);
  });

  it('refreshes the rendered target and toolbar when resolution changes without editing', () => {
    const onNavigate = vi.fn();
    const props = {label: 'Document', defaultValue: '[[Boundary]]', renderToolbar: toolbar};
    const {getByRole, rerender, queryByRole} = render(
      <MarkdownEditor {...props} wikiLinks={{resolve, onNavigate}} />,
    );
    expect(getByRole('link', {name: 'Boundary review'})).toBeTruthy();
    expect(getByRole('button', {name: 'Open link'}).hasAttribute('disabled')).toBe(false);
    rerender(<MarkdownEditor {...props} wikiLinks={{resolve: () => null, onNavigate}} />);
    expect(queryByRole('link')).toBeNull();
    expect(getByRole('button', {name: 'Open link'}).hasAttribute('disabled')).toBe(true);
  });

  it.each(['source', 'live-preview'] as const)(
    'blocks navigation during composition in %s',
    (mode) => {
      const onNavigate = vi.fn();
      const {getByRole} = render(
        <MarkdownEditor
          label="Document"
          mode={mode}
          defaultValue="[[Boundary]]"
          wikiLinks={{resolve, onNavigate}}
          renderToolbar={toolbar}
        />,
      );
      const editor = getByRole('textbox');
      act(() => editor.focus());
      fireEvent.compositionStart(editor);
      expect(getByRole('button', {name: 'Open link'}).hasAttribute('disabled')).toBe(true);
      fireEvent.keyDown(editor, {key: 'Enter', code: 'Enter', ctrlKey: true, isComposing: true});
      expect(onNavigate).not.toHaveBeenCalled();
      fireEvent.compositionEnd(editor);
    },
  );

  it('hydrates resolved reading links with the same label and destination', async () => {
    const onNavigate = vi.fn();
    const element = (
      <MarkdownEditor
        label="Document"
        mode="preview"
        defaultValue="[[Boundary]]"
        wikiLinks={{resolve, onNavigate}}
      />
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(element);
    document.body.append(container);
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/notes/boundary');
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, element, {onRecoverableError});
      await Promise.resolve();
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    fireEvent.click(container.querySelector('a')!);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    await act(async () => {
      root.unmount();
      await Promise.resolve();
    });
    container.remove();
  });

  it('renders a resolved wiki target as an accessible link and delegates navigation', () => {
    const onNavigate = vi.fn();
    const {getByRole, container} = render(
      <MarkdownEditor
        label="Document"
        mode="preview"
        defaultValue="[[Boundary]] and [[Missing]]"
        wikiLinks={{resolve, onNavigate}}
      />,
    );
    const link = getByRole('link', {name: 'Boundary review'});
    expect(link.getAttribute('href')).toBe('/notes/boundary');
    fireEvent.click(link);
    expect(onNavigate).toHaveBeenCalledWith({
      target: 'Boundary',
      href: '/notes/boundary',
      label: 'Boundary review',
    });
    expect(container.querySelector('[data-wcl-wiki-link="unresolved"]')?.textContent).toBe(
      'Missing',
    );
  });

  it.each(['source', 'live-preview'] as const)(
    'opens the selected wiki link intentionally in %s',
    (mode) => {
      const onNavigate = vi.fn();
      const onChange = vi.fn();
      const {getByRole} = render(
        <MarkdownEditor
          label="Document"
          mode={mode}
          defaultValue="[[Boundary]]"
          onChange={onChange}
          wikiLinks={{resolve, onNavigate}}
          renderToolbar={toolbar}
        />,
      );
      const editor = getByRole('textbox');
      act(() => editor.focus());
      fireEvent.keyDown(editor, {key: 'ArrowRight', code: 'ArrowRight'});
      fireEvent.keyDown(editor, {key: 'Enter', code: 'Enter', ctrlKey: true});
      expect(onNavigate).toHaveBeenCalledTimes(1);
      fireEvent.click(getByRole('button', {name: 'Open link'}));
      expect(onNavigate).toHaveBeenCalledTimes(2);
      expect(onChange).not.toHaveBeenCalled();
    },
  );

  it('shows a resolved label in inactive Live Preview and retains source on ordinary click', () => {
    const onNavigate = vi.fn();
    const {getByRole, container} = render(
      <MarkdownEditor
        label="Document"
        defaultValue="[[Boundary]]"
        wikiLinks={{resolve, onNavigate}}
      />,
    );
    const link = getByRole('link', {name: 'Boundary review'});
    fireEvent.mouseDown(link, {button: 0});
    expect(onNavigate).not.toHaveBeenCalled();
    expect(container.querySelector('textarea')?.value).toBe('[[Boundary]]');
    expect(getByRole('textbox').textContent).toContain('[[Boundary]]');
  });

  it.each(['javascript:alert(1)', 'data:text/html,<h1>bad</h1>', 'vbscript:msgbox(1)'])(
    'keeps unsafe resolution inert: %s',
    (href) => {
      const onNavigate = vi.fn();
      const {queryByRole, getByText} = render(
        <MarkdownEditor
          label="Document"
          mode="preview"
          defaultValue="[[Boundary]]"
          wikiLinks={{resolve: () => ({href}), onNavigate}}
        />,
      );
      expect(queryByRole('link')).toBeNull();
      fireEvent.click(getByText('Boundary'));
      expect(onNavigate).not.toHaveBeenCalled();
    },
  );

  it('keeps code and escaped wiki syntax literal', () => {
    const onNavigate = vi.fn();
    const {queryByRole} = render(
      <MarkdownEditor
        label="Document"
        mode="preview"
        defaultValue={'`[[Boundary]]` and \\[\\[Boundary]]\n\n```\n[[Boundary]]\n```'}
        wikiLinks={{resolve, onNavigate}}
      />,
    );
    expect(queryByRole('link')).toBeNull();
  });

  it('allows reading navigation when read-only and prevents navigation when disabled', () => {
    const onNavigate = vi.fn();
    const props = {
      label: 'Document',
      defaultValue: '[[Boundary]]',
      wikiLinks: {resolve, onNavigate},
      renderToolbar: toolbar,
    };
    const {getByRole, rerender} = render(<MarkdownEditor {...props} isReadOnly />);
    act(() => getByRole('textbox').focus());
    fireEvent.keyDown(getByRole('textbox'), {key: 'ArrowRight', code: 'ArrowRight'});
    fireEvent.click(getByRole('button', {name: 'Open link'}));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    rerender(<MarkdownEditor {...props} isDisabled />);
    expect(getByRole('button', {name: 'Open link'}).hasAttribute('disabled')).toBe(true);
    fireEvent.click(getByRole('button', {name: 'Open link'}));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
