import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import usePolling from '../hooks/usePolling';
import useWatchlist from '../hooks/useWatchlist';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useMediaQuery from '../hooks/useMediaQuery';
import Sparkline from '../components/Sparkline';
import WatchButton from '../components/WatchButton';
import { fetchMarkets } from '../utils/api';
import {
  formatPrice,
  formatCompactCurrency,
  formatSignedPercent,
  formatTimeAgo,
} from '../utils/format';
import './Markets.css';

const VIEW_KEY = 'wils:markets-view';

const viewModes = [
  { value: 'table', label: 'Table View', icon: 'fa-solid fa-table' },
  { value: 'grid', label: 'Grid View', icon: 'fa-solid fa-grip' },
];

const filterOptions = [
  { value: 'all', label: 'All Assets' },
  { value: 'watchlist', label: 'Watchlist', icon: 'fa-solid fa-star' },
  { value: 'top10', label: 'Top 10' },
  { value: 'gainers', label: 'Top Gainers' },
  { value: 'losers', label: 'Top Losers' },
];

const columns = [
  { key: 'market_cap_rank', label: '#' },
  { key: 'name', label: 'Asset' },
  { key: 'current_price', label: 'Price' },
  { key: 'price_change_percentage_1h_in_currency', label: '1h %' },
  { key: 'price_change_percentage_24h', label: '24h %' },
  { key: 'price_change_percentage_7d_in_currency', label: '7d %' },
  { key: 'market_cap', label: 'Market Cap' },
  { key: 'total_volume', label: 'Volume (24h)' },
];

// Sort choices for the mobile list (the table uses clickable headers instead).
const mobileSorts = [
  { key: 'market_cap_rank', label: 'Rank' },
  { key: 'price_change_percentage_24h', label: '24h change' },
  { key: 'price_change_percentage_7d_in_currency', label: '7d change' },
  { key: 'current_price', label: 'Price' },
  { key: 'market_cap', label: 'Market cap' },
  { key: 'total_volume', label: 'Volume' },
  { key: 'name', label: 'Name' },
];

const FILTERS = new Set(filterOptions.map((f) => f.value));

const readView = () => {
  try {
    return localStorage.getItem(VIEW_KEY) === 'grid' ? 'grid' : 'table';
  } catch {
    return 'table';
  }
};

function ChangeChip({ value }) {
  if (value == null) return <span className="muted">-</span>;
  return <span className={`chip ${value >= 0 ? 'up' : 'down'}`}>{formatSignedPercent(value)}</span>;
}

