'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel, Alert, Button } from '@mui/material';
import { useT, Photo, GoldButton } from '@/components/ui';
import { PageHeader } from './ui';
import { ImageField } from './MediaPicker';
import { api } from './api';

// Dark Mode Input Styles for Material UI Components
const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#E4E4E7',
    bgcolor: 'rgba(255, 255, 255, 0.03)',
    '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(212, 175, 55, 0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.6)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
  '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.4)' },
};

export default function CrudManager({ config, initialItems, dbOk }) {
  const t = useT();
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const reload = async () => { const d = await api(config.endpoint); setItems(d.items); router.refresh(); };
  const run = async (fn) => { setError(''); setBusy(true); try { await fn(); } catch (e) { setError(e.message); } setBusy(false); };
  const save = () => run(async () => {
    if (form.id) await api(`${config.endpoint}/${form.id}`, 'PUT', form); else await api(config.endpoint, 'POST', form);
    setForm(null); await reload();
  });
  const remove = (it) => { if (window.confirm('Delete this item?')) run(async () => { await api(`${config.endpoint}/${it.id}`, 'DELETE'); await reload(); }); };
  const toggle = (it) => run(async () => { await api(`${config.endpoint}/${it.id}`, 'PUT', { visible: !it.visible }); await reload(); });

  return (
    <>
      <PageHeader 
        title={config.title} 
        subtitle={config.subtitle} 
        action={<GoldButton onClick={() => setForm({ ...config.blank, order: items.length })} disabled={!dbOk}>{config.addLabel}</GoldButton>} 
      />
      
      {!dbOk && <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>Database is not connected. Set MONGODB_URI in .env.local.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }} onClose={() => setError('')}>{error}</Alert>}
      {items.length === 0 && dbOk && <Box sx={{ color: 'rgba(255, 255, 255, 0.5)', py: 4 }}>{config.emptyText}</Box>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3,1fr)' }, gap: 3 }}>
        {items.map((it) => (
          <Box 
            key={it.id} 
            sx={{ 
              border: '1px solid rgba(212, 175, 55, 0.15)', 
              bgcolor: '#0E0E12', 
              borderRadius: '12px',
              overflow: 'hidden',
              opacity: it.visible ? 1 : 0.5,
              transition: 'all 0.25s ease-in-out',
              '&:hover': {
                borderColor: 'rgba(212, 175, 55, 0.35)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            {config.imageThumbKey && <Photo i={0} src={it[config.imageThumbKey] || undefined} alt={it[config.titleKey]} sx={{ height: 180 }} />}
            <Box sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ fontSize: 16, fontWeight: 600, color: '#F5E6C8', fontFamily: 'var(--font-lora), serif' }}>{it[config.titleKey]}</Box>
                <Switch 
                  checked={it.visible} 
                  onChange={() => toggle(it)} 
                  size="small" 
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#D4AF37' }
                  }}
                  inputProps={{ 'aria-label': 'Visible on website' }} 
                />
              </Box>
              <Box sx={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.65)', mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>{it[config.subKey]}</Box>
              
              <Box sx={{ display: 'flex', gap: 2.5, pt: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Box 
                  component="button" 
                  onClick={() => setForm({ ...it })} 
                  sx={{ 
                    cursor: 'pointer', 
                    bgcolor: 'transparent', 
                    border: 0, 
                    p: 0, 
                    color: '#D4AF37', 
                    fontSize: 12, 
                    fontWeight: 600, 
                    letterSpacing: '.1em', 
                    textTransform: 'uppercase',
                    '&:hover': { textDecoration: 'underline' } 
                  }}
                >
                  Edit
                </Box>
                <Box 
                  component="button" 
                  onClick={() => remove(it)} 
                  sx={{ 
                    cursor: 'pointer', 
                    bgcolor: 'transparent', 
                    border: 0, 
                    p: 0, 
                    color: '#ff6b6b', 
                    fontSize: 12, 
                    fontWeight: 600, 
                    letterSpacing: '.1em', 
                    textTransform: 'uppercase',
                    '&:hover': { textDecoration: 'underline' } 
                  }}
                >
                  Delete
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Edit / Add Item Dialog */}
      <Dialog 
        open={!!form} 
        onClose={() => setForm(null)} 
        fullWidth 
        maxWidth="sm"
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
          {form?.id ? 'Edit Item' : 'Add Item'}
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, px: 3, pt: '12px !important' }}>
          {form && config.fields.map((f) => f.type === 'image' ? (
            <ImageField key={f.key} label={f.label} value={form[f.key]} thumb={form[`${f.key}Thumb`]} onChange={(id, th) => setForm({ ...form, [f.key]: id || null, [`${f.key}Thumb`]: th })} />
          ) : (
            <TextField 
              key={f.key} 
              label={f.label} 
              helperText={f.helper} 
              value={form[f.key] ?? ''} 
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} 
              multiline={f.type === 'multiline'} 
              rows={f.type === 'multiline' ? 3 : undefined} 
              type={f.type === 'number' ? 'number' : 'text'} 
              required={f.required} 
              sx={inputSx}
            />
          ))}

          {form && (
            <FormControlLabel 
              control={
                <Switch 
                  checked={!!form.visible} 
                  onChange={(e) => setForm({ ...form, visible: e.target.checked })} 
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#D4AF37' }
                  }}
                />
              } 
              label="Visible on website" 
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
            />
          )}

          {error && <Alert severity="error" sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>{error}</Alert>}
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <Button onClick={() => setForm(null)} sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: '#fff' } }}>Cancel</Button>
          <GoldButton onClick={save} disabled={busy}>Save</GoldButton>
        </DialogActions>
      </Dialog>
    </>
  );
}