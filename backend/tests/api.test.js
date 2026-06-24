const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const AdminUser = require('../src/models/AdminUser');
const Inquiry = require('../src/models/Inquiry');

let mongoServer;
let authToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const admin = await AdminUser.create({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'TestPass123',
    role: 'admin',
  });

  const jwt = require('jsonwebtoken');
  authToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'test_secret');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Inquiry.deleteMany();
});

describe('Health Check', () => {
  it('should return API health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Inquiry API', () => {
  const validInquiry = {
    fullName: 'John Smith',
    email: 'john@example.com',
    phone: '+44 7700 900456',
    companyName: 'Smith Corp',
    country: 'United Kingdom',
    jobTitle: 'Director',
    jobDetails: 'We need an AI solution for our customer service department with chatbot capabilities.',
    serviceInterest: 'Virtual Assistant',
  };

  it('should create a new inquiry with valid data', async () => {
    const res = await request(app).post('/api/inquiries').send(validInquiry);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Thank you');
  });

  it('should reject inquiry with missing required fields', async () => {
    const res = await request(app).post('/api/inquiries').send({ fullName: 'John' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject inquiry with invalid email', async () => {
    const res = await request(app)
      .post('/api/inquiries')
      .send({ ...validInquiry, email: 'invalid-email' });
    expect(res.status).toBe(400);
  });

  it('should get inquiries for authenticated admin', async () => {
    await Inquiry.create(validInquiry);
    const res = await request(app)
      .get('/api/inquiries')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should reject unauthenticated access to inquiries', async () => {
    const res = await request(app).get('/api/inquiries');
    expect(res.status).toBe(401);
  });
});

describe('Auth API', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'TestPass123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });
});

describe('Chatbot API', () => {
  it('should respond to chatbot messages', async () => {
    const res = await request(app)
      .post('/api/content/chatbot')
      .send({ message: 'What services do you offer?' });
    expect(res.status).toBe(200);
    expect(res.body.data.message).toBeDefined();
  });
});
