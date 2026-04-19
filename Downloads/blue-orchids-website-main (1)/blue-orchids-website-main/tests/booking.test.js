/**
 * Unit Tests — Booking Model Validation
 */
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'blue_orchids_test';

const { sequelize } = require('../server/config/database');
const Booking = require('../server/models/Booking');

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  } catch (error) {
    console.log('⚠️  Database not available. Skipping model tests.');
  }
});

afterAll(async () => {
  try { await sequelize.close(); } catch (e) { /* ignore */ }
});

describe('Booking Model', () => {
  const validData = {
    name: 'Test User',
    email: 'test@model.com',
    phone: '+91 98765 43210',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '02:00 PM',
    guests: 1
  };

  it('should create a valid booking', async () => {
    const booking = await Booking.create(validData);
    expect(booking.id).toBeDefined();
    expect(booking.name).toBe('Test User');
    expect(booking.status).toBe('pending');
  });

  it('should reject booking without name', async () => {
    await expect(
      Booking.create({ ...validData, name: '' })
    ).rejects.toThrow();
  });

  it('should reject booking without email', async () => {
    await expect(
      Booking.create({ ...validData, email: '' })
    ).rejects.toThrow();
  });

  it('should reject booking with invalid email', async () => {
    await expect(
      Booking.create({ ...validData, email: 'notanemail' })
    ).rejects.toThrow();
  });

  it('should reject booking without phone', async () => {
    await expect(
      Booking.create({ ...validData, phone: '' })
    ).rejects.toThrow();
  });

  it('should default guests to 1', async () => {
    const booking = await Booking.create({
      ...validData,
      email: 'guest-test@model.com',
      guests: undefined
    });
    expect(booking.guests).toBe(1);
  });

  it('should default status to pending', async () => {
    const booking = await Booking.create({
      ...validData,
      email: 'status-test@model.com'
    });
    expect(booking.status).toBe('pending');
  });

  it('should allow special_requests to be null', async () => {
    const booking = await Booking.create({
      ...validData,
      email: 'null-req@model.com',
      special_requests: null
    });
    expect(booking.special_requests).toBeNull();
  });

  it('should store special_requests when provided', async () => {
    const booking = await Booking.create({
      ...validData,
      email: 'req@model.com',
      special_requests: 'Window seat please'
    });
    expect(booking.special_requests).toBe('Window seat please');
  });
});
