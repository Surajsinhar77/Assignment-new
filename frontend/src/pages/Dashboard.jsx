import React, { useEffect, useState } from 'react';
import { statsAPI } from '../services/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await statsAPI.getDashboard();
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container error-message">{error}</div>;

  return (
    <div className="container">
      <h1>Dashboard</h1>
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.total_products}</p>
          </div>
          <div className="stat-card">
            <h3>Total Customers</h3>
            <p className="stat-value">{stats.total_customers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.total_orders}</p>
          </div>
          <div className="stat-card warning">
            <h3>Low Stock Items</h3>
            <p className="stat-value">{stats.low_stock_count}</p>
          </div>
          <div className="stat-card">
            <h3>Inventory Value</h3>
            <p className="stat-value">${stats.total_inventory_value.toFixed(2)}</p>
          </div>
        </div>
      )}

      {stats?.low_stock_products && stats.low_stock_products.length > 0 && (
        <div className="low-stock-section">
          <h2>Low Stock Products</h2>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {stats.low_stock_products.map((product) => (
                <tr key={product.id} className="warning-row">
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
