import {useEffect, useMemo, useRef, useState} from 'react';
import {
  AppearanceProvider,
  Link,
  CollapsibleNavigationPane,
  Button,
  Dialog,
  Drawer,
  EmptyState,
  DropZone,
  IconButton,
  InlineAlert,
  Menu,
  Select,
  Skeleton,
  StatusIndicator,
  Switch,
  TextArea,
  TextField,
  Toolbar,
  MarkdownEditor,
  type Appearance,
  type MarkdownAssetRequest,
  type MarkdownExtension,
  type MarkdownEditorMode,
} from '@trwhitney/component-library';
import {initialDocuments, snapshot, type Attachment, type DocumentRecord} from './data.js';
import {Formatting} from './formatting.js';
import {Icon} from './icons.js';
import {CollectionDesk, ReviewDesk} from './publication.js';
import {DocumentHome} from './home.js';

function useNarrow(width: number) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = matchMedia(`(max-width: ${width}px)`);
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [width]);
  return narrow;
}
function identifyTarget(target: HTMLElement) {
  const region = target.closest<HTMLElement>('[data-region]')?.dataset.region;
  if (!region) return null;
  const control = target.closest<HTMLElement>('button, label, input, textarea, [role="option"]');
  const label =
    control?.getAttribute('aria-label') ??
    control
      ?.getAttribute('aria-labelledby')
      ?.split(' ')
      .map((id) => document.getElementById(id)?.textContent ?? '')
      .join(' ') ??
    control?.textContent?.trim();
  return label ? `${region} / ${label}` : region;
}
function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function waitForAsset(signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Canceled'));
      return;
    }
    const abort = () => {
      clearTimeout(timer);
      reject(new Error('Canceled'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve();
    }, 1200);
    signal?.addEventListener('abort', abort, {once: true});
  });
}

