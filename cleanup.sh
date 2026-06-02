#!/bin/bash

# Stop and clean up script
# WARNING: This will remove all containers and optionally data

echo "🧹 Cleanup Script for Inventory & Order Management System"
echo "=========================================================="
echo ""

echo "⚠️  WARNING: This will stop all containers"
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled."
    exit 1
fi

echo ""
echo "Select cleanup level:"
echo "1. Soft cleanup (stop containers only)"
echo "2. Hard cleanup (stop containers and remove)"
echo "3. Full cleanup (stop, remove, and delete volumes - DATA LOSS!)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "🛑 Stopping containers..."
        docker-compose stop
        echo "✅ Containers stopped"
        ;;
    2)
        echo "🛑 Stopping and removing containers..."
        docker-compose down
        echo "✅ Containers removed"
        ;;
    3)
        echo "⚠️  WARNING: This will DELETE your database!"
        read -p "Type 'DELETE' to confirm: " confirm
        if [ "$confirm" = "DELETE" ]; then
            echo "🗑️  Removing containers and volumes..."
            docker-compose down -v
            echo "✅ All containers and volumes removed"
        else
            echo "Cleanup cancelled."
            exit 1
        fi
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "Cleanup complete!"
