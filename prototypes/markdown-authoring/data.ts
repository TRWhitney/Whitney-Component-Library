export interface Attachment {
  id: string;
  name: string;
  file: File;
}
export interface DocumentRecord {
  id: string;
  title: string;
  summary: string;
  stage: 'Draft' | 'In review' | 'Approved';
  value: string;
  saved: string;
  access: 'editable' | 'read-only' | 'locked';
  attachments: Attachment[];
}
export function snapshot(
  doc: Pick<DocumentRecord, 'title' | 'summary' | 'stage' | 'value' | 'attachments'>,
) {
  return JSON.stringify([
    doc.title,
    doc.summary,
    doc.stage,
    doc.value,
    doc.attachments.map((a) => a.id),
  ]);
}
const brief = `# A quieter arrival

The north entrance should feel like the beginning of the visit, not another place to queue. This brief brings together the decisions for the **Riverside reading room**.

## What we are making

A sheltered entrance, a place to pause, and a clear view through to the reading room. Keep the existing brickwork and let the new timber canopy sit lightly against it.

> A good threshold gives people time to arrive.

## Before the next review

- [x] Walk the approach at opening time
- [ ] Check the canopy dimensions against [[Site observations]]
- [ ] Share the revised material palette

## Material decisions

| Element | Direction | Status |
| --- | --- | --- |
| Canopy | Oiled timber | In review |
| Entry floor | Reclaimed stone | Approved |
| Signage | Painted metal | Draft |

Keep %%rgba(56, 132, 213, 1) the entrance accessible throughout construction%%. Delivery access is documented in [[Review agenda]].

## Notes

The afternoon light reaches the east wall at approximately 3 pm.[^light]

[^light]: Observed during the September site visit. Recheck after the canopy mock-up is installed.
`;
const observations = `# Site observations

## North entrance

The existing opening is **2.4 metres wide**. Keep a clear route of at least 1.5 metres while the mock-up is in place.

- Morning: light from the courtyard
- Afternoon: reflected light along the east wall
- Deliveries: use the service gate before 9 am

## Measurements to confirm

- [ ] Underside of the existing lintel
- [ ] Drainage fall at the threshold
- [ ] Door swing against the new bench

Return to [[Arrival brief]] for the design direction.

\`\`\`text
COURTYARD → SHELTER → THRESHOLD → READING ROOM
\`\`\`
`;
const agenda = `# Review agenda

**Thursday, 10:00** · Riverside studio

## Decisions needed

1. Agree the canopy depth.
2. Review the material sample against the existing brickwork.
3. Confirm delivery access during construction.

Read [[Arrival brief]] before the meeting. Add unresolved measurements to [[Site observations]].

## Outcome

Leave space here for the decisions and their owners.
`;
export function initialDocuments(): DocumentRecord[] {
  return [
    {
      id: 'arrival',
      title: 'Arrival brief',
      summary: 'Design direction for the Riverside reading room entrance.',
      stage: 'In review' as const,
      value: brief,
      access: 'editable' as const,
    },
    {
      id: 'site',
      title: 'Site observations',
      summary: 'Measurements and observations from the September walk-through.',
      stage: 'Draft' as const,
      value: observations,
      access: 'editable' as const,
    },
    {
      id: 'review',
      title: 'Review agenda',
      summary: 'Decisions for the next design review.',
      stage: 'Draft' as const,
      value: agenda,
      access: 'editable' as const,
    },
    {
      id: 'archive',
      title: 'Original scope',
      summary: 'Approved reference. Kept read-only for the project team.',
      stage: 'Approved' as const,
      value:
        '# Original scope\n\nImprove the arrival experience while retaining the building’s existing character.\n\nThe work includes the entrance canopy, signage, and threshold. The reading room interior remains outside this phase.',
      access: 'read-only' as const,
    },
  ].map((doc) => ({...doc, attachments: [], saved: snapshot({...doc, attachments: []})}));
}
