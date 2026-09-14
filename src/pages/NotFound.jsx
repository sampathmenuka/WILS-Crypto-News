import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

function NotFound() {
  useDocumentTitle('Page not found');

  return (
    <div className="container">
      <div className="not-found">
        <span className="not-found-code">404</span>
        <h1>This page went to the moon</h1>
        <p className="muted">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn">Back to home</Link>
          <Link to="/markets" className="btn secondary">Browse markets</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
