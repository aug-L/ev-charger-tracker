## Context

Currently, the application uses a local PostgreSQL database running in a Docker container for development and testing. For deployment on GCP, it relies on a separately managed Postgres instance (likely Cloud SQL). Moving to Supabase centralizes the database management and simplifies the connection logic by providing a consistent, managed PostgreSQL URL.

## Goals / Non-Goals

**Goals:**
- Migrate data (if any) and schema to Supabase.
- Update application configuration to connect to Supabase.
- Use Supabase's connection pooling to handle Cloud Run's scaling behavior.
- Simplify local development by using a shared remote DB (or a local Supabase CLI, but for now we'll focus on the remote migration).

**Non-Goals:**
- Using Supabase Auth or Storage (currently out of scope).
- Complete rewrite of the persistence layer (we will stick with Drizzle ORM).

## Decisions

### 1. Connection Pooling
We will use Supabase's **Transaction Mode** connection string (typically port 6543) for the GCP Cloud Run deployment. This prevents the "too many connections" error when Cloud Run scales horizontally.

### 2. Environment Variables
Standardize on the `DATABASE_URL` environment variable. For Supabase, this will be the connection string provided in the Supabase dashboard (Project Settings -> Database).

### 3. Migration Tooling
Continue using `drizzle-kit push` for schema updates. In a production-ready Supabase setup, we might later transition to `drizzle-kit generate` and `drizzle-kit migrate`, but for now, we will stick with the current `push` workflow as requested by the user's current setup.

## Risks / Trade-offs

- **Latency**: Moving from a local/regional database to a remote Supabase instance may introduce slight latency, though this is negligible for the current application scope.
- **Dependency**: The application becomes dependent on Supabase's availability.
- **Connection Limits**: Even with pooling, Supabase has connection limits based on the tier. We must monitor this as active sessions increase.
