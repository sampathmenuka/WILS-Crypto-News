import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="nav-bar">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>WILS</Link>
        </div>
        <ul className={`links ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/news" onClick={closeMenu}>News</NavLink></li>
          <li><NavLink to="/markets" onClick={closeMenu}>Markets</NavLink></li>
          <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>
          <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
        </ul>
        <Link to="/markets" className="action_btn" onClick={closeMenu}>Get Started</Link>
        <div className="toggele_btn" onClick={toggleMenu} role="button" aria-label="Toggle navigation">
          <i className="fa-solid fa-bars"></i>
        </div>
      </div>
    </header>
  );
}

export default Header;
