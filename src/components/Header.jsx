import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="nav-bar">
        <div className="logo">
          <Link to="/" onClick={closeMenu} aria-label="Go to home">
            <span className="logo-mark">W</span>
            <span className="logo-type">ILS</span>
          </Link>
        </div>
        <ul className={`links ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" end onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/news" onClick={closeMenu}>News</NavLink></li>
          <li><NavLink to="/markets" onClick={closeMenu}>Markets</NavLink></li>
          <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>
          <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
        </ul>
        <Link to="/markets" className="action_btn" onClick={closeMenu}>
          Launch App
        </Link>
        <div
          className="menu-toggle"
          onClick={toggleMenu}
          role="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </div>
      </div>
    </header>
  );
}

export default Header;
