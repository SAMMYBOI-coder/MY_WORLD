# 👾 Hacker OS — Growth System

Your personal hacking progression tracker. Certifications, CTFs, HTB machines, writeups — all in one place.

---

## Run Locally (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## Deploy to GitHub Pages + Custom Domain (domain.np)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — Hacker OS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hacker-os.git
git push -u origin main
```

### Step 2 — Enable GitHub Pages
1. Go to your repo on GitHub
2. Settings → Pages
3. Source: **GitHub Actions**
4. The workflow in `.github/workflows/deploy.yml` auto-deploys on every push to main

### Step 3 — Set Your Custom Domain in GitHub
1. Settings → Pages → Custom domain
2. Enter your domain: `yourdomain.np`
3. Check **Enforce HTTPS**

### Step 4 — Edit the CNAME file
Replace `yourdomain.np` in `public/CNAME` with your actual domain.np domain.

### Step 5 — Add DNS Record in domain.np
Log into your domain.np control panel and add:

| Type  | Host | Value                        |
|-------|------|------------------------------|
| CNAME | @    | YOUR_USERNAME.github.io      |

Or if CNAME on root (@) isn't supported, use A records:
| Type | Host | Value         |
|------|------|---------------|
| A    | @    | 185.199.108.153 |
| A    | @    | 185.199.109.153 |
| A    | @    | 185.199.110.153 |
| A    | @    | 185.199.111.153 |

DNS takes 5–60 minutes to propagate. Then your site is live at `yourdomain.np`.

---

## Tech Stack
- React 18 + Vite
- LocalStorage (no backend needed)
- Pure CSS — no UI library

## Data
All progress saves to your browser's LocalStorage automatically.
Use **Settings → Export JSON** to back up, and **Import JSON** to restore.
