import {useEffect, useRef, useState} from 'react';
import {
  AppearanceProvider,
  Link,
  Badge,
  Button,
  CollapsibleNavigationPane,
  Dialog,
  Drawer,
  EmptyState,
  IconButton,
  InlineAlert,
  MarkdownEditor,
  Menu,
  NotificationProvider,
  SearchField,
  SegmentedControl,
  Skeleton,
  SplitView,
  StatusIndicator,
  Switch,
  TextField,
  Toolbar,
  type Appearance,
  type CollapsibleNavigationPaneGroups,
  type MarkdownEditorMode,
  type NotificationControls,
  type SplitViewCollapsedPane,
} from '@trwhitney/component-library';
import {initialDocuments} from './data.js';
import {Formatting} from './formatting.js';
import {Icon} from './icons.js';
import {Inspector} from './inspector.js';
import {Register} from './register.js';
import {Commissioning} from './commissioning.js';
import {useResponsiveFocus} from './responsive-focus.js';
import {
  canReady,
  changeDocument,
  finishSave,
  markReady,
  packetMarkdown,
  snapshot,
  type WorkDocument,
} from './model.js';

function useNarrow(width: number) {
  const [narrow, setNarrow] = useState(() => matchMedia(`(max-width: ${width}px)`).matches);
  useEffect(() => {
    const query = matchMedia(`(max-width: ${width}px)`);
    const update = () => setNarrow(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [width]);
  return narrow;
}
function download(value: string, name: string) {
  const url = URL.createObjectURL(new Blob([value], {type: 'text/markdown;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function App() {
  const [appearance, setAppearance] = useState<Appearance>('light');
  return (
    <AppearanceProvider appearance={appearance} accent="#8054a0" density="compact">
      <NotificationProvider
        label="Workspace notifications"
        dismissLabel="Dismiss notification"
        placement="bottom-end"
        maxVisible={2}
      >
        {(controls) => (
          <Workspace controls={controls} appearance={appearance} onAppearance={setAppearance} />
        )}
      </NotificationProvider>
    </AppearanceProvider>
  );
}
function Workspace({
  controls,
  appearance,
  onAppearance,
}: {
  controls: NotificationControls;
  appearance: Appearance;
  onAppearance: (appearance: Appearance) => void;
}) {
  const [documents, setDocuments] = useState(initialDocuments);
  const initialId =
    initialDocuments.find((doc) => `#document/${doc.id}` === location.hash)?.id ?? 'brief';
  const [activeId, setActiveId] = useState(initialId);
  const [tool, setTool] = useState<'documents' | 'register' | 'commissioning'>(() =>
    location.hash === '#register'
      ? 'register'
      : location.hash === '#commissioning'
        ? 'commissioning'
        : 'documents',
  );
  const [visited, setVisited] = useState([initialId]);
  const [modes, setModes] = useState<Record<string, MarkdownEditorMode>>({});
  const [query, setQuery] = useState('');
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [createError, setCreateError] = useState(false);
  const [scenario, setScenario] = useState<'ready' | 'loading' | 'error' | 'empty'>('ready');
  const [failSave, setFailSave] = useState(false);
  const [saving, setSaving] = useState<string[]>([]);
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});
  const [paneSize, setPaneSize] = useState(68);
  const [collapsed, setCollapsed] = useState<SplitViewCollapsedPane>(null);
  const [announcement, setAnnouncement] = useState('');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const saveInFlight = useRef(new Set<string>());
  const loadGeneration = useRef(0);
  useResponsiveFocus(setDetailsOpen, setNavigatorOpen);
  const small = useNarrow(760),
    compact = useNarrow(1100);
  const reviewCompact = useNarrow(1280);
  const active = documents.find((doc) => doc.id === activeId)!;
  const mode = modes[activeId] ?? 'live-preview';
  const dirty = snapshot(active) !== active.saved;
  const ready = documents.filter((doc) => doc.ready && canReady(doc));
  const dirtyCount = documents.filter((doc) => snapshot(doc) !== doc.saved).length;
  const available = scenario === 'ready';
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  const update = (id: string, patch: Partial<WorkDocument>) =>
    setDocuments((current) =>
      current.map((doc) => (doc.id === id ? changeDocument(doc, patch) : doc)),
    );
  const choose = (id: string) => {
    if (!documents.some((doc) => doc.id === id)) return;
    setActiveId(id);
    setTool('documents');
    setVisited((current) => (current.includes(id) ? current : [...current, id]));
    setNavigatorOpen(false);
    setDetailsOpen(false);
    setReviewOpen(false);
    setCollapsed((current) => (current === 'primary' ? null : current));
    if (location.hash !== `#document/${id}`) history.pushState(null, '', `#document/${id}`);
    setAnnouncement(`Opened ${documents.find((doc) => doc.id === id)!.title}.`);
  };
  useEffect(() => {
    const route = () => {
      if (!location.hash) {
        setTool('documents');
        setNavigatorOpen(false);
        setDetailsOpen(false);
      } else if (location.hash === '#register' || location.hash === '#commissioning') {
        setTool(location.hash === '#register' ? 'register' : 'commissioning');
        setNavigatorOpen(false);
        setDetailsOpen(false);
      } else {
        const id = location.hash.replace('#document/', '');
        if (documents.some((doc) => doc.id === id)) choose(id);
      }
    };
    window.addEventListener('hashchange', route);
    window.addEventListener('popstate', route);
    return () => {
      window.removeEventListener('hashchange', route);
      window.removeEventListener('popstate', route);
    };
  });
  useEffect(() => {
    if (!compact) setDetailsOpen(false);
  }, [compact]);
  useEffect(() => {
    if (!small) setNavigatorOpen(false);
  }, [small]);
  const setMode = (next: MarkdownEditorMode) =>
    setModes((current) => ({...current, [activeId]: next}));
  const save = () => {
    if (tool !== 'documents' || !available || saveInFlight.current.has(activeId) || !dirty) return;
    if (!active.title.trim()) {
      setSaveErrors((current) => ({
        ...current,
        [activeId]: 'Add a document title in Details, then save again.',
      }));
      return;
    }
    const id = activeId,
      captured = snapshot(active),
      title = active.title,
      shouldFail = failSave;
    saveInFlight.current.add(id);
    setSaving((current) => [...current, id]);
    setSaveErrors((current) => ({...current, [id]: ''}));
    later(() => {
      saveInFlight.current.delete(id);
      setSaving((current) => current.filter((item) => item !== id));
      if (shouldFail) {
        setSaveErrors((current) => ({
          ...current,
          [id]: 'The connection dropped. Your changes are still here. Reconnect and try saving again.',
        }));
        setAnnouncement('Save failed. Changes kept.');
      } else {
        setDocuments((current) =>
          current.map((doc) => (doc.id === id ? finishSave(doc, captured) : doc)),
        );
        controls.notify({
          title: `${title} saved`,
          description: 'Saved in this session.',
          tone: 'success',
        });
      }
    }, 900);
  };
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (!document.querySelector('[aria-modal="true"]')) save();
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });
  const toggleReady = () => {
    if (!active.ready && !canReady(active)) return;
    setDocuments((current) =>
      current.map((doc) =>
        doc.id === activeId ? (doc.ready ? {...doc, ready: false} : markReady(doc)) : doc,
      ),
    );
    controls.notify({
      title: active.ready ? 'Returned to draft' : 'Added to handover packet',
      description: active.title,
      tone: active.ready ? 'general' : 'success',
    });
  };
  const createDocument = () => {
    if (!newTitle.trim()) {
      setCreateError(true);
      return;
    }
    const id = `document-${Date.now()}`;
    const doc: WorkDocument = {
      id,
      code: `NS-${String(documents.length + 1).padStart(2, '0')}`,
      title: newTitle.trim(),
      summary: '',
      owner: 'Alex Morgan',
      value: '',
      saved: '',
      ready: false,
    };
    setDocuments((current) => [...current, doc]);
    setVisited((current) => [...current, id]);
    setActiveId(id);
    setTool('documents');
    setQuery('');
    loadGeneration.current += 1;
    setScenario('ready');
    setCreateOpen(false);
    setNavigatorOpen(false);
    setNewTitle('');
    setCreateError(false);
    setCollapsed(null);
    history.pushState(null, '', `#document/${id}`);
    setAnnouncement(`${doc.title} created.`);
    later(
      () =>
        document.querySelector<HTMLElement>(`[data-document="${id}"] [role="textbox"]`)?.focus(),
      100,
    );
  };
  const reload = (result: 'ready' | 'error' = 'ready') => {
    const generation = ++loadGeneration.current;
    setScenario('loading');
    setSettingsOpen(false);
    setNavigatorOpen(false);
    setDetailsOpen(false);
    later(() => {
      if (generation !== loadGeneration.current) return;
      setScenario(result);
      setAnnouncement(result === 'ready' ? 'Documents loaded.' : 'Documents could not be loaded.');
    }, 1300);
  };
  const filtered = documents.filter((doc) =>
    `${doc.title} ${doc.code} ${doc.summary}`.toLowerCase().includes(query.toLowerCase()),
  );
  const groupList = [
    {id: 'drafts', label: 'In progress', items: filtered.filter((doc) => !doc.ready)},
    {id: 'ready', label: 'Ready for handover', items: filtered.filter((doc) => doc.ready)},
  ].flatMap((group) => {
    const items = group.items.map((doc) => ({
      id: doc.id,
      href: `#document/${doc.id}`,
      label: `${doc.title || 'Untitled document'}${snapshot(doc) !== doc.saved ? ' *' : ''}`,
    }));
    const first = items[0];
    return first
      ? [
          {
            id: group.id,
            label: group.label,
            items: [first, ...items.slice(1)] as [typeof first, ...typeof items],
          },
        ]
      : [];
  });
  const groups: CollapsibleNavigationPaneGroups | undefined = groupList[0]
    ? [groupList[0], ...groupList.slice(1)]
    : undefined;
  const batchReady = (ids: string[], ready: boolean) => {
    const changed = documents.filter(
      (doc) => ids.includes(doc.id) && (ready ? !doc.ready && canReady(doc) : doc.ready),
    );
    const changedIds = new Set(changed.map((doc) => doc.id));
    setDocuments((current) =>
      current.map((doc) => (changedIds.has(doc.id) ? {...doc, ready} : doc)),
    );
    controls.notify({
      title: `${changed.length} ${changed.length === 1 ? 'document' : 'documents'} ${ready ? 'marked ready' : 'returned to draft'}`,
      description:
        ids.length > changed.length
          ? `${ids.length - changed.length} selected documents stayed unchanged.`
          : 'The handover packet is up to date.',
      tone: changed.length ? 'success' : 'general',
    });
  };
  const createReviewReport = (title: string, value: string, owner: string) => {
    const id = `review-${Date.now()}`;
    const doc: WorkDocument = {
      id,
      code: `NS-${String(documents.length + 1).padStart(2, '0')}`,
      title,
      value,
      owner,
      summary: 'A system acceptance decision and its supporting checks.',
      saved: '',
      ready: false,
    };
    setDocuments((current) => [...current, doc]);
    setVisited((current) => [...current, id]);
    setActiveId(id);
    setTool('documents');
    setDetailsOpen(false);
    setNavigatorOpen(false);
    setCollapsed(null);
    history.pushState(null, '', `#document/${id}`);
    controls.notify({
      title: 'Review document created',
      description: 'Save and mark it ready when it is ready for the handover.',
      tone: 'success',
    });
    later(
      () =>
        document.querySelector<HTMLElement>(`[data-document="${id}"] [role="textbox"]`)?.focus(),
      100,
    );
    return id;
  };
  const navigation = (
    <div className="navigator-content">
      <div className="packet-label">
        <span className="code">NORTHSTAR / 2026</span>
        <h2>Project handover</h2>
        <p>Operations · September edition</p>
      </div>
      <nav className="workspace-tools" aria-label="Workspace tools">
        <Link
          href={`#document/${activeId}`}
          {...(tool === 'documents' ? {current: 'page' as const} : {})}
        >
          <Icon name="document" />
          <span>Documents</span>
        </Link>
        <Link href="#register" {...(tool === 'register' ? {current: 'page' as const} : {})}>
          <Icon name="list" />
          <span>Handover register</span>
        </Link>
        <Link
          href="#commissioning"
          {...(tool === 'commissioning' ? {current: 'page' as const} : {})}
        >
          <Icon name="check" />
          <span>Commissioning review</span>
        </Link>
      </nav>
      <div className="document-navigator-section" hidden={tool !== 'documents'}>
        <div className="navigator-tools" data-focus-key="search">
          <SearchField
            clearLabel="Clear document search"
            label="Find a document"
            placeholder="Search documents…"
            value={query}
            onChange={setQuery}
            reserveSupportSpace={false}
          />
        </div>
        <div className="document-navigation">
          {available ? (
            groups ? (
              <CollapsibleNavigationPane
                ariaLabel="Packet documents"
                placement="sidebar-top"
                currentId={activeId}
                collapseLabel="Collapse document list"
                expandLabel="Expand document list"
                groups={groups}
                onNavigate={choose}
              />
            ) : (
              <EmptyState
                kind="no-results"
                title="No matching documents"
                description="Try a title, document number, or summary."
                actionLabel="Clear search"
                onAction={() => setQuery('')}
              />
            )
          ) : (
            <p className="muted">
              {scenario === 'loading'
                ? 'Loading documents…'
                : scenario === 'empty'
                  ? 'No documents in this view.'
                  : 'Documents are unavailable.'}
            </p>
          )}
        </div>
        <Button
          variant="quiet"
          onPress={() => {
            setNavigatorOpen(false);
            setCreateOpen(true);
            setCreateError(false);
          }}
        >
          <Icon name="plus" />
          New document
        </Button>
      </div>
      <div className="packet-progress">
        <div>
          <Icon name="book" />
          <strong>
            {ready.length} of {documents.length} ready
          </strong>
        </div>
        <p>Saved and reviewed documents form your handover packet.</p>
        <Button
          size="compact"
          variant="secondary"
          onPress={() => setReviewOpen(true)}
          isDisabled={!available}
        >
          Review packet
          <Icon name="arrow" />
        </Button>
      </div>
      <p className="navigator-footnote">* Unsaved changes</p>
    </div>
  );
  const showHeading = (index: number) => {
    setMode('preview');
    setDetailsOpen(false);
    setCollapsed(null);
    later(() => {
      const headings = document.querySelectorAll<HTMLElement>(
        `[data-document="${activeId}"] :is(h1,h2,h3,h4,h5,h6)`,
      );
      const heading = headings[index];
      if (heading) {
        heading.scrollIntoView({block: 'start'});
        heading.tabIndex = -1;
        heading.focus({preventScroll: true});
      }
    }, 100);
  };
  const inspector = (
    <Inspector
      doc={active}
      documents={documents}
      onChange={(patch) => update(activeId, patch)}
      onReady={toggleReady}
      onChoose={choose}
      onHeading={showHeading}
    />
  );
  const documentMenu = (
    <Menu
      trigger={
        <IconButton label="More document actions" size="compact" variant="quiet">
          <Icon name="more" />
        </IconButton>
      }
      items={[
        {
          type: 'action',
          id: 'download',
          label: 'Download this draft',
          onAction: () => download(active.value, `${active.title || 'Untitled'}.md`),
        },
        {
          type: 'action',
          id: 'duplicate',
          label: 'Duplicate document',
          onAction: () => {
            const id = `document-${Date.now()}`,
              doc = {
                ...active,
                id,
                code: `NS-${String(documents.length + 1).padStart(2, '0')}`,
                title: `${active.title} copy`,
                saved: '',
                ready: false,
              };
            setDocuments((current) => [...current, doc]);
            setVisited((current) => [...current, id]);
            setActiveId(id);
            history.pushState(null, '', `#document/${id}`);
            controls.notify({title: 'Document duplicated', tone: 'success'});
          },
        },
        {type: 'separator', id: 'line'},
        {
          type: 'action',
          id: 'ready',
          label: active.ready ? 'Return to draft' : 'Mark ready for handover',
          isDisabled: !active.ready && !canReady(active),
          onAction: toggleReady,
        },
      ]}
    />
  );
  const editor = (
    <div className="document-workspace">
      <div className="document-topline">
        <div>
          <span className="code">{active.code}</span>
          <span className="muted"> / </span>
          <span className="muted">Northstar observatory</span>
        </div>
        <Badge tone={active.ready ? 'success' : 'neutral'}>
          {active.ready ? 'Ready' : 'Draft'}
        </Badge>
      </div>
      <div className="document-titlebar">
        <h1>{active.title || 'Untitled document'}</h1>
        {documentMenu}
      </div>
      <div className="editing-controls">
        <div className="mode-control">
          <SegmentedControl
            label="Editing mode"
            reserveSupportSpace={false}
            value={mode}
            onChange={setMode}
            options={[
              {value: 'live-preview', label: 'Write'},
              {value: 'source', label: 'Source'},
              {value: 'preview', label: 'Read'},
            ]}
          />
        </div>
        <Toolbar label="Save document">
          <Button size="compact" isDisabled={!dirty || saving.includes(activeId)} onPress={save}>
            <Icon name="save" />
            {saving.includes(activeId) ? 'Saving…' : 'Save'}
          </Button>
        </Toolbar>
      </div>
      {saveErrors[activeId] && (
        <div className="save-error">
          <InlineAlert title="Document not saved" tone="danger">
            {saveErrors[activeId]}
          </InlineAlert>
          <Button
            size="compact"
            variant="secondary"
            onPress={() => {
              setFailSave(false);
              setSaveErrors((current) => ({...current, [activeId]: ''}));
              controls.notify({
                title: 'Connection restored',
                description: 'Save again to keep your changes.',
                tone: 'general',
              });
            }}
          >
            Reconnect
          </Button>
        </div>
      )}
      <div className="editor-sessions">
        {documents
          .filter((doc) => visited.includes(doc.id))
          .map((doc) => (
            <div
              className="editor-session"
              data-document={doc.id}
              hidden={doc.id !== activeId}
              key={doc.id}
            >
              <MarkdownEditor
                label="Document content"
                value={doc.value}
                onChange={(value) => update(doc.id, {value})}
                mode={modes[doc.id] ?? 'live-preview'}
                fillHeight
                reserveSupportSpace={false}
                renderToolbar={(editorControls) => <Formatting controls={editorControls} />}
                wikiLinks={{
                  resolve: (target) => {
                    const found = documents.find(
                      (item) => item.title.toLowerCase() === target.toLowerCase(),
                    );
                    return found ? {href: `#document/${found.id}`, label: found.title} : null;
                  },
                  onNavigate: (link) => {
                    const found = documents.find(
                      (item) => item.title.toLowerCase() === link.target.toLowerCase(),
                    );
                    if (found) choose(found.id);
                  },
                }}
              />
            </div>
          ))}
      </div>
      <div className="document-status">
        <StatusIndicator
          label={
            saving.includes(activeId)
              ? 'Saving…'
              : saveErrors[activeId]
                ? 'Save failed'
                : dirty
                  ? 'Unsaved changes'
                  : 'All changes saved'
          }
          tone={saveErrors[activeId] ? 'danger' : dirty ? 'warning' : 'neutral'}
        />
        <span>{active.value.trim() ? active.value.trim().split(/\s+/).length : 0} words</span>
        <span className="desktop-copy">{mode === 'preview' ? 'Reading view' : 'Markdown'}</span>
      </div>
    </div>
  );
  return (
    <div className="docket-app">
      <header className="application-bar">
        <div className="application-brand">
          <span className="brand-mark">
            <Icon name="document" />
          </span>
          <strong>Docket</strong>
          <span className="application-project">Northstar observatory</span>
        </div>
        <Toolbar label="Workspace actions">
          <Dialog
            title="Review handover packet"
            description="Only saved documents marked ready will be included in the download."
            closeLabel="Close packet review"
            isOpen={reviewOpen}
            onOpenChange={setReviewOpen}
            trigger={
              <Button variant="secondary" size="compact" isDisabled={!available}>
                <Icon name="book" />
                {small ? 'Packet' : 'Review packet'}
                <Badge tone="accent">{ready.length}</Badge>
              </Button>
            }
            actions={({close}) => (
              <>
                <Button variant="quiet" onPress={close}>
                  Keep editing
                </Button>
                <Button
                  isDisabled={!ready.length}
                  onPress={() => {
                    download(packetMarkdown(documents), 'Northstar handover.md');
                    controls.notify({
                      title: 'Handover packet exported',
                      description: `${ready.length} ready documents included.`,
                      tone: 'success',
                    });
                    close();
                  }}
                >
                  <Icon name="download" />
                  Export {ready.length} documents
                </Button>
              </>
            )}
          >
            <div className="packet-review">
              <div className="review-summary">
                <span className="code">SEPTEMBER 2026 / HANDOVER</span>
                <h2>{ready.length} documents ready</h2>
                <p>{documents.length - ready.length} drafts remain outside this packet.</p>
              </div>
              {documents.map((doc) => (
                <div className="review-document" key={doc.id}>
                  <span className="code">{doc.code}</span>
                  <Button variant="quiet" size="compact" onPress={() => choose(doc.id)}>
                    {doc.title || 'Untitled document'}
                  </Button>
                  <StatusIndicator
                    label={
                      doc.ready ? 'Included' : snapshot(doc) !== doc.saved ? 'Unsaved' : 'Draft'
                    }
                    tone={doc.ready ? 'success' : 'neutral'}
                  />
                </div>
              ))}
            </div>
          </Dialog>
          <Dialog
            title="Demo controls"
            description="Explore this session without changing the original sample documents. Reloading the browser resets the demo."
            closeLabel="Close demo controls"
            isOpen={settingsOpen}
            onOpenChange={setSettingsOpen}
            trigger={
              <IconButton label="Demo controls" size="compact" variant="quiet">
                <Icon name="settings" />
              </IconButton>
            }
          >
            <div className="demo-controls">
              <Switch
                label="Dark appearance"
                isSelected={appearance === 'dark'}
                onChange={(value) => onAppearance(value ? 'dark' : 'light')}
                reserveSupportSpace={false}
              />
              <Switch
                label="Simulate save failure"
                description="The next save fails until you reconnect or turn this off."
                isSelected={failSave}
                onChange={setFailSave}
              />
              <h3>Document loading</h3>
              <Button variant="secondary" onPress={() => reload()}>
                Reload documents
              </Button>
              <Button variant="secondary" onPress={() => reload('error')}>
                Simulate loading error
              </Button>
              <Button
                variant="secondary"
                onPress={() => {
                  loadGeneration.current += 1;
                  setScenario('empty');
                  setSettingsOpen(false);
                }}
              >
                Show empty workspace
              </Button>
              <Button
                variant="quiet"
                onPress={() => {
                  loadGeneration.current += 1;
                  setScenario('ready');
                  setSettingsOpen(false);
                }}
              >
                Restore workspace
              </Button>
              <p>
                Drafts, edits, and saved snapshots live in this browser session. Exports are real
                Markdown downloads.
              </p>
            </div>
          </Dialog>
        </Toolbar>
      </header>
      <div className="workspace-layout">
        <aside className="desktop-navigation" aria-label="Document navigator">
          <div className="packet-spine" aria-hidden="true">
            NS / HANDOVER
          </div>
          {navigation}
        </aside>
        <main className="main-workspace">
          <div className="workspace-bar">
            <div className="workspace-location">
              <Drawer
                title="Project documents"
                description="Choose a document in the Northstar handover packet."
                closeLabel="Close document navigator"
                placement="start"
                isOpen={navigatorOpen}
                onOpenChange={setNavigatorOpen}
                trigger={
                  <IconButton label="Open document navigator" size="compact" variant="quiet">
                    <Icon name="folder" />
                  </IconButton>
                }
              >
                {navigation}
              </Drawer>
              <span>Workspace</span>
              <span className="breadcrumb-slash">/</span>
              <strong>
                {available
                  ? tool === 'register'
                    ? 'Handover register'
                    : tool === 'commissioning'
                      ? 'Commissioning review'
                      : active.title || 'Untitled document'
                  : scenario === 'loading'
                    ? 'Loading…'
                    : scenario === 'empty'
                      ? 'New workspace'
                      : 'Connection interrupted'}
              </strong>
            </div>
            <div className="inspector-toggle" hidden={tool !== 'documents'}>
              {compact ? (
                <Drawer
                  title="Document details"
                  description={`${active.code} · ${active.title}`}
                  closeLabel="Close document details"
                  isOpen={detailsOpen}
                  onOpenChange={setDetailsOpen}
                  trigger={
                    small ? (
                      <IconButton
                        label="Details"
                        size="compact"
                        variant="quiet"
                        isDisabled={!available}
                      >
                        <Icon name="details" />
                      </IconButton>
                    ) : (
                      <Button size="compact" variant="quiet" isDisabled={!available}>
                        <Icon name="details" />
                        Details
                      </Button>
                    )
                  }
                >
                  {inspector}
                </Drawer>
              ) : (
                <Button
                  size="compact"
                  variant="quiet"
                  isDisabled={!available}
                  onPress={() =>
                    setCollapsed((current) => (current === 'secondary' ? null : 'secondary'))
                  }
                >
                  <Icon name="details" />
                  {collapsed === 'secondary' ? 'Show details' : 'Hide details'}
                </Button>
              )}
            </div>
          </div>
          <div className="workspace-stage" hidden={!available || tool !== 'documents'}>
            <SplitView
              ariaLabel="Document and inspector"
              primaryLabel="Document editing"
              secondaryLabel="Document inspector"
              resizeLabel="Resize document and inspector"
              primarySize={paneSize}
              onPrimarySizeChange={setPaneSize}
              minPrimarySize={52}
              maxPrimarySize={76}
              collapsedPane={compact ? 'secondary' : collapsed}
              onCollapsedPaneChange={setCollapsed}
              collapsePrimaryLabel="Hide document editor"
              restorePrimaryLabel="Show document editor"
              collapseSecondaryLabel="Hide document inspector"
              restoreSecondaryLabel="Show document inspector"
              primary={editor}
              secondary={inspector}
            />
          </div>
          <div className="tool-stage" hidden={!available || tool !== 'register'}>
            <Register
              documents={documents}
              onOpen={choose}
              onReady={batchReady}
              onReviewPacket={() => setReviewOpen(true)}
              small={small}
            />
          </div>
          <div className="tool-stage" hidden={!available || tool !== 'commissioning'}>
            <Commissioning onReport={createReviewReport} onOpen={choose} compact={reviewCompact} />
          </div>
          {!available && (
            <div className="workspace-state">
              {scenario === 'loading' ? (
                <div className="loading-document" role="status" aria-label="Loading documents">
                  <Skeleton shape="heading" width="half" />
                  <Skeleton lines={3} />
                  <Skeleton lines={5} />
                  <p>Loading your documents…</p>
                </div>
              ) : scenario === 'error' ? (
                <EmptyState
                  kind="unavailable"
                  title="The documents could not be loaded"
                  description="The connection was interrupted. Your open drafts and changes are still in this session."
                  actionLabel="Try again"
                  onAction={() => reload()}
                />
              ) : (
                <EmptyState
                  kind="no-data"
                  title="Start a handover document"
                  description="Give the next team the context they need. Create a document, write a draft, and add it to your packet."
                  actionLabel="Create a document"
                  onAction={() => setCreateOpen(true)}
                />
              )}
            </div>
          )}
        </main>
      </div>
      <footer className="application-footer">
        <span>
          <span className="connection-dot" />{' '}
          {failSave ? 'Connection unavailable' : 'Session workspace'}
        </span>
        <span>
          {dirtyCount
            ? `${dirtyCount} unsaved ${dirtyCount === 1 ? 'document' : 'documents'}`
            : 'Changes kept for this session'}
        </span>
        <span className="desktop-copy">
          Save <kbd>Ctrl / ⌘ S</kbd>
        </span>
      </footer>
      <div className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </div>
      <Dialog
        title="New document"
        description="Add a document to the Northstar handover packet."
        closeLabel="Close new document"
        isOpen={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open)
            later(() => {
              const selector = small
                ? '[aria-label="Open document navigator"]'
                : '.document-navigator-section > button';
              document.querySelector<HTMLElement>(selector)?.focus();
            }, 180);
        }}
        trigger={
          <span hidden>
            <Button>New document dialog</Button>
          </span>
        }
        actions={({close}) => (
          <>
            <Button variant="quiet" onPress={close}>
              Cancel
            </Button>
            <Button onPress={createDocument}>
              Create document
              <Icon name="plus" />
            </Button>
          </>
        )}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            createDocument();
          }}
        >
          <TextField
            label="New document title"
            value={newTitle}
            onChange={setNewTitle}
            isRequired
            isInvalid={createError && !newTitle.trim()}
            errorMessage="Enter a title for the new document."
            placeholder="e.g. Night-shift notes"
          />
        </form>
      </Dialog>
    </div>
  );
}
