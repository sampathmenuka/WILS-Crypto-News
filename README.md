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

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Install Dependencies

```powershell
npm install
```

### Move Pictures Folder

Move your existing `Pictures` folder to the `public` directory:

```powershell
Move-Item -Path "Pictures" -Destination "public/"
```

Or manually copy the `Pictures` folder into a new `public` folder at the root of your project.

### Rename HTML File

The React app uses `index-react.html` as the entry point. Update `vite.config.js` if you want to use a different name, or keep as is.

## 🎯 Running the Application

### Development Server

```powershell
npm run dev
```

This will start the Vite development server at `http://localhost:3000` and automatically open your browser.

### Build for Production

```powershell
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```powershell
npm run preview
```

## 🎨 Features Breakdown

### 1. **Routing** (React Router v6)
- Clean, declarative routing
- Dynamic routes for coin details (`/coin/:id`)
- Active link highlighting in navigation

### 2. **API Integration** (CoinGecko)
- Live market data for top 50 cryptocurrencies
- Real-time price updates
- 30-day historical price charts
- No API key required (free tier)

### 3. **State Management**
- React hooks (`useState`, `useEffect`)
- Custom `useFetch` hook for API calls
- Loading and error states

### 4. **Charts** (Chart.js + react-chartjs-2)
- Beautiful, responsive line charts
- Custom styling to match theme
- Interactive tooltips

### 5. **Responsive Design**
- Mobile-first CSS
- Collapsible navigation menu
- Responsive grids and tables
- Touch-friendly UI elements

## 🔧 Customization

### Changing Theme Colors

Edit `src/index.css`:
```css
.btn {
  background: rgb(229, 125, 7); /* Orange accent */
}

.nav-bar {
  background-color: rgba(25, 75, 58, 0.7); /* Green navbar */
}
```

### Adding Real News API

Replace mock data in `src/pages/News.jsx` with a real API like:
- [CryptoPanic API](https://cryptopanic.com/developers/api/)
- [NewsAPI](https://newsapi.org/)
- [CoinGecko News](https://www.coingecko.com/en/api/documentation)

### Backend Integration for Contact Form

Update `src/pages/Contact.jsx` to send data to your backend:
```javascript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

## 📦 Dependencies

- **react** & **react-dom**: UI library
- **react-router-dom**: Client-side routing
- **chart.js** & **react-chartjs-2**: Charts and graphs
- **vite**: Fast build tool and dev server
- **@vitejs/plugin-react**: Vite plugin for React

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Notes

- **CoinGecko API**: Free tier has rate limits (~50 calls/min). The app fetches data on page load and refreshes markets every 2 minutes.
- **Images**: Update paths in `src/pages/News.jsx` if you add more images.
- **PropTypes**: For better type checking, PropTypes are used in components. Consider migrating to TypeScript for larger projects.

## 🚀 Next Steps

1. Add pagination to Markets page
2. Implement search functionality
3. Add dark/light theme toggle
4. Integrate real news API
5. Add unit tests with Vitest
6. Deploy to Vercel/Netlify

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

**Built with ❤️ using React + Vite**
