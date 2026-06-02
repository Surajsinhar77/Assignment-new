import React, { useEffect, useState } from 'react';
import { productsAPI } from '../services/api';
import '../styles/Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productsAPI.update(editingId, {
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        });
      } else {
        await productsAPI.create({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        });
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsAPI.delete(id);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', sku: '', price: '', quantity: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update' : 'Create'} Product
          </button>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>${parseFloat(product.price).toFixed(2)}</td>
              <td>{product.quantity}</td>
              <td>
                <button className="btn btn-sm btn-edit" onClick={() => handleEdit(product)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-delete" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