export function App() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [activeId, setActiveId] = useState('arrival');
  const [mode, setMode] = useState<MarkdownEditorMode>('live-preview');
  const [view, setView] = useState<'home' | 'collection' | 'document' | 'review'>('home');
  const [included, setIncluded] = useState(['arrival', 'site', 'review']);
  const [reviewed, setReviewed] = useState<Record<string, string>>({});
  const [exported, setExported] = useState(false);
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const [accent, setAccent] = useState<`#${string}`>('#397bea');
  const [scenario, setScenario] = useState<'ready' | 'loading' | 'empty' | 'error'>('ready');
  const [failSave, setFailSave] = useState(false);
  const [failAssets, setFailAssets] = useState(false);
  const [saving, setSaving] = useState<string[]>([]);
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});
  const [assetErrors, setAssetErrors] = useState<Record<string, string>>({});
  const [assetPending, setAssetPending] = useState<string[]>([]);
  const [invalid, setInvalid] = useState<string[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [identified, setIdentified] = useState('');
  const [identify, setIdentify] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [color, setColor] = useState('rgba(56, 132, 213, 1)');
  const colorRef = useRef(color);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const small = useNarrow(760);
  const active = documents.find((doc) => doc.id === activeId)!;
  const editable = active.access === 'editable';
  const dirty = snapshot(active) !== active.saved;
  const saveError = saveErrors[activeId];
  const isSaving = saving.includes(activeId);
  const hasInvalid = invalid.includes(activeId) && !active.title.trim();

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const update = (id: string, patch: Partial<DocumentRecord>) => {
    setDocuments((current) => current.map((doc) => (doc.id === id ? {...doc, ...patch} : doc)));
    setExported(false);
  };
  const choose = (id: string) => {
    setActiveId(id);
    setView('document');
    history.replaceState(null, '', `#document-${id}`);
    setAnnouncement(`Opened ${documents.find((doc) => doc.id === id)?.title ?? 'document'}.`);
  };
  const newDocument = () => {
    setExported(false);
    const id = `note-${Date.now()}`;
    setDocuments((current) => [
      ...current,
      {
        id,
        title: '',
        summary: '',
        stage: 'Draft',
        value: '',
        saved: '',
        access: 'editable',
        attachments: [],
      },
    ]);
    setActiveId(id);
    setIncluded((current) => [...current, id]);
    setScenario('ready');
    setView('document');
    history.replaceState(null, '', `#document-${id}`);
    setMode('live-preview');
    setAnnouncement('New document created. Enter a title above the editor.');
    requestAnimationFrame(() =>
      document.querySelector<HTMLInputElement>('.document-title input')?.focus(),
    );
  };
  const save = () => {
    if (!editable || isSaving) return;
    if (!active.title.trim()) {
      setInvalid((current) => [...new Set([...current, activeId])]);
      document.querySelector<HTMLInputElement>('.document-title input')?.focus();
      setAnnouncement('Add a document title before saving.');
      return;
    }
    const id = activeId,
      saved = snapshot(active);
    setSaving((current) => [...current, id]);
    setSaveErrors((current) => ({...current, [id]: ''}));
    const timer = setTimeout(() => {
      setSaving((current) => current.filter((item) => item !== id));
      if (failSave) {
        setSaveErrors((current) => ({
          ...current,
          [id]: 'Your changes are still here. Saving is unavailable. Try again when the connection is restored.',
        }));
        setAnnouncement('Save failed. Changes kept.');
      } else {
        update(id, {saved});
        setAnnouncement(`${active.title} saved in this session.`);
      }
    }, 1100);
    timers.current.push(timer);
  };
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });
  const extensions = useMemo<readonly MarkdownExtension[]>(
    () => [
      {
        id: 'authoring',
        syntax: [{id: 'rgba', kind: 'color', delimiter: '%%'}],
        commands: [
          {
            id: 'text-color',
            shortcut: 'Mod-Shift-E',
            execute: ({value, selection}) => {
              const from = Math.min(selection.anchor, selection.head),
                to = Math.max(selection.anchor, selection.head);
              const prefix = `%%${colorRef.current} `;
              return {
                edits: [{from, to, insert: `${prefix}${value.slice(from, to)}%%`}],
                selection: {anchor: from + prefix.length, head: to + prefix.length},
              };
            },
          },
        ],
      },
    ],
    [],
  );

  const addAttachments = async (id: string, files: readonly File[], signal?: AbortSignal) => {
    setAssetPending((current) => [...current, id]);
    setAssetErrors((current) => ({...current, [id]: ''}));
    try {
      await waitForAsset(signal);
      if (failAssets)
        throw new Error(
          'Attachments could not be added. Your document has not changed. Restore the attachment service and try again.',
        );
      const entries: Attachment[] = files.map((file, index) => ({
        id: `asset-${Date.now()}-${index}`,
        name: file.name,
        file,
      }));
      setDocuments((current) =>
        current.map((doc) =>
          doc.id === id ? {...doc, attachments: [...doc.attachments, ...entries]} : doc,
        ),
      );
      return entries;
    } catch (error) {
      if (!signal?.aborted)
        setAssetErrors((current) => ({
          ...current,
          [id]: error instanceof Error ? error.message : 'Attachment failed.',
        }));
      throw error;
    } finally {
      setAssetPending((current) => current.filter((item) => item !== id));
    }
  };
  const insertAsset = async (id: string, request: MarkdownAssetRequest) => {
    try {
      const entries = await addAttachments(id, request.files, request.signal);
      return {markdown: entries.map((asset) => `[[${asset.id}]]`).join('\n')};
    } catch {
      return {error: 'Attachment service unavailable. Restore it in Demo settings, then retry.'};
    }
  };
  const resolveLink = (target: string) => {
    const doc = documents.find((item) => item.title.toLowerCase() === target.toLowerCase());
    if (doc) return {href: `#document-${doc.id}`, label: doc.title};
    const asset = documents.flatMap((item) => item.attachments).find((item) => item.id === target);
    return asset ? {href: `#${asset.id}`, label: asset.name} : null;
  };
  const navigateLink = (target: string) => {
    const doc = documents.find((item) => item.title.toLowerCase() === target.toLowerCase());
    if (doc) {
      choose(doc.id);
      return;
    }
    const asset = documents.flatMap((item) => item.attachments).find((item) => item.id === target);
    if (asset) download(asset.file, asset.name);
  };

  const titleField = (
    <TextField
      label="Title"
      value={active.title}
      placeholder="Name this document"
      onChange={(title) => update(activeId, {title})}
      isRequired
      isReadOnly={!editable}
      isInvalid={hasInvalid}
      errorMessage="Give this document a title before saving."
    />
  );
  const stageField = (
    <Select<DocumentRecord['stage']>
      emptyMessage="No options"
      label="Stage"
      value={active.stage}
      onChange={(stage) => {
        if (stage) update(activeId, {stage});
      }}
      options={(['Draft', 'In review', 'Approved'] as const).map((value) => ({
        value,
        label: value,
      }))}
      isDisabled={!editable}
    />
  );
  const related = documents.filter(
    (doc) => active.value.includes(`[[${doc.title}]]`) && doc.id !== activeId,
  );
  const details = (
    <div className="demo-form" data-region="Document details">
      <TextArea
        label="Summary"
        value={active.summary}
        onChange={(summary) => update(activeId, {summary})}
        isReadOnly={!editable}
      />
    </div>
  );
  const links = (
    <div className="related-documents" data-region="Linked documents">
      {related.map((doc) => (
        <Button
          key={doc.id}
          size="compact"
          variant="quiet"
          onPress={() => {
            setLinksOpen(false);
            choose(doc.id);
          }}
        >
          {doc.title}
          <Icon name="open" />
        </Button>
      ))}
      {!related.length && (
        <p className="muted small-copy">Use [[Document title]] in the document to add a link.</p>
      )}
    </div>
  );

  const attachments = (
    <>
      <div className="demo-form">
        <DropZone
          label="Supporting files"
          actionLabel="Add attachment"
          description="Drop, paste, or choose files up to 8 MB each. Multiple files are allowed."
          allowsMultiple
          maxFileSize={8 * 1024 * 1024}
          isDisabled={!editable}
          isPending={assetPending.includes(activeId)}
          pendingMessage="Adding attachment…"
          getAnnouncement={({files, rejectedFiles}) =>
            `${files.length} files selected${rejectedFiles.length ? `; ${rejectedFiles.length} rejected` : ''}.`
          }
          onFiles={({files}) => {
            if (files.length) void addAttachments(activeId, files).catch(() => undefined);
          }}
        />
        {assetErrors[activeId] && (
          <InlineAlert tone="danger" title="Attachment failed">
            {assetErrors[activeId]}
          </InlineAlert>
        )}
        {active.attachments.length === 0 ? (
          <p className="muted small-copy">No attachments yet.</p>
        ) : (
          active.attachments.map((asset) => (
            <div className="attachment" key={asset.id}>
              <Button
                size="compact"
                variant="quiet"
                onPress={() => download(asset.file, asset.name)}
              >
                {asset.name}
              </Button>
              <span className="muted small-copy">
                {Math.max(1, Math.round(asset.file.size / 1024))} KB
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );

  useEffect(() => {
    const navigate = () => {
      if (location.hash === '#home' || !location.hash) setView('home');
      else if (location.hash === '#collection') setView('collection');
      else if (location.hash === '#review') setView('review');
      else if (location.hash.startsWith('#document-')) {
        const id = location.hash.slice(10);
        if (documents.some((doc) => doc.id === id)) {
          setActiveId(id);
          setView('document');
        }
      }
    };
    navigate();
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, [documents]);
  const publicationProps = {
    documents,
    small,
    included,
    reviewed,
    exported,
    onInclude: (ids: string[]) => {
      setIncluded(ids);
      setExported(false);
    },
    onOpen: choose,
    onNew: newDocument,
    onReview: () => {
      history.replaceState(null, '', '#review');
      setView('review');
    },
    onApprove: (id: string) => {
      const doc = documents.find((item) => item.id === id);
      if (doc) setReviewed((current) => ({...current, [id]: snapshot(doc)}));
    },
    onExport: () => {
      download(
        new Blob(
          [
            '# Riverside field guide\n\n' +
              documents
                .filter((doc) => included.includes(doc.id))
                .map((doc) => doc.value)
                .join('\n\n---\n\n'),
          ],
          {type: 'text/markdown'},
        ),
        'Riverside field guide.md',
      );
      setExported(true);
      setAnnouncement('Field guide exported.');
    },
  };

  const editor = (
    <div className="writing-pane" data-region="Writing pane">
      <div className="document-heading" data-region="Document identity">
        <div className="document-title">{titleField}</div>
        <div className="document-stage">{stageField}</div>
      </div>
      <div className="document-command-row" data-region="Document commands">
        <Toolbar label="Document actions">
          <Menu
            trigger={
              <Button size="compact" variant="quiet">
                {mode === 'live-preview'
                  ? small
                    ? 'Live'
                    : 'Live Preview'
                  : mode === 'source'
                    ? 'Source'
                    : 'Preview'}{' '}
                ▾
              </Button>
            }
            items={[
              {
                type: 'action',
                id: 'live-preview',
                label: 'Live Preview',
                onAction: () => setMode('live-preview'),
              },
              {type: 'action', id: 'source', label: 'Source', onAction: () => setMode('source')},
              {type: 'action', id: 'preview', label: 'Preview', onAction: () => setMode('preview')},
            ]}
          />
          <Dialog
            title="Document summary"
            description="Describe what this document covers."
            closeLabel="Close document summary"
            isOpen={detailsOpen}
            onOpenChange={setDetailsOpen}
            trigger={
              small ? (
                <IconButton label="Summary" size="compact" variant="quiet">
                  <Icon name="details" />
                </IconButton>
              ) : (
                <Button size="compact" variant="quiet">
                  Summary
                </Button>
              )
            }
          >
            {details}
          </Dialog>
          <Dialog
            title="Linked documents"
            description="Documents referenced by this draft."
            closeLabel="Close linked documents"
            isOpen={linksOpen}
            onOpenChange={setLinksOpen}
            trigger={
              small ? (
                <IconButton label={`Links (${related.length})`} size="compact" variant="quiet">
                  <Icon name="link" />
                </IconButton>
              ) : (
                <Button size="compact" variant="quiet">
                  Links ({related.length})
                </Button>
              )
            }
          >
            {links}
          </Dialog>
          <Dialog
            title="Document attachments"
            description="Add supporting files to this document."
            closeLabel="Close attachments"
            trigger={
              small ? (
                <IconButton
                  label={`Attachments (${active.attachments.length})`}
                  size="compact"
                  variant="quiet"
                >
                  <Icon name="attachment" />
                </IconButton>
              ) : (
                <Button size="compact" variant="quiet">
                  Attachments ({active.attachments.length})
                </Button>
              )
            }
          >
            {attachments}
          </Dialog>
          {small ? (
            <IconButton
              label={isSaving ? 'Saving…' : 'Save'}
              size="compact"
              isDisabled={!editable || isSaving || !dirty}
              onPress={save}
            >
              <Icon name="save" />
            </IconButton>
          ) : (
            <Button size="compact" isDisabled={!editable || isSaving || !dirty} onPress={save}>
              <span className="action-copy">
                <Icon name="save" />
                {isSaving ? 'Saving…' : 'Save'}
              </span>
            </Button>
          )}
          <Menu
            trigger={
              <IconButton label="Document actions" size="compact" variant="quiet">
                <Icon name="more" />
              </IconButton>
            }
            items={[
              {
                type: 'action',
                id: 'export',
                label: 'Export Markdown',
                onAction: () =>
                  download(
                    new Blob([active.value], {type: 'text/markdown'}),
                    `${active.title || 'Untitled'}.md`,
                  ),
              },
              {
                type: 'action',
                id: 'duplicate',
                label: 'Duplicate document',
                onAction: () => {
                  const id = `copy-${Date.now()}`;
                  setDocuments((current) => [
                    ...current,
                    {...active, id, title: `${active.title} copy`, saved: '', access: 'editable'},
                  ]);
                  setActiveId(id);
                  setIncluded((current) => [...current, id]);
                },
              },
            ]}
          />
        </Toolbar>
      </div>
      <div className="document-status">
        <StatusIndicator
          tone={saveError ? 'danger' : dirty ? 'warning' : 'success'}
          label={
            isSaving
              ? 'Saving this version…'
              : saveError
                ? 'Not saved'
                : dirty
                  ? 'Unsaved changes'
                  : 'Saved in this session'
          }
        />
        <span className="muted small-copy">
          {active.value.trim() ? active.value.trim().split(/\s+/).length : 0} words
        </span>
      </div>
      {saveError && (
        <InlineAlert tone="danger" title="Could not save">
          <div className="demo-form">
            <span>{saveError}</span>
            <div>
              <Button size="compact" onPress={save} isDisabled={isSaving}>
                Retry save
              </Button>
            </div>
          </div>
        </InlineAlert>
      )}
      {active.access !== 'editable' && (
        <InlineAlert
          tone="neutral"
          title={
            active.access === 'locked' ? 'Morgan is editing this document' : 'Read-only reference'
          }
        >
          {active.access === 'locked'
            ? 'You can read and copy this document while Morgan finishes.'
            : 'This approved document is available for reading. Duplicate it to start a new draft.'}
        </InlineAlert>
      )}
      {documents.map((doc) => (
        <div
          key={doc.id}
          hidden={doc.id !== activeId}
          className="document-session"
          data-document-id={doc.id}
        >
          <MarkdownEditor
            label="Document body"
            value={doc.value}
            onChange={(value) => update(doc.id, {value})}
            mode={mode}
            size={small ? 'regular' : 'expanded'}
            isReadOnly={doc.access === 'read-only'}
            isLocked={doc.access === 'locked'}
            lockMessage="Morgan is editing this document."
            extensions={extensions}
            wikiLinks={{resolve: resolveLink, onNavigate: ({target}) => navigateLink(target)}}
            assets={{
              allowsMultiple: true,
              maxFileSize: 8 * 1024 * 1024,
              insert: (request) => insertAsset(doc.id, request),
            }}
            renderToolbar={(controls) => (
              <Formatting
                controls={controls}
                color={color}
                onColor={(value) => {
                  colorRef.current = value;
                  setColor(value);
                }}
              />
            )}
          />
        </div>
      ))}
    </div>
  );

  const navigator = (
    <nav
      className="project-navigation"
      data-region="Project navigator"
      aria-label="Riverside workspace"
      onClickCapture={(event) => {
        if ((event.target as HTMLElement).closest('a')) setNavigatorOpen(false);
      }}
    >
      <div className="navigation-group">
        <Link href="#home" {...(view === 'home' ? {current: 'page' as const} : {})}>
          Home
        </Link>
        <Link href="#collection" {...(view === 'collection' ? {current: 'page' as const} : {})}>
          Collection
        </Link>
        <Link href="#review" {...(view === 'review' ? {current: 'page' as const} : {})}>
          Review & export
        </Link>
      </div>
      <h2>Documents</h2>
      <div className="navigation-group">
        {documents.map((doc) => (
          <Link
            key={doc.id}
            href={`#document-${doc.id}`}
            {...(view === 'document' && doc.id === activeId ? {current: 'page' as const} : {})}
          >
            {doc.title || 'New document'}
          </Link>
        ))}
      </div>
    </nav>
  );

  return (
    <AppearanceProvider appearance={appearance} accent={accent} density="compact">
      <div
        className="fieldnotes-app"
        onPointerOver={(event) => {
          const name = identifyTarget(event.target as HTMLElement);
          if (identify && name) setIdentified(name);
        }}
        onFocusCapture={(event) => {
          const name = identifyTarget(event.target);
          if (identify && name) setIdentified(name);
        }}
      >
        <header className="workspace-header" data-region="Workspace header">
          <div className="brand">
            <Icon name="documents" />
            <strong>Fieldnotes</strong>
            <span>Publication studio</span>
          </div>
          {small && (
            <div className="workspace-navigation-actions">
              <Drawer
                title="Riverside field guide"
                description="Collection and documents"
                closeLabel="Close navigator"
                placement="start"
                isOpen={navigatorOpen}
                onOpenChange={setNavigatorOpen}
                trigger={
                  <Button size="compact" variant="quiet">
                    <span className="action-copy">
                      <Icon name="documents" />
                      Navigator
                    </span>
                  </Button>
                }
              >
                {navigator}
              </Drawer>
              <Button size="compact" variant="quiet" onPress={newDocument}>
                <span className="action-copy">
                  <Icon name="plus" />
                  New document
                </span>
              </Button>
            </div>
          )}
          <div className="workspace-tools">
            <Dialog
              title="Demo settings"
              description="Exercise the workspace without changing your drafts."
              closeLabel="Close demo settings"
              trigger={
                <IconButton label="Demo settings" size="compact" variant="quiet">
                  <Icon name="settings" />
                </IconButton>
              }
            >
              <div className="demo-form">
                <Select<Appearance>
                  emptyMessage="No options"
                  label="Appearance"
                  value={appearance}
                  onChange={(value) => {
                    if (value) setAppearance(value);
                  }}
                  options={[
                    {value: 'dark', label: 'Dark'},
                    {value: 'light', label: 'Light'},
                  ]}
                />
                <Select<`#${string}`>
                  emptyMessage="No options"
                  label="Accent"
                  value={accent}
                  onChange={(value) => {
                    if (value) setAccent(value);
                  }}
                  options={[
                    {value: '#397bea', label: 'Blue'},
                    {value: '#9271cf', label: 'Violet'},
                    {value: '#21967c', label: 'Green'},
                  ]}
                />
                <Select<'ready' | 'loading' | 'empty' | 'error'>
                  emptyMessage="No options"
                  label="Document loading"
                  value={scenario}
                  onChange={(value) => {
                    if (value) setScenario(value);
                  }}
                  options={[
                    {value: 'ready', label: 'Ready'},
                    {value: 'loading', label: 'Loading'},
                    {value: 'empty', label: 'Empty workspace'},
                    {value: 'error', label: 'Load error'},
                  ]}
                />
                <Select<DocumentRecord['access']>
                  emptyMessage="No options"
                  label="Current document access"
                  value={active.access}
                  onChange={(value) => {
                    if (value) update(activeId, {access: value});
                  }}
                  options={[
                    {value: 'editable', label: 'Editable'},
                    {value: 'read-only', label: 'Read-only'},
                    {value: 'locked', label: 'Locked by Morgan'},
                  ]}
                />
                <div className="settings-toggles" data-region="Demo switches">
                  <Switch
                    label="Saving unavailable"
                    reserveSupportSpace={false}
                    isSelected={failSave}
                    onChange={setFailSave}
                  />
                  <Switch
                    label="Attachment service unavailable"
                    reserveSupportSpace={false}
                    isSelected={failAssets}
                    onChange={setFailAssets}
                  />
                  <Switch
                    label="Identify workspace regions"
                    reserveSupportSpace={false}
                    isSelected={identify}
                    onChange={setIdentify}
                  />
                </div>
                <p className="muted small-copy">
                  Demo data lives in this browser session. Reloading restores the sample documents.
                  Export Markdown to keep a copy.
                </p>
              </div>
            </Dialog>
            <Dialog
              title="About this workspace"
              description="A working document desk for the Riverside project."
              closeLabel="Close workspace information"
              trigger={
                <Button size="compact" variant="quiet">
                  About
                </Button>
              }
            >
              <p>
                Write in Live Preview, inspect the Markdown source, or read the preview. Changes
                stay with each document as you navigate.
              </p>
              <p>
                Use Ctrl or Command + S to save the current version in this session. Export Markdown
                from Document actions to keep a file.
              </p>
              <p>
                Drop files into the editor to add attachment links. Demo settings expose loading,
                access, and service failures.
              </p>
            </Dialog>
          </div>
        </header>
        <div className="workspace-body">
          {!small && (
            <aside className="workspace-sidebar" data-region="Project sidebar">
              <div className="sidebar-navigation">
                <CollapsibleNavigationPane
                  placement="sidebar-top"
                  ariaLabel="Riverside workspace"
                  collapseLabel="Collapse navigator"
                  expandLabel="Open navigator"
                  currentId={view === 'document' ? `document:${activeId}` : `page:${view}`}
                  onNavigate={(id) => {
                    if (id === 'page:home') setView('home');
                    else if (id === 'page:collection') setView('collection');
                    else if (id === 'page:review') setView('review');
                    else if (id.startsWith('document:')) choose(id.slice('document:'.length));
                  }}
                  groups={[
                    {
                      id: 'project',
                      label: 'Riverside field guide',
                      items: [
                        {id: 'page:home', label: 'Home', href: '#home'},
                        {id: 'page:collection', label: 'Collection', href: '#collection'},
                        {id: 'page:review', label: 'Review & export', href: '#review'},
                      ],
                    },
                    {
                      id: 'documents',
                      label: 'Documents',
                      items: [
                        {
                          id: `document:${documents[0]!.id}`,
                          label: documents[0]!.title || 'New document',
                          href: `#document-${documents[0]!.id}`,
                        },
                        ...documents.slice(1).map((doc) => ({
                          id: `document:${doc.id}`,
                          label: doc.title || 'New document',
                          href: `#document-${doc.id}`,
                        })),
                      ],
                    },
                  ]}
                />
              </div>
              <div className="sidebar-create">
                <Button size="compact" onPress={newDocument}>
                  <span className="action-copy">
                    <Icon name="plus" />
                    New document
                  </span>
                </Button>
              </div>
            </aside>
          )}
          <main className="workspace-main">
            <div hidden={scenario !== 'ready' || view !== 'home'}>
              <DocumentHome
                documents={documents}
                included={included}
                onInclude={publicationProps.onInclude}
                onOpen={choose}
              />
            </div>
            <div hidden={scenario !== 'ready' || view !== 'collection'}>
              <CollectionDesk {...publicationProps} />
            </div>
            <div hidden={scenario !== 'ready' || view !== 'review'}>
              <ReviewDesk {...publicationProps} />
            </div>
            <div
              hidden={scenario !== 'ready' || view !== 'document'}
              className="retained-workspace"
            >
              {editor}
            </div>
            {scenario === 'loading' && (
              <div className="workspace-state" data-region="Workspace loading">
                <StatusIndicator tone="neutral" label="Loading project documents…" />
                <Skeleton shape="heading" width="half" />
                <Skeleton lines={5} />
                <Button size="compact" onPress={() => setScenario('ready')}>
                  Finish loading
                </Button>
              </div>
            )}
            {scenario === 'empty' && (
              <div className="workspace-state">
                <EmptyState
                  kind="no-data"
                  title="A place for the next idea"
                  description="Start a document for the Riverside project. Add the details as your thinking takes shape."
                  actionLabel="New document"
                  onAction={newDocument}
                />
                <Button size="compact" variant="quiet" onPress={() => setScenario('ready')}>
                  Return to sample documents
                </Button>
              </div>
            )}
            {scenario === 'error' && (
              <div className="workspace-state">
                <EmptyState
                  kind="unavailable"
                  title="Could not load the workspace"
                  description="Your open drafts are still here. Try loading the project again."
                  actionLabel="Retry loading"
                  onAction={() => setScenario('ready')}
                />
              </div>
            )}
          </main>
        </div>
        <footer className="workspace-footer">
          <span>
            {identify
              ? `Region: ${identified || 'Move over or focus a control'}`
              : 'Riverside reading room'}
          </span>
          <span role="status" aria-live="polite">
            {announcement || 'Session drafts · Export to keep a copy'}
          </span>
        </footer>
      </div>
    </AppearanceProvider>
  );
}
