import React from 'react';
import { Home, Layers, Camera, Map, FileText, Database } from 'lucide-react';
import PramaanLogo from './PramaanLogo';
import BotanicalSketch from './BotanicalSketch';

export default function Sidebar({ currentView, onNavigate, onOpenCloudinaryModal }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'evidence', label: 'Evidence', icon: Camera },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-[#141311] border-r border-[#26231E] flex flex-col justify-between shrink-0 select-none h-screen sticky top-0 hidden md:flex">
      {/* Brand Header with Exact Wheat Logo from reference picture */}
      <div>
        <div className="p-6 border-b border-[#26231E] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#C8754A]/15 border border-[#C8754A]/30 flex items-center justify-center">
            <PramaanLogo className="w-6 h-6" color="#C8754A" />
          </div>
          <div>
            <h1 className="text-base font-serif font-bold tracking-widest text-[#EEE7DA]">
              PRAMAAN
            </h1>
            <p className="text-[10px] font-mono text-[#D5A04B] tracking-tight">
              EVIDENCE INTELLIGENCE
            </p>
          </div>
        </div>

        {/* Navigation Items with Glowing Active State matching screenshot */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#28241F] text-[#EEE7DA] border border-[#C8754A]/30 shadow-sm'
                    : 'text-[#918A7D] hover:text-[#EEE7DA] hover:bg-[#1E1C18]'
                }`}
                data-cursor="target"
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C8754A]' : 'text-[#918A7D]'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C8754A] shadow-[0_0_6px_#C8754A]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Information, Delicate Botanical Sketch & Tagline matching screenshot */}
      <div className="p-6 border-t border-[#26231E] flex flex-col items-center text-center space-y-3">
        {/* Botanical Sketch */}
        <BotanicalSketch className="w-12 h-12" color="#C8754A" />

        <div>
          <div className="text-xs font-serif italic text-[#EEE7DA]/90 leading-snug">
            Better evidence.<br />Bigger impact.
          </div>
          <div className="text-[9px] font-mono text-[#918A7D]/60 mt-1 uppercase tracking-widest">
            v1.0 · PRAMAAN
          </div>
        </div>
      </div>
    </aside>
  );
}
