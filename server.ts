import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Define TypeScript types inline or import them (importing works with tsx)
import { Notification, ActivityLog, Priority } from "./src/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Database
let notifications: Notification[] = [
  {
    id: "alert-1",
    title: "Kubernetes Pod Crash Loop Detected",
    message: "Deployment 'payment-gateway' failed healthchecks. Pod replica 'pay-gw-bf82' restarted 5 times in 10 minutes.",
    category: "system",
    priority: "Critical",
    isRead: false,
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10m ago
    source: "Kubernetes Agent",
    metadata: { cluster: "gke-us-central1", namespace: "production", pod: "pay-gw-bf82" }
  },
  {
    id: "alert-2",
    title: "SQL Injection Vulnerability Flagged",
    message: "Web Application Firewall (WAF) blocked a SQL injection attempt on endpoint /api/users/profile from IP 198.51.100.42.",
    category: "security",
    priority: "High",
    isRead: false,
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45m ago
    source: "WAF Monitor",
    metadata: { ruleId: "OWASP-SQLi-942100", ip: "198.51.100.42", country: "Unknown" }
  },
  {
    id: "alert-3",
    title: "DB Read Replica Replication Lag",
    message: "Replication lag on PostgreSQL read-replica-02 exceeded threshold of 5000ms. Current lag: 12,450ms.",
    category: "database",
    priority: "High",
    isRead: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    source: "Datadog Agent",
    metadata: { dbInstance: "rds-pg-replica-2", currentLag: "12.4s" }
  },
  {
    id: "alert-4",
    title: "Stripe Webhook Verification Failed",
    message: "Subscription renewal webhook from stripe failed cryptographic signature check. Verify webhook endpoint secret.",
    category: "billing",
    priority: "Medium",
    isRead: false,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
    source: "Stripe Handler",
    metadata: { eventId: "evt_3N87sFLk", apiVersion: "2023-10-16" }
  },
  {
    id: "alert-5",
    title: "Production Deployment Successful",
    message: "GitHub Actions workflow 'Build and Deploy' succeeded. Version v3.4.1 deployed to Cloud Run.",
    category: "application",
    priority: "Low",
    isRead: true,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8h ago
    source: "GitHub Actions",
    metadata: { runId: "98712310", commit: "a8e2f10b" }
  },
  {
    id: "alert-6",
    title: "SSL Certificate Expiration Warning",
    message: "SSL Certificate for '*.api.alertflow.io' will expire in 14 days. Auto-renew action pending.",
    category: "security",
    priority: "Medium",
    isRead: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24h ago
    source: "Let's Encrypt Bot",
    metadata: { domain: "api.alertflow.io", expiry: "2026-07-08" }
  }
];

let activityLogs: ActivityLog[] = [
  {
    id: "log-1",
    action: "create",
    details: "Critical Alert triggered automatically by Kubernetes Monitor",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    notificationTitle: "Kubernetes Pod Crash Loop Detected",
    priority: "Critical"
  },
  {
    id: "log-2",
    action: "create",
    details: "High Security threat flagged and blocked by Cloud Armor WAF",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    notificationTitle: "SQL Injection Vulnerability Flagged",
    priority: "High"
  },
  {
    id: "log-3",
    action: "create",
    details: "Database replica delay monitor spawned alert",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    notificationTitle: "DB Read Replica Replication Lag",
    priority: "High"
  },
  {
    id: "log-4",
    action: "read",
    details: "Alert marked as read by Operator system console",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    notificationTitle: "DB Read Replica Replication Lag"
  },
  {
    id: "log-5",
    action: "create",
    details: "Billing webhook error recorded",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    notificationTitle: "Stripe Webhook Verification Failed",
    priority: "Medium"
  }
];

// UTILITY TO ADD ACTIVITIES
const logActivity = (action: ActivityLog['action'], details: string, notificationTitle?: string, priority?: Priority) => {
  const newLog: ActivityLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    action,
    details,
    timestamp: new Date().toISOString(),
    notificationTitle,
    priority
  };
  activityLogs.unshift(newLog);
  // Keep logs at max 100 entries
  if (activityLogs.length > 100) {
    activityLogs = activityLogs.slice(0, 100);
  }
};

// API Endpoints

// GET all notifications
app.get("/api/notifications", (req, res) => {
  res.json(notifications);
});

// GET activity logs
app.get("/api/activities", (req, res) => {
  res.json(activityLogs);
});

// POST new notification
app.post("/api/notifications", (req, res) => {
  const { title, message, category, priority, source, metadata } = req.body;

  if (!title || !message || !category || !priority) {
    return res.status(400).json({ error: "Missing required fields: title, message, category, priority" });
  }

  const newAlert: Notification = {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title,
    message,
    category,
    priority: priority as Priority,
    isRead: false,
    timestamp: new Date().toISOString(),
    source: source || "Manual Admin Console",
    metadata: metadata || {}
  };

  notifications.unshift(newAlert);
  
  // Log activity
  logActivity("create", `New ${priority} alert created in category '${category}'`, title, priority);

  res.status(201).json(newAlert);
});

// PATCH partial update (e.g., toggle isRead or mark read)
app.patch("/api/notifications/:id", (req, res) => {
  const { id } = req.params;
  const { isRead } = req.body;

  const alertIndex = notifications.findIndex(n => n.id === id);
  if (alertIndex === -1) {
    return res.status(404).json({ error: "Notification not found" });
  }

  const alert = notifications[alertIndex];
  
  if (isRead !== undefined) {
    const oldVal = alert.isRead;
    alert.isRead = isRead;
    if (oldVal !== isRead) {
      logActivity(
        isRead ? "read" : "unread",
        `Alert marked as ${isRead ? "read" : "unread"}`,
        alert.title
      );
    }
  }

  res.json(alert);
});

// POST action: mark all as read
app.post("/api/notifications/read-all", (req, res) => {
  let count = 0;
  notifications = notifications.map(n => {
    if (!n.isRead) {
      count++;
      return { ...n, isRead: true };
    }
    return n;
  });

  if (count > 0) {
    logActivity("read_all", `Bulk marked ${count} notifications as read`);
  }
  res.json({ success: true, count });
});

// POST action: clear all notifications
app.post("/api/notifications/clear-all", (req, res) => {
  const count = notifications.length;
  notifications = [];
  logActivity("clear_all", `Purged all ${count} notifications from active workspace`);
  res.json({ success: true, count });
});

// DELETE single notification
app.delete("/api/notifications/:id", (req, res) => {
  const { id } = req.params;
  const alertIndex = notifications.findIndex(n => n.id === id);
  
  if (alertIndex === -1) {
    return res.status(404).json({ error: "Notification not found" });
  }

  const alert = notifications[alertIndex];
  notifications.splice(alertIndex, 1);

  logActivity("delete", `Removed notification from database`, alert.title, alert.priority);

  res.json({ success: true, deletedId: id });
});

// Start server and handle environment build setups
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server loaded as Express middleware");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static distribution ready at dist/");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AlertFlow server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to bootstrap AlertFlow server", err);
});
