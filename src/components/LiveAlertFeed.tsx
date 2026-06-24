import { useState } from "react";
import { Notification, Priority } from "../types";
import { 
  Check, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Terminal, 
  Tag, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  Globe,
  Database,
  Cpu,
  Lock,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LiveAlertFeedProps {
  notifications: Notification[];
  onMarkRead: (id: string, isRead: boolean) => void;
  onDelete: (id: string) => void;
  selectedCategory: string;
  selectedPriority: string;
}

export default function LiveAlertFeed({
  notifications,
  onMarkRead,
  onDelete,
  selectedCategory,
  selectedPriority
}: LiveAlertFeedProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getPriorityClasses = (prio: Priority) => {
    switch (prio) {
      case "Critical":
        return {
          bg: "bg-red-500/10 border-red-500/30 text-red-400",
          glow: "shadow-red-500/5",
          dot: "bg-red-500"
        };
      case "High":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          glow: "shadow-amber-500/5",
          dot: "bg-amber-500"
        };
      case "Medium":
        return {
          bg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
          glow: "shadow-cyan-500/5",
          dot: "bg-cyan-400"
        };
      case "Low":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          glow: "shadow-emerald-500/5",
          dot: "bg-emerald-400"
        };
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "security":
        return <Lock className="w-4 h-4 text-red-400" />;
      case "system":
        return <Cpu className="w-4 h-4 text-amber-400" />;
      case "database":
        return <Database className="w-4 h-4 text-cyan-400" />;
      case "billing":
        return <DollarSign className="w-4 h-4 text-fuchsia-400" />;
      default:
        return <Globe className="w-4 h-4 text-emerald-400" />;
    }
  };

  // Filter & Search logic
  const filteredAlerts = notifications.filter(alert => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === "all" || alert.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPriority = selectedPriority === "all" || alert.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="glass-panel rounded-2xl p-5 border-slate-800/80 space-y-4">
      
      {/* Feed Header and Search Input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-indicator"></span>
            <h3 className="font-display font-bold text-lg text-slate-100">Live Incident Feed</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Showing {filteredAlerts.length} of {notifications.length} active alerts
          </p>
        </div>

        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            id="alert-search-input"
            type="text"
            placeholder="Search alerts by title, source, or text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500/40 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-300 placeholder-slate-600 outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid List with transition animations */}
      <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
              const styles = getPriorityClasses(alert.priority);
              const isExpanded = !!expandedIds[alert.id];
              const alertDate = new Date(alert.timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
              });

              return (
                <motion.div
                  key={alert.id}
                  id={`alert-card-${alert.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  layout
                  className={`group relative overflow-hidden rounded-xl border transition-all ${
                    alert.isRead 
                      ? "bg-slate-950/20 border-slate-900/60 opacity-65 hover:opacity-90" 
                      : `bg-slate-900/40 border-slate-800/80 hover:border-emerald-500/25 shadow-md ${styles.glow}`
                  }`}
                >
                  {/* Left accent bar for unread notifications */}
                  {!alert.isRead && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      alert.priority === 'Critical' ? 'bg-red-500' :
                      alert.priority === 'High' ? 'bg-amber-500' :
                      alert.priority === 'Medium' ? 'bg-cyan-500' : 'bg-emerald-500'
                    }`} />
                  )}

                  <div className="p-4 space-y-3">
                    
                    {/* First row: category, priority, timing */}
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        {/* Category badge */}
                        <div className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono text-[10px] uppercase">
                          {getCategoryIcon(alert.category)}
                          <span>{alert.category}</span>
                        </div>

                        {/* Priority badge */}
                        <div className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold flex items-center gap-1 ${styles.bg}`}>
                          <span className={`w-1 h-1 rounded-full ${styles.dot}`}></span>
                          <span>{alert.priority}</span>
                        </div>
                      </div>

                      {/* Source & Timestamp */}
                      <div className="flex items-center gap-3 text-slate-500 font-mono text-[10px]">
                        <span className="flex items-center gap-1">
                          <Terminal className="w-3.5 h-3.5 text-slate-600" />
                          {alert.source}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-600" />
                          {alertDate}
                        </span>
                      </div>
                    </div>

                    {/* Second row: title and message */}
                    <div className="space-y-1">
                      <h4 className={`font-display text-sm font-semibold tracking-tight transition-all ${
                        alert.isRead ? "text-slate-400 line-through" : "text-slate-100 group-hover:text-emerald-300"
                      }`}>
                        {alert.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-light">
                        {alert.message}
                      </p>
                    </div>

                    {/* Expandable Meta section & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                      {/* Meta toggle */}
                      {alert.metadata && Object.keys(alert.metadata).length > 0 ? (
                        <button
                          id={`expand-meta-btn-${alert.id}`}
                          onClick={() => toggleExpand(alert.id)}
                          className="text-slate-500 hover:text-emerald-400 flex items-center gap-1 transition-all cursor-pointer font-mono text-[10px]"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          <span>{isExpanded ? "Hide Telemetry" : "Show Telemetry"}</span>
                        </button>
                      ) : (
                        <div />
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {/* Toggle Read */}
                        <button
                          id={`mark-read-btn-${alert.id}`}
                          onClick={() => onMarkRead(alert.id, !alert.isRead)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            alert.isRead 
                              ? "bg-slate-950/40 border-slate-900 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/20" 
                              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                          }`}
                          title={alert.isRead ? "Mark Unread" : "Mark Read"}
                        >
                          {alert.isRead ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>

                        {/* Delete Alert */}
                        <button
                          id={`delete-alert-btn-${alert.id}`}
                          onClick={() => onDelete(alert.id)}
                          className="p-1.5 rounded-lg bg-slate-950/40 border border-slate-900 text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
                          title="Purge Incident"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata telemetry pane */}
                    {isExpanded && alert.metadata && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-slate-950/90 border border-slate-900 rounded-lg p-3 text-[11px] font-mono text-slate-400 space-y-1.5 mt-2"
                      >
                        <div className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-bold pb-1 border-b border-slate-900/60 flex items-center gap-1">
                          <Terminal className="w-3 h-3" /> System Diagnostics (Node-Info)
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {Object.entries(alert.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between border-b border-slate-900/30 pb-1">
                              <span className="text-slate-500 capitalize">{key}:</span>
                              <span className="text-cyan-300 font-semibold">{value}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="p-10 border border-dashed border-slate-800 rounded-xl text-center space-y-3">
              <div className="p-3 bg-slate-900/60 text-slate-500 w-fit mx-auto rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No Incidents Found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active notifications match the selected search token or filter priorities. Try resetting filters or adding a simulated alert.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
