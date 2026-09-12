import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
// Palette generee depuis le .env (voir scripts/vite-plugin-theme.ts).
import 'virtual:theme.css';

import { DialogProvider } from './components/ui/DialogProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <DialogProvider>
        <App />
      </DialogProvider>
    </ThemeProvider>
  </StrictMode>,
);

