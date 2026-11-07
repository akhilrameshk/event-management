'use client';
import Link from 'next/link';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';
import StarBorder from '@mui/icons-material/StarBorder';
import VerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { useSite } from '@/components/SiteProvider';
import { useT, GoldText, Eyebrow, SectionTitle, Photo, Overlay, GoldButton, Section } from '@/components/ui';

const subtleZoom = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.06); }
  100% { transform: scale(1); }
`;

const ICONS = [StarBorder, VerifiedUserOutlined, FavoriteBorder];
const initials = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

export default function AboutView({ content, team }) {
  const t = useT();
  const site = useSite();
  const a = content.about;
  const intro = a.introImage ? content.images[a.introImage] : null;

  return (
    <>
      {/* Premium Hero Section */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Photo 
          i={4} 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85" 
          priority 
          sx={{ 
            minHeight: { xs: 450, md: 540 }, 
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
              Home / About Us
            </Box>
            <Box component="h1" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 36, md: 60 }, my: 2 }}>
              <GoldText onDeep>Crafting Unforgettable Experiences</GoldText>
            </Box>
            <Box sx={{ maxWidth: 620, mx: 'auto', fontSize: { xs: 15, md: 17 }, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              Discover the story and team behind premium celebrations in {site.locality}.
            </Box>
          </Box>
        </Photo>
      </Box>

      {/* Main Intro Section */}
      <Section>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, gap: { xs: 6, md: 10 }, alignItems: 'center' }}>
          <Box>
            <Eyebrow>About Us</Eyebrow>
            <Box component="h2" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 32, md: 54 }, my: 3 }}><GoldText>{a.introTitle}</GoldText></Box>
            <Box sx={{ color: 'text.secondary', maxWidth: 540, mb: 4.5, lineHeight: 1.7 }}>{a.introText}</Box>
            <GoldButton component={Link} href="/contact">Get In Touch</GoldButton>
          </Box>
          <Box sx={{ border: `1px solid ${t.gold}`, p: 1.75, borderRadius: { xs: '220px 220px 0 0', md: '440px 440px 0 0' } }}>
            <Photo 
              i={0} 
              src={intro?.src || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"} 
              alt={intro?.title || `${site.name} event decoration`} 
              priority 
              sx={{ height: { xs: 420, md: 640 }, borderRadius: { xs: '210px 210px 0 0', md: '430px 430px 0 0' } }} 
            />
          </Box>
        </Box>
      </Section>

      {/* Story Section */}
      <Section alt>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' }, gap: { xs: 4, md: 8 }, alignItems: 'start' }}>
          <Box>
            <Eyebrow>Our Story</Eyebrow>
            <Box component="h2" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 30, md: 42 }, mt: 1.75 }}><GoldText>{a.storyTitle}</GoldText></Box>
          </Box>
          <Box sx={{ color: 'text.secondary', columnCount: { md: 2 }, columnGap: 5, whiteSpace: 'pre-line', lineHeight: 1.7 }}>{a.storyText}</Box>
        </Box>
      </Section>

      {/* Stats Section */}
      {a.stats.length > 0 && (
        <Section sx={{ py: { xs: 5, md: 7.5 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: `repeat(${Math.min(a.stats.length, 4)},1fr)` }, rowGap: 4 }}>
            {a.stats.map((s) => (
              <Box key={s.label} sx={{ textAlign: 'center', borderRight: `1px solid ${t.line}` }}>
                <Box sx={{ fontFamily: 'var(--font-lora), serif', fontSize: { xs: 34, md: 52 } }}><GoldText>{s.value}</GoldText></Box>
                <Eyebrow sx={{ letterSpacing: '.2em' }}>{s.label}</Eyebrow>
              </Box>
            ))}
          </Box>
        </Section>
      )}

      {/* Values Section */}
      {a.values.length > 0 && (
        <Section alt>
          <SectionTitle eyebrow="What Drives Us" title="Our Values" />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 4 }}>
            {a.values.map((v, k) => {
              const Icon = ICONS[k % ICONS.length];
              return (
                <Box key={v.title} sx={{ bgcolor: t.card, border: `1px solid ${t.line}`, borderTop: `2px solid ${t.gold}`, p: '40px 32px' }}>
                  <Icon sx={{ fontSize: 34, color: t.gold }} />
                  <Box component="h3" sx={{ fontFamily: 'var(--font-lora), serif', fontSize: 24, my: 2 }}><GoldText>{v.title}</GoldText></Box>
                  <Box sx={{ color: 'text.secondary', fontSize: 14, lineHeight: 1.6 }}>{v.text}</Box>
                </Box>
              );
            })}
          </Box>
        </Section>
      )}

      {/* Team Section */}
      {team.length > 0 && (
        <Section>
          <SectionTitle eyebrow="The People" title="Meet Our Team" />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: `repeat(${Math.min(team.length, 4)},1fr)` }, gap: 4 }}>
            {team.map((m) => (
              <Box key={m.id} sx={{ textAlign: 'center' }}>
                <Box sx={{ width: 170, height: 170, borderRadius: '50%', border: `1px solid ${t.gold}`, p: 1, mx: 'auto', mb: 2.5 }}>
                  {m.photo ? (
                    <Photo src={m.photo} alt={`${m.name}, ${m.role || 'team member'} at ${site.name}`} sx={{ height: '100%', borderRadius: '50%' }} />
                  ) : (
                    <Box sx={{ height: '100%', borderRadius: '50%', bgcolor: t.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-lora), serif', fontSize: 44 }}><GoldText>{initials(m.name)}</GoldText></Box>
                  )}
                </Box>
                <Box component="h3" sx={{ fontFamily: 'var(--font-lora), serif', fontSize: 20 }}>{m.name}</Box>
                {m.role && <Eyebrow sx={{ letterSpacing: '.2em', mt: 0.75 }}>{m.role}</Eyebrow>}
                {m.bio && <Box sx={{ color: 'text.secondary', fontSize: 14, mt: 1.5, maxWidth: 280, mx: 'auto', lineHeight: 1.6 }}>{m.bio}</Box>}
              </Box>
            ))}
          </Box>
        </Section>
      )}
    </>
  );
}