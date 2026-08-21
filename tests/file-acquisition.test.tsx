import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {DropZone, FileTrigger, type FileAcquisitionResult} from '../src/index.js';
import {createFileDragPreflight, resolveDroppedFiles} from '../src/files/file-validation.js';

afterEach(cleanup);

function announcement(result: FileAcquisitionResult): string {
  if (result.rejectedFiles.length > 0) return 'Some files were rejected.';
  return `${result.files.length} files accepted.`;
}

describe('file acquisition', () => {
  it('consumes native file drag eligibility once', () => {
    const preflight = createFileDragPreflight();
    preflight.capture({items: [{kind: 'file'}], types: []});

    expect(preflight.consume()).toBe(true);
    expect(preflight.consume()).toBe(false);
  });

  it('keeps native file eligibility through preflight and expires it before a later event', async () => {
    const preflight = createFileDragPreflight();
    preflight.capture({items: [{kind: 'file'}], types: []});

    await Promise.resolve();

    expect(preflight.consume()).toBe(true);
    preflight.capture({items: [{kind: 'file'}], types: []});
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(preflight.consume()).toBe(false);
  });

  it('keeps readable files when another dropped file cannot be read', async () => {
    const file = new File(['diagram'], 'diagram.png', {type: 'image/png'});

    await expect(
      resolveDroppedFiles([
        {getFile: () => Promise.resolve(file)},
        {getFile: () => Promise.reject(new Error('File access was revoked.'))},
      ]),
    ).resolves.toEqual([file]);
  });

  it('opens a constrained native picker and reports accepted consumer-owned files', () => {
    const onFiles = vi.fn();
    render(
      <FileTrigger
        acceptedFileTypes={['image/png', '.jpg']}
        allowsMultiple
        description="PNG or JPG, up to 2 MB each."
        getAnnouncement={announcement}
        label="Choose reference images"
        maxFileSize={2_000_000}
        onFiles={onFiles}
      />,
    );

    const button = screen.getByRole('button', {name: 'Choose reference images'});
    const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
    const first = new File(['diagram'], 'diagram.png', {type: 'image/png'});
    const second = new File(['photo'], 'photo.jpg', {type: 'image/jpeg'});

    expect(input.accept).toBe('image/png,.jpg');
    expect(input.multiple).toBe(true);
    expect(button.getAttribute('aria-describedby')?.split(' ')).toContain(
      screen.getByText('PNG or JPG, up to 2 MB each.').id,
    );

    fireEvent.change(input, {target: {files: [first, second]}});

    expect(onFiles).toHaveBeenCalledWith({
      files: [first, second],
      rejectedFiles: [],
      source: 'picker',
    });
    expect(screen.getByRole('status').textContent).toBe('2 files accepted.');
    expect(button.closest('[data-wcl-file-trigger]')?.hasAttribute('data-acquired')).toBe(true);
  });

  it('reports type, size, and multiplicity rejection without passing rejected files as accepted', () => {
    const onFiles = vi.fn();
    render(
      <FileTrigger
        acceptedFileTypes={['image/png']}
        getAnnouncement={announcement}
        label="Choose one diagram"
        maxFileSize={4}
        onFiles={onFiles}
      />,
    );
    const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
    const oversized = new File(['12345'], 'large.png', {type: 'image/png'});
    const wrongType = new File(['text'], 'notes.txt', {type: 'text/plain'});

    fireEvent.change(input, {target: {files: [oversized, wrongType]}});

    expect(onFiles).toHaveBeenCalledWith({
      files: [],
      rejectedFiles: [
        {file: oversized, reasons: ['multiple', 'size']},
        {file: wrongType, reasons: ['multiple', 'type']},
      ],
      source: 'picker',
    });
    expect(screen.getByRole('status').textContent).toBe('Some files were rejected.');
    expect(
      screen
        .getByRole('button', {name: 'Choose one diagram'})
        .closest('[data-wcl-file-trigger]')
        ?.hasAttribute('data-rejected'),
    ).toBe(true);
  });

  it('keeps disabled, invalid, pending, and rejection states distinct', () => {
    const {rerender} = render(
      <DropZone
        actionLabel="Browse evidence"
        description="Drop or paste one PNG."
        getAnnouncement={announcement}
        isDisabled
        label="Evidence"
        onFiles={() => undefined}
      />,
    );
    let zone = screen.getByText('Evidence').closest('[data-wcl-drop-zone]')!;
    expect(zone.hasAttribute('data-disabled')).toBe(true);
    expect(zone.hasAttribute('data-invalid')).toBe(false);

    rerender(
      <DropZone
        actionLabel="Browse evidence"
        description="Drop or paste one PNG."
        errorMessage="Evidence is required."
        getAnnouncement={announcement}
        isInvalid
        label="Evidence"
        onFiles={() => undefined}
      />,
    );
    zone = screen.getByText('Evidence').closest('[data-wcl-drop-zone]')!;
    expect(zone.hasAttribute('data-invalid')).toBe(true);
    expect(screen.getByText('Evidence is required.')).toBeTruthy();

    rerender(
      <DropZone
        actionLabel="Browse evidence"
        description="Drop or paste one PNG."
        getAnnouncement={announcement}
        isPending
        label="Evidence"
        onFiles={() => undefined}
        pendingMessage="Checking evidence"
      />,
    );
    zone = screen.getByText('Evidence').closest('[data-wcl-drop-zone]')!;
    expect(zone.hasAttribute('data-pending')).toBe(true);
    expect(screen.getByRole<HTMLButtonElement>('button', {name: 'Browse evidence'}).disabled).toBe(
      true,
    );
    expect(screen.getByRole('status').textContent).toBe('Checking evidence');
  });

  it('uses the drop-zone glyph as the named native-picker action', () => {
    render(
      <DropZone
        actionLabel="Browse evidence"
        description="Drop or paste one PNG."
        getAnnouncement={announcement}
        label="Evidence"
        onFiles={() => undefined}
      />,
    );

    const picker = screen.getByRole('button', {name: 'Browse evidence'});

    expect(picker.hasAttribute('data-wcl-drop-zone-action')).toBe(true);
    expect(picker.querySelector('[data-wcl-file-glyph]')).toBeTruthy();
    expect(screen.queryByText('Browse evidence')).toBeNull();
    expect(picker.getAttribute('aria-describedby')?.split(' ')).toContain(
      screen.getByText('Drop or paste one PNG.').id,
    );
  });

  it('reports focused clipboard files as paste acquisition', async () => {
    const onFiles = vi.fn();
    const file = new File(['diagram'], 'diagram.png', {type: 'image/png'});
    render(
      <DropZone
        acceptedFileTypes={['image/*']}
        actionLabel="Browse evidence"
        description="Drop or paste an image."
        getAnnouncement={announcement}
        label="Evidence"
        onFiles={onFiles}
      />,
    );
    const dropAffordance = screen.getByRole('button', {name: 'Evidence'});
    dropAffordance.focus();

    fireEvent.paste(dropAffordance, {
      clipboardData: {
        getData: () => '',
        items: [{getAsFile: () => file, kind: 'file', type: file.type}],
        types: ['Files'],
      },
    });

    await waitFor(() =>
      expect(onFiles).toHaveBeenCalledWith({
        files: [file],
        rejectedFiles: [],
        source: 'paste',
      }),
    );
  });

  it('does not let a paste on the picker relabel the next dropped files', async () => {
    const onFiles = vi.fn();
    const file = new File(['diagram'], 'diagram.png', {type: 'image/png'});
    render(
      <DropZone
        actionLabel="Browse evidence"
        getAnnouncement={announcement}
        label="Evidence"
        onFiles={onFiles}
      />,
    );
    const picker = screen.getByRole('button', {name: 'Browse evidence'});

    fireEvent.paste(picker, {
      clipboardData: {
        getData: () => '',
        items: [{getAsFile: () => file, kind: 'file', type: file.type}],
        types: ['Files'],
      },
    });
    await Promise.resolve();

    const zone = screen.getByText('Evidence').closest<HTMLElement>('[data-wcl-drop-zone]')!;
    const dataTransfer = {
      dropEffect: 'none',
      effectAllowed: 'all',
      getData: () => '',
      items: [{getAsFile: () => file, kind: 'file', type: file.type}],
      types: ['Files'],
    };
    fireEvent.dragEnter(zone, {clientX: 10, clientY: 10, dataTransfer});
    fireEvent.drop(zone, {clientX: 10, clientY: 10, dataTransfer});

    await waitFor(() =>
      expect(onFiles).toHaveBeenCalledWith({
        files: [file],
        rejectedFiles: [],
        source: 'drop',
      }),
    );
  });

  it('only presents browser file drags as valid drop targets', async () => {
    render(
      <DropZone
        actionLabel="Browse evidence"
        getAnnouncement={announcement}
        label="Evidence"
        onFiles={() => undefined}
      />,
    );
    const zone = screen.getByText('Evidence').closest<HTMLElement>('[data-wcl-drop-zone]')!;
    const dataTransfer = {
      dropEffect: 'none',
      effectAllowed: 'all',
      getData: () => 'plain text',
      items: [{kind: 'string', type: 'text/plain'}],
      types: ['text/plain'],
    };

    fireEvent.dragEnter(zone, {clientX: 10, clientY: 10, dataTransfer});

    await waitFor(() => expect(zone.hasAttribute('data-drop-target')).toBe(false));
  });

  it('normalizes file type constraints before drag preflight', async () => {
    const file = new File(['diagram'], 'diagram.png', {type: 'image/png'});
    render(
      <DropZone
        acceptedFileTypes={[' IMAGE/* ']}
        actionLabel="Browse evidence"
        getAnnouncement={announcement}
        label="Evidence"
        onFiles={() => undefined}
      />,
    );
    const zone = screen.getByText('Evidence').closest<HTMLElement>('[data-wcl-drop-zone]')!;
    const dataTransfer = {
      dropEffect: 'none',
      effectAllowed: 'all',
      getData: () => '',
      items: [{getAsFile: () => file, kind: 'file', type: file.type}],
      types: ['Files'],
    };

    fireEvent.dragEnter(zone, {clientX: 10, clientY: 10, dataTransfer});

    await waitFor(() => expect(zone.hasAttribute('data-drop-target')).toBe(true));
  });

  it('keeps the drop affordance name distinct from its descriptions', () => {
    render(
      <DropZone
        actionLabel="Browse evidence"
        description="Drop or paste one PNG."
        errorMessage="Evidence is required."
        getAnnouncement={announcement}
        isInvalid
        label="Evidence"
        onFiles={() => undefined}
      />,
    );

    expect(screen.getByRole('button', {name: 'Evidence'})).toBeTruthy();
    const group = screen.getByRole('group', {name: 'Evidence'});
    const describedBy = group.getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(describedBy).toContain(screen.getByText('Drop or paste one PNG.').id);
    expect(describedBy).toContain(screen.getByText('Evidence is required.').id);
  });

  it('shows a valid drag target and reports dropped browser files', async () => {
    const onFiles = vi.fn();
    const file = new File(['diagram'], 'diagram.png', {type: 'image/png'});
    render(
      <DropZone
        acceptedFileTypes={['image/*']}
        actionLabel="Browse evidence"
        description="Drop or paste an image."
        getAnnouncement={announcement}
        label="Evidence"
        onFiles={onFiles}
      />,
    );
    const zone = screen.getByText('Evidence').closest<HTMLElement>('[data-wcl-drop-zone]')!;
    const dataTransfer = {
      dropEffect: 'none',
      effectAllowed: 'all',
      getData: () => '',
      items: [{getAsFile: () => file, kind: 'file', type: file.type}],
      types: ['Files'],
    };

    fireEvent.dragEnter(zone, {clientX: 10, clientY: 10, dataTransfer});
    await waitFor(() => expect(zone.hasAttribute('data-drop-target')).toBe(true));
    fireEvent.dragLeave(zone, {clientX: 10, clientY: 10, dataTransfer});
    await waitFor(() => expect(zone.hasAttribute('data-drop-target')).toBe(false));
    fireEvent.dragEnter(zone, {clientX: 10, clientY: 10, dataTransfer});
    await waitFor(() => expect(zone.hasAttribute('data-drop-target')).toBe(true));
    fireEvent.drop(zone, {clientX: 10, clientY: 10, dataTransfer});

    await waitFor(() =>
      expect(onFiles).toHaveBeenCalledWith({
        files: [file],
        rejectedFiles: [],
        source: 'drop',
      }),
    );
    expect(zone.hasAttribute('data-drop-target')).toBe(false);
  });

  it('resets acquisition feedback without reclaiming consumer files', async () => {
    const file = new File(['plain'], 'notes.txt', {type: 'text/plain'});
    render(
      <form>
        <FileTrigger
          acceptedFileTypes={['image/png']}
          getAnnouncement={announcement}
          label="Choose diagram"
          onFiles={() => undefined}
        />
      </form>,
    );
    const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
    const form = input.form!;
    fireEvent.change(input, {target: {files: [file]}});
    expect(input.closest('[data-wcl-file-trigger]')?.hasAttribute('data-rejected')).toBe(true);

    fireEvent.reset(form);
    await waitFor(() => {
      expect(input.closest('[data-wcl-file-trigger]')?.hasAttribute('data-rejected')).toBe(false);
      expect(input.closest('[data-wcl-file-trigger]')?.hasAttribute('data-acquired')).toBe(false);
      expect(screen.queryByRole('status')).toBeNull();
    });
    expect([...new FormData(form).entries()]).toEqual([]);
  });

  it('server-renders and hydrates both acquisition paths without structural drift', async () => {
    const view = (
      <>
        <FileTrigger
          getAnnouncement={announcement}
          label="Choose assets"
          onFiles={() => undefined}
        />
        <DropZone
          actionLabel="Browse assets"
          description="Drop or paste assets."
          getAnnouncement={announcement}
          label="Assets"
          onFiles={() => undefined}
        />
      </>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(view);
    document.body.append(container);
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, view, {onRecoverableError});
      await Promise.resolve();
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(within(container).getByRole('button', {name: 'Choose assets'})).toBeTruthy();
    expect(within(container).getByText('Assets')).toBeTruthy();

    act(() => root?.unmount());
    container.remove();
  });
});
