# EV Charger Tracker

A minimal full-stack real-time EV Charging Session Tracker.

## Architecture

- **Frontend**: Vue.js 3 (Vite, Tailwind CSS, Lucide icons)
- **Backend**: Node.js 20+ (Express, Socket.io)
- **Database**: PostgreSQL (Drizzle ORM)
- **Real-time**: Socket.io for live energy updates and dashboard stats.
- **Simulation**: In-memory simulator that increments energy for active sessions every 4 seconds.

## Tech Stack Overview

- **Real-time flows**: Socket.io broadcasts `energy-update` and `dashboard-stats` events.
- **Database**: Drizzle ORM provides type-safe SQL queries and easy migrations.
- **UI/UX**: Premium dark-mode dashboard with real-time progress bars and micro-animations.

## How to Run Locally

### Using Docker Compose (Recommended)

1. Ensure you have Docker and Docker Compose (v2+) installed.
2. Clone the repository and navigate to the project root.
3. Run:
   ```bash
   docker compose up --build -d
   ```
   or
   ```bash
   docker compose up --build
   ```
4. **Note**: If running for the first time, you may need to initialize the database schema from your host:
   ```bash
   cd backend && npm run db:push
   ```
5. Open [http://localhost:8080](http://localhost:8080) in your browser.

### Manual Setup (For Development)

1. **Database**: Spin up a Postgres instance.
2. **Environment**: Update `.env` with your `DATABASE_URL`.
3. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
4. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) (Vite dev server with proxy to 8080).

## API Endpoints

- `GET /api/sessions`: List all sessions.
- `POST /api/sessions`: Create a new session.
- `POST /api/sessions/:id/start`: Start charging.
- `POST /api/sessions/:id/stop`: Stop charging and calculate cost.
