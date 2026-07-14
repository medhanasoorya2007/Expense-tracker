/**
 * pages/NotFound.jsx
 *
 * 404 page rendered for any unmatched route.
 */

import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <p className="not-found-code">404</p>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-subtitle">
          Oops! The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn btn-primary" id="not-found-home-btn">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
