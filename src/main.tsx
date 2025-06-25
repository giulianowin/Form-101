import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AppBackground from './components/AppBackground.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppBackground>
      <App />
    </AppBackground>
  </StrictMode>
);
