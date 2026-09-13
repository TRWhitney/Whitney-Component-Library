const paths = {
  bold: 'M5 3h5a3.5 3.5 0 0 1 0 7H5m5 0a3.5 3.5 0 0 1 0 7H5V3',
};

export function MarkdownIcon({name}: {readonly name: keyof typeof paths}) {
  return (
    <svg aria-hidden="true" focusable="false" className="showcase-icon" viewBox="0 0 20 20">
      <path d={paths[name]} />
    </svg>
  );
}
