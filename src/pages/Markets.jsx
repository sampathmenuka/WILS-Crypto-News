import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePolling from '../hooks/usePolling';
import { fetchMarkets } from '../utils/api';
import { formatNumber, formatCurrency } from '../utils/format';
import './Markets.css';

const viewModes = [
  { value: 'table', label: 'Table View', icon: 'fa-solid fa-table' },
  { value: 'grid', label: 'Grid View', icon: 'fa-solid fa-grip' },
];

const filterOptions = [
  { value: 'all', label: 'All Assets' },
  { value: 'top10', label: 'Top 10' },
  { value: 'gainers', label: 'Top Gainers' },
  { value: 'losers', label: 'Top Losers' },
];

function Markets() {
  const { data: markets, loading, error, lastUpdated, refresh } = usePolling(
    fetchMarkets,
    30000,
    true
  );
  const [sortKey, setSortKey] = useState('market_cap_rank');
  const [sortDir, setSortDir] = useState('asc');
  const [viewMode, setViewMode] = useState('table');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const formatUpdated = (date) => {
    if (!date) return 'Never';
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 10) return 'just now';
    if (diff < 60) return `${diff}s ago`;
    const m = Math.floor(diff / 60);
    if (m < 60) return `${m}m ago`;
    return date.toLocaleTimeString();
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const getFilteredMarkets = () => {
    if (!markets) return [];
    let filtered = [...markets];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      );
    }

    // Apply filter
    switch (filter) {
      case 'top10':
        filtered = filtered.slice(0, 10);
        break;
      case 'gainers':
        filtered = filtered
          .filter((c) => c.price_change_percentage_24h > 0)
          .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
          .slice(0, 20);
        break;
      case 'losers':
        filtered = filtered
          .filter((c) => c.price_change_percentage_24h < 0)
          .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
          .slice(0, 20);
        break;
    }

    return filtered;
  };

  const sortedMarkets = getFilteredMarkets().sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (typeof va === 'string') {
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    }
    return sortDir === 'asc' ? va - vb : vb - va;
  });

  const marketStats = markets
    ? {
        total: markets.length,
        gainers: markets.filter((c) => c.price_change_percentage_24h > 0).length,
        losers: markets.filter((c) => c.price_change_percentage_24h < 0).length,
        avgChange:
          markets.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) /
          markets.length,
      }
    : null;

  if (loading && !markets) {
    return (
      <div className="markets-page">
        <div className="container">
          <div className="markets-loading">
            <div className="loading-spinner"></div>
            <p>Loading live market data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !markets) {
    return (
      <div className="markets-page">
        <div className="container">
          <div className="markets-error">
            <i className="fa-solid fa-circle-exclamation"></i>
            <p>{error}</p>
            <button className="btn secondary" onClick={refresh}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="markets-page">
      <div className="container">
        <div className="markets-hero">
          <div className="markets-hero-content">
            <span className="eyebrow">Live data</span>
            <h1>Cryptocurrency Markets</h1>
            <p>Real-time prices, market caps, and 24-hour changes for top digital assets.</p>
          </div>
          <div className="markets-hero-stats">
            {marketStats && (
              <>
                <div className="stat-card">
                  <span className="stat-label">Total Assets</span>
                  <span className="stat-value">{marketStats.total}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Gainers</span>
                  <span className="stat-value up">{marketStats.gainers}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Losers</span>
                  <span className="stat-value down">{marketStats.losers}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Avg. Change</span>
                  <span className={`stat-value ${marketStats.avgChange >= 0 ? 'up' : 'down'}`}>
                    {marketStats.avgChange >= 0 ? '+' : ''}
                    {marketStats.avgChange.toFixed(2)}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="markets-controls">
          <div className="controls-left">
            <div className="filter-tabs">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`filter-tab ${filter === opt.value ? 'active' : ''}`}
                  onClick={() => setFilter(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="search-bar">
              <i className="fa-solid fa-search"></i>
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>

          <div className="controls-right">
            <div className="update-indicator">
              <i className="fa-solid fa-clock"></i>
              <span>{formatUpdated(lastUpdated)}</span>
              <button className="refresh-btn" onClick={refresh} disabled={loading}>
                <i className={`fa-solid fa-rotate-right ${loading ? 'spinning' : ''}`}></i>
              </button>
            </div>
            <div className="view-toggle">
              {viewModes.map((mode) => (
                <button
                  key={mode.value}
                  className={`view-btn ${viewMode === mode.value ? 'active' : ''}`}
                  onClick={() => setViewMode(mode.value)}
                  title={mode.label}
                >
                  <i className={mode.icon}></i>
                </button>
              ))}
            </div>
          </div>
        </div>

        {sortedMarkets.length === 0 ? (
          <div className="markets-empty">
            <i className="fa-solid fa-magnifying-glass"></i>
            <p>No assets found matching your criteria.</p>
            <button
              className="btn secondary"
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('market_cap_rank')} className="sortable">
                    #
                    {sortKey === 'market_cap_rank' && (
                      <i className={`fa-solid fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`}></i>
                    )}
                  </th>
                  <th onClick={() => handleSort('name')} className="sortable">
                    Asset
                    {sortKey === 'name' && (
                      <i className={`fa-solid fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`}></i>
                    )}
                  </th>
                  <th onClick={() => handleSort('current_price')} className="sortable">
                    Price
                    {sortKey === 'current_price' && (
                      <i className={`fa-solid fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`}></i>
                    )}
                  </th>
                  <th onClick={() => handleSort('price_change_percentage_24h')} className="sortable">
                    24h %
                    {sortKey === 'price_change_percentage_24h' && (
                      <i className={`fa-solid fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`}></i>
                    )}
                  </th>
                  <th onClick={() => handleSort('market_cap')} className="sortable">
                    Market Cap
                    {sortKey === 'market_cap' && (
                      <i className={`fa-solid fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`}></i>
                    )}
                  </th>
                  <th onClick={() => handleSort('total_volume')} className="sortable">
                    Volume (24h)
                    {sortKey === 'total_volume' && (
                      <i className={`fa-solid fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`}></i>
                    )}
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedMarkets.map((coin) => {
                  const change = coin.price_change_percentage_24h || 0;
                  const chipClass = change >= 0 ? 'chip up' : 'chip down';
                  return (
                    <tr key={coin.id}>
                      <td className="rank-cell">{coin.market_cap_rank ?? '-'}</td>
                      <td className="asset-cell">
                        <Link to={`/coin/${coin.id}`} className="asset-link">
                          {coin.image && (
                            <img src={coin.image} alt={coin.name} className="coin-icon" />
                          )}
                          <div className="asset-info">
                            <span className="asset-name">{coin.name}</span>
                            <span className="asset-symbol">{(coin.symbol || '').toUpperCase()}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="price-cell">{formatCurrency(coin.current_price, 6)}</td>
                      <td>
                        <span className={chipClass}>
                          {change >= 0 ? '+' : ''}
                          {change.toFixed(2)}%
                        </span>
                      </td>
                      <td>{formatCurrency(coin.market_cap, 0)}</td>
                      <td className="muted">{formatCurrency(coin.total_volume, 0)}</td>
                      <td>
                        <Link to={`/coin/${coin.id}`} className="btn-view">
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="markets-grid">
            {sortedMarkets.map((coin) => {
              const change = coin.price_change_percentage_24h || 0;
              return (
                <Link to={`/coin/${coin.id}`} key={coin.id} className="market-card">
                  <div className="market-card-header">
                    <div className="market-card-asset">
                      {coin.image && <img src={coin.image} alt={coin.name} className="coin-icon-large" />}
                      <div>
                        <h3>{coin.name}</h3>
                        <span className="market-card-symbol">{(coin.symbol || '').toUpperCase()}</span>
                      </div>
                    </div>
                    <span className="market-card-rank">#{coin.market_cap_rank}</span>
                  </div>
                  <div className="market-card-price">
                    <span className="price-label">Price</span>
                    <span className="price-value">{formatCurrency(coin.current_price, 6)}</span>
                  </div>
                  <div className="market-card-stats">
                    <div className="stat-item">
                      <span className="stat-label">24h Change</span>
                      <span className={`stat-value ${change >= 0 ? 'up' : 'down'}`}>
                        {change >= 0 ? '+' : ''}
                        {change.toFixed(2)}%
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Market Cap</span>
                      <span className="stat-value">{formatCurrency(coin.market_cap, 0)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Markets;
