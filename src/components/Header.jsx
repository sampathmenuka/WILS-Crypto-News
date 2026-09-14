import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const { pathname } = useLocation();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close on Escape or click outside.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [menuOpen]);

  // Darken the header once the page is scrolled. Checked at most once per frame, with separate
  // on/off thresholds so it can't flicker when the scroll position hovers around one value.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > 4 : y > 24));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="nav-bar" ref={navRef} aria-label="Main">
        <div className="logo">
          <Link to="/" onClick={closeMenu} aria-label="WILS home">
            <span className="logo-mark">W</span>
            <span className="logo-type">ILS</span>
          </Link>
        </div>
        <ul id="primary-nav" className={`links ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" end onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/news" onClick={closeMenu}>News</NavLink></li>
          <li><NavLink to="/markets" onClick={closeMenu}>Markets</NavLink></li>
          <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>
          <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
        </ul>
        <Link to="/markets" className="action_btn" onClick={closeMenu}>
          Launch App
        </Link>
        <Link to="/markets?search=1" className="header-cta" aria-label="Search coins">
          <i className="fa-solid fa-magnifying-glass"></i>
        </Link>
        <button
          type="button"
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
        >
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </nav>
    </header>
  );
}

export default Header;
