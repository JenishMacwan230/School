# School Platform Workspace

## Backend (server)
- Install dependencies with `pnpm install` inside `server/`.
- Required environment variables:
	- `PORT`
	- `JWT_SECRET`
	- `ADMIN_EMAIL`
	- `ADMIN_PASSWORD_HASH`
	- `MONGODB_URI` (connection string, replaces the previous Postgres settings)
	- `DB_NAME` (optional override if the URI does not include a database name)
	- Cloudinary keys used by the upload endpoints

### Verifying the database connection
- `GET /api/health` confirms the service is alive.
- `GET /api/test-db` now checks MongoDB status and user count.

All dynamic data (trustees, campus sections, teachers, etc.) now lives in MongoDB collections defined under `server/src/models`.
