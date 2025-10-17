import { useState, useEffect } from 'react';import { useState, useEffect } from 'react';import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import { fetchMarketData, fetchNews } from '../services/api';import { Link } from 'react-router-dom';import { Link } from 'react-router-dom';



const Home = () => {import { fetchMarketData, fetchNews } from '../services/api';import { fetchMarketData, fetchNews } from '../services/api';

  const [topCoins, setTopCoins] = useState([]);

  const [news, setNews] = useState([]);

  const [loading, setLoading] = useState(true);

const Home = () => {const Home = () => {

  useEffect(() => {

    const fetchData = async () => {  const [topCoins, setTopCoins] = useState([]);  const [topCoins, setTopCoins] = useState([]);

      try {

        const [coinsData, newsData] = await Promise.all([  const [news, setNews] = useState([]);  const [news, setNews] = useState([]);

          fetchMarketData(),

          fetchNews()  const [loading, setLoading] = useState(true);  const [loading, setLoading] = useState(true);

        ]);

        setTopCoins(coinsData.slice(0, 5));

        setNews(newsData.slice(0, 3));

      } catch (error) {  useEffect(() => {  useEffect(() => {

        console.error('Error fetching data:', error);

      } finally {    const fetchData = async () => {    const fetchData = async () => {

        setLoading(false);

      }      try {      try {

    };

    fetchData();        const [coinsData, newsData] = await Promise.all([        const [coinsData, newsData] = await Promise.all([

  }, []);

          fetchMarketData(),          fetchMarketData(),

  const highlights = [

    { label: 'NEWS', value: '24/7', icon: '📰' },          fetchNews()          fetchNews()

    { label: 'DATA', value: 'Real-time', icon: '📊' },

    { label: 'FAST', value: 'Instant', icon: '⚡' }        ]);        ]);

  ];

        setTopCoins(coinsData.slice(0, 5));        setTopCoins(coinsData.slice(0, 5));

  if (loading) return <div className="loading">Loading...</div>;

        setNews(newsData.slice(0, 3));        setNews(newsData.slice(0, 3));

  return (

    <div className="home-page">      } catch (error) {      } catch (error) {

      <section className="hero">

        <div className="hero-content">        console.error('Error fetching data:', error);        console.error('Error fetching data:', error);

          <h1>Your Gateway to Cryptocurrency News & Markets</h1>

          <p>Stay updated with real-time prices, charts, and the latest crypto news</p>      } finally {      } finally {

          <div className="cta-buttons">

            <Link to="/markets" className="btn btn-primary">Explore Markets</Link>        setLoading(false);        setLoading(false);

            <Link to="/news" className="btn btn-secondary">Latest News</Link>

          </div>      }      }

        </div>

        <div className="hero-stats">    };    };

          {highlights.map((item, idx) => (

            <div key={idx} className="stat-card">    fetchData();    fetchData();

              <span className="stat-icon">{item.icon}</span>

              <div className="stat-info">  }, []);  }, []);

                <div className="stat-label">{item.label}</div>

                <div className="stat-value">{item.value}</div>

              </div>

            </div>  const highlights = [  const highlights = [

          ))}

        </div>    { label: 'NEWS', value: '24/7', icon: '📰' },    { label: 'NEWS', value: '24/7', icon: '' },

      </section>

    { label: 'DATA', value: 'Real-time', icon: '📊' },    { label: 'DATA', value: 'Real-time', icon: '' },

      <section className="featured-news">

        <h2>Latest Crypto News</h2>    { label: 'FAST', value: 'Instant', icon: '⚡' }    { label: 'FAST', value: 'Instant', icon: '' }

        <div className="news-grid">

          {news.map((article) => (  ];  ];

            <div key={article.id} className="news-card">

              <img src={article.image} alt={article.title} />

              <div className="news-content">

                <span className="news-category">{article.category}</span>  if (loading) return <div className="loading">Loading...</div>;  if (loading) return <div className=\"loading\">Loading...</div>;

                <h3>{article.title}</h3>

                <p>{article.description}</p>

                <Link to="/news" className="read-more">Read More →</Link>

              </div>  return (  return (

            </div>

          ))}    <div className="home-page">    <div className=\"home-page\">

        </div>

        <Link to="/news" className="view-all">View All News →</Link>      <section className="hero">      <section className=\"hero\">

      </section>

        <div className="hero-content">        <div className=\"hero-content\">

      <section className="top-markets">

        <h2>Top Cryptocurrencies</h2>          <h1>Your Gateway to Cryptocurrency News & Markets</h1>          <h1>Your Gateway to Cryptocurrency News & Markets</h1>

        <div className="market-preview">

          <table>          <p>Stay updated with real-time prices, charts, and the latest crypto news</p>          <p>Stay updated with real-time prices, charts, and the latest crypto news</p>

            <thead>

              <tr>          <div className="cta-buttons">          <div className=\"cta-buttons\">

                <th>#</th>

                <th>Coin</th>            <Link to="/markets" className="btn btn-primary">Explore Markets</Link>            <Link to=\"/markets\" className=\"btn btn-primary\">Explore Markets</Link>

                <th>Price</th>

                <th>24h %</th>            <Link to="/news" className="btn btn-secondary">Latest News</Link>            <Link to=\"/news\" className=\"btn btn-secondary\">Latest News</Link>

                <th>Market Cap</th>

              </tr>          </div>          </div>

            </thead>

            <tbody>        </div>        </div>

              {topCoins.map((coin, idx) => (

                <tr key={coin.id}>        <div className="hero-stats">        <div className=\"hero-stats\">

                  <td>{idx + 1}</td>

                  <td>          {highlights.map((item, idx) => (          {highlights.map((item, idx) => (

                    <div className="coin-name">

                      <img src={coin.image} alt={coin.name} />            <div key={idx} className="stat-card">            <div key={idx} className=\"stat-card\">

                      <span>{coin.name}</span>

                      <span className="symbol">{coin.symbol.toUpperCase()}</span>              <span className="stat-icon">{item.icon}</span>              <span className=\"stat-icon\">{item.icon}</span>

                    </div>

                  </td>              <div className="stat-info">              <div className=\"stat-info\">

                  <td>${coin.current_price.toLocaleString()}</td>

                  <td className={coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>                <div className="stat-label">{item.label}</div>                <div className=\"stat-label\">{item.label}</div>

                    {coin.price_change_percentage_24h.toFixed(2)}%

                  </td>                <div className="stat-value">{item.value}</div>                <div className=\"stat-value\">{item.value}</div>

                  <td>${(coin.market_cap / 1e9).toFixed(2)}B</td>

                </tr>              </div>              </div>

              ))}

            </tbody>            </div>            </div>

          </table>

        </div>          ))}          ))}

        <Link to="/markets" className="view-all">View All Markets →</Link>

      </section>        </div>        </div>

    </div>

  );      </section>      </section>

};



export default Home;

      <section className="featured-news">      <section className=\"featured-news\">

        <h2>Latest Crypto News</h2>        <h2>Latest Crypto News</h2>

        <div className="news-grid">        <div className=\"news-grid\">

          {news.map((article) => (          {news.map((article) => (

            <div key={article.id} className="news-card">            <div key={article.id} className=\"news-card\">

              <img src={article.image} alt={article.title} />              <img src={article.image} alt={article.title} />

              <div className="news-content">              <div className=\"news-content\">

                <span className="news-category">{article.category}</span>                <span className=\"news-category\">{article.category}</span>

                <h3>{article.title}</h3>                <h3>{article.title}</h3>

                <p>{article.description}</p>                <p>{article.description}</p>

                <Link to="/news" className="read-more">Read More →</Link>                <Link to=\"/news\" className=\"read-more\">Read More </Link>

              </div>              </div>

            </div>            </div>

          ))}          ))}

        </div>        </div>

        <Link to="/news" className="view-all">View All News →</Link>        <Link to=\"/news\" className=\"view-all\">View All News </Link>

      </section>      </section>



      <section className="top-markets">      <section className=\"top-markets\">

        <h2>Top Cryptocurrencies</h2>        <h2>Top Cryptocurrencies</h2>

        <div className="market-preview">        <div className=\"market-preview\">

          <table>          <table>

            <thead>            <thead>

              <tr>              <tr>

                <th>#</th>                <th>#</th>

                <th>Coin</th>                <th>Coin</th>

                <th>Price</th>                <th>Price</th>

                <th>24h %</th>                <th>24h %</th>

                <th>Market Cap</th>                <th>Market Cap</th>

              </tr>              </tr>

            </thead>            </thead>

            <tbody>            <tbody>

              {topCoins.map((coin, idx) => (              {topCoins.map((coin, idx) => (

                <tr key={coin.id}>                <tr key={coin.id}>

                  <td>{idx + 1}</td>                  <td>{idx + 1}</td>

                  <td>                  <td>

                    <div className="coin-name">                    <div className=\"coin-name\">

                      <img src={coin.image} alt={coin.name} />                      <img src={coin.image} alt={coin.name} />

                      <span>{coin.name}</span>                      <span>{coin.name}</span>

                      <span className="symbol">{coin.symbol.toUpperCase()}</span>                      <span className=\"symbol\">{coin.symbol.toUpperCase()}</span>

                    </div>                    </div>

                  </td>                  </td>

                  <td>${coin.current_price.toLocaleString()}</td>                  <td>\</td>

                  <td className={coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>                  <td className={coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>

                    {coin.price_change_percentage_24h.toFixed(2)}%                    {coin.price_change_percentage_24h.toFixed(2)}%

                  </td>                  </td>

                  <td>${(coin.market_cap / 1e9).toFixed(2)}B</td>                  <td>\B</td>

                </tr>                </tr>

              ))}              ))}

            </tbody>            </tbody>

          </table>          </table>

        </div>        </div>

        <Link to="/markets" className="view-all">View All Markets →</Link>        <Link to=\"/markets\" className=\"view-all\">View All Markets </Link>

      </section>      </section>

    </div>    </div>

  );  );

};};



export default Home;export default Home;

