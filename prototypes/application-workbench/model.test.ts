import {describe, expect, it} from 'vitest';
import {
  changeDocument,
  finishSave,
  markReady,
  packetMarkdown,
  snapshot,
  type WorkDocument,
} from './model.js';
const draft: WorkDocument = {
  id: 'brief',
  code: 'NS-01',
  title: 'Brief',
  summary: 'Scope',
  owner: 'Alex',
  value: '# Brief\n\nOriginal',
  saved: '',
  ready: false,
};
describe('document handover', () => {
  it('keeps edits made after a save started unsaved', () => {
    const pending = snapshot(draft);
    const edited = changeDocument(draft, {value: '# Brief\n\nRevised'});
    const result = finishSave(edited, pending);
    expect(result.value).toContain('Revised');
    expect(result.saved).toBe(pending);
    expect(snapshot(result)).not.toBe(result.saved);
  });
  it('requires a named nonempty saved document before it can be ready', () => {
    expect(markReady(draft).ready).toBe(false);
    const saved = finishSave(draft, snapshot(draft));
    expect(markReady(saved).ready).toBe(true);
    expect(
      markReady(finishSave({...draft, value: ''}, snapshot({...draft, value: ''}))).ready,
    ).toBe(false);
  });
  it('returns an edited ready document to draft and excludes it from export', () => {
    const ready = markReady(finishSave(draft, snapshot(draft)));
    const changed = changeDocument(ready, {summary: 'New scope'});
    expect(changed.ready).toBe(false);
    expect(packetMarkdown([ready])).toContain('Original');
    expect(packetMarkdown([changed])).not.toContain('Original');
  });
});
