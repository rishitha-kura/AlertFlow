# AlertFlow — Enterprise Notification Management Platform

**System Type:** Full-Stack Real-Time Notification & Incident Hub  

AlertFlow is a high-performance, glassmorphic dark-themed enterprise SaaS notification dashboard built for DevOps engineering teams. It aggregates incoming infrastructure logs, database replication delays, payment gateway webhooks, and security warning payloads into an interactive command center.

---

## 🎨 Design Philosophy & UI Redesign

AlertFlow is styled to emulate modern security operations centers (SOC):
- **Glassmorphism**: Translucent panels (`backdrop-blur`) paired with deep space background shades (`#090d16`).
- **Accent Scheme**: Emerald (`#10b981`) and Cyan (`#06b6d4`) indicators representing safe state status and network channels.
- **Micro-interactions**: Fluid transitions powered by `motion` on list entries, form dispatches, and stat-card elevations.
- **Responsive Layout**: Desk-first multi-column layout on desktop viewports resizing seamlessly to stacked configurations on mobile viewports.

---

## 🚀 Key Features

1. **Dashboard Sections**:
   - **Live Alert Feed**: Sortable list of alerts with search query capabilities, category markers, and telemetry inspect views.
   - **Alert Analytics**: Instant numeric counters tracking total counts, unread count metrics, active critical warnings, and relative category density.
   - **Activity Timeline**: Running list of actions (alert creation, triage clicks, database purges) logging exactly what occurred and when.
   - **Priority Alerts**: Emergency high-priority desk isolating critical system blockages for immediate action.
   - **Alert Creation Panel**: Custom incident dispatcher form with 1-click test simulation templates (DDoS, DB Deadlock, Card Decline spikes).

2. **Core Capabilities**:
   - Create Alerts manually with diagnostic telemetry payloads.
   - Mark individual messages read/unread.
   - Bulk triage ("Mark all read") and bulk clean slate ("Clear all").
   - Filter workspace indicators instantaneously by choosing nodes (e.g. Security, System) or priorities.
   - Search through active alerts by typing keywords.

---

## 🛠️ Technical Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, motion (React animation framework).
- **Backend**: Node.js, Express.js (serving JSON REST APIs and bundling production routes).
- **Dev-tooling**: Vite, esbuild (for blazing fast standalone CommonJS bundling), tsx.

---

## 🔌 API Documentation

AlertFlow exposes standard, robust RESTful endpoints:

### `GET /api/notifications`
Retrieves the array of active alerts from the in-memory database.

### `POST /api/notifications`
Dispatches a new system incident.
- **Request Body**:
  ```json
  {
    "title": "PostgreSQL Replica Desync",
    "message": "Replication delay exceeded 5000ms threshold.",
    "category": "database",
    "priority": "High",
    "source": "AWS CloudWatch",
    "metadata": { "instance": "replica-3b" }
  }
  ```

### `PATCH /api/notifications/:id`
Partially updates a notification (e.g. toggling triage/read state).
- **Request Body**:
  ```json
  {
    "isRead": true
  }
  ```

### `DELETE /api/notifications/:id`
Purges a notification permanently by its ID.

### `GET /api/activities`
Retrieves the running history log of system events.

### `POST /api/notifications/read-all`
Bulk updates all unread alerts to `isRead: true`.

### `POST /api/notifications/clear-all`
Purges all active notifications to clear the dashboard workspace.

---

## ⚡ Deployment & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Run Development Server
Launches the full-stack app with hot module reloading on port 3000:
```bash
npm run dev
```

### 3. Production Build & Start
Creates highly-optimized frontend static distribution folders and bundles the Express TS server into standard `dist/server.cjs` via `esbuild`:
```bash
npm run build
npm start
```
