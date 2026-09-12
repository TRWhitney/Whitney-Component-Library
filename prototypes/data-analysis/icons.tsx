export type IconName =
  | 'investigate'
  | 'check'
  | 'pin'
  | 'unpin'
  | 'plus'
  | 'minus'
  | 'fit'
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'close'
  | 'settings'
  | 'filter'
  | 'export'
  | 'building';
const paths: Record<IconName, string> = {
  investigate: 'M9 4h6v3H9z M9 5H6v16h12V5h-3 M9 12h6 M9 16h4',
  check: 'm5 12 4 4L19 6',
  pin: 'm9 3 6 0-1 6 4 4H6l4-4z M12 13v8',
  unpin: 'm9 3 6 0-1 6 4 4H6l4-4z M12 13v8 M3 3l18 18',
  plus: 'M5 12h14 M12 5v14',
  minus: 'M5 12h14',
  fit: 'M4 9V4h5 M15 4h5v5 M20 15v5h-5 M9 20H4v-5',
  left: 'm14 5-7 7 7 7',
  right: 'm10 5 7 7-7 7',
  up: 'm5 14 7-7 7 7',
  down: 'm5 10 7 7 7-7',
  close: 'm6 6 12 12 M18 6 6 18',
  settings: 'M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M10 15v6',
  filter: 'M3 4h18l-7 8v7l-4 2v-9z',
  export: 'M12 3v12 m-5-5 5 5 5-5 M5 16v5h14v-5',
  building: 'M4 21V4h11v17 M15 10h5v11 M7 8h1 M11 8h1 M7 12h1 M11 12h1 M7 16h1 M11 16h1 M2 21h20',
};
export function Icon({name}: {name: IconName}) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}
