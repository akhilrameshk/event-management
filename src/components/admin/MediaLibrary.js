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
  '& .MuiSelect-icon': { color: '#D4AF37' },
  '& input::-webkit-calendar-picker-indicator': { filter: 'invert(1)' }
};

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
  
  const pill = (on) => ({ 
    cursor: 'pointer', 
    font: 'inherit', 
    border: `1px solid ${on ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)'}`, 
    bgcolor: on ? '#D4AF37' : 'transparent', 
    color: on ? '#0a0a0c' : '#E4E4E7', 
    px: 2.5, 
    py: 1, 
    fontSize: 12, 
    fontWeight: on ? 600 : 400,
    letterSpacing: '.14em', 
    textTransform: 'uppercase',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#D4AF37',
      bgcolor: on ? '#D4AF37' : 'rgba(212, 175, 55, 0.08)'
    }
  });

  const block = (e) => e.preventDefault();

  return (
    <>
      <PageHeader title="Media Library" subtitle={`${items.length} item${items.length === 1 ? '' : 's'}`} action={<GoldButton component={Link} href="/admin/upload">+ Upload</GoldButton>} />
      
      {!dbOk && <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>Database is not connected. Set MONGODB_URI in .env.local.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }} onClose={() => setError('')}>{error}</Alert>}

      {/* Filter and Search Bar */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4, alignItems: 'center' }}>
        {[['all', 'All'], ['photo', 'Photos'], ['video', 'Videos']].map(([v, l]) => (<Box key={v} component="button" onClick={() => setType(v)} sx={pill(type === v)}>{l}</Box>))}
        
        <TextField select size="small" value={cat} onChange={(e) => setCat(e.target.value)} sx={{ minWidth: 160, ml: { md: 1 }, ...inputSx }}>
          <MenuItem value="all" sx={{ bgcolor: '#0E0E12', color: '#fff' }}>All categories</MenuItem>
          {CATEGORIES.map((c) => (<MenuItem key={c} value={c} sx={{ bgcolor: '#0E0E12', color: '#fff' }}>{c}</MenuItem>))}
        </TextField>

        <TextField size="small" placeholder="Search title…" value={q} onChange={(e) => setQ(e.target.value)} sx={{ minWidth: 200, ...inputSx }} />
      </Box>

      {shown.length === 0 && <Box sx={{ color: 'rgba(255, 255, 255, 0.5)', py: 4 }}>{items.length ? 'Nothing matches the filters.' : 'No media yet. Upload your first photos and videos.'}</Box>}
      
      {/* Media Grid Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3,1fr)', xl: 'repeat(4,1fr)' }, gap: 3 }}>
        {shown.map((m) => (
          <Box 
            key={m.id} 
            sx={{ 
              border: '1px solid rgba(212, 175, 55, 0.15)', 
              bgcolor: '#0E0E12', 
              borderRadius: '12px',
              overflow: 'hidden',
              opacity: m.visible ? 1 : 0.45,
              transition: 'all 0.25s ease-in-out',
              '&:hover': {
                borderColor: 'rgba(212, 175, 55, 0.35)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box onClick={() => setView(m)} sx={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }}>
              <Photo src={m.thumb || undefined} alt={m.title} sx={{ height: 190, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.03)' } }} />
              {m.type === 'video' && <Box sx={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'rgba(0,0,0,.65)', border: '1px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PlayArrow /></Box></Box>}
              <Box sx={{ position: 'absolute', left: 10, top: 10, zIndex: 2, bgcolor: 'rgba(9, 9, 11, 0.85)', border: '1px solid #D4AF37', color: '#F5E6C8', px: 1.25, py: 0.25, fontSize: 10, fontWeight: 600, letterSpacing: '.1em', borderRadius: '4px', display: 'flex', gap: 0.5, alignItems: 'center' }}><ShieldOutlined sx={{ fontSize: 12 }} /> PROTECTED</Box>
              {m.featured && <Box sx={{ position: 'absolute', right: 10, top: 10, zIndex: 2, bgcolor: '#D4AF37', color: '#09090B', px: 1.25, py: 0.25, fontSize: 10, fontWeight: 600, letterSpacing: '.1em', borderRadius: '4px' }}>FEATURED</Box>}
            </Box>
            
            <Box sx={{ p: 2 }}>
              <Box sx={{ fontSize: 14, fontWeight: 600, color: '#F5E6C8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mb: 0.5 }}>{m.title}</Box>
              <Box sx={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' }}>{m.category} · {m.type === 'video' ? 'Video' : 'Photo'}{m.visible ? '' : ' · Hidden'}</Box>
              
              <Box sx={{ display: 'flex', gap: 2.5, mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                <Box component="button" onClick={() => setEdit({ ...m })} sx={{ cursor: 'pointer', font: 'inherit', bgcolor: 'transparent', border: 0, p: 0, color: '#D4AF37', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>Edit</Box>
                <Box component="button" onClick={() => remove(m)} sx={{ cursor: 'pointer', font: 'inherit', bgcolor: 'transparent', border: 0, p: 0, color: '#ff6b6b', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>Delete</Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Edit Dialog */}
      <Dialog 
        open={!!edit} 
        onClose={() => setEdit(null)} 
        fullWidth 
        maxWidth="xs"
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
        <DialogTitle sx={{ fontFamily: 'var(--font-lora), serif', color: '#F5E6C8', pt: 3, px: 3 }}>Edit media</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, px: 3, pt: '12px !important' }}>
          <TextField label="Title" value={edit?.title || ''} onChange={(e) => setEdit({ ...edit, title: e.target.value })} sx={inputSx} />
          
          <TextField select label="Category" value={edit?.category || CATEGORIES[0]} onChange={(e) => setEdit({ ...edit, category: e.target.value })} sx={inputSx}>
            {CATEGORIES.map((c) => (<MenuItem key={c} value={c} sx={{ bgcolor: '#0E0E12', color: '#fff' }}>{c}</MenuItem>))}
          </TextField>

          <TextField label="Event date" type="date" InputLabelProps={{ shrink: true }} value={edit?.eventDate || ''} onChange={(e) => setEdit({ ...edit, eventDate: e.target.value })} sx={inputSx} />
          
          <FormControlLabel 
            control={
              <Switch 
                checked={!!edit?.visible} 
                onChange={(e) => setEdit({ ...edit, visible: e.target.checked })} 
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#D4AF37' } }}
              />
            } 
            label="Visible on website" 
            sx={{ color: 'rgba(255, 255, 255, 0.8)' }} 
          />

          {edit?.type === 'photo' && (
            <FormControlLabel 
              control={
                <Switch 
                  checked={!!edit?.featured} 
                  onChange={(e) => setEdit({ ...edit, featured: e.target.checked })} 
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#D4AF37' } }}
                />
              } 
              label="Show on Home page (featured)" 
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }} 
            />
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <Button onClick={() => setEdit(null)} sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: '#fff' } }}>Cancel</Button>
          <GoldButton onClick={save} disabled={busy}>Save</GoldButton>
        </DialogActions>
      </Dialog>

      {/* Full Media View Dialog */}
      <Dialog 
        open={!!view} 
        onClose={() => setView(null)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { bgcolor: '#000', backgroundImage: 'none', overflow: 'hidden', borderRadius: '12px' }
        }}
      >
        <IconButton onClick={() => setView(null)} sx={{ position: 'absolute', right: 12, top: 12, zIndex: 3, color: '#fff', bgcolor: 'rgba(0,0,0,0.6)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }} aria-label="Close"><Close /></IconButton>
        {view?.type === 'photo' && <img src={view.src} alt={view.title} onContextMenu={block} draggable={false} style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', display: 'block' }} />}
        {view?.type === 'video' && <video src={view.src} controls playsInline controlsList="nodownload" onContextMenu={block} style={{ width: '100%', maxHeight: '85vh', display: 'block', background: '#000' }} />}
      </Dialog>
    </>
  );
}