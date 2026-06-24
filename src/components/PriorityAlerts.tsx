import { Notification, Priority } from "../types";
import { ShieldAlert, Flame, CheckCircle2, Siren, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface PriorityAlertsProps {
  notifications: Notification[];
  onMarkRead: (id: string, isRead: boolean) => void;
}

export default function PriorityAlerts({ notifications, onMarkRead }: PriorityAlertsProps) {
  
  // Filter for unread High or Critical alerts
  const priorityAlerts = notifications.filter(
    n => !n.isRead && (n.priority === "Critical" || n.priority === "High")
  );

  return (
    <div className="glass-panel rounded-2xl p-5 border-slate-800/80 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Siren className="w-4 h-4 text-red-500 animate-pulse" />
          <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider">
            Critical Red Alert Desk
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-mono text-red-400 font-bold">
          {priorityAlerts.length} Active Threat{priorityAlerts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Critical Items Stack */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {priorityAlerts.length > 0 ? (
          priorityAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              whileHover={{ scale: 1.01 }}
              className={`p-3.5 rounded-xl border flex gap-3 justify-between items-start transition-all ${
                alert.priority === "Critical"
                  ? "bg-red-950/20 border-red-500/30 text-red-200"
                  : "bg-amber-950/15 border-amber-500/20 text-amber-200"
              }`}
            >
              {/* Flame/Alert Icon badge */}
              <div className={`p-2 rounded-lg shrink-0 ${
                alert.priority === "Critical" 
                  ? "bg-red-500/20 text-red-400" 
                  : "bg-amber-500/20 text-amber-400"
              }`}>
                {alert.priority === "Critical" ? <Flame className="w-4 h-4 text-red-500 animate-bounce" /> : <ShieldAlert className="w-4 h-4" />}
              </div>

              {/* Title & Message */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    alert.priority === "Critical" ? "bg-red-500 text-white" : "bg-amber-500 text-slate-950"
                  }`}>
                    {alert.priority}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{alert.category}</span>
                </div>
                <h4 className="font-display font-bold text-xs truncate text-slate-100">
                  {alert.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {alert.message}
                </p>
              </div>

              {/* Quick action triage checkbox check */}
              <button
                id={`quick-resolve-btn-${alert.id}`}
                onClick={() => onMarkRead(alert.id, true)}
                className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer group flex items-center gap-1"
                title="Mark Resolved"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" />
              </button>

            </motion.div>
          ))
        ) : (
          <div className="py-10 text-center rounded-xl bg-slate-900/10 border border-dashed border-slate-800/60 flex flex-col items-center justify-center space-y-2 text-xs text-slate-500">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-pulse" />
            <p className="font-semibold text-slate-300">Workspace Clear</p>
            <p className="text-[11px] text-slate-500">All high-priority logs have been addressed and filed.</p>
          </div>
        )}
      </div>

    </div>
  );
}
