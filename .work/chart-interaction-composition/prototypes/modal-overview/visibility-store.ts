// Prototype bridge: production eye controls and the viewport share visibility state.
import {useSyncExternalStore} from 'react';
type Hidden = {
  bar: readonly string[];
  box: readonly string[];
  heatmap: {rows: readonly string[]; columns: readonly string[]};
};
let state: Hidden = {bar: [], box: [], heatmap: {rows: [], columns: []}};
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
export const getVisibility = () => state;
export function useVisibilitySnapshot() {
  return useSyncExternalStore(subscribe, getVisibility, getVisibility);
}
export function useStudyVisibility<Key extends keyof Hidden>(key: Key) {
  const snapshot = useVisibilitySnapshot();
  const set = (value: Hidden[Key] | ((previous: Hidden[Key]) => Hidden[Key])) => {
    const next = typeof value === 'function' ? value(state[key]) : value;
    if (JSON.stringify(next) === JSON.stringify(state[key])) return;
    state = {...state, [key]: next};
    queueMicrotask(() => listeners.forEach((fn) => fn()));
  };
  return [snapshot[key], set] as const;
}
