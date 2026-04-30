import express from 'express';
import { executeQuery } from '../config/database.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get driver profile
router.get('/profile', async (req, res) => {
  try {
    const result = await executeQuery(
      `SELECT id, userId, licenseNumber, vehicleId, rating, totalTrips, totalEarnings, status
       FROM drivers 
       WHERE userId = @userId`,
      { userId: req.user.id }
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Driver profile not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching driver profile:', error);
    res.status(500).json({ error: 'Failed to fetch driver profile' });
  }
});

// Get assigned jobs for driver
router.get('/jobs/assigned', async (req, res) => {
  try {
    const driverResult = await executeQuery(
      'SELECT id FROM drivers WHERE userId = @userId',
      { userId: req.user.id }
    );

    if (driverResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const driverId = driverResult.recordset[0].id;

    const result = await executeQuery(
      `SELECT b.id, b.serviceType, b.pickupLocation, b.dropoffLocation, 
              b.status, b.scheduledDate, b.estimatedCost, u.fullName, u.phone
       FROM bookings b
       JOIN users u ON b.userId = u.id
       WHERE b.driverId = @driverId AND b.status IN ('confirmed', 'in-progress')
       ORDER BY b.scheduledDate ASC`,
      { driverId }
    );

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching driver jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Accept job
router.post('/jobs/:bookingId/accept', async (req, res) => {
  try {
    const driverResult = await executeQuery(
      'SELECT id FROM drivers WHERE userId = @userId',
      { userId: req.user.id }
    );

    if (driverResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const driverId = driverResult.recordset[0].id;

    await executeQuery(
      `UPDATE bookings 
       SET driverId = @driverId, status = 'confirmed', updatedAt = @updatedAt
       WHERE id = @bookingId`,
      {
        bookingId: req.params.bookingId,
        driverId,
        updatedAt: new Date(),
      }
    );

    res.json({ message: 'Job accepted' });
  } catch (error) {
    console.error('Error accepting job:', error);
    res.status(500).json({ error: 'Failed to accept job' });
  }
});

// Start job
router.post('/jobs/:bookingId/start', async (req, res) => {
  try {
    await executeQuery(
      `UPDATE bookings 
       SET status = 'in-progress', updatedAt = @updatedAt
       WHERE id = @bookingId`,
      {
        bookingId: req.params.bookingId,
        updatedAt: new Date(),
      }
    );

    res.json({ message: 'Job started' });
  } catch (error) {
    console.error('Error starting job:', error);
    res.status(500).json({ error: 'Failed to start job' });
  }
});

// Complete job
router.post('/jobs/:bookingId/complete', async (req, res) => {
  try {
    const { notes, rating } = req.body;

    await executeQuery(
      `UPDATE bookings 
       SET status = 'completed', notes = @notes, rating = @rating, updatedAt = @updatedAt
       WHERE id = @bookingId`,
      {
        bookingId: req.params.bookingId,
        notes: notes || null,
        rating: rating || null,
        updatedAt: new Date(),
      }
    );

    res.json({ message: 'Job completed' });
  } catch (error) {
    console.error('Error completing job:', error);
    res.status(500).json({ error: 'Failed to complete job' });
  }
});

// Get driver earnings
router.get('/earnings/summary', async (req, res) => {
  try {
    const result = await executeQuery(
      `SELECT 
        COUNT(*) as totalTrips,
        SUM(CAST(estimatedCost as FLOAT)) as totalEarnings,
        AVG(CAST(rating as FLOAT)) as averageRating
       FROM bookings 
       WHERE driverId = (SELECT id FROM drivers WHERE userId = @userId)
       AND status = 'completed'`,
      { userId: req.user.id }
    );

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
});

export default router;
