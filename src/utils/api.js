const API_BASE = 'https://api.coingecko.com/api/v3';

export const fetchMarkets = async () => {
  const url = `${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch markets');
  }
  return response.json();
};

export const fetchCoinDetail = async (id) => {
  const url = `${API_BASE}/coins/${encodeURIComponent(id)}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch coin details');
  }
  return response.json();
};

export const fetchCoinChart = async (id, days = 30) => {
  const url = `${API_BASE}/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch coin chart');
  }
  return response.json();
};
