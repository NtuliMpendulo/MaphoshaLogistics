# MaphoshaLogistics - Premium Transportation Platform

A modern, enterprise-grade logistics and transportation management platform built with React, Node.js, and Azure SQL Database. Designed for seamless booking, real-time tracking, and efficient fleet management.

## 🚀 Features

### Customer Portal
- **Easy Booking System** - Intuitive interface for booking transportation services
- **Service Selection** - Choose from parcel delivery, school transport, and shuttle services
- **Real-time Tracking** - Live GPS tracking of your shipment or vehicle
- **Order History** - View past bookings and download invoices
- **Notifications** - Real-time updates on booking status

### Driver Dashboard
- **Job Management** - View assigned jobs and route optimization
- **GPS Tracking** - Real-time location sharing with customers
- **Status Updates** - Mark jobs as in-progress, completed, or cancelled
- **Earnings Tracking** - Monitor daily earnings and performance metrics
- **Vehicle Management** - Track vehicle status and maintenance

### Admin Panel
- **Fleet Management** - Add, edit, and manage vehicles
- **Driver Management** - Manage driver profiles and assignments
- **Booking Management** - View and manage all bookings
- **Analytics & Reports** - Comprehensive dashboards with KPIs
- **System Configuration** - Manage pricing, service areas, and settings

### Technical Features
- **Real-time GPS Tracking** - Live map updates with Socket.io
- **Authentication** - Secure JWT-based authentication for all user types
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Azure Integration** - Built for Azure App Service and Azure SQL Database
- **Scalable Architecture** - Monorepo structure for easy maintenance and scaling

## 🏗️ Architecture

```
MaphoshaLogistics/
├── frontend/              # React Next.js customer & driver portal
├── backend/               # Node.js Express API server
├── config/                # Shared configuration files
├── docs/                  # Documentation and deployment guides
└── package.json           # Root workspace configuration
```

## 📋 Tech Stack

**Frontend:**
- React 18+ with Next.js
- Tailwind CSS for styling
- Socket.io client for real-time updates
- Leaflet/Mapbox for GPS tracking
- Zustand for state management

**Backend:**
- Node.js with Express
- Azure SQL Database
- Socket.io for real-time communication
- JWT for authentication
- Multer for file uploads

**Infrastructure:**
- Microsoft Azure App Service
- Azure SQL Database
- Azure Storage for assets
- Azure Application Insights for monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Azure subscription with SQL Database
- Git

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/NtuliMpendulo/MaphoshaLogistics.git
cd MaphoshaLogistics
```

2. **Install dependencies:**
```bash
npm run setup
```

3. **Configure environment variables:**

Create `.env.local` in the `backend` directory:
```
DATABASE_URL=Server=your-server.database.windows.net;Database=maphosha;User Id=admin;Password=your-password;
JWT_SECRET=your-jwt-secret-key
AZURE_STORAGE_ACCOUNT=your-storage-account
AZURE_STORAGE_KEY=your-storage-key
NODE_ENV=development
PORT=5000
```

4. **Run development server:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📦 Deployment to Azure

### 1. Create Azure Resources

```bash
# Create resource group
az group create --name maphosha-rg --location eastus

# Create App Service Plan
az appservice plan create --name maphosha-plan --resource-group maphosha-rg --sku B2

# Create Web App
az webapp create --resource-group maphosha-rg --plan maphosha-plan --name maphosha-app

# Create SQL Database
az sql server create --name maphosha-server --resource-group maphosha-rg --admin-user admin --admin-password YourPassword123!

az sql db create --resource-group maphosha-rg --server maphosha-server --name maphosha_db
```

### 2. Build and Deploy

```bash
# Build the application
npm run build

# Deploy to Azure
az webapp deployment source config-zip --resource-group maphosha-rg --name maphosha-app --src dist.zip
```

### 3. Configure Application Settings

In Azure Portal:
1. Go to App Service → Configuration
2. Add Application Settings:
   - `DATABASE_URL`: Your Azure SQL connection string
   - `JWT_SECRET`: Your JWT secret
   - `NODE_ENV`: production

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### Booking Endpoints
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking status

### Tracking Endpoints
- `GET /api/tracking/:bookingId` - Get real-time tracking data
- `POST /api/tracking/update` - Update driver location (WebSocket)

### Admin Endpoints
- `GET /api/admin/analytics` - Get platform analytics
- `GET /api/admin/drivers` - List all drivers
- `GET /api/admin/vehicles` - List all vehicles

## 🔐 Security

- **JWT Authentication** - Secure token-based authentication
- **HTTPS Only** - All communications encrypted
- **SQL Injection Prevention** - Parameterized queries
- **CORS Protection** - Configured for your domain
- **Rate Limiting** - API rate limiting to prevent abuse
- **Data Encryption** - Sensitive data encrypted at rest

## 📊 Database Schema

The platform uses Azure SQL Database with the following main tables:
- `users` - Customer, driver, and admin accounts
- `bookings` - Transportation requests and orders
- `vehicles` - Fleet vehicle information
- `drivers` - Driver profiles and assignments
- `tracking` - Real-time GPS tracking data
- `payments` - Transaction records
- `services` - Available service types

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@maphoshalogistics.com or open an issue on GitHub.

## 🎯 Roadmap

- [ ] Mobile app (iOS/Android)
- [ ] Advanced route optimization
- [ ] Multi-language support
- [ ] Integration with payment gateways
- [ ] Machine learning for demand prediction
- [ ] Automated invoice generation

---

**Built with ❤️ by Manus AI for MaphoshaLogistics**
