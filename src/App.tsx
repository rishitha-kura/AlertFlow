import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import AlertAnalytics from "./components/AlertAnalytics";
import LiveAlertFeed from "./components/LiveAlertFeed";
import PriorityAlerts from "./components/PriorityAlerts";
import ActivityTimeline from "./components/ActivityTimeline";
import AlertCreationPanel from "./components/AlertCreationPanel";
import { Notification, ActivityLog, NotificationStats, Priority } from "./types";
import { ShieldCheck, Info, Loader2, AlertCircle } from "lucide-react";

export default function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Fetch notifications and activities
  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    setErrorMessage(null);

    try {
      // Parallel API dispatching
      const [notifsRes, logsRes] = await Promise.all([
        fetch("/api/notifications"),
        fetch("/api/activities")
      ]);

      if (!notifsRes.ok || !logsRes.ok) {
        throw new Error("Unable to synchronize with AlertFlow backend services");
      }

      const notifsData: Notification[] = await notifsRes.json();
      const logsData: ActivityLog[] = await logsRes.json();

      setNotifications(notifsData);
      setActivityLogs(logsData);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to fetch active alerting states.");
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  // Fetch on mount & configure real-time polling (every 8 seconds to look fully live)
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData(true);
    }, 8000);

    return () => clearInterval(interval);
  }, [fetchData]);

  // Flash messages helper
  const showToast = (msg: string, type: "info" | "error" = "info") => {
    if (type === "error") {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 5000);
    } else {
      setInfoMessage(msg);
      setTimeout(() => setInfoMessage(null), 4000);
    }
  };

  // Create notification
  const handleCreateAlert = async (alertData: {
    title: string;
    message: string;
    category: string;
    priority: Priority;
    source: string;
    metadata?: Record<string, string>;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertData)
      });

      if (!res.ok) {
        throw new Error("Backend failed to accept system incident dispatch request");
      }

      await fetchData(true);
      showToast(`Incident "${alertData.title}" dispatched successfully`);
    } catch (err: any) {
      showToast(err.message || "Failed to dispatch notification.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mark single as read/unread
  const handleMarkRead = async (id: string, isRead: boolean) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead })
      });

      if (!res.ok) {
        throw new Error("Failed to change notification triage status");
      }

      await fetchData(true);
    } catch (err: any) {
      showToast(err.message || "Operation failed", "error");
    }
  };

  // Delete notification
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Failed to purge incident log");
      }

      await fetchData(true);
      showToast("Incident log deleted from database");
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  // Bulk actions
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST"
      });

      if (!res.ok) {
        throw new Error("Bulk mark action failed");
      }

      const data = await res.json();
      await fetchData(true);
      showToast(`Successfully marked ${data.count} alerts as read`);
    } catch (err: any) {
      showToast(err.message || "Bulk triage failed", "error");
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch("/api/notifications/clear-all", {
        method: "POST"
      });

      if (!res.ok) {
        throw new Error("Failed to purge workspace records");
      }

      await fetchData(true);
      showToast("All active notifications purged from the database");
    } catch (err: any) {
      showToast(err.message || "Purge failed", "error");
    }
  };

  // Compute analytics from current state
  const computeStats = (): NotificationStats => {
    const stats: NotificationStats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      read: notifications.filter(n => n.isRead).length,
      criticalCount: notifications.filter(n => n.priority === "Critical" && !n.isRead).length,
      byCategory: {
        system: 0,
        security: 0,
        database: 0,
        billing: 0,
        application: 0
      },
      byPriority: {
        Low: 0,
        Medium: 0,
        High: 0,
        Critical: 0
      }
    };

    notifications.forEach(n => {
      // categories mapping
      const cat = n.category.toLowerCase();
      if (stats.byCategory[cat] !== undefined) {
        stats.byCategory[cat]++;
      } else {
        stats.byCategory[cat] = 1;
      }

      // priorities mapping
      if (stats.byPriority[n.priority] !== undefined) {
        stats.byPriority[n.priority]++;
      }
    });

    return stats;
  };

  const stats = computeStats();

  return (
    <div className="min-h-screen flex bg-[#05070a] text-slate-300 font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-20 bg-[#0a0f18] border-r border-white/5 flex-col items-center py-8 gap-10 shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <nav className="flex flex-col gap-8">
          <div className="p-2 text-emerald-400 bg-emerald-500/10 rounded-lg cursor-pointer" title="Dashboard">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <div className="p-2 text-slate-500 opacity-40 hover:opacity-100 cursor-pointer" title="Alert Alerts">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="p-2 text-slate-500 opacity-40 hover:opacity-100 cursor-pointer" title="Analytics Data">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="p-2 text-slate-500 opacity-40 hover:opacity-100 cursor-pointer" title="System Settings">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
            </svg>
          </div>
        </nav>
        <div className="mt-auto mb-4 w-10 h-10 rounded-full border border-cyan-500/30 overflow-hidden bg-slate-850 flex items-center justify-center" title="Operator Dashboard">
          <span className="text-xs font-bold text-cyan-400">JD</span>
        </div>
      </aside>

      {/* Main Interactive Work Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Brand Navigation Bar */}
        <Navbar
          unreadCount={stats.unread}
          totalCount={stats.total}
          onRefresh={() => fetchData(false)}
          onMarkAllRead={handleMarkAllRead}
          onClearAll={handleClearAll}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6">
          
          {/* Toast / Notification Banner Alerts */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/20 text-red-200 rounded-xl text-xs animate-slideDown">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <div className="flex-1 font-mono">{errorMessage}</div>
              <button onClick={() => setErrorMessage(null)} className="hover:text-red-300 font-bold px-1.5 py-0.5 rounded cursor-pointer">✕</button>
            </div>
          )}

          {infoMessage && (
            <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-200 rounded-xl text-xs animate-slideDown">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex-1 font-mono">{infoMessage}</div>
              <button onClick={() => setInfoMessage(null)} className="hover:text-emerald-300 font-bold px-1.5 py-0.5 rounded cursor-pointer">✕</button>
            </div>
          )}

          {/* Global Loader Indicator when syncing on startup */}
          {isRefreshing && notifications.length === 0 && (
            <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-sm text-slate-400 font-mono">Synchronizing AlertFlow Console State...</p>
            </div>
          )}

          {/* Main Dashboard Layout (3-Column Bento on desktop/large, stacked on mobile) */}
          {(!isRefreshing || notifications.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* COLUMN 1: LEFT SIDEBAR (Analytics, Core Category Filters) -> takes 4 spans */}
              <div className="lg:col-span-4 space-y-6">
                <AlertAnalytics
                  stats={stats}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedPriority={selectedPriority}
                  setSelectedPriority={setSelectedPriority}
                />

                <div className="hidden lg:block">
                  <ActivityTimeline logs={activityLogs} />
                </div>
              </div>

              {/* COLUMN 2: CENTER WORKSPACE (Live Feed list) -> takes 5 spans */}
              <div className="lg:col-span-5 space-y-6">
                <LiveAlertFeed
                  notifications={notifications}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                  selectedCategory={selectedCategory}
                  selectedPriority={selectedPriority}
                />

                <div className="lg:hidden">
                  <ActivityTimeline logs={activityLogs} />
                </div>
              </div>

              {/* COLUMN 3: RIGHT PANEL (Dispatch Dispatcher form & Red Alert desk) -> takes 3 spans */}
              <div className="lg:col-span-3 space-y-6">
                <PriorityAlerts
                  notifications={notifications}
                  onMarkRead={handleMarkRead}
                />

                <AlertCreationPanel
                  onCreateAlert={handleCreateAlert}
                  isSubmitting={isSubmitting}
                />
              </div>

            </div>
          )}

        </main>

        {/* Modern minimal footer */}
        <footer className="mt-auto border-t border-slate-900 pt-6 pb-6 text-center text-[11px] font-mono text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              &copy; 2026 AlertFlow. Enterprise Notification & Incident Control Plane.
            </div>
            <div className="flex items-center gap-3">
              <span>Terminal Token: <span className="text-slate-400">active_auth_secure</span></span>
              <span className="text-emerald-500/80">● Cluster Online</span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
