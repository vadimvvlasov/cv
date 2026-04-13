# CV — vadimvvlasov.github.io/cv

Personal CV website for **Vadim Vlasov** — ML Engineer specializing in geospatial computer vision and satellite imagery pipelines.

Live: <https://vadimvvlasov.github.io/cv/>

## Tech Stack

- Plain HTML5 + CSS3 (no frameworks, no JS)
- Deployed via **GitHub Pages** (branch `main`)
- Google Fonts: Sacramento, Merriweather, Montserrat

## Structure

```
.
├── index.html          # Main page
├── css/
│   └── styles.css      # Styles (responsive, mobile-friendly)
├── img/
│   ├── vadim_vlasov.png
│   ├── favicon_v.ico
│   └── ...             # Decorative assets (clouds, mountains, icons)
└── README.md
```

## Local Development

1. Clone the repo:
   ```bash
   git clone https://github.com/vadimvvlasov/cv.git
   cd cv
   ```
2. Open `index.html` in a browser (no build step required).
3. For live-reload, use any static server, e.g.:
   ```bash
   python -m http.server 8000
   ```

## Deploy

Push to `main` — GitHub Pages deploys automatically:

```bash
git add -A
git commit -m "feat: <description>"
git push origin main
```

Changes appear at <https://vadimvvlasov.github.io/cv/> within 1–2 minutes.

## Future Plans

- [ ] Migrate to a static site generator (Hugo / VitePress) for scalability
- [ ] Add GeoCV portfolio project page when ready
- [ ] Custom domain (vadimvlasov.com)
