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
const PROTECTION = ['Auto watermark on public images', 'Download and right-click protection', 'Low-resolution public preview (originals stay private)'];

export default function DashboardView({ stats, dbOk }) {
  const t = useT();
  const v = (n) => (dbOk ? String(n) : '–');
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, Admin"
        action={<Box sx={{ display: 'flex', gap: 1.75 }}><GoldButton outlined component="a" href="/" target="_blank">View Website</GoldButton><GoldButton component={Link} href="/admin/upload">+ Upload</GoldButton></Box>}
      />
      {!dbOk && <Alert severity="warning" sx={{ mb: 3 }}>Database is not connected yet. Set MONGODB_URI in .env.local to see live numbers.</Alert>}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, gap: 3, mb: 4 }}>
        <StatCard label="Photos" value={v(stats.photos)} />
        <StatCard label="Videos" value={v(stats.videos)} />
        <StatCard label="Protected" value={v(stats.protectedCount)} />
        <StatCard label="Our Works" value={v(stats.works)} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.4fr' }, gap: 3.5, alignItems: 'start' }}>
        <Panel title="Quick Actions">
          {ACTIONS.map(([label, href]) => (
            <Box key={label} component={Link} href={href} sx={{ display: 'block', border: `1px solid ${t.line}`, px: 2.25, py: 1.75, mb: 1.5, fontSize: 14 }}>◇ &nbsp;{label}</Box>
          ))}
        </Panel>
        <Panel title="Copyright Protection">
          {PROTECTION.map((p) => (
            <Box key={p} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.75, borderBottom: `1px solid ${t.line}`, fontSize: 14 }}>
              <span>{p}</span><Box component="span" sx={{ color: t.goldText }}>Active</Box>
            </Box>
          ))}
        </Panel>
      </Box>
    </>
  );
}
