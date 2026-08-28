# TeleMed Platform

A practical telemedicine monorepo: an Express/MongoDB REST API and a Vite React client for staff to manage patients, appointments, and medical records.

## Quick start

1. Install Node.js 18+ and MongoDB (local or Atlas).
2. Copy `.env.example` to `server/.env`, set a strong `JWT_SECRET` and `MONGODB_URI`.
3. (Optional) Copy `client/.env.example` to `client/.env` and set `VITE_API_URL` for a non-local API.
4. Run `npm install`, then `npm run dev`.
5. Open http://localhost:5173. The first user can be created through `POST /api/auth/register` (or use the registration form in the login screen).

The API runs on port 4000. `npm run build` creates a production client build and `npm test` runs API tests. Never commit `.env` or credentials. Set an optional `ADMIN_INVITE_CODE` to allow a trusted registration request containing that code to create an admin; otherwise all public registrations are staff.

## API

`POST /api/auth/register`, `POST /api/auth/login`, and `GET /api/auth/me` provide JWT authentication. Protected CRUD endpoints are available at `/api/patients`, `/api/appointments`, and `/api/records`; send `Authorization: Bearer <token>`. Admin-only deletion is enforced for patients and records. `GET /api/health` is public.

## Production deployment

The repository includes deployment configuration for Render and Vercel:

1. Create a MongoDB Atlas cluster and copy its connection string.
2. In Render, create a Blueprint from this repository. The included `render.yaml`
   deploys the API from `server/`. Set `MONGODB_URI` to the Atlas connection
   string and set `CLIENT_ORIGIN` after the frontend is deployed.
3. In Vercel, import this repository and set the project root directory to
   `client`. Set `VITE_API_URL` to the deployed Render URL plus `/api`, for
   example `https://telemed-api.onrender.com/api`.
4. Copy the resulting Vercel URL into Render's `CLIENT_ORIGIN` environment
   variable and redeploy the API.

Vercel uses `client/vercel.json` so React Router routes work on refresh. Keep all
provider secrets in their environment-variable dashboards; never commit `.env`
files or database credentials.
