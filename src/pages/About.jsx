import './About.css';

function About() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>About WILS</h1>
      </div>

      <section className="card">
        <div className="card-body">
          <p style={{ fontSize: '1.05rem', color: '#eaeaea' }}>
            Our mission: <strong>Delivering fast, accurate, and unbiased crypto updates.</strong>
          </p>
          <p className="muted">
            We track the top sources across the industry to bring you reliable news, real-time
            market data, and deep coin analytics — designed for both newcomers and professionals.
          </p>
        </div>
      </section>

      <section className="grid" style={{ marginTop: '1rem' }}>
        <div className="card">
          <div className="card-body">
            <h3>Editorial Standards</h3>
            <p className="muted">
              We prioritize accuracy and neutrality. Articles cite sources and avoid
              sensationalism.
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3>Data Transparency</h3>
            <p className="muted">
              Market data is fetched from reputable providers and visualized with open-source
              tools.
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3>Community First</h3>
            <p className="muted">
              We welcome feedback and contributions from our readers and the broader crypto
              community.
            </p>
          </div>
        </div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <div className="card-body">
          <h3>Team & Contributors</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#fff' }}>Alex</div>
              <div className="muted">Editor-in-Chief</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#fff' }}>Sam</div>
              <div className="muted">Market Analyst</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#fff' }}>Riley</div>
              <div className="muted">Developer</div>
            </div>
          </div>
        </div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <div className="card-body">
          <h3>Connect</h3>
          <p className="muted">Find us on social media or drop a message via the contact page.</p>
          <div className="footer-social" style={{ justifyContent: 'flex-start', marginTop: '0.5rem' }}>
            <a href="#" aria-label="Twitter">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="#" aria-label="GitHub">
              <i className="fa-brands fa-github"></i>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
