import { useState, FormEvent } from "react";
import { Priority } from "../types";
import { PlusCircle, Play, ShieldAlert, Sparkles, Terminal } from "lucide-react";

interface AlertCreationPanelProps {
  onCreateAlert: (alertData: {
    title: string;
    message: string;
    category: string;
    priority: Priority;
    source: string;
    metadata?: Record<string, string>;
  }) => void;
  isSubmitting: boolean;
}

export default function AlertCreationPanel({ onCreateAlert, isSubmitting }: AlertCreationPanelProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("system");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [source, setSource] = useState("Manual Console");
  const [customKey, setCustomKey] = useState("");
  const [customVal, setCustomVal] = useState("");

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const metadata: Record<string, string> = {};
    if (customKey.trim() && customVal.trim()) {
      metadata[customKey.trim().toLowerCase()] = customVal.trim();
    }

    onCreateAlert({
      title: title.trim(),
      message: message.trim(),
      category,
      priority,
      source: source.trim() || "Manual Console",
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined
    });

    // Reset Form fields
    setTitle("");
    setMessage("");
    setCustomKey("");
    setCustomVal("");
  };

  // Templates for instant testing
  const templates = [
    {
      name: "🔥 DDoS Attack",
      title: "Incoming High-Volume Layer-7 DDoS Spike",
      message: "API Gateway receiving 150,000 requests/sec from decentralized botnet. Originating country clusters: EU-West.",
      category: "security",
      priority: "Critical" as Priority,
      source: "Cloudflare Ingress Shield",
      metadata: { attackVolume: "150k rps", mitigationStatus: "Throttling Active", shieldRule: "Rule_9011_Global" }
    },
    {
      name: "💾 DB Deadlock",
      title: "PostgreSQL Database Deadlock on main.orders",
      message: "Transaction rollbacks elevated. Multiple locks detected on table public.orders during batch transaction ingestion.",
      category: "database",
      priority: "High" as Priority,
      source: "pg_stat_activity Monitor",
      metadata: { transactionId: "tx_0x98f2", locksCount: "14 deadlock chains" }
    },
    {
      name: "💳 Card Declines",
      title: "Abnormal Billing Gateway Declines Spike",
      message: "Payment processor Stripe reported card declines increased by 400% on checkout-form-v3 in the past 5 minutes.",
      category: "billing",
      priority: "Medium" as Priority,
      source: "SaaS Stripe Integration",
      metadata: { errorRate: "12%", gatewayHost: "stripe-prod-edge" }
    }
  ];

  const applyTemplate = (tpl: typeof templates[0]) => {
    onCreateAlert({
      title: tpl.title,
      message: tpl.message,
      category: tpl.category,
      priority: tpl.priority,
      source: tpl.source,
      metadata: tpl.metadata
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border-slate-800/80 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider">
            Incident Dispatcher Console
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono text-cyan-300">Quick-Launch Ready</span>
        </div>
      </div>

      {/* Instant Scenario Trigger Buttons */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
          Telemetry Scenarios (1-Click Generator)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {templates.map((tpl, idx) => (
            <button
              key={idx}
              type="button"
              id={`template-btn-${idx}`}
              onClick={() => applyTemplate(tpl)}
              disabled={isSubmitting}
              className="px-3 py-2 text-left text-xs bg-slate-950/40 hover:bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 text-slate-300 rounded-xl transition-all flex items-center justify-between group disabled:opacity-50 cursor-pointer"
            >
              <span className="font-medium">{tpl.name}</span>
              <Play className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Manual Creation Form */}
      <form onSubmit={handleFormSubmit} className="space-y-3.5 pt-2">
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Custom System Dispatch
        </div>

        {/* Title Input */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 block">Incident Title</label>
          <input
            id="create-alert-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Memory saturation on frontend-app-04"
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none transition-all"
          />
        </div>

        {/* Description Message Area */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 block">Diagnostic Message</label>
          <textarea
            id="create-alert-message"
            required
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Out of Memory error triggered. RSS memory size (2048MB) exceeded available container RAM allocation."
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none transition-all resize-none"
          />
        </div>

        {/* Category + Priority grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 block">Category</label>
            <select
              id="create-alert-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none transition-all"
            >
              <option value="system">🖥️ System</option>
              <option value="security">🔒 Security</option>
              <option value="database">🗄️ Database</option>
              <option value="billing">💳 Billing</option>
              <option value="application">📦 Application</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 block">Priority Level</label>
            <select
              id="create-alert-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none transition-all"
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🔵 Medium</option>
              <option value="High">🟡 High</option>
              <option value="Critical">🔴 Critical</option>
            </select>
          </div>
        </div>

        {/* Source System */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 block">Reporting Source</label>
          <input
            id="create-alert-source"
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. AWS CloudWatch Agent"
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none transition-all"
          />
        </div>

        {/* Metadata section (key-value parameter) */}
        <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/40 border border-slate-900">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
            Add Diagnostic Payload (Metadata)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <input
              id="create-alert-meta-key"
              type="text"
              placeholder="e.g. node_id"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              className="bg-slate-950/80 border border-slate-850 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 outline-none placeholder-slate-700"
            />
            <input
              id="create-alert-meta-val"
              type="text"
              placeholder="e.g. srv-west-90"
              value={customVal}
              onChange={(e) => setCustomVal(e.target.value)}
              className="bg-slate-950/80 border border-slate-850 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 outline-none placeholder-slate-700"
            />
          </div>
        </div>

        {/* Submit dispatch button */}
        <button
          id="dispatch-alert-btn"
          type="submit"
          disabled={isSubmitting || !title.trim() || !message.trim()}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 active:scale-[0.99]"
        >
          <Terminal className="w-4 h-4" />
          <span>{isSubmitting ? "Dispatching Alert..." : "Dispatch System Incident"}</span>
        </button>
      </form>

    </div>
  );
}
