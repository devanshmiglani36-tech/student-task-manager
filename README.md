# 📚 StudyFlow — Student Task Manager

A full-stack student task manager built with **React + TypeScript + Tailwind CSS** on the frontend and **Node.js + Express.js + MongoDB** on the backend.

---

## 🌐 Live Demo

| Service | URL |
| :--- | :--- |
| **Frontend (Vercel)** | [student-task-manager-8hke.vercel.app](https://student-task-manager-8hke.vercel.app) |
| **Backend API (Render)** | [student-task-manager-0ztz.onrender.com/api/health](https://student-task-manager-0ztz.onrender.com/api/health) |
| **GitHub Repository** | [github.com/devanshmiglani36-tech/student-task-manager](https://github.com/devanshmiglani36-tech/student-task-manager) |

---

## 🗂️ Project Structure

```
stitch_student_task_manager/       ← original Google Stitch UI design exports
backend/                           ← Node.js + Express REST API
│   src/
│   ├── config/        db.js, env.js
│   ├── controllers/   authController.js, taskController.js, dashboardController.js
│   ├── middleware/    auth.js, errorHandler.js, validate.js
│   ├── models/        User.js, Task.js
│   ├── routes/        authRoutes.js, taskRoutes.js, dashboardRoutes.js
│   ├── utils/         jwt.js, formatTask.js
│   ├── validators/    authValidators.js, taskValidators.js
│   ├── app.js
│   └── server.js
│   tests/             api.test.js
│   .env.example
│   package.json
frontend/                          ← React + Vite + TypeScript SPA
│   src/
│   ├── assets/images/
│   ├── components/
│   │   ├── common/    BrandMark, MaterialIcon, ProgressRing, Toast, ToggleSwitch
│   │   ├── dashboard/ CourseworkRingCard, KpiGrid, WeeklyBarChart
│   │   ├── layout/    AppShell, BottomNav, TopHeader
│   │   └── tasks/     TaskCard
│   ├── context/       AppContext.tsx   ← global state + API calls
│   ├── pages/         Login, Registration, Dashboard, MyTasks, AddTask, Profile
│   ├── services/      api.ts           ← all fetch calls to backend
│   ├── types/         task.ts, user.ts
│   ├── App.tsx        ← routes + auth guards
│   └── main.tsx
│   .env.example
│   vercel.json        ← SPA rewrite rule for React Router
│   package.json
```

---

## ✨ Features

- 🔐 **JWT Authentication** — register, login, persistent sessions via `localStorage`
- ✅ **Task Management** — create, edit, delete, complete tasks with priority, category, due dates
- 📊 **Dashboard** — KPI cards, weekly completion bar chart, course breakdown rings
- 👤 **Profile Page** — editable profile, GPA tracker, theme toggle (dark/light)
- 🔔 **Notification Preferences** — notifications & weekly digest toggles
- 📱 **Mobile-first Design** — responsive bottom navigation, safe-area aware
- 🌙 **Dark / Light Theme** — persisted per user in MongoDB
- 🔒 **Route Guards** — protected routes redirect unauthenticated users to login

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
| :--- | :--- |
| React 19 + TypeScript | UI framework |
| Vite 6 | Build tool and dev server |
| Tailwind CSS 3 | Utility-first styling |
| React Router DOM 7 | Client-side routing |
| Context API | Global state management |

### Backend
| Technology | Purpose |
| :--- | :--- |
| Node.js + Express 4 | REST API server |
| Mongoose 8 | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT signing & verification |
| Zod | Schema validation |
| Helmet + CORS | Security headers |
| Morgan | HTTP request logging |

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** v18+ (tested on v20.18.0)
- **MongoDB** running locally OR a MongoDB Atlas cluster URI

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/devanshmiglani36-tech/student-task-manager.git
cd student-task-manager
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Copy the example environment file:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Mac / Linux
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/studyflow
JWT_SECRET=replace-with-a-long-random-secret-string
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

> **Important:** `MONGODB_URI` and `JWT_SECRET` are required. The server exits on startup if either is missing.

Start the backend:

```bash
# Development (auto-restart with nodemon)
npm run dev

# Production
npm start
```

The API runs at `http://localhost:5000`. Test it:

```
GET http://localhost:5000/api/health
→ {"status":"ok","service":"studyflow-backend"}
```

Run the integration test suite (uses an in-memory MongoDB instance — no Atlas needed):

```bash
npm test
```

---

### Step 3 — Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Copy the example environment file:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Mac / Linux
cp .env.example .env
```

Edit `frontend/.env`:

```env
# Must include /api at the end
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 REST API Reference

### Health
```
GET  /api/health                    → Service status check
```

### Authentication
```
POST /api/auth/register             → Register new student account
POST /api/auth/login                → Login and receive JWT
GET  /api/auth/me                   → Get current user profile  [🔒 JWT]
PATCH /api/auth/me                  → Update profile / preferences [🔒 JWT]
```

**Register payload:**
```json
{
  "name": "Devansh Miglani",
  "email": "devansh@example.com",
  "major": "cs",
  "password": "mypassword",
  "university": "Stanford University"
}
```

**Login payload:**
```json
{
  "email": "devansh@example.com",
  "password": "mypassword",
  "rememberMe": true
}
```

### Tasks (all require `Authorization: Bearer <token>`)
```
GET    /api/tasks                   → List tasks (filter: ?status=pending&priority=high&course=CS101&search=exam)
GET    /api/tasks/:id               → Get single task
POST   /api/tasks                   → Create task
PUT    /api/tasks/:id               → Replace task
PATCH  /api/tasks/:id               → Update task fields
DELETE /api/tasks/:id               → Delete task
```

**Create task payload:**
```json
{
  "title": "Midterm Study Session",
  "course": "CS301",
  "dueDate": "2026-11-25",
  "dueTime": "23:59",
  "priority": "high",
  "category": "Exam Prep",
  "notes": "Cover chapters 5-9",
  "smartReminder": true
}
```

### Dashboard
```
GET  /api/dashboard/summary         → KPIs, weekly chart, course breakdown [🔒 JWT]
```

---

## ☁️ Deployment Guide

### Database — MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user (username + password)
3. Under **Network Access** → Add IP Address → `0.0.0.0/0` (allow from anywhere)
4. Get your connection string:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/studyflow?retryWrites=true&w=majority
   ```

---

### Backend — Render (Web Service)

1. Go to [render.com](https://render.com) → **New + → Web Service**
2. Connect your GitHub repo: `devanshmiglani36-tech/student-task-manager`
3. Configure:

   | Setting | Value |
   | :--- | :--- |
   | **Root Directory** | `backend` |
   | **Runtime** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Health Check Path** | `/api/health` |

4. Add **Environment Variables**:

   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://...` |
   | `JWT_SECRET` | `<strong-random-secret>` |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CORS_ORIGIN` | `https://student-task-manager-8hke.vercel.app` |

   > ⚠️ **No trailing slash in `CORS_ORIGIN`!** The backend does exact-match checking.
   > ⚠️ **Do NOT set `PORT`** — Render injects it automatically.

5. Click **Create Web Service** — wait for deploy to finish.
6. Test: `https://student-task-manager-0ztz.onrender.com/api/health` → should return `{"status":"ok","service":"studyflow-backend"}`

---

### Frontend — Vercel (Static Site)

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Import your GitHub repo: `devanshmiglani36-tech/student-task-manager`
3. Configure:

   | Setting | Value |
   | :--- | :--- |
   | **Framework Preset** | Vite |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

4. Add **Environment Variable**:

   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://student-task-manager-0ztz.onrender.com/api` |

   > ⚠️ **Must end with `/api`** — Vite bakes this into the bundle at build time. If you change it, you must redeploy.

5. Click **Deploy**.
6. After deploy, open [student-task-manager-8hke.vercel.app](https://student-task-manager-8hke.vercel.app) — register an account and log in.

---

## 🐛 Common Issues & Fixes

### CORS Error on Login / Register

**Error:**
```
Access to fetch blocked by CORS policy: No 'Access-Control-Allow-Origin' header
```

**Cause:** `CORS_ORIGIN` on Render doesn't match your Vercel URL exactly.

**Fix:** Set `CORS_ORIGIN=https://student-task-manager-8hke.vercel.app` on Render (no trailing slash) → Render will auto-redeploy.

---

### API calls hit wrong URL (missing `/api`)

**Error:**
```
POST https://student-task-manager-0ztz.onrender.com/auth/register  404
```

**Cause:** `VITE_API_BASE_URL` is set to `...onrender.com` instead of `...onrender.com/api`.

**Fix:** Update `VITE_API_BASE_URL=https://student-task-manager-0ztz.onrender.com/api` in Vercel env vars → **Redeploy**.

---

### Backend Cold Start (Slow First Request)

Render's free tier spins down after ~15 min of inactivity. The first request can take 30–60 seconds to wake the server. This is normal on the free tier.

---

### Vercel Preview URLs are Blocked by CORS

Vercel generates unique preview URLs (e.g., `...devansh-20f1.vercel.app`) for every push. Only the **production URL** (`student-task-manager-8hke.vercel.app`) is in `CORS_ORIGIN`. Preview deployments will show CORS errors — use the production URL for testing.

---

## 📁 Key Files Reference

| File | Purpose |
| :--- | :--- |
| [`backend/src/config/env.js`](./backend/src/config/env.js) | Reads all env vars; exits if `MONGODB_URI` or `JWT_SECRET` missing |
| [`backend/src/config/db.js`](./backend/src/config/db.js) | Mongoose connection |
| [`backend/src/middleware/auth.js`](./backend/src/middleware/auth.js) | JWT `requireAuth` middleware |
| [`backend/src/models/User.js`](./backend/src/models/User.js) | User schema + `toPublicJSON()` + `comparePassword()` |
| [`backend/src/models/Task.js`](./backend/src/models/Task.js) | Task schema with userId index |
| [`frontend/src/services/api.ts`](./frontend/src/services/api.ts) | All API fetch calls; reads `VITE_API_BASE_URL` |
| [`frontend/src/context/AppContext.tsx`](./frontend/src/context/AppContext.tsx) | Global state: user, tasks, dashboard, auth |
| [`frontend/src/App.tsx`](./frontend/src/App.tsx) | Routes + `ProtectedRoute` / `GuestOnlyRoute` guards |
| [`frontend/vercel.json`](./frontend/vercel.json) | SPA rewrite — all routes serve `index.html` |

---

## 👨‍💻 Developer

**Devansh Miglani**
- GitHub: [@devanshmiglani36-tech](https://github.com/devanshmiglani36-tech)
- Email: devanshmiglani36@gmail.com
