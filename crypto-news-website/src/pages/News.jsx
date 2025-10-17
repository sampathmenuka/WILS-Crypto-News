import { useState, useEffect } from 'react';
import { fetchNews } from '../services/api';
import ArticleCard from '../components/ArticleCard';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Bitcoin', 'Ethereum', 'DeFi', 'NFTs', 'Regulation'];

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchNews();
        setArticles(data);
        setFilteredArticles(data);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.category === selectedCategory));
    }
  }, [selectedCategory, articles]);

  if (loading) return <div className="loading">Loading news...</div>;

  return (
    <div className="news-page">
      <div className="news-header">
        <h1>Latest Cryptocurrency News</h1>
        <p>Stay informed with the latest updates from the crypto world</p>
      </div>

      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="articles-grid">
        {filteredArticles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="no-articles">No articles found in this category</div>
      )}
    </div>
  );
};

export default News;
