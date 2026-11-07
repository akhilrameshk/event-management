'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel, Alert, Button } from '@mui/material';
import { useT, Photo, GoldButton } from '@/components/ui';
import { PageHeader } from './ui';
import { ImageField } from './MediaPicker';
import { api } from './api';

// One screen for a simple list (team members, testimonials): cards + add / edit / hide / delete.
// config: { title, subtitle, endpoint, addLabel, blank, fields:[{key,label,type,helper}], titleKey, subKey, imageThumbKey, emptyText }
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
  const link = { cursor: 'pointer', font: 'inherit', bgcolor: 'transparent', border: 0, p: 0, color: t.goldText };

  return (
    <>
      <PageHeader title={config.title} subtitle={config.subtitle} action={<GoldButton onClick={() => setForm({ ...config.blank, order: items.length })} disabled={!dbOk}>{config.addLabel}</GoldButton>} />
      {!dbOk && <Alert severity="warning" sx={{ mb: 3 }}>Database is not connected. Set MONGODB_URI in .env.local.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {items.length === 0 && dbOk && <Box sx={{ color: 'text.secondary' }}>{config.emptyText}</Box>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3,1fr)' }, gap: 3 }}>
        {items.map((it) => (
          <Box key={it.id} sx={{ border: `1px solid ${t.line}`, bgcolor: t.card, opacity: it.visible ? 1 : 0.6 }}>
            {config.imageThumbKey && <Photo i={0} src={it[config.imageThumbKey] || undefined} alt={it[config.titleKey]} sx={{ height: 180 }} />}
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ fontSize: 16 }}>{it[config.titleKey]}</Box>
                <Switch checked={it.visible} onChange={() => toggle(it)} size="small" inputProps={{ 'aria-label': 'Visible on website' }} />
              </Box>
              <Box sx={{ fontSize: 13, color: 'text.secondary', mb: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it[config.subKey]}</Box>
              <Box sx={{ display: 'flex', gap: 2, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                <Box component="button" onClick={() => setForm({ ...it })} sx={link}>Edit</Box>
                <Box component="button" onClick={() => remove(it)} sx={link}>Delete</Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Dialog open={!!form} onClose={() => setForm(null)} fullWidth maxWidth="sm">
        <DialogTitle>{form?.id ? 'Edit' : 'Add'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          {form && config.fields.map((f) => f.type === 'image' ? (
            <ImageField key={f.key} label={f.label} value={form[f.key]} thumb={form[`${f.key}Thumb`]} onChange={(id, th) => setForm({ ...form, [f.key]: id || null, [`${f.key}Thumb`]: th })} />
          ) : (
            <TextField key={f.key} label={f.label} helperText={f.helper} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} multiline={f.type === 'multiline'} rows={f.type === 'multiline' ? 3 : undefined} type={f.type === 'number' ? 'number' : 'text'} required={f.required} />
          ))}
          {form && <FormControlLabel control={<Switch checked={!!form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />} label="Visible on website" />}
          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setForm(null)}>Cancel</Button>
          <GoldButton onClick={save} disabled={busy}>Save</GoldButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
