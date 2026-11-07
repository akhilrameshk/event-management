'use client';
import { Box } from '@mui/material';
import { useT, GoldText } from '@/components/ui';

export function PageHeader({ title, subtitle, action }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', mb: 4 }}>
      <Box>
        <Box component="h1" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 28, md: 36 }, mb: 0.5 }}>
          <GoldText>{title}</GoldText>
        </Box>
        {subtitle && <Box sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}>{subtitle}</Box>}
      </Box>
      {action}
    </Box>
  );
}

export function StatCard({ label, value }) {
  const t = useT();
  return (
    <Box 
      sx={{ 
        border: '1px solid rgba(212, 175, 55, 0.15)', 
        bgcolor: '#0E0E12', 
        p: 3, 
        borderRadius: '12px',
        transition: 'all 0.25s ease-in-out',
        '&:hover': {
          borderColor: 'rgba(212, 175, 55, 0.35)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box sx={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, mb: 1 }}>
        {label}
      </Box>
      <Box sx={{ fontFamily: 'var(--font-lora), serif', fontSize: 36, fontWeight: 600 }}>
        <GoldText>{value}</GoldText>
      </Box>
    </Box>
  );
}

export function Panel({ title, children, sx }) {
  const t = useT();
  return (
    <Box 
      sx={{ 
        border: '1px solid rgba(212, 175, 55, 0.15)', 
        borderTop: '2px solid #D4AF37', 
        bgcolor: '#0E0E12', 
        p: 3.25, 
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        ...sx 
      }}
    >
      {title && (
        <Box component="h3" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: 20, mb: 2.5, color: '#F5E6C8' }}>
          <GoldText>{title}</GoldText>
        </Box>
      )}
      {children}
    </Box>
  );
}

export function ComingSoon({ title, points }) {
  return (
    <>
      <PageHeader title={title} subtitle="This section is built in the next step." />
      <Panel title="Planned">
        <Box component="ul" sx={{ m: 0, pl: 2.5, color: 'rgba(255, 255, 255, 0.7)', '& li': { py: 0.5, fontSize: 14 } }}>
          {points.map((p) => (<li key={p}>{p}</li>))}
        </Box>
      </Panel>
    </>
  );
}