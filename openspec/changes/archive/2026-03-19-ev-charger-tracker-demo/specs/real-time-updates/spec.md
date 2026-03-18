## ADDED Requirements

### Requirement: progress-updates
The system shall broadcast energy accumulation updates for active charging sessions every 3-5 seconds.

#### Scenario: broadcast-energy-update
- **WHEN** the simulator increments the `energyKwh` for an active session
- **THEN** an `energy-update` event is emitted via Socket.io to all clients in the `dashboard` room.

### Requirement: status-updates
The system shall broadcast session status changes.

#### Scenario: broadcast-session-updated
- **WHEN** a session moves from `idle` to `charging` or `charging` to `finished`
- **THEN** a `session-updated` event is emitted via Socket.io.

### Requirement: dashboard-summary
The system shall broadcast global stats for the dashboard.

#### Scenario: broadcast-dashboard-stats
- **WHEN** the simulator runs an update cycle
- **THEN** a `dashboard-stats` event containing `activeCount` and `totalKwh` is emitted.
