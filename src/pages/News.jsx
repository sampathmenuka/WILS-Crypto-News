import { useState } from 'react';
import NewsCard from '../components/NewsCard';

const MOCK_NEWS = [
  {
    id: 1,
    title: 'Bitcoin hits new monthly high',
    date: '2025-10-15',
    cat: 'bitcoin',
    img: '/Pictures/art1.jpg',
    summary: 'BTC breaks resistance amid renewed institutional interest and ETF inflows.',
  },
  {
    id: 2,
    title: 'Ethereum upgrades advance scalability',
    date: '2025-10-14',
    cat: 'ethereum',
    img: '/Pictures/art1.jpg',
    summary: 'Roadmap update highlights improvements to rollups and data availability.',
  },
  {
    id: 3,
    title: 'DeFi TVL climbs 12%',
    date: '2025-10-13',
    cat: 'defi',
    img: '/Pictures/art1.jpg',
    summary: 'New protocols launch and yield strategies boost on-chain activity.',
  },
  {
    id: 4,
    title: 'Altcoin season indicators flash',
    date: '2025-10-12',
    cat: 'altcoins',
    img: '/Pictures/art1.jpg',
    summary: 'Market breadth expands as mid-caps and gaming tokens rally.',
  },
  {
    id: 5,
    title: 'NFT volumes rebound',
    date: '2025-10-11',
    cat: 'nfts',
    img: '/Pictures/art1.jpg',
    summary: 'Blue-chip collections see renewed demand; creators explore new formats.',
  },
];

function News() {
  const [category, setCategory] = useState('all');

  const filteredNews = MOCK_NEWS.filter(
    (article) => category === 'all' || article.cat === category
  );

  return (
    <div className="container">
      <div className="page-header">
        <h1>Latest Crypto News</h1>
        <div className="form-group" style={{ minWidth: '200px' }}>
          <label htmlFor="category" className="muted">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="altcoins">Altcoins</option>
            <option value="defi">DeFi</option>
            <option value="nfts">NFTs</option>
          </select>
        </div>
      </div>

      <section className="grid">
        {filteredNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </section>
    </div>
  );
}

export default News;
