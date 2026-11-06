'use client';
import { Box } from '@mui/material';
import { useSite } from '@/components/SiteProvider';
import PageHero from '@/components/PageHero';
import { useT, GoldText, SectionTitle, Photo, Section } from '@/components/ui';

const STEPS = [['Consult', 'We listen to your vision.'], ['Design', 'Concepts, moodboards, budgets.'], ['Execute', 'Flawless on-site delivery.'], ['Celebrate', 'You enjoy every moment.']];

export default function WorksView({ works }) {
  const t = useT();
  const site = useSite();
  return (
    <>
      <PageHero eyebrow="Home / Our Works" title="Crafted for Every Occasion" text={`Event management services in ${site.locality}, from intimate gatherings to grand productions.`} />
      <Section sx={{ pt: { md: 16 } }}>
        {works.map((w, k) => (
          <Box key={w.id} id={w.slug || undefined} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: k % 2 ? '1fr 1.1fr' : '1.1fr 1fr' }, gap: { xs: 5, md: 12 }, alignItems: 'center', mb: { xs: 9, md: 16 }, scrollMarginTop: 100 }}>
            <Box sx={{ order: { md: k % 2 ? 2 : 0 }, position: 'relative', '&::before': { content: '""', position: 'absolute', inset: '-18px 18px 18px -18px', border: `1px solid ${t.gold}` } }}>
              <Photo i={w.img} src={w.src} alt={`${w.title} by ${site.name}, ${site.locality}`} sx={{ height: { xs: 320, md: 540 } }} />
            </Box>
            <Box>
              <Box sx={{ fontFamily: 'var(--font-lora), serif', fontSize: { xs: 44, md: 64 }, lineHeight: 1, color: 'transparent', WebkitTextStroke: `1px ${t.gold}` }}>0{k + 1}</Box>
              <Box component="h2" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 30, md: 40 }, my: 1.5 }}><GoldText>{w.title}</GoldText></Box>
              <Box sx={{ color: 'text.secondary' }}>{w.text}</Box>
              {w.points.length > 0 && (
                <Box component="ul" sx={{ listStyle: 'none', p: 0, my: 2.5, color: 'text.secondary' }}>
                  {w.points.map((x) => (<Box component="li" key={x} sx={{ py: 0.75, pl: 3.5, position: 'relative', '&::before': { content: '""', position: 'absolute', left: 4, top: 17, width: 8, height: 8, bgcolor: t.gold, transform: 'rotate(45deg)' } }}>{x}</Box>))}
                </Box>
              )}
              <Box component="a" href={site.wa(`Hi ${site.name}, I would like to know more about ${w.title}.`)} target="_blank" rel="noopener" sx={{ fontSize: 12, letterSpacing: '.3em', textTransform: 'uppercase', color: t.goldText }}>Enquire about this →</Box>
            </Box>
          </Box>
        ))}
      </Section>
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
