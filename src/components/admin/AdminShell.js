'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Drawer, IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import PhotoLibraryOutlined from '@mui/icons-material/PhotoLibraryOutlined';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import FormatQuote from '@mui/icons-material/FormatQuote';
import Logout from '@mui/icons-material/Logout';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import { useThemeMode } from '@/theme/ThemeContext';
import { useT } from '@/components/ui';

export const ADMIN_MENU = [
  { label: 'Dashboard', href: '/admin', Icon: DashboardOutlined },
  { label: 'Pages (Home & About)', href: '/admin/pages', Icon: DescriptionOutlined },
  { label: 'Our Works', href: '/admin/works', Icon: AutoAwesomeOutlined },
  { label: 'Team', href: '/admin/team', Icon: GroupsOutlined },
  { label: 'Testimonials', href: '/admin/testimonials', Icon: FormatQuote },
  { label: 'Media Library', href: '/admin/media', Icon: PhotoLibraryOutlined },
  { label: 'Upload', href: '/admin/upload', Icon: CloudUploadOutlined },
  { label: 'Settings', href: '/admin/settings', Icon: SettingsOutlined },
];

const isActive = (path, href) => (href === '/admin' ? path === '/admin' : path.startsWith(href));

function SideMenu({ email, onNavigate, onLogout }) {
  const t = useT();
  const path = usePathname();
  
  return (
    <Box sx={{ 
      height: '100%', 
      bgcolor: '#060608', 
      color: '#A0A0A5', 
      display: 'flex', 
      flexDirection: 'column', 
      py: 3.5,
      borderRight: '1px solid rgba(212, 175, 55, 0.15)'
    }}>
      {/* Brand Logo Section */}
      <Box sx={{ px: 3.5, pb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Image src="/logo.png" alt="Elegant Events" width={760} height={311} style={{ width: 140, height: 'auto', filter: 'drop-shadow(0px 2px 4px rgba(212,175,55,0.2))' }} />
      </Box>

      {/* Navigation Links */}
      <Box component="nav" sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5, px: 2 }}>
        {ADMIN_MENU.map(({ label, href, Icon }) => {
          const on = isActive(path, href);
          return (
            <Box 
              key={href} 
              component={Link} 
              href={href} 
              onClick={onNavigate} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                px: 2.5, 
                py: 1.5, 
                borderRadius: '8px',
                fontSize: 14, 
                fontWeight: on ? 600 : 400,
                color: on ? '#F5E6C8' : '#9BA1A6', 
                bgcolor: on ? 'rgba(212,175,55,0.12)' : 'transparent', 
                borderLeft: `3px solid ${on ? '#D4AF37' : 'transparent'}`,
                transition: 'all 0.25s ease-in-out',
                '&:hover': { 
                  color: '#F5E6C8', 
                  bgcolor: 'rgba(212,175,55,0.07)',
                  transform: 'translateX(4px)'
                } 
              }}
            >
              <Icon sx={{ fontSize: 20, color: on ? '#D4AF37' : 'inherit' }} /> 
              {label}
            </Box>
          );
        })}
      </Box>

      {/* User Profile & Logout Box */}
      <Box sx={{ px: 3, pt: 3, mx: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)', bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', pb: 2 }}>
        <Box sx={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(255, 255, 255, 0.4)', mb: 0.5 }}>
          Signed in as
        </Box>
        <Box sx={{ color: '#D4AF37', wordBreak: 'break-all', mb: 2, fontSize: 13, fontWeight: 500 }}>
          {email}
        </Box>
        <Box 
          component="button" 
          onClick={onLogout} 
          sx={{ 
            width: '100%',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 1.25, 
            cursor: 'pointer', 
            font: 'inherit', 
            fontSize: 13, 
            fontWeight: 500,
            color: '#ff6b6b', 
            bgcolor: 'rgba(255, 107, 107, 0.08)', 
            border: '1px solid rgba(255, 107, 107, 0.2)', 
            borderRadius: '6px',
            px: 2, 
            py: 1.1,
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'rgba(255, 107, 107, 0.15)',
              borderColor: 'rgba(255, 107, 107, 0.4)'
            }
          }}
        >
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#09090B', color: '#E4E4E7' }}>
      {/* Desktop Side Menu */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, width: 270, flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <SideMenu email={email} onLogout={logout} />
      </Box>

      {/* Mobile Drawer */}
      <Drawer open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 270, backgroundImage: 'none', bgcolor: '#060608' } }}>
        <SideMenu email={email} onNavigate={() => setOpen(false)} onLogout={logout} />
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header Bar */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          px: { xs: 3, md: 6 }, 
          height: 70, 
          borderBottom: '1px solid rgba(212, 175, 55, 0.15)', 
          bgcolor: '#0c0c0f',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ display: { md: 'none' }, color: '#D4AF37' }} onClick={() => setOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
            <Box sx={{ fontFamily: 'var(--font-lora), serif', fontSize: 20, fontWeight: 500, color: '#F5E6C8', letterSpacing: '.05em' }}>
              {current ? current.label : 'Admin Dashboard'}
            </Box>
          </Box>

          <Tooltip title="Switch Theme">
            <IconButton onClick={toggle} sx={{ color: '#D4AF37', bgcolor: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', '&:hover': { bgcolor: 'rgba(212,175,55,0.15)' } }} aria-label="Switch theme">
              {mode === 'dark' ? <LightModeOutlined sx={{ fontSize: 20 }} /> : <DarkModeOutlined sx={{ fontSize: 20 }} />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Page Content */}
        <Box component="main" sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 }, flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}