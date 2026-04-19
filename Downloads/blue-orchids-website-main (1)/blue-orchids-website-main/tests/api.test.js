/**
 * API Integration Tests — Booking Endpoints
 */
const request = require('supertest');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'blue_orchids_test';

const app = require('../server/app');
const { sequelize } = require('../server/config/database');
const Booking = require('../server/models/Booking');

// Test data
const validBooking = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '+91 98765 43210',
  date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
  time: '11:00 AM',
  guests: 2,
  special_requests: 'Window seat please'
};

// Setup & Teardown
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // recreate tables for test
  } catch (error) {
    console.log('⚠️  Database not available for testing. Skipping DB tests.');
    console.log('    Make sure MySQL is running and blue_orchids_test database exists.');
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
  } catch (e) { /* ignore */ }
});

// ── Health Check ───────────────────────────────────────────────
describe('GET /api/health', () => {
  it('should return ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

// ── POST /api/bookings ────────────────────────────────────────
describe('POST /api/bookings', () => {
  it('should create a booking with valid data', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send(validBooking);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.name).toBe('Test User');
    expect(res.body.data.email).toBe('test@example.com');
    expect(res.body.data.status).toBe('pending');
  });

  it('should fail without required name', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ ...validBooking, name: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should fail with invalid email', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ ...validBooking, email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should fail with past date', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ ...validBooking, date: '2020-01-01' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should fail without phone', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ ...validBooking, phone: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should fail without time', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ ...validBooking, time: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ── GET /api/bookings ─────────────────────────────────────────
describe('GET /api/bookings', () => {
  it('should return all bookings', async () => {
    const res = await request(app).get('/api/bookings');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
  });

  it('should filter by status', async () => {
    const res = await request(app).get('/api/bookings?status=pending');
    expect(res.status).toBe(200);
    res.body.data.forEach(b => {
      expect(b.status).toBe('pending');
    });
  });
});

// ── GET /api/bookings/stats ───────────────────────────────────
describe('GET /api/bookings/stats', () => {
  it('should return booking statistics', async () => {
    const res = await request(app).get('/api/bookings/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBeDefined();
    expect(res.body.data.pending).toBeDefined();
    expect(res.body.data.confirmed).toBeDefined();
  });
});

// ── GET /api/bookings/:id ─────────────────────────────────────
describe('GET /api/bookings/:id', () => {
  it('should return a single booking', async () => {
    const res = await request(app).get('/api/bookings/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(1);
  });

  it('should return 404 for non-existent ID', async () => {
    const res = await request(app).get('/api/bookings/99999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ── PATCH /api/bookings/:id ───────────────────────────────────
describe('PATCH /api/bookings/:id', () => {
  it('should update booking status to confirmed', async () => {
    const res = await request(app)
      .patch('/api/bookings/1')
      .send({ status: 'confirmed' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('confirmed');
  });

  it('should reject invalid status', async () => {
    const res = await request(app)
      .patch('/api/bookings/1')
      .send({ status: 'invalid' });

    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existent booking', async () => {
    const res = await request(app)
      .patch('/api/bookings/99999')
      .send({ status: 'confirmed' });

    expect(res.status).toBe(404);
  });
});

// ── DELETE /api/bookings/:id ──────────────────────────────────
describe('DELETE /api/bookings/:id', () => {
  it('should delete a booking', async () => {
    // Create a booking to delete
    const createRes = await request(app)
      .post('/api/bookings')
      .send({ ...validBooking, email: 'delete@test.com' });

    const id = createRes.body.data.id;

    const res = await request(app).delete(`/api/bookings/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it's deleted
    const getRes = await request(app).get(`/api/bookings/${id}`);
    expect(getRes.status).toBe(404);
  });

  it('should return 404 for non-existent booking', async () => {
    const res = await request(app).delete('/api/bookings/99999');
    expect(res.status).toBe(404);
  });
});

// ── 404 API routes ────────────────────────────────────────────
describe('Unknown API routes', () => {
  it('should return 404 for unknown API route', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
