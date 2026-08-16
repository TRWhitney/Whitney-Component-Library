import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {Showcase} from './showcase.js';
import '../src/styles.css';
import './styles.css';

const root = document.querySelector('#root');

if (!root) throw new Error('The showcase root element is missing.');

createRoot(root).render(
  <StrictMode>
    <Showcase />
  </StrictMode>,
);
