'use client';
import { useEffect, useState } from 'react';
import { Fab, Stack } from '@mui/material';
import WhatsApp from '@mui/icons-material/WhatsApp';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import { useSite } from './SiteProvider';
import { useThemeMode } from '@/theme/ThemeContext';
import { GOLD_BTN } from '@/theme/themes';
import { useT } from './ui';

// All icons are always visible (no menu):
//  bottom right: WhatsApp, Call, theme toggle
//  bottom left : scroll arrow (down at the top of the page, up once scrolled)
// On mobile they sit above the fixed bottom bar.
export default function FloatingActions() {
  const t = useT();
  const site = useSite();
  const { mode, toggle } = useThemeMode();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onArrow = () =>
    window.scrollTo({ top: scrolled ? 0 : document.documentElement.scrollHeight, behavior: 'smooth' });

  const bottom = { xs: 82, md: 24 };
  return (
    <>
      <Stack spacing={1.5} sx={{ position: 'fixed', right: { xs: 16, md: 24 }, bottom, zIndex: 1250 }}>
        <Fab component="a" href={site.wa(`Hi ${site.name}!`)} target="_blank" rel="noopener" aria-label="Chat on WhatsApp" sx={{ bgcolor: '#25D366', color: '#fff', '&:hover': { bgcolor: '#1ebe5b' } }}>
          <WhatsApp />
        </Fab>
        <Fab component="a" href={`tel:${site.tel}`} aria-label="Call us" sx={{ background: GOLD_BTN, color: '#0a0a0c' }}>
          <PhoneOutlined />
        </Fab>
        {/* Shows the icon of the theme you will switch TO: dark now -> light icon, light now -> dark icon */}
        <Fab onClick={toggle} aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} sx={{ bgcolor: t.deepBg, color: t.goldLight, border: `1px solid ${t.gold}`, '&:hover': { bgcolor: t.deepBg } }}>
          {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
        </Fab>
      </Stack>

      <Fab onClick={onArrow} aria-label={scrolled ? 'Scroll to top' : 'Scroll to bottom'} sx={{ position: 'fixed', left: { xs: 16, md: 24 }, bottom, zIndex: 1250, bgcolor: t.deepBg, color: t.goldLight, border: `1px solid ${t.gold}`, '&:hover': { bgcolor: t.deepBg } }}>
        {scrolled ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </Fab>
    </>
  );
}
