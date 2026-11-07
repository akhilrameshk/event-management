'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Box } from '@mui/material';
import { NAV, toTel } from '@/config/site';
import { useSite } from './SiteProvider';
import { useT, PX } from './ui';

export default function Footer() {
  const t = useT();
  const site = useSite();

  const headSx = {
    fontFamily: 'var(--font-lora), serif',
    color: t.goldText || '#F5E6C8',
    letterSpacing: '.25em',
    textTransform: 'uppercase',
    fontSize: 13,
    fontWeight: 600,
    mb: 2.5,
    position: 'relative',
    display: 'inline-block',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -6,
      left: 0,
      width: 28,
      height: 1,
     
    },
  };

  const linkSx = {
    color: t.onDeepMuted || 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontSize: 14,
    display: 'block',
    mb: 1.25,
    '&:hover': {
      color: t.gold || '#D4AF37',
      transform: 'translateX(4px)',
    },
  };

  return (
    <Box
      component="footer"
      sx={{
       bgcolor: t.headerBg, // ഡൈനാമിക് തീം ബാക്ക്ഗ്രൗണ്ട്
        color: t.onDeep || 'rgba(255, 255, 255, 0.7)',
        borderTop: `1px solid ${t.deepLine || 'rgba(212, 175, 55, 0.25)'}`,
        px: PX,
        pt: { xs: 6, md: 9 },
        pb: { xs: 12, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1280,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1.2fr' },
          gap: { xs: 5, md: 8 },
        }}
      >
        {/* Brand Column */}
        <Box>
          <Box sx={{ mb: 2 }}>
            <Image
              src="/wordmark.png"
              alt={`${site.name} wordmark`}
              width={1160}
              height={250}
              style={{ width: 260, maxWidth: '100%', height: 'auto' }}
            />
          </Box>
          <Box
            sx={{
              mt: 2,
              maxWidth: 380,
              fontSize: 14,
              lineHeight: 1.7,
              color: t.onDeepMuted || 'rgba(255,255,255,0.6)',
            }}
          >
            Premium event management company in {site.locality}, {site.region}.
            Crafting weddings, corporate events, parties, and launches with pure elegance.
          </Box>
        </Box>

        {/* Explore Links */}
        <Box>
          <Box sx={headSx}>Explore</Box>
          <Box sx={{ mt: 1 }}>
            {NAV.map((n) => (
              <Box key={n.href} component={Link} href={n.href} sx={linkSx}>
                {n.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Contact Info */}
        <Box>
          <Box sx={headSx}>Contact Us</Box>
          <Box sx={{ mt: 1 }}>
            {site.phones.map((p) => (
              <Box key={p} component="a" href={`tel:${toTel(p)}`} sx={linkSx}>
                📞 {p}
              </Box>
            ))}
            <Box sx={{ fontSize: 14, color: t.onDeepMuted || 'rgba(255, 255, 255, 0.7)', mb: 1.25, lineHeight: 1.6 }}>
              📍 {site.address}
            </Box>
            {site.email && (
              <Box component="a" href={`mailto:${site.email}`} sx={linkSx}>
                ✉️ {site.email}
              </Box>
            )}
            {site.instagram && (
              <Box
                component="a"
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                sx={linkSx}
              >
                📸 Instagram (@ELEGNAT_EVENT_KL04)
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Copyright Bar */}
      <Box
        sx={{
          maxWidth: 1280,
          mx: 'auto',
          borderTop: `1px solid ${t.deepLine || 'rgba(255, 255, 255, 0.08)'}`,
          mt: 7,
          pt: 3,
          textAlign: 'center',
          fontSize: 12,
          letterSpacing: '.12em',
          color: t.onDeepMuted || 'rgba(255, 255, 255, 0.4)',
        }}
      >
        © {new Date().getFullYear()} {site.name}. All photos and videos are copyright protected.
      </Box>
    </Box>
  );
}