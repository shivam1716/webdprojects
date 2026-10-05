import React, { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar/Sidebar";
import { Topbar } from "../topbar/Topbar";
import { CursorTrail } from "../common/CursorTrail";

export interface DateRange { start: string; end: string }
export const DateRangeContext = createContext<{ range: DateRange; setRange: (range: DateRange) => void } | null>(null);

const isoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const AppLayout: React.FC = () => {
  const [range, setRange] = useState<DateRange>(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 29);
    return { start: isoDate(start), end: isoDate(today) };
  });
  return (
    <DateRangeContext.Provider value={{ range, setRange }}>
    <div className="min-h-screen bg-[#040d0c] flex relative selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Persistent Cursor Spark & Glow Trail */}
      <CursorTrail />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
    </DateRangeContext.Provider>
  );
};
