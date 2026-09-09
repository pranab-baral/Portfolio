# Ramesh Baral — Website

## File structure

```
site/
├── index.html          Home
├── experience.html      Filterable list of professional engagements
├── about.html            Bio, qualifications, competencies
├── publications.html    Papers, publications, trainings delivered
├── fieldwork.html        Photo gallery of field visits and trainings
├── services.html        Consulting services offered
├── contact.html          Contact form + details
├── css/
│   └── style.css        All styling (one shared file)
├── js/
│   └── main.js           All interactivity (one shared file)
├── assets/
│   ├── profile_pic.png  Hero portrait (index.html)
│   └── fieldwork/        Photo gallery images (fieldwork.html)
└── README.md
```

Every page loads the same `css/style.css` and `js/main.js`, so edits to
either file update the whole site at once. Keep this folder structure
intact — the pages reference the CSS/JS with relative paths
(`css/style.css`, `js/main.js`), so don't rename the folders.

## Editing content

- Text content lives directly in each `.html` file — open the one you
  want to change in any text editor.
- Shared visual styling (colors, fonts, spacing) lives in `css/style.css`,
  under the `:root` section at the top for colors/fonts.
- Shared behavior (accessibility toolbar, filters, the project modal,
  mobile nav, the contact form) lives in `js/main.js`.

## Adding fieldwork photos

1. Save your photos into `assets/fieldwork/` using the naming pattern
   `fieldwork-01.jpg`, `fieldwork-02.jpg`, etc. (see the README inside
   that folder). PNG works too — just keep the extension consistent
   with what's written in `fieldwork.html`.
2. Open `fieldwork.html` and find the `<button class="photo-card">`
   block for the slot you're filling in. Update:
   - `data-title`, `data-year`, `data-tools`, `data-desc` — shown when
     the photo is clicked
   - `data-image` and the `<img src="...">` — the actual file path
   - the `<img alt="...">` — a short text description of the photo,
     for screen reader users
3. To add more than 6 photos, copy an entire `<button class="photo-card">…</button>`
   block, paste it inside `<div class="photo-grid">`, and edit its
   details as above.

## Adding another page

1. Copy an existing page (e.g. `about.html`) as a starting point.
2. Update the `<title>`, the page heading, and the main content.
3. Add a link to it in the `<nav class="primary-nav">` block —
   **copy that exact nav block into every other page too**, so the
   menu stays consistent across the site.
4. Keep the `<link rel="stylesheet" href="css/style.css">` and
   `<script src="js/main.js"></script>` tags as they are.

## Contact form

The form in `contact.html` is currently a working front-end demo only —
submitting it shows a message but doesn't send anywhere. To receive
real messages, the simplest options are:

- **Formspree** (formspree.io) — sign up, get a form endpoint, and
  change the `<form id="contactForm" novalidate>` tag to
  `<form id="contactForm" novalidate action="https://formspree.io/f/YOUR_ID" method="POST">`,
  and remove the `e.preventDefault()` line in `main.js`'s form handler
  (or follow Formspree's own JS snippet instead).
- Any similar form backend service (Netlify Forms, Getform, etc.)
  works the same way.

## Publishing online

Any static hosting service works, since this is plain HTML/CSS/JS
with no build step. A few easy, free options:

### Option A — Netlify (drag and drop)
1. Go to https://app.netlify.com/drop
2. Drag the whole `site` folder onto the page.
3. Netlify gives you a live URL immediately. You can add a custom
   domain later from the site settings.

### Option B — GitHub Pages
1. Create a new GitHub repository and upload the contents of `site/`
   to it (index.html, css/, js/, etc. at the repository root).
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set Source to **Deploy from a branch**,
   pick the `main` branch and `/ (root)` folder, then save.
4. GitHub gives you a URL like `https://yourusername.github.io/reponame/`.

### Option C — Vercel
1. Go to https://vercel.com/new
2. Import the folder/repository containing `site/`.
3. Leave the build settings blank (it's a static site) and deploy.

### Custom domain
All three options let you attach a custom domain (e.g.
`rameshbaral.com`) for free from their dashboard once the site is live
— you'd just need to own the domain name from a registrar and point
its DNS records at the host, following whichever platform's
instructions.

## Accessibility features already built in

- Skip-to-content link, semantic landmarks, and visible keyboard focus
  outlines throughout
- A floating accessibility toolbar (bottom-right "Aa" button) with
  text-size control, a high-contrast toggle, and a reduce-motion toggle
- Respects the visitor's OS-level "reduce motion" setting automatically
- Fully keyboard-operable project modal with focus trapping and
  Escape-to-close
- Properly labeled form fields on the contact page
