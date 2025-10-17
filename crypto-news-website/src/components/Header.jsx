import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { to: '/', label: 'Home', end: true },
        { to: '/news', label: 'News' },
        { to: '/markets', label: 'Markets' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
    ];

    const handleToggle = () => setIsMenuOpen((prev) => !prev);
    const handleClose = () => setIsMenuOpen(false);

    return (
        <header className="site-header">
            <div className="nav-bar">
                <Link to="/" className="logo">CryptoNews</Link>
                <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    {navItems.map(({ to, label, end }) => (
                        <NavLink
                            key={label}
                            to={to}
                            end={end}
                            className={({ isActive }) => (isActive ? 'active' : undefined)}
                            onClick={handleClose}
                        >
                            {label}
                        </NavLink>
                    ))}
                    <button type="button" className="cta" onClick={handleClose}>
                        Get Started
                    </button>
                </nav>
                <button type="button" className="menu-toggle" onClick={handleToggle} aria-label="Toggle navigation">
                    <span />
                    <span />
                    <span />
                </button>
            </div>
        </header>
    );
};

export default Header;