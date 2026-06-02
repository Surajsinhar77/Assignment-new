# API Examples

## Base URL
```
http://localhost:8000
```

## Health Check

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy"
}
```

## Products API

### Create Product

```bash
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "SKU-001",
    "price": 999.99,
    "quantity": 50
  }'
```

Response:
```json
{
  "id": 1,
  "name": "Laptop",
  "sku": "SKU-001",
  "price": "999.99",
  "quantity": 50,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### Get All Products

```bash
curl http://localhost:8000/products
```

With pagination:
```bash
curl "http://localhost:8000/products?skip=0&limit=10"
```

Response:
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "sku": "SKU-001",
    "price": "999.99",
    "quantity": 50,
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  },
  {
    "id": 2,
    "name": "Mouse",
    "sku": "SKU-002",
    "price": "29.99",
    "quantity": 100,
    "created_at": "2024-01-15T10:35:00",
    "updated_at": "2024-01-15T10:35:00"
  }
]
```

### Get Product by ID

```bash
curl http://localhost:8000/products/1
```

Response:
```json
{
  "id": 1,
  "name": "Laptop",
  "sku": "SKU-001",
  "price": "999.99",
  "quantity": 50,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### Update Product

```bash
curl -X PUT http://localhost:8000/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Pro",
    "price": 1299.99,
    "quantity": 45
  }'
```

Response:
```json
{
  "id": 1,
  "name": "Laptop Pro",
  "sku": "SKU-001",
  "price": "1299.99",
  "quantity": 45,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:35:00"
}
```

### Delete Product

```bash
curl -X DELETE http://localhost:8000/products/1
```

Response: 204 No Content

---

## Customers API

### Create Customer

```bash
curl -X POST http://localhost:8000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }'
```

Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "created_at": "2024-01-15T10:40:00",
  "updated_at": "2024-01-15T10:40:00"
}
```

### Get All Customers

```bash
curl http://localhost:8000/customers
```

With pagination:
```bash
curl "http://localhost:8000/customers?skip=0&limit=10"
```

Response:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "created_at": "2024-01-15T10:40:00",
    "updated_at": "2024-01-15T10:40:00"
  }
]
```

### Get Customer by ID

```bash
curl http://localhost:8000/customers/1
```

Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "created_at": "2024-01-15T10:40:00",
  "updated_at": "2024-01-15T10:40:00"
}
```

### Delete Customer

```bash
curl -X DELETE http://localhost:8000/customers/1
```

Response: 204 No Content

---

## Orders API

### Create Order

```bash
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {
        "product_id": 1,
        "quantity": 2
      },
      {
        "product_id": 2,
        "quantity": 5
      }
    ]
  }'
```

Response:
```json
{
  "id": 1,
  "customer_id": 1,
  "total_amount": "2149.95",
  "status": "pending",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 2,
      "unit_price": "1299.99",
      "subtotal": "2599.98"
    },
    {
      "id": 2,
      "product_id": 2,
      "quantity": 5,
      "unit_price": "29.99",
      "subtotal": "149.95"
    }
  ],
  "created_at": "2024-01-15T10:45:00",
  "updated_at": "2024-01-15T10:45:00"
}
```

### Get All Orders

```bash
curl http://localhost:8000/orders
```

With pagination:
```bash
curl "http://localhost:8000/orders?skip=0&limit=10"
```

### Get Order by ID

```bash
curl http://localhost:8000/orders/1
```

Response:
```json
{
  "id": 1,
  "customer_id": 1,
  "total_amount": "2149.95",
  "status": "pending",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 2,
      "unit_price": "1299.99",
      "subtotal": "2599.98"
    },
    {
      "id": 2,
      "product_id": 2,
      "quantity": 5,
      "unit_price": "29.99",
      "subtotal": "149.95"
    }
  ],
  "customer": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "created_at": "2024-01-15T10:40:00",
    "updated_at": "2024-01-15T10:40:00"
  },
  "created_at": "2024-01-15T10:45:00",
  "updated_at": "2024-01-15T10:45:00"
}
```

### Cancel/Delete Order

```bash
curl -X DELETE http://localhost:8000/orders/1
```

Response: 204 No Content
(Inventory is automatically restored)

---

## Statistics API

### Get Dashboard Statistics

```bash
curl http://localhost:8000/stats/dashboard
```

Response:
```json
{
  "total_products": 5,
  "total_customers": 3,
  "total_orders": 2,
  "low_stock_count": 1,
  "low_stock_products": [
    {
      "id": 3,
      "name": "Monitor",
      "sku": "SKU-003",
      "quantity": 5
    }
  ],
  "total_inventory_value": 15000.50
}
```

---

## Error Examples

### 400 Bad Request - Duplicate SKU

```bash
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another Laptop",
    "sku": "SKU-001",
    "price": 899.99,
    "quantity": 30
  }'
```

Response:
```json
{
  "detail": "Product with SKU 'SKU-001' already exists"
}
```

### 400 Bad Request - Duplicate Email

```bash
curl -X POST http://localhost:8000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "john@example.com",
    "phone": "+0987654321"
  }'
```

Response:
```json
{
  "detail": "Customer with email 'john@example.com' already exists"
}
```

### 400 Bad Request - Insufficient Inventory

```bash
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {
        "product_id": 1,
        "quantity": 1000
      }
    ]
  }'
```

Response:
```json
{
  "detail": "Insufficient inventory for product 'Laptop'. Available: 50, Requested: 1000"
}
```

### 404 Not Found

```bash
curl http://localhost:8000/products/999
```

Response:
```json
{
  "detail": "Product not found"
}
```

---

## Testing Workflow

### 1. Create Products

```bash
# Product 1
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "sku": "SKU-001", "price": 999.99, "quantity": 50}'

# Product 2
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Mouse", "sku": "SKU-002", "price": 29.99, "quantity": 100}'

# Product 3
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Keyboard", "sku": "SKU-003", "price": 79.99, "quantity": 75}'
```

### 2. Create Customers

```bash
# Customer 1
curl -X POST http://localhost:8000/customers \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "phone": "+1234567890"}'

# Customer 2
curl -X POST http://localhost:8000/customers \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Smith", "email": "jane@example.com", "phone": "+0987654321"}'
```

### 3. Create Orders

```bash
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {"product_id": 1, "quantity": 2},
      {"product_id": 2, "quantity": 5}
    ]
  }'
```

### 4. View Dashboard

```bash
curl http://localhost:8000/stats/dashboard
```

### 5. Verify Inventory Reduction

```bash
curl http://localhost:8000/products/1
```

The quantity should be 48 (50 - 2).

---

## Using with Postman

1. Import these requests into Postman
2. Set base URL: `{{baseUrl}}` = `http://localhost:8000`
3. Create collection with these endpoints
4. Test each endpoint
5. Export for team sharing

## Tips for Testing

- Always create products before customers
- Always create customers before orders
- Use meaningful SKUs and emails for easy tracking
- Test error cases (duplicate SKU, insufficient inventory)
- Monitor inventory changes after orders
- Check dashboard for updated statistics
- Use pagination for large datasets
