import {describe, it, expect} from 'vitest';
import {reviewProblems, reviewMarkdown, type ReviewDraft} from './review-model.js';
const review: ReviewDraft = {
  date: {year: 2026, month: 9, day: 24},
  checks: ['sensor'],
  decision: 'pass',
  notes: '',
  evidence: [],
};
describe('commissioning review', () => {
  it('prevents a pass when required checks remain incomplete', () => {
    expect(reviewProblems(review, ['sensor', 'occupied'])).not.toEqual([]);
  });
  it('requires a date, decision, and a reason for holding a system', () => {
    expect(reviewProblems({...review, date: null, decision: null}, [])).toHaveLength(2);
    expect(reviewProblems({...review, decision: 'hold'}, ['sensor', 'occupied'])).not.toEqual([]);
    expect(
      reviewProblems({...review, decision: 'hold', notes: 'Repeat the occupied test.'}, [
        'sensor',
        'occupied',
      ]),
    ).toEqual([]);
  });
  it('records unchecked items and evidence filenames in a held review', () => {
    const value = reviewMarkdown(
      'Ventilation',
      [
        {value: 'sensor', label: 'Sensor calibrated'},
        {value: 'occupied', label: 'Occupied test'},
      ],
      {...review, decision: 'hold', notes: 'Repeat the occupied test.', evidence: ['reading.csv']},
    );
    expect(value).toContain('- [x] Sensor calibrated');
    expect(value).toContain('- [ ] Occupied test');
    expect(value).toContain('Hold');
    expect(value).toContain('2026-09-24');
    expect(value).toContain('reading.csv');
  });
});
