import React, { useEffect, useState } from 'react';
import { ordersAPI, productsAPI, customersAPI } from '../services/api';
import '../styles/Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    items: [{ product_id: '', quantity: '' }],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        ordersAPI.getAll(),
        productsAPI.getAll(),
        customersAPI.getAll(),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerChange = (e) => {
    setFormData({ ...formData, customer_id: parseInt(e.target.value) });
  };

  const handleItemChange = (index, field, value) => {
    const items = [...formData.items];
    items[index] = { ...items[index], [field]: field === 'product_id' ? parseInt(value) : parseInt(value) };
    setFormData({ ...formData, items });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', quantity: '' }],
    });
  };

  const removeItemRow = (index) => {
    const items = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ordersAPI.create(formData);
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create order');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await ordersAPI.delete(id);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete order');
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      items: [{ product_id: '', quantity: '' }],
    });
    setShowForm(false);
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Orders</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Order'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Customer:</label>
            <select value={formData.customer_id} onChange={handleCustomerChange} required>
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Items:</label>
            {formData.items.map((item, index) => (
              <div key={index} className="item-row">
                <select
                  value={item.product_id}
                  onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (${parseFloat(product.price).toFixed(2)}) - Stock: {product.quantity}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  min="1"
                  required
                />
                <button type="button" className="btn btn-danger" onClick={() => removeItemRow(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addItemRow}>
              Add Item
            </button>
          </div>

          <button type="submit" className="btn btn-primary">Create Order</button>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.customer?.name || 'N/A'}</td>
              <td>${parseFloat(order.total_amount).toFixed(2)}</td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-sm btn-delete" onClick={() => handleDelete(order.id)}>
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
