# John Paul Torres | Analytics Portfolio

A responsive Vite + React portfolio showcasing real GitHub case studies in SQL, Python, business intelligence, logistics, financial analytics and data applications.

**Portfolio owner:** John Paul Torres  
**GitHub:** https://github.com/JP-bott

## Highlights

- Ten curated GitHub projects based on their public repository READMEs, each linking to original source code, including the Philippine Economic Intelligence Dashboard with published PSA statistics
- Dedicated Tableau Public gallery with public workbook thumbnails, filtering, sorting and interactive previews
- Project search, category filters, expandable case studies and keyboard command search (`Ctrl/⌘ + K`)
- Interactive financial example with sourced **synthetic** figures and readable hover tooltips
- Light and dark mode with saved preference, mobile navigation and reduced-motion support
- Responsive layouts, keyboard-accessible dialogs, focus handling and explicit dataset disclaimers
- One read-only Vercel function for public Tableau workbook metadata; no keys or environment variables required
- SEO metadata, social-cover SVG, favicon, Vercel configuration and GitHub Actions build check

## Run locally

Requires Node.js 20.19+ or 22+.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually http://localhost:5173).

```bash
npm run build
npm run preview
```

## Deploy on Vercel

1. In Vercel, import the GitHub repository `JP-bott/portfolio`.
2. Use the **Vite** framework preset.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Deploy. No environment variables are required.

The included `vercel.json` defines the build settings and preserves the `/api/tableau` serverless route. Vercel automatically redeploys after future pushes when connected to this repository.

## Tableau Public integration

The Tableau section uses the public workbooks API for [John Paul Torres](https://public.tableau.com/app/profile/john.torres1912/vizzes). The Vercel function at `api/tableau.js` exposes public-only, sanitized metadata for the browser and caches successful responses. The Vite dev server runs the same handler. Unavailable endpoints do not cause invented project names: the gallery links directly to Tableau Public instead. The in-page Tableau viewer requires embedding to be permitted by Tableau; external links always remain available.

Run `npm test` to test response normalization.

## Updating your projects

All case-study content lives in [`src/data.js`](src/data.js). Update the `projects` array with a project name, repository URL, verified description, methods, takeaways, tags, category and dataset disclosure. The card collection and search palette update automatically. The `financialSample` values shown in the hero are sourced from the Financial Performance Dashboard README; update those only after verifying a changed dataset.

The code intentionally distinguishes illustrative SVG card artwork from real project screenshots. Only original repository assets are shown as screenshots in case-study dialogs.

## Design and technology

React 19, Vite 6, Recharts, lucide-react, custom responsive CSS, Google Fonts (Manrope, DM Sans, DM Mono). No paid libraries. No external API tokens or login are required. The Tableau gallery uses a small read-only serverless proxy.

## Data ethics

The Philippine Economic Intelligence Dashboard uses published PSA observations with indicator-specific reporting periods (2018–2025) and source references. It is a dated snapshot, not a real-time API. The financial, inventory, stock market sample, retail, and logistics case studies use fictional organizations and synthetic datasets. Their numerical insights are demonstrations rather than observed commercial results. Project summaries are based on their public READMEs and may need editing as the underlying work evolves.

## License

This portfolio source is available for personal review. Project repositories have their own licenses; refer to each repository for its licensing terms.
