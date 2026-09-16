import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Take ownership of scroll position: the browser's late scroll-restoration
// would otherwise override our hash deep-link landing below.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
