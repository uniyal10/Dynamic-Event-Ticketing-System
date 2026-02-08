#!/bin/bash

echo "🚀 Starting Event Ticketing System Backend"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and try again."
    echo ""
    echo "Steps:"
    echo "1. Open Docker Desktop application"
    echo "2. Wait for Docker to start"
    echo "3. Run this script again"
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start PostgreSQL
echo "📦 Starting PostgreSQL database..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if database is healthy
if docker ps | grep -q "event-ticketing-db"; then
    echo "✅ PostgreSQL is running"
else
    echo "❌ Failed to start PostgreSQL"
    exit 1
fi

echo ""
echo "🎉 Database is ready!"
echo ""
echo "Next steps:"
echo "1. cd backend"
echo "2. mvn spring-boot:run"
echo "3. Initialize event: curl -X POST http://localhost:8080/api/initialize"
echo ""
