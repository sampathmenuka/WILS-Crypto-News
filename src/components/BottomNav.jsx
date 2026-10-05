import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useWatchlist from '../hooks/useWatchlist';
import './BottomNav.css';

const socials = [
  { icon: 'fa-brands fa-x-twitter', label: 'Twitter', href: 'https://twitter.com' },
  { icon: 'fa-brands fa-linkedin', label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: 'fa-brands fa-github', label: 'GitHub', href: 'https://github.com' },
  { icon: 'fa-brands fa-discord', label: 'Discord', href: 'https://discord.com' },
];

const moreLinks = [
  { to: '/about', label: 'About WILS', icon: 'fa-solid fa-circle-info', copy: 'Our mission and team' },
  { to: '/contact', label: 'Contact', icon: 'fa-solid fa-envelope', copy: 'Questions, feedback, partnerships' },
];

// App-style tab bar shown on phones/small tablets (see BottomNav.css for the breakpoint).
function BottomNav() {
  const { pathname, search } = useLocation();
  const { watchlist } = useWatchlist();
  const [moreOpen, setMoreOpen] = useState(false);

  const isWatchlist = pathname === '/markets' && new URLSearchParams(search).get('filter') === 'watchlist';
  const tabs = [
    { to: '/', label: 'Home', icon: 'fa-solid fa-house', active: pathname === '/' },
    {
      to: '/markets',
      label: 'Markets',
      icon: 'fa-solid fa-chart-line',
      active: (pathname === '/markets' && !isWatchlist) || pathname.startsWith('/coin/'),
    },
    {
      to: '/markets?filter=watchlist',
      label: 'Watchlist',
      icon: 'fa-solid fa-star',
      active: isWatchlist,
      badge: watchlist.length || null,
    },
    { to: '/news', label: 'News', icon: 'fa-solid fa-newspaper', active: pathname === '/news' },
  ];
  const moreActive = moreLinks.some((l) => l.to === pathname);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname, search]);

  useEffect(() => {
    if (!moreOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMoreOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.classList.add('sheet-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('sheet-open');
    };
  }, [moreOpen]);

  return (
    <>
      <nav className="bottom-nav" aria-label="Primary">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            to={tab.to}
            className={`bottom-tab ${tab.active ? 'active' : ''}`}
            aria-current={tab.active ? 'page' : undefined}
          >
            <span className="bottom-tab-icon">
              <i className={tab.icon}></i>
              {tab.badge && <span className="bottom-tab-badge">{tab.badge > 99 ? '99+' : tab.badge}</span>}
            </span>
            <span className="bottom-tab-label">{tab.label}</span>
          </Link>
        ))}
        <button
          type="button"
          className={`bottom-tab ${moreActive || moreOpen ? 'active' : ''}`}
          onClick={() => setMoreOpen((v) => !v)}
          aria-expanded={moreOpen}
          aria-controls="more-sheet"
        >
          <span className="bottom-tab-icon"><i className="fa-solid fa-ellipsis"></i></span>
          <span className="bottom-tab-label">More</span>
        </button>
      </nav>

      <div
        className={`sheet-backdrop ${moreOpen ? 'open' : ''}`}
        onClick={() => setMoreOpen(false)}
        aria-hidden="true"
      ></div>
      <div
        id="more-sheet"
        className={`more-sheet ${moreOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="More"
        aria-hidden={!moreOpen}
        inert={moreOpen ? undefined : ''}
      >
        <span className="sheet-handle" aria-hidden="true"></span>
        <ul className="sheet-links">
          {moreLinks.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className={`sheet-link ${pathname === l.to ? 'active' : ''}`}>
                <span className="sheet-link-icon"><i className={l.icon}></i></span>
                <span>
                  <span className="sheet-link-title">{l.label}</span>
                  <span className="sheet-link-copy">{l.copy}</span>
                </span>
                <i className="fa-solid fa-chevron-right sheet-chevron"></i>
              </Link>
            </li>
          ))}
        </ul>
        <div className="sheet-socials">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
              <i className={s.icon}></i>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export default BottomNav;
