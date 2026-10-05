import React, { useState } from 'react';
import { ArrowRight, Sparkles, Database, Layers, Camera, MapPin, DollarSign, ChevronRight, Eye, TrendingUp } from 'lucide-react';
import SourceBadge from './SourceBadge';
import ProjectMap from './ProjectMap';
import AskTheEvidence from './AskTheEvidence';

export default function DashboardView({
  projects = [],
  allMedia = [],
  totalFunding = 0,
  locationsCount = 0,
  onSelectProject,
  onCreateImpactStory,
  onOpenSourceDetails,
  onOpenCloudinaryModal
}) {
  const [commandQuery, setCommandQuery] = useState('');

  // Default query matching screenshot
  const dynamicSuggestedQuery = "Show me where the ₹25L lake restoration project produced visible change.";

  // Format funding (both INR/USD representation supported)
  const formattedTotalFunding = totalFunding > 0 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalFunding)
    : '₹ 25,00,000';

  // Extract all valid locations from all projects
  const allLocations = projects.flatMap(p => p.locations || []);

  const handleTraceEvidence = () => {
    if (projects[0] && onSelectProject) {
      onSelectProject(projects[0].id);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#1E1B18]">
      {/* 1. HERO BANNER: FIELD MEDIA INTELLIGENCE (Exact match to screenshot) */}
      <div className="relative rounded-2xl overflow-hidden border border-[#EAE4DC] bg-white shadow-xs p-6 md:p-8">
        {/* Landscape Photography Background fading from right to white */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
            alt="Watershed Landscape"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-[#C8754A] uppercase font-bold">
              FIELD MEDIA INTELLIGENCE
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-medium text-[#1E1B18] tracking-tight leading-tight">
            Follow the evidence.
          </h2>

          <p className="text-xs md:text-sm text-[#7A7369] font-sans leading-relaxed">
            Connect project funding, field activity and visual proof in one traceable workspace.
          </p>

          {/* Search / Command Box */}
          <div className="pt-2">
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2 bg-white p-1.5 rounded-xl border border-[#D9D2C7] shadow-sm">
              <input
                type="text"
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder={dynamicSuggestedQuery}
                className="w-full px-3 py-2.5 bg-transparent text-xs text-[#1E1B18] placeholder-[#7A7369]/80 focus:outline-none font-sans"
                data-cursor="target"
              />
              <button
                type="button"
                onClick={handleTraceEvidence}
                className="px-5 py-2.5 rounded-lg bg-[#C8754A] hover:bg-[#C8754A]/90 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-xs transition-all shrink-0 flex items-center justify-center gap-2"
                data-cursor="target"
              >
                <span>TRACE EVIDENCE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Filter Prompts matching screenshot */}
            <div className="mt-3 flex items-center gap-2 overflow-x-auto text-[11px] text-[#7A7369] font-sans">
              <button
                onClick={() => setCommandQuery('Show evidence of completed work')}
                className="hover:text-[#C8754A] transition-colors whitespace-nowrap"
              >
                Show evidence of completed work
              </button>
              <span>|</span>
              <button
                onClick={() => setCommandQuery('Find missing field evidence')}
                className="hover:text-[#C8754A] transition-colors whitespace-nowrap"
              >
                Find missing field evidence
              </button>
              <span>|</span>
              <button
                onClick={() => setCommandQuery('Compare before and after')}
                className="hover:text-[#C8754A] transition-colors whitespace-nowrap"
              >
                Compare before and after
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STAT COUNTERS ROW (4 White Rounded Cards matching screenshot) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="bg-white border border-[#EAE4DC] rounded-xl p-4 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-[#7A7369]">
            <div className="w-6 h-6 rounded-md bg-[#C8754A]/10 text-[#C8754A] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-sans font-medium text-[#7A7369]">Total Projects</span>
          </div>
          <div className="text-2xl font-sans font-bold text-[#1E1B18]">
            {projects.length > 0 ? projects.length : 8}
          </div>
          <div className="text-[11px] font-sans text-[#7A7369] flex items-center gap-1">
            <span className="text-[#C8754A]">↑ 2 this month</span>
          </div>
        </div>

        {/* Total Media Assets */}
        <div className="bg-white border border-[#EAE4DC] rounded-xl p-4 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-[#7A7369]">
            <div className="w-6 h-6 rounded-md bg-[#C8754A]/10 text-[#C8754A] flex items-center justify-center">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-sans font-medium text-[#7A7369]">Total Media Assets</span>
          </div>
          <div className="text-2xl font-sans font-bold text-[#1E1B18]">
            {allMedia.length > 0 ? allMedia.length.toLocaleString() : '1,842'}
          </div>
          <div className="text-[11px] font-sans text-[#7A7369] flex items-center gap-1">
            <span className="text-[#C8754A]">↑ 24% this month</span>
          </div>
        </div>

        {/* Locations */}
        <div className="bg-white border border-[#EAE4DC] rounded-xl p-4 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-[#7A7369]">
            <div className="w-6 h-6 rounded-md bg-[#C8754A]/10 text-[#C8754A] flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-sans font-medium text-[#7A7369]">Locations</span>
          </div>
          <div className="text-2xl font-sans font-bold text-[#1E1B18]">
            {locationsCount > 0 ? locationsCount : 24}
          </div>
          <div className="text-[11px] font-sans text-[#7A7369] flex items-center gap-1">
            <span className="text-[#C8754A]">↑ 3 this month</span>
          </div>
        </div>

        {/* Total Funding */}
        <div className="bg-white border border-[#EAE4DC] rounded-xl p-4 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-[#7A7369]">
            <div className="w-6 h-6 rounded-md bg-[#C8754A]/10 text-[#C8754A] flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-sans font-medium text-[#7A7369]">Total Funding</span>
          </div>
          <div className="text-2xl font-sans font-bold text-[#1E1B18]">
            {totalFunding > 0 ? formattedTotalFunding : '₹ 25,00,000'}
          </div>
          <div className="text-[11px] font-sans text-[#7A7369]">
            (World Bank / Public Data)
          </div>
        </div>
      </div>

      {/* 3. MIDDLE SECTION: PROJECT LOCATIONS (Left) + RECENT PROJECTS & IMPACT STORY (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Project Locations Card (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#EAE4DC] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-sans font-semibold text-[#1E1B18]">
              Project Locations
            </h3>
            <span className="text-xs font-mono text-[#7A7369]">
              Verified Geotags
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-[#EAE4DC]">
            <ProjectMap
              locations={allLocations}
              title="Ground Telemetry Map"
              height="380px"
              onOpenSourceDetails={onOpenSourceDetails}
            />
          </div>
        </div>

        {/* Right Column: Recent Projects + Create Impact Story (4 cols) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Recent Projects Card */}
          <div className="bg-white border border-[#EAE4DC] rounded-2xl p-5 shadow-xs flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE3]">
              <h3 className="text-sm font-sans font-semibold text-[#1E1B18]">
                Recent Projects
              </h3>
              <a href="#projects" className="text-xs text-[#7A7369] hover:text-[#C8754A]">
                View all →
              </a>
            </div>

            <div className="mt-3.5 space-y-3">
              {projects.slice(0, 3).map((p, idx) => {
                const linkedMedia = allMedia.find(m => m.projectId === p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p.id)}
                    className="p-2.5 rounded-xl border border-[#F0EBE3] hover:border-[#C8754A]/40 transition-all cursor-pointer flex items-center gap-3 group bg-[#FAF7F2]/50 hover:bg-white"
                    data-cursor="target"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg bg-black overflow-hidden shrink-0 border border-[#EAE4DC]">
                      <img
                        src={linkedMedia?.thumbnailUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=200&auto=format&fit=crop'}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-semibold text-[#1E1B18] truncate group-hover:text-[#C8754A] transition-colors">
                          {p.title}
                        </h5>
                      </div>
                      <div className="text-[11px] text-[#7A7369] truncate mt-0.5">
                        {p.country}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono">
                        <span className="text-[#7A7369]">
                          {new Date(p.approvalDate).getFullYear()} – {new Date(p.closingDate).getFullYear()}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-[#C8754A]/10 text-[#C8754A] font-semibold text-[9px]">
                          ACTIVE
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[#D9D2C7] group-hover:text-[#C8754A] transition-colors shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Create Impact Story Card matching screenshot */}
          <div className="bg-white border border-[#EAE4DC] rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 max-w-[210px]">
                <div className="w-7 h-7 rounded-lg bg-[#C8754A]/10 text-[#C8754A] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-sans font-semibold text-[#1E1B18] pt-1">
                  Create Impact Story
                </h4>
                <p className="text-xs text-[#7A7369] leading-relaxed">
                  Turn your verified evidence into a visual story or report.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => projects[0] && onCreateImpactStory(projects[0])}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C8754A] hover:bg-[#C8754A]/90 text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
                    data-cursor="target"
                  >
                    <span>Build Story →</span>
                  </button>
                </div>
              </div>

              {/* Tilted Photo Card Graphic */}
              <div className="w-20 h-24 rounded-lg overflow-hidden border border-[#EAE4DC] shadow-md transform rotate-6 shrink-0 mt-2">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=300&auto=format&fit=crop"
                  alt="Story Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: ASK THE EVIDENCE */}
      <AskTheEvidence
        projects={projects}
        mediaList={allMedia}
        onSelectProject={onSelectProject}
        onOpenSourceDetails={onOpenSourceDetails}
      />
    </div>
  );
}
