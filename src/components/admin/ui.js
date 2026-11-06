'use client';
import { Box } from '@mui/material';
import { useT, GoldText } from '@/components/ui';

export function PageHeader({ title, subtitle, action }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', mb: 4 }}>
      <Box>
        <Box component="h1" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 28, md: 36 } }}><GoldText>{title}</GoldText></Box>
        {subtitle && <Box sx={{ color: 'text.secondary' }}>{subtitle}</Box>}
      </Box>
      {action}
    </Box>
  );
}

export function StatCard({ label, value }) {
  const t = useT();
  return (
    <Box sx={{ border: `1px solid ${t.line}`, bgcolor: t.card, p: 3 }}>
      <Box sx={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: t.goldText }}>{label}</Box>
      <Box sx={{ fontFamily: 'var(--font-lora), serif', fontSize: 36 }}><GoldText>{value}</GoldText></Box>
    </Box>
  );
}

export function Panel({ title, children, sx }) {
  const t = useT();
  return (
    <Box sx={{ border: `1px solid ${t.line}`, borderTop: `2px solid ${t.gold}`, bgcolor: t.card, p: 3.25, ...sx }}>
      {title && <Box component="h3" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: 22, mb: 2 }}><GoldText>{title}</GoldText></Box>}
      {children}
    </Box>
  );
}

export function ComingSoon({ title, points }) {
  return (
    <>
      <PageHeader title={title} subtitle="This section is built in the next step." />
      <Panel title="Planned">
        <Box component="ul" sx={{ m: 0, pl: 2.5, color: 'text.secondary', '& li': { py: 0.5 } }}>
          {points.map((p) => (<li key={p}>{p}</li>))}
        </Box>
      </Panel>
    </>
  );
}
