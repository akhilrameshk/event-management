'use client';
import Link from 'next/link';
import { Box } from '@mui/material';
import StarBorder from '@mui/icons-material/StarBorder';
import VerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { useSite } from '@/components/SiteProvider';
import { useT, GoldText, Eyebrow, SectionTitle, Photo, GoldButton, Section } from '@/components/ui';

const VALUES = [[StarBorder, 'Excellence', 'Every detail is refined until it meets our standard.'], [VerifiedUserOutlined, 'Trust', 'Transparent planning, honest budgets, reliable delivery.'], [FavoriteBorder, 'Passion', 'We celebrate your moments as if they were our own.']];
const STATS = ['Events', 'Happy Clients', 'Years', 'Team Members'];

export default function AboutView() {
  const t = useT();
  const site = useSite();
  return (
    <>
      <Section>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, gap: { xs: 6, md: 10 }, alignItems: 'center' }}>
          <Box>
            <Eyebrow>About Us</Eyebrow>
            <Box component="h1" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 34, md: 64 }, my: 3.5 }}><GoldText>A Legacy of Elegance, One Celebration at a Time</GoldText></Box>
            <Box sx={{ color: 'text.secondary', maxWidth: 540, mb: 4.5 }}>Short company introduction goes here. Who we are, where we started in {site.locality}, {site.region} and what makes every {site.name} celebration unique.</Box>
            <GoldButton component={Link} href="/contact">Get In Touch</GoldButton>
          </Box>
          <Box sx={{ border: `1px solid ${t.gold}`, p: 1.75, borderRadius: { xs: '220px 220px 0 0', md: '440px 440px 0 0' } }}>
            <Photo i={0} alt={`${site.name} event decoration`} sx={{ height: { xs: 420, md: 680 }, borderRadius: { xs: '210px 210px 0 0', md: '430px 430px 0 0' } }} />
          </Box>
        </Box>
      </Section>

      <Section alt>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 4, md: 8 }, alignItems: 'start' }}>
          <Box>
            <Eyebrow>Our Story</Eyebrow>
            <Box component="h2" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 30, md: 42 }, mt: 1.75 }}><GoldText>From a Passion to a Premier Name</GoldText></Box>
          </Box>
          <Box sx={{ color: 'text.secondary', columnCount: { md: 2 }, columnGap: 5 }}>
            We began with a simple belief: every celebration deserves to feel extraordinary. Company history, milestones and philosophy go here. Replace this paragraph with the client’s own story, their approach to planning and the experiences they are proudest of.
          </Box>
        </Box>
      </Section>

      <Section sx={{ py: { xs: 5, md: 7.5 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, rowGap: 4 }}>
          {STATS.map((s) => (
            <Box key={s} sx={{ textAlign: 'center', borderRight: `1px solid ${t.line}` }}>
              <Box sx={{ fontFamily: 'var(--font-lora), serif', fontSize: { xs: 34, md: 52 } }}><GoldText>00+</GoldText></Box>
              <Eyebrow sx={{ letterSpacing: '.2em' }}>{s}</Eyebrow>
            </Box>
          ))}
        </Box>
      </Section>

      <Section alt>
        <SectionTitle eyebrow="What Drives Us" title="Our Values" />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 4 }}>
          {VALUES.map(([Icon, a, b]) => (
            <Box key={a} sx={{ bgcolor: t.card, border: `1px solid ${t.line}`, borderTop: `2px solid ${t.gold}`, p: '40px 32px' }}>
              <Icon sx={{ fontSize: 34, color: t.gold }} />
              <Box component="h3" sx={{ fontFamily: 'var(--font-lora), serif', fontSize: 24, my: 2 }}><GoldText>{a}</GoldText></Box>
              <Box sx={{ color: 'text.secondary', fontSize: 14 }}>{b}</Box>
            </Box>
          ))}
        </Box>
      </Section>

      <Section>
        <SectionTitle eyebrow="The People" title="Meet Our Team" />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 4 }}>
          {['A', 'B', 'C'].map((x) => (
            <Box key={x} sx={{ textAlign: 'center' }}>
              <Box sx={{ width: 170, height: 170, borderRadius: '50%', border: `1px solid ${t.gold}`, p: 1, mx: 'auto', mb: 2.5 }}>
                <Box sx={{ height: '100%', borderRadius: '50%', bgcolor: t.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-lora), serif', fontSize: 44 }}><GoldText>{x}</GoldText></Box>
              </Box>
              <Box component="h3" sx={{ fontFamily: 'var(--font-lora), serif', fontSize: 20 }}>Team Member</Box>
              <Eyebrow sx={{ letterSpacing: '.2em', mt: 0.75 }}>Role</Eyebrow>
            </Box>
          ))}
        </Box>
      </Section>
    </>
  );
}
