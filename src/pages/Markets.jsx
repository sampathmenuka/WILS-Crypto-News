import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { fetchMarkets } from '../utils/api';
import { formatNumber, formatCurrency } from '../utils/format';

function Markets() {
  const { data: markets, loading, error } = useFetch(fetchMarkets);
  const [sortKey, setSortKey] = useState('market_cap_rank');
  const [sortDir, setSortDir] = useState('asc');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    if (markets) {
      setLastUpdated(new Date().toLocaleTimeString());
    }
  }, [markets]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedMarkets = markets
    ? [...markets].sort((a, b) => {
        const va = a[sortKey];
        const vb = b[sortKey];
        if (va == null && vb == null) return 0;
        if (va == null) return 1;
        if (vb == null) return -1;
        if (typeof va === 'string') {
          return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
        }
        return sortDir === 'asc' ? va - vb : vb - va;
      })
    : [];

  if (loading) return <div className="container"><div className="loading">Loading markets...</div></div>;
  if (error) return <div className="container"><div className="error">Error: {error}</div></div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Live Markets</h1>
        <span className="muted">Updated {lastUpdated}</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('market_cap_rank')}>#</th>
              <th onClick={() => handleSort('name')}>Asset</th>
              <th onClick={() => handleSort('symbol')}>Symbol</th>
              <th onClick={() => handleSort('current_price')}>Price</th>
              <th onClick={() => handleSort('price_change_percentage_24h')}>24h %</th>
              <th onClick={() => handleSort('market_cap')}>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {sortedMarkets.map((coin) => {
              const change = coin.price_change_percentage_24h || 0;
              const chipClass = change >= 0 ? 'chip up' : 'chip down';
              return (
                <tr key={coin.id}>
                  <td>{coin.market_cap_rank ?? '-'}</td>
                  <td>
                    <Link to={`/coin/${coin.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '.55rem' }}>
                      {coin.image && (
                        <img src={coin.image} alt={coin.name} width="20" height="20" style={{ borderRadius: '50%' }} />
                      )}
                      <span>{coin.name}</span>
                    </Link>
                  </td>
                  <td>{(coin.symbol || '').toUpperCase()}</td>
                  <td>{formatCurrency(coin.current_price, 6)}</td>
                  <td>
                    <span className={chipClass}>{change.toFixed(2)}%</span>
                  </td>
                  <td>{formatCurrency(coin.market_cap, 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Markets;
