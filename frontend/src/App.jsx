import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            📦 Inventory Management
          </Link>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link">Products</Link>
            </li>
            <li className="nav-item">
              <Link to="/customers" className="nav-link">Customers</Link>
            </li>
            <li className="nav-item">
              <Link to="/orders" className="nav-link">Orders</Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="main-content">
        <div className="page-content">
          {/* Routes will be rendered here */}
        </div>
      </main>
    </div>
  );
}

export default App;
