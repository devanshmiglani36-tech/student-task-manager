# StudyFlow — Student Task Manager

Full-stack student task manager built with a React + TypeScript + Tailwind CSS frontend and an Express.js + MongoDB backend.

## Project Structure

- `frontend/` — React + Vite + TypeScript UI
- `backend/` — Node.js + Express.js + Mongoose REST API
- `stitch_student_task_manager/` — Original Google Stitch UI exports

## Prerequisites

- **Node.js** v18+ (tested with v20.18.0)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017/studyflow`) or a **MongoDB Atlas** cluster URI

## 1. Backend Setup

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edit `backend/.env` and provide:
- `MONGODB_URI`: your MongoDB connection string
- `JWT_SECRET`: a long random secret string
- `CORS_ORIGIN`: your frontend URL (default `http://localhost:5173`)

Run the backend:
```powershell
npm run dev
```

Run backend API integration tests (uses `mongodb-memory-server`):
```powershell
npm test
```

## 2. Frontend Setup

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:5173` in your browser, register a student account, and create/manage tasks persisted in MongoDB.
