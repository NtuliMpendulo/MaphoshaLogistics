# MaphoshaLogistics - Complete Setup Guide

This guide will help you set up the MaphoshaLogistics platform locally and prepare it for Azure deployment.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** 18.0+ ([Download](https://nodejs.org/))
- **npm** 9.0+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Azure Account** with SQL Database access
- **Code Editor** (VS Code recommended)

## 🚀 Quick Start (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/NtuliMpendulo/MaphoshaLogistics.git
cd MaphoshaLogistics
```

### 2. Install Dependencies

```bash
npm run setup
```

This will install dependencies for both frontend and backend.

### 3. Configure Environment Variables

**Backend Configuration:**

Create `backend/.env` file:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your Azure SQL credentials:

```env
DATABASE_SERVER=your-server.database.windows.net
DATABASE_NAME=maphosha_db
DATABASE_USER=admin
DATABASE_PASSWORD=YourPassword123!
DATABASE_PORT=1433
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Frontend Configuration:**

Create `frontend/.env.local` file:

```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Initialize Database

Run the database initialization script:

```bash
npm run migrate --workspace=backend
```

This will create all necessary tables in your Azure SQL Database.

### 5. Start Development Servers

```bash
npm run dev
```

This will start both backend (port 5000) and frontend (port 3000) servers.

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## 📁 Project Structure

```
MaphoshaLogistics/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── middleware/        # Authentication & error handling
│   │   ├── routes/            # API endpoints
│   │   ├── migrations/        # Database schemas
│   │   └── index.js           # Server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # Next.js React application
│   ├── app/                   # Page components
│   ├── store/                 # Zustand state management
│   ├── styles/                # Global CSS
│   ├── package.json
│   └── .env.example
│
├── config/                    # Shared configuration
├── DEPLOYMENT.md              # Azure deployment guide
├── SETUP.md                   # This file
└── README.md                  # Project overview
```

## 🔐 User Roles

The platform supports three user roles:

### 1. **Customer**
- Create bookings for transportation services
- Track real-time delivery status
- View booking history
- Rate completed trips

### 2. **Driver**
- View assigned jobs
- Accept/reject jobs
- Update job status
- Share real-time GPS location
- Track earnings

### 3. **Admin**
- View all bookings and drivers
- Manage vehicle fleet
- Access analytics dashboard
- Configure system settings

## 🧪 Testing the Application

### Create Test Accounts

1. **Customer Account:**
   - Go to http://localhost:3000/register
   - Fill in details and select "Customer" role
   - Click "Create Account"

2. **Driver Account:**
   - Go to http://localhost:3000/register
   - Fill in details and select "Driver" role
   - Click "Create Account"

### Test Workflows

**Customer Workflow:**
1. Login as customer
2. Click "New Booking"
3. Select service type (Parcel Delivery, School Transport, or Shuttle)
4. Enter pickup and dropoff locations
5. Click "Create Booking"
6. View booking in "My Bookings"
7. Click "Track" to see real-time tracking

**Driver Workflow:**
1. Login as driver
2. Go to Driver Dashboard
3. View assigned jobs
4. Click "Accept Job"
5. Click "Start Job"
6. System will track GPS location in real-time

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Bookings
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/:id/cancel` - Cancel booking

### Tracking
- `GET /api/tracking/:bookingId` - Get current location
- `GET /api/tracking/:bookingId/history` - Get tracking history
- `POST /api/tracking/update` - Update driver location

### Driver Operations
- `GET /api/drivers/profile` - Get driver profile
- `GET /api/drivers/jobs/assigned` - Get assigned jobs
- `POST /api/drivers/jobs/:id/accept` - Accept job
- `POST /api/drivers/jobs/:id/start` - Start job
- `POST /api/drivers/jobs/:id/complete` - Complete job
- `GET /api/drivers/earnings/summary` - Get earnings summary

### Admin
- `GET /api/admin/analytics` - Get platform analytics
- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/drivers` - List all drivers
- `GET /api/admin/vehicles` - List all vehicles
- `POST /api/admin/vehicles` - Add new vehicle
- `GET /api/admin/revenue/daily` - Get daily revenue
- `GET /api/admin/services/breakdown` - Get service breakdown

## 🐛 Troubleshooting

### Port Already in Use

If port 5000 or 3000 is already in use:

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues

1. Verify connection string in `.env`
2. Check firewall rules in Azure SQL
3. Ensure database exists in Azure

```bash
# Test connection
npm run migrate --workspace=backend
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm run setup
```

### CORS Errors

Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL:

```env
FRONTEND_URL=http://localhost:3000  # For local development
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Azure SQL Database](https://docs.microsoft.com/en-us/azure/azure-sql/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Zustand Store](https://github.com/pmndrs/zustand)

## 🚀 Next Steps

1. **Local Testing:** Test all features locally
2. **Customization:** Modify branding, colors, and services
3. **Database Setup:** Configure Azure SQL Database
4. **Deployment:** Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for Azure setup
5. **Production:** Deploy to Azure App Service

## 📞 Support

For issues or questions:
1. Check [GitHub Issues](https://github.com/NtuliMpendulo/MaphoshaLogistics/issues)
2. Review logs in `.manus-logs/` directory
3. Contact support at support@maphoshalogistics.com

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

**Happy coding! 🚀**
