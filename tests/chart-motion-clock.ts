import {act} from '@testing-library/react';
import {vi} from 'vitest';

export function chartMotionClock() {
  let now = 0;
  let handle = 0;
  const frames = new Map<number, FrameRequestCallback>();
  const listeners = new Set<() => void>();
  const media = {
    matches: false,
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
  };
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++handle, callback);
    return handle;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
  vi.stubGlobal('matchMedia', () => media);
  return {
    advance(time: number) {
      act(() => {
        now = time;
        const callbacks = [...frames.values()];
        frames.clear();
        callbacks.forEach((callback) => callback(now));
      });
    },
    reduce() {
      act(() => {
        media.matches = true;
        listeners.forEach((listener) => listener());
      });
    },
    pending: () => frames.size,
  };
}
