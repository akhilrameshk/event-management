'use client';
import Link from 'next/link';
import { Box } from '@mui/material';
import { useSite } from '@/components/SiteProvider';
import { useT, GoldText, Eyebrow, SectionTitle, Photo, Overlay, GoldButton, Section } from '@/components/ui';

const STRIP = ['Weddings', 'Corporate', 'Parties', 'Launches'];
const SPANS = [
  { gridColumn: { md: 'span 2' }, gridRow: { md: 'span 2' } }, {}, {}, { gridColumn: { md: 'span 2' } }, {}, {}, {},
];
const SAMPLE_MOSAIC = [8, 9, 10, 11, 12, 13, 14];

export default function HomeView({ works, featured }) {
  const t = useT();
  const site = useSite();
  const mosaic = featured
    ? featured.slice(0, 7).map((m) => ({ key: m.id, src: m.thumb, alt: `${m.title} - ${site.name}, ${site.locality}` }))
    : SAMPLE_MOSAIC.map((i) => ({ key: i, i, alt: `Event gallery photo by ${site.name}` }));

  return (
    <>
      {/* Hero */}
      <Photo i={4} priority sx={{ minHeight: { xs: 700, md: 820 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', px: 2.5, pb: { xs: 12, md: 14 }, color: t.onDeep }}>
        <Overlay from=".5" to=".88" />
        <Box sx={{ position: 'relative' }}>
          <Eyebrow onDeep>Premium Event Management · {site.locality}</Eyebrow>
          <Box component="h1" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 34, md: 68 }, maxWidth: 960, mx: 'auto', my: 3 }}>
            <GoldText onDeep>{site.tagline}</GoldText>
          </Box>
          <Box sx={{ maxWidth: 620, mx: 'auto', mb: 4.5 }}>Weddings, corporate gatherings and grand celebrations in {site.locality}, {site.region}, designed and delivered with elegance.</Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <GoldButton component={Link} href="/our-works">Our Works</GoldButton>
            <GoldButton outlined onDeep component={Link} href="/contact">Contact Us</GoldButton>
          </Box>
        </Box>
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, borderTop: `1px solid ${t.deepLine}`, bgcolor: `${t.overlay}.7)` }}>
          {STRIP.map((s) => (
            <Box key={s} sx={{ py: { xs: 1.75, md: 3.25 }, textAlign: 'center', fontFamily: 'var(--font-lora), serif', letterSpacing: '.14em', fontSize: { xs: 11, md: 14 }, textTransform: 'uppercase', color: t.goldLight, borderRight: `1px solid ${t.deepLine}` }}>{s}</Box>
          ))}
        </Box>
      </Photo>

      {/* Gold band */}
      <Box sx={{ background: 'linear-gradient(90deg,#a67c1f,#f1d98a,#a67c1f)', color: '#0a0a0c', fontFamily: 'var(--font-lora), serif', fontSize: { xs: 14, md: 19 }, letterSpacing: '.22em', py: 2, whiteSpace: 'nowrap', overflow: 'hidden', textAlign: 'center' }}>
        WEDDINGS ◆ CORPORATE EVENTS ◆ BIRTHDAYS ◆ STAGE &amp; DECOR ◆ SOUND &amp; LIGHTING ◆ BRAND LAUNCHES ◆ WEDDINGS ◆ CORPORATE
      </Box>

      {/* Works */}
      <Section>
        <SectionTitle eyebrow="What We Do" title="Our Works" />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 4 }}>
          {works.slice(0, 3).map((w, k) => (
            <Photo key={w.id} i={w.img} src={w.src} alt={`${w.title} by ${site.name}, event management in ${site.locality}`} sx={{ minHeight: { xs: 440, md: 560 }, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 4, border: `1px solid ${t.deepLine}`, color: t.onDeep, mt: { md: k === 1 ? 8 : 0 } }}>
              <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(transparent 35%,${t.overlay}.95))` }} />
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ fontFamily: 'var(--font-lora), serif', fontSize: 64, lineHeight: 1, color: 'transparent', WebkitTextStroke: `1px ${t.gold}` }}>0{k + 1}</Box>
                <Box component="h3" sx={{ fontFamily: 'var(--font-lora), serif', fontSize: 26, fontWeight: 500, my: 1 }}><GoldText onDeep>{w.title}</GoldText></Box>
                <Box sx={{ color: t.onDeepMuted, fontSize: 14 }}>{w.text.length > 78 ? `${w.text.slice(0, 78)}…` : w.text}</Box>
                <Box component={Link} href="/our-works" sx={{ display: 'inline-block', mt: 2, fontSize: 12, letterSpacing: '.3em', textTransform: 'uppercase', color: t.goldLight }}>Explore →</Box>
              </Box>
            </Photo>
          ))}
        </Box>
        <Box sx={{ textAlign: 'center', mt: 7.5 }}><GoldButton outlined component={Link} href="/our-works">View All Works</GoldButton></Box>
      </Section>

      {/* About teaser */}
      <Section alt>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 6, md: 10 }, alignItems: 'center' }}>
          <Box sx={{ position: 'relative', '&::before': { content: '""', position: 'absolute', inset: '-18px 18px 18px -18px', border: `1px solid ${t.gold}` } }}>
            <Photo i={works[0].img} src={works[0].src}  alt={`Wedding stage decoration by ${site.name}`} sx={{ height: { xs: 380, md: 600 } }} />
            <Photo   i={works[4].img} src={works[4].src} alt="Candle lit reception table setup" sx={{ position: 'absolute', right: { xs: 0, md: -40 }, bottom: -50, width: { xs: 150, md: 250 }, height: { xs: 190, md: 300 }, border: `8px solid ${t.paper}` }} />
          </Box>
          <Box>
            <Eyebrow>About Us</Eyebrow>
            <Box component="h2" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 30, md: 46 }, my: 2.5 }}><GoldText>Event Management Company in {site.locality}</GoldText></Box>
            <Box sx={{ color: 'text.secondary' }}>{site.name} plans weddings, corporate events, birthday parties and brand launches across {site.locality} and {site.region}. Short company story goes here: our passion, our team and the standard we hold every celebration to.</Box>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, my: 2.5, color: 'text.secondary' }}>
              {['Personalised concepts for every client', 'End-to-end planning and execution', 'Premium décor, sound and lighting'].map((x) => (
                <Box component="li" key={x} sx={{ py: 0.75, pl: 3.5, position: 'relative', '&::before': { content: '""', position: 'absolute', left: 4, top: 17, width: 8, height: 8, bgcolor: t.gold, transform: 'rotate(45deg)' } }}>{x}</Box>
              ))}
            </Box>
            <GoldButton component={Link} href="/about">Our Story</GoldButton>
          </Box>
        </Box>
      </Section>

      {/* Featured gallery */}
      <Section>
        <SectionTitle eyebrow="Moments" title="Featured Gallery" />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, gridAutoRows: { xs: 170, md: 250 }, gap: { xs: 1, md: 1.75 } }}>
          {mosaic.map((m, k) => (<Photo key={m.key} i={m.i} src={m.src} alt={m.alt} sx={SPANS[k] || {}} />))}
        </Box>
        <Box sx={{ textAlign: 'center', mt: 6 }}><GoldButton outlined component={Link} href="/gallery">Open Gallery</GoldButton></Box>
      </Section>

      {/* Testimonial */}
      <Photo i={7} sx={{ px: { xs: 2.5, md: 9 }, py: { xs: 8, md: 13.5 }, textAlign: 'center', color: t.onDeep }}>
        <Overlay from=".9" to=".93" />
        <Box sx={{ position: 'relative' }}>
          <Box sx={{ fontFamily: 'var(--font-lora), serif', fontStyle: 'italic', fontSize: { xs: 21, md: 32 }, maxWidth: 900, mx: 'auto', my: 3, lineHeight: 1.5 }}>
            “Client testimonial goes here. A few warm lines about how {site.name} made the celebration unforgettable.”
          </Box>
          <Eyebrow onDeep>Client Name · Event Type</Eyebrow>
        </Box>
      </Photo>

      {/* CTA */}
      <Section>
        <Box sx={{ border: `1px solid ${t.gold}`, py: { xs: 6, md: 10.5 }, px: 2.5, textAlign: 'center', background: 'radial-gradient(circle at 50% 0,rgba(184,137,43,.18),transparent 65%)' }}>
          <Eyebrow>Book Your Date</Eyebrow>
          <Box component="h2" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 28, md: 44 }, my: 2 }}><GoldText>Let’s Create Your Unforgettable Moment</GoldText></Box>
          <Box sx={{ color: 'text.secondary', mb: 3.5 }}>{site.phones.join('  |  ')}</Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <GoldButton component="a" href={site.wa(`Hi ${site.name}, I would like to enquire about an event.`)} target="_blank" rel="noopener">Enquire Now</GoldButton>
            <GoldButton outlined component="a" href={`tel:${site.tel}`}>Call Us</GoldButton>
          </Box>
        </Box>
      </Section>
    </>
  );
}
