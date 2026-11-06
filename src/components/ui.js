'use client';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '@/theme/ThemeContext';
import { GOLD_BTN } from '@/theme/themes';

export const useT = () => useTheme().custom;
export const PX = { xs: 2.5, md: 9 };

export function GoldText({ children, onDeep, sx }) {
  const t = useT();
  return (
    <Box component="span" sx={{ background: onDeep ? t.gradientOnDeep : t.gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', ...sx }}>
      {children}
    </Box>
  );
}

export function Eyebrow({ children, onDeep, sx }) {
  const t = useT();
  return (
    <Box sx={{ fontSize: 12, letterSpacing: '.42em', textTransform: 'uppercase', color: onDeep ? t.goldLight : t.goldText, ...sx }}>{children}</Box>
  );
}

export function SectionTitle({ eyebrow, title, onDeep }) {
  const t = useT();
  const line = { content: '""', height: 1, width: { xs: 40, md: 80 }, background: `linear-gradient(90deg,transparent,${t.gold})` };
  return (
    <Box sx={{ textAlign: 'center', mb: { xs: 4.5, md: 7 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.75, '&::before': line, '&::after': { ...line, transform: 'scaleX(-1)' } }}>
        <Eyebrow onDeep={onDeep}>{eyebrow}</Eyebrow>
      </Box>
      <Box component="h2" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 30, md: 46 }, mt: 1.75, mb: 0 }}>
        <GoldText onDeep={onDeep}>{title}</GoldText>
      </Box>
    </Box>
  );
}

// Photo with a real <img> (so Google can index it, with alt text) and basic copy protection.
// Pass `src` for uploaded photos; without it a sample image is shown. Leave `alt` empty for decorative images.
export function Photo({ i = 0, src, alt = '', sx, children, priority = false, protect = true }) {
  const { mode } = useThemeMode();
  const url = src || `/sample/${mode}/${i % 16}.jpg`;
  const guard = protect ? { onContextMenu: (e) => e.preventDefault(), onDragStart: (e) => e.preventDefault() } : {};
  return (
    <Box
      {...guard}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        '& > img': { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, userSelect: 'none', WebkitUserDrag: 'none' },
        '& > :not(img)': { zIndex: 1 },
        ...sx,
      }}
    >
      <img src={url} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : undefined} decoding="async" draggable={false} />
      {children}
    </Box>
  );
}

export function Overlay({ from = '.5', to = '.88' }) {
  const t = useT();
  return <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(${t.overlay}${from}),${t.overlay}${to}))` }} />;
}

export function GoldButton({ children, outlined, onDeep, sx, ...rest }) {
  const t = useT();
  const base = outlined
    ? { border: `1px solid ${t.gold}`, color: onDeep ? t.goldLight : t.goldText, '&:hover': { background: 'rgba(212,175,55,.12)' } }
    : { background: GOLD_BTN, color: '#0a0a0c', '&:hover': { filter: 'brightness(1.08)' } };
  return <Button disableElevation {...rest} sx={{ ...base, ...sx }}>{children}</Button>;
}

export function Section({ children, alt, sx, id }) {
  const t = useT();
  return (
    <Box id={id} component="section" sx={{ px: PX, py: { xs: 8, md: 13.5 }, bgcolor: alt ? t.paper : 'transparent', ...sx }}>{children}</Box>
  );
}
