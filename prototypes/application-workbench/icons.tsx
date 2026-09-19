const paths = {
  document: 'M6 3h8l4 4v14H6z M14 3v5h4 M9 12h6 M9 16h6',
  folder: 'M3 7V5h6l2 2h10v13H3z',
  plus: 'M12 5v14 M5 12h14',
  save: 'M5 3h12l3 3v15H4V3z M8 3v6h8V3 M8 21v-8h8v8',
  more: 'M5 12h.01 M12 12h.01 M19 12h.01',
  details: 'M3 4h18v16H3z M15 4v16 M6 8h5 M6 12h5',
  search: 'M20 20l-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  check: 'M5 12l4 4L19 6',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  download: 'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5',
  undo: 'M8 5L3 10l5 5 M3 10h11a6 6 0 0 1 6 6',
  redo: 'M16 5l5 5-5 5 M21 10H10a6 6 0 0 0-6 6',
  link: 'M10 14l4-4 M8 16l-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0 M16 8l1-1a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0',
  list: 'M9 6h12 M9 12h12 M9 18h12 M3 6h1 M3 12h1 M3 18h1',
  settings: 'M4 7h16 M4 17h16 M8 4v6 M16 14v6',
  close: 'M6 6l12 12 M18 6L6 18',
  moon: 'M20 14A9 9 0 0 1 10 3a9 9 0 1 0 10 11',
  book: 'M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3z M12 6v16',
};
export type IconName = keyof typeof paths;
export function Icon({name}: {name: IconName}) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}
