import { useState, useEffect } from "react";
import { Bell, ShieldAlert, CheckSquare, Trash2, RefreshCw, Terminal } from "lucide-react";

interface NavbarProps {
  unreadCount: number;
  totalCount: number;
  onRefresh: () => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  isRefreshing: boolean;
}

export default function Navbar({
  unreadCount,
  totalCount,
  onRefresh,
  onMarkAllRead,
  onClearAll,
  isRefreshing
}: NavbarProps) {
  const [time, setTime] = useState<string>("");
  const [isLocal, setIsLocal] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (isLocal) {
        setTime(now.toLocaleTimeString("en-US", { hour12: false }));
      } else {
        // Display beautiful UTC formatted time
        setTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocal]);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-emerald-500/10 px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Meta */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400">
              <ShieldAlert className="w-6 h-6 pulse-indicator" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[#05070a]">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-2xl tracking-tight text-white">
                AlertFlow<span className="text-cyan-400">.</span>
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium tracking-wide bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                PRO-SYSTEM
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400/80 tracking-widest uppercase">
              SECURE MONITORING HUB
            </p>
          </div>
        </div>

        {/* Global Live Timestamp & Status */}
        <div className="flex flex-wrap items-center gap-3 justify-center">

          {/* Time tracker */}
          <button 
            id="toggle-time-btn"
            onClick={() => setIsLocal(!isLocal)} 
            className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300 hover:text-emerald-400 hover:border-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            title="Click to toggle UTC / Local Time"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{time || "Initializing Clock..."}</span>
            <span className="text-[9px] text-slate-500">({isLocal ? "Local" : "UTC"})</span>
          </button>
        </div>

        {/* Global Bulk Action Handlers */}
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            id="refresh-feed-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            title="Refresh Notification Feed"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
          </button>

          {/* Mark All Read */}
          <button
            id="mark-all-read-btn"
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            className="px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-emerald-950/20 border border-slate-800 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mark Read</span>
          </button>

          {/* Clear Workspace */}
          <button
            id="clear-workspace-btn"
            onClick={onClearAll}
            disabled={totalCount === 0}
            className="px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-red-950/20 border border-slate-800 hover:border-red-500/30 text-slate-300 hover:text-red-400 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>

      </div>
    </header>
  );
}
