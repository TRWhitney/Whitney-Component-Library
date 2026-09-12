import {Prec, Transaction, type Extension} from '@codemirror/state';
import {isolateHistory} from '@codemirror/commands';
import {EditorView, type ViewUpdate} from '@codemirror/view';

import {acquireFiles, assertFileAcceptanceProps} from '../files/file-validation.js';
import type {RejectedFile} from '../files/file-types.js';
import type {
  MarkdownAssetLabels,
  MarkdownAssetOptions,
  MarkdownAssetRequest,
  MarkdownAssetResult,
} from './markdown-types.js';

export type AssetState =
  | {readonly kind: 'idle'}
  | {readonly kind: 'pending'; readonly count: number; readonly rejections: readonly RejectedFile[]}
  | {readonly kind: 'error'; readonly message: string; readonly rejections: readonly RejectedFile[]}
  | {readonly kind: 'rejected'; readonly rejections: readonly RejectedFile[]};

export const defaultAssetLabels: MarkdownAssetLabels = {
  pending: (count) => `Inserting ${count} ${count === 1 ? 'file' : 'files'}…`,
  rejected: (files) =>
    files
      .map(({file, reasons}) => {
        const details = reasons.map((reason) => {
          switch (reason) {
            case 'multiple':
              return 'only one file is allowed';
            case 'size':
              return 'the file exceeds the size limit';
            case 'type':
              return 'the file type is not accepted';
          }
        });
        return `${file.name}: ${details.join(', ')}.`;
      })
      .join(' '),
  failed: 'The files could not be inserted. Try again.',
  retry: 'Retry asset insertion',
  dismiss: 'Dismiss asset feedback',
};

interface Acquisition {
  readonly files: readonly File[];
  readonly source: MarkdownAssetRequest['source'];
  readonly rejections: readonly RejectedFile[];
  from: number;
  to: number;
}

interface AssetSession {
  readonly extension: Extension;
  readonly update: (update: ViewUpdate) => void;
  readonly cancel: () => void;
  readonly retry: (view: EditorView) => void;
  readonly dismiss: () => void;
  readonly destroy: () => void;
}

// Clipboard and drag data are only readable during the browser event. Prefer items so
// the duplicate FileList representation never adds the same files a second time.
function readFiles(transfer: DataTransfer | null): {files: File[]; containsFiles: boolean} {
  if (!transfer) return {files: [], containsFiles: false};
  const items = Array.from(transfer.items ?? []);
  const fileItems = items.filter((item) => item.kind === 'file');
  const itemFiles = fileItems.flatMap((item) => {
    const file = item.getAsFile();
    return file ? [file] : [];
  });
  const files = [...new Set(itemFiles.length ? itemFiles : Array.from(transfer.files ?? []))];
  return {
    files,
    containsFiles:
      fileItems.length > 0 ||
      files.length > 0 ||
      Array.from(transfer.types ?? []).includes('Files'),
  };
}

