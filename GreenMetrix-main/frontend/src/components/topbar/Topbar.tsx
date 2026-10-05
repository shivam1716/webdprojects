import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Calendar, ChevronDown, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DateRangeContext } from "../layout/AppLayout";
import { api } from "../../services/api";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard Overview",
    subtitle: "Real-time insights into your production's environmental impact 🌿",
  },
  "/factories": {
    title: "Factory Facilities Directory",
    subtitle: "Real-time energy load, emission intensity & compliance status",
  },
  "/map": {
    title: "City Carbon Map // Delhi Grid",
    subtitle: "Live industrial emissions heatmap, radar telemetries & hotspots",
  },
  "/energy": {
    title: "Energy Consumption Analytics",
    subtitle: "Peak demand, power factor and load shifting opportunities",
  },
  "/emissions": {
    title: "CO₂ & GHG Scope Analytics",
    subtitle: "Scope 1 direct & Scope 2 location-based grid emission tracking",
  },
  "/anomalies": {
    title: "Unsupervised Anomaly Detection",
    subtitle: "Isolation Forest real-time detection & root cause categorization",
  },
  "/digital-twin": {
    title: "Digital Twin // What-If Simulator",
    subtitle: "Scenario modeling for energy efficiency & renewable integration",
  },
  "/copilot": {
    title: "GreenMetriX AI Sustainability Copilot",
    subtitle: "Interactive LangGraph assistant powered by verified environmental RAG",
  },
  "/action-planner": {
    title: "Decarbonization Action Planner",
    subtitle: "Prioritized recommendations with verified impact & effort matrices",
  },
  "/score": {
    title: "Composite Sustainability Score",
    subtitle: "Transparent multi-variable ESG calculation framework",
  },
  "/reports": {
    title: "Executive Sustainability Reports",
    subtitle: "Audit-ready PDF generation powered by ReportLab",
  },
  "/settings": {
    title: "Platform Settings & Benchmarks",
    subtitle: "Configure industry thresholds, grid emission factors & API keys",
  },
};

