import {createRoot} from 'react-dom/client';
import {NativePreferences} from './native';
import {LibraryPreferences} from './library';
import {BoardProbe} from './board';
import {StyleProbe} from './style-probe';
import '@trwhitney/component-library/styles.css';
import './styles.css';

const params = new URLSearchParams(location.search);
const variant = params.get('variant') ?? 'native';
if (params.has('identify')) document.documentElement.dataset.identify = '';
createRoot(document.getElementById('root')!).render(
  params.has('board') ? (
    <BoardProbe />
  ) : params.has('style') ? (
    <StyleProbe kind={variant} />
  ) : variant === 'native' ? (
    <NativePreferences />
  ) : (
    <LibraryPreferences />
  ),
);
