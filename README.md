# Elegant Events website (Next.js + Material UI + MongoDB)

Public website (Home, Our Works, Gallery, About, Contact) with two themes (Dark / Royal),
a full admin panel and built-in SEO.

## Run
```
npm install
cp .env.example .env.local      # then fill it in
npm run hash -- "your-password" # paste the printed line into .env.local
npm run dev
```
Website: http://localhost:3000  Admin: http://localhost:3000/admin

## Admin panel (/admin)
- **Dashboard**: counts and quick actions
- **Our Works**: add / edit / delete / hide work categories, choose a cover photo, order. "Import default works" copies the sample works so they can be edited.
- **Media Library**: all photos and videos, filter and search, edit title / category / date, hide, feature on Home, delete (also removes the files)
- **Upload**: drag and drop many files, progress per file, category, event date, copyright owner, watermark on/off (goes to Cloudinary)
- **Settings**: phone numbers, WhatsApp number, address, social links, SEO title / description / keywords, default theme, change password

The public website reads works, gallery and settings from the database. Until something is added it shows built-in sample content.

## Photos and videos (Cloudinary)
Files are NOT stored on the server. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in `.env.local`.
- Upload flow: the browser gets a signature from `/api/admin/media/sign`, uploads straight to Cloudinary (so big videos do not pass through the server), then the details are saved in MongoDB.
- Size limits are those of your Cloudinary plan (the free plan is about 10 MB per photo and 100 MB per video).
- Folder in Cloudinary: `elegant-events`.

## Copyright protection
- Originals are uploaded as Cloudinary type `authenticated`: they cannot be opened without a signature.
- The website only uses signed URLs for ONE transformation (resized + tiled watermark text), so the URL cannot be edited to get the original or drop the watermark. Videos are watermarked too.
- Right-click and drag are blocked on photos; the lightbox has no download button; videos hide the download button.
- This stops casual copying. Nobody can fully prevent screenshots, so the watermark is the real deterrent.
- Deleting an item in the Media Library also deletes it from Cloudinary.

## Loader and theme colour
- A black and gold animated loader covers the page on first load until the saved theme is applied (no brown to black flash), and on slow page changes (`src/app/loading.js`).
- Browser bar colour (theme-color), favicon, apple icon, manifest and share image are black and gold.

## SEO (built in)
- Unique title, description, canonical URL, Open Graph and Twitter card for every page (`src/lib/seo.js`)
- Structured data (JSON-LD): LocalBusiness / ProfessionalService with address, phones, services and social links; WebSite; BreadcrumbList on inner pages; Service list on Our Works; ImageGallery with copyright info on Gallery
- `/sitemap.xml` (with gallery images) and `/robots.txt` (admin and API blocked), generated automatically
- Social preview image `/opengraph-image`, favicon, apple icon, web manifest
- Real `<img>` tags with alt text from photo titles, lazy loading, resized images, fast fonts
- Security headers; admin pages are `noindex`
- Pages are statically generated and refreshed when the admin saves anything

### After going live
1. Set `NEXT_PUBLIC_SITE_URL` to the real domain.
2. Add the site in Google Search Console, put the verification code in `GOOGLE_SITE_VERIFICATION`, and submit `/sitemap.xml`.
3. Create / claim the Google Business Profile with the same name, address and phone numbers as in Admin > Settings.
4. Fill Admin > Settings > SEO, give every photo a clear title, and add map coordinates.

## Folders
- `src/app/(site)` public routes, `src/views` page contents, `src/components` shared UI
- `src/app/admin` admin pages, `src/components/admin` admin screens
- `src/app/api/admin` admin API (login required), 
- `src/lib` auth, database, Cloudinary, SEO helpers
- `public/sample` sample images shown until real photos are uploaded
