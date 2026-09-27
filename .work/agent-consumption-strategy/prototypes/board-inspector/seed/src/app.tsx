import {useRef, useState, type KeyboardEvent} from 'react';
import {AppearanceProvider, Button, Dialog, Switch} from '@trwhitney/component-library';
import '@trwhitney/component-library/styles.css';
import './styles.css';

type Piece = {id: string; label: string; square: number};
const initialPieces: Piece[] = [
  {id: 'scout', label: 'Scout', square: 0},
  {id: 'tower', label: 'Tower', square: 5},
];

export function App() {
  const [pieces, setPieces] = useState(initialPieces);
  const [selectedId, setSelectedId] = useState('scout');
  const [showMoves, setShowMoves] = useState(true);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const resetRef = useRef<HTMLButtonElement>(null);
  const selected = pieces.find((piece) => piece.id === selectedId);
  const occupied = (square: number) => pieces.find((piece) => piece.square === square);
  const legal = (square: number) =>
    !!selected &&
    !occupied(square) &&
    Math.abs((square % 4) - (selected.square % 4)) +
      Math.abs(Math.floor(square / 4) - Math.floor(selected.square / 4)) ===
      1;

  function activate(square: number) {
    const piece = occupied(square);
    if (piece) {
      setSelectedId(piece.id);
      return;
    }
    if (legal(square))
      setPieces((current) =>
        current.map((piece) => (piece.id === selectedId ? {...piece, square} : piece)),
      );
  }
  function navigate(event: KeyboardEvent, index: number) {
    const step = {ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4}[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const next = index + step;
    if (
      next >= 0 &&
      next < 16 &&
      (Math.abs(step) === 4 || Math.floor(next / 4) === Math.floor(index / 4))
    )
      cells.current[next]?.focus();
  }
  function reset() {
    setPieces(initialPieces);
    setSelectedId('scout');
  }

  return (
    <AppearanceProvider appearance="light" accent="#375950">
      <main className="page" data-probe="game">
        <header>
          <p className="eyebrow">BOARD STUDY</p>
          <h1>Piece movement sandbox</h1>
          <p>
            Select a piece, then activate an adjacent empty square to move it. Arrow keys move board
            focus.
          </p>
        </header>
        <div className="custom-layout">
          <div className="board" role="group" aria-label="Game board" data-probe="board">
            {Array.from({length: 16}, (_, square) => {
              const piece = occupied(square);
              return (
                <button
                  key={square}
                  ref={(node) => {
                    cells.current[square] = node;
                  }}
                  className="board-cell"
                  aria-label={`Square ${square + 1}, ${piece?.label ?? 'empty'}`}
                  data-legal={(showMoves && legal(square)) || undefined}
                  data-selected={piece?.id === selectedId || undefined}
                  onClick={() => activate(square)}
                  onKeyDown={(event) => navigate(event, square)}
                >
                  <span className="square-number" aria-hidden="true">
                    {square + 1}
                  </span>
                  {piece ? (
                    <>
                      <span aria-hidden="true" className="piece-mark">
                        {piece.id === 'scout' ? '●' : '◆'}
                      </span>
                      <span className="piece-label">{piece.label}</span>
                    </>
                  ) : null}
                </button>
              );
            })}
          </div>
          <section className="game-controls" data-probe="game-controls" aria-label="Game controls">
            <Switch
              label="Show legal moves"
              isSelected={showMoves}
              onChange={setShowMoves}
              reserveSupportSpace={false}
            />
            <button className="reset-button" ref={resetRef} onClick={reset}>
              Reset board
            </button>
            <Dialog
              title="Movement rules"
              description="This board uses consumer-defined movement rules."
              closeLabel="Close rules"
              trigger={<Button>Read rules</Button>}
            >
              <p>
                Choose an occupied square to select its piece. Choose an adjacent empty square to
                move it. Arrow keys move focus without moving a piece.
              </p>
            </Dialog>
            <p role="status">
              Selected: {selected?.label ?? 'none'}. Pieces: {pieces.length}.
            </p>
          </section>
        </div>
      </main>
    </AppearanceProvider>
  );
}
