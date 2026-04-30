import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery } from '../config/database.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get all bookings for user
router.get('/', async (req, res) => {
  try {
    const result = await executeQuery(
      `SELECT id, userId, serviceType, pickupLocation, dropoffLocation, 
              status, createdAt, scheduledDate, estimatedCost
       FROM bookings 
       WHERE userId = @userId 
       ORDER BY createdAt DESC`,
      { userId: req.user.id }
    );

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking details
router.get('/:id', async (req, res) => {
  try {
    const result = await executeQuery(
      `SELECT * FROM bookings WHERE id = @id AND userId = @userId`,
      { id: req.params.id, userId: req.user.id }
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    const {
      serviceType,
      pickupLocation,
      dropoffLocation,
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude,
      scheduledDate,
      notes,
    } = req.body;

    // Validate input
    if (!serviceType || !pickupLocation || !dropoffLocation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bookingId = uuidv4();
    const status = 'pending';
    const estimatedCost = calculateEstimatedCost(serviceType);

    await executeQuery(
      `INSERT INTO bookings 
       (id, userId, serviceType, pickupLocation, dropoffLocation, 
        pickupLatitude, pickupLongitude, dropoffLatitude, dropoffLongitude,
        status, scheduledDate, estimatedCost, notes, createdAt)
       VALUES (@id, @userId, @serviceType, @pickupLocation, @dropoffLocation,
               @pickupLatitude, @pickupLongitude, @dropoffLatitude, @dropoffLongitude,
               @status, @scheduledDate, @estimatedCost, @notes, @createdAt)`,
      {
        id: bookingId,
        userId: req.user.id,
        serviceType,
        pickupLocation,
        dropoffLocation,
        pickupLatitude: pickupLatitude || null,
        pickupLongitude: pickupLongitude || null,
        dropoffLatitude: dropoffLatitude || null,
        dropoffLongitude: dropoffLongitude || null,
        status,
        scheduledDate: scheduledDate || new Date(),
        estimatedCost,
        notes: notes || null,
        createdAt: new Date(),
      }
    );

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId,
      estimatedCost,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await executeQuery(
      `UPDATE bookings SET status = @status, updatedAt = @updatedAt 
       WHERE id = @id AND userId = @userId`,
      {
        id: req.params.id,
        userId: req.user.id,
        status,
        updatedAt: new Date(),
      }
    );

    res.json({ message: 'Booking status updated' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Cancel booking
router.post('/:id/cancel', async (req, res) => {
  try {
    const result = await executeQuery(
      `SELECT status FROM bookings WHERE id = @id AND userId = @userId`,
      { id: req.params.id, userId: req.user.id }
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = result.recordset[0];
    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ error: 'Cannot cancel this booking' });
    }

    await executeQuery(
      `UPDATE bookings SET status = 'cancelled', updatedAt = @updatedAt 
       WHERE id = @id`,
      { id: req.params.id, updatedAt: new Date() }
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Helper function to calculate estimated cost
function calculateEstimatedCost(serviceType) {
  const basePrices = {
    'parcel-delivery': 50,
    'school-transport': 150,
    'shuttle-service': 100,
  };
  return basePrices[serviceType] || 50;
}

export default router;
