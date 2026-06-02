from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from decimal import Decimal
from database import get_db
from models import Order, OrderItem, Product, Customer
from schemas import OrderCreate, OrderResponse, OrderDetailResponse

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """Create a new order"""
    # Verify customer exists
    customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    # Validate all products and check inventory
    total_amount = Decimal("0")
    order_items_data = []
    
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {item.product_id} not found"
            )
        
        # Check if inventory is sufficient
        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient inventory for product '{product.name}'. Available: {product.quantity}, Requested: {item.quantity}"
            )
        
        subtotal = Decimal(str(product.price)) * Decimal(str(item.quantity))
        total_amount += subtotal
        
        order_items_data.append({
            "product": product,
            "quantity": item.quantity,
            "unit_price": product.price,
            "subtotal": subtotal
        })
    
    # Create the order
    db_order = Order(
        customer_id=order.customer_id,
        total_amount=total_amount,
        status="pending"
    )
    db.add(db_order)
    db.flush()  # Get the order ID without committing
    
    # Create order items and update inventory
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=db_order.id,
            product_id=item_data["product"].id,
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            subtotal=item_data["subtotal"]
        )
        db.add(order_item)
        
        # Reduce product inventory
        item_data["product"].quantity -= item_data["quantity"]
    
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("", response_model=list[OrderResponse])
def get_all_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve all orders with pagination"""
    orders = db.query(Order).offset(skip).limit(limit).all()
    return orders

@router.get("/{order_id}", response_model=OrderDetailResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Retrieve order details by ID"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """Cancel/Delete an order and restore inventory"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Restore inventory
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.quantity += item.quantity
    
    db.delete(order)
    db.commit()
    return None
