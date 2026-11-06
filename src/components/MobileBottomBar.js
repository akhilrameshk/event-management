'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import PhotoLibraryOutlined from '@mui/icons-material/PhotoLibraryOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import MailOutline from '@mui/icons-material/MailOutline';
import { useT } from './ui';

const ITEMS = [
  { label: 'Home', href: '/', Icon: HomeOutlined },
  { label: 'Gallery', href: '/gallery', Icon: PhotoLibraryOutlined },
  { label: 'Works', href: '/our-works', Icon: AutoAwesomeOutlined },
  { label: 'Contact', href: '/contact', Icon: MailOutline },
];

// Fixed footer bar, shown on mobile only (below the md breakpoint).
export default function MobileBottomBar() {
  const t = useT();
  const path = usePathname();
  return (
    <Box component="nav" aria-label="Quick navigation" sx={{ display: { xs: 'flex', md: 'none' }, position: 'fixed', left: 0, right: 0, bottom: 0, height: 66, zIndex: 1300, bgcolor: t.deepBg, borderTop: `1px solid ${t.gold}`, justifyContent: 'space-around', alignItems: 'center' }}>
      {ITEMS.map(({ label, href, Icon }) => {
        const on = href === '/' ? path === '/' : path.startsWith(href);
        return (
          <Box key={href} component={Link} href={href} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: on ? t.goldLight : t.onDeepMuted }}>
            <Icon sx={{ fontSize: 24 }} />
            {label}
          </Box>
        );
      })}
    </Box>
  );
}
