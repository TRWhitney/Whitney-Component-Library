import {createElement} from 'react';
import {createRoot} from 'react-dom/client';
const kind = new URLSearchParams(location.search).get('chart') || 'line';
const {default: App} = ['scatter', 'bubble'].includes(kind)
  ? await import('./points.js')
  : ['histogram', 'box', 'bar', 'heatmap'].includes(kind)
    ? await import('./remaining.js')
    : await import('./monthly.js');
createRoot(document.getElementById('root')!).render(createElement(App));
