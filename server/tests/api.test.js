const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const { User, Patient } = require('../src/models');

let mongo;
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
afterAll(async () => { await mongoose.disconnect(); await mongo.stop(); });
afterEach(async () => { await User.deleteMany({}); await Patient.deleteMany({}); });

test('health endpoint is public', async () => {
  const response = await request(app).get('/api/health');
  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe('ok');
});
test('register and login issue a JWT', async () => {
  const data = { name: 'Test Clinician', email: 'test@example.com', password: 'password123' };
  const registration = await request(app).post('/api/auth/register').send(data);
  expect(registration.statusCode).toBe(201);
  expect(registration.body.token).toEqual(expect.any(String));
  const login = await request(app).post('/api/auth/login').send(data);
  expect(login.statusCode).toBe(200);
  expect(login.body.user.email).toBe(data.email);
});
test('protected patient route rejects anonymous requests', async () => {
  const response = await request(app).get('/api/patients');
  expect(response.statusCode).toBe(401);
});
test('authenticated staff can create and list patients', async () => {
  const registration = await request(app).post('/api/auth/register').send({ name: 'Staff User', email: 'staff@example.com', password: 'password123' });
  const token = registration.body.token;
  const created = await request(app).post('/api/patients').set('Authorization', `Bearer ${token}`).send({ name: 'Alex Patient', dateOfBirth: '1990-04-05', phone: '555-0100' });
  expect(created.statusCode).toBe(201);
  const list = await request(app).get('/api/patients').set('Authorization', `Bearer ${token}`);
  expect(list.statusCode).toBe(200);
  expect(list.body).toHaveLength(1);
  expect(list.body[0].name).toBe('Alex Patient');
});
