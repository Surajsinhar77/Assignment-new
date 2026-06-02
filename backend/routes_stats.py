from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from database import get_db
from models import Product, Customer, Order

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_customers = db.query(func.count(Customer.id)).scalar() or 0
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    
    # Get low stock products (quantity < 10)
    low_stock_products = db.query(Product).filter(Product.quantity < 10).all()
    
    # Calculate total inventory value
    total_inventory_value = db.query(func.sum(Product.price * Product.quantity)).scalar() or 0
    
    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_count": len(low_stock_products),
        "low_stock_products": [
            {
                "id": p.id,
                "name": p.name,
                "sku": p.sku,
                "quantity": p.quantity
            }
            for p in low_stock_products
        ],
        "total_inventory_value": float(total_inventory_value)
    }
