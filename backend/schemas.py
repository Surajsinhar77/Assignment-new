from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

# Product Schemas
class ProductBase(BaseModel):
    name: str
    sku: str
    price: Decimal
    quantity: int = Field(ge=0)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[Decimal] = None
    quantity: Optional[int] = Field(default=None, ge=0)

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Customer Schemas
class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    phone: str

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# OrderItem Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: Decimal
    subtotal: Decimal
    
    class Config:
        from_attributes = True

# Order Schemas
class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: Decimal
    status: str
    items: List[OrderItemResponse]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class OrderDetailResponse(OrderResponse):
    customer: CustomerResponse
