'use client';
import { useState } from 'react';
import { Box, TextField, MenuItem, Alert } from '@mui/material';
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
};

export default function SettingsView({ initial, dbOk }) {
  const t = useT();
  const [s, setS] = useState({ ...initial, phones: initial.phones.join(', ') });
  const [msg, setMsg] = useState(null); // { type, text }
  const [busy, setBusy] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', again: '' });
  const [pwMsg, setPwMsg] = useState(null);
  
  const set = (k) => (e) => setS({ ...s, [k]: e.target.value });
  const grid = { display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 };

  const save = async () => {
    setBusy(true); setMsg(null);
    try { 
      const d = await api('/api/admin/settings', 'PUT', s); 
      setS({ ...d.settings, phones: d.settings.phones.join(', ') }); 
      setMsg({ type: 'success', text: 'Saved. The website is updated.' }); 
    }
    catch (e) { setMsg({ type: 'error', text: e.message }); }
    setBusy(false);
  };

  const changePw = async () => {
    setPwMsg(null);
    if (pw.next !== pw.again) return setPwMsg({ type: 'error', text: 'New passwords do not match' });
    try { 
      await api('/api/admin/password', 'POST', { current: pw.current, next: pw.next }); 
      setPw({ current: '', next: '', again: '' }); 
      setPwMsg({ type: 'success', text: 'Password changed.' }); 
    }
    catch (e) { setPwMsg({ type: 'error', text: e.message }); }
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Contact details, SEO and security" action={<GoldButton onClick={save} disabled={busy || !dbOk}>Save changes</GoldButton>} />
      
      {!dbOk && <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>Database is not connected. Set MONGODB_URI in .env.local.</Alert>}
      {msg && <Alert severity={msg.type} sx={{ mb: 3, bgcolor: msg.type === 'success' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: msg.type === 'success' ? '#34d399' : '#f87171', border: `1px solid ${msg.type === 'success' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }} onClose={() => setMsg(null)}>{msg.text}</Alert>}

      <Box sx={{ display: 'grid', gap: 3.5 }}>
        {/* Business & Contact Panel */}
        <Panel title="Business & Contact">
          <Box sx={grid}>
            <TextField label="Business name" value={s.name} onChange={set('name')} sx={inputSx} />
            <TextField label="Tagline" value={s.tagline} onChange={set('tagline')} sx={inputSx} />
            <TextField label="Phone numbers (comma separated)" value={s.phones} onChange={set('phones')} helperText="The first number is used for the Call button" sx={inputSx} />
            <TextField label="WhatsApp number (with country code)" value={s.whatsapp} onChange={set('whatsapp')} helperText="Example: 918089957801" sx={inputSx} />
            <TextField label="Address" value={s.address} onChange={set('address')} sx={inputSx} />
            <TextField label="Website" value={s.website} onChange={set('website')} sx={inputSx} />
            <TextField label="Email" value={s.email} onChange={set('email')} sx={inputSx} />
            <TextField label="City" value={s.locality} onChange={set('locality')} sx={inputSx} />
            <TextField label="State" value={s.region} onChange={set('region')} sx={inputSx} />
            <TextField label="Opening hours (optional)" value={s.hours} onChange={set('hours')} helperText="Example: Mo-Sa 09:00-19:00" sx={inputSx} />
            <TextField label="Google Maps link (optional)" value={s.mapsUrl} onChange={set('mapsUrl')} sx={inputSx} />
            <TextField label="Latitude (optional)" value={s.geoLat} onChange={set('geoLat')} sx={inputSx} />
            <TextField label="Longitude (optional)" value={s.geoLng} onChange={set('geoLng')} sx={inputSx} />
          </Box>
        </Panel>

        {/* Search Engine (SEO) Panel */}
        <Panel title="Search Engine (SEO)">
          <Box sx={{ display: 'grid', gap: 2.5 }}>
            <TextField label="Home page title" value={s.seoTitle} onChange={set('seoTitle')} helperText={`${s.seoTitle.length} characters (best: under 60)`} sx={inputSx} />
            <TextField label="Description" value={s.seoDescription} onChange={set('seoDescription')} multiline rows={3} helperText={`${s.seoDescription.length} characters (best: 120 to 160)`} sx={inputSx} />
            <TextField label="Keywords (comma separated)" value={s.seoKeywords} onChange={set('seoKeywords')} multiline rows={2} sx={inputSx} />
            <Box sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 13, lineHeight: 1.6 }}>Sitemap and robots.txt are generated automatically at /sitemap.xml and /robots.txt. Photos get alt text from their titles, so give every photo a clear title when you upload.</Box>
          </Box>
        </Panel>

        {/* Social Links & Appearance Panel */}
        <Panel title="Social Links & Appearance">
          <Box sx={grid}>
            <TextField label="Instagram URL" value={s.instagram} onChange={set('instagram')} sx={inputSx} />
            <TextField label="Facebook URL" value={s.facebook} onChange={set('facebook')} sx={inputSx} />
            <TextField label="YouTube URL" value={s.youtube} onChange={set('youtube')} sx={inputSx} />
            <TextField select label="Default theme for new visitors" value={s.defaultTheme} onChange={set('defaultTheme')} sx={inputSx}>
              <MenuItem value="royal" sx={{ bgcolor: '#0E0E12', color: '#fff' }}>Royal (light)</MenuItem>
              <MenuItem value="dark" sx={{ bgcolor: '#0E0E12', color: '#fff' }}>Dark</MenuItem>
            </TextField>
          </Box>
        </Panel>

        {/* Change Password Panel */}
        <Panel title="Change Password">
          {pwMsg && <Alert severity={pwMsg.type} sx={{ mb: 2.5, bgcolor: pwMsg.type === 'success' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: pwMsg.type === 'success' ? '#34d399' : '#f87171', border: `1px solid ${pwMsg.type === 'success' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }} onClose={() => setPwMsg(null)}>{pwMsg.text}</Alert>}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 2.5, mb: 2.5 }}>
            <TextField label="Current password" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" sx={inputSx} />
            <TextField label="New password (8+ characters)" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" sx={inputSx} />
            <TextField label="Repeat new password" type="password" value={pw.again} onChange={(e) => setPw({ ...pw, again: e.target.value })} autoComplete="new-password" sx={inputSx} />
          </Box>
          <GoldButton outlined onClick={changePw} disabled={!pw.current || !pw.next}>Change password</GoldButton>
        </Panel>
      </Box>

      <Box sx={{ mt: 4 }}><GoldButton onClick={save} disabled={busy || !dbOk}>Save changes</GoldButton></Box>
    </>
  );
}