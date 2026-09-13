import {useState} from 'react';
import {Badge, Button, CardCollection, SearchField, Switch} from '@trwhitney/component-library';
import type {DocumentRecord} from './data.js';

export function DocumentHome({
  documents,
  included,
  onInclude,
  onOpen,
}: {
  readonly documents: readonly DocumentRecord[];
  readonly included: readonly string[];
  readonly onInclude: (ids: string[]) => void;
  readonly onOpen: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [bounded, setBounded] = useState(true);
  const visible = documents.filter((doc) =>
    `${doc.title} ${doc.summary}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <section className="document-home" aria-labelledby="home-heading">
      <div className="task-heading">
        <h1 id="home-heading">Documents</h1>
        <span className="muted">Riverside field guide</span>
      </div>
      <div className="home-controls">
        <SearchField
          label="Find a document"
          clearLabel="Clear document search"
          value={search}
          onChange={setSearch}
          reserveSupportSpace={false}
        />
        <Switch
          label="Fixed card height"
          isSelected={bounded}
          onChange={setBounded}
          reserveSupportSpace={false}
        />
      </div>
      <p className="muted">
        Select cards to include them in the field guide. Open a document to write or review it.
      </p>
      <CardCollection
        ariaLabel="Document cards"
        headingLevel={2}
        cardWidth={280}
        {...(bounded ? {cardHeight: 260} : {})}
        selectionMode="multiple"
        selectedIds={included.filter((id) => visible.some((doc) => doc.id === id))}
        onSelectionChange={(ids) =>
          onInclude([...included.filter((id) => !visible.some((doc) => doc.id === id)), ...ids])
        }
        emptyState={{
          kind: 'no-results',
          title: 'No matching documents',
          description: 'Try another title or summary.',
        }}
        items={visible.map((doc) => ({
          id: doc.id,
          title: doc.title || 'New document',
          description: <span className="home-card-summary">{doc.summary}</span>,
          content: (
            <div className="home-card-content">
              <Badge>{doc.stage}</Badge>
              <p>
                {doc.value
                  .split(/\n\n/)
                  .find((paragraph) => paragraph.trim() && !paragraph.startsWith('#'))
                  ?.replace(/\*\*|__/g, '') || 'Start writing this document.'}
              </p>
            </div>
          ),
          actions: (
            <Button size="compact" onPress={() => onOpen(doc.id)}>
              {doc.access === 'editable' ? 'Open' : 'Read'} {doc.title || 'document'}
            </Button>
          ),
        }))}
      />
    </section>
  );
}
