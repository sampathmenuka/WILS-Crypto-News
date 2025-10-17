import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Stay ahead with WILS</h1>
          <p>Delivering fast, accurate, and unbiased crypto updates.</p>
          <div className="hero-actions">
            <Link to="/news" className="btn">Browse News</Link>
            <Link to="/markets" className="btn secondary">Live Markets</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
