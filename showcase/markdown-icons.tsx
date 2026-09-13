const paths = {
  bold: 'M5 3h5a3.5 3.5 0 0 1 0 7H5m5 0a3.5 3.5 0 0 1 0 7H5V3',
  italic: 'M9 3h7M4 17h7M12 3 8 17',
  strikethrough: 'M15 5c-1-3-9-3-9 1 0 2 2 3 4 4m-5 5c1 3 10 3 10-1 0-2-2-3-4-4M3 10h14',
  'inline-code': 'm7 5-5 5 5 5m6-10 5 5-5 5',
  'heading-2': 'M3 4v12M11 4v12M3 10h8m3 2a2 2 0 0 1 4 0c0 2-4 2-4 5h4',
  'bullet-list': 'M8 5h9M8 10h9M8 15h9M3 5h.1M3 10h.1M3 15h.1',
  'task-list': 'm2 5 2 2 3-4m-5 9 2 2 3-4M10 5h8M10 12h8',
  blockquote: 'M3 5h5v6c0 3-2 4-4 4m-1-4h5M12 5h5v6c0 3-2 4-4 4m-1-4h5',
  link: 'm8 12 4-4m-5 2-2 2a3.5 3.5 0 0 0 5 5l3-3m-6-8 3-3a3.5 3.5 0 0 1 5 5l-2 2',
  color: 'M5 13 10 3l5 10M7 9h6M3 17h14',
  undo: 'M7 3 3 7l4 4M3 7h8a5 5 0 0 1 0 10H8',
  redo: 'm13 3 4 4-4 4m4-4H9a5 5 0 0 0 0 10h3',
  open: 'M11 3h6v6m0-6-8 8m-2-7H3v13h13v-4',
  more: 'M4 10h.1M10 10h.1M16 10h.1',
};

export function MarkdownIcon({name}: {readonly name: keyof typeof paths}) {
  return (
    <svg aria-hidden="true" focusable="false" className="showcase-icon" viewBox="0 0 20 20">
      <path d={paths[name]} />
    </svg>
  );
}
