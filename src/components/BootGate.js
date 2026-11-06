'use client';
import { useEffect, useState } from 'react';
import { useThemeMode } from '@/theme/ThemeContext';

// Keeps the first-load loader (#ee-boot) on screen until the saved theme is applied,
// so visitors never see the wrong theme flash (for example brown before black).
export default function BootGate() {
  const { ready } = useThemeMode();
  const [minDone, setMinDone] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setMinDone(true), 800);   // show the animation at least briefly
    const b = setTimeout(() => hide(), 5000);              // safety: never block the page
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  useEffect(() => { if (ready && minDone) hide(); }, [ready, minDone]);
  return null;
}

function hide() {
  const el = document.getElementById('ee-boot');
  if (!el || el.classList.contains('ee-hide')) return;
  el.classList.add('ee-hide');
  setTimeout(() => el.remove(), 700);
}
