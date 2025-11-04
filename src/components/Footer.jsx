import { Link } from 'react-router-dom';
import './Footer.css';

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Live Markets', to: '/markets' },
      { label: 'News Feed', to: '/news' },
      { label: 'Coin Analytics', to: '/markets' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Careers', to: '/about' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', to: '/about' },
      { label: 'API Access', to: '/about' },
      { label: 'Community', to: '/contact' },
    ],
  },
];

const socialLinks = [
  { icon: 'fa-brands fa-x-twitter', label: 'Twitter', href: 'https://twitter.com' },
  { icon: 'fa-brands fa-linkedin', label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: 'fa-brands fa-github', label: 'GitHub', href: 'https://github.com' },
  { icon: 'fa-brands fa-discord', label: 'Discord', href: 'https://discord.com' },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-main container">
        <div className="footer-grid">
          <div className="footer-brand-section">
            <div className="footer-logo">
              <Link to="/" aria-label="Go to home">
                <span className="logo-mark">W</span>
                <span className="logo-type">ILS</span>
              </Link>
            </div>
            <p className="footer-tagline">
              Real-time crypto intelligence for analysts, builders, and explorers.
            </p>
            <div className="footer-social">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="footer-section">
              <h3 className="footer-section-title">{section.title}</h3>
              <ul className="footer-section-links">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © {currentYear} WILS. All rights reserved.
          </div>
          <div className="footer-legal">
            <Link to="/about">Privacy Policy</Link>
            <span className="footer-divider">·</span>
            <Link to="/about">Terms of Service</Link>
            <span className="footer-divider">·</span>
            <Link to="/contact">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
