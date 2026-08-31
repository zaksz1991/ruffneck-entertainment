# RuffNeck Free CMS (No Paid Subscriptions)

## Stack (100% free)
- **Google Sheet** – product & blog database
- **Google Apps Script** – API (read + write)
- **Image URLs** – Google Drive (public link) or free hosts like imgbb.com
- **Video** – YouTube links only (free)

## Deploy Apps Script
1. Open [script.google.com](https://script.google.com)
2. Paste **entire** `RuffNeck_CMS_Script.gs` (replaces old form-only script)
3. Run **`setup`** once → grant permissions
4. Deploy → Web app → Execute as **Me** → Who has access: **Anyone**
5. If the URL changes, update it in:
   - `js/forms.js`
   - `js/cms.js`
   - `admin.html` (fetch URLs inside `rnCmsSaveProduct` / `rnCmsSaveBlog`)

## Sheet tabs (auto-created by setup)
- `Products` – live catalog for /store
- `BlogPosts` – live posts for /blog
- `Leads` / `Contact` / `Webinar` / `Newsletter` – form captures

## Adding a product (Admin)
1. Open `/admin` and sign in
2. Prefer **Image URL** (not only file upload):
   - Upload image to Google Drive → Share → Anyone with link
   - Or upload at https://imgbb.com → copy direct link
3. Optional: YouTube URL for video
4. Save as **Active**
5. Product is written to the Sheet and appears on **Store for all visitors** after page load

## Adding a blog post
1. Admin → Blog → add title, body, **Cover Image URL**, optional YouTube URL
2. Status **published**
3. Post appears on **/blog** for everyone via CMS load

## Responsive media
- Product/blog covers use `background-size: cover` + aspect ratio
- Article images scale to container width
- YouTube embeds use 16:9 responsive wrapper

## Limits (free tier)
- Google Apps Script daily quotas (generous for small/medium traffic)
- Gmail sending quotas for form emails
- Do not store large base64 images in the Sheet — always use URLs

## Security note
`ADMIN_KEY` in the script matches the admin panel password pattern. Change both if the password was shared. This is basic protection, not enterprise auth.
