'use client';
import { useState } from 'react';
import { Box, TextField, Alert } from '@mui/material';
import { useT, GoldButton } from '@/components/ui';
import { PageHeader, Panel } from './ui';
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

const toForm = (c) => ({
  home: { ...c.home, aboutPoints: c.home.aboutPoints.join('\n') },
  about: { ...c.about, stats: [...c.about.stats], values: c.about.values.map((v) => ({ ...v })) },
});

export default function PagesEditor({ initial, dbOk }) {
  const t = useT();
  const [f, setF] = useState(toForm(initial));
  const [images, setImages] = useState(initial.images || {}); // id -> { thumb }
  const [tab, setTab] = useState('home');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const setHome = (k, v) => setF({ ...f, home: { ...f.home, [k]: v } });
  const setAbout = (k, v) => setF({ ...f, about: { ...f.about, [k]: v } });
  const img = (section, key) => (id, thumb) => { if (id) setImages({ ...images, [id]: { thumb } }); (section === 'home' ? setHome : setAbout)(key, id); };
  const thumbOf = (id) => (id && images[id] ? images[id].thumb : null);

  const setRow = (key, i, patch) => setAbout(key, f.about[key].map((r, k) => (k === i ? { ...r, ...patch } : r)));
  const addRow = (key, row) => setAbout(key, [...f.about[key], row]);
  const delRow = (key, i) => setAbout(key, f.about[key].filter((_, k) => k !== i));

  const save = async () => {
    setBusy(true); setMsg(null);
    try {
      await api('/api/admin/content', 'PUT', { home: { ...f.home, aboutPoints: f.home.aboutPoints.split('\n') }, about: f.about });
      setMsg({ type: 'success', text: 'Saved. The website is updated.' });
    } catch (e) { setMsg({ type: 'error', text: e.message }); }
    setBusy(false);
  };

  const pill = (on) => ({ 
    cursor: 'pointer', 
    font: 'inherit', 
    border: `1px solid ${on ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)'}`, 
    bgcolor: on ? '#D4AF37' : 'transparent', 
    color: on ? '#0a0a0c' : '#E4E4E7', 
    px: 3, 
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

  const two = { display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 };

  return (
    <>
      <PageHeader title="Pages" subtitle="Text and photos of the Home and About pages" action={<GoldButton onClick={save} disabled={busy || !dbOk}>Save changes</GoldButton>} />
      
      {!dbOk && <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>Database is not connected. Set MONGODB_URI in .env.local.</Alert>}
      {msg && <Alert severity={msg.type} sx={{ mb: 3, bgcolor: msg.type === 'success' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: msg.type === 'success' ? '#34d399' : '#f87171', border: `1px solid ${msg.type === 'success' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }} onClose={() => setMsg(null)}>{msg.text}</Alert>}
      
      {/* Tab Switcher Pills */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 4 }}>
        <Box component="button" onClick={() => setTab('home')} sx={pill(tab === 'home')}>Home page</Box>
        <Box component="button" onClick={() => setTab('about')} sx={pill(tab === 'about')}>About page</Box>
      </Box>

      {tab === 'home' && (
        <Box sx={{ display: 'grid', gap: 3.5 }}>
          <Panel title="Hero (top of Home)">
            <ImageField label="Background photo" value={f.home.heroImage} thumb={thumbOf(f.home.heroImage)} onChange={img('home', 'heroImage')} />
          </Panel>
          
          <Panel title="About section on Home">
            <Box sx={{ display: 'grid', gap: 2.5 }}>
              <TextField label="Heading" value={f.home.aboutTitle} onChange={(e) => setHome('aboutTitle', e.target.value)} sx={inputSx} />
              <TextField label="Text" value={f.home.aboutText} onChange={(e) => setHome('aboutText', e.target.value)} multiline rows={4} sx={inputSx} />
              <TextField label="Highlights (one per line)" value={f.home.aboutPoints} onChange={(e) => setHome('aboutPoints', e.target.value)} multiline rows={3} sx={inputSx} />
              <Box sx={two}>
                <ImageField label="Large photo" value={f.home.aboutImage1} thumb={thumbOf(f.home.aboutImage1)} onChange={img('home', 'aboutImage1')} />
                <ImageField label="Small overlapping photo" value={f.home.aboutImage2} thumb={thumbOf(f.home.aboutImage2)} onChange={img('home', 'aboutImage2')} />
              </Box>
            </Box>
          </Panel>
          
          <Box sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 13 }}>Our Works cards use the works you set in Our Works. The featured gallery uses photos you mark as "Featured" in the Media Library. Testimonials are managed under Testimonials.</Box>
        </Box>
      )}

      {tab === 'about' && (
        <Box sx={{ display: 'grid', gap: 3.5 }}>
          <Panel title="Introduction (top of About)">
            <Box sx={{ display: 'grid', gap: 2.5 }}>
              <TextField label="Heading" value={f.about.introTitle} onChange={(e) => setAbout('introTitle', e.target.value)} sx={inputSx} />
              <TextField label="Text" value={f.about.introText} onChange={(e) => setAbout('introText', e.target.value)} multiline rows={4} sx={inputSx} />
              <ImageField label="Arch photo" value={f.about.introImage} thumb={thumbOf(f.about.introImage)} onChange={img('about', 'introImage')} />
            </Box>
          </Panel>

          <Panel title="Our story">
            <Box sx={{ display: 'grid', gap: 2.5 }}>
              <TextField label="Heading" value={f.about.storyTitle} onChange={(e) => setAbout('storyTitle', e.target.value)} sx={inputSx} />
              <TextField label="Story" value={f.about.storyText} onChange={(e) => setAbout('storyText', e.target.value)} multiline rows={5} sx={inputSx} />
            </Box>
          </Panel>

          <Panel title="Numbers (optional)">
            <Box sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 13, mb: 2 }}>Example: 500+ Events. The numbers band is hidden when this list is empty.</Box>
            {f.about.stats.map((s, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 2, mb: 1.5, alignItems: 'center' }}>
                <TextField size="small" label="Number" value={s.value} onChange={(e) => setRow('stats', i, { value: e.target.value })} sx={inputSx} />
                <TextField size="small" label="Label" value={s.label} onChange={(e) => setRow('stats', i, { label: e.target.value })} sx={inputSx} />
                <Box component="button" onClick={() => delRow('stats', i)} sx={{ cursor: 'pointer', bgcolor: 'transparent', border: 0, color: '#ff6b6b', fontSize: 22, fontWeight: 'bold' }} aria-label="Remove">×</Box>
              </Box>
            ))}
            {f.about.stats.length < 6 && <GoldButton outlined onClick={() => addRow('stats', { value: '', label: '' })}>+ Add number</GoldButton>}
          </Panel>

          <Panel title="Values">
            {f.about.values.map((v, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 2, mb: 1.5, alignItems: 'center' }}>
                <TextField size="small" label="Title" value={v.title} onChange={(e) => setRow('values', i, { title: e.target.value })} sx={inputSx} />
                <TextField size="small" label="Text" value={v.text} onChange={(e) => setRow('values', i, { text: e.target.value })} sx={inputSx} />
                <Box component="button" onClick={() => delRow('values', i)} sx={{ cursor: 'pointer', bgcolor: 'transparent', border: 0, color: '#ff6b6b', fontSize: 22, fontWeight: 'bold' }} aria-label="Remove">×</Box>
              </Box>
            ))}
            {f.about.values.length < 6 && <GoldButton outlined onClick={() => addRow('values', { title: '', text: '' })}>+ Add value</GoldButton>}
          </Panel>
          
          <Box sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 13 }}>Team members are managed under Team.</Box>
        </Box>
      )}

      <Box sx={{ mt: 4 }}><GoldButton onClick={save} disabled={busy || !dbOk}>Save changes</GoldButton></Box>
    </>
  );
}