'use client';
import Link from 'next/link';
import { Box, Alert } from '@mui/material';
import { useT, GoldButton } from '@/components/ui';
import { PageHeader, StatCard, Panel } from './ui';

const ACTIONS = [
  ['Edit Home & About', '/admin/pages'],
  ['Add Team Member', '/admin/team'],
  ['Add New Work', '/admin/works'],
  ['Upload Photos', '/admin/upload'],
  ['Upload Video', '/admin/upload'],
  ['Media Library', '/admin/media'],
];

const PROTECTION = [
  'Auto watermark on public images', 
  'Download and right-click protection', 
  'Low-resolution public preview (originals stay private)'
];

export default function DashboardView({ stats, dbOk }) {
  const t = useT();
  const v = (n) => (dbOk ? String(n) : '–');

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, Admin"
        action={
          <Box sx={{ display: 'flex', gap: 1.75 }}>
            <GoldButton outlined component="a" href="/" target="_blank">View Website</GoldButton>
            <GoldButton component={Link} href="/admin/upload">+ Upload</GoldButton>
          </Box>
        }
      />

      {!dbOk && (
        <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          Database is not connected yet. Set MONGODB_URI in .env.local to see live numbers.
        </Alert>
      )}

      {/* Stats Grid Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, gap: 3, mb: 4 }}>
        <StatCard label="Photos" value={v(stats.photos)} />
        <StatCard label="Videos" value={v(stats.videos)} />
        <StatCard label="Protected" value={v(stats.protectedCount)} />
        <StatCard label="Our Works" value={v(stats.works)} />
      </Box>

      {/* Quick Actions & Copyright Protection Panels */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.4fr' }, gap: 3.5, alignItems: 'start' }}>
        
        {/* Quick Actions Panel */}
        <Panel title="Quick Actions">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
            {ACTIONS.map(([label, href]) => (
              <Box 
                key={label} 
                component={Link} 
                href={href} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  border: '1px solid rgba(212, 175, 55, 0.15)', 
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '8px',
                  px: 2.5, 
                  py: 1.75, 
                  fontSize: 14, 
                  color: '#E4E4E7',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { 
                    borderColor: '#D4AF37', 
                    bgcolor: 'rgba(212, 175, 55, 0.08)',
                    color: '#F5E6C8',
                    transform: 'translateX(4px)'
                  } 
                }}
              >
                <Box component="span" sx={{ color: '#D4AF37', fontSize: 12 }}>◆</Box>
                {label}
              </Box>
            ))}
          </Box>
        </Panel>

        {/* Copyright Protection Panel */}
        <Panel title="Copyright Protection">
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
            {PROTECTION.map((p, index) => (
              <Box 
                key={p} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 2, 
                  borderBottom: index !== PROTECTION.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none', 
                  fontSize: 14,
                  color: 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <span>{p}</span>
                <Box 
                  component="span" 
                  sx={{ 
                    color: '#34d399', 
                    bgcolor: 'rgba(52, 211, 153, 0.1)', 
                    border: '1px solid rgba(52, 211, 153, 0.2)', 
                    px: 1.5, 
                    py: 0.5, 
                    borderRadius: '4px', 
                    fontSize: 12, 
                    fontWeight: 600,
                    letterSpacing: '.05em'
                  }}
                >
                  Active
                </Box>
              </Box>
            ))}
          </Box>
        </Panel>

      </Box>
    </>
  );
}