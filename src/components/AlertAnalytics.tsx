import { NotificationStats, Priority } from "../types";
import { AlertCircle, Layers, ShieldCheck, Flame, PieChart, Activity } from "lucide-react";
import { motion } from "motion/react";

interface AlertAnalyticsProps {
  stats: NotificationStats;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
}

export default function AlertAnalytics({
  stats,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority
}: AlertAnalyticsProps) {
  
  // Calculate unread percentages for progress dials
  const unreadPercentage = stats.total > 0 ? Math.round((stats.unread / stats.total) * 100) : 0;
  const criticalPercentage = stats.total > 0 ? Math.round((stats.criticalCount / stats.total) * 100) : 0;

  const categories = ["all", "system", "security", "database", "billing", "application"];
  const priorities = ["all", "Low", "Medium", "High", "Critical"];

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "security": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "system": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "database": return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "billing": return "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20";
      case "application": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case "Critical": return "text-red-400 bg-red-950/30 border-red-500/30";
      case "High": return "text-amber-400 bg-amber-950/30 border-amber-500/30";
      case "Medium": return "text-cyan-400 bg-cyan-950/30 border-cyan-500/30";
      case "Low": return "text-emerald-400 bg-emerald-950/30 border-emerald-500/30";
      default: return "text-slate-400 bg-slate-900/60 border-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric Card 1: Total Alerts */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-2xl glass-panel-emerald p-4 flex flex-col justify-between"
          id="stat-card-total"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full filter blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Alerts</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-slate-100 glow-emerald tracking-tight">
              {stats.total}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Active indices recorded</p>
          </div>
        </motion.div>

        {/* Metric Card 2: Unread Alerts */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-2xl glass-panel-cyan p-4 flex flex-col justify-between"
          id="stat-card-unread"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full filter blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Unread</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-slate-100 glow-cyan tracking-tight">
              {stats.unread}
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-cyan-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${unreadPercentage}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-slate-400 mt-1">{unreadPercentage}% pending triage</p>
          </div>
        </motion.div>

        {/* Metric Card 3: Critical alerts */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-2xl glass-panel p-4 flex flex-col justify-between border-red-500/10"
          id="stat-card-critical"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-transparent rounded-full filter blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Critical Threat</span>
            <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-slate-100 tracking-tight">
              {stats.criticalCount}
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-red-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${criticalPercentage}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-red-400/80 mt-1 font-mono">{stats.criticalCount} emergency triggers</p>
          </div>
        </motion.div>

        {/* Metric Card 4: Action Rate */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-2xl glass-panel p-4 flex flex-col justify-between border-emerald-500/15"
          id="stat-card-read"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full filter blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-medium">Triage Rate</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-slate-100 tracking-tight">
              {stats.total > 0 ? Math.round((stats.read / stats.total) * 100) : 0}%
            </div>
            <p className="text-[10px] text-slate-500 mt-1">{stats.read} cleared alerts</p>
          </div>
        </motion.div>
      </div>

      {/* Category Breakdown & Filter HUD */}
      <div className="glass-panel rounded-2xl p-5 border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <PieChart className="w-4 h-4 text-emerald-400" />
          <h3 className="font-display font-medium text-sm text-slate-200 uppercase tracking-wider">
            Interactive Filter & System Scope
          </h3>
        </div>

        {/* Category filtering pills */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wide block">
            Filter by Node Category ({stats.total} alerts total)
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = cat === "all" ? stats.total : (stats.byCategory[cat] || 0);
              return (
                <button
                  key={cat}
                  id={`cat-filter-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10 font-bold"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    cat === 'all' ? 'bg-slate-400' : 
                    cat === 'security' ? 'bg-red-400' :
                    cat === 'system' ? 'bg-amber-400' :
                    cat === 'database' ? 'bg-cyan-400' :
                    cat === 'billing' ? 'bg-fuchsia-400' :
                    'bg-emerald-400'
                  }`} />
                  <span className="capitalize">{cat}</span>
                  <span className="px-1 py-0.2 text-[9px] rounded-md bg-slate-950 font-mono text-slate-400">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority filtering badges */}
        <div className="space-y-2 pt-2">
          <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wide block">
            Filter by Incident Priority
          </label>
          <div className="flex flex-wrap gap-2">
            {priorities.map((prio) => {
              const isActive = selectedPriority === prio;
              const count = prio === "all" ? stats.total : (stats.byPriority[prio as Priority] || 0);
              const colorClass = getPriorityColor(prio);
              return (
                <button
                  key={prio}
                  id={`prio-filter-${prio}`}
                  onClick={() => setSelectedPriority(prio)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10 font-bold"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="capitalize">{prio}</span>
                  <span className="px-1.5 py-0.2 text-[9px] rounded bg-slate-950 font-mono text-slate-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Radial category breakdown linear indicators */}
        <div className="pt-3 space-y-2 border-t border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Live Node Index Density</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(stats.byCategory).map(([cat, val]) => {
              const percent = stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;
              const colorClass = getCategoryColor(cat);
              return (
                <div key={cat} className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/40 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize font-medium text-slate-300 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        cat === 'security' ? 'bg-red-400' :
                        cat === 'system' ? 'bg-amber-400' :
                        cat === 'database' ? 'bg-cyan-400' :
                        cat === 'billing' ? 'bg-fuchsia-400' : 'bg-emerald-400'
                      }`} />
                      {cat}
                    </span>
                    <span className="font-mono text-slate-400">{val} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        cat === 'security' ? 'bg-red-500' :
                        cat === 'system' ? 'bg-amber-500' :
                        cat === 'database' ? 'bg-cyan-500' :
                        cat === 'billing' ? 'bg-fuchsia-500' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
