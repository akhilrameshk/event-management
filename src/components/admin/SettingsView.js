'use client';
import { useState } from 'react';
import { Box, TextField, MenuItem, Alert } from '@mui/material';
import { useT, GoldButton } from '@/components/ui';
import { PageHeader, Panel } from './ui';
import { api } from './api';

export default function SettingsView({ initial, dbOk }) {
  const t = useT();
  const [s, setS] = useState({ ...initial, phones: initial.phones.join(', ') });
  const [msg, setMsg] = useState(null); // { type, text }
  const [busy, setBusy] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', again: '' });
  const [pwMsg, setPwMsg] = useState(null);
  const set = (k) => (e) => setS({ ...s, [k]: e.target.value });
  const grid = { display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 };

  const save = async () => {
    setBusy(true); setMsg(null);
    try { const d = await api('/api/admin/settings', 'PUT', s); setS({ ...d.settings, phones: d.settings.phones.join(', ') }); setMsg({ type: 'success', text: 'Saved. The website is updated.' }); }
    catch (e) { setMsg({ type: 'error', text: e.message }); }
    setBusy(false);
  };
  const changePw = async () => {
    setPwMsg(null);
    if (pw.next !== pw.again) return setPwMsg({ type: 'error', text: 'New passwords do not match' });
    try { await api('/api/admin/password', 'POST', { current: pw.current, next: pw.next }); setPw({ current: '', next: '', again: '' }); setPwMsg({ type: 'success', text: 'Password changed.' }); }
    catch (e) { setPwMsg({ type: 'error', text: e.message }); }
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Contact details, SEO and security" action={<GoldButton onClick={save} disabled={busy || !dbOk}>Save changes</GoldButton>} />
      {!dbOk && <Alert severity="warning" sx={{ mb: 3 }}>Database is not connected. Set MONGODB_URI in .env.local.</Alert>}
      {msg && <Alert severity={msg.type} sx={{ mb: 3 }} onClose={() => setMsg(null)}>{msg.text}</Alert>}

      <Box sx={{ display: 'grid', gap: 3.5 }}>
        <Panel title="Business & Contact">
          <Box sx={grid}>
            <TextField label="Business name" value={s.name} onChange={set('name')} />
            <TextField label="Tagline" value={s.tagline} onChange={set('tagline')} />
            <TextField label="Phone numbers (comma separated)" value={s.phones} onChange={set('phones')} helperText="The first number is used for the Call button" />
            <TextField label="WhatsApp number (with country code)" value={s.whatsapp} onChange={set('whatsapp')} helperText="Example: 918089957801" />
            <TextField label="Address" value={s.address} onChange={set('address')} />
            <TextField label="Website" value={s.website} onChange={set('website')} />
            <TextField label="Email" value={s.email} onChange={set('email')} />
            <TextField label="City" value={s.locality} onChange={set('locality')} />
            <TextField label="State" value={s.region} onChange={set('region')} />
            <TextField label="Opening hours (optional)" value={s.hours} onChange={set('hours')} helperText="Example: Mo-Sa 09:00-19:00" />
            <TextField label="Google Maps link (optional)" value={s.mapsUrl} onChange={set('mapsUrl')} />
            <TextField label="Latitude (optional)" value={s.geoLat} onChange={set('geoLat')} />
            <TextField label="Longitude (optional)" value={s.geoLng} onChange={set('geoLng')} />
          </Box>
        </Panel>

        <Panel title="Search Engine (SEO)">
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Home page title" value={s.seoTitle} onChange={set('seoTitle')} helperText={`${s.seoTitle.length} characters (best: under 60)`} />
            <TextField label="Description" value={s.seoDescription} onChange={set('seoDescription')} multiline rows={3} helperText={`${s.seoDescription.length} characters (best: 120 to 160)`} />
            <TextField label="Keywords (comma separated)" value={s.seoKeywords} onChange={set('seoKeywords')} multiline rows={2} />
            <Box sx={{ color: 'text.secondary', fontSize: 13 }}>Sitemap and robots.txt are generated automatically at /sitemap.xml and /robots.txt. Photos get alt text from their titles, so give every photo a clear title when you upload.</Box>
          </Box>
        </Panel>

        <Panel title="Social Links & Appearance">
          <Box sx={grid}>
            <TextField label="Instagram URL" value={s.instagram} onChange={set('instagram')} />
            <TextField label="Facebook URL" value={s.facebook} onChange={set('facebook')} />
            <TextField label="YouTube URL" value={s.youtube} onChange={set('youtube')} />
            <TextField select label="Default theme for new visitors" value={s.defaultTheme} onChange={set('defaultTheme')}>
              <MenuItem value="royal">Royal (light)</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </TextField>
          </Box>
        </Panel>

        <Panel title="Change Password">
          {pwMsg && <Alert severity={pwMsg.type} sx={{ mb: 2 }} onClose={() => setPwMsg(null)}>{pwMsg.text}</Alert>}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 2, mb: 2 }}>
            <TextField label="Current password" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" />
            <TextField label="New password (8+ characters)" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" />
            <TextField label="Repeat new password" type="password" value={pw.again} onChange={(e) => setPw({ ...pw, again: e.target.value })} autoComplete="new-password" />
          </Box>
          <GoldButton outlined onClick={changePw} disabled={!pw.current || !pw.next}>Change password</GoldButton>
        </Panel>
      </Box>
      <Box sx={{ mt: 3 }}><GoldButton onClick={save} disabled={busy || !dbOk}>Save changes</GoldButton></Box>
    </>
  );
}
