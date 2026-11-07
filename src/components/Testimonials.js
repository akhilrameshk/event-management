'use client';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useT, Photo, Overlay, Eyebrow } from './ui';

// Home page testimonials from Admin > Testimonials. Hidden when there are none. Rotates when there are several.
export default function Testimonials({ items }) {
  const t = useT();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!items || items.length < 2) return undefined;
    const id = setInterval(() => setI((x) => (x + 1) % items.length), 7000);
    return () => clearInterval(id);
  }, [items]);
  if (!items || items.length === 0) return null;
  const cur = items[i % items.length];
  return (
    <Photo i={7} sx={{ px: { xs: 2.5, md: 9 }, py: { xs: 8, md: 13.5 }, textAlign: 'center', color: t.onDeep }}>
      <Overlay from=".9" to=".93" />
      <Box sx={{ position: 'relative' }}>
        <Box component="blockquote" sx={{ m: 0, fontFamily: 'var(--font-lora), serif', fontStyle: 'italic', fontSize: { xs: 21, md: 32 }, maxWidth: 900, mx: 'auto', my: 3, lineHeight: 1.5, minHeight: { md: 150 } }}>
          “{cur.quote}”
        </Box>
        <Eyebrow onDeep>{[cur.name, cur.eventType].filter(Boolean).join(' · ')}</Eyebrow>
        {items.length > 1 && (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 3 }}>
            {items.map((x, k) => (
              <Box key={x.id} component="button" onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} sx={{ width: 9, height: 9, borderRadius: '50%', border: `1px solid ${t.goldLight}`, p: 0, cursor: 'pointer', bgcolor: k === i % items.length ? t.goldLight : 'transparent' }} />
            ))}
          </Box>
        )}
      </Box>
    </Photo>
  );
}
