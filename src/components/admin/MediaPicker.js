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
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          bgcolor: '#0E0E12',
          backgroundImage: 'none',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '14px',
          color: '#E4E4E7'
        }
      }}
    >
      <DialogTitle sx={{ fontFamily: 'var(--font-lora), serif', color: '#F5E6C8', pt: 3, px: 3 }}>
        Choose a photo
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, pb: 3 }}>
        {error && <Box sx={{ color: '#f87171', mb: 2 }}>{error}</Box>}
        {!error && photos.length === 0 && <Box sx={{ color: 'rgba(255, 255, 255, 0.5)', py: 3 }}>No photos uploaded yet. Go to Upload first.</Box>}
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, gap: 2, pt: 1 }}>
          {photos.map((p) => (
            <Box 
              key={p.id} 
              component="button" 
              type="button" 
              onClick={() => onPick(p)} 
              sx={{ 
                p: 0, 
                border: '1px solid rgba(212, 175, 55, 0.2)', 
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer', 
                bgcolor: 'transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#D4AF37',
                  transform: 'scale(1.02)'
                }
              }}
            >
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
    <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(212, 175, 55, 0.12)', p: 2, borderRadius: '10px' }}>
      <Box sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#F5E6C8', mb: 1.5 }}>
        {label}
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <Box sx={{ border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
          <Photo i={0} src={value ? thumb || undefined : undefined} sx={{ width: 120, height: 80, opacity: value ? 1 : 0.4 }} />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <GoldButton outlined onClick={() => setOpen(true)}>Choose photo</GoldButton>
          {value && (
            <Box 
              component="button" 
              type="button" 
              onClick={() => onChange('', null)} 
              sx={{ 
                cursor: 'pointer', 
                font: 'inherit', 
                bgcolor: 'transparent', 
                border: 0, 
                color: '#ff6b6b', 
                fontSize: 13, 
                fontWeight: 500,
                textDecoration: 'underline',
                '&:hover': { color: '#ff8787' } 
              }}
            >
              Remove
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', mt: 1.5 }}>
        {value ? 'Using your photo.' : hint || 'No photo chosen: a sample image is shown.'}
      </Box>

      <MediaPicker open={open} onClose={() => setOpen(false)} onPick={(p) => { onChange(p.id, p.thumb); setOpen(false); }} />
    </Box>
  );
}