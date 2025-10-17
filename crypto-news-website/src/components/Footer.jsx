import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div>
                    <h3 className="footer-logo">CryptoNews</h3>
                    <p className="footer-copy">Delivering fast, accurate, and unbiased crypto updates.</p>
                </div>
                <nav className="footer-links">
                    <Link to="/news">News</Link>
                    <Link to="/markets">Markets</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                </nav>
                <div className="footer-socials">
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">TW</a>
                    <a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram">TG</a>
                    <a href="mailto:hello@cryptonews.com" aria-label="Email">EM</a>
                </div>
            </div>
            <p className="footer-bottom">© {year} CryptoNews. All rights reserved.</p>
        </footer>
    );
};

export default Footer;