'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, TextField, MenuItem, Switch, FormControlLabel, Alert, LinearProgress } from '@mui/material';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import { CATEGORIES } from '@/config/site';
import { useT, GoldButton } from '@/components/ui';
import { PageHeader, Panel } from './ui';
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
  '& .MuiSelect-icon': { color: '#D4AF37' },
  '& input::-webkit-calendar-picker-indicator': { filter: 'invert(1)' }
};

const OK = /^(image\/(jpeg|png|webp|avif)|video\/(mp4|webm|quicktime))$/;
const nameToTitle = (n) => n.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');

export default function UploadView({ cloudReady }) {
  const t = useT();
  const router = useRouter();
  const input = useRef(null);
  const [queue, setQueue] = useState([]); // { key, file, title, status: ready|uploading|done|error, progress, error }
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [eventDate, setEventDate] = useState('');
  const [owner, setOwner] = useState('© Elegant Events');
  const [watermark, setWatermark] = useState(true);
  const [drag, setDrag] = useState(false);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState('');

  const add = (files) => {
    const next = [];
    for (const f of files) {
      if (!OK.test(f.type)) { setNotice(`"${f.name}" skipped: only JPG, PNG, WebP, AVIF, MP4, WebM or MOV.`); continue; }
      next.push({ key: `${f.name}-${f.size}-${Math.random()}`, file: f, title: nameToTitle(f.name), status: 'ready', progress: 0, error: '' });
    }
    setQueue((q) => [...q, ...next]);
  };
  const update = (key, patch) => setQueue((q) => q.map((x) => (x.key === key ? { ...x, ...patch } : x)));

  // 1) get a signature from our server  2) upload straight to Cloudinary (progress)  3) save details in the database
  const sendOne = async (item) => {
    try {
      update(item.key, { status: 'uploading', progress: 1, error: '' });
      const sig = await api('/api/admin/media/sign', 'POST', {});
      const result = await new Promise((resolve, reject) => {
        const fd = new FormData();
        fd.append('file', item.file);
        fd.append('api_key', sig.apiKey);
        fd.append('timestamp', String(sig.timestamp));
        fd.append('signature', sig.signature);
        fd.append('folder', sig.folder);
        fd.append('type', sig.type);
        fd.append('allowed_formats', sig.allowedFormats);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`);
        xhr.upload.onprogress = (e) => { if (e.lengthComputable) update(item.key, { progress: Math.max(1, Math.round((e.loaded / e.total) * 95)) }); };
        xhr.onload = () => {
          let data = {}; try { data = JSON.parse(xhr.responseText); } catch { /* ignore */ }
          if (xhr.status >= 200 && xhr.status < 300) resolve(data); else reject(new Error(data?.error?.message || `Upload failed (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(fd);
      });
      await api('/api/admin/media', 'POST', {
        publicId: result.public_id, resourceType: result.resource_type, title: item.title, category, eventDate,
        copyrightOwner: owner, watermark, originalName: item.file.name,
      });
      update(item.key, { status: 'done', progress: 100 });
    } catch (e) {
      update(item.key, { status: 'error', error: e.message });
    }
  };

  const start = async () => {
    setRunning(true);
    for (const item of queue.filter((x) => x.status === 'ready' || x.status === 'error')) await sendOne(item);
    setRunning(false);
    router.refresh();
  };

  const pending = queue.filter((x) => x.status === 'ready' || x.status === 'error').length;
  const done = queue.filter((x) => x.status === 'done').length;

  return (
    <>
      <PageHeader title="Upload Media" subtitle="Photos and videos are stored in Cloudinary" action={<GoldButton outlined component={Link} href="/admin/media">Media Library</GoldButton>} />
      
      {!cloudReady && <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env.local and restart.</Alert>}
      {notice && <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }} onClose={() => setNotice('')}>{notice}</Alert>}
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.1fr 1fr' }, gap: 4, alignItems: 'start' }}>
        <Box>
          <Box
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); add(Array.from(e.dataTransfer.files)); }}
            sx={{ 
              border: '2px dashed #D4AF37', 
              bgcolor: drag ? 'rgba(212,175,55,.12)' : 'rgba(212,175,55,.04)', 
              py: 8, 
              px: 2, 
              textAlign: 'center',
              borderRadius: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            <CloudUploadOutlined sx={{ fontSize: 54, color: '#D4AF37', mb: 1 }} />
            <Box component="h3" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: 24, my: 1.5, color: '#F5E6C8' }}>Drag &amp; drop files here</Box>
            <Box sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 14, mb: 3 }}>JPG, PNG, WebP, AVIF, MP4, WebM, MOV (size limits follow your Cloudinary plan)</Box>
            <GoldButton outlined onClick={() => input.current?.click()}>Browse Files</GoldButton>
            <input ref={input} type="file" hidden multiple accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime" onChange={(e) => { add(Array.from(e.target.files)); e.target.value = ''; }} />
          </Box>

          {queue.map((x) => (
            <Box key={x.key} sx={{ border: '1px solid rgba(212, 175, 55, 0.15)', bgcolor: '#0E0E12', p: 2, mt: 2, borderRadius: '10px' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField size="small" fullWidth value={x.title} disabled={x.status === 'uploading' || x.status === 'done'} onChange={(e) => update(x.key, { title: e.target.value })} label={x.file.name} sx={inputSx} />
                <Box sx={{ fontSize: 12, minWidth: 80, textAlign: 'right', fontWeight: 600, color: x.status === 'error' ? '#f87171' : '#D4AF37' }}>
                  {x.status === 'done' ? 'Done' : x.status === 'error' ? 'Failed' : x.status === 'uploading' ? `${x.progress}%` : 'Ready'}
                </Box>
                {x.status === 'ready' && <Box component="button" onClick={() => setQueue((q) => q.filter((y) => y.key !== x.key))} sx={{ cursor: 'pointer', bgcolor: 'transparent', border: 0, color: '#ff6b6b', fontSize: 22, fontWeight: 'bold' }} aria-label="Remove">×</Box>}
              </Box>
              {x.status === 'uploading' && <LinearProgress variant="determinate" value={x.progress} sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#D4AF37' } }} />}
              {x.error && <Box sx={{ color: '#f87171', fontSize: 12, mt: 1 }}>{x.error}</Box>}
            </Box>
          ))}

          {queue.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 3 }}>
              <GoldButton onClick={start} disabled={running || pending === 0 || !cloudReady}>{running ? 'Uploading…' : `Upload ${pending} file${pending === 1 ? '' : 's'}`}</GoldButton>
              {done > 0 && <Box sx={{ color: '#34d399', fontSize: 13, fontWeight: 600 }}>{done} uploaded</Box>}
            </Box>
          )}
        </Box>

        <Panel title="Details & Protection">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} sx={inputSx}>
              {CATEGORIES.map((c) => (<MenuItem key={c} value={c} sx={{ bgcolor: '#0E0E12', color: '#fff' }}>{c}</MenuItem>))}
            </TextField>
            <TextField label="Event date" type="date" InputLabelProps={{ shrink: true }} value={eventDate} onChange={(e) => setEventDate(e.target.value)} sx={inputSx} />
            <TextField label="Copyright owner" value={owner} onChange={(e) => setOwner(e.target.value)} helperText="Used in the watermark text" sx={inputSx} />
            
            <FormControlLabel 
              control={
                <Switch 
                  checked={watermark} 
                  onChange={(e) => setWatermark(e.target.checked)} 
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#D4AF37' } }} 
                />
              } 
              label="Watermark photos and videos" 
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }} 
            />

            <Box sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 13, borderTop: '1px solid rgba(255, 255, 255, 0.08)', pt: 2, lineHeight: 1.6 }}>
              Always on: originals are private in Cloudinary (not openable without a signature), visitors only get resized, watermarked copies, right-click and drag are blocked, and the lightbox has no download button.
            </Box>
          </Box>
        </Panel>
      </Box>
    </>
  );
}