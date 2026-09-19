import {useState} from 'react';
import {
  Badge,
  Button,
  CollectionFilterBar,
  Dialog,
  IconButton,
  Menu,
  ProgressBar,
  StatusIndicator,
  Table,
  Toolbar,
  type CollectionQuery,
  type MenuItems,
  type TableSortDescriptor,
} from '@trwhitney/component-library';
import {Icon} from './icons.js';
import {canReady, snapshot, type WorkDocument} from './model.js';
const filters = [
  {
    id: 'status',
    label: 'Readiness',
    placeholder: 'Any status',
    emptyMessage: 'No statuses',
    options: [
      {value: 'draft', label: 'Saved draft'},
      {value: 'unsaved', label: 'Unsaved'},
      {value: 'ready', label: 'Ready'},
    ],
  },
  {
    id: 'owner',
    label: 'Owner',
    placeholder: 'Any owner',
    emptyMessage: 'No owners',
    options: ['Alex Morgan', 'Sam Rivera', 'Jamie Chen'].map((value) => ({value, label: value})),
  },
];
function readiness(doc: WorkDocument) {
  return snapshot(doc) !== doc.saved ? 'unsaved' : doc.ready ? 'ready' : 'draft';
}
export function Register({
  documents,
  onOpen,
  onReady,
  onReviewPacket,
  small,
}: {
  documents: WorkDocument[];
  onOpen: (id: string) => void;
  onReady: (ids: string[], ready: boolean) => void;
  onReviewPacket: () => void;
  small: boolean;
}) {
  const [query, setQuery] = useState<CollectionQuery>({text: '', filters: []});
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<TableSortDescriptor<'title' | 'owner' | 'status' | 'actions'>>({
    column: 'title',
    direction: 'ascending',
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtered = documents.filter(
    (doc) =>
      `${doc.title} ${doc.code} ${doc.summary}`.toLowerCase().includes(query.text.toLowerCase()) &&
      query.filters.every(
        (filter) => (filter.filterId === 'owner' ? doc.owner : readiness(doc)) === filter.value,
      ),
  );
  const visible = [...filtered].sort((a, b) => {
    const value = (doc: WorkDocument) =>
      sort.column === 'owner' ? doc.owner : sort.column === 'status' ? readiness(doc) : doc.title;
    return value(a).localeCompare(value(b)) * (sort.direction === 'ascending' ? 1 : -1);
  });
  const eligible = documents.filter(
    (doc) => selected.includes(doc.id) && !doc.ready && canReady(doc),
  );
  const readyCount = documents.filter((doc) => doc.ready).length;
  const menu = (id: string): MenuItems => {
    const doc = documents.find((item) => item.id === id)!;
    return [
      {type: 'action', id: 'open', label: 'Open document', onAction: () => onOpen(id)},
      {
        type: 'action',
        id: 'ready',
        label: doc.ready ? 'Return to draft' : 'Mark ready',
        isDisabled: !doc.ready && !canReady(doc),
        onAction: () => onReady([id], !doc.ready),
      },
    ];
  };
  const filterControls = (
    <CollectionFilterBar
      ariaLabel="Filter handover register"
      appliedFiltersLabel="Active register filters"
      clearAllLabel="Clear filters"
      filters={filters}
      query={query}
      onQueryChange={(value) => {
        setQuery(value);
        setSelected([]);
      }}
      searchLabel="Search register"
      searchClearLabel="Clear register search"
      searchPlaceholder="Title, reference, or summary"
      getFilterSummary={(label, value) => `${label}: ${value}`}
      getRemoveLabel={(summary) => `Remove ${summary}`}
      getSearchSummary={(text) => `Search: ${text}`}
    />
  );
  return (
    <div className="register-tool tool-view">
      <header className="tool-heading">
        <div>
          <span className="code">PACKET / DOCUMENT CONTROL</span>
          <h1>Handover register</h1>
          <p>Prepare the documents the incoming team will receive.</p>
        </div>
        <Button onPress={onReviewPacket} size="compact">
          <Icon name="book" />
          Review packet
        </Button>
      </header>
      <div className="register-layout">
        <section className="register-main" aria-label="Document register">
          <div className="register-filters">
            {small ? (
              <Dialog
                title="Filter register"
                description="Find documents by title, owner, or readiness."
                closeLabel="Close register filters"
                isOpen={filtersOpen}
                onOpenChange={setFiltersOpen}
                trigger={
                  <Button size="compact" variant="secondary">
                    <Icon name="search" />
                    Filter documents
                    {query.text || query.filters.length ? (
                      <Badge tone="accent">Applied</Badge>
                    ) : null}
                  </Button>
                }
                actions={({close}) => (
                  <Button onPress={close}>Show {visible.length} documents</Button>
                )}
              >
                {filterControls}
              </Dialog>
            ) : (
              filterControls
            )}
          </div>
          <div className="register-selection">
            <span>
              {selected.length ? `${selected.length} selected` : `${visible.length} documents`}
            </span>
            <Toolbar label="Selected document actions">
              <Button
                size="compact"
                variant="secondary"
                isDisabled={!eligible.length}
                onPress={() => onReady(selected, true)}
              >
                Mark {eligible.length || 'selected'} ready
              </Button>
              <Button
                size="compact"
                variant="quiet"
                isDisabled={!selected.length}
                onPress={() => setSelected([])}
              >
                Clear selection
              </Button>
            </Toolbar>
          </div>
          <div className="register-table">
            <Table
              ariaLabel="Handover documents"
              minimumWidth={small ? 530 : 680}
              selectionMode="multiple"
              selectedIds={selected}
              onSelectionChange={setSelected}
              sortDescriptor={sort}
              onSortChange={setSort}
              columns={[
                {id: 'title', label: 'Document', isRowHeader: true, allowsSorting: true},
                {id: 'owner', label: 'Owner', allowsSorting: true},
                {id: 'status', label: 'Readiness', allowsSorting: true},
                {id: 'actions', label: 'Actions', kind: 'actions', width: 72},
              ]}
              rows={visible.map((doc) => ({
                id: doc.id,
                textValue: doc.title,
                cells: {
                  title: (
                    <div className="register-document">
                      <strong>{doc.title || 'Untitled document'}</strong>
                      <span className="code">{doc.code}</span>
                    </div>
                  ),
                  owner: doc.owner,
                  status: (
                    <StatusIndicator
                      label={
                        readiness(doc) === 'unsaved' ? 'Unsaved' : doc.ready ? 'Ready' : 'Draft'
                      }
                      tone={
                        readiness(doc) === 'unsaved' ? 'warning' : doc.ready ? 'success' : 'neutral'
                      }
                    />
                  ),
                  actions: (
                    <Menu
                      trigger={
                        <IconButton
                          label={`Actions for ${doc.title}`}
                          size="compact"
                          variant="quiet"
                        >
                          <Icon name="more" />
                        </IconButton>
                      }
                      items={menu(doc.id)}
                    />
                  ),
                },
              }))}
              contextMenu={{
                getLabel: (id) => documents.find((doc) => doc.id === id)!.title,
                getItems: menu,
              }}
              emptyState={{
                kind: 'no-results',
                title: 'No documents match these filters',
                description: 'Clear the filters to see the whole handover packet.',
                actionLabel: 'Clear filters',
                onAction: () => {
                  setQuery({text: '', filters: []});
                  setSelected([]);
                },
              }}
            />
          </div>
          <p className="register-note">
            Select rows to prepare a batch. Open a row's action menu to edit its document.
          </p>
        </section>
        <aside className="register-summary" aria-label="Packet readiness">
          <span className="code">SEPTEMBER HANDOVER</span>
          <h2>The packet at a glance</h2>
          <ProgressBar
            label="Documents ready"
            value={readyCount}
            maxValue={documents.length || 1}
            valueLabel={`${readyCount} of ${documents.length}`}
            isActive={readyCount !== documents.length}
            completionLabel="Every document is ready"
          />
          <div className="register-counts">
            <div>
              <strong>{readyCount}</strong>
              <span>Ready to hand over</span>
            </div>
            <div>
              <strong>{documents.filter((doc) => readiness(doc) === 'unsaved').length}</strong>
              <span>With unsaved changes</span>
            </div>
          </div>
          <div className="register-selection-summary">
            <h3>Before marking ready</h3>
            <p>
              A document needs a title, content, and a saved version. Editing it returns it to
              draft.
            </p>
            {selected.length > 0 && (
              <p>
                {eligible.length} selected documents can become ready. The other{' '}
                {selected.length - eligible.length} will stay unchanged.
              </p>
            )}
          </div>
          <Button variant="quiet" size="compact" onPress={onReviewPacket}>
            Inspect packet contents
            <Icon name="arrow" />
          </Button>
        </aside>
      </div>
    </div>
  );
}
