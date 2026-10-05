import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import './App.css';

// Secondary pages are code-split so the first load stays small (Chart.js only loads on coin pages).
const News = lazy(() => import('./pages/News'));
const Markets = lazy(() => import('./pages/Markets'));
const CoinDetail = lazy(() => import('./pages/CoinDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="container">
      <div className="page-loader" role="status">
        <div className="loading-spinner"></div>
        <span className="sr-only">Loading page…</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main" className="main-content" tabIndex={-1}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<News />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/coin/:id" element={<CoinDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
