import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// MSW Setup (dev-only; commented out to avoid bundle error - use constants.js mocks instead)
if (import.meta.env.DEV) {
  // (async () => {
  //   try {
  //     const { worker } from 'msw/browser';  // Use browser for client-side
  //     const { handlers } = await import('./mocks/handlers.js');
  //     await worker.start({ onUnhandledRequest: 'bypass', serviceWorker: { url: '/mockServiceWorker.js' } });
  //   } catch (error) {
  //     console.warn('MSW setup failed (dev mode):', error);
  //   }
  // })();
  console.log('MSW disabled - using constants.js mocks for dev');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);