'use client';
import Link from 'next/link';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';
import { useSite } from '@/components/SiteProvider';
import { useT, GoldText, SectionTitle, Photo, Overlay, Section } from '@/components/ui';

// സുഗമമായ സൂം & ഫ്ലോട്ടിംഗ് ആനിമേഷൻ ഇഫക്റ്റ്
const subtleZoom = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.06); }
  100% { transform: scale(1); }
`;

const STEPS = [['Consult', 'We listen to your vision.'], ['Design', 'Concepts, moodboards, budgets.'], ['Execute', 'Flawless on-site delivery.'], ['Celebrate', 'You enjoy every moment.']];

export default function WorksView({ works }) {
  const t = useT();
  const site = useSite();

  return (
    <>
      {/* Animated Hero Section */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Photo 
          i={4} 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85" 
          priority 
          sx={{ 
            minHeight: { xs: 450, md: 560 }, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            textAlign: 'center', 
            px: 2.5, 
            py: 10,
            color: t.onDeep,
            animation: `${subtleZoom} 20s ease-in-out infinite`,
          }}
        >
          <Overlay from=".6" to=".9" />
          <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 960, mx: 'auto' }}>
            <Box sx={{ fontSize: 13, letterSpacing: '.25em', textTransform: 'uppercase', color: t.goldLight, mb: 1.5, fontFamily: 'var(--font-lora), serif' }}>
              Home / Our Works
            </Box>
            <Box component="h1" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 36, md: 60 }, my: 2 }}>
              <GoldText onDeep>Crafted for Every Occasion</GoldText>
            </Box>
            <Box sx={{ maxWidth: 620, mx: 'auto', fontSize: { xs: 15, md: 17 }, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              Event management services in {site.locality}, from intimate gatherings to grand productions.
            </Box>
          </Box>
        </Photo>
      </Box>

      {/* Works Section */}
      <Section sx={{ pt: { md: 16 } }}>
        {works.map((w, k) => (
          <Box key={w.id} id={w.slug || undefined} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: k % 2 ? '1fr 1.1fr' : '1.1fr 1fr' }, gap: { xs: 5, md: 12 }, alignItems: 'center', mb: { xs: 9, md: 16 }, scrollMarginTop: 100 }}>
            <Box sx={{ order: { md: k % 2 ? 2 : 0 }, position: 'relative', '&::before': { content: '""', position: 'absolute', inset: '-18px 18px 18px -18px', border: `1px solid ${t.gold}` } }}>
              <Photo i={w.img} src={w.src} alt={`${w.title} by ${site.name}, ${site.locality}`} sx={{ height: { xs: 320, md: 540 } }} />
            </Box>
            <Box>
              <Box sx={{ fontFamily: 'var(--font-lora), serif', fontSize: { xs: 44, md: 64 }, lineHeight: 1, color: 'transparent', WebkitTextStroke: `1px ${t.gold}` }}>0{k + 1}</Box>
              <Box component="h2" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 30, md: 40 }, my: 1.5 }}><GoldText>{w.title}</GoldText></Box>
              <Box sx={{ color: 'text.secondary', lineHeight: 1.7 }}>{w.text}</Box>
              {w.points.length > 0 && (
                <Box component="ul" sx={{ listStyle: 'none', p: 0, my: 2.5, color: 'text.secondary' }}>
                  {w.points.map((x) => (<Box component="li" key={x} sx={{ py: 0.75, pl: 3.5, position: 'relative', '&::before': { content: '""', position: 'absolute', left: 4, top: 17, width: 8, height: 8, bgcolor: t.gold, transform: 'rotate(45deg)' } }}>{x}</Box>))}
                </Box>
              )}
              <Box component="a" href={site.wa(`Hi ${site.name}, I would like to know more about ${w.title}.`)} target="_blank" rel="noopener" sx={{ display: 'inline-block', mt: 1, fontSize: 12, letterSpacing: '.3em', textTransform: 'uppercase', color: t.goldText, fontWeight: 600 }}>Enquire about this →</Box>
            </Box>
          </Box>
        ))}
      </Section>

      {/* Our Process Section */}
      <Section alt>
        <SectionTitle eyebrow="How We Work" title="Our Process" />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, gap: { xs: 4, md: 3 }, textAlign: 'center' }}>
          {STEPS.map(([a, b], k) => (
            <Box key={a}>
              <Box sx={{ width: 72, height: 72, border: `1px solid ${t.gold}`, borderRadius: '50%', mx: 'auto', mb: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-lora), serif', fontSize: 24, color: t.goldText }}>{k + 1}</Box>
              <Box component="h3" sx={{ fontFamily: 'var(--font-lora), serif', fontSize: 20 }}><GoldText>{a}</GoldText></Box>
              <Box sx={{ color: 'text.secondary', fontSize: 14, mt: 1 }}>{b}</Box>
            </Box>
          ))}
        </Box>
      </Section>
    </>
  );
}