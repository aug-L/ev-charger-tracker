## 1. Environment Configuration

- [x] 1.1 Update root `.env` with the Supabase `DATABASE_URL` (Transaction mode, port 6543).
- [ ] 1.2 Update GCP Cloud Run service with the new `DATABASE_URL`.

## 2. Infrastructure Cleanup

- [x] 2.1 Remove the `db` service from `docker-compose.yml`.
- [x] 2.2 Remove the `postgres_data` volume from `docker-compose.yml`.

## 3. Database Initialization

- [ ] 3.1 Run `npm run db:push` from the `backend` directory to initialize the Supabase schema.
- [ ] 3.2 Verify the `sessions` table exists in the Supabase dashboard.

## 4. Verification

- [ ] 4.1 Start the backend locally and verify the `/api/health` endpoint returns `connected`.
- [ ] 4.2 Verify that charger simulation and session REST APIs work with the remote database.
