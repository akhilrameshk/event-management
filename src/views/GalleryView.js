'use client';
import { useState } from 'react';
import { Box, Dialog, IconButton } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Close from '@mui/icons-material/Close';
import { CATEGORIES } from '@/config/site';
import { useSite } from '@/components/SiteProvider';
import { useT, GoldText, Eyebrow, Photo, GoldButton, Section } from '@/components/ui';

const FILTERS = ['All', ...CATEGORIES, 'Videos'];

export default function GalleryView({ items, isSample }) {
  const t = useT();
  const site = useSite();
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState(null);
  const shown = items.filter((x) => filter === 'All' || (filter === 'Videos' ? x.type === 'video' : x.category === filter));
  const block = (e) => e.preventDefault();

  return (
    <>
      <Section sx={{ pb: { md: 5 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' }, gap: 4, alignItems: 'center' }}>
          <Box>
            <Eyebrow>Our Portfolio</Eyebrow>
            <Box component="h1" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 40, md: 72 }, mt: 1.75 }}><GoldText>Event Gallery</GoldText></Box>
            <Box sx={{ color: 'text.secondary', mt: 1.5, maxWidth: 480 }}>Wedding, corporate and party events by {site.name} in {site.locality}.</Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {FILTERS.map((f) => (
              <Box key={f} component="button" onClick={() => setFilter(f)} sx={{ cursor: 'pointer', font: 'inherit', border: `1px solid ${filter === f ? t.gold : t.line}`, bgcolor: filter === f ? t.gold : 'transparent', color: filter === f ? '#0a0a0c' : 'text.primary', px: 3, py: 1.1, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase' }}>{f}</Box>
            ))}
          </Box>
        </Box>
      </Section>

      <Section sx={{ pt: { md: 4 } }}>
        {shown.length === 0 && <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>No items in this category yet.</Box>}
        <Box sx={{ columnCount: { xs: 2, md: 3 }, columnGap: { xs: 1.25, md: 2.25 } }}>
          {shown.map((x) => {
            const isVideo = x.type === 'video';
            const ratio = x.width && x.height ? `${x.width} / ${x.height}` : undefined;
            return (
              <Box key={x.id} component="figure" onClick={() => !isSample && setActive(x)} sx={{ m: 0, mb: { xs: 1.25, md: 2.25 }, breakInside: 'avoid', position: 'relative', cursor: isSample ? 'default' : 'zoom-in' }}>
                {isVideo ? (
                  <Photo src={x.poster || undefined} i={x.img} alt={x.title} sx={{ aspectRatio: x.width && x.height ? `${x.width} / ${x.height}` : '16 / 10' }}>
                    <Box sx={{ position: 'absolute', left: '50%', top: '50%', width: 72, height: 72, m: '-36px', border: `1px solid ${t.goldLight}`, borderRadius: '50%', bgcolor: `${t.overlay}.6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.goldLight }}><PlayArrow /></Box>
                  </Photo>
                ) : (
                  <Photo i={x.img} src={x.thumb || undefined} alt={x.title} sx={{ height: isSample ? { xs: x.h * 0.6, md: x.h } : undefined, aspectRatio: isSample ? undefined : ratio || '4 / 3' }} />
                )}
                <Box component="figcaption" sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: '40px 18px 14px', background: `linear-gradient(transparent,${t.overlay}.9))`, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: t.goldLight, zIndex: 2 }}>
                  {isSample ? x.category : x.title}
                </Box>
              </Box>
            );
          })}
        </Box>
        {isSample && <Box sx={{ textAlign: 'center', mt: 6 }}><GoldButton outlined disabled>Sample gallery</GoldButton></Box>}
      </Section>

      {/* Lightbox (protected: no right-click, no download button) */}
      <Dialog open={!!active} onClose={() => setActive(null)} maxWidth="lg" fullWidth PaperProps={{ sx: { bgcolor: t.deepBg, backgroundImage: 'none', m: { xs: 1, md: 4 } } }}>
        <IconButton onClick={() => setActive(null)} sx={{ position: 'absolute', right: 8, top: 8, color: t.goldLight, zIndex: 3 }} aria-label="Close"><Close /></IconButton>
        {active && active.type === 'photo' && (
          <img src={active.src} alt={active.title} draggable={false} onContextMenu={block} style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', display: 'block', userSelect: 'none' }} />
        )}
        {active && active.type === 'video' && (
          <video src={active.src} controls autoPlay playsInline controlsList="nodownload noplaybackrate" disablePictureInPicture onContextMenu={block} style={{ width: '100%', maxHeight: '85vh', display: 'block', background: '#000' }} />
        )}
      </Dialog>
    </>
  );
}
