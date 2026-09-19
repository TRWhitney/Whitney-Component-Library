import {snapshot, type WorkDocument} from './model.js';
const records = [
  {
    id: 'brief',
    code: 'NS-01',
    title: 'Handover brief',
    owner: 'Alex Morgan',
    summary: 'The scope, decisions, and next steps for the renewed Northstar observatory.',
    ready: false,
    value: `# Handover brief

The Northstar observatory reopens on **28 September** after a six-month renewal. This packet brings the operations team up to speed on the spaces, equipment, and decisions that matter on opening night.

## What is changing

The west dome has a new drive assembly. The visitor gallery now has a step-free route, and the control room has moved beside the instrument bench.

- **Operations** takes ownership of the dome and control room.
- **Visitor services** leads the first public evening.
- **Facilities** completes the remaining weatherproofing checks.

## Before opening night

- [x] Complete the instrument alignment survey
- [x] Walk the accessible visitor route
- [ ] Confirm the overnight duty roster
- [ ] Sign off the final ventilation readings

## Decisions to carry forward

Keep the first two public sessions to **24 visitors**. Increase capacity only after the operations team has reviewed the arrival and departure flow.

> Leave the west stair closed until the handrail inspection is complete. The gallery lift remains the primary visitor route.

## Supporting documents

Read [[Commissioning notes]] for the recent ventilation measurements and [[Opening checklist]] for the night-by-night sequence.

## Next handover

Alex will walk the incoming duty team through the control room on 24 September. Bring unresolved questions to that session.`,
  },
  {
    id: 'commissioning',
    code: 'NS-02',
    title: 'Commissioning notes',
    owner: 'Sam Rivera',
    summary: 'Ventilation and control-room observations from the September commissioning visits.',
    ready: true,
    value: `# Commissioning notes

The six commissioning visits showed a steady reduction in peak control-room temperature after the new ventilation settings were applied.

## Observations

| Visit | Peak temperature | Notes |
| --- | --- | --- |
| 01 Sep | 29.4 °C | Baseline, doors closed |
| 03 Sep | 28.1 °C | Intake adjusted |
| 05 Sep | 26.8 °C | Night purge enabled |
| 07 Sep | 25.2 °C | New fan curve |
| 09 Sep | 24.6 °C | Occupied test |
| 11 Sep | 24.1 °C | Final repeat |

## Acceptance

The final two visits remained below the **25 °C** operating target. Repeat the occupied test during the first public session.

The inspector includes the same observations as an interactive chart. Use it to compare the commissioning visits.

## Follow-up

Record the opening-night reading in [[Opening checklist]].`,
  },
  {
    id: 'checklist',
    code: 'NS-03',
    title: 'Opening checklist',
    owner: 'Jamie Chen',
    summary: 'A repeatable sequence for the first two public sessions.',
    ready: false,
    value: `# Opening checklist

## Before visitors arrive

- [ ] Walk the visitor route and test the gallery lift
- [ ] Check the west stair barrier
- [ ] Read control-room temperature
- [ ] Confirm the duty roster

## During the session

Keep the gallery group together. The duty astronomer should stay at the instrument bench while visitor services handles arrivals.

## At close

- [ ] Park the telescope and close the dome
- [ ] Record visitor numbers and any delays
- [ ] Leave a note for the next duty team

See [[Handover brief]] for the opening capacity decision.`,
  },
  {
    id: 'contacts',
    code: 'NS-04',
    title: 'Team contacts',
    owner: 'Alex Morgan',
    summary: 'Who owns each part of opening night.',
    ready: true,
    value: `# Team contacts

| Area | Lead | Location |
| --- | --- | --- |
| Operations | Alex Morgan | Control room |
| Visitor services | Jamie Chen | Gallery entrance |
| Facilities | Sam Rivera | Instrument bench |

## Escalation

Take equipment faults to the duty astronomer first. Visitor access questions go to the gallery lead. Record outstanding issues in [[Opening checklist]].`,
  },
];
export const initialDocuments: WorkDocument[] = records.map((record) => {
  const doc = {...record, saved: ''};
  return {...doc, saved: snapshot(doc)};
});
export const observations = [
  {visit: '01 Sep', temperature: 29.4},
  {visit: '03 Sep', temperature: 28.1},
  {visit: '05 Sep', temperature: 26.8},
  {visit: '07 Sep', temperature: 25.2},
  {visit: '09 Sep', temperature: 24.6},
  {visit: '11 Sep', temperature: 24.1},
];
