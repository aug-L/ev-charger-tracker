## Why

The current local Postgres setup is difficult to manage across different environments (local vs. GCP) and requires manual maintenance. Migrating to Supabase provides a managed database service that simplifies deployment, ensures high availability, and offers a robust platform for future scalability.

## What Changes

- Transition the database persistence layer from a local Docker container (`db` service in `docker-compose.yml`) to a remote Supabase instance.
- Update all backend connection logic to use the Supabase PostgreSQL connection string.
- Update environment variable configurations across local and production (GCP) environments.
- Maintain existing schema and Drizzle ORM usage.

## Capabilities

### New Capabilities
- `remote-database-persistence`: Managed PostgreSQL persistence via Supabase.

### Modified Capabilities
- `persistence`: No functional changes to the requirement, but the underlying provider changes.

## Impact

- **Backend Code**: `src/db/index.js` and `drizzle.config.js` remain largely the same but rely on the new `DATABASE_URL`.
- **Infrastructure**: Remove local PostgreSQL service from `docker-compose.yml` (optional, for cleanup).
- **Environment**: All deployments must use the Supabase connection string.