function Markets() {
  useDocumentTitle('Markets');
  const { data: markets, loading, error, lastUpdated, refresh } = usePolling(
    fetchMarkets,
    30000,
    true
  );
  const { watchlist } = useWatchlist();
  const [sortKey, setSortKey] = useState('market_cap_rank');
  const [sortDir, setSortDir] = useState('asc');
  const [viewMode, setViewMode] = useState(readView);
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  const filter = FILTERS.has(filterParam) ? filterParam : 'all';
  const setFilter = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'all') next.delete('filter');
    else next.set('filter', value);
    setSearchParams(next, { replace: true });
  };
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 640px)');

  // "/markets?search=1" (header search button) focuses the search box.
  useEffect(() => {
    if (searchParams.get('search') && searchRef.current) {
      searchRef.current.focus();
      const next = new URLSearchParams(searchParams);
      next.delete('search');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams, markets]);
  const [, setTick] = useState(0);

  // Re-render every 10s so "Updated Xs ago" stays accurate.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, viewMode);
    } catch {
      // ignore
    }
  }, [viewMode]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      // Numbers read best largest-first; rank and names read best ascending.
      setSortDir(key === 'market_cap_rank' || key === 'name' ? 'asc' : 'desc');
    }
  };

  const sortedMarkets = useMemo(() => {
    if (!Array.isArray(markets)) return [];
    let filtered = [...markets];

    if (searchQuery) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      );
    }

    switch (filter) {
      case 'watchlist':
        filtered = filtered.filter((c) => watchlist.includes(c.id));
        break;
      case 'top10':
        filtered = filtered.filter((c) => c.market_cap_rank && c.market_cap_rank <= 10);
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
      default:
        break;
    }

    return filtered.sort((a, b) => {
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
  }, [markets, searchQuery, filter, watchlist, sortKey, sortDir]);

  const marketStats = useMemo(() => {
    if (!Array.isArray(markets) || markets.length === 0) return null;
    return {
      total: markets.length,
      gainers: markets.filter((c) => c.price_change_percentage_24h > 0).length,
      losers: markets.filter((c) => c.price_change_percentage_24h < 0).length,
      avgChange:
        markets.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) /
        markets.length,
    };
  }, [markets]);

  if (loading && !markets) {
    return (
      <div className="markets-page">
        <div className="container">
          <div className="markets-loading" role="status">
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
          <div className="markets-error" role="alert">
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

  const emptyWatchlist = filter === 'watchlist' && watchlist.length === 0;

  return (
    <div className="markets-page">
      <div className="container">
        <div className="markets-hero">
          <div className="markets-hero-content">
            <span className="eyebrow">Live data</span>
            <h1>Cryptocurrency Markets</h1>
            <p>Real-time prices, market caps, and price changes for the top 100 digital assets.</p>
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
                    {formatSignedPercent(marketStats.avgChange)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="markets-controls">
          <div className="controls-left">
            <div className="filter-tabs" role="tablist" aria-label="Filter assets">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  role="tab"
                  aria-selected={filter === opt.value}
                  className={`filter-tab ${filter === opt.value ? 'active' : ''}`}
                  onClick={() => setFilter(opt.value)}
                >
                  {opt.icon && <i className={opt.icon}></i>} {opt.label}
                  {opt.value === 'watchlist' && watchlist.length > 0 && (
                    <span className="tab-count">{watchlist.length}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="search-bar">
              <i className="fa-solid fa-search" aria-hidden="true"></i>
              <input
                ref={searchRef}
                type="search"
                enterKeyHint="search"
                placeholder="Search assets..."
                aria-label="Search assets"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>

          {isMobile && (
            <div className="mobile-sort">
              <label htmlFor="mobile-sort" className="sr-only">Sort by</label>
              <span className="mobile-sort-label" aria-hidden="true">Sort</span>
              <select
                id="mobile-sort"
                value={sortKey}
                onChange={(e) => {
                  const key = e.target.value;
                  setSortKey(key);
                  setSortDir(key === 'market_cap_rank' || key === 'name' ? 'asc' : 'desc');
                }}
              >
                {mobileSorts.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
              <button
                type="button"
                className="sort-dir-btn"
                onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                aria-label={sortDir === 'asc' ? 'Sorted ascending, switch to descending' : 'Sorted descending, switch to ascending'}
              >
                <i className={`fa-solid fa-arrow-${sortDir === 'asc' ? 'up' : 'down'}-wide-short`}></i>
              </button>
            </div>
          )}

          <div className="controls-right">
            <div className="update-indicator" aria-live="polite">
              <span className={`live-dot ${error ? 'stale' : ''}`} aria-hidden="true"></span>
              <span>{error ? 'Update failed' : `Updated ${formatTimeAgo(lastUpdated)}`}</span>
              <button
                className="refresh-btn"
                onClick={refresh}
                disabled={loading}
                aria-label="Refresh prices"
              >
                <i className={`fa-solid fa-rotate-right ${loading ? 'spinning' : ''}`}></i>
              </button>
            </div>
            <div className="view-toggle" role="group" aria-label="View mode">
              {viewModes.map((mode) => (
                <button
                  key={mode.value}
                  className={`view-btn ${viewMode === mode.value ? 'active' : ''}`}
                  onClick={() => setViewMode(mode.value)}
                  title={mode.label}
                  aria-label={mode.label}
                  aria-pressed={viewMode === mode.value}
                >
                  <i className={mode.icon}></i>
                </button>
              ))}
            </div>
          </div>
        </div>

        {sortedMarkets.length === 0 ? (
          <div className="markets-empty">
            <i className={emptyWatchlist ? 'fa-regular fa-star' : 'fa-solid fa-magnifying-glass'}></i>
            <p>
              {emptyWatchlist
                ? 'Your watchlist is empty. Tap the star next to any asset to track it here.'
                : 'No assets found matching your criteria.'}
            </p>
            <button
              className="btn secondary"
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
            >
              {emptyWatchlist ? 'Browse all assets' : 'Clear Filters'}
            </button>
          </div>
        ) : isMobile ? (
          <ul className="coin-list">
            {sortedMarkets.map((coin) => {
              const change = coin.price_change_percentage_24h;
              return (
                <li key={coin.id}>
                  <Link to={`/coin/${coin.id}`} className="coin-row">
                    <span className="coin-row-rank">{coin.market_cap_rank ?? '-'}</span>
                    {coin.image ? (
                      <img src={coin.image} alt="" className="coin-row-icon" loading="lazy" />
                    ) : (
                      <span className="coin-row-icon" />
                    )}
                    <span className="coin-row-main">
                      <span className="coin-row-name">{coin.name}</span>
                      <span className="coin-row-sub">
                        {(coin.symbol || '').toUpperCase()} · {formatCompactCurrency(coin.market_cap)}
                      </span>
                    </span>
                    <span className="coin-row-spark">
                      <Sparkline
                        data={coin.sparkline_in_7d?.price}
                        width={56}
                        height={28}
                        positive={
                          coin.price_change_percentage_7d_in_currency != null
                            ? coin.price_change_percentage_7d_in_currency >= 0
                            : undefined
                        }
                        label={`${coin.name} 7 day price trend`}
                      />
                    </span>
                    <span className="coin-row-price">
                      <span className="coin-row-value">{formatPrice(coin.current_price)}</span>
                      <span className={`coin-row-change ${change >= 0 ? 'up' : 'down'}`}>
                        {formatSignedPercent(change)}
                      </span>
                    </span>
                  </Link>
                  <WatchButton id={coin.id} name={coin.name} className="coin-row-watch" />
                </li>
              );
            })}
          </ul>
        ) : viewMode === 'table' ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th className="watch-col"><span className="sr-only">Watchlist</span></th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="sortable"
                      aria-sort={
                        sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                      }
                    >
                      <button type="button" className="sort-btn" onClick={() => handleSort(col.key)}>
                        {col.label}
                        {sortKey === col.key && (
                          <i className={`fa-solid fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </button>
                    </th>
                  ))}
                  <th>Last 7 Days</th>
                </tr>
              </thead>
              <tbody>
                {sortedMarkets.map((coin) => (
                  <tr key={coin.id}>
                    <td className="watch-col">
                      <WatchButton id={coin.id} name={coin.name} />
                    </td>
                    <td className="rank-cell">{coin.market_cap_rank ?? '-'}</td>
                    <td className="asset-cell">
                      <Link to={`/coin/${coin.id}`} className="asset-link">
                        {coin.image && (
                          <img src={coin.image} alt="" className="coin-icon" loading="lazy" />
                        )}
                        <div className="asset-info">
                          <span className="asset-name">{coin.name}</span>
                          <span className="asset-symbol">{(coin.symbol || '').toUpperCase()}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="price-cell">{formatPrice(coin.current_price)}</td>
                    <td><ChangeChip value={coin.price_change_percentage_1h_in_currency} /></td>
                    <td><ChangeChip value={coin.price_change_percentage_24h} /></td>
                    <td><ChangeChip value={coin.price_change_percentage_7d_in_currency} /></td>
                    <td title={coin.market_cap?.toLocaleString()}>{formatCompactCurrency(coin.market_cap)}</td>
                    <td className="muted">{formatCompactCurrency(coin.total_volume)}</td>
                    <td>
                      <Sparkline
                        data={coin.sparkline_in_7d?.price}
                        positive={
                          coin.price_change_percentage_7d_in_currency != null
                            ? coin.price_change_percentage_7d_in_currency >= 0
                            : undefined
                        }
                        label={`${coin.name} 7 day price trend`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="markets-grid">
            {sortedMarkets.map((coin) => {
              const change = coin.price_change_percentage_24h;
              return (
                <Link to={`/coin/${coin.id}`} key={coin.id} className="market-card">
                  <div className="market-card-header">
                    <div className="market-card-asset">
                      {coin.image && <img src={coin.image} alt="" className="coin-icon-large" loading="lazy" />}
                      <div>
                        <h3>{coin.name}</h3>
                        <span className="market-card-symbol">{(coin.symbol || '').toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="market-card-meta">
                      <span className="market-card-rank">#{coin.market_cap_rank ?? '-'}</span>
                      <WatchButton id={coin.id} name={coin.name} />
                    </div>
                  </div>
                  <div className="market-card-price">
                    <span className="price-label">Price</span>
                    <span className="price-value">{formatPrice(coin.current_price)}</span>
                  </div>
                  <Sparkline
                    data={coin.sparkline_in_7d?.price}
                    width={240}
                    height={48}
                    label={`${coin.name} 7 day price trend`}
                  />
                  <div className="market-card-stats">
                    <div className="stat-item">
                      <span className="stat-label">24h Change</span>
                      <span className={`stat-value ${change >= 0 ? 'up' : 'down'}`}>
                        {formatSignedPercent(change)}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Market Cap</span>
                      <span className="stat-value">{formatCompactCurrency(coin.market_cap)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        <p className="data-attribution muted">
          Market data provided by{' '}
          <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer">CoinGecko</a>.
          Prices refresh every 30 seconds while this tab is open.
        </p>
      </div>
    </div>
  );
}

export default Markets;
