/**
 * Booking Controller — Request/Response handling
 */
const { validationResult } = require('express-validator');
const bookingService = require('../services/bookingService');

/**
 * POST /api/bookings — Create a new booking
 */
exports.createBooking = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
      });
    }

    const booking = await bookingService.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully! We will confirm your appointment shortly.',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings — Get all bookings (admin)
 */
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, date, search } = req.query;
    const bookings = await bookingService.getAll({ status, date, search });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings/stats — Get booking statistics
 */
exports.getStats = async (req, res, next) => {
  try {
    const stats = await bookingService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings/:id — Get single booking
 */
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/bookings/:id — Update booking status
 */
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: pending, confirmed, cancelled'
      });
    }

    const booking = await bookingService.updateStatus(req.params.id, status);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/bookings/:id — Delete booking
 */
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.delete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/bookings/:id/payment — Update payment status
 */
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { payment_status, payment_method } = req.body;

    if (!payment_status || !['unpaid', 'paid', 'failed'].includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: 'payment_status must be one of: unpaid, paid, failed'
      });
    }

    const booking = await bookingService.updatePaymentStatus(
      req.params.id,
      payment_status,
      payment_method || null
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: `Payment ${payment_status} successfully`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/bookings/all — Delete all bookings (requires password)
 */
exports.deleteAllBookings = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (password !== 'admin123') {
      return res.status(403).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    await bookingService.deleteAll();

    res.json({
      success: true,
      message: 'All bookings deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
