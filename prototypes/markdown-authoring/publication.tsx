import {
  List,
  ToggleButton,
  Badge,
  Button,
  ProcessTracker,
  SearchField,
  Table,
  Toolbar,
} from '@trwhitney/component-library';
import {useState} from 'react';
import {snapshot, type DocumentRecord} from './data.js';

interface PublicationProps {
  documents: DocumentRecord[];
  small: boolean;
  included: string[];
  reviewed: Record<string, string>;
  onInclude: (ids: string[]) => void;
  onOpen: (id: string) => void;
  onNew: () => void;
  onReview: () => void;
  onApprove: (id: string) => void;
  onExport: () => void;
  exported: boolean;
}
const words = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

export function CollectionDesk({
  documents,
  small,
  included,
  reviewed,
  onInclude,
  onOpen,
  onReview,
}: PublicationProps) {
  const [search, setSearch] = useState('');
  const filtered = documents.filter((doc) =>
    `${doc.title} ${doc.summary}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <section className="collection-desk" data-region="Collection desk" aria-label="Collection">
      <div className="task-heading">
        <h1>Collection</h1>
        <span className="muted small-copy">
          {included.length} of {documents.length} included
        </span>
      </div>
      <div className="collection-filter">
        <SearchField
          label="Find a document"
          clearLabel="Clear document search"
          value={search}
          onChange={setSearch}
          placeholder="Search titles and summaries"
        />
        <Button onPress={onReview} size="compact" isDisabled={!included.length}>
          Review collection
        </Button>
      </div>
      <p className="muted small-copy">
        Select rows to include documents in the field guide. Open a title to edit.
      </p>
      {small ? (
        <List
          ariaLabel="Guide documents"
          marker="none"
          emptyState={{
            kind: 'no-results',
            title: 'No matching documents',
            description: 'Try another title or clear the search.',
            actionLabel: 'Clear search',
            onAction: () => setSearch(''),
          }}
          items={filtered.map((doc) => ({
            id: doc.id,
            primary: (
              <div className="mobile-document-row">
                <div className="mobile-document-copy">
                  <Button variant="quiet" size="compact" onPress={() => onOpen(doc.id)}>
                    {doc.title || 'New document'}
                  </Button>
                  <span className="muted small-copy">
                    {doc.stage}
                    {snapshot(doc) !== doc.saved ? ' · Unsaved' : ''}
                  </span>
                </div>
                <ToggleButton
                  size="compact"
                  isSelected={included.includes(doc.id)}
                  onChange={(selected) =>
                    onInclude(
                      selected ? [...included, doc.id] : included.filter((id) => id !== doc.id),
                    )
                  }
                >
                  {included.includes(doc.id) ? 'Included' : 'Include'}
                </ToggleButton>
              </div>
            ),
          }))}
        />
      ) : (
        <Table<string, string>
          ariaLabel="Guide documents"
          selectionMode="multiple"
          selectedIds={included.filter((id) => filtered.some((doc) => doc.id === id))}
          onSelectionChange={(ids) =>
            onInclude([...included.filter((id) => !filtered.some((doc) => doc.id === id)), ...ids])
          }
          columns={[
            {id: 'title', label: 'Document', isRowHeader: true},
            ...(!small
              ? [
                  {id: 'summary' as const, label: 'Summary'},
                  {id: 'stage' as const, label: 'Stage'},
                ]
              : []),
            {id: 'included', label: 'In guide'},
          ]}
          emptyState={{
            kind: 'no-results',
            title: 'No matching documents',
            description: 'Try another title or clear the search.',
            actionLabel: 'Clear search',
            onAction: () => setSearch(''),
          }}
          rows={filtered.map((doc) => ({
            id: doc.id,
            textValue: doc.title || 'New document',
            cells: {
              title: (
                <Button variant="quiet" size="compact" onPress={() => onOpen(doc.id)}>
                  {doc.title || 'New document'}
                  {snapshot(doc) !== doc.saved ? ' *' : ''}
                </Button>
              ),
              ...(!small
                ? {
                    summary: (
                      <span className="document-summary" title={doc.summary}>
                        {doc.summary || 'No summary'}
                      </span>
                    ),
                    stage: (
                      <Badge tone={reviewed[doc.id] === snapshot(doc) ? 'success' : 'neutral'}>
                        {reviewed[doc.id] === snapshot(doc) ? 'Reviewed' : doc.stage}
                      </Badge>
                    ),
                  }
                : {}),
              included: included.includes(doc.id) ? 'Included' : 'Excluded',
            },
          }))}
        />
      )}
    </section>
  );
}

export function ReviewDesk({
  documents,
  small,
  included,
  reviewed,
  onOpen,
  onApprove,
  onExport,
  exported,
}: PublicationProps) {
  const selected = documents.filter((doc) => included.includes(doc.id));
  const ready = selected.length > 0 && selected.every((doc) => reviewed[doc.id] === snapshot(doc));
  return (
    <section className="review-desk" data-region="Collection review" aria-label="Collection review">
      <div className="task-heading review-heading">
        <h1>Review & export</h1>
        <div className="review-export-action">
          <Toolbar label="Export actions">
            <Button size="compact" isDisabled={!ready} onPress={onExport}>
              Export field guide
            </Button>
          </Toolbar>
        </div>
      </div>
      <ProcessTracker
        ariaLabel="Publication progress"
        statusLabels={{
          complete: 'Complete',
          active: 'Current',
          pending: 'Next',
          warning: 'Needs attention',
          failed: 'Failed',
        }}
        stages={[
          {
            id: 'assemble',
            label: 'Assemble',
            description: `${selected.length} documents included`,
            status: 'complete',
          },
          {
            id: 'review',
            label: 'Review',
            description: `${selected.filter((doc) => reviewed[doc.id] === snapshot(doc)).length} of ${selected.length} reviewed`,
            status: ready ? 'complete' : 'active',
          },
          {
            id: 'export',
            label: 'Export',
            description: exported ? 'Markdown downloaded' : 'One Markdown file',
            status: exported ? 'complete' : ready ? 'active' : 'pending',
          },
        ]}
      />
      <p className="muted small-copy">
        Review each saved version. Editing a reviewed document requires another review.
      </p>
      {small ? (
        <List
          ariaLabel="Document review"
          marker="none"
          emptyState={{
            kind: 'no-data',
            title: 'No documents included',
            description: 'Select documents in Collection to prepare an export.',
          }}
          items={selected.map((doc) => {
            const dirty = snapshot(doc) !== doc.saved,
              checked = reviewed[doc.id] === snapshot(doc),
              empty = !doc.title.trim() || !doc.value.trim();
            return {
              id: doc.id,
              primary: (
                <div className="mobile-document-row">
                  <div className="mobile-document-copy">
                    <Button variant="quiet" size="compact" onPress={() => onOpen(doc.id)}>
                      {doc.title || 'New document'}
                    </Button>
                    <span className="muted small-copy">
                      {dirty
                        ? 'Save changes first'
                        : empty
                          ? 'Add title and content'
                          : `${words(doc.value)} words`}
                    </span>
                  </div>
                  <Button
                    size="compact"
                    isDisabled={dirty || empty || checked}
                    onPress={() => onApprove(doc.id)}
                  >
                    <span className="review-action-label">
                      {checked ? 'Reviewed' : 'Mark reviewed'}
                    </span>
                  </Button>
                </div>
              ),
            };
          })}
        />
      ) : (
        <Table<string, string>
          ariaLabel="Document review"
          selectionMode="none"
          columns={[
            {id: 'title', label: 'Document', isRowHeader: true},
            ...(!small ? [{id: 'status' as const, label: 'Version'}] : []),
            {id: 'actions', label: 'Review', kind: 'actions'},
          ]}
          emptyState={{
            kind: 'no-data',
            title: 'No documents included',
            description: 'Select documents in Collection to prepare an export.',
          }}
          rows={selected.map((doc) => {
            const dirty = snapshot(doc) !== doc.saved,
              checked = reviewed[doc.id] === snapshot(doc),
              empty = !doc.title.trim() || !doc.value.trim();
            const status = checked
              ? 'Reviewed'
              : dirty
                ? 'Save changes first'
                : empty
                  ? 'Add title and content'
                  : `${words(doc.value)} words · Ready for review`;
            return {
              id: doc.id,
              textValue: doc.title || 'New document',
              cells: {
                title: (
                  <div className="review-title">
                    <Button variant="quiet" size="compact" onPress={() => onOpen(doc.id)}>
                      {doc.title || 'New document'}
                    </Button>
                    {small && <span className="muted small-copy">{status}</span>}
                  </div>
                ),
                ...(!small ? {status: <span className="review-version">{status}</span>} : {}),
                actions: (
                  <Button
                    size="compact"
                    isDisabled={dirty || empty || checked}
                    onPress={() => onApprove(doc.id)}
                  >
                    <span className="review-action-label">
                      {checked ? 'Reviewed' : 'Mark reviewed'}
                    </span>
                  </Button>
                ),
              },
            };
          })}
        />
      )}
    </section>
  );
}
