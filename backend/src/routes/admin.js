import express from 'express';
import { executeQuery } from '../config/database.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Protect admin routes
router.use(authorizeRole('admin'));

// Get platform analytics
router.get('/analytics', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        (SELECT COUNT(*) FROM bookings) as totalBookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'completed') as completedBookings,
        (SELECT COUNT(*) FROM users WHERE role = 'customer') as totalCustomers,
        (SELECT COUNT(*) FROM users WHERE role = 'driver') as totalDrivers,
        (SELECT COUNT(*) FROM vehicles) as totalVehicles,
        (SELECT SUM(CAST(estimatedCost as FLOAT)) FROM bookings WHERE status = 'completed') as totalRevenue
    `);

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT b.id, b.serviceType, b.status, b.estimatedCost, b.createdAt,
             u.fullName as customerName, d.id as driverId
      FROM bookings b
      JOIN users u ON b.userId = u.id
      LEFT JOIN drivers d ON b.driverId = d.id
      ORDER BY b.createdAt DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get all drivers
router.get('/drivers', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT d.id, d.licenseNumber, d.rating, d.totalTrips, d.totalEarnings, d.status,
             u.fullName, u.email, u.phone
      FROM drivers d
      JOIN users u ON d.userId = u.id
      ORDER BY d.totalTrips DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Get all vehicles
router.get('/vehicles', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT id, make, model, year, licensePlate, capacity, status, createdAt
      FROM vehicles
      ORDER BY createdAt DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Add vehicle
router.post('/vehicles', async (req, res) => {
  try {
    const { make, model, year, licensePlate, capacity } = req.body;

    if (!make || !model || !licensePlate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const vehicleId = require('uuid').v4();

    await executeQuery(
      `INSERT INTO vehicles (id, make, model, year, licensePlate, capacity, status, createdAt)
       VALUES (@id, @make, @model, @year, @licensePlate, @capacity, @status, @createdAt)`,
      {
        id: vehicleId,
        make,
        model,
        year: year || null,
        licensePlate,
        capacity: capacity || 1,
        status: 'available',
        createdAt: new Date(),
      }
    );

    res.status(201).json({ message: 'Vehicle added', vehicleId });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

// Get daily revenue
router.get('/revenue/daily', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        CAST(createdAt as DATE) as date,
        COUNT(*) as bookings,
        SUM(CAST(estimatedCost as FLOAT)) as revenue
      FROM bookings
      WHERE status = 'completed'
      GROUP BY CAST(createdAt as DATE)
      ORDER BY date DESC
      LIMIT 30
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching daily revenue:', error);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

// Get service type breakdown
router.get('/services/breakdown', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        serviceType,
        COUNT(*) as count,
        SUM(CAST(estimatedCost as FLOAT)) as revenue
      FROM bookings
      WHERE status = 'completed'
      GROUP BY serviceType
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching service breakdown:', error);
    res.status(500).json({ error: 'Failed to fetch service breakdown' });
  }
});

// Update booking status (admin override)
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await executeQuery(
      `UPDATE bookings SET status = @status, updatedAt = @updatedAt WHERE id = @id`,
      { id: req.params.id, status, updatedAt: new Date() }
    );

    res.json({ message: 'Booking status updated' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

export default router;
