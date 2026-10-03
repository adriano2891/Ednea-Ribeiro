// Ensure window.fetch is writable and cannot cause "Cannot set property fetch of #<Window> which has only a getter"
try {
  let _fetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    get() {
      return _fetch;
    },
    set(newFetch) {
      _fetch = newFetch;
    },
    configurable: true,
    enumerable: true
  });
} catch (_) {}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
