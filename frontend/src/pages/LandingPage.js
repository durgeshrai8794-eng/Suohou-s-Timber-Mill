import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <section className="landing-hero">
      <div className="overlay"></div>

      <div className="landing-content">
        <h1>
          Premium Timber <span>Crafted to Last</span>
        </h1>

        <p>
          At <strong>Suohou's Timber Mill</strong>, we supply premium-quality
          wood for homes, commercial projects, and custom craftsmanship.
          Trusted by builders. Loved by designers.
        </p>

        <div className="landing-actions">
          <Link to="/stocks" className="btn primary">
            Explore Stocks
          </Link>
          <Link to="/contact" className="btn secondary">
            Contact Store
          </Link>
        </div>

        <div className="features">
          <div className="feature-card">
            🌲
            <h3>Premium Wood</h3>
            <p>Carefully sourced and processed timber</p>
          </div>
          <div className="feature-card">
            🏗️
            <h3>Bulk Supply</h3>
            <p>Reliable supply for large-scale projects</p>
          </div>
          <div className="feature-card">
            🚚
            <h3>Fast Delivery</h3>
            <p>On-time delivery across regions</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
