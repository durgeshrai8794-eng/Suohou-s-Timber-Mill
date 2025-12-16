import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';

import LandingPage from './pages/LandingPage';
import StocksPage from './pages/StocksPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <div className="App">
      <header className="main-header">
        <h1>Suohou's Timber Mill</h1>
        <p>Premium Timber for Construction & Carpentry</p>
        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/stocks" className="nav-link">
            Stocks
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact Store
          </NavLink>
          <NavLink to="/admin" className="nav-link">
            Admin
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/stocks" element={<StocksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Suohou's Timber Mill
      </footer>
    </div>
  );
}

export default App;
