import {useState, type FormEvent, type ReactNode} from 'react';

export const defaults = {email: 'alex@example.test', frequency: 'weekly'};
export const options = [
  {value: 'daily', label: 'Daily'},
  {value: 'weekly', label: 'Weekly'},
  {value: 'never', label: 'Never'},
] as const;

// Shared consumer-owned state and page composition, not a proposed library export.
export function usePreferences() {
  const [desktop, setDesktop] = useState(true);
  const [saved, setSaved] = useState(defaults);
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setSaved({email: String(values.get('email')), frequency: String(values.get('frequency'))});
  }
  return {desktop, setDesktop, saved, save};
}

export function Frame({
  children,
  saved,
  desktop,
}: {
  children: ReactNode;
  saved: typeof defaults;
  desktop: boolean;
}) {
  return (
    <main className="page" data-probe="page">
      <header>
        <p className="eyebrow">PERSONAL SETTINGS</p>
        <h1>Notification preferences</h1>
        <p>Choose which updates you receive.</p>
      </header>
      <div className="custom-layout">
        <section className="editor" aria-label="Edit preferences" data-probe="editor">
          {children}
        </section>
        <aside className="summary" aria-label="Saved preferences" data-probe="summary">
          <h2>Saved digest</h2>
          <dl>
            <dt>Recipient</dt>
            <dd>{saved.email}</dd>
            <dt>Frequency</dt>
            <dd>{saved.frequency}</dd>
          </dl>
          <p role="status">Desktop alerts are {desktop ? 'on' : 'off'}.</p>
        </aside>
      </div>
    </main>
  );
}
