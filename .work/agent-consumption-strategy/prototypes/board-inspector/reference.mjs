// Reference consumer comparison. Only focus/trigger integration differs between variants.
import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {format} from 'prettier';
const root = process.argv[2];
if (!root) throw new Error('Pass the prepared comparison directory.');
const seed = await readFile(resolve(import.meta.dirname, 'seed/src/app.tsx'), 'utf8');
for (const condition of ['current', 'experimental']) {
  let source = seed.replace("  {id: 'tower', label: 'Tower', square: 5},\n", '');
  if (condition === 'current')
    source = source.replace('import {useRef,', 'import {useCallback, useRef,');
  source = source.replace(
    '  const selected = pieces.find',
    `  const [isOpen, setOpen] = useState(false);
  const [inspectingId, setInspectingId] = useState('scout');
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const inspected = pieces.find(piece => piece.id === inspectingId);
${
  condition === 'current'
    ? `  // Current API has no return-focus target. Restore after the form leaves the modal.
  const restoreOnDetach = useCallback((node: HTMLFormElement | null) => {
    if (!node) queueMicrotask(() => returnFocusRef.current?.focus({preventScroll: true}));
  }, []);
`
    : ''
}  const selected = pieces.find`,
  );
  source = source.replace(
    '      setSelectedId(piece.id);\n      return;',
    `      setSelectedId(piece.id);
      setInspectingId(piece.id);
      returnFocusRef.current = cells.current[square];
      setOpen(true);
      return;`,
  );
  const dialog = `
      <Dialog title={inspected ? 'Inspect ' + inspected.label : 'Piece inspector'} description="Edit the selected piece or change its position." closeLabel="Close inspector" isOpen={isOpen} onOpenChange={setOpen}
        ${condition === 'current' ? 'trigger={<span hidden><Button>Inspector trigger</Button></span>}' : 'returnFocusRef={returnFocusRef}'}>
        <form className="inspector-form" ${condition === 'current' ? 'ref={restoreOnDetach}' : ''} onSubmit={event => {
          event.preventDefault();
          const label = String(new FormData(event.currentTarget).get('piece-name')).trim();
          if (!label) return;
          setPieces(current => current.map(piece => piece.id === inspectingId ? {...piece, label} : piece));
          setOpen(false);
        }}>
          <label>Piece name<input name="piece-name" required defaultValue={inspected?.label ?? ''}/></label>
          <div className="inspector-actions">
            <button type="submit">Save</button><button type="button" onClick={() => setOpen(false)}>Cancel</button>
            <button type="button" onClick={() => {
              if (!inspected) return;
              const next = Array.from({length: 15}, (_, step) => (inspected.square + step + 1) % 16).find(square => !occupied(square));
              if (next === undefined) return;
              returnFocusRef.current = cells.current[next];
              setPieces(current => current.map(piece => piece.id === inspectingId ? {...piece, square: next} : piece));
              setOpen(false);
            }}>Move to next empty square</button>
            <button type="button" onClick={() => {
              returnFocusRef.current = resetRef.current;
              setPieces(current => current.filter(piece => piece.id !== inspectingId));
              setOpen(false);
            }}>Remove piece</button>
          </div>
        </form>
      </Dialog>
`;
  source = source.replace('    </main>', dialog + '    </main>');
  if (!source.includes('name="piece-name"')) throw new Error('Seed markup replacement failed');
  await writeFile(
    resolve(root, `${condition}-reference/src/app.tsx`),
    await format(source, {
      parser: 'typescript',
      singleQuote: true,
      bracketSpacing: false,
      printWidth: 96,
    }),
  );
}
