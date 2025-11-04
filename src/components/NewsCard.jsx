import { Link } from 'react-router-dom';

function NewsCard({ article }) {
  const date = new Date(article.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const cat = (article.category || article.cat || '').toUpperCase();
  
  return (
    <article className="card news-card">
      <img src={article.img} alt={article.title} loading="lazy" />
      <div className="card-body">
        <div className="meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.5rem', marginBottom: '0.6rem' }}>
          <span className="pill pill-soft">{cat}</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{date}</span>
        </div>
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
        {article.coin_id ? (
          <Link className="read-more" to={`/coin/${article.coin_id}`}>
            View Details <i className="fa-solid fa-arrow-right"></i>
          </Link>
        ) : (
          <a className="read-more" href={`#article-${article.id}`}>
            Read More <i className="fa-solid fa-arrow-right"></i>
          </a>
        )}
      </div>
    </article>
  );
}

export default NewsCard;
