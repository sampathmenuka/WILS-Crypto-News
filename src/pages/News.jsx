import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import { fetchNews } from '../utils/api';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './News.css';

const categories = [
  { value: 'all', label: 'All News', icon: 'fa-solid fa-newspaper' },
  { value: 'bitcoin', label: 'Bitcoin', icon: 'fa-brands fa-bitcoin' },
  { value: 'ethereum', label: 'Ethereum', icon: 'fa-brands fa-ethereum' },
  { value: 'defi', label: 'DeFi', icon: 'fa-solid fa-coins' },
  { value: 'altcoins', label: 'Altcoins', icon: 'fa-solid fa-chart-line' },
  { value: 'nfts', label: 'NFTs', icon: 'fa-solid fa-image' },
];

function News() {
  useDocumentTitle('News');
  const [category, setCategory] = useState('all');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchNews(category)
      .then((data) => !cancelled && setNews(data))
      .catch((err) => !cancelled && setError(err.message || 'Failed to load news'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [category, reloadKey]);

  const filteredNews = news.filter((article) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="news-page">
      <div className="container">
        <div className="news-hero">
          <div className="news-hero-content">
            <span className="eyebrow">Breaking news</span>
            <h1>Crypto Market Intelligence</h1>
            <p>
              Real-time updates on market trends, regulatory changes, and breakthrough innovations
              shaping the digital asset landscape.
            </p>
          </div>
        </div>

        <div className="news-controls">
          <div className="category-filter" role="group" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`category-btn ${category === cat.value ? 'active' : ''}`}
                aria-pressed={category === cat.value}
                onClick={() => setCategory(cat.value)}
              >
                <i className={cat.icon}></i>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="search-bar">
            <i className="fa-solid fa-search" aria-hidden="true"></i>
            <input
              type="search"
              aria-label="Search news"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')} aria-label="Clear search">
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="news-loading" role="status">
            <div className="loading-spinner"></div>
            <p>Loading latest news...</p>
          </div>
        )}

        {error && (
          <div className="news-error" role="alert">
            <i className="fa-solid fa-circle-exclamation"></i>
            <p>{error}</p>
            <button className="btn secondary" onClick={() => setReloadKey((k) => k + 1)}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredNews.length === 0 && (
          <div className="news-empty">
            <i className="fa-regular fa-newspaper"></i>
            <p>No news articles found matching your criteria.</p>
            <button className="btn secondary" onClick={() => { setCategory('all'); setSearchQuery(''); }}>
              View All News
            </button>
          </div>
        )}

        {!loading && !error && filteredNews.length > 0 && (
          <>
            <div className="news-stats">
              <span className="news-count">
                {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'}
              </span>
              {searchQuery && (
                <span className="search-info">
                  matching &quot;{searchQuery}&quot;
                </span>
              )}
            </div>

            <section className="news-grid">
              {filteredNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </section>

            <div className="news-footer-cta">
              <div className="cta-content">
                <h3>Stay ahead of the curve</h3>
                <p>Get personalized news alerts and market insights delivered to your inbox.</p>
                <Link to="/contact" className="btn">
                  Subscribe to Newsletter
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default News;
