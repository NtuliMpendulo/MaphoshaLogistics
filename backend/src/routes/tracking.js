import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get tracking data for a booking
router.get('/:bookingId', authenticateToken, async (req, res) => {
  try {
    const result = await executeQuery(
      `SELECT * FROM tracking 
       WHERE bookingId = @bookingId 
       ORDER BY timestamp DESC 
       LIMIT 1`,
      { bookingId: req.params.bookingId }
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Tracking data not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching tracking data:', error);
    res.status(500).json({ error: 'Failed to fetch tracking data' });
  }
});

// Get tracking history for a booking
router.get('/:bookingId/history', authenticateToken, async (req, res) => {
  try {
    const result = await executeQuery(
      `SELECT latitude, longitude, accuracy, speed, timestamp 
       FROM tracking 
       WHERE bookingId = @bookingId 
       ORDER BY timestamp ASC`,
      { bookingId: req.params.bookingId }
    );

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching tracking history:', error);
    res.status(500).json({ error: 'Failed to fetch tracking history' });
  }
});

// Update tracking location (from driver)
router.post('/update', authenticateToken, async (req, res) => {
  try {
    const { bookingId, latitude, longitude, accuracy, speed } = req.body;

    // Validate input
    if (!bookingId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const trackingId = uuidv4();

    await executeQuery(
      `INSERT INTO tracking 
       (id, bookingId, latitude, longitude, accuracy, speed, timestamp)
       VALUES (@id, @bookingId, @latitude, @longitude, @accuracy, @speed, @timestamp)`,
      {
        id: trackingId,
        bookingId,
        latitude,
        longitude,
        accuracy: accuracy || null,
        speed: speed || null,
        timestamp: new Date(),
      }
    );

    res.status(201).json({
      message: 'Location updated',
      trackingId,
    });
  } catch (error) {
    console.error('Error updating tracking:', error);
    res.status(500).json({ error: 'Failed to update tracking' });
  }
});

// Get active bookings with tracking (for admin/driver)
router.get('/active/all', authenticateToken, async (req, res) => {
  try {
    const result = await executeQuery(
      `SELECT b.id, b.serviceType, b.pickupLocation, b.dropoffLocation, 
              b.status, t.latitude, t.longitude, t.timestamp
       FROM bookings b
       LEFT JOIN tracking t ON b.id = t.bookingId
       WHERE b.status IN ('confirmed', 'in-progress')
       ORDER BY b.createdAt DESC`
    );

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching active bookings:', error);
    res.status(500).json({ error: 'Failed to fetch active bookings' });
  }
});

export default router;
