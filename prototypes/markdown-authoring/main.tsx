import {createRoot} from 'react-dom/client';
import '@trwhitney/component-library/styles.css';
import {App} from './app.js';
import './styles.css';

createRoot(document.getElementById('root')!).render(<App />);
