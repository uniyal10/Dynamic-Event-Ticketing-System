# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:

- [ ] **Java 17+** installed
  ```bash
  java -version
  ```

- [ ] **Maven 3.6+** installed
  ```bash
  mvn -version
  ```

- [ ] **Docker Desktop** installed and **running**
  - Open Docker Desktop application
  - Wait for it to fully start (whale icon in menu bar)

## Step-by-Step Setup

### 1. Start PostgreSQL Database

```bash
# Make script executable (first time only)
chmod +x start-db.sh

# Start database
./start-db.sh
```

**Or manually:**
```bash
# Start Docker Desktop first, then:
docker-compose up -d

# Verify it's running
docker ps
```

### 2. Run Spring Boot Backend

```bash
cd backend

# Download dependencies (first time only)
mvn clean install

# Run the application
mvn spring-boot:run
```

**Expected output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.2)

Started EventTicketingApplication in 3.5 seconds
```

### 3. Initialize Event (Create 100 Seats)

```bash
# In a new terminal
curl -X POST http://localhost:8080/api/initialize
```

**Expected response:**
```json
{
  "success": "true",
  "message": "Event initialized with 100 seats"
}
```

### 4. Test the APIs

**Get all seats:**
```bash
curl http://localhost:8080/api/seats
```

**Book seats:**
```bash
curl -X POST http://localhost:8080/api/book \
  -H "Content-Type: application/json" \
  -d '{"seatIds": [1, 2, 3], "userName": "John Doe"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Booking confirmed for John Doe",
  "totalPrice": 150.00,
  "bookedSeats": [1, 2, 3],
  "bookingId": 1
}
```

## Common Issues

### Issue: Docker not running
**Solution:** Open Docker Desktop and wait for it to start

### Issue: Port 8080 already in use
**Solution:**
```bash
# Find process
lsof -i :8080

# Kill it
kill -9 <PID>
```

### Issue: Database connection failed
**Solution:**
```bash
# Check if database is running
docker ps

# Restart database
docker-compose restart

# Check logs
docker logs event-ticketing-db
```

### Issue: Maven build failed
**Solution:**
```bash
# Clean and rebuild
mvn clean install -U
```

## Stop Everything

```bash
# Stop Spring Boot (Ctrl+C in terminal)

# Stop database
docker-compose down

# Stop and remove all data
docker-compose down -v
```

## Next Steps

Once the backend is running, you can:

1. ✅ Test all APIs with curl or Postman
2. ✅ Build the React frontend
3. ✅ Integrate frontend with backend
4. ✅ Deploy to GitHub

## Need Help?

Check the main README.md for detailed documentation.
