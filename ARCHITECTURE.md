# MaphoshaLogistics - Architecture Documentation

## System Overview

MaphoshaLogistics is a modern, full-stack logistics platform built with:
- **Frontend:** React 18 + Next.js 14 (Customer & Driver Portal)
- **Backend:** Node.js + Express (RESTful API)
- **Database:** Azure SQL Database
- **Real-time:** Socket.io for live GPS tracking
- **State Management:** Zustand
- **Styling:** Tailwind CSS

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Customer Portal │  │  Driver Portal   │                │
│  │  (Next.js App)   │  │  (Next.js App)   │                │
│  └────────┬─────────┘  └────────┬─────────┘                │
│           │                     │                           │
│           └──────────┬──────────┘                           │
│                      │                                      │
│            ┌─────────▼──────────┐                          │
│            │  Zustand Stores    │                          │
│            │ (Auth, Booking,    │                          │
│            │  Tracking)         │                          │
│            └─────────┬──────────┘                          │
│                      │                                      │
└──────────────────────┼──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │  REST   │   │ Socket  │   │  Auth   │
   │   API   │   │   .io   │   │  JWT    │
   └────┬────┘   └────┬────┘   └────┬────┘
        │             │             │
┌───────┴─────────────┼─────────────┴────────────────────┐
│                     │                                  │
│              API Layer (Express)                       │
│                     │                                  │
│  ┌──────────────────▼──────────────────┐              │
│  │  Routes & Controllers               │              │
│  │  ├─ Auth Routes                     │              │
│  │  ├─ Booking Routes                  │              │
│  │  ├─ Tracking Routes                 │              │
│  │  ├─ Driver Routes                   │              │
│  │  └─ Admin Routes                    │              │
│  └──────────────────┬──────────────────┘              │
│                     │                                  │
│  ┌──────────────────▼──────────────────┐              │
│  │  Middleware                         │              │
│  │  ├─ Authentication (JWT)            │              │
│  │  ├─ Error Handling                  │              │
│  │  ├─ CORS                            │              │
│  │  └─ Rate Limiting                   │              │
│  └──────────────────┬──────────────────┘              │
│                     │                                  │
└─────────────────────┼──────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────────────────────────────────────────────┐
│           Data Layer (Azure SQL)                     │
├───────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Users     │  │  Bookings   │  │  Vehicles   │ │
│  │  (Accounts) │  │ (Orders)    │  │  (Fleet)    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Drivers   │  │  Tracking   │  │  Payments   │ │
│  │ (Profiles)  │  │  (GPS Data) │  │ (Invoices)  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## Data Models

### Users Table
```sql
CREATE TABLE users (
  id NVARCHAR(36) PRIMARY KEY,
  email NVARCHAR(255) UNIQUE NOT NULL,
  password NVARCHAR(255) NOT NULL,
  fullName NVARCHAR(255) NOT NULL,
  phone NVARCHAR(20),
  role NVARCHAR(20), -- 'customer', 'driver', 'admin'
  createdAt DATETIME DEFAULT GETUTCDATE(),
  updatedAt DATETIME DEFAULT GETUTCDATE()
)
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id NVARCHAR(36) PRIMARY KEY,
  userId NVARCHAR(36) NOT NULL,
  driverId NVARCHAR(36),
  serviceType NVARCHAR(50), -- 'parcel-delivery', 'school-transport', 'shuttle-service'
  pickupLocation NVARCHAR(255) NOT NULL,
  dropoffLocation NVARCHAR(255) NOT NULL,
  pickupLatitude FLOAT,
  pickupLongitude FLOAT,
  dropoffLatitude FLOAT,
  dropoffLongitude FLOAT,
  status NVARCHAR(20), -- 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'
  scheduledDate DATETIME,
  estimatedCost DECIMAL(10,2),
  actualCost DECIMAL(10,2),
  notes NVARCHAR(MAX),
  rating INT,
  createdAt DATETIME DEFAULT GETUTCDATE(),
  updatedAt DATETIME DEFAULT GETUTCDATE()
)
```

### Tracking Table
```sql
CREATE TABLE tracking (
  id NVARCHAR(36) PRIMARY KEY,
  bookingId NVARCHAR(36) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  accuracy FLOAT,
  speed FLOAT,
  timestamp DATETIME DEFAULT GETUTCDATE()
)
```

### Drivers Table
```sql
CREATE TABLE drivers (
  id NVARCHAR(36) PRIMARY KEY,
  userId NVARCHAR(36) UNIQUE NOT NULL,
  licenseNumber NVARCHAR(50) UNIQUE NOT NULL,
  vehicleId NVARCHAR(36),
  rating FLOAT DEFAULT 5.0,
  totalTrips INT DEFAULT 0,
  totalEarnings DECIMAL(10,2) DEFAULT 0,
  status NVARCHAR(20), -- 'available', 'busy', 'offline'
  createdAt DATETIME DEFAULT GETUTCDATE(),
  updatedAt DATETIME DEFAULT GETUTCDATE()
)
```

## API Flow

### Booking Creation Flow

```
Customer → [POST /api/bookings] → Backend
                                    ↓
                            Validate Input
                                    ↓
                        Create Booking Record
                                    ↓
                        Calculate Estimated Cost
                                    ↓
                        Notify Available Drivers
                                    ↓
                    Return Booking ID to Customer
                                    ↓
Customer Receives Confirmation
```

### Real-time Tracking Flow

```
Driver App → [Socket.emit('update-location')] → Backend
                                                    ↓
                                        Store Location in DB
                                                    ↓
                                    Broadcast to Customer
                                                    ↓
Customer App ← [Socket.on('location-updated')] ← Backend
                                                    ↓
                                        Update Map in Real-time
```

## Authentication Flow

```
1. User Registration
   POST /api/auth/register
   → Hash password with bcryptjs
   → Store in database
   → Generate JWT token
   → Return token to client

2. User Login
   POST /api/auth/login
   → Verify email exists
   → Compare password hash
   → Generate JWT token
   → Return token to client

3. Protected Routes
   GET /api/bookings (with Authorization header)
   → Verify JWT token
   → Extract user ID from token
   → Fetch user-specific data
   → Return data

4. Token Refresh
   POST /api/auth/refresh
   → Verify existing token
   → Generate new token
   → Return new token
```

## State Management (Zustand)

### Auth Store
```javascript
useAuthStore = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  
  register(),
  login(),
  logout(),
  getCurrentUser(),
  refreshToken()
}
```

### Booking Store
```javascript
useBookingStore = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
  
  fetchBookings(),
  fetchBooking(id),
  createBooking(data),
  updateBookingStatus(id, status),
  cancelBooking(id)
}
```

### Tracking Store
```javascript
useTrackingStore = {
  currentLocation: null,
  trackingHistory: [],
  isTracking: false,
  error: null,
  
  initSocket(),
  joinBooking(bookingId),
  leaveBooking(bookingId),
  fetchTrackingHistory(bookingId),
  updateLocation(bookingId, lat, lng, accuracy, speed),
  getCurrentLocation(onSuccess, onError)
}
```

## Real-time Communication

### Socket.io Events

**Client → Server:**
- `update-location` - Driver sends GPS coordinates
- `join-booking` - Customer joins booking room
- `leave-booking` - Customer leaves booking room

**Server → Client:**
- `location-updated` - Send updated driver location
- `booking-status-changed` - Notify booking status change
- `driver-assigned` - Notify customer of assigned driver

## Security Measures

1. **Authentication:**
   - JWT tokens with expiry
   - Bcrypt password hashing
   - Token refresh mechanism

2. **Authorization:**
   - Role-based access control (RBAC)
   - Middleware validation on protected routes
   - User-specific data filtering

3. **Data Protection:**
   - HTTPS/SSL encryption
   - SQL injection prevention (parameterized queries)
   - CORS configuration
   - Rate limiting on API endpoints

4. **Database Security:**
   - Azure SQL firewall rules
   - Encrypted connections
   - Automated backups

## Performance Optimization

1. **Frontend:**
   - Code splitting with Next.js
   - Image optimization
   - CSS-in-JS with Tailwind
   - Efficient state management with Zustand

2. **Backend:**
   - Database indexing on frequently queried fields
   - Connection pooling
   - Caching strategies
   - Pagination for large datasets

3. **Database:**
   - Proper indexing
   - Query optimization
   - Regular maintenance

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Azure App Service               │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   Node.js Runtime                │  │
│  │   ├─ Express Server              │  │
│  │   ├─ Socket.io Server            │  │
│  │   └─ Next.js Frontend            │  │
│  └──────────────────┬───────────────┘  │
│                     │                   │
└─────────────────────┼───────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   ┌────▼────┐   ┌────▼────┐   ┌───▼────┐
   │ Azure   │   │ Azure   │   │ Azure  │
   │ Storage │   │ SQL DB  │   │ CDN    │
   └─────────┘   └─────────┘   └────────┘
```

## Scalability Considerations

1. **Horizontal Scaling:**
   - Load balancer for multiple App Service instances
   - Session management with Redis
   - Database read replicas

2. **Vertical Scaling:**
   - Upgrade App Service tier
   - Increase database compute resources
   - Optimize code and queries

3. **Caching:**
   - Redis for session data
   - CDN for static assets
   - Database query caching

## Monitoring & Logging

1. **Application Insights:**
   - Performance monitoring
   - Error tracking
   - User analytics

2. **Logs:**
   - Server logs in `.manus-logs/devserver.log`
   - Browser console logs in `.manus-logs/browserConsole.log`
   - Network requests in `.manus-logs/networkRequests.log`

## Future Enhancements

1. **Mobile App:** React Native for iOS/Android
2. **Advanced Analytics:** Machine learning for demand prediction
3. **Payment Integration:** Stripe/PayPal integration
4. **Multi-language:** i18n support
5. **Advanced Routing:** Route optimization algorithms
6. **Notifications:** Push notifications for status updates

---

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
For setup instructions, see [SETUP.md](./SETUP.md)
