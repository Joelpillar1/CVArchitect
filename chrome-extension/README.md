# CVArchitect Job Tailor – Chrome Extension

Capture job postings from job boards and open them in CVArchitect to tailor your resume.

## Features

- **Capture job from current page** – On LinkedIn, Indeed, Lever, Greenhouse, Workable, Glassdoor (and most job pages), click the extension and “Capture this page” to extract job title, company, and description.
- **Paste fallback** – If the page isn’t recognized, paste the job description (and optional title/company) and click “Use pasted text”.
- **Open in CVArchitect** – “Open in CVArchitect & tailor” opens the app with the job description pre-filled and the Job Match tab ready.

## Installation (unpacked)

1. Open Chrome and go to `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select the `chrome-extension` folder inside this repo.
4. Pin the extension to the toolbar if you like.

## Usage

1. Open a job posting (e.g. LinkedIn, Indeed).
2. Click the CVArchitect Job Tailor icon in the toolbar.
3. Click **Capture this page** (or paste the job description and use **Use pasted text**).
4. Click **Open in CVArchitect & tailor** to open the app with the job pre-filled.
5. In CVArchitect, use the **Job Match** tab in the right panel and run “Tailor my resume”.

## App URL

The extension opens `https://cvarchitect.app` by default. To point it at a different URL (e.g. localhost), set `chrome.storage.local.cvarchitect_app_url` to that URL (e.g. via the console on the popup or an options page).

## Supported sites

- LinkedIn Jobs  
- Indeed  
- Lever  
- Greenhouse  
- Workable  
- Glassdoor  
- Generic pages (best-effort extraction)

## Icons

Icons are copied from the main app’s `public/images/logo icon.png`. To use custom icons, replace `icons/icon16.png`, `icons/icon32.png`, and `icons/icon48.png` with your own (16×16, 32×32, 48×48 recommended).
