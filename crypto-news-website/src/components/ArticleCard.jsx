import React from 'react';

const ArticleCard = ({ article }) => {
    const { title, date, summary, image, link, category } = article;
    const formattedDate = date ? new Date(date).toLocaleString() : '';

    return (
        <article className="article-card">
            <div className="article-media">
                <img src={image} alt={title} loading="lazy" />
                {category && <span className="article-badge">{category}</span>}
            </div>
            <div className="article-content">
                <h3 className="article-title">{title}</h3>
                {formattedDate && <p className="article-date">{formattedDate}</p>}
                {summary && <p className="article-summary">{summary}</p>}
                {link && (
                    <a href={link} className="read-more" target="_blank" rel="noreferrer">
                        Read More →
                    </a>
                )}
            </div>
        </article>
    );
};

export default ArticleCard;