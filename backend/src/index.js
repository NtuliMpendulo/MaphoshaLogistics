import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import trackingRoutes from './routes/tracking.js';
import adminRoutes from './routes/admin.js';
import driverRoutes from './routes/drivers.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', authenticateToken, bookingRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/drivers', authenticateToken, driverRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

// Socket.io real-time tracking
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Driver location update
  socket.on('update-location', (data) => {
    const { bookingId, latitude, longitude, accuracy } = data;
    
    // Broadcast location to customers watching this booking
    io.to(`booking-${bookingId}`).emit('location-updated', {
      latitude,
      longitude,
      accuracy,
      timestamp: new Date().toISOString(),
    });
  });

  // Join booking room for real-time updates
  socket.on('join-booking', (bookingId) => {
    socket.join(`booking-${bookingId}`);
    console.log(`Socket ${socket.id} joined booking room: booking-${bookingId}`);
  });

  // Leave booking room
  socket.on('leave-booking', (bookingId) => {
    socket.leave(`booking-${bookingId}`);
    console.log(`Socket ${socket.id} left booking room: booking-${bookingId}`);
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        🚚 MaphoshaLogistics Backend Server Started        ║
║                                                            ║
║  Server: http://localhost:${PORT}                             ║
║  Environment: ${process.env.NODE_ENV || 'development'}                       ║
║  Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { io };
