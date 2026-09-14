import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { fetchCoinDetail, fetchCoinChart } from '../utils/api';
import {
  formatNumber,
  formatPrice,
  formatCompactCurrency,
  formatSignedPercent,
} from '../utils/format';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useMediaQuery from '../hooks/useMediaQuery';
import WatchButton from '../components/WatchButton';
import './CoinDetail.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ranges = [
  { days: 1, label: '24H' },
  { days: 7, label: '7D' },
  { days: 30, label: '30D' },
  { days: 90, label: '90D' },
  { days: 365, label: '1Y' },
];

// CoinGecko descriptions contain HTML links; render them as plain text.
const stripHtml = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent || '').trim();
};

function ChangeChip({ value }) {
  if (value == null) return <span className="muted">-</span>;
  return <span className={`chip ${value >= 0 ? 'up' : 'down'}`}>{formatSignedPercent(value)}</span>;
}

function CoinDetail() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);
  const [prices, setPrices] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const isMobile = useMediaQuery('(max-width: 640px)');

  useDocumentTitle(coin ? `${coin.name} (${coin.symbol?.toUpperCase()}) price` : 'Coin');

  // Don't show the previous coin's data while navigating to another coin.
  useEffect(() => {
    setCoin(null);
    setPrices(null);
  }, [id]);

  // Coin details. `cancelled` prevents a slow response for a previous coin overwriting the current one.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setExpanded(false);
    fetchCoinDetail(id)
      .then((data) => !cancelled && setCoin(data))
      .catch((err) => !cancelled && setError(err.message || 'Failed to load coin'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  // Price history for the selected range.
  useEffect(() => {
    let cancelled = false;
    setChartLoading(true);
    setChartError(null);
    fetchCoinChart(id, days)
      .then((data) => !cancelled && setPrices(data.prices || []))
      .catch((err) => !cancelled && setChartError(err.message || 'Failed to load chart'))
      .finally(() => !cancelled && setChartLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, days, reloadKey]);

  const description = useMemo(() => stripHtml(coin?.description?.en), [coin]);

  const chart = useMemo(() => {
    if (!prices || prices.length < 2) return null;
    const first = prices[0][1];
    const last = prices[prices.length - 1][1];
    const up = last >= first;
    const line = up ? '#4ade80' : '#fb7185';
    const dateFmt =
      days <= 1
        ? { hour: '2-digit', minute: '2-digit' }
        : days <= 90
          ? { month: 'short', day: 'numeric' }
          : { month: 'short', year: '2-digit' };

    return {
      change: ((last - first) / first) * 100,
      data: {
        labels: prices.map((p) => new Date(p[0]).toLocaleString(undefined, dateFmt)),
        datasets: [
          {
            label: 'Price (USD)',
            data: prices.map((p) => p[1]),
            borderColor: line,
            borderWidth: 2,
            backgroundColor: (ctx) => {
              const { chartArea, ctx: c } = ctx.chart;
              if (!chartArea) return 'transparent';
              const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              g.addColorStop(0, up ? 'rgba(74,222,128,0.28)' : 'rgba(251,113,133,0.28)');
              g.addColorStop(1, 'rgba(0,0,0,0)');
              return g;
            },
            tension: 0.25,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#a0a7c2', maxTicksLimit: isMobile ? 4 : 7, maxRotation: 0 },
          },
          y: {
            position: isMobile ? 'right' : 'left',
            grid: { color: 'rgba(255,255,255,.06)' },
            ticks: {
              color: '#a0a7c2',
              callback: (v) => (Math.abs(v) >= 1000 ? `$${Math.round(v).toLocaleString()}` : formatPrice(v)),
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(11,13,30,0.95)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (ctx) => formatPrice(ctx.parsed.y),
            },
          },
        },
      },
    };
  }, [prices, days, isMobile]);

  if (loading && !coin) {
    return (
      <div className="container">
        <div className="coin-skeleton" role="status" aria-label="Loading coin details">
          <span className="skeleton" style={{ width: '40%', height: 38 }}></span>
          <span className="skeleton" style={{ width: '100%', height: 320 }}></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="coin-error" role="alert">
          <i className="fa-solid fa-circle-exclamation"></i>
          <p>{error.includes('404') ? "We couldn't find that coin." : error}</p>
          <div className="coin-error-actions">
            <button className="btn secondary" onClick={() => setReloadKey((k) => k + 1)}>
              Retry
            </button>
            <Link to="/markets" className="btn">Back to markets</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!coin) return null;

  const md = coin.market_data || {};
  const price = md.current_price?.usd;
  const low = md.low_24h?.usd;
  const high = md.high_24h?.usd;
  const rangePos =
    price != null && low != null && high != null && high > low
      ? Math.min(100, Math.max(0, ((price - low) / (high - low)) * 100))
      : null;
  const homepage = coin.links?.homepage?.find(Boolean);
  const shortDesc = description.split('. ').slice(0, 2).join('. ');
  const hasMore = description.length > shortDesc.length + 1;

  const stats = [
    { label: 'Market Cap', value: formatCompactCurrency(md.market_cap?.usd) },
    { label: '24h Volume', value: formatCompactCurrency(md.total_volume?.usd) },
    { label: 'Fully Diluted Val.', value: formatCompactCurrency(md.fully_diluted_valuation?.usd) },
    {
      label: 'Circulating Supply',
      value: `${formatNumber(md.circulating_supply, 0)} ${coin.symbol?.toUpperCase() || ''}`,
    },
    { label: 'Max Supply', value: md.max_supply ? formatNumber(md.max_supply, 0) : '∞' },
    {
      label: 'All-Time High',
      value: formatPrice(md.ath?.usd),
      sub: md.ath_change_percentage?.usd != null
        ? `${formatSignedPercent(md.ath_change_percentage.usd)} from ATH`
        : null,
    },
  ];

  return (
    <div className="container coin-page">
      <Link to="/markets" className="back-link">
        <i className="fa-solid fa-arrow-left"></i> All markets
      </Link>

      <div className="coin-header">
        <div className="coin-identity">
          {coin.image?.large && <img src={coin.image.large} alt="" className="coin-logo" />}
          <div>
            <h1>
              {coin.name} <span className="coin-symbol">{coin.symbol?.toUpperCase()}</span>
            </h1>
            <div className="coin-badges">
              {coin.market_cap_rank && <span className="pill">Rank #{coin.market_cap_rank}</span>}
              {coin.categories?.slice(0, 2).map((c) => (
                <span key={c} className="pill pill-soft">{c}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="coin-price-block">
          <div className="coin-price-row">
            <span className="coin-price">{formatPrice(price)}</span>
            <ChangeChip value={md.price_change_percentage_24h} />
          </div>
          <div className="coin-actions">
            <WatchButton id={coin.id} name={coin.name} className="watch-btn-lg" />
            {homepage && (
              <a href={homepage} target="_blank" rel="noopener noreferrer" className="btn secondary btn-sm">
                Website <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            )}
          </div>
        </div>
      </div>

      <section className="coin-layout">
        <div className="card chart-card">
          <div className="card-body">
            <div className="chart-toolbar">
              <div>
                <h2 className="chart-title">Price chart</h2>
                {chart && (
                  <span className={`chart-change ${chart.change >= 0 ? 'up' : 'down'}`}>
                    {formatSignedPercent(chart.change)} over {ranges.find((r) => r.days === days)?.label}
                  </span>
                )}
              </div>
              <div className="range-tabs" role="group" aria-label="Chart range">
                {ranges.map((r) => (
                  <button
                    key={r.days}
                    className={`range-tab ${days === r.days ? 'active' : ''}`}
                    aria-pressed={days === r.days}
                    onClick={() => setDays(r.days)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={`chart-area ${chartLoading ? 'is-loading' : ''}`}>
              {chartError && !chart ? (
                <div className="chart-message">
                  <p>{chartError}</p>
                  <button className="btn secondary btn-sm" onClick={() => setReloadKey((k) => k + 1)}>
                    Retry
                  </button>
                </div>
              ) : chart ? (
                <Line data={chart.data} options={chart.options} />
              ) : (
                <span className="skeleton" style={{ width: '100%', height: '100%' }}></span>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>24h Range</h3>
            <div className="range-bar" aria-label="Price position within 24 hour range">
              <div className="range-track">
                {rangePos != null && <span className="range-marker" style={{ left: `${rangePos}%` }}></span>}
              </div>
              <div className="range-labels">
                <span>{formatPrice(low)}</span>
                <span>{formatPrice(high)}</span>
              </div>
            </div>

            <h3 style={{ marginTop: '0.6rem' }}>Performance</h3>
            <div className="perf-grid">
              {[
                ['24h', md.price_change_percentage_24h],
                ['7d', md.price_change_percentage_7d],
                ['30d', md.price_change_percentage_30d],
                ['1y', md.price_change_percentage_1y],
              ].map(([label, value]) => (
                <div key={label} className="perf-item">
                  <span className="muted">{label}</span>
                  <ChangeChip value={value} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="coin-stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="coin-stat">
            <span className="coin-stat-label">{s.label}</span>
            <span className="coin-stat-value">{s.value}</span>
            {s.sub && <span className="coin-stat-sub">{s.sub}</span>}
          </div>
        ))}
      </section>

      {description && (
        <section className="card coin-about">
          <div className="card-body">
            <h3>About {coin.name}</h3>
            <p className="coin-desc">
              {expanded || !hasMore ? description : `${shortDesc}.`}
            </p>
            {hasMore && (
              <button className="link-btn" onClick={() => setExpanded((v) => !v)}>
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default CoinDetail;
