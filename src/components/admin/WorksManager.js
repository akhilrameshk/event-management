'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel, Alert, Button } from '@mui/material';
import { useT, Photo, GoldButton } from '@/components/ui';
import { PageHeader, Panel } from './ui';
import { api } from './api';

const blank = { id: null, title: '', description: '', points: '', coverMedia: null, visible: true, order: 0 };

export default function WorksManager({ initialWorks, dbOk }) {
  const t = useT();
  const router = useRouter();
  const [works, setWorks] = useState(initialWorks);
  const [form, setForm] = useState(null);
  const [picker, setPicker] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const reload = async () => { const d = await api('/api/admin/works'); setWorks(d.items); router.refresh(); };
  const run = async (fn) => { setError(''); setBusy(true); try { await fn(); } catch (e) { setError(e.message); } setBusy(false); };

  const openEdit = (w) => setForm(w ? { ...w, points: w.points.join('\n') } : { ...blank, order: works.length });
  const save = () => run(async () => {
    const body = { ...form, points: form.points.split('\n') };
    if (form.id) await api(`/api/admin/works/${form.id}`, 'PUT', body); else await api('/api/admin/works', 'POST', body);
    setForm(null); await reload();
  });
  const remove = (w) => { if (window.confirm(`Delete "${w.title}"?`)) run(async () => { await api(`/api/admin/works/${w.id}`, 'DELETE'); await reload(); }); };
  const toggle = (w) => run(async () => { await api(`/api/admin/works/${w.id}`, 'PUT', { visible: !w.visible }); await reload(); });
  const seed = () => run(async () => { await api('/api/admin/works/seed', 'POST'); await reload(); });

  useEffect(() => {
    if (!picker) return;
    api('/api/admin/media?type=photo').then((d) => setPhotos(d.items)).catch((e) => setError(e.message));
  }, [picker]);

  return (
    <>
      <PageHeader title="Our Works" subtitle="Service categories shown on the website" action={<GoldButton onClick={() => openEdit(null)} disabled={!dbOk}>+ Add Work</GoldButton>} />
      {!dbOk && <Alert severity="warning" sx={{ mb: 3 }}>Database is not connected. Set MONGODB_URI in .env.local.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      {works.length === 0 && dbOk && (
        <Panel title="No works yet">
          <Box sx={{ color: 'text.secondary', mb: 2 }}>The website is showing the default sample works. Copy them here to edit, or add your own.</Box>
          <GoldButton outlined onClick={seed} disabled={busy}>Import default works</GoldButton>
        </Panel>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3,1fr)' }, gap: 3 }}>
        {works.map((w) => (
          <Box key={w.id} sx={{ border: `1px solid ${t.line}`, bgcolor: t.card, opacity: w.visible ? 1 : 0.6 }}>
            <Photo i={0} src={w.coverThumb || undefined} alt={w.title} sx={{ height: 180 }} />
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ fontSize: 16 }}>{w.title}</Box>
                <Switch checked={w.visible} onChange={() => toggle(w)} size="small" inputProps={{ 'aria-label': 'Visible on website' }} />
              </Box>
              <Box sx={{ fontSize: 12, color: 'text.secondary', mb: 1.5 }}>{w.visible ? 'Visible on website' : 'Hidden'} · order {w.order}</Box>
              <Box sx={{ display: 'flex', gap: 2, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                <Box component="button" onClick={() => openEdit(w)} sx={{ cursor: 'pointer', font: 'inherit', bgcolor: 'transparent', border: 0, p: 0, color: t.goldText }}>Edit</Box>
                <Box component="button" onClick={() => remove(w)} sx={{ cursor: 'pointer', font: 'inherit', bgcolor: 'transparent', border: 0, p: 0, color: t.goldText }}>Delete</Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Dialog open={!!form} onClose={() => setForm(null)} fullWidth maxWidth="sm">
        <DialogTitle>{form?.id ? 'Edit work' : 'Add work'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="Title" value={form?.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <TextField label="Description" value={form?.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} multiline rows={3} />
          <TextField label="Highlights (one per line)" value={form?.points || ''} onChange={(e) => setForm({ ...form, points: e.target.value })} multiline rows={3} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Photo i={0} src={form?.coverThumb || undefined} sx={{ width: 120, height: 80, flexShrink: 0 }} />
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <GoldButton outlined onClick={() => setPicker(true)}>Choose cover photo</GoldButton>
              {form?.coverMedia && <Button onClick={() => setForm({ ...form, coverMedia: null, coverThumb: null })}>Remove</Button>}
            </Box>
          </Box>
          <TextField label="Order (smaller shows first)" type="number" value={form?.order ?? 0} onChange={(e) => setForm({ ...form, order: e.target.value })} />
          <FormControlLabel control={<Switch checked={!!form?.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />} label="Visible on website" />
          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setForm(null)}>Cancel</Button>
          <GoldButton onClick={save} disabled={busy || !form?.title?.trim()}>Save</GoldButton>
        </DialogActions>
      </Dialog>

      <Dialog open={picker} onClose={() => setPicker(false)} fullWidth maxWidth="md">
        <DialogTitle>Choose a cover photo</DialogTitle>
        <DialogContent>
          {photos.length === 0 && <Box sx={{ color: 'text.secondary' }}>No photos uploaded yet. Upload photos first.</Box>}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, gap: 1.5, pt: 1 }}>
            {photos.map((p) => (
              <Box key={p.id} component="button" onClick={() => { setForm({ ...form, coverMedia: p.id, coverThumb: p.thumb }); setPicker(false); }} sx={{ p: 0, border: `1px solid ${t.line}`, cursor: 'pointer', bgcolor: 'transparent' }}>
                <Photo src={p.thumb} alt={p.title} sx={{ height: 110 }} />
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
