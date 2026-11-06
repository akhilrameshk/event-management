'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Switch, FormControlLabel, Alert, Button, IconButton } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import Close from '@mui/icons-material/Close';
import { CATEGORIES } from '@/config/site';
import { useT, Photo, GoldButton } from '@/components/ui';
import { PageHeader } from './ui';
import { api } from './api';

export default function MediaLibrary({ initialItems, dbOk }) {
  const t = useT();
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [type, setType] = useState('all');
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null);
  const [view, setView] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const shown = items.filter((m) => (type === 'all' || m.type === type) && (cat === 'all' || m.category === cat) && (!q || m.title.toLowerCase().includes(q.toLowerCase())));
  const run = async (fn) => { setError(''); setBusy(true); try { await fn(); } catch (e) { setError(e.message); } setBusy(false); };
  const patch = (id, body) => api(`/api/admin/media/${id}`, 'PATCH', body).then((d) => { setItems((xs) => xs.map((x) => (x.id === id ? d.item : x))); router.refresh(); return d.item; });
  const save = () => run(async () => { await patch(edit.id, { title: edit.title, category: edit.category, eventDate: edit.eventDate, visible: edit.visible, featured: edit.featured }); setEdit(null); });
  const remove = (m) => { if (window.confirm(`Delete "${m.title}"? The original file will be removed too.`)) run(async () => { await api(`/api/admin/media/${m.id}`, 'DELETE'); setItems((xs) => xs.filter((x) => x.id !== m.id)); router.refresh(); }); };
  const pill = (on) => ({ cursor: 'pointer', font: 'inherit', border: `1px solid ${on ? t.gold : t.line}`, bgcolor: on ? t.gold : 'transparent', color: on ? '#0a0a0c' : 'text.primary', px: 2.5, py: 0.9, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' });
  const block = (e) => e.preventDefault();

  return (
    <>
      <PageHeader title="Media Library" subtitle={`${items.length} item${items.length === 1 ? '' : 's'}`} action={<GoldButton component={Link} href="/admin/upload">+ Upload</GoldButton>} />
      {!dbOk && <Alert severity="warning" sx={{ mb: 3 }}>Database is not connected. Set MONGODB_URI in .env.local.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, alignItems: 'center' }}>
        {[['all', 'All'], ['photo', 'Photos'], ['video', 'Videos']].map(([v, l]) => (<Box key={v} component="button" onClick={() => setType(v)} sx={pill(type === v)}>{l}</Box>))}
        <TextField select size="small" value={cat} onChange={(e) => setCat(e.target.value)} sx={{ minWidth: 160, ml: { md: 2 } }}>
          <MenuItem value="all">All categories</MenuItem>
          {CATEGORIES.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
        </TextField>
        <TextField size="small" placeholder="Search title…" value={q} onChange={(e) => setQ(e.target.value)} />
      </Box>

      {shown.length === 0 && <Box sx={{ color: 'text.secondary' }}>{items.length ? 'Nothing matches the filters.' : 'No media yet. Upload your first photos and videos.'}</Box>}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3,1fr)', xl: 'repeat(4,1fr)' }, gap: 2.5 }}>
        {shown.map((m) => (
          <Box key={m.id} sx={{ border: `1px solid ${t.line}`, bgcolor: t.card, opacity: m.visible ? 1 : 0.6 }}>
            <Box onClick={() => setView(m)} sx={{ position: 'relative', cursor: 'pointer' }}>
              <Photo src={m.thumb || undefined} alt={m.title} sx={{ height: 190 }} />
              {m.type === 'video' && <Box sx={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'rgba(0,0,0,.55)', border: '1px solid #f1d98a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PlayArrow /></Box></Box>}
              <Box sx={{ position: 'absolute', left: 10, top: 10, zIndex: 2, bgcolor: `${t.overlay}.85)`, border: `1px solid ${t.gold}`, color: t.goldLight, px: 1.25, py: 0.25, fontSize: 11, letterSpacing: '.1em', display: 'flex', gap: 0.75, alignItems: 'center' }}><ShieldOutlined sx={{ fontSize: 13 }} /> PROTECTED</Box>
              {m.featured && <Box sx={{ position: 'absolute', right: 10, top: 10, zIndex: 2, bgcolor: t.gold, color: '#0a0a0c', px: 1.25, py: 0.25, fontSize: 11, letterSpacing: '.1em' }}>FEATURED</Box>}
            </Box>
            <Box sx={{ p: 1.75 }}>
              <Box sx={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</Box>
              <Box sx={{ fontSize: 12, color: 'text.secondary' }}>{m.category} · {m.type === 'video' ? 'Video' : 'Photo'}{m.visible ? '' : ' · Hidden'}</Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 1, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                <Box component="button" onClick={() => setEdit({ ...m })} sx={{ cursor: 'pointer', font: 'inherit', bgcolor: 'transparent', border: 0, p: 0, color: t.goldText }}>Edit</Box>
                <Box component="button" onClick={() => remove(m)} sx={{ cursor: 'pointer', font: 'inherit', bgcolor: 'transparent', border: 0, p: 0, color: t.goldText }}>Delete</Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Dialog open={!!edit} onClose={() => setEdit(null)} fullWidth maxWidth="xs">
        <DialogTitle>Edit media</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="Title" value={edit?.title || ''} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
          <TextField select label="Category" value={edit?.category || CATEGORIES[0]} onChange={(e) => setEdit({ ...edit, category: e.target.value })}>
            {CATEGORIES.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
          </TextField>
          <TextField label="Event date" type="date" InputLabelProps={{ shrink: true }} value={edit?.eventDate || ''} onChange={(e) => setEdit({ ...edit, eventDate: e.target.value })} />
          <FormControlLabel control={<Switch checked={!!edit?.visible} onChange={(e) => setEdit({ ...edit, visible: e.target.checked })} />} label="Visible on website" />
          {edit?.type === 'photo' && <FormControlLabel control={<Switch checked={!!edit?.featured} onChange={(e) => setEdit({ ...edit, featured: e.target.checked })} />} label="Show on Home page (featured)" />}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}><Button onClick={() => setEdit(null)}>Cancel</Button><GoldButton onClick={save} disabled={busy}>Save</GoldButton></DialogActions>
      </Dialog>

      <Dialog open={!!view} onClose={() => setView(null)} maxWidth="lg" fullWidth>
        <IconButton onClick={() => setView(null)} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 3, color: '#fff', bgcolor: 'rgba(0,0,0,.4)' }} aria-label="Close"><Close /></IconButton>
        {view?.type === 'photo' && <img src={view.src} alt={view.title} onContextMenu={block} draggable={false} style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', display: 'block' }} />}
        {view?.type === 'video' && <video src={view.src} controls playsInline controlsList="nodownload" onContextMenu={block} style={{ width: '100%', maxHeight: '85vh', display: 'block', background: '#000' }} />}
      </Dialog>
    </>
  );
}
