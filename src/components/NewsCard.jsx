function NewsCard({ article }) {
  const date = new Date(article.date).toLocaleDateString();
  const cat = (article.cat || '').toUpperCase();
  return (
    <article className="card">
      <img src={article.img} alt={article.title} />
      <div className="card-body">
        <div className="meta" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <span className="pill pill-soft">{cat}</span>
          <span>{date}</span>
        </div>
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
        <a className="read-more" href={`#article-${article.id}`}>
          Read More <i className="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </article>
  );
}

export default NewsCard;
