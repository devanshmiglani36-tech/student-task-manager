# StudyFlow Backend API

Node.js, Express, and MongoDB backend for the StudyFlow Student Task Manager.

## Prerequisites

- **Node.js** 18+ (tested on v20.18.0)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017/studyflow`) or a **MongoDB Atlas** cluster URI

## Setup

1. Install dependencies:
   ```powershell
   cd backend
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```powershell
     Copy-Item .env.example .env
     ```
   - Set `MONGODB_URI` to your MongoDB connection string (local or Atlas).
   - Set `JWT_SECRET` to a long random secret string.
   - Set `CORS_ORIGIN` to your React frontend origin (default `http://localhost:5173`).

3. Run the server:
   ```powershell
   # Development (with nodemon)
   npm run dev

   # Production
   npm start
   ```

4. Run the API integration test suite (uses an isolated in-memory MongoDB instance):
   ```powershell
   npm test
   ```

## REST API Endpoints

### Health
- `GET /api/health` — Service health check

### Authentication & Profile
- `POST /api/auth/register` — Register student account (`name`, `email`, `major`, `password`, optional `university`)
- `POST /api/auth/login` — Authenticate and issue JWT (`email`, `password`, optional `rememberMe`)
- `GET /api/auth/me` — Get current authenticated user profile & preferences *(Bearer JWT)*
- `PATCH /api/auth/me` — Update profile fields and/or preferences *(Bearer JWT)*

### Tasks *(Bearer JWT required; scoped to authenticated user)*
- `GET /api/tasks` — List user tasks (`?status=pending|completed&priority=low|medium|high&course=...&search=...`)
- `GET /api/tasks/:id` — Get a single task by ID
- `POST /api/tasks` — Create a new task
- `PUT /api/tasks/:id` & `PATCH /api/tasks/:id` — Update task fields or toggle completion status
- `DELETE /api/tasks/:id` — Delete a task

### Dashboard *(Bearer JWT required)*
- `GET /api/dashboard/summary` — Live KPIs, 7-day completion chart data, course breakdown, and task previews
