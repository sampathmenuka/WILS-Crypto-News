const API_BASE = 'https://api.coingecko.com/api/v3';
// Optional CoinGecko demo key. Set VITE_COINGECKO_API_KEY in .env.local (see .env.example).
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

// Short-lived in-memory cache + in-flight de-duplication. Pages that poll the same
// endpoint (Home + Markets) share one request, which keeps us under the free-tier rate limit.
const cache = new Map();
const DEFAULT_TTL = 20_000;

const request = async (url, withKey) => {
  const headers = { Accept: 'application/json' };
  if (withKey && API_KEY) headers['x-cg-demo-api-key'] = API_KEY;
  let response;
  try {
    response = await fetch(url, { headers });
  } catch {
    // CoinGecko's 429 responses carry no CORS headers, so the browser reports a network error.
    throw new Error(
      navigator.onLine === false
        ? 'You appear to be offline. Check your connection and try again.'
        : 'Market data is temporarily unavailable (the free API may be rate-limiting). Please try again in a minute.'
    );
  }
  if (!response.ok) {
    const error = new Error(
      response.status === 429
        ? 'Rate limit reached. Please wait a moment and try again.'
        : `API request failed: ${response.status}`
    );
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const fetchJson = async (url, ttl = DEFAULT_TTL) => {
  const hit = cache.get(url);
  if (hit && (hit.promise || Date.now() - hit.time < ttl)) {
    return hit.promise ?? hit.data;
  }

  const promise = request(url, true)
    .catch((err) => {
      // A rejected/invalid key returns 401/403 – retry anonymously.
      if (API_KEY && (err.status === 401 || err.status === 403)) return request(url, false);
      throw err;
    })
    .then((data) => {
      cache.set(url, { data, time: Date.now() });
      return data;
    })
    .catch((err) => {
      // Serve stale data on failure if we have it, otherwise surface the error.
      if (hit?.data) {
        cache.set(url, hit);
        return hit.data;
      }
      cache.delete(url);
      throw err;
    });

  cache.set(url, { ...hit, promise });
  return promise;
};

export const fetchMarkets = async () => {
  const url = `${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
  return fetchJson(url);
};

export const fetchGlobal = async () => fetchJson(`${API_BASE}/global`, 60_000);

export const fetchCoinDetail = async (id) => {
  const url = `${API_BASE}/coins/${encodeURIComponent(id)}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
  return fetchJson(url, 60_000);
};

export const fetchCoinChart = async (id, days = 30) => {
  // Let CoinGecko choose granularity (5-min / hourly / daily) based on the range.
  const url = `${API_BASE}/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${days}`;
  return fetchJson(url, 60_000);
};

export const fetchNews = async (category = 'all') => {
  // CoinGecko doesn't have a dedicated news endpoint in their free API
  // We'll fetch trending coins and recent market events as "news"
  const trending = await fetchJson(`${API_BASE}/search/trending`, 120_000);

  // Transform trending data into news-like format
  const newsItems = trending.coins.slice(0, 15).map((item, idx) => {
    const coin = item.item;
    const change = coin.data?.price_change_percentage_24h?.usd;
    const direction = typeof change === 'number' ? (change >= 0 ? 'up' : 'down') : null;
    const changeText = direction ? `${change >= 0 ? '+' : ''}${change.toFixed(2)}%` : null;
    return {
      id: coin.id,
      title: direction
        ? `${coin.name} (${coin.symbol.toUpperCase()}) ${direction === 'up' ? 'climbs' : 'slides'} ${changeText} as it trends`
        : `${coin.name} (${coin.symbol.toUpperCase()}) Shows Strong Market Activity`,
      summary: `${coin.name} is currently trending with a market cap rank of #${coin.market_cap_rank || 'N/A'}. Recent trading activity indicates significant interest from investors.`,
      category: determineCategoryFromRank(coin.market_cap_rank),
      date: new Date(Date.now() - idx * 3600000).toISOString(),
      img: coin.large || coin.thumb || '/Pictures/art1.jpg',
      coin_id: coin.id,
      slug: coin.slug,
      change: changeText,
      direction,
      sparkline: coin.data?.sparkline,
    };
  });

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
