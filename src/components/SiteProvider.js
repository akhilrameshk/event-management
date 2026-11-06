'use client';
import { createContext, useContext, useMemo } from 'react';
import { makeWaLink, toTel } from '@/config/site';

const Ctx = createContext(null);

// Site settings (phones, WhatsApp, address...) from Admin > Settings, available to every client component.
export function SiteProvider({ settings, children }) {
  const value = useMemo(
    () => ({ ...settings, tel: toTel(settings.phones[0]), wa: (text) => makeWaLink(settings.whatsapp, text) }),
    [settings]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSite = () => useContext(Ctx);
