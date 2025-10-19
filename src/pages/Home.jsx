import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import usePolling from '../hooks/usePolling';
import { fetchMarkets } from '../utils/api';
import { formatCurrency } from '../utils/format';
import './Home.css';

const highlights = [
  {
    icon: 'fa-regular fa-newspaper',
    title: 'Signal-first newsroom',
    copy: 'Curated headlines distilled into market-ready briefings in under 90 seconds.',
  },
  {
    icon: 'fa-solid fa-chart-line',
    title: 'Institutional-grade data',
    copy: 'Real-time market feeds, coin analytics, and liquidity screens in one terminal.',
  },
  {
    icon: 'fa-solid fa-shield-heart',
    title: 'Bias-free coverage',
    copy: 'Transparent sourcing with automated sentiment scoring to cut through noise.',
  },
];

const stats = [
  { label: 'Assets tracked', value: '3,200+' },
  { label: 'News sources', value: '180+' },
  { label: 'Avg. alert time', value: '42s' },
];

// Helper to format relative update time
const formatUpdated = (date) => {
  if (!date) return '';
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
};

const briefs = [
  {
    tag: 'Market Moves',
    title: 'Macro funds rotate back into BTC as yields soften',
    time: '12m ago',
  },
  {
    tag: 'DeFi Watch',
    title: 'Layer-2 TVL climbs 9% led by restaking protocols',
    time: '25m ago',
  },
  {
    tag: 'NFT Pulse',
    title: 'Gaming collections ignite weekly volumes with new launches',
    time: '41m ago',
  },
];

function Home() {
  const { data: markets, loading: liveLoading, error: liveError, lastUpdated, refresh } = usePolling(
    fetchMarkets,
    30000,
    true
  );

  const signals = useMemo(() => {
    if (!markets || !Array.isArray(markets)) return [];
    // Pick top movers by absolute 24h change percentage, then take top 4
    const ranked = [...markets]
      .filter((c) => typeof c.price_change_percentage_24h === 'number')
      .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
      .slice(0, 4);
    return ranked.map((c) => ({
      symbol: (c.symbol || '').toUpperCase(),
      name: c.name,
      price: formatCurrency(c.current_price, 6),
      change: `${(c.price_change_percentage_24h >= 0 ? '+' : '')}${(c.price_change_percentage_24h || 0).toFixed(2)}%`,
      direction: (c.price_change_percentage_24h || 0) >= 0 ? 'up' : 'down',
    }));
  }, [markets]);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner container">
          <div className="hero-copy">
            <span className="eyebrow">Realtime crypto intelligence</span>
            <h1>
              Stay ahead with <span>WILS</span>
            </h1>
            <p>
              Monitor markets, decode headlines, and react faster with a single command center
              built for analysts, builders, and curious explorers.
            </p>
            <div className="hero-actions">
              <Link to="/markets" className="btn">Launch markets</Link>
              <Link to="/news" className="btn secondary">Read today&apos;s brief</Link>
            </div>
            <ul className="hero-metrics">
              {stats.map((item) => (
                <li key={item.label}>
                  <span className="metric-value">{item.value}</span>
                  <span className="metric-label">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hero-widget">
            <div className="widget-card">
              <div className="widget-header">
                <span className="pill pill-soft">Live snapshot</span>
                <span className="widget-time">
                  {liveLoading ? 'Updating…' : liveError ? 'Failed to update' : `Updated ${formatUpdated(lastUpdated)}`}
                </span>
              </div>
              <ul className="widget-list">
                {liveError && (
                  <li style={{ color: '#ff859f' }}>Error loading markets</li>
                )}
                {!liveError && signals.length === 0 && (
                  <li className="muted">{liveLoading ? 'Loading…' : 'No data available'}</li>
                )}
                {signals.map((signal) => (
                  <li key={signal.symbol}>
                    <div className="widget-identity">
                      <span className="widget-symbol">{signal.symbol}</span>
                      <span className="widget-name">{signal.name}</span>
                    </div>
                    <div className="widget-pricing">
                      <span className="widget-price">{signal.price}</span>
                      <span className={`widget-change ${signal.direction}`}>
                        {signal.change}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/markets" className="widget-link">
                Open detailed markets <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section container">
        <div className="section-heading">
          <span className="eyebrow">Platform highlights</span>
          <h2>Built for analysts and explorers</h2>
          <p>
            Surface the trends that matter, cut the noise, and collaborate with your team on a
            workspace engineered for clarity.
          </p>
        </div>
        <div className="feature-grid">
          {highlights.map((item) => (
            <article className="feature-card" key={item.title}>
              <div className="feature-icon">
                <i className={item.icon}></i>
              </div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section container home-briefing">
        <div className="section-heading">
          <span className="eyebrow">Daily briefing</span>
          <h2>What&apos;s moving the market</h2>
        </div>
        <div className="brief-grid">
          {briefs.map((brief) => (
            <article className="brief-card" key={brief.title}>
              <span className="pill">{brief.tag}</span>
              <h3>{brief.title}</h3>
              <span className="brief-time">{brief.time}</span>
            </article>
          ))}
        </div>
        <div className="brief-actions">
          <Link to="/news" className="btn secondary">
            Browse all news
          </Link>
          <Link to="/coin/bitcoin" className="btn tertiary">
            View bitcoin detail
          </Link>
        </div>
      </section>

      <section className="home-section container home-cta">
        <div className="cta-card">
          <div>
            <span className="eyebrow">Stay in the flow</span>
            <h2>Receive tactical crypto notes before the bell</h2>
            <p>
              Weekly strategy decks, weekend deep dives, and instant alerts when the market turns.
            </p>
          </div>
          <div className="cta-actions">
            <Link to="/contact" className="btn">Talk with us</Link>
            <Link to="/about" className="btn secondary">Learn about WILS</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
