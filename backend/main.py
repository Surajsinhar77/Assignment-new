from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from config import ALLOWED_ORIGINS
from routes_products import router as products_router
from routes_customers import router as customers_router
from routes_orders import router as orders_router
from routes_stats import router as stats_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory & Order Management System",
    description="A full-stack application for managing products, customers, and orders",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products_router)
app.include_router(customers_router)
app.include_router(orders_router)
app.include_router(stats_router)

@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "Welcome to Inventory & Order Management System",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    from config import PORT
    uvicorn.run(app, host="0.0.0.0", port=PORT)
