## ADDED Requirements

### Requirement: session-creation
The system shall allow users to create new charging sessions by providing a `chargerId`.

#### Scenario: successfully-create-session
- **WHEN** a POST request is made to `/api/sessions` with `{ "chargerId": "CH-001" }`
- **THEN** a new session record is created in the database with status `idle` and `energyKwh` 0, and the session object is returned.

### Requirement: session-start
The system shall allow starting an idle session.

#### Scenario: successfully-start-session
- **WHEN** a POST request is made to `/api/sessions/:id/start` for an `idle` session
- **THEN** the session status is updated to `charging`, and `startTime` is recorded.

### Requirement: session-stop
The system shall allow stopping a charging session.

#### Scenario: successfully-stop-session
- **WHEN** a POST request is made to `/api/sessions/:id/stop` for a `charging` session
- **THEN** the session status is updated to `finished`, `endTime` is recorded, and the total cost is calculated.
