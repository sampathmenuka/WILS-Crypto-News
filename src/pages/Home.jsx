import { Link } from 'react-router-dom';
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

const signals = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$67,820', change: '+1.45%' },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,120', change: '+0.82%' },
  { symbol: 'SOL', name: 'Solana', price: '$168.40', change: '-0.65%' },
  { symbol: 'OP', name: 'Optimism', price: '$3.14', change: '+3.20%' },
];

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
                <span className="widget-time">Updated 30s ago</span>
              </div>
              <ul className="widget-list">
                {signals.map((signal) => (
                  <li key={signal.symbol}>
                    <div className="widget-identity">
                      <span className="widget-symbol">{signal.symbol}</span>
                      <span className="widget-name">{signal.name}</span>
                    </div>
                    <div className="widget-pricing">
                      <span className="widget-price">{signal.price}</span>
                      <span className={`widget-change ${signal.change.startsWith('-') ? 'down' : 'up'}`}>
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