export const Topbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const dateRange = useContext(DateRangeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [summaryError, setSummaryError] = useState("");
  const [loading, setLoading] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const pageInfo = PAGE_TITLES[location.pathname] || {
    title: "GreenMetriX Platform",
    subtitle: "Measure. Predict. Decarbonize.",
  };

  useEffect(() => {
    if (!dateRange) return;
    let cancelled = false;
    setLoading(true);
    setSummaryError("");
    api.getDateRangeSummary(dateRange.range.start, dateRange.range.end)
      .then((data) => { if (!cancelled) setSummary(data); })
      .catch((error: unknown) => {
        if (!cancelled) {
          setSummaryError(error instanceof Error ? error.message : "Could not load readings for this period.");
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [dateRange?.range.start, dateRange?.range.end]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const localToday = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  };
  const setPreset = (days: number) => {
    if (!dateRange) return;
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - days + 1);
    const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    dateRange.setRange({ start: toISO(start), end: toISO(end) });
  };
  return (
    <header className="h-20 bg-[#051310]/80 backdrop-blur-xl border-b border-emerald-500/15 sticky top-0 z-30 px-8 flex items-center justify-between">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          {pageInfo.title}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">{pageInfo.subtitle}</p>
      </div>

      {/* Header Controls Matching Reference Image 2 */}
      <div className="flex items-center gap-4">
        {/* Project Selector Dropdown */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#09221b]/70 border border-emerald-500/20 text-xs text-slate-200 cursor-pointer hover:border-emerald-500/40 transition-colors">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block leading-tight">Select Project</span>
            <span className="font-semibold text-emerald-300">All Projects</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-2" />
        </div>

        {/* Date Range Selector Matching Reference Image 2 */}
        <div className="relative hidden sm:block" ref={pickerRef}>
          <button type="button" aria-expanded={isOpen} aria-label="Choose date range" onClick={() => setIsOpen((open) => !open)} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#09221b]/70 border border-emerald-500/20 text-xs text-slate-200 hover:border-emerald-500/50 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] text-slate-300">{dateRange ? `${formatDate(dateRange.range.start)} - ${formatDate(dateRange.range.end)}` : "Select dates"}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
          {isOpen && dateRange && <div className="absolute right-0 top-full mt-2 z-50 w-[340px] rounded-2xl border border-emerald-500/25 bg-[#071612] p-4 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold text-white">Telemetry date range</h2><span className="text-[10px] text-emerald-300">UTC dates</span></div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[10px] text-slate-400">From<input type="date" value={dateRange.range.start} max={dateRange.range.end} onChange={(e) => dateRange.setRange({ ...dateRange.range, start: e.target.value })} className="mt-1 w-full rounded-lg border border-emerald-900 bg-[#040d0c] px-2 py-2 text-xs text-white [color-scheme:dark]" /></label>
              <label className="text-[10px] text-slate-400">Through<input type="date" value={dateRange.range.end} min={dateRange.range.start} max={localToday()} onChange={(e) => dateRange.setRange({ ...dateRange.range, end: e.target.value })} className="mt-1 w-full rounded-lg border border-emerald-900 bg-[#040d0c] px-2 py-2 text-xs text-white [color-scheme:dark]" /></label>
            </div>
            <div className="flex gap-2 mt-3">{[[7,"7 days"],[30,"30 days"],[90,"90 days"]].map(([days,label]) => <button key={days} onClick={() => setPreset(Number(days))} className="flex-1 rounded-lg border border-emerald-900/80 px-2 py-1.5 text-[10px] text-emerald-300 hover:bg-emerald-500/10">{label}</button>)}</div>
            <div className="mt-4 border-t border-emerald-950 pt-3">
              {loading ? <p className="text-xs text-slate-400">Loading facility readings…</p> : summaryError ? <p className="text-xs text-rose-300">{summaryError}</p> : summary ? <>
                <p className="text-[10px] text-slate-400">Selected-period facts</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-2 text-[11px]"><span className="text-slate-400">CO₂e recorded</span><b className="text-white text-right">{(summary.total_co2_kg / 1000).toLocaleString(undefined,{maximumFractionDigits:2})} t</b><span className="text-slate-400">Energy consumed</span><b className="text-white text-right">{(summary.total_energy_kwh / 1000).toLocaleString(undefined,{maximumFractionDigits:1})} MWh</b><span className="text-slate-400">Renewable share</span><b className="text-white text-right">{summary.renewable_share_pct}%</b><span className="text-slate-400">Readings / facilities</span><b className="text-white text-right">{summary.reading_count} / {summary.factories_reporting}</b></div>
                <p className="mt-3 text-[10px] leading-relaxed text-amber-200/80">{summary.data_note}</p>
                {!summary.reading_count && <p className="mt-1 text-[10px] text-slate-400">No telemetry readings were recorded in this range.</p>}
              </> : null}
            </div>
            <button onClick={() => setIsOpen(false)} className="mt-3 w-full rounded-lg bg-emerald-500/15 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25">Done</button>
          </div>}
        </div>

        {/* Search button */}
        <button className="p-2 rounded-xl bg-[#09221b]/60 border border-emerald-500/20 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors">
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell with alert dot */}
        <div className="relative">
          <button className="p-2 rounded-xl bg-[#09221b]/60 border border-emerald-500/20 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5 shadow-[0_0_8px_#f59e0b]" />
        </div>

        {/* User Badge Matching Reference Image 2 */}
        <div title={user?.name || user?.email || "Account"} className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 border border-emerald-400/40 flex items-center justify-center font-bold text-xs text-white shadow-[0_0_10px_rgba(16,185,129,0.25)]">
          {(user?.name || user?.email || "U").split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join("")}
        </div>
      </div>
    </header>
  );
};
