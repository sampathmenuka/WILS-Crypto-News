const API_BASE = 'https://api.coingecko.com/api/v3';
const API_KEY = '72fe925db1b3419189bc8d4549e90e9a';

const fetchWithAuth = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-cg-demo-api-key': API_KEY,
      },
    });
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      // Try without auth header as fallback for demo API
      const fallbackResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!fallbackResponse.ok) {
        throw new Error(`API request failed: ${fallbackResponse.status}`);
      }
      return fallbackResponse.json();
    }
    
    return response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

export const fetchMarkets = async () => {
  const url = `${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`;
  return fetchWithAuth(url);
};

export const fetchCoinDetail = async (id) => {
  const url = `${API_BASE}/coins/${encodeURIComponent(id)}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
  return fetchWithAuth(url);
};

export const fetchCoinChart = async (id, days = 30) => {
  const url = `${API_BASE}/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
  return fetchWithAuth(url);
};

export const fetchNews = async (category = 'all') => {
  // CoinGecko doesn't have a dedicated news endpoint in their free API
  // We'll fetch trending coins and recent market events as "news"
  const trendingUrl = `${API_BASE}/search/trending`;
  const trending = await fetchWithAuth(trendingUrl);
  
  // Transform trending data into news-like format
  const newsItems = trending.coins.slice(0, 12).map((item, idx) => ({
    id: item.item.id,
    title: `${item.item.name} (${item.item.symbol.toUpperCase()}) Shows Strong Market Activity`,
    summary: `${item.item.name} is currently trending with a market cap rank of #${item.item.market_cap_rank || 'N/A'}. Recent trading activity indicates significant interest from investors.`,
    category: determineCategoryFromRank(item.item.market_cap_rank),
    date: new Date(Date.now() - idx * 3600000).toISOString().split('T')[0],
    img: item.item.large || item.item.thumb || '/Pictures/art1.jpg',
    coin_id: item.item.id,
    slug: item.item.slug,
  }));

  return category === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === category);
};

const determineCategoryFromRank = (rank) => {
  if (!rank) return 'altcoins';
  if (rank === 1) return 'bitcoin';
  if (rank === 2) return 'ethereum';
  if (rank <= 10) return 'defi';
  if (rank <= 50) return 'altcoins';
  return 'nfts';
};
