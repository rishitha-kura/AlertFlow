import { ActivityLog } from "../types";
import { Clock, Activity, AlertCircle, Plus, Eye, Trash2, Shield } from "lucide-react";
import { motion } from "motion/react";

interface ActivityTimelineProps {
  logs: ActivityLog[];
}

export default function ActivityTimeline({ logs }: ActivityTimelineProps) {
  
  const getActionStyles = (action: ActivityLog['action']) => {
    switch (action) {
      case "create":
        return {
          icon: <Plus className="w-3 h-3" />,
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          bead: "bg-emerald-400"
        };
      case "read":
      case "read_all":
        return {
          icon: <Eye className="w-3 h-3" />,
          color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          bead: "bg-cyan-400"
        };
      case "delete":
      case "clear_all":
        return {
          icon: <Trash2 className="w-3 h-3" />,
          color: "bg-red-500/10 text-red-400 border-red-500/20",
          bead: "bg-red-500"
        };
      default:
        return {
          icon: <Activity className="w-3 h-3" />,
          color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
          bead: "bg-slate-400"
        };
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border-slate-800/80 space-y-4">
      
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
        <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider">
          System Activity Log
        </h3>
      </div>

      {/* Timeline entries */}
      <div className="relative pl-4 space-y-5 max-h-[380px] overflow-y-auto pt-2">
        {/* Vertical line runner */}
        <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-slate-900"></div>

        {logs.length > 0 ? (
          logs.slice(0, 15).map((log, index) => {
            const styles = getActionStyles(log.action);
            const timeStr = new Date(log.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            });

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.4) }}
                className="relative flex items-start gap-3 text-xs"
              >
                {/* Timeline dot bead */}
                <div className="absolute -left-[13px] top-1.5 flex items-center justify-center">
                  <span className={`w-2.5 h-2.5 rounded-full ring-4 ring-[#090d16] ${styles.bead}`} />
                </div>

                {/* Left side action code icon */}
                <div className={`p-1 rounded-md border shrink-0 ${styles.color}`}>
                  {styles.icon}
                </div>

                {/* Right side body text */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-slate-500">{timeStr}</span>
                    {log.priority && (
                      <span className={`px-1 rounded text-[8px] font-mono font-semibold ${
                        log.priority === 'Critical' ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {log.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 font-light truncate" title={log.details}>
                    {log.details}
                  </p>
                  {log.notificationTitle && (
                    <div className="text-[10px] text-slate-500 font-mono italic truncate">
                      Ref: "{log.notificationTitle}"
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-slate-600">
            No system log events on this server instance.
          </div>
        )}
      </div>

    </div>
  );
}
