'use client';
import { useState } from 'react';
import { Box, TextField, Alert } from '@mui/material';
import { useT, GoldButton } from '@/components/ui';
import { PageHeader, Panel } from './ui';
import { ImageField } from './MediaPicker';
import { api } from './api';

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

  const pill = (on) => ({ cursor: 'pointer', font: 'inherit', border: `1px solid ${on ? t.gold : t.line}`, bgcolor: on ? t.gold : 'transparent', color: on ? '#0a0a0c' : 'text.primary', px: 3, py: 1, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' });
  const two = { display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 };

  return (
    <>
      <PageHeader title="Pages" subtitle="Text and photos of the Home and About pages" action={<GoldButton onClick={save} disabled={busy || !dbOk}>Save changes</GoldButton>} />
      {!dbOk && <Alert severity="warning" sx={{ mb: 3 }}>Database is not connected. Set MONGODB_URI in .env.local.</Alert>}
      {msg && <Alert severity={msg.type} sx={{ mb: 3 }} onClose={() => setMsg(null)}>{msg.text}</Alert>}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Box component="button" onClick={() => setTab('home')} sx={pill(tab === 'home')}>Home page</Box>
        <Box component="button" onClick={() => setTab('about')} sx={pill(tab === 'about')}>About page</Box>
      </Box>

      {tab === 'home' && (
        <Box sx={{ display: 'grid', gap: 3.5 }}>
          <Panel title="Hero (top of Home)">
            <ImageField label="Background photo" value={f.home.heroImage} thumb={thumbOf(f.home.heroImage)} onChange={img('home', 'heroImage')} />
          </Panel>
          <Panel title="About section on Home">
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField label="Heading" value={f.home.aboutTitle} onChange={(e) => setHome('aboutTitle', e.target.value)} />
              <TextField label="Text" value={f.home.aboutText} onChange={(e) => setHome('aboutText', e.target.value)} multiline rows={4} />
              <TextField label="Highlights (one per line)" value={f.home.aboutPoints} onChange={(e) => setHome('aboutPoints', e.target.value)} multiline rows={3} />
              <Box sx={two}>
                <ImageField label="Large photo" value={f.home.aboutImage1} thumb={thumbOf(f.home.aboutImage1)} onChange={img('home', 'aboutImage1')} />
                <ImageField label="Small overlapping photo" value={f.home.aboutImage2} thumb={thumbOf(f.home.aboutImage2)} onChange={img('home', 'aboutImage2')} />
              </Box>
            </Box>
          </Panel>
          <Box sx={{ color: 'text.secondary', fontSize: 13 }}>Our Works cards use the works you set in Our Works. The featured gallery uses photos you mark as "Featured" in the Media Library. Testimonials are managed under Testimonials.</Box>
        </Box>
      )}

      {tab === 'about' && (
        <Box sx={{ display: 'grid', gap: 3.5 }}>
          <Panel title="Introduction (top of About)">
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField label="Heading" value={f.about.introTitle} onChange={(e) => setAbout('introTitle', e.target.value)} />
              <TextField label="Text" value={f.about.introText} onChange={(e) => setAbout('introText', e.target.value)} multiline rows={4} />
              <ImageField label="Arch photo" value={f.about.introImage} thumb={thumbOf(f.about.introImage)} onChange={img('about', 'introImage')} />
            </Box>
          </Panel>
          <Panel title="Our story">
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField label="Heading" value={f.about.storyTitle} onChange={(e) => setAbout('storyTitle', e.target.value)} />
              <TextField label="Story" value={f.about.storyText} onChange={(e) => setAbout('storyText', e.target.value)} multiline rows={5} />
            </Box>
          </Panel>
          <Panel title="Numbers (optional)">
            <Box sx={{ color: 'text.secondary', fontSize: 13, mb: 2 }}>Example: 500+ Events. The numbers band is hidden when this list is empty.</Box>
            {f.about.stats.map((s, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 2, mb: 1.5 }}>
                <TextField size="small" label="Number" value={s.value} onChange={(e) => setRow('stats', i, { value: e.target.value })} />
                <TextField size="small" label="Label" value={s.label} onChange={(e) => setRow('stats', i, { label: e.target.value })} />
                <Box component="button" onClick={() => delRow('stats', i)} sx={{ cursor: 'pointer', bgcolor: 'transparent', border: 0, color: 'text.secondary', fontSize: 22 }} aria-label="Remove">×</Box>
              </Box>
            ))}
            {f.about.stats.length < 6 && <GoldButton outlined onClick={() => addRow('stats', { value: '', label: '' })}>+ Add number</GoldButton>}
          </Panel>
          <Panel title="Values">
            {f.about.values.map((v, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 2, mb: 1.5 }}>
                <TextField size="small" label="Title" value={v.title} onChange={(e) => setRow('values', i, { title: e.target.value })} />
                <TextField size="small" label="Text" value={v.text} onChange={(e) => setRow('values', i, { text: e.target.value })} />
                <Box component="button" onClick={() => delRow('values', i)} sx={{ cursor: 'pointer', bgcolor: 'transparent', border: 0, color: 'text.secondary', fontSize: 22 }} aria-label="Remove">×</Box>
              </Box>
            ))}
            {f.about.values.length < 6 && <GoldButton outlined onClick={() => addRow('values', { title: '', text: '' })}>+ Add value</GoldButton>}
          </Panel>
          <Box sx={{ color: 'text.secondary', fontSize: 13 }}>Team members are managed under Team.</Box>
        </Box>
      )}
      <Box sx={{ mt: 3 }}><GoldButton onClick={save} disabled={busy || !dbOk}>Save changes</GoldButton></Box>
    </>
  );
}
