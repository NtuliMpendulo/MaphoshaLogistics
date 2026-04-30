import { executeQuery } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database schema...');

    // Create users table
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
      CREATE TABLE users (
        id NVARCHAR(36) PRIMARY KEY,
        email NVARCHAR(255) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        fullName NVARCHAR(255) NOT NULL,
        phone NVARCHAR(20),
        role NVARCHAR(20) DEFAULT 'customer',
        createdAt DATETIME DEFAULT GETUTCDATE(),
        updatedAt DATETIME DEFAULT GETUTCDATE()
      )
    `);
    console.log('✅ Users table created');

    // Create vehicles table
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='vehicles' AND xtype='U')
      CREATE TABLE vehicles (
        id NVARCHAR(36) PRIMARY KEY,
        make NVARCHAR(100) NOT NULL,
        model NVARCHAR(100) NOT NULL,
        year INT,
        licensePlate NVARCHAR(50) UNIQUE NOT NULL,
        capacity INT DEFAULT 1,
        status NVARCHAR(20) DEFAULT 'available',
        createdAt DATETIME DEFAULT GETUTCDATE(),
        updatedAt DATETIME DEFAULT GETUTCDATE()
      )
    `);
    console.log('✅ Vehicles table created');

    // Create drivers table
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='drivers' AND xtype='U')
      CREATE TABLE drivers (
        id NVARCHAR(36) PRIMARY KEY,
        userId NVARCHAR(36) UNIQUE NOT NULL,
        licenseNumber NVARCHAR(50) UNIQUE NOT NULL,
        vehicleId NVARCHAR(36),
        rating FLOAT DEFAULT 5.0,
        totalTrips INT DEFAULT 0,
        totalEarnings DECIMAL(10,2) DEFAULT 0,
        status NVARCHAR(20) DEFAULT 'available',
        createdAt DATETIME DEFAULT GETUTCDATE(),
        updatedAt DATETIME DEFAULT GETUTCDATE(),
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (vehicleId) REFERENCES vehicles(id)
      )
    `);
    console.log('✅ Drivers table created');

    // Create bookings table
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='bookings' AND xtype='U')
      CREATE TABLE bookings (
        id NVARCHAR(36) PRIMARY KEY,
        userId NVARCHAR(36) NOT NULL,
        driverId NVARCHAR(36),
        serviceType NVARCHAR(50) NOT NULL,
        pickupLocation NVARCHAR(255) NOT NULL,
        dropoffLocation NVARCHAR(255) NOT NULL,
        pickupLatitude FLOAT,
        pickupLongitude FLOAT,
        dropoffLatitude FLOAT,
        dropoffLongitude FLOAT,
        status NVARCHAR(20) DEFAULT 'pending',
        scheduledDate DATETIME,
        estimatedCost DECIMAL(10,2),
        actualCost DECIMAL(10,2),
        notes NVARCHAR(MAX),
        rating INT,
        createdAt DATETIME DEFAULT GETUTCDATE(),
        updatedAt DATETIME DEFAULT GETUTCDATE(),
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (driverId) REFERENCES drivers(id)
      )
    `);
    console.log('✅ Bookings table created');

    // Create tracking table
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tracking' AND xtype='U')
      CREATE TABLE tracking (
        id NVARCHAR(36) PRIMARY KEY,
        bookingId NVARCHAR(36) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        accuracy FLOAT,
        speed FLOAT,
        timestamp DATETIME DEFAULT GETUTCDATE(),
        FOREIGN KEY (bookingId) REFERENCES bookings(id)
      )
    `);
    console.log('✅ Tracking table created');

    // Create payments table
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='payments' AND xtype='U')
      CREATE TABLE payments (
        id NVARCHAR(36) PRIMARY KEY,
        bookingId NVARCHAR(36) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status NVARCHAR(20) DEFAULT 'pending',
        method NVARCHAR(50),
        transactionId NVARCHAR(255),
        createdAt DATETIME DEFAULT GETUTCDATE(),
        FOREIGN KEY (bookingId) REFERENCES bookings(id)
      )
    `);
    console.log('✅ Payments table created');

    // Create indexes for better performance
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='idx_bookings_userId')
      CREATE INDEX idx_bookings_userId ON bookings(userId)
    `);

    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='idx_bookings_driverId')
      CREATE INDEX idx_bookings_driverId ON bookings(driverId)
    `);

    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='idx_tracking_bookingId')
      CREATE INDEX idx_tracking_bookingId ON tracking(bookingId)
    `);

    console.log('✅ Indexes created');
    console.log('✅ Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
