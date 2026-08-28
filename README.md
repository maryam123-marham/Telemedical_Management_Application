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

## Production

Build the client with `npm run build`, serve `client/dist` from a static host, and deploy the server with `npm start --workspace server`. Set `CLIENT_ORIGIN` to the deployed frontend URL and use a managed MongoDB instance.
