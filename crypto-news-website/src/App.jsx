import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import News from './pages/News';
import Markets from './pages/Markets';
import CoinDetails from './pages/CoinDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import './styles/styles.css';

const App = () => {
    return (
        <div className="app-shell">
            <Header />
            <main className="page-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/markets" element={<Markets />} />
                    <Route path="/coin/:id" element={<CoinDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default App;