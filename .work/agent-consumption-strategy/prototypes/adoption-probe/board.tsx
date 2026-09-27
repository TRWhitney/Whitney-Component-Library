import {useRef, useState, type KeyboardEvent} from 'react';
import {AppearanceProvider, Button, Dialog, Switch} from '@trwhitney/component-library';

// Consumer-defined game rules and board. No board template or new library component.
export function BoardProbe() {
  const [position, setPosition] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [showMoves, setShowMoves] = useState(true);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const legal = (target: number) =>
    Math.abs((target % 4) - (position % 4)) +
      Math.abs(Math.floor(target / 4) - Math.floor(position / 4)) ===
    1;
  function move(target: number) {
    if (!legal(target)) return;
    setHistory([...history, position]);
    setPosition(target);
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
  return (
    <AppearanceProvider appearance="light" accent="#375950">
      <main className="page" data-probe="game">
        <h1>Movement sandbox</h1>
        <p>A consumer-defined four-by-four board. Move one square horizontally or vertically.</p>
        <div className="custom-layout">
          <div className="board" role="group" aria-label="Game board" data-probe="board">
            {Array.from({length: 16}, (_, index) => (
              <button
                key={index}
                ref={(node) => {
                  cells.current[index] = node;
                }}
                className="board-cell"
                aria-label={`Square ${index + 1}${position === index ? ', occupied' : ''}`}
                data-legal={(showMoves && legal(index)) || undefined}
                onClick={() => move(index)}
                onKeyDown={(event) => navigate(event, index)}
              >
                {position === index ? '●' : showMoves && legal(index) ? '·' : ''}
              </button>
            ))}
          </div>
          <section className="game-controls" data-probe="game-controls" aria-label="Game controls">
            <Switch
              label="Show legal moves"
              isSelected={showMoves}
              onChange={setShowMoves}
              reserveSupportSpace={false}
            />
            <Button
              isDisabled={!history.length}
              onPress={() => {
                setPosition(history[history.length - 1]!);
                setHistory(history.slice(0, -1));
              }}
            >
              Undo move
            </Button>
            <Button
              onPress={() => {
                setPosition(0);
                setHistory([]);
              }}
            >
              Reset board
            </Button>
            <Dialog
              title="Movement rules"
              description="This experiment defines its own game rules."
              closeLabel="Close rules"
              trigger={<Button>Read rules</Button>}
            >
              <p>
                Arrow keys move focus between squares. Enter or Space moves the piece to an adjacent
                square. Other destinations are ignored.
              </p>
            </Dialog>
            <p role="status">
              Piece on square {position + 1}. Moves: {history.length}.
            </p>
          </section>
        </div>
      </main>
    </AppearanceProvider>
  );
}
