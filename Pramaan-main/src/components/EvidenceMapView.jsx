import React, { useState } from 'react';
import { MapPin, Search, ArrowRight, Camera } from 'lucide-react';
import ProjectMap from './ProjectMap';

const ALL_LOCATIONS = [
  { id: 'loc_lucknow', name: 'Lake Restoration',    zone: 'Zone B',        state: 'Lucknow',     type: 'lake',   evidenceScore: 92, visits: 12, photos: 84, videos: 7,  lastVisit: '18 Aug 2026', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop' },
  { id: 'loc_indore',  name: 'Tree Plantation',      zone: 'Indore Basin',  state: 'Indore',      type: 'tree',   evidenceScore: 78, visits: 8,  photos: 45, videos: 3,  lastVisit: '12 Sep 2026', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=400&auto=format&fit=crop' },
  { id: 'loc_varanasi',name: 'School Upgrade',       zone: 'Varanasi East', state: 'Varanasi',    type: 'school', evidenceScore: 85, visits: 14, photos: 62, videos: 4,  lastVisit: '05 Sep 2026', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=400&auto=format&fit=crop' },
  { id: 'loc_gujarat', name: 'Water Harvesting',     zone: 'Kutch Basin',   state: 'Gujarat',     type: 'other',  evidenceScore: 64, visits: 6,  photos: 30, videos: 2,  lastVisit: '22 Jul 2026', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&auto=format&fit=crop' },
  { id: 'loc_south',   name: 'Canopy Reforestation', zone: 'Nilgiris',      state: 'Tamil Nadu',  type: 'tree',   evidenceScore: 88, visits: 11, photos: 54, videos: 5,  lastVisit: '29 Aug 2026', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=400&auto=format&fit=crop' },
  { id: 'loc_bengal',  name: 'Mangrove Buffer',      zone: 'Sundarbans',    state: 'West Bengal', type: 'lake',   evidenceScore: 70, visits: 7,  photos: 38, videos: 1,  lastVisit: '01 Aug 2026', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400&auto=format&fit=crop' },
];

const SCORE_COLOR = (s) => s >= 85 ? '#66BB6A' : s >= 65 ? '#D5A04B' : '#E57373';

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'];

export default function EvidenceMapView({ onSelectProject }) {
  const [activeMonth, setActiveMonth] = useState('MAY');
  const [askQuery, setAskQuery] = useState('Find places where restoration produced visible change');
  const [selected, setSelected] = useState(ALL_LOCATIONS[0]);

  const handlePinClick = (loc) => {
    // ProjectMap sends a minimal loc object — look up the full record (with image + lastVisit)
    const fullLoc = ALL_LOCATIONS.find(l => l.id === loc.id) || loc;
    setSelected(fullLoc);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-[#141311] border border-[#26231E] rounded-2xl p-6 text-white shadow-2xl space-y-4">

        {/* Header + Timeline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-3">
          <div>
            <h2 className="text-lg font-serif font-semibold text-white">Where the evidence came from</h2>
            <p className="text-xs text-[#918A7D]">Click any pin to explore project locations and field media.</p>
          </div>
          <div className="flex items-center gap-2 bg-[#1A1815] px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono">
            {months.map((m) => (
              <button
                key={m}
                onClick={() => setActiveMonth(m)}
                className={`px-1.5 py-0.5 rounded transition-all ${activeMonth === m ? 'bg-[#C8754A] text-white font-bold shadow-[0_0_8px_#C8754A]' : 'text-[#918A7D] hover:text-white'}`}
                data-cursor="target"
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Map + Side Panel */}
        <div className="relative rounded-xl overflow-hidden border border-white/10" style={{ height: '440px' }}>
          {/* Map fills the full card */}
          <ProjectMap height="440px" onSelectLocation={handlePinClick} />

          {/* ── Dynamic side panel — updates on pin click ── */}
          <div
            key={selected.id}
            className="absolute top-4 right-4 z-30 bg-[#161513]/96 backdrop-blur-md border border-[#C8754A]/40 rounded-xl p-4 shadow-2xl w-60 space-y-3 text-left animate-fadeIn"
          >
            {/* Location header */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C8754A] flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white font-serif leading-tight truncate">{selected.name}</h4>
                <p className="text-[10px] font-mono text-[#918A7D] truncate">{selected.zone} · {selected.state}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-1.5 text-xs text-[#A89F91]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8754A] flex-shrink-0" />
                <span>{selected.visits} field visits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D5A04B] flex-shrink-0" />
                <span>{selected.photos} photos • {selected.videos} videos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#918A7D] flex-shrink-0" />
                <span>Last visit: {selected.lastVisit}</span>
              </div>
              <div className="flex items-center gap-2 font-mono font-semibold pt-1">
                <span className="text-[#D5A04B]">Evidence strength:</span>
                <span className="font-bold" style={{ color: SCORE_COLOR(selected.evidenceScore) }}>
                  {selected.evidenceScore}%
                </span>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="h-20 rounded-lg overflow-hidden border border-white/15 shadow-md">
              <img
                key={selected.image}
                src={selected.image}
                alt={selected.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* View project button */}
            <button
              onClick={() => onSelectProject && onSelectProject('P178253')}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#C8754A]/15 hover:bg-[#C8754A]/25 border border-[#C8754A]/30 text-xs font-mono text-[#C8754A] uppercase tracking-wider transition-all"
              data-cursor="target"
            >
              <Camera className="w-3 h-3" />
              View evidence
            </button>
          </div>
        </div>

        {/* Location quick-select pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {ALL_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handlePinClick(loc)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border transition-all ${
                selected.id === loc.id
                  ? 'bg-[#C8754A]/20 border-[#C8754A]/50 text-[#C8754A] font-semibold'
                  : 'bg-[#1A1815] border-white/10 text-[#918A7D] hover:text-white hover:border-white/20'
              }`}
              data-cursor="target"
            >
              <MapPin className="w-2.5 h-2.5" />
              {loc.state}
            </button>
          ))}
        </div>

        {/* ASK THE EVIDENCE */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#C8754A] font-bold">
            ASK THE EVIDENCE
          </div>
          <div className="relative flex items-center bg-[#1A1815] border border-white/10 rounded-xl p-1.5">
            <Search className="w-4 h-4 text-[#918A7D] ml-2 shrink-0" />
            <input
              type="text"
              value={askQuery}
              onChange={(e) => setAskQuery(e.target.value)}
              placeholder="Find places where restoration produced visible change"
              className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-[#918A7D] focus:outline-none font-sans"
              data-cursor="target"
            />
            <button
              className="p-2.5 rounded-lg bg-[#C8754A] hover:bg-[#B8643A] text-white transition-colors shrink-0"
              data-cursor="target"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Result cards — filtered by selected location type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ALL_LOCATIONS.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => handlePinClick(item)}
                className={`p-2.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer group ${
                  selected.id === item.id
                    ? 'bg-[#C8754A]/10 border-[#C8754A]/50'
                    : 'bg-[#1A1815] border-white/10 hover:border-[#C8754A]/40'
                }`}
                data-cursor="target"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-semibold text-white truncate group-hover:text-[#C8754A] transition-colors">{item.name}</h5>
                  <p className="text-[11px] text-[#918A7D] truncate">{item.zone}</p>
                  <div className="text-[10px] font-mono font-bold mt-1" style={{ color: SCORE_COLOR(item.evidenceScore) }}>
                    {item.evidenceScore}% evidence
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#918A7D] group-hover:text-white transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
