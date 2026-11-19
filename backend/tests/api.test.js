import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { after, before, beforeEach, describe, it } from 'node:test';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDatabase } from '../src/config/db.js';
import { Task } from '../src/models/Task.js';
import { User } from '../src/models/User.js';

let mongoServer;
let app;

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
  process.env.CORS_ORIGIN = 'http://localhost:5173';

  mongoServer = await MongoMemoryServer.create({
    instance: { launchTimeout: 30000 },
  });
  await connectDatabase(mongoServer.getUri());
  app = createApp();
});

beforeEach(async () => {
  await Promise.all([Task.deleteMany({}), User.deleteMany({})]);
});

after(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

async function createTestUser(overrides = {}) {
  const payload = {
    name: 'Maya Lin',
    email: `maya.${Date.now()}.${Math.random()}@stanford.edu`,
    major: 'cs',
    password: 'StudyPassword123!',
    ...overrides,
  };
  const res = await request(app).post('/api/auth/register').send(payload);
  return { res, payload };
}

describe('StudyFlow Backend API', () => {
  it('returns health status and enforces CORS', async () => {
    const okRes = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173');

    assert.equal(okRes.status, 200);
    assert.equal(okRes.body.status, 'ok');
    assert.equal(
      okRes.headers['access-control-allow-origin'],
      'http://localhost:5173',
    );

    const blockedRes = await request(app)
      .get('/api/health')
      .set('Origin', 'https://evil.example.com');
    assert.equal(blockedRes.status, 403);
  });

  it('registers, logs in, fetches, and updates authenticated user profile', async () => {
    const invalidRes = await request(app).post('/api/auth/register').send({
      name: 'A',
      email: 'not-an-email',
      major: '',
      password: '123',
    });
    assert.equal(invalidRes.status, 400);

    const { res: regRes, payload } = await createTestUser({
      email: 'maya@stanford.edu',
    });
    assert.equal(regRes.status, 201);
    assert.ok(regRes.body.token);
    assert.equal(regRes.body.user.email, 'maya@stanford.edu');
    assert.equal(regRes.body.user.major, 'B.S. Computer Science');
    assert.equal(regRes.body.user.passwordHash, undefined);

    const dupRes = await request(app).post('/api/auth/register').send(payload);
    assert.equal(dupRes.status, 409);

    const badLogin = await request(app).post('/api/auth/login').send({
      email: 'maya@stanford.edu',
      password: 'WrongPassword!',
    });
    assert.equal(badLogin.status, 401);

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'maya@stanford.edu',
      password: payload.password,
      rememberMe: true,
    });
    assert.equal(loginRes.status, 200);
    assert.ok(loginRes.body.token);

    const token = loginRes.body.token;
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(meRes.status, 200);
    assert.equal(meRes.body.user.name, 'Maya Lin');

    const patchRes = await request(app)
      .patch('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        statusBanner: 'Midterms Sprint Mode',
        preferences: { theme: 'light', notifications: false },
      });
    assert.equal(patchRes.status, 200);
    assert.equal(patchRes.body.user.statusBanner, 'Midterms Sprint Mode');
    assert.equal(patchRes.body.user.preferences.theme, 'light');
    assert.equal(patchRes.body.user.preferences.notifications, false);
    assert.equal(patchRes.body.user.preferences.weeklyDigest, true);
  });

  it('rejects unauthenticated requests to protected endpoints', async () => {
    const noAuth = await request(app).get('/api/tasks');
    assert.equal(noAuth.status, 401);

    const badToken = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', 'Bearer invalid.jwt.token');
    assert.equal(badToken.status, 401);
  });

  it('supports full task CRUD, filtering, dashboard summary, and user isolation', async () => {
    const { res: userARes } = await createTestUser({
      email: 'usera@stanford.edu',
    });
    const { res: userBRes } = await createTestUser({
      email: 'userb@stanford.edu',
    });
    const tokenA = userARes.body.token;
    const tokenB = userBRes.body.token;

    const badCreate = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: '', course: '' });
    assert.equal(badCreate.status, 400);

    const create1 = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        title: 'Implement Red-Black Tree Balancing',
        course: 'CS 301',
        dueDate: '2025-10-24',
        dueTime: '23:59',
        priority: 'high',
        category: 'Lab',
        notes: 'Include rotation tests',
        smartReminder: true,
      });
    assert.equal(create1.status, 201);
    const task1Id = create1.body.task.id;

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        title: 'Linear Algebra Problem Set 6',
        course: 'MATH 240',
        dueDate: '2025-10-25',
        dueTime: '14:00',
        priority: 'medium',
        category: 'Assignment',
      });

    // Filtering
    const filteredHigh = await request(app)
      .get('/api/tasks?priority=high&search=Red-Black')
      .set('Authorization', `Bearer ${tokenA}`);
    assert.equal(filteredHigh.status, 200);
    assert.equal(filteredHigh.body.tasks.length, 1);
    assert.equal(filteredHigh.body.stats.total, 2);

    // User B cannot access or mutate User A's task
    const crossRead = await request(app)
      .get(`/api/tasks/${task1Id}`)
      .set('Authorization', `Bearer ${tokenB}`);
    assert.equal(crossRead.status, 404);

    const crossDelete = await request(app)
      .delete(`/api/tasks/${task1Id}`)
      .set('Authorization', `Bearer ${tokenB}`);
    assert.equal(crossDelete.status, 404);

    // Invalid ID
    const badId = await request(app)
      .get('/api/tasks/not-a-valid-id')
      .set('Authorization', `Bearer ${tokenA}`);
    assert.equal(badId.status, 400);

    // Toggle completion & check dashboard summary
    const completeRes = await request(app)
      .patch(`/api/tasks/${task1Id}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ status: 'completed' });
    assert.equal(completeRes.status, 200);
    assert.equal(completeRes.body.task.status, 'completed');
    assert.ok(completeRes.body.task.completedAt);

    const summaryRes = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${tokenA}`);
    assert.equal(summaryRes.status, 200);
    assert.equal(summaryRes.body.kpis.totalTasks, 2);
    assert.equal(summaryRes.body.kpis.completedTasks, 1);
    assert.equal(summaryRes.body.kpis.pendingTasks, 1);
    assert.equal(summaryRes.body.kpis.completionRate, 50);
    assert.equal(summaryRes.body.weeklyProgress.length, 7);
    assert.equal(summaryRes.body.courseBreakdown.length, 2);

    // Delete task
    const delRes = await request(app)
      .delete(`/api/tasks/${task1Id}`)
      .set('Authorization', `Bearer ${tokenA}`);
    assert.equal(delRes.status, 200);

    const afterDel = await request(app)
      .get(`/api/tasks/${task1Id}`)
      .set('Authorization', `Bearer ${tokenA}`);
    assert.equal(afterDel.status, 404);
  });
});
