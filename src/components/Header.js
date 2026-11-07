'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Box, Button, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { NAV } from '@/config/site';
import { useSite } from './SiteProvider';
import { useT, GoldButton } from './ui';

export default function Header() {
  const t = useT();
  const site = useSite();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (h) => (h === '/' ? path === '/' : path.startsWith(h));

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: t.headerBg, color: t.onDeep, backdropFilter: 'blur(10px)', backgroundImage: 'none', borderBottom: `1px solid ${t.deepLine}` }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 9 }, minHeight: { xs: 60, md: 76 } }}>
          <Link href="/" aria-label="Elegant Events home">
            <Image src="/logo.png" alt={`${site.name} logo`} width={760} height={311} priority style={{ height: 56, width: 'auto', display: 'block' }} />
          </Link>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4.5 }}>
            {NAV.map((n) => (
              <Button key={n.href} component={Link} href={n.href} sx={{ p: 0, minWidth: 0, borderRadius: 0, fontSize: 12, letterSpacing: '.18em', color: active(n.href) ? t.goldLight : t.onDeep, borderBottom: active(n.href) ? `1px solid ${t.gold}` : '1px solid transparent' }}>
                {n.label}
              </Button>
            ))}
            <GoldButton component="a" href={site.wa(`Hi ${site.name}, I would like to enquire about an event.`)} target="_blank" rel="noopener">Enquire Now</GoldButton>
          </Box>

          <IconButton sx={{ display: { md: 'none' }, color: t.goldLight }} onClick={() => setOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: '80%', bgcolor: t.deepBg, color: t.onDeep, p: 3, backgroundImage: 'none' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setOpen(false)} sx={{ color: t.goldLight }} aria-label="Close menu"><CloseIcon /></IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
          {NAV.map((n) => (
            <Box key={n.href} component={Link} href={n.href} onClick={() => setOpen(false)} sx={{ fontFamily: 'var(--font-lora), serif', fontSize: 26, py: 2, borderBottom: `1px solid ${t.deepLine}`, color: active(n.href) ? t.goldLight : t.onDeep }}>
              {n.label}
            </Box>
          ))}
        </Box>
        <GoldButton component="a" href={site.wa(`Hi ${site.name}, I would like to enquire about an event.`)} target="_blank" rel="noopener" sx={{ mt: 4 }}>Enquire Now</GoldButton>
      </Drawer>
    </>
  );
}
