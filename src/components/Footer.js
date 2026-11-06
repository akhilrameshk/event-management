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
  const head = { color: t.goldLight, letterSpacing: '.2em', textTransform: 'uppercase', fontSize: 13, mb: 2 };
  return (
    <Box component="footer" sx={{ bgcolor: t.footerBg, color: t.onDeepMuted, borderTop: `1px solid ${t.deepLine}`, px: PX, pt: 9, pb: { xs: 14, md: 3.5 }, fontSize: 14 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 6 }}>
        <Box>
          <Image src="/wordmark.png" alt={`${site.name} wordmark`} width={1160} height={250} style={{ width: 300, maxWidth: '100%', height: 'auto' }} />
          <Box sx={{ mt: 2.5, maxWidth: 380 }}>Premium event management company in {site.locality}, {site.region}. Crafting weddings, corporate events, parties and launches with elegance.</Box>
        </Box>
        <Box>
          <Box sx={head}>Explore</Box>
          {NAV.map((n) => (<Box key={n.href} component={Link} href={n.href} sx={{ display: 'block', mb: 1 }}>{n.label}</Box>))}
        </Box>
        <Box>
          <Box sx={head}>Contact</Box>
          {site.phones.map((p) => (<Box key={p} component="a" href={`tel:${toTel(p)}`} sx={{ display: 'block', mb: 1 }}>{p}</Box>))}
          <Box sx={{ mb: 1 }}>{site.address}</Box>
          <Box component="a" href={`https://${site.website.replace(/^https?:\/\//, '')}`} sx={{ display: 'block', mb: 1 }}>{site.website}</Box>
          {site.email && <Box component="a" href={`mailto:${site.email}`} sx={{ display: 'block', mb: 1 }}>{site.email}</Box>}
          {[['Instagram', site.instagram], ['Facebook', site.facebook], ['YouTube', site.youtube]].filter(([, u]) => u).map(([n, u]) => (<Box key={n} component="a" href={u} target="_blank" rel="noopener noreferrer me" sx={{ display: 'block', mb: 1 }}>{n}</Box>))}
        </Box>
      </Box>
      <Box sx={{ borderTop: `1px solid ${t.deepLine}`, mt: 6, pt: 2.75, textAlign: 'center', fontSize: 12, letterSpacing: '.1em' }}>
        © {new Date().getFullYear()} {site.name}. All photos and videos are copyright protected.
      </Box>
    </Box>
  );
}
