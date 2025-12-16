import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <section className="landing">
      <h2>Welcome to Suohou's Timber Mill</h2>
      <p>
        We provide high-quality timber for residential, commercial, and custom projects.
        Browse our stocks or get in touch for bulk orders.
      </p>

      <div className="landing-actions">
        <Link to="/stocks" className="btn">
          View Stocks
        </Link>
        <Link to="/contact" className="btn btn-secondary">
          Contact Store
        </Link>
      </div>
    </section>
  );
}

export default LandingPage;
