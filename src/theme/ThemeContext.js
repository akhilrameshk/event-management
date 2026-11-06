'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { buildTheme } from './themes';

const Ctx = createContext({ mode: 'royal', toggle: () => {}, ready: false });
export const useThemeMode = () => useContext(Ctx);

// The default comes from Admin > Settings > Default theme. A visitor's own choice is remembered in the browser.
export default function AppThemeProvider({ children, defaultMode = 'royal' }) {
  const [mode, setMode] = useState(defaultMode === 'dark' ? 'dark' : 'royal');
  const [ready, setReady] = useState(false); // true once the visitor's saved theme has been applied

  useEffect(() => {
    const saved = localStorage.getItem('ee-theme');
    if (saved === 'dark' || saved === 'royal') setMode(saved);
    setReady(true);
  }, []);

  const toggle = () =>
    setMode((m) => {
      const next = m === 'dark' ? 'royal' : 'dark';
      localStorage.setItem('ee-theme', next);
      return next;
    });

  const theme = useMemo(() => buildTheme(mode), [mode]);
  return (
    <Ctx.Provider value={{ mode, toggle, ready }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Ctx.Provider>
  );
}
