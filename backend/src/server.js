import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { assertRequiredEnv } from './config/env.js';

async function startServer() {
  const env = assertRequiredEnv();
  await connectDatabase(env.mongodbUri);
  console.log('Connected to MongoDB');

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`StudyFlow API listening on http://localhost:${env.port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start backend server:', err.message);
  process.exit(1);
});
