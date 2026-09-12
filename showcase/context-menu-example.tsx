import {useState} from 'react';
import {ContextMenu} from '../src/index.js';

export function ContextMenuExample() {
  const [reviewed, setReviewed] = useState(false);
  return (
    <ContextMenu
      targetLabel="Boundary condition BC-12"
      items={[
        {id: 'review', label: 'Mark reviewed', type: 'action', onAction: () => setReviewed(true)},
        {id: 'reset', label: 'Reset review', type: 'action', onAction: () => setReviewed(false)},
      ]}
    >
      <div className="showcase-context-target">
        <strong>BC-12 · Insulated north wall</strong>
        <span role="status">{reviewed ? 'Reviewed' : 'Not reviewed'}</span>
      </div>
    </ContextMenu>
  );
}
