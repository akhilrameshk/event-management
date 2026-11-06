import { revalidatePath, revalidateTag } from 'next/cache';

// Call after admin changes so the public pages and sitemap refresh immediately.
export function refreshSite() {
  revalidateTag('settings');
  revalidatePath('/', 'layout');
  revalidatePath('/sitemap.xml');
}
