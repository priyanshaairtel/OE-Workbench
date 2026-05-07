# OE Workbench — Concept Prototype

Interactive prototype of an automated Order Entry experience for SFDC, demonstrating the post-proposal-accepted workflow for OE reps handling complex multi-location, multi-product orders.

## What's inside

- **Inbox** — accepted proposals waiting for OE pickup
- **Handoff** — system-derived context of what KAM completed
- **Review Documents** — sync from SFDC, auto-classified, OE confirms
- **Assign DCP** — bulk assignment from account contact roster
- **Enrich Quote** — rich grid editor with inline + bulk edit
- **Pre-flight** — per-line + cross-line validation before OV submission
- **Sent to OV** — exit state

Built with React + Vite + Tailwind. No backend — all data is in-memory.

---

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Deploy to Vercel — fastest path

You have **three options**. Pick whichever fits your workflow.

### Option A: Vercel CLI (no Git needed, ~3 min)

```bash
# 1. Install Vercel CLI globally (one-time)
npm install -g vercel

# 2. From this folder, run:
vercel

# Follow prompts:
#   - Login (browser opens, sign in with email/GitHub)
#   - "Set up and deploy?" → Y
#   - "Which scope?" → your account
#   - "Link to existing project?" → N
#   - "Project name?" → oe-workbench (or whatever you want)
#   - "In which directory is your code located?" → ./
#   - "Want to override settings?" → N

# Vercel auto-detects Vite, builds, and gives you a URL like:
# https://oe-workbench-xyz.vercel.app
```

Then run `vercel --prod` to promote that to a production URL.

### Option B: Push to GitHub, import in Vercel dashboard (~5 min)

1. Create a new GitHub repo (private is fine).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "OE workbench prototype"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/oe-workbench.git
   git push -u origin main
   ```
3. Go to [vercel.com/new](https://vercel.com/new), import the repo.
4. Vercel auto-detects Vite. Click **Deploy**. Done.

Future pushes to `main` auto-deploy.

### Option C: Drag-and-drop (no CLI, no Git, ~2 min)

1. Build locally:
   ```bash
   npm install
   npm run build
   ```
2. Go to [vercel.com/new](https://vercel.com/new) → **"Drop folder to deploy"**.
3. Drag the `dist/` folder into the page.
4. Get a URL.

Note: Option C doesn't auto-redeploy when you change files. Use A or B if you want to iterate.

---

## Customize before deploying

- **Branding**: edit `index.html` `<title>` and the favicon SVG.
- **Privacy**: this is a static demo with no analytics, no backend. Anyone with the URL can see it. If you need access control, Vercel has a paid "password protect" feature, or use Option B with a private team.
- **Custom domain**: free on Vercel — Settings → Domains.

---

## Sharing tips

Once deployed:
- Drop the URL in your PRD / one-pager / Slack
- Add `?step=enrich` style query params later if you want deep-linkable demo states (not currently wired up — happy to add)
- Pair with a 4-min Loom walkthrough for stakeholders who won't click through themselves

---

## Iterating

Since this is a static React app, you can keep editing `src/OEWorkbench.jsx` and either:
- Run `npm run dev` to preview locally
- Push to GitHub (Option B) → Vercel auto-redeploys
- Or `vercel --prod` from CLI (Option A)
