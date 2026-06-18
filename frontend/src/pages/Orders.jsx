import React, { useEffect, useState } from 'react';
import { ordersAPI, productsAPI, customersAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input, Label, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Plus, Trash2, ShoppingCart, X } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
    setFormData({ ...formData, customer_id: parseInt(e.target.value) || '' });
  };

  const handleItemChange = (index, field, value) => {
    const items = [...formData.items];
    items[index] = { ...items[index], [field]: value ? parseInt(value) : '' };
    setFormData({ ...formData, items });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', quantity: '' }],
    });
  };

  const removeItemRow = (index) => {
    if (formData.items.length === 1) return;
    const items = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ordersAPI.create({
        customer_id: parseInt(formData.customer_id),
        items: formData.items.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
        })),
      });
      resetForm();
      fetchData();
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg).join(', '));
      } else {
        setError(detail || 'Failed to create order');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order? Inventory will be restored.')) return;
    try {
      await ordersAPI.delete(id);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to cancel order');
    }
  };

  const resetForm = () => {
    setFormData({ customer_id: '', items: [{ product_id: '', quantity: '' }] });
    setDialogOpen(false);
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: 'warning',
      completed: 'success',
      cancelled: 'destructive',
    };
    return <Badge variant={map[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Create and manage customer orders.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Order Dialog */}
      <Dialog open={dialogOpen} onClose={resetForm}>
        <DialogContent onClose={resetForm} className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select
                id="customer"
                value={formData.customer_id}
                onChange={handleCustomerChange}
                required
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Order Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItemRow}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Item
                </Button>
              </div>
              
              {formData.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30">
                  <div className="flex-1">
                    <Select
                      value={item.product_id}
                      onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                      required
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} (${parseFloat(product.price).toFixed(2)}) — Stock: {product.quantity}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItemRow(index)}
                    disabled={formData.items.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">Place Order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-[hsl(var(--muted))] rounded animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No orders yet</p>
              <p className="text-sm">Create your first order to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const customer = customers.find(c => c.id === order.customer_id);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{customer?.name || `Customer #${order.customer_id}`}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{order.items?.length || 0} items</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-[hsl(var(--muted-foreground))]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(order.id)}>
                          <Trash2 className="h-4 w-4 text-[hsl(var(--destructive))]" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
