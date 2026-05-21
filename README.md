# Team Task Manager (Full Stack)

A complete MERN Team Task Manager with JWT authentication, role-based access, project management, task assignment, dashboard analytics, responsive React UI, and Railway deployment configuration.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router DOM, Context API, React Toastify, Lucide React
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- Security: Helmet, CORS, rate limiting, input validation, ObjectId validation, RBAC
- Deployment: Railway-ready root build/start scripts

## Project Structure

```txt
team-task-manager-full-stack/
  client/
    src/
      components/
      context/
      hooks/
      layouts/
      pages/
      services/
      utils/
  server/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    validations/
```

## Setup In VS Code

```bash
cd team-task-manager-full-stack
npm install
npm run install:all
```

Create environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

Update `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/team_task_manager
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Update `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the full app:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/health`

## MongoDB Setup

Local MongoDB:

1. Install MongoDB Community Server.
2. Start MongoDB locally.
3. Use `mongodb://127.0.0.1:27017/team_task_manager` as `MONGO_URI`.

MongoDB Atlas:

1. Create an Atlas cluster.
2. Create a database user.
3. Allow your IP address or Railway outbound access.
4. Copy the connection string into `server/.env` as `MONGO_URI`.

## Seed Dummy Data

After configuring `server/.env`, run:

```bash
npm run seed
```

Seed accounts:

- Admin: `admin@example.com` / `Admin@12345`
- Member: `member@example.com` / `Member@12345`

## API Testing Guide

Use Postman, Insomnia, or curl. Protected routes require:

```txt
Authorization: Bearer YOUR_JWT_TOKEN
```

Core endpoints:

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
GET    /api/users
GET    /api/dashboard/stats
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Example login body:

```json
{
  "email": "admin@example.com",
  "password": "Admin@12345"
}
```

## GitHub Push Steps

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Railway Deployment

1. Push the repository to GitHub.
2. Create a new Railway project from the GitHub repo.
3. Add a MongoDB database:

- Option A: Add Railway's MongoDB service to the same project, then reference its connection string in your web service variables.
- Option B: Use MongoDB Atlas and paste the Atlas connection string.

4. Add these environment variables to the Railway web service:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=https://your-railway-app.up.railway.app
NODE_ENV=production
```

The backend accepts any one of these MongoDB variable names: `MONGO_URI`, `MONGODB_URI`, `MONGO_URL`, or `DATABASE_URL`.

If Railway provides a MongoDB variable such as `MONGO_URL`, either keep that name or create:

```env
MONGO_URI=${{MongoDB.MONGO_URL}}
```

5. Railway will run `npm run build` and `npm start` from the root.
6. The Express server serves the built React app from `client/dist` in production.

### Fix For `MONGO_URI is required`

That error means the Railway web service has no MongoDB connection string. Open the Railway project, select the deployed web service, go to **Variables**, and add one MongoDB connection string variable. The easiest setup is:

```env
MONGO_URI=mongodb+srv://USER:PASSWORD@HOST/team_task_manager?retryWrites=true&w=majority
JWT_SECRET=a_long_random_secret_at_least_32_characters
CLIENT_URL=https://your-railway-app.up.railway.app
NODE_ENV=production
```

Redeploy after saving variables.

## Production Notes

- Use a strong `JWT_SECRET` of at least 32 characters.
- Keep `.env` files out of Git.
- Set `CLIENT_URL` to your deployed frontend URL.
- Use MongoDB Atlas for Railway deployment.
