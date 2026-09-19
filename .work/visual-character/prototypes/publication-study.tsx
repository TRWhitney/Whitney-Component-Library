import {useEffect, useState} from 'react';
import {Button, List, ProcessTracker, Table, Toolbar} from '@trwhitney/component-library';
import {ReviewDesk as OriginalReviewDesk} from './publication-baseline.js';
import {snapshot} from '../../../prototypes/markdown-authoring/data.js';
export {CollectionDesk} from './publication-baseline.js';
type PublicationProps = Parameters<typeof OriginalReviewDesk>[0];
const words = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

// Only the isolated study host resolves the demo's publication module to this file.
export function ReviewDesk(props: PublicationProps) {
  const [proposed, setProposed] = useState(
    () => document.documentElement.dataset.studyTreatment === 'proposed',
  );
  useEffect(() => {
    const update = () =>
      setProposed(document.documentElement.dataset.studyTreatment === 'proposed');
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-study-treatment'],
    });
    update();
    return () => observer.disconnect();
  }, []);
  return proposed ? <StudyReviewDesk {...props} /> : <OriginalReviewDesk {...props} />;
}

function StudyReviewDesk({
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
    <section
      className="study-publication"
      aria-labelledby="study-review-title"
      data-region="Publication review"
    >
      <header className="study-review-heading" data-region="Review identity">
        <span className="study-publication-caption">Riverside field guide</span>
        <h1 id="study-review-title">Review &amp; export</h1>
        <p>Prepare the reviewed documents for publication.</p>
      </header>
      <div className="study-review-layout" data-region="Responsive review atmosphere">
        <section
          className="study-manuscripts"
          data-study-atmosphere-anchor=""
          aria-labelledby="study-documents-title"
          data-region="Document review surface"
        >
          <header>
            <div>
              <h2 id="study-documents-title">Included documents</h2>
              <span>{selected.length} documents</span>
            </div>
            <p>Review each saved version. Editing a reviewed document requires another review.</p>
          </header>
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
        <aside
          className="study-publication-field"
          aria-labelledby="study-publication-title"
          data-region="Publication spacing"
        >
          <div className="study-publication-summary" data-region="Raised publication panel">
            <header>
              <span className="study-publication-caption">Publication</span>
              <h2 id="study-publication-title">
                {exported ? 'Guide exported' : ready ? 'Ready to export' : 'Review in progress'}
              </h2>
            </header>
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

            <div className="study-export">
              <p>
                {exported
                  ? 'Your Markdown field guide has been downloaded.'
                  : ready
                    ? 'Every included document has been reviewed.'
                    : 'Review the included documents to enable export.'}
              </p>
              <Toolbar label="Export actions">
                <Button size="compact" isDisabled={!ready} onPress={onExport}>
                  Export field guide
                </Button>
              </Toolbar>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
