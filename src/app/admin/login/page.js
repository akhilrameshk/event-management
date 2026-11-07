'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Box, TextField, Alert } from '@mui/material';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import { useT, Photo, Overlay, GoldText, Eyebrow, GoldButton } from '@/components/ui';

export default function AdminLoginPage() {
  const t = useT();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.replace('/admin');
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Login failed');
    } catch {
      setError('Network error. Please try again.');
    }
    setBusy(false);
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, minHeight: '100vh' }}>
      <Photo i={3} sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'flex-end', p: 9, color: t.onDeep }}>
        <Overlay from=".35" to=".8" />
        <Box sx={{ position: 'relative' }}>
          <Image src="/logo.png" alt="Elegant Events" width={760} height={311} style={{ width: 220, height: 'auto', marginBottom: 24 }} />
          <Box component="h2" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: 40 }}><GoldText onDeep>Admin Console</GoldText></Box>
          <Box sx={{ mt: 1.25 }}>Manage your gallery, works and media securely.</Box>
        </Box>
      </Photo>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: t.paper, px: 3, py: 6 }}>
        <Box component="form" onSubmit={submit} sx={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: { md: 'none' }, mb: 1 }}>
            <Box sx={{ bgcolor: t.deepBg, p: 1.5, display: 'inline-block' }}>
              <Image src="/logo.png" alt="Elegant Events" width={760} height={311} style={{ height: 52, width: 'auto', display: 'block' }} />
            </Box>
          </Box>
          <Eyebrow>Authorized Access Only</Eyebrow>
          <Box component="h1" sx={{ fontFamily: 'var(--font-lora), serif', fontWeight: 500, fontSize: 42, mb: 2 }}><GoldText>Admin Login</GoldText></Box>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required autoFocus />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          <GoldButton type="submit" disabled={busy} sx={{ mt: 1 }}>{busy ? 'Signing in…' : 'Sign In'}</GoldButton>
          <Box sx={{ mt: 2, fontSize: 12, color: 'text.secondary', display: 'flex', gap: 1.25, alignItems: 'center' }}>
            <ShieldOutlined sx={{ fontSize: 18, color: t.gold }} /> Protected area.
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
