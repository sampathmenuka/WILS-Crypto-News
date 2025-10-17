import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        <div className="footer-brand">WILS</div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/news">News</Link>
          <Link to="/markets">Markets</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-social">
          <a href="#" aria-label="Twitter"><i className="fa-brands fa-x-twitter"></i></a>
          <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin"></i></a>
          <a href="#" aria-label="GitHub"><i className="fa-brands fa-github"></i></a>
        </div>
        <div className="footer-copy">© {currentYear} WILS. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;
