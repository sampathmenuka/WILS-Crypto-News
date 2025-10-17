function NewsCard({ article }) {
  return (
    <article className="card">
      <img src={article.img} alt={article.title} />
      <div className="card-body">
        <div className="meta">{new Date(article.date).toLocaleDateString()}</div>
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
        <a className="read-more" href={`#article-${article.id}`}>
          Read More →
        </a>
      </div>
    </article>
  );
}

export default NewsCard;
