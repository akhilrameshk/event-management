'use client';
import { useEffect, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useT, Photo, GoldButton } from '@/components/ui';
import { api } from './api';

// Dialog that lists uploaded photos so one can be chosen for a page, a team member and so on.
export function MediaPicker({ open, onClose, onPick }) {
  const t = useT();
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open) return;
    api('/api/admin/media?type=photo').then((d) => setPhotos(d.items)).catch((e) => setError(e.message));
  }, [open]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Choose a photo</DialogTitle>
      <DialogContent>
        {error && <Box sx={{ color: 'error.main' }}>{error}</Box>}
        {!error && photos.length === 0 && <Box sx={{ color: 'text.secondary' }}>No photos uploaded yet. Go to Upload first.</Box>}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, gap: 1.5, pt: 1 }}>
          {photos.map((p) => (
            <Box key={p.id} component="button" type="button" onClick={() => onPick(p)} sx={{ p: 0, border: `1px solid ${t.line}`, cursor: 'pointer', bgcolor: 'transparent' }}>
              <Photo src={p.thumb} alt={p.title} sx={{ height: 110 }} />
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// A labelled photo field: preview + Choose / Remove. `value` is a Media id.
export function ImageField({ label, value, thumb, onChange, hint }) {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box sx={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', mb: 1 }}>{label}</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Photo i={0} src={value ? thumb || undefined : undefined} sx={{ width: 120, height: 80, flexShrink: 0, opacity: value ? 1 : 0.5 }} />
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <GoldButton outlined onClick={() => setOpen(true)}>Choose photo</GoldButton>
          {value && <Box component="button" type="button" onClick={() => onChange('', null)} sx={{ cursor: 'pointer', font: 'inherit', bgcolor: 'transparent', border: 0, color: 'text.secondary', textDecoration: 'underline' }}>Remove</Box>}
        </Box>
      </Box>
      <Box sx={{ fontSize: 12, color: 'text.secondary', mt: 0.75 }}>{value ? 'Using your photo.' : hint || 'No photo chosen: a sample image is shown.'}</Box>
      <MediaPicker open={open} onClose={() => setOpen(false)} onPick={(p) => { onChange(p.id, p.thumb); setOpen(false); }} />
    </Box>
  );
}
