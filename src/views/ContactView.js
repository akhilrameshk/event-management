'use client';
import { useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import Instagram from '@mui/icons-material/Instagram';
import MailOutline from '@mui/icons-material/MailOutline';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import { DEFAULT_WORKS } from '@/config/site';
import { useSite } from '@/components/SiteProvider';
import { useT, GoldText, Eyebrow, GoldButton, PX } from '@/components/ui';

const empty = { name: '', phone: '', type: '', date: '', message: '' };

export default function ContactView({ workTitles }) {
  const t = useT();
  const site = useSite();
  const types = workTitles && workTitles.length ? workTitles : DEFAULT_WORKS.map((w) => w.title);
  const [f, setF] = useState(empty);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const send = (e) => {
    e.preventDefault();
    const lines = [
      `Hi ${site.name}, I would like to enquire.`,
      f.name && `Name: ${f.name}`,
      f.phone && `Phone: ${f.phone}`,
      f.type && `Event: ${f.type}`,
      f.date && `Date: ${f.date}`,
      f.message && `Message: ${f.message}`,
    ].filter(Boolean);
    window.open(site.wa(lines.join('\n')), '_blank', 'noopener');
  };

  const handle = (site.instagram || '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '');
  const info = [
    [PhoneOutlined, site.phones[0], site.phones[1] || '', `tel:${site.tel}`],
    [PlaceOutlined, site.address, `${site.locality}, ${site.region}`, site.mapsUrl || null],
    site.email ? [MailOutline, site.email, 'Email us', `mailto:${site.email}`] : null,
    [LanguageOutlined, site.website, 'Our website', `https://${site.website.replace(/^https?:\/\//, '')}`],
    site.instagram ? [Instagram, `@${handle}`, 'Follow us on Instagram', site.instagram] : null,
  ].filter(Boolean);

  // കോൺടാക്റ്റ് ഫീൽഡുകൾക്ക് ഡാർക്ക് തീം സ്റ്റൈൽ നൽകാൻ
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      color: '#ffffff',
      '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
      '&:hover fieldset': { borderColor: '#D4AF37' },
      '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
    '& .MuiSelect-icon': { color: '#D4AF37' },
  };

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.1fr' } }}>
        {/* Left Side: Gradient Contact Details */}
        <Box sx={{ background: 'linear-gradient(150deg,#e7c867,#c79d2c 50%,#7c5b17)', color: '#0a0a0c', px: PX, py: { xs: 7, md: 12.5 } }}>
          <Eyebrow sx={{ color: '#0a0a0c' }}>Contact Us</Eyebrow>
          <Box component="h1" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 34, md: 54 }, mt: 2.25, mb: 5.5, color: '#0a0a0c' }}>
            Let’s Plan Something Extraordinary
          </Box>
          {info.map(([Icon, a, b, href]) => (
            <Box key={a} sx={{ display: 'flex', gap: 2.25, mb: 4 }}>
              <Icon sx={{ fontSize: 28 }} />
              <Box>
                <Box 
                  component={href ? 'a' : 'div'} 
                  href={href || undefined} 
                  target={href && href.startsWith('http') ? '_blank' : undefined} 
                  rel="noopener" 
                  sx={{ display: 'block', fontFamily: 'var(--font-lora), serif', fontSize: { xs: 20, md: 24 }, wordBreak: 'break-all', color: 'inherit', textDecoration: 'none' }}
                >
                  {a}
                </Box>
                <Box sx={{ opacity: 0.85, fontSize: 14 }}>{b}</Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Right Side: WhatsApp Enquiry Form */}
        <Box component="form" onSubmit={send} sx={{ bgcolor: '#09090B', px: PX, py: { xs: 7, md: 12.5 }, display: 'flex', flexDirection: 'column', gap: 2.5, borderLeft: '1px solid rgba(212, 175, 55, 0.15)' }}>
          <Box component="h2" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: { xs: 28, md: 36 }, mb: 1.5 }}>
            <GoldText>Message Us on WhatsApp</GoldText>
          </Box>

          <TextField label="Your Name" value={f.name} onChange={set('name')} required sx={fieldSx} />
          <TextField label="Phone" value={f.phone} onChange={set('phone')} type="tel" required sx={fieldSx} />
          
          <TextField select label="Event Type" value={f.type} onChange={set('type')} sx={fieldSx}>
            {types.map((w) => (
              <MenuItem key={w} value={w} sx={{ bgcolor: '#121214', color: '#fff', '&:hover': { bgcolor: '#1E1E22' } }}>
                {w}
              </MenuItem>
            ))}
          </TextField>

          <TextField 
            label="Event Date" 
            value={f.date} 
            onChange={set('date')} 
            type="date" 
            InputLabelProps={{ shrink: true }} 
            sx={{
              ...fieldSx,
              '& input::-webkit-calendar-picker-indicator': { filter: 'invert(1)' }
            }} 
          />

          <TextField label="Message" value={f.message} onChange={set('message')} multiline rows={4} sx={fieldSx} />

          <Box sx={{ mt: 1 }}>
            <GoldButton type="submit" sx={{ background: '#25D366', color: '#fff', '&:hover': { background: '#1ebe5b' } }}>
              Send on WhatsApp
            </GoldButton>
            <Box sx={{ mt: 1.75, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              Your message opens directly in WhatsApp.
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Google Maps Section */}
      <Box sx={{ height: { xs: 320, md: 440 }, position: 'relative', filter: 'invert(90%) hue-rotate(180deg)' }}>
        <Box component="iframe" title={`${site.name} location`} src={`https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`} loading="lazy" sx={{ border: 0, width: '100%', height: '100%' }} />
      </Box>
    </>
  );
}