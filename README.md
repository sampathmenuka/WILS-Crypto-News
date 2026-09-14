# WILS Crypto News - React Edition

A modern, responsive cryptocurrency news and market data website built with **React**, **Vite**, **React Router**, and **Chart.js**.

## 🚀 Features

- **Home Page**: Hero with a live market snapshot, top movers, and your personal watchlist
- **News Page**: Trending coins as news cards with 24h moves, category filter and search
- **Markets Page**: Top 100 coins from CoinGecko with sortable columns (1h / 24h / 7d change, market cap, volume), 7-day sparklines, table/grid view, search, and filters (Top 10, Gainers, Losers, Watchlist)
- **Watchlist**: Star any coin to track it — saved in the browser (localStorage) and synced across tabs
- **Coin Details Page**: Interactive price chart with 24H / 7D / 30D / 90D / 1Y ranges, 24h range bar, performance, supply and all-time-high stats
- **About Page**: Mission statement, team, and values
- **Contact Page**: Validated contact form (inline errors, spam honeypot, character counter) that can post to a real endpoint, plus contact channels and FAQ
- **Mobile-first experience**: app-style bottom tab bar (Home, Markets, Watchlist, News, More sheet), slim top bar with quick search, dedicated mobile coin list with sort menu, swipeable feature cards, compact news cards, edge-to-edge charts, 44px touch targets, iOS safe-area and no-zoom inputs
- **404 Page** for unknown routes
- **Performance**: Route-based code splitting (Chart.js only loads on coin pages), shared API cache to avoid duplicate requests, polling pauses when the tab is hidden
- **Accessibility**: Skip link, keyboard-accessible menu and sort headers, `aria` states, visible focus rings, reduced-motion support
- **SEO**: Per-page titles, meta description, Open Graph tags and favicon

## ⚙️ Getting started

```bash
npm install
cp .env.example .env.local   # optional – see below
npm run dev                  # http://localhost:3000
npm run build                # production build in dist/
npm run preview              # serve the production build
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_COINGECKO_API_KEY` | Optional CoinGecko demo API key (raises rate limits). Without it the public API is used. |
| `VITE_CONTACT_ENDPOINT` | Optional URL that accepts a JSON `POST` (e.g. Formspree). Without it the contact form runs in demo mode. |

> Note: `VITE_*` values are bundled into the client JavaScript, so only use keys that are safe to expose publicly.

### Deploying

This is a single-page app using `BrowserRouter`, so your host must rewrite unknown paths to `index.html`
(Netlify: `/* /index.html 200` in `_redirects`; Vercel: a rewrite to `/index.html`).

## 📁 Project Structure

```
wils-crypto-news/
├── public/
│   ├── favicon.svg
│   └── Pictures/          # bg2.png, art1.jpg
├── src/
│   ├── components/        # Header, Footer, NewsCard, Sparkline, WatchButton, ScrollToTop
│   ├── pages/             # Home, News, Markets, CoinDetail, About, Contact, NotFound
│   ├── hooks/             # useFetch, usePolling, useWatchlist, useDocumentTitle
│   ├── utils/
│   │   ├── api.js         # CoinGecko API calls + caching
│   │   └── format.js      # Price / percent / compact number formatting
│   ├── App.jsx            # Routing (lazy-loaded pages)
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
├── index.html             # HTML template
├── package.json
├── vite.config.js
└── README.md
```

The `legacy/` folder holds the original static HTML version of the site (`about.html`, `coin.html`, `contact.html`,
`markets.html`, `news.html`, `styles.css`, `scripts/`). It is not part of the React build. It was moved out of the project root
because Vite's dev server served those files instead of the React routes (e.g. `/markets` → `markets.html`).
