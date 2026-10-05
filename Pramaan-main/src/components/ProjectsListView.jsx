import React, { useState } from 'react';
import { Layers, Search, Filter, MapPin, DollarSign, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import SourceBadge from './SourceBadge';

export default function ProjectsListView({
  projects = [],
  allMedia = [],
  onSelectProject,
  onOpenSourceDetails,
  globalSearch = '',
}) {
  const [search, setSearch] = React.useState(globalSearch);

  // Sync with globalSearch whenever it changes from the header
  React.useEffect(() => { setSearch(globalSearch); }, [globalSearch]);
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Derive unique filter options from real data
  const countries = ['ALL', ...Array.from(new Set(projects.map(p => p.country).filter(Boolean)))];
  const sectors = ['ALL', ...Array.from(new Set(projects.map(p => p.sector).filter(Boolean)))];
  const statuses = ['ALL', ...Array.from(new Set(projects.map(p => p.status).filter(Boolean)))];

  const filtered = projects.filter(p => {
    if (selectedCountry !== 'ALL' && p.country !== selectedCountry) return false;
    if (selectedSector !== 'ALL' && p.sector !== selectedSector) return false;
    if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.sector.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2C2822] gap-3">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#C8754A] uppercase font-semibold">
            Global Operations Registry
          </span>
          <h2 className="text-xl font-serif font-bold text-[#EEE7DA]">
            Real Development Projects
          </h2>
        </div>
        <SourceBadge
          source="World Bank Projects API"
          timestamp={new Date().toISOString()}
          onOpenDetails={onOpenSourceDetails}
        />
      </div>

      {/* Filters Bar */}
      <div className="bg-[#191815] border border-[#2C2822] rounded-lg p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter operations by title, ID (e.g. P178253), or keywords..."
            className="w-full pl-9 pr-4 py-2 rounded bg-[#11110F] border border-[#2C2822] text-xs text-[#EEE7DA] placeholder-[#918A7D]/60 focus:outline-none focus:border-[#C8754A]"
            data-cursor="target"
          />
          <Search className="w-4 h-4 text-[#918A7D] absolute left-3 top-2.5" />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div>
            <label className="block text-[10px] text-[#918A7D] uppercase mb-1">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-[#11110F] border border-[#2C2822] text-[#EEE7DA] focus:outline-none focus:border-[#C8754A]"
              data-cursor="target"
            >
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-[#918A7D] uppercase mb-1">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-[#11110F] border border-[#2C2822] text-[#EEE7DA] focus:outline-none focus:border-[#C8754A]"
              data-cursor="target"
            >
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-[#918A7D] uppercase mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-[#11110F] border border-[#2C2822] text-[#EEE7DA] focus:outline-none focus:border-[#C8754A]"
              data-cursor="target"
            >
              {statuses.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-[#191815] border border-[#2C2822] rounded-lg text-[#918A7D] text-xs">
            No projects matching current filter criteria.
          </div>
        ) : (
          filtered.map(p => {
            const linkedMedia = allMedia.filter(m => m.projectId === p.id);
            const formattedFunding = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: p.currency || 'USD',
              maximumFractionDigits: 0
            }).format(p.commitmentAmount);

            return (
              <div
                key={p.id}
                className="project-card bg-[#191815] border border-[#2C2822] rounded-lg p-5 flex flex-col justify-between hover:border-[#C8754A]/60 transition-all duration-200 group shadow-md"
                data-cursor="target"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D5A04B] font-semibold">
                      {p.id} · {p.sector}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C8754A]/15 text-[#C8754A] border border-[#C8754A]/30">
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-[#EEE7DA] group-hover:text-[#C8754A] transition-colors leading-snug">
                    {p.title}
                  </h3>

                  <p className="text-xs text-[#918A7D] line-clamp-2 mt-2 leading-relaxed font-sans">
                    {p.abstract || 'World Bank supported initiative promoting environmental sustainability and public infrastructure.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2C2822] space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#918A7D]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C8754A]" />
                      <span className="text-[#EEE7DA] truncate">{p.country}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <DollarSign className="w-3.5 h-3.5 text-[#D5A04B]" />
                      <span className="text-[#D5A04B] font-bold">{formattedFunding}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(p.approvalDate).getFullYear()} – {new Date(p.closingDate).getFullYear()}</span>
                    </div>
                    <div className="text-right text-[11px] text-[#D77A8B]">
                      {linkedMedia.length} field media assets
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <SourceBadge
                      source={p.dataSource}
                      timestamp={p.retrievedAt}
                      onOpenDetails={onOpenSourceDetails}
                    />

                    <button
                      onClick={() => onSelectProject(p.id)}
                      className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#C8754A] hover:underline font-semibold"
                      data-cursor="target"
                    >
                      <span>VIEW PROJECT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
