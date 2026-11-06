import { createTheme } from '@mui/material/styles';

const tokens = {
  dark: {
    mode: 'dark', bg: '#0a0a0c', paper: '#121115', text: '#f5ecd5', muted: '#b9ad8f', line: '#3a3220',
    gold: '#d4af37', goldText: '#f1d98a', goldLight: '#f1d98a',
    headerBg: 'rgba(10,10,12,.92)', footerBg: '#060607', deepBg: '#0a0a0c', deepLine: '#3a3220',
    onDeep: '#f5ecd5', onDeepMuted: '#c9bd9f', overlay: 'rgba(10,10,12,',
    gradient: 'linear-gradient(135deg,#f6e3a1,#d4af37 50%,#9a7424)',
    gradientOnDeep: 'linear-gradient(135deg,#f6e3a1,#d4af37 50%,#9a7424)',
    card: '#121115',
  },
  // Light theme palette: Soft Warm Ivory, Pearl White cards with fine gold border,
  // Deep Espresso Brown text, Royal Burgundy accent, Warm Cream secondary background.
  royal: {
    mode: 'light', bg: '#FDFBF7', paper: '#F5EFE6', text: '#2A2118', muted: '#6b5d4d', line: 'rgba(212,175,55,.45)',
    gold: '#B8892B', goldText: '#8a6414', goldLight: '#f1d98a',
    headerBg: 'rgba(90,24,39,.96)', footerBg: '#2A2118', deepBg: '#5A1827', deepLine: '#86465a',
    onDeep: '#f8eedd', onDeepMuted: '#dccbb0', overlay: 'rgba(90,24,39,',
    gradient: 'linear-gradient(135deg,#7a5a14,#b8892b 50%,#6e500f)',
    gradientOnDeep: 'linear-gradient(135deg,#f6e3a1,#d4af37 50%,#9a7424)',
    card: '#FFFFFF',
  },
};

export const THEME_NAMES = Object.keys(tokens);
export const GOLD_BTN = 'linear-gradient(135deg,#f1d98a,#d4af37 55%,#a67c1f)';

export function buildTheme(name) {
  const t = tokens[name] || tokens.royal;
  const heading = { fontFamily: 'var(--font-lora), serif', fontWeight: 500, lineHeight: 1.15 };
  return createTheme({
    palette: {
      mode: t.mode,
      primary: { main: t.gold },
      background: { default: t.bg, paper: t.paper },
      text: { primary: t.text, secondary: t.muted },
    },
    shape: { borderRadius: 0 },
    typography: {
      fontFamily: 'var(--font-poppins), sans-serif',
      fontWeightRegular: 300,
      h1: heading, h2: heading, h3: heading, h4: heading, h5: heading,
    },
    custom: t,
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 0, letterSpacing: '.18em', fontSize: 12, fontWeight: 500, padding: '14px 34px' },
        },
      },
    },
  });
}
