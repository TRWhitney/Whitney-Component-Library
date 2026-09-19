export interface WorkDocument {
  id: string;
  code: string;
  title: string;
  summary: string;
  owner: string;
  value: string;
  saved: string;
  ready: boolean;
}
export function snapshot(doc: WorkDocument) {
  return JSON.stringify([doc.title, doc.summary, doc.owner, doc.value]);
}
export function changeDocument(doc: WorkDocument, patch: Partial<WorkDocument>): WorkDocument {
  const next = {...doc, ...patch};
  return {...next, ready: snapshot(next) === snapshot(doc) && doc.ready};
}
export function finishSave(doc: WorkDocument, saved: string): WorkDocument {
  return {...doc, saved};
}
export function canReady(doc: WorkDocument) {
  return Boolean(doc.title.trim() && doc.value.trim() && snapshot(doc) === doc.saved);
}
export function markReady(doc: WorkDocument): WorkDocument {
  return {...doc, ready: canReady(doc)};
}
export function packetMarkdown(docs: WorkDocument[]) {
  return (
    '# Northstar observatory\n\nProject handover · September 2026\n\n' +
    docs
      .filter((doc) => doc.ready && canReady(doc))
      .map((doc) => `<!-- ${doc.code} · ${doc.owner} -->\n\n${doc.value}`)
      .join('\n\n---\n\n')
  );
}
