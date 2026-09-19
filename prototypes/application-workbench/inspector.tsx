import {
  Button,
  Disclosure,
  LineChart,
  Select,
  StatusIndicator,
  TextArea,
  TextField,
} from '@trwhitney/component-library';
import {observations} from './data.js';
import {canReady, snapshot, type WorkDocument} from './model.js';
import {Icon} from './icons.js';
export function Inspector({
  doc,
  documents,
  onChange,
  onReady,
  onChoose,
  onHeading,
}: {
  doc: WorkDocument;
  documents: WorkDocument[];
  onChange: (patch: Partial<WorkDocument>) => void;
  onReady: () => void;
  onChoose: (id: string) => void;
  onHeading: (index: number) => void;
}) {
  const headings = [...doc.value.matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) => match[1]!);
  const links = documents.filter(
    (item) => item.id !== doc.id && doc.value.includes(`[[${item.title}]]`),
  );
  return (
    <div className="inspector-content">
      <div className="inspector-heading">
        <Icon name="details" />
        <h2>Document details</h2>
        <span className="code">{doc.code}</span>
      </div>
      <section className="readiness">
        <StatusIndicator
          label={doc.ready ? 'Ready for handover' : 'Draft'}
          tone={doc.ready ? 'success' : 'neutral'}
        />
        <p>
          {doc.ready
            ? 'This saved version is included in the packet.'
            : snapshot(doc) !== doc.saved
              ? 'Save your changes before marking this document ready.'
              : !doc.value.trim()
                ? 'Add document content before marking it ready.'
                : 'Review the document, then include it in the handover packet.'}
        </p>
        <Button
          size="compact"
          variant="secondary"
          isDisabled={!doc.ready && !canReady(doc)}
          onPress={onReady}
        >
          {doc.ready ? 'Return to draft' : 'Mark ready'}
          <Icon name={doc.ready ? 'undo' : 'check'} />
        </Button>
      </section>
      <div className="detail-fields">
        <div data-focus-key="title">
          <TextField
            label="Document title"
            value={doc.title}
            onChange={(title) => onChange({title})}
            reserveSupportSpace={false}
            isRequired
          />
        </div>
        <div data-focus-key="owner">
          <Select
            label="Document owner"
            value={doc.owner}
            onChange={(owner) => {
              if (owner) onChange({owner});
            }}
            reserveSupportSpace={false}
            emptyMessage="No owners"
            options={['Alex Morgan', 'Sam Rivera', 'Jamie Chen'].map((value) => ({
              value,
              label: value,
            }))}
          />
        </div>
        <div data-focus-key="summary">
          <TextArea
            label="Summary"
            value={doc.summary}
            onChange={(summary) => onChange({summary})}
            reserveSupportSpace={false}
          />
        </div>
      </div>
      <Disclosure title={`Outline · ${headings.length}`} headingLevel={3} defaultExpanded>
        <div className="outline">
          {headings.length ? (
            headings.map((heading, index) => (
              <Button
                key={`${index}-${heading}`}
                variant="quiet"
                size="compact"
                onPress={() => onHeading(index)}
              >
                <span className="code">{String(index + 1).padStart(2, '0')}</span>
                {heading}
              </Button>
            ))
          ) : (
            <p>Add a heading to give this document an outline.</p>
          )}
        </div>
      </Disclosure>
      <Disclosure title={`Linked documents · ${links.length}`} headingLevel={3} defaultExpanded>
        <div className="linked-documents">
          {links.length ? (
            links.map((item) => (
              <Button
                key={item.id}
                variant="quiet"
                size="compact"
                onPress={() => onChoose(item.id)}
              >
                <Icon name="document" />
                {item.title}
                <Icon name="arrow" />
              </Button>
            ))
          ) : (
            <p>Type [[Document title]] in the editor to link another document.</p>
          )}
        </div>
      </Disclosure>
      {doc.id === 'commissioning' && (
        <Disclosure title="Commissioning readings" headingLevel={3} defaultExpanded>
          <div className="reference-chart">
            <LineChart
              overflow="scroll"
              emptyState={{
                title: 'No readings',
                description: 'Commissioning readings will appear here.',
              }}
              invalidData={{
                title: 'Readings unavailable',
                description: 'Check the commissioning measurements.',
              }}
              data={observations}
              title="Control-room temperature"
              description="September 2026 · Peak occupied reading"
              dataTableLabel="Commissioning measurements"
              aspectRatio={1.1}
              minimumSize={{width: 200, height: 180}}
              series={[
                {
                  id: 'temperature',
                  label: 'Peak temperature',
                  accessor: 'temperature',
                  showPoints: true,
                },
              ]}
              xAxis={{
                accessor: 'visit',
                label: 'Visit',
                scale: {type: 'categorical'},
                tickCount: 3,
              }}
              yAxis={{
                label: 'Temperature',
                unit: '°C',
                scale: {type: 'linear', domain: [20, 32]},
                tickCount: 4,
              }}
              annotations={[
                {kind: 'line', axis: 'y', value: 25, label: 'Operating target', tone: 'success'},
              ]}
            />
          </div>
        </Disclosure>
      )}
    </div>
  );
}
