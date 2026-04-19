/**
 * Booking Service — Business logic layer
 */
const Booking = require('../models/Booking');

class BookingService {
  /**
   * Create a new booking
   */
  async create(data) {
    const booking = await Booking.create({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      date: data.date,
      time: data.time,
      guests: data.guests || 1,
      special_requests: data.special_requests ? data.special_requests.trim() : null,
      status: 'pending'
    });
    return booking;
  }

  /**
   * Get all bookings, newest first
   */
  async getAll({ status, date, search } = {}) {
    const where = {};

    if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
      where.status = status;
    }

    if (date) {
      where.date = date;
    }

    const bookings = await Booking.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    // Client-side search is fine for a salon app, but we can also filter here
    if (search) {
      const q = search.toLowerCase();
      return bookings.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.phone.includes(q)
      );
    }

    return bookings;
  }

  /**
   * Get a single booking by ID
   */
  async getById(id) {
    const booking = await Booking.findByPk(id);
    return booking;
  }

  /**
   * Update booking status
   */
  async updateStatus(id, status) {
    const booking = await Booking.findByPk(id);
    if (!booking) return null;

    booking.status = status;
    await booking.save();
    return booking;
  }

  /**
   * Delete a booking
   */
  async delete(id) {
    const booking = await Booking.findByPk(id);
    if (!booking) return null;

    await booking.destroy();
    return booking;
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(id, paymentStatus, paymentMethod) {
    const booking = await Booking.findByPk(id);
    if (!booking) return null;

    booking.payment_status = paymentStatus;
    if (paymentMethod) booking.payment_method = paymentMethod;
    await booking.save();
    return booking;
  }

  /**
   * Get stats for admin dashboard
   */
  async getStats() {
    const total = await Booking.count();
    const pending = await Booking.count({ where: { status: 'pending' } });
    const confirmed = await Booking.count({ where: { status: 'confirmed' } });
    const cancelled = await Booking.count({ where: { status: 'cancelled' } });
    const paid = await Booking.count({ where: { payment_status: 'paid' } });

    // Today's bookings
    const today = new Date().toISOString().split('T')[0];
    const todayCount = await Booking.count({ where: { date: today } });

    return { total, pending, confirmed, cancelled, paid, todayCount };
  }

  /**
   * Delete all bookings
   */
  async deleteAll() {
    // truncate: true will reset the auto-increment counter in the database
    const count = await Booking.destroy({ truncate: true });
    return count;
  }
}

module.exports = new BookingService();
