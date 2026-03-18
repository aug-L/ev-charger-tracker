## Why

The goal is to demonstrate a full-stack real-time application using a modern tech stack (Node.js/Express, Socket.io, Vue.js, PostgreSQL/Drizzle ORM). This MVP focuses on the core lifecycle of EV charging sessions and live updates, providing a practical example of async flows, real-time communication, and database integration.

## What Changes

We will build a complete web application consisting of:
- A Node.js/Express backend with Socket.io for real-time broadcasts.
- A PostgreSQL database managed via Drizzle ORM.
- A Vue.js 3 frontend using the Composition API and Vite.
- A simulated charger environment that updates session data in real-time.
- Docker configuration for local development and deployment.

## Capabilities

### New Capabilities
- `session-management`: REST API for listing, creating, starting, and stopping charging sessions.
- `real-time-updates`: Socket.io integration for broadcasting session progress and dashboard stats.
- `dashboard-ui`: Live dashboard for monitoring active sessions and controlling chargers.
- `charger-simulation`: Logic to simulate energy accumulation for active sessions every few seconds.

### Modified Capabilities
- None

## Impact

- **Backend**: New Express server with Socket.io, Drizzle models for sessions, and a simulation controller.
- **Frontend**: New Vue.js app with real-time state management.
- **Infrastructure**: New Dockerfile and docker-compose.yml for local Postgres and app deployment.
- **API**: New endpoints under `/api/sessions`.
