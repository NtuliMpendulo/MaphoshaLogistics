/**
 * Demo Credentials for MaphoshaLogistics
 * Use these to test the platform
 */

export const DEMO_CREDENTIALS = {
  driver: {
    email: 'driver@demo.com',
    password: 'Demo@123456',
    fullName: 'Thabo Mthembu',
    role: 'driver',
    phone: '+27 (0) 11 234 5678',
    vehicleNumber: 'JNB 234 GP',
    vehicleType: 'Toyota Hiace',
    status: 'active',
    rating: 4.95,
    earnings: 8450
  },
  admin: {
    email: 'admin@demo.com',
    password: 'Admin@123456',
    fullName: 'Admin User',
    role: 'admin',
    phone: '+27 (0) 11 999 8888',
    status: 'active'
  },
  customer: {
    email: 'customer@demo.com',
    password: 'Customer@123456',
    fullName: 'John Smith',
    role: 'customer',
    phone: '+27 (0) 11 555 4444',
    status: 'active'
  }
};

/**
 * Demo Data for Testing
 */
export const DEMO_DATA = {
  activeJobs: [
    {
      id: 1,
      customer: 'John Smith',
      pickup: '123 Main St, Johannesburg',
      dropoff: '456 Park Ave, Johannesburg',
      distance: '12.5 km',
      status: 'in-progress',
      earnings: 150,
      startTime: '09:30 AM',
      estimatedTime: '45 mins',
      rating: 4.8,
      priority: 'high'
    },
    {
      id: 2,
      customer: 'Sarah Johnson',
      pickup: '789 Oak Rd, Johannesburg',
      dropoff: '321 Elm St, Johannesburg',
      distance: '8.2 km',
      status: 'pending',
      earnings: 120,
      startTime: '10:15 AM',
      estimatedTime: '35 mins',
      rating: 4.9,
      priority: 'normal'
    }
  ],
  topDrivers: [
    { id: 1, name: 'Thabo Mthembu', trips: 127, earnings: 'R8,450', rating: 4.95 },
    { id: 2, name: 'Sipho Ndlela', trips: 115, earnings: 'R7,820', rating: 4.88 },
    { id: 3, name: 'Lerato Khumalo', trips: 108, earnings: 'R7,340', rating: 4.92 },
    { id: 4, name: 'Mandla Dlamini', trips: 102, earnings: 'R6,980', rating: 4.85 },
    { id: 5, name: 'Naledi Molefe', trips: 98, earnings: 'R6,650', rating: 4.90 }
  ],
  analytics: {
    totalRevenue: 'R45,230',
    activeDrivers: 234,
    completedTrips: 1847,
    averageRating: 4.82,
    completionRate: 98,
    bookingRate: 68,
    retentionRate: 82
  }
};

/**
 * Instructions for using demo credentials
 */
export const DEMO_INSTRUCTIONS = `
🚀 MaphoshaLogistics - Demo Credentials

DRIVER ACCOUNT:
Email: driver@demo.com
Password: Demo@123456
Access: /driver/dashboard

ADMIN ACCOUNT:
Email: admin@demo.com
Password: Admin@123456
Access: /admin/analytics

CUSTOMER ACCOUNT:
Email: customer@demo.com
Password: Customer@123456
Access: /bookings

DEMO PAGES:
- Homepage: /
- Driver Dashboard: /driver/dashboard
- Admin Analytics: /admin/analytics
- Live Tracking: /tracking/live
- Bookings: /bookings
- Login: /login
- Register: /register

FEATURES TO EXPLORE:
✅ Real-time job management
✅ Live earnings tracking
✅ Performance analytics
✅ Driver leaderboards
✅ Live tracking with maps
✅ Admin dashboards
✅ Booking system
✅ Notifications and alerts
`;
