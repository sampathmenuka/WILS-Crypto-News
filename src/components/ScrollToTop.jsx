import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets scroll position on route change (React Router keeps it by default).
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default ScrollToTop;
