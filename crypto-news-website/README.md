# Crypto News Website

## Overview
The Crypto News Website is a modern web application that provides users with the latest news, market data, and detailed information about various cryptocurrencies. The website features a responsive design, ensuring a seamless experience across devices.

## Features
- **News Page**: Displays the latest cryptocurrency news articles with a grid layout and filtering options.
- **Markets Page**: Shows live cryptocurrency prices in a sortable table format, fetching data from external APIs.
- **Coin Details Page**: Provides detailed information about individual cryptocurrencies, including price charts and performance metrics.
- **About Page**: Describes the website's mission and includes information about the team and contributors.
- **Contact Page**: Contains a contact form for user inquiries and may include an embedded map.

## Project Structure
```
crypto-news-website
├── public
│   └── index.html
├── src
│   ├── assets
│   │   └── fonts
│   ├── components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ArticleCard.jsx
│   │   ├── MarketRow.jsx
│   │   └── CoinChart.jsx
│   ├── pages
│   │   ├── News.jsx
│   │   ├── Markets.jsx
│   │   ├── CoinDetails.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── services
│   │   └── api.js
│   ├── styles
│   │   └── styles.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd crypto-news-website
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Running the Application
To start the development server, run:
```
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to view the application.

## Technologies Used
- React
- Vite
- CSS
- JavaScript

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.