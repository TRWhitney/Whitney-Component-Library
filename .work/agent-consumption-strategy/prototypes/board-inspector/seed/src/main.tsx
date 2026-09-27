import {createRoot} from 'react-dom/client';
import {App} from './app';
if (new URLSearchParams(location.search).has('identify'))
  document.documentElement.dataset.identify = '';
createRoot(document.getElementById('root')!).render(<App />);
