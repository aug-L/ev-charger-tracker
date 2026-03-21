## ADDED Requirements

### Requirement: Remote Database Persistence
The application must persist data to a remote Supabase PostgreSQL instance instead of a local container. This ensures data consistency across dispersed deployment environments (e.g., local development vs. GCP Cloud Run).

#### Scenario: Production Deployment
- **WHEN** the application is deployed to GCP Cloud Run
- **THEN** it must use the Supabase connection string with pooling (port 6543) to ensure stable connections under scale.

#### Scenario: Local Development
- **WHEN** the application is run locally via npm or Docker Compose
- **THEN** it should prioritize the Supabase connection string defined in the root `.env` file, enabling shared state between developers if desired.
