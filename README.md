# WILS Crypto News - React Edition

A modern, responsive cryptocurrency news and market data website built with **React**, **Vite**, **React Router**, and **Chart.js**.

## 🚀 Features

- **Home Page**: Hero section with call-to-action buttons
- **News Page**: Filter crypto news by category (Bitcoin, Ethereum, DeFi, NFTs, etc.)
- **Markets Page**: Live cryptocurrency prices from CoinGecko API with sortable columns
- **Coin Details Page**: Dynamic coin details with 30-day price chart using Chart.js
- **About Page**: Mission statement, team, and values
- **Contact Page**: Contact form with validation
- **Responsive Design**: Mobile-first approach with hamburger menu on small screens
- **Consistent Theme**: Dark theme with orange accents matching your original design

## 📁 Project Structure

```
wils-crypto-news/
├── public/
│   └── Pictures/          # Your existing images (bg2.png, art1.jpg)
├── src/
│   ├── components/        # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── NewsCard.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── News.jsx
│   │   ├── Markets.jsx
│   │   ├── CoinDetail.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── hooks/            # Custom React hooks
│   │   └── useFetch.js
│   ├── utils/            # Utility functions
│   │   ├── api.js        # CoinGecko API calls
│   │   └── format.js     # Number formatting
│   ├── App.jsx           # Main app with routing
│   ├── App.css
│   ├── index.css         # Global styles
│   └── main.jsx          # Entry point
├── index-react.html      # HTML template
├── package.json
├── vite.config.js
└── README.md
```

