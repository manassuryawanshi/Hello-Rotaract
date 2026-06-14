import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { syncFromSupabase } from './data/mockDb.js'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Service worker registered.', reg))
      .catch((err) => console.log('Service worker registration failed: ', err));
  });
}

const renderApp = async () => {
  await syncFromSupabase();
  
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

renderApp();
