import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Fetch market data for multiple coins
export const fetchMarketData = async () => {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

// Fetch single coin details
export const fetchCoinDetails = async (coinId) => {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching coin details:', error);
    throw error;
  }
};

// Fetch coin price history for chart
export const fetchCoinChart = async (coinId, days = 7) => {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};

// Fetch news articles (mock data - replace with real news API)
export const fetchNews = async (category = 'all') => {
  // TODO: Replace with actual news API (e.g., CryptoPanic, NewsAPI)
  const articles = [
    {
      id: 1,
      title: 'Bitcoin Reaches New All-Time High',
      image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=800&q=80',
      date: '2025-10-17T09:00:00Z',
      category: 'Bitcoin',
      summary: 'Bitcoin surpasses previous records as institutional adoption grows.',
      link: '#',
    },
    {
      id: 2,
      title: 'Ethereum 2.0 Rollout Hits Major Milestone',
      image: 'https://images.unsplash.com/photo-1621508673905-09cdd1a70706?auto=format&fit=crop&w=800&q=80',
      date: '2025-10-16T15:30:00Z',
      category: 'Ethereum',
      summary: 'Developers confirm the completion of the latest phase, unlocking new staking rewards.',
      link: '#',
    },
    {
      id: 3,
      title: 'Top DeFi Protocols Double TVL in Q3',
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee529688c?auto=format&fit=crop&w=800&q=80',
      date: '2025-10-15T10:10:00Z',
      category: 'DeFi',
      summary: 'Decentralised finance protocols continue to grow with innovative yield products.',
      link: '#',
    },
    {
      id: 4,
      title: 'NFT Market Shows Early Signs of Recovery',
      image: 'https://images.unsplash.com/photo-1620321023374-d1a966f2aa68?auto=format&fit=crop&w=800&q=80',
      date: '2025-10-14T18:45:00Z',
      category: 'NFTs',
      summary: 'Collectors return as major brands enter the space with new digital drops.',
      link: '#',
    },
  ];

  if (category === 'all') {
    return articles;
  }

  return articles.filter((article) => article.category.toLowerCase() === category.toLowerCase());
};

// Default export for CoinDetails page
const api = {
  fetchMarketData,
  fetchCoinDetails,
  fetchCoinChart,
  fetchNews,
};

export default api;