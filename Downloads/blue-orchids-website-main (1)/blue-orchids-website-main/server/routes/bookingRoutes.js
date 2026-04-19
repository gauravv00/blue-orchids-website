/**
 * Booking Routes
 */
const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validators');

// POST   /api/bookings       → Create booking
router.post('/', validateBooking, controller.createBooking);

// GET    /api/bookings        → List all bookings
router.get('/', controller.getAllBookings);

// GET    /api/bookings/stats  → Get statistics (must be before /:id)
router.get('/stats', controller.getStats);

// DELETE /api/bookings/all    → Delete all bookings (must be before /:id)
router.delete('/all', controller.deleteAllBookings);

// GET    /api/bookings/:id    → Get single booking
router.get('/:id', controller.getBookingById);

// PATCH  /api/bookings/:id    → Update status
router.patch('/:id', controller.updateBookingStatus);

// DELETE /api/bookings/:id    → Delete booking
router.delete('/:id', controller.deleteBooking);

// PATCH  /api/bookings/:id/payment → Update payment status
router.patch('/:id/payment', controller.updatePaymentStatus);

module.exports = router;
