import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import usePolling from '../hooks/usePolling';
import useWatchlist from '../hooks/useWatchlist';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Sparkline from '../components/Sparkline';
import { fetchMarkets } from '../utils/api';
import { formatPrice, formatSignedPercent, formatTimeAgo } from '../utils/format';
import './Home.css';

const highlights = [
  {
    icon: 'fa-regular fa-newspaper',
    title: 'Signal-first newsroom',
    copy: 'Curated headlines distilled into market-ready briefings in under 90 seconds.',
    color: 'purple',
  },
  {
    icon: 'fa-solid fa-chart-line',
    title: 'Institutional-grade data',
    copy: 'Real-time market feeds, coin analytics, and liquidity screens in one terminal.',
    color: 'blue',
  },
  {
    icon: 'fa-solid fa-shield-heart',
    title: 'Bias-free coverage',
    copy: 'Transparent sourcing with automated sentiment scoring to cut through noise.',
    color: 'green',
  },
  {
    icon: 'fa-solid fa-bolt',
    title: 'Lightning-fast alerts',
    copy: 'Get notified within seconds when major market events occur across 3,200+ assets.',
    color: 'orange',
  },
  {
    icon: 'fa-solid fa-users',
    title: 'Community-driven',
    copy: 'Join thousands of analysts sharing insights and strategies in real-time.',
    color: 'pink',
  },
  {
    icon: 'fa-solid fa-mobile-screen',
    title: 'Cross-platform sync',
    copy: 'Seamlessly access your watchlists and alerts across all devices.',
    color: 'cyan',
  },
];

const stats = [
  { label: 'Assets tracked', value: '3,200+', icon: 'fa-solid fa-coins' },
  { label: 'News sources', value: '180+', icon: 'fa-solid fa-rss' },
  { label: 'Avg. alert time', value: '42s', icon: 'fa-solid fa-clock' },
  { label: 'Active users', value: '50K+', icon: 'fa-solid fa-users' },
];

const testimonials = [
  {
    quote: "WILS transformed how I analyze crypto markets. The real-time alerts are game-changing.",
    author: "Sarah Chen",
    role: "Crypto Trader",
    avatar: "SC",
  },
  {
    quote: "Best all-in-one platform for staying updated on DeFi protocols and market movements.",
    author: "Marcus Johnson",
    role: "DeFi Analyst",
    avatar: "MJ",
  },
  {
    quote: "The signal-first approach cuts through the noise. I save hours every day with WILS.",
    author: "Alex Rivera",
    role: "Portfolio Manager",
    avatar: "AR",
  },
];

