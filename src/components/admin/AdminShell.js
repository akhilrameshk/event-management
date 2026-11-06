'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import PhotoLibraryOutlined from '@mui/icons-material/PhotoLibraryOutlined';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import Logout from '@mui/icons-material/Logout';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import { useThemeMode } from '@/theme/ThemeContext';
import { useT } from '@/components/ui';

export const ADMIN_MENU = [
  { label: 'Dashboard', href: '/admin', Icon: DashboardOutlined },
  { label: 'Our Works', href: '/admin/works', Icon: AutoAwesomeOutlined },
  { label: 'Media Library', href: '/admin/media', Icon: PhotoLibraryOutlined },
  { label: 'Upload', href: '/admin/upload', Icon: CloudUploadOutlined },
  { label: 'Settings', href: '/admin/settings', Icon: SettingsOutlined },
];

const isActive = (path, href) => (href === '/admin' ? path === '/admin' : path.startsWith(href));

function SideMenu({ email, onNavigate, onLogout }) {
  const t = useT();
  const path = usePathname();
  return (
    <Box sx={{ height: '100%', bgcolor: t.footerBg, color: t.onDeepMuted, display: 'flex', flexDirection: 'column', py: 3 }}>
      <Box sx={{ px: 3.5, pb: 3.5 }}>
        <Image src="/logo.png" alt="Elegant Events" width={445} height={280} style={{ width: 150, height: 'auto' }} />
      </Box>
      <Box component="nav" sx={{ flex: 1 }}>
        {ADMIN_MENU.map(({ label, href, Icon }) => {
          const on = isActive(path, href);
          return (
            <Box key={href} component={Link} href={href} onClick={onNavigate} sx={{ display: 'flex', alignItems: 'center', gap: 1.75, px: 4, py: 1.75, fontSize: 14, color: on ? t.goldLight : t.onDeepMuted, bgcolor: on ? 'rgba(212,175,55,.10)' : 'transparent', borderLeft: `3px solid ${on ? t.gold : 'transparent'}`, '&:hover': { color: t.goldLight } }}>
              <Icon sx={{ fontSize: 20 }} /> {label}
            </Box>
          );
        })}
      </Box>
      <Box sx={{ px: 4, pt: 2, fontSize: 12 }}>
        Signed in as
        <Box sx={{ color: t.goldLight, wordBreak: 'break-all', mb: 1.5 }}>{email}</Box>
        <Box component="button" onClick={onLogout} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', font: 'inherit', fontSize: 13, color: t.onDeepMuted, bgcolor: 'transparent', border: `1px solid ${t.deepLine}`, px: 2, py: 1 }}>
          <Logout sx={{ fontSize: 18 }} /> Log out
        </Box>
      </Box>
    </Box>
  );
}

export default function AdminShell({ email, children }) {
  const t = useT();
  const router = useRouter();
  const path = usePathname();
  const { mode, toggle } = useThemeMode();
  const [open, setOpen] = useState(false);
  const current = ADMIN_MENU.find((m) => isActive(path, m.href));

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: t.bg }}>
      <Box sx={{ display: { xs: 'none', md: 'block' }, width: 260, flexShrink: 0, position: 'sticky', top: 0, height: '100vh', borderRight: `1px solid ${t.deepLine}` }}>
        <SideMenu email={email} onLogout={logout} />
      </Box>
      <Drawer open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 270, backgroundImage: 'none' } }}>
        <SideMenu email={email} onNavigate={() => setOpen(false)} onLogout={logout} />
      </Drawer>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, md: 6 }, height: 64, borderBottom: `1px solid ${t.line}`, bgcolor: t.card }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton sx={{ display: { md: 'none' }, color: t.goldText }} onClick={() => setOpen(true)} aria-label="Open menu"><MenuIcon /></IconButton>
            <Box sx={{ fontFamily: 'var(--font-lora), serif', fontSize: 18 }}>{current ? current.label : 'Admin'}</Box>
          </Box>
          <IconButton onClick={toggle} sx={{ color: t.goldText }} aria-label="Switch theme">
            {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>
        </Box>
        <Box component="main" sx={{ px: { xs: 2, md: 6 }, py: { xs: 3, md: 5 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
