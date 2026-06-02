#!/bin/bash

# Database operations script
# Backup, restore, and manage database

set -e

echo "📊 Database Management Script"
echo "============================="
echo ""

if [ $# -eq 0 ]; then
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  backup       - Create database backup"
    echo "  restore      - Restore from backup"
    echo "  reset        - Reset database (deletes all data)"
    echo "  shell        - Open database shell"
    echo "  status       - Check database status"
    echo ""
    exit 1
fi

COMMAND=$1

case $COMMAND in
    backup)
        echo "💾 Creating database backup..."
        mkdir -p backups
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        FILENAME="backups/backup_${TIMESTAMP}.sql"
        docker-compose exec -T db pg_dump -U postgres inventory_db > "$FILENAME"
        echo "✅ Database backed up to: $FILENAME"
        ;;
    restore)
        if [ -z "$2" ]; then
            echo "❌ Please specify backup file"
            ls -la backups/
            exit 1
        fi
        echo "⚠️  WARNING: This will restore from backup and overwrite current data"
        read -p "Continue? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Restore cancelled."
            exit 1
        fi
        echo "🔄 Restoring from: $2"
        cat "$2" | docker-compose exec -T db psql -U postgres inventory_db
        echo "✅ Database restored"
        ;;
    reset)
        echo "⚠️  WARNING: This will DELETE all database data!"
        read -p "Type 'RESET' to confirm: " confirm
        if [ "$confirm" = "RESET" ]; then
            echo "🗑️  Resetting database..."
            docker-compose down -v
            docker-compose up -d db
            sleep 5
            echo "✅ Database reset complete"
        else
            echo "Reset cancelled."
        fi
        ;;
    shell)
        echo "🐘 Opening database shell..."
        docker-compose exec db psql -U postgres inventory_db
        ;;
    status)
        echo "📈 Checking database status..."
        docker-compose exec db pg_isready -U postgres
        echo ""
        echo "Database containers:"
        docker-compose ps db
        ;;
    *)
        echo "❌ Unknown command: $COMMAND"
        exit 1
        ;;
esac