export function createAssetSession(
  getOptions: () => MarkdownAssetOptions | undefined,
  onState: (state: AssetState) => void,
): AssetSession {
  let acquisition: Acquisition | undefined;
  let controller: AbortController | undefined;
  let state: AssetState = {kind: 'idle'};
  let destroyed = false;

  function report(next: AssetState) {
    if (destroyed) return;
    if (state.kind === 'idle' && next.kind === 'idle') return;
    state = next;
    onState(next);
  }

  function cancel() {
    const previous = controller;
    controller = undefined;
    acquisition = undefined;
    previous?.abort();
    report({kind: 'idle'});
  }

  function canEdit(view: EditorView) {
    return !destroyed && !view.state.readOnly && view.state.facet(EditorView.editable);
  }

  function run(view: EditorView, request: Acquisition, options: MarkdownAssetOptions) {
    const active = new AbortController();
    controller = active;
    acquisition = request;
    report({kind: 'pending', count: request.files.length, rejections: request.rejections});

    function isCurrent() {
      return controller === active && acquisition === request && !active.signal.aborted;
    }

    function finish(result: MarkdownAssetResult) {
      if (!isCurrent()) return;
      if (!canEdit(view) || !getOptions()) {
        cancel();
        return;
      }
      controller = undefined;
      if (result.error !== undefined) {
        report({kind: 'error', message: result.error, rejections: request.rejections});
        return;
      }
      acquisition = undefined;
      report(
        request.rejections.length
          ? {kind: 'rejected', rejections: request.rejections}
          : {kind: 'idle'},
      );
      const selection = view.state.selection.main;
      const atTarget = selection.from === request.from && selection.to === request.to;
      view.dispatch({
        changes: {from: request.from, to: request.to, insert: result.markdown},
        ...(atTarget ? {selection: {anchor: request.from + result.markdown.length}} : {}),
        annotations: [isolateHistory.of('full'), Transaction.userEvent.of('input.asset')],
        scrollIntoView: atTarget,
      });
    }

    function fail() {
      if (!isCurrent()) return;
      finish({error: (getOptions()?.labels ?? defaultAssetLabels).failed});
    }

    // Invoke synchronously so the application receives the files during acquisition,
    // but settle in a microtask to avoid dispatching within an editor update.
    let result: MarkdownAssetResult | Promise<MarkdownAssetResult>;
    try {
      result = options.insert({
        files: request.files,
        source: request.source,
        signal: active.signal,
      });
    } catch {
      fail();
      return;
    }
    void Promise.resolve(result).then(finish, fail);
  }

  function acquire(
    view: EditorView,
    transfer: DataTransfer | null,
    source: MarkdownAssetRequest['source'],
    target: () => {from: number; to: number} | null,
  ) {
    const {files, containsFiles} = readFiles(transfer);
    if (!containsFiles) return false;
    const options = getOptions();
    if (!options || !canEdit(view) || controller || !files.length) return true;
    assertFileAcceptanceProps(options);
    const range = target();
    if (!range) return true;
    cancel();
    const result = acquireFiles(source, files, options);
    if (!result.files.length) {
      report({kind: 'rejected', rejections: result.rejectedFiles});
      return true;
    }
    run(view, {...range, files: result.files, source, rejections: result.rejectedFiles}, options);
    return true;
  }

  return {
    extension: Prec.highest(
      EditorView.domEventHandlers({
        dragenter(event) {
          return readFiles(event.dataTransfer).containsFiles;
        },
        dragover(event) {
          return readFiles(event.dataTransfer).containsFiles;
        },
        paste(event, view) {
          return acquire(view, event.clipboardData, 'paste', () => view.state.selection.main);
        },
        drop(event, view) {
          return acquire(view, event.dataTransfer, 'drop', () => {
            const position = view.posAtCoords({x: event.clientX, y: event.clientY});
            return position === null ? null : {from: position, to: position};
          });
        },
      }),
    ),
    update(update) {
      if (!acquisition) return;
      if (!canEdit(update.view) || !getOptions()) {
        cancel();
        return;
      }
      for (const transaction of update.transactions) {
        const request = acquisition;
        if (!request || !transaction.docChanged) continue;
        let overwritten = false;
        transaction.changes.iterChangedRanges((from, to) => {
          if (request.from === request.to) {
            if (from < request.from && to > request.to) overwritten = true;
          } else if (from < request.to && to > request.from) {
            overwritten = true;
          }
        });
        if (overwritten) {
          cancel();
          return;
        }
        const empty = request.from === request.to;
        request.from = transaction.changes.mapPos(request.from, empty ? -1 : 1);
        request.to = transaction.changes.mapPos(request.to, -1);
      }
    },
    cancel,
    retry(view) {
      const options = getOptions();
      if (!options || !canEdit(view) || state.kind !== 'error' || !acquisition) return;
      assertFileAcceptanceProps(options);
      run(view, acquisition, options);
    },
    dismiss: cancel,
    destroy() {
      destroyed = true;
      cancel();
    },
  };
}