function Home() {
  useDocumentTitle();
  const { watchlist } = useWatchlist();
  const [, setTick] = useState(0);
  const { data: markets, loading: liveLoading, error: liveError, lastUpdated, refresh } = usePolling(
    fetchMarkets,
    30000,
    true
  );
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Keep the relative "Updated Xs ago" label fresh.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const signals = useMemo(() => {
    if (!markets || !Array.isArray(markets)) return [];
    // Pick top movers by absolute 24h change percentage, then take top 4
    const ranked = [...markets]
      .filter((c) => typeof c.price_change_percentage_24h === 'number')
      .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
      .slice(0, 4);
    return ranked.map((c) => ({
      id: c.id,
      symbol: (c.symbol || '').toUpperCase(),
      name: c.name,
      image: c.image,
      price: formatPrice(c.current_price),
      change: `${(c.price_change_percentage_24h >= 0 ? '+' : '')}${(c.price_change_percentage_24h || 0).toFixed(2)}%`,
      direction: (c.price_change_percentage_24h || 0) >= 0 ? 'up' : 'down',
    }));
  }, [markets]);

  const watched = useMemo(
    () => (Array.isArray(markets) ? markets.filter((c) => watchlist.includes(c.id)).slice(0, 6) : []),
    [markets, watchlist]
  );

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
                  {liveLoading ? 'Updating…' : liveError ? 'Failed to update' : `Updated ${formatTimeAgo(lastUpdated)}`}
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
                  <li key={signal.id}>
                    <Link to={`/coin/${signal.id}`} className="widget-asset">
                      <div className="widget-identity">
                        {signal.image && <img src={signal.image} alt="" className="widget-icon" />}
                        <div className="widget-names">
                          <span className="widget-symbol">{signal.symbol}</span>
                          <span className="widget-name">{signal.name}</span>
                        </div>
                      </div>
                      <div className="widget-pricing">
                        <span className="widget-price">{signal.price}</span>
                        <span className={`widget-change ${signal.direction}`}>
                          {signal.change}
                        </span>
                      </div>
                    </Link>
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

      {watched.length > 0 && (
        <section className="home-section container">
          <div className="section-heading">
            <span className="eyebrow"><i className="fa-solid fa-star"></i> Your watchlist</span>
            <h2>Coins you&apos;re tracking</h2>
          </div>
          <div className="movers-grid">
            {watched.map((coin) => (
              <Link to={`/coin/${coin.id}`} key={coin.id} className="mover-card">
                <div className="mover-header">
                  {coin.image && <img src={coin.image} alt="" className="mover-icon" />}
                  <div className="mover-info">
                    <span className="mover-name">{coin.name}</span>
                    <span className="mover-symbol">{coin.symbol.toUpperCase()}</span>
                  </div>
                </div>
                <Sparkline data={coin.sparkline_in_7d?.price} width={220} height={40} />
                <div className="mover-data">
                  <span className="mover-price">{formatPrice(coin.current_price)}</span>
                  <span className={`mover-change ${coin.price_change_percentage_24h >= 0 ? 'up' : 'down'}`}>
                    {formatSignedPercent(coin.price_change_percentage_24h)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
            <article className={`feature-card feature-${item.color}`} key={item.title}>
              <div className="feature-icon">
                <i className={item.icon}></i>
              </div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section container stats-showcase">
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-showcase-card">
              <div className="stat-icon">
                <i className={stat.icon}></i>
              </div>
              <div className="stat-content">
                <span className="stat-value-large">{stat.value}</span>
                <span className="stat-label-large">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section container testimonials-section">
        <div className="section-heading center">
          <span className="eyebrow">Testimonials</span>
          <h2>Trusted by crypto professionals</h2>
        </div>
        <div className="testimonials-carousel">
          <div className="testimonial-track" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-quote">
                  <i className="fa-solid fa-quote-left"></i>
                  <p>{testimonial.quote}</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <span className="author-name">{testimonial.author}</span>
                    <span className="author-role">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="carousel-dots">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${currentTestimonial === idx ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section container top-movers">
        <div className="section-heading">
          <span className="eyebrow">Market activity</span>
          <h2>Top movers today</h2>
        </div>
        {markets && markets.length > 0 && (
          <div className="movers-grid">
            {markets
              .filter((c) => c.price_change_percentage_24h !== null)
              .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
              .slice(0, 6)
              .map((coin) => {
                const change = coin.price_change_percentage_24h || 0;
                return (
                  <Link to={`/coin/${coin.id}`} key={coin.id} className="mover-card">
                    <div className="mover-header">
                      {coin.image && <img src={coin.image} alt="" className="mover-icon" />}
                      <div className="mover-info">
                        <span className="mover-name">{coin.name}</span>
                        <span className="mover-symbol">{coin.symbol.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="mover-data">
                      <span className="mover-price">{formatPrice(coin.current_price)}</span>
                      <span className={`mover-change ${change >= 0 ? 'up' : 'down'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
        <div className="section-footer">
          <Link to="/markets" className="btn secondary">
            View all markets <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      <section className="home-section container home-briefing">
        <div className="section-heading">
          <span className="eyebrow">Latest updates</span>
          <h2>What&apos;s happening now</h2>
        </div>
        <Link to="/news" className="news-banner">
          <div className="news-banner-content">
            <div className="news-icon">
              <i className="fa-solid fa-newspaper"></i>
            </div>
            <div className="news-text">
              <h3>Breaking: Cryptocurrency markets show strong momentum</h3>
              <p>Get the latest insights on market trends, regulatory updates, and technology breakthroughs.</p>
            </div>
          </div>
          <div className="news-action">
            <span>Read more</span>
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </Link>
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
