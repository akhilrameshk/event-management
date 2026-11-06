'use client';
import { Box } from '@mui/material';
import { useT, Photo, Overlay, Eyebrow, GoldText } from './ui';

export default function PageHero({ eyebrow, title, text, img = 3 }) {
  const t = useT();
  return (
    <Photo i={img} sx={{ minHeight: { xs: 340, md: 460 }, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', px: 2.5, color: t.onDeep }}>
      <Overlay from=".6" to=".9" />
      <Box sx={{ position: 'relative' }}>
        <Eyebrow onDeep>{eyebrow}</Eyebrow>
        <Box component="h1" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 34, md: 62 }, my: 2 }}><GoldText onDeep>{title}</GoldText></Box>
        {text && <Box sx={{ maxWidth: 560, mx: 'auto' }}>{text}</Box>}
      </Box>
    </Photo>
  );
}
