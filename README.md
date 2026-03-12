# AI Payments Strategy Framework
### Carlos Ureña — carlosurena.com

A five-model AI framework that transforms payment data into layered strategic intelligence.

---

## Project Structure

```
src/
├── main.jsx                          # App entry, router config
├── index.css                         # Global styles (matching carlosurena.com)
├── pages/
│   └── FrameworkIndex.jsx            # Landing page — native to carlosurena.com aesthetic
└── models/
    ├── Model01_ProfitabilityEngine.jsx
    ├── Model02_RailOptimizer.jsx
    ├── Model03_CorridorAnalyzer.jsx
    ├── Model04_ClientBehavior.jsx
    └── Model05_PortfolioScorecard.jsx
```

## Routes

| URL | Content |
|-----|---------|
| `/` | Framework landing page |
| `/models/01-profitability` | Payment Profitability Engine |
| `/models/02-rail-optimizer` | Rail Selection Optimizer |
| `/models/03-corridor-analyzer` | Cross-Border Corridor Analyzer |
| `/models/04-client-behavior` | Client Payment Behavior Engine |
| `/models/05-portfolio-scorecard` | Portfolio Strategic Scorecard |

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add model files
Each file in `src/models/` is a placeholder. Replace each with the
corresponding JSX from the `/outputs/` directory:

| Placeholder | Replace with |
|-------------|--------------|
| `Model01_ProfitabilityEngine.jsx` | `payment-profitability-engine.jsx` |
| `Model02_RailOptimizer.jsx` | `rail-selection-optimizer.jsx` |
| `Model03_CorridorAnalyzer.jsx` | `corridor-economics-analyzer.jsx` |
| `Model04_ClientBehavior.jsx` | `client-behavior-engine.jsx` |
| `Model05_PortfolioScorecard.jsx` | `portfolio-strategic-scorecard.jsx` |

### 3. Run locally
```bash
npm run dev
# Opens at http://localhost:5173
```

### 4. Build for production
```bash
npm run build
# Output in /dist — ready to deploy
```

---

## Deployment to GitHub Pages

### Option A — Automatic (recommended)
1. Push to a GitHub repo
2. Go to **Settings → Pages → Source → GitHub Actions**
3. Every push to `main` auto-deploys via `.github/workflows/deploy.yml`

### Option B — Custom domain (carlosurena.com)
1. In `vite.config.js` set `base: '/'`
2. Add a `CNAME` file to `/public/` containing `carlosurena.com`
3. In your DNS provider, add: `CNAME @ your-github-username.github.io`
4. In GitHub Pages settings, enter your custom domain

### Option C — Subdirectory (carlosurena.com/models)
1. In `vite.config.js` set `base: '/models/'`
2. Update all internal links accordingly
3. Configure your web host to serve `/models/` from the built `/dist/`

---

## Data Note
All models use synthetic data calibrated to realistic industry ranges.
No real client, transaction, or institutional data is included.

---

© 2025 Carlos Ureña · carlosurena.com
