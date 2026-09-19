export interface ReviewDraft {
  date: {year: number; month: number; day: number} | null;
  checks: string[];
  decision: 'pass' | 'hold' | null;
  notes: string;
  evidence: string[];
}
export function reviewProblems(review: ReviewDraft, requiredChecks: readonly string[]): string[] {
  const problems: string[] = [];
  if (!review.date) problems.push('Choose a review date.');
  if (!review.decision) problems.push('Choose Pass or Hold.');
  if (review.decision === 'pass' && requiredChecks.some((check) => !review.checks.includes(check)))
    problems.push('Complete every checkpoint before recording a pass.');
  if (review.decision === 'hold' && !review.notes.trim())
    problems.push('Explain what needs to happen before this system can pass.');
  return problems;
}
export function reviewMarkdown(
  title: string,
  checkLabels: readonly {value: string; label: string}[],
  review: ReviewDraft,
): string {
  const date = review.date
    ? `${review.date.year}-${String(review.date.month).padStart(2, '0')}-${String(review.date.day).padStart(2, '0')}`
    : 'Not recorded';
  return `# ${title} review\n\nReview date: ${date}\n\nDecision: **${review.decision === 'pass' ? 'Pass' : 'Hold'}**\n\n## Checkpoints\n\n${checkLabels.map((check) => `- [${review.checks.includes(check.value) ? 'x' : ' '}] ${check.label}`).join('\n')}\n\n## Review notes\n\n${review.notes.trim() || 'All checkpoints completed. No further action recorded.'}\n\n## Evidence\n\n${review.evidence.length ? review.evidence.map((name) => `- ${name}`).join('\n') + '\n\nEvidence filenames are recorded here. Original files remain in the review session.' : 'No supporting files attached.'}\n\nSee [[Commissioning notes]] and [[Opening checklist]] for the handover context.`;
}
export const systems = [
  {
    id: 'ventilation',
    code: 'SYS-01',
    title: 'Ventilation',
    location: 'Control room',
    owner: 'Sam Rivera',
    reading: 24.1,
    maximum: 35,
    unit: '°C',
    target: 25,
    readingLabel: 'Peak occupied temperature',
    hint: 'The latest visit is below the 25 °C operating target. Confirm the occupied test and sensor calibration before sign-off.',
    checks: [
      {value: 'sensor', label: 'Temperature sensor calibrated'},
      {value: 'occupied', label: 'Occupied test completed'},
      {value: 'purge', label: 'Night purge schedule verified'},
    ],
  },
  {
    id: 'access',
    code: 'SYS-02',
    title: 'Visitor access',
    location: 'Gallery & west stair',
    owner: 'Jamie Chen',
    reading: 2,
    maximum: 3,
    unit: 'of 3',
    target: 3,
    readingLabel: 'Access routes inspected',
    hint: 'The gallery route and lift are ready. The west stair stays closed until its handrail inspection is complete.',
    checks: [
      {value: 'lift', label: 'Gallery lift tested'},
      {value: 'route', label: 'Step-free route walked'},
      {value: 'handrail', label: 'West stair handrail signed off'},
    ],
  },
  {
    id: 'dome',
    code: 'SYS-03',
    title: 'Dome drive',
    location: 'West dome',
    owner: 'Alex Morgan',
    reading: 0.4,
    maximum: 2,
    unit: 'arcmin',
    target: 1,
    readingLabel: 'Pointing repeatability',
    hint: 'The new drive assembly repeats within the one-arcminute tolerance. Verify parking and emergency-stop behavior before the first public session.',
    checks: [
      {value: 'alignment', label: 'Instrument alignment verified'},
      {value: 'park', label: 'Park and close cycle completed'},
      {value: 'stop', label: 'Emergency stop tested'},
    ],
  },
] as const;
export type SystemId = (typeof systems)[number]['id'];
export function initialReviews(): Record<SystemId, ReviewDraft> {
  return {
    ventilation: {
      date: {year: 2026, month: 9, day: 24},
      checks: ['sensor'],
      decision: null,
      notes: '',
      evidence: [],
    },
    access: {
      date: {year: 2026, month: 9, day: 24},
      checks: ['lift', 'route'],
      decision: 'hold',
      notes: 'The west stair handrail inspection is still outstanding. Keep the barrier in place.',
      evidence: [],
    },
    dome: {
      date: {year: 2026, month: 9, day: 24},
      checks: [],
      decision: null,
      notes: '',
      evidence: [],
    },
  };
}
