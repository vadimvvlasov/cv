# CV — vadimvvlasov.github.io/cv

Personal CV website for **Vadim Vlasov** — ML Engineer specializing in geospatial computer vision and satellite imagery pipelines.

Live: <https://vadimvvlasov.github.io/cv/>

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS v4** — utility-first styling
- **Fonts:** Inter (UI), JetBrains Mono (metrics)
- **Deployment:** GitHub Pages (static, `dist/` → root)

## Features

- 🎯 Scroll-spy active navigation (IntersectionObserver)
- ✨ Fade-in + slide-up section animations with stagger
- 🔢 Animated metric counters (count-up on scroll)
- 📊 Skill proficiency progress bars
- 🌗 Dark / Light mode toggle (persisted in localStorage)
- 📋 Copy Email with toast notification
- ↓ Print-optimised / Download PDF
- 💼 Vertical timeline for experience
- ♿ ARIA labels, keyboard navigation, semantic HTML
- 📱 Responsive mobile layout (375px+)

## Development

```bash
# Install
npm install

# Dev server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy

Push to `main` — GitHub Pages serves from repo root:

```bash
npm run build
cp -r dist/* .          # copy built files to root
git add -A
git commit -m "build: update"
git push origin main
```

Changes appear at <https://vadimvvlasov.github.io/cv/> within 1–2 minutes.

## File Structure

```
├── index.html              ← Vite entry + meta tags
├── src/
│   ├── App.tsx             ← Main component (all logic)
│   ├── main.tsx            ← React entry
│   ├── index.css           ← Tailwind import + custom keyframes
│   └── vite-env.d.ts       ← TS declarations
├── public/                 ← Static assets (images, favicon)
├── package.json
├── vite.config.ts          ← Vite + React + Tailwind plugins
├── tsconfig.json           ← TypeScript config
└── .gitignore
```
