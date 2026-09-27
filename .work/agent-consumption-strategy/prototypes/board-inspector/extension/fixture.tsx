import {StrictMode, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Button, Dialog} from '@trwhitney/component-library';
import '@trwhitney/component-library/styles.css';

function Fixture() {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<number | null>(0);
  const returnFocusRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button id="opener" onClick={() => setOpen(true)}>
        Native opener
      </button>
      {target === null ? null : (
        <button key={target} id={`target-${target}`} ref={returnFocusRef}>
          Destination {target}
        </button>
      )}
      <Dialog
        title="Inspector"
        description="Experimental focus contract"
        closeLabel="Close inspector"
        isOpen={open}
        onOpenChange={setOpen}
        returnFocusRef={returnFocusRef}
      >
        <button
          onClick={() => {
            setTarget((value) => (value ?? 0) + 1);
            setOpen(false);
          }}
        >
          Move target and close
        </button>
        <button
          onClick={() => {
            setTarget(null);
            setOpen(false);
          }}
        >
          Remove target and close
        </button>
      </Dialog>
      <Dialog
        title="Existing dialog"
        description="Unmodified triggered path"
        closeLabel="Close existing"
        trigger={<Button>Existing trigger</Button>}
      >
        Existing content
      </Dialog>
    </>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Fixture />
  </StrictMode>,
);
