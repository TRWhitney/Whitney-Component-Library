import {useEffect, useState} from 'react';
import {
  Badge,
  Button,
  CardCollection,
  CheckboxGroup,
  DatePicker,
  Dialog,
  Drawer,
  SplitView,
  type SplitViewCollapsedPane,
  FileTrigger,
  IconButton,
  InlineAlert,
  LineChart,
  Meter,
  ProcessTracker,
  RadioGroup,
  Select,
  StatusIndicator,
  TextArea,
} from '@trwhitney/component-library';
import {observations} from './data.js';
import {Icon} from './icons.js';
import {
  initialReviews,
  reviewProblems,
  reviewMarkdown,
  systems,
  type SystemId,
  type ReviewDraft,
} from './review-model.js';
export function Commissioning({
  onReport,
  onOpen,
  compact,
}: {
  onReport: (title: string, value: string, owner: string) => string;
  onOpen: (id: string) => void;
  compact: boolean;
}) {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<SplitViewCollapsedPane>(null);
  useEffect(() => {
    if (!compact) setEvidenceOpen(false);
  }, [compact]);
  const [systemId, setSystemId] = useState<SystemId>('ventilation');
  const [reviews, setReviews] = useState(initialReviews);
  const [attempted, setAttempted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [fileError, setFileError] = useState('');
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [recorded, setRecorded] = useState<Record<string, {id: string; fingerprint: string}>>({});
  const system = systems.find((item) => item.id === systemId)!;
  const review = reviews[systemId];
  const errors = reviewProblems(
    review,
    system.checks.map((check) => check.value),
  );
  const complete = system.checks.every((check) => review.checks.includes(check.value));
  const currentRecord = recorded[systemId];
  const isRecorded = currentRecord?.fingerprint === JSON.stringify(review);
  const change = (patch: Partial<ReviewDraft>) =>
    setReviews((current) => ({...current, [systemId]: {...current[systemId], ...patch}}));
  const choose = (id: SystemId) => {
    setSystemId(id);
    setAttempted(false);
    setFileError('');
  };
  const record = () => {
    setAttempted(true);
    if (errors.length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('.review-errors')?.focus());
      return;
    }
    setConfirmOpen(true);
  };
  const confirm = () => {
    const id = onReport(
      `${system.title} review`,
      reviewMarkdown(system.title, system.checks, review),
      system.owner,
    );
    setRecorded((current) => ({...current, [systemId]: {id, fingerprint: JSON.stringify(review)}}));
    setConfirmOpen(false);
  };
  const selections = systems.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.location,
    content: (
      <div className="system-card-status">
        <StatusIndicator
          label={
            recorded[item.id]?.fingerprint === JSON.stringify(reviews[item.id])
              ? 'Recorded'
              : reviews[item.id].decision === 'hold'
                ? 'Needs attention'
                : 'In review'
          }
          tone={
            recorded[item.id]?.fingerprint === JSON.stringify(reviews[item.id])
              ? 'success'
              : reviews[item.id].decision === 'hold'
                ? 'warning'
                : 'neutral'
          }
        />
      </div>
    ),
  }));
  const evidence = (
    <aside className="review-evidence" aria-label="System evidence">
      <div className="reading-panel">
        <span className="code">LATEST OBSERVATION</span>
        <Meter
          label={system.readingLabel}
          minValue={0}
          maxValue={system.maximum}
          value={system.reading}
          valueLabel={`${system.reading} ${system.unit}`}
          tone={system.id === 'access' ? 'warning' : 'success'}
          thresholds={
            system.id === 'access'
              ? []
              : [
                  {
                    value: system.target,
                    label: 'Operating target',
                    valueLabel: `${system.target} ${system.unit}`,
                    tone: 'success',
                  },
                ]
          }
        />
        <p>{system.hint}</p>
      </div>
      {systemId === 'ventilation' && (
        <section aria-label="Commissioning history">
          <div className="review-chart">
            <LineChart
              overflow="clip"
              data={observations}
              title="Control-room temperature"
              description="Six visits · September 2026"
              dataTableLabel="Review commissioning readings"
              aspectRatio={2.4}
              minimumSize={{width: 200, height: 140}}
              series={[
                {
                  id: 'temperature',
                  label: 'Temperature',
                  accessor: 'temperature',
                  showPoints: true,
                },
              ]}
              xAxis={{
                accessor: 'visit',
                label: 'September visits',
                formatTick: (value) => String(value).slice(0, 2),
                scale: {type: 'categorical'},
              }}
              yAxis={{
                label: '°C',
                tickCount: 4,
                scale: {type: 'linear', domain: [20, 32]},
              }}
              emptyState={{
                title: 'No readings',
                description: 'No measurements have been recorded.',
              }}
              invalidData={{
                title: 'Readings unavailable',
                description: 'Check the measurement data.',
              }}
            />
          </div>
        </section>
      )}
      <div className="review-attachments">
        <div className="attachment-heading">
          <h3>Supporting evidence</h3>
          <FileTrigger
            label="Attach evidence"
            reserveSupportSpace={false}
            allowsMultiple
            maxFileSize={8 * 1024 * 1024}
            getAnnouncement={({files, rejectedFiles}) =>
              `${files.length} files attached; ${rejectedFiles.length} rejected.`
            }
            onFiles={({files: incoming, rejectedFiles}) => {
              setFileError(
                rejectedFiles.length
                  ? 'Some files exceeded the 8 MB limit. Choose smaller files.'
                  : '',
              );
              const next = [...(files[systemId] ?? []), ...incoming];
              setFiles((current) => ({...current, [systemId]: next}));
              change({evidence: next.map((file) => file.name)});
            }}
          />
        </div>
        <p className="muted">Up to 8 MB per file · Kept in this session</p>
        {fileError && (
          <InlineAlert title="Evidence not attached" tone="danger">
            {fileError}
          </InlineAlert>
        )}
        {(files[systemId] ?? []).length === 0 ? (
          <p className="muted">No supporting files yet.</p>
        ) : (
          (files[systemId] ?? []).map((file, index) => (
            <div className="evidence-file" key={`${index}-${file.name}`}>
              <Icon name="document" />
              <span>{file.name}</span>
              <IconButton
                label={`Remove ${file.name}`}
                size="compact"
                variant="quiet"
                onPress={() => {
                  const next = (files[systemId] ?? []).filter((_, i) => i !== index);
                  setFiles((current) => ({...current, [systemId]: next}));
                  change({evidence: next.map((item) => item.name)});
                }}
              >
                <Icon name="close" />
              </IconButton>
            </div>
          ))
        )}
      </div>
      <Button
        variant="quiet"
        size="compact"
        onPress={() => {
          setEvidenceOpen(false);
          onOpen('commissioning');
        }}
      >
        Read commissioning notes
        <Icon name="arrow" />
      </Button>
    </aside>
  );
  const form = (
    <div className="review-form">
      {' '}
      {attempted && errors.length > 0 && (
        <div className="review-errors" tabIndex={-1}>
          <InlineAlert title="Review needs attention" tone="danger">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </InlineAlert>
        </div>
      )}
      <div className="review-form-fields">
        <section className="review-checks">
          <div className="review-section-heading">
            <span className="step-number">01</span>
            <h3>Verify the system</h3>
          </div>
          <DatePicker
            label="Review date"
            calendar="gregory"
            locale="en-US"
            calendarButtonLabel="Choose review date"
            placeholderValue={{year: 2026, month: 9, day: 24}}
            value={review.date}
            onChange={(date) => change({date})}
            reserveSupportSpace={false}
          />
          <CheckboxGroup<string>
            label="Acceptance checkpoints"
            options={system.checks}
            value={review.checks}
            onChange={(checks) => change({checks})}
            reserveSupportSpace={false}
          />
        </section>
        <section className="review-decision">
          {' '}
          <div className="review-section-heading">
            <span className="step-number">02</span>
            <h3>Record your decision</h3>
          </div>
          <RadioGroup
            label="Review decision"
            options={[
              {
                value: 'pass',
                label: 'Pass',
                description: 'All acceptance checkpoints are complete.',
              },
              {
                value: 'hold',
                label: 'Hold',
                description: 'Keep the system under review and record the remaining work.',
              },
            ]}
            value={review.decision}
            onChange={(decision) => change({decision})}
            reserveSupportSpace={false}
          />
        </section>
      </div>
      <TextArea
        label="Review notes"
        rows={3}
        description={
          review.decision === 'hold'
            ? 'Explain the remaining work before this system can pass.'
            : 'Record observations or instructions for the incoming team.'
        }
        value={review.notes}
        onChange={(notes) => change({notes})}
        isRequired={review.decision === 'hold'}
        validationBehavior="aria"
        isInvalid={attempted && review.decision === 'hold' && !review.notes.trim()}
        errorMessage="Explain the remaining work before recording a hold."
        reserveSupportSpace={false}
      />
    </div>
  );
  return (
    <div className="commissioning-tool tool-view" data-compact={compact || undefined}>
      <header className="tool-heading">
        <div>
          <h1>Commissioning review</h1>
          <p>Check each system and carry its decision into the handover.</p>
        </div>
        <Badge tone="accent">28 Sep opening</Badge>
      </header>
      <div className="commissioning-layout">
        <aside className="system-selector" aria-label="Review systems">
          <h2>Systems</h2>
          {compact ? (
            <Select
              label="System to review"
              value={systemId}
              onChange={(id) => {
                if (id) choose(id);
              }}
              options={systems.map((item) => ({value: item.id, label: item.title}))}
              emptyMessage="No systems"
              reserveSupportSpace={false}
            />
          ) : (
            <CardCollection
              ariaLabel="Commissioning systems"
              selectionMode="single"
              selectedId={systemId}
              onSelectionChange={(id) => {
                if (id) choose(id);
              }}
              headingLevel={3}
              cardWidth={152}
              items={selections}
              emptyState={{
                kind: 'no-data',
                title: 'No systems',
                description: 'No systems have been added to this review.',
              }}
            />
          )}
          <div className="system-context">
            <h3>Review progress</h3>
            <ProcessTracker
              ariaLabel="System review progress"
              stages={[
                {
                  id: 'checks',
                  label: 'Check system',
                  status: isRecorded || complete ? 'complete' : 'active',
                },
                {
                  id: 'decision',
                  label: 'Record decision',
                  status: isRecorded ? 'complete' : complete ? 'active' : 'pending',
                },
                {
                  id: 'document',
                  label: 'Create document',
                  status: isRecorded ? 'complete' : 'pending',
                },
              ]}
              statusLabels={{
                complete: 'Complete',
                active: 'In progress',
                pending: 'Not started',
                warning: 'Needs attention',
                failed: 'Failed',
              }}
            />
            <Button size="compact" variant="quiet" onPress={() => onOpen('checklist')}>
              Opening checklist
              <Icon name="arrow" />
            </Button>
          </div>
        </aside>
        <section className="system-review" aria-label={`${system.title} review`}>
          <div className="system-review-heading">
            <div>
              <span className="code">
                {system.code} / {system.location}
              </span>
              <h2>{system.title}</h2>
            </div>
            <StatusIndicator
              label={
                isRecorded
                  ? 'Review recorded'
                  : review.decision === 'hold'
                    ? 'On hold'
                    : 'Review in progress'
              }
              tone={isRecorded ? 'success' : review.decision === 'hold' ? 'warning' : 'neutral'}
            />
            {compact && (
              <Drawer
                title="System evidence"
                description={`${system.title} readings and supporting files.`}
                closeLabel="Close system evidence"
                placement="end"
                isOpen={evidenceOpen}
                onOpenChange={setEvidenceOpen}
                trigger={
                  <Button size="compact" variant="secondary">
                    Evidence
                    <Icon name="details" />
                  </Button>
                }
              >
                {evidence}
              </Drawer>
            )}
          </div>
          <div className="review-columns">
            <SplitView
              ariaLabel="Review and evidence"
              primaryLabel="Review form"
              secondaryLabel="Review evidence"
              resizeLabel="Resize review and evidence"
              defaultPrimarySize={58}
              minPrimarySize={50}
              maxPrimarySize={68}
              collapsedPane={compact ? 'secondary' : collapsed}
              onCollapsedPaneChange={setCollapsed}
              collapsePrimaryLabel="Hide review form"
              restorePrimaryLabel="Show review form"
              collapseSecondaryLabel="Hide review evidence"
              restoreSecondaryLabel="Show review evidence"
              primary={form}
              secondary={compact ? null : evidence}
            />
          </div>
          <footer className="review-actions">
            <span>
              {isRecorded
                ? 'This review has a document.'
                : `${review.checks.length} of ${system.checks.length} checkpoints complete`}
            </span>
            {isRecorded && currentRecord ? (
              <Button onPress={() => onOpen(currentRecord.id)}>
                Open review document
                <Icon name="arrow" />
              </Button>
            ) : (
              <Button onPress={record}>
                Create review document
                <Icon name="document" />
              </Button>
            )}
          </footer>
        </section>
      </div>
      <Dialog
        title="Record system review"
        description="Create a draft document with this decision, checkpoints, notes, and evidence filenames."
        closeLabel="Close review confirmation"
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        trigger={
          <span hidden>
            <Button>Review confirmation</Button>
          </span>
        }
        actions={({close}) => (
          <>
            <Button variant="quiet" onPress={close}>
              Keep reviewing
            </Button>
            <Button onPress={confirm}>Create document</Button>
          </>
        )}
      >
        <div className="review-confirmation">
          <h3>{system.title}</h3>
          <StatusIndicator
            label={review.decision === 'pass' ? 'Pass' : 'Hold'}
            tone={review.decision === 'pass' ? 'success' : 'warning'}
          />
          <p>
            {review.checks.length} of {system.checks.length} checkpoints completed.{' '}
            {review.evidence.length} evidence files listed.
          </p>
          <p>You can edit and save the resulting document before marking it ready for handover.</p>
        </div>
      </Dialog>
    </div>
  );
}
