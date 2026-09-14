import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './About.css';

const values = [
  {
    icon: 'fa-solid fa-scale-balanced',
    title: 'Editorial Standards',
    copy: 'We prioritize accuracy and neutrality. Articles cite sources and avoid sensationalism.',
  },
  {
    icon: 'fa-solid fa-database',
    title: 'Data Transparency',
    copy: 'Market data is fetched from reputable providers and visualized with open-source tools.',
  },
  {
    icon: 'fa-solid fa-people-group',
    title: 'Community First',
    copy: 'We welcome feedback and contributions from our readers and the broader crypto community.',
  },
];

const team = [
  { name: 'Alex', role: 'Editor-in-Chief', initials: 'A' },
  { name: 'Sam', role: 'Market Analyst', initials: 'S' },
  { name: 'Riley', role: 'Developer', initials: 'R' },
];

const socials = [
  { icon: 'fa-brands fa-x-twitter', label: 'Twitter', href: 'https://twitter.com' },
  { icon: 'fa-brands fa-linkedin', label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: 'fa-brands fa-github', label: 'GitHub', href: 'https://github.com' },
  { icon: 'fa-brands fa-discord', label: 'Discord', href: 'https://discord.com' },
];

function About() {
  useDocumentTitle('About');

  return (
    <div className="container about-page">
      <section className="about-hero">
        <span className="eyebrow">About WILS</span>
        <h1>
          Fast, accurate and <span>unbiased</span> crypto updates.
        </h1>
        <p>
          We track the top sources across the industry to bring you reliable news, real-time market
          data, and deep coin analytics — designed for both newcomers and professionals.
        </p>
      </section>

      <section className="about-values">
        {values.map((v) => (
          <article key={v.title} className="card value-card">
            <div className="card-body">
              <span className="value-icon"><i className={v.icon}></i></span>
              <h3>{v.title}</h3>
              <p className="muted">{v.copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="card about-team">
        <div className="card-body">
          <h2>Team &amp; Contributors</h2>
          <ul className="team-grid">
            {team.map((m) => (
              <li key={m.name} className="team-member">
                <span className="team-avatar" aria-hidden="true">{m.initials}</span>
                <span>
                  <span className="team-name">{m.name}</span>
                  <span className="team-role">{m.role}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card about-connect">
        <div className="card-body">
          <div>
            <h2>Connect with us</h2>
            <p className="muted">Find us on social media or drop us a message.</p>
          </div>
          <div className="about-connect-actions">
            <div className="footer-social">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <i className={s.icon}></i>
                </a>
              ))}
            </div>
            <Link to="/contact" className="btn">Contact us</Link>
          </div>
        </div>
      </section>

      <p className="about-disclaimer muted">
        <i className="fa-solid fa-circle-info"></i> Content on WILS is for informational purposes only
        and does not constitute financial advice.
      </p>
    </div>
  );
}

export default About;
