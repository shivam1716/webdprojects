import React, { useState } from 'react';
import { ArrowLeft, Sparkles, MapPin, DollarSign, Camera, Calendar, Layers, ExternalLink, AlertTriangle, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import SourceBadge from './SourceBadge';
import FollowTheMoneyGraph from './FollowTheMoneyGraph';
import ProjectMap from './ProjectMap';

export default function ProjectDetailView({
  project,
  mediaList = [],
  observations = [],
  gaps = [],
  coverage = [],
  onBack,
  onCreateImpactStory,
  onOpenSourceDetails,
  onRequestEvidence
}) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedLocation, setSelectedLocation] = useState(project?.locations?.[0] || null);

  const tabs = ['Overview', 'Evidence', 'Timeline', 'Map', 'Activities', 'Report'];

  if (!project) return null;

  const formattedFunding = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: project.currency || 'USD',
    maximumFractionDigits: 0
  }).format(project.commitmentAmount);

  // Primary observation with before/after pair
  const primaryObservation = observations.find(o => o.beforeAsset && o.afterAsset) || observations[0];

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-[#1E1B18]">
      {/* Top Breadcrumb & Header matching Bottom-Left of Reference Pic */}
      <div className="space-y-3 pb-4 border-b border-[#EAE4DC]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[#7A7369] hover:text-[#C8754A] transition-colors"
          data-cursor="target"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1E1B18]">
                {project.title}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#C8754A]/15 text-[#C8754A] font-semibold border border-[#C8754A]/30">
                DEMO PROJECT
              </span>
            </div>

            {/* Meta Row with dots matching screenshot */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 text-xs text-[#7A7369]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C8754A]" />
                <span className="text-[#1E1B18]">{project.country}</span>
              </span>
              <span>•</span>
              <span className="font-semibold text-[#1E1B18]">
                {formattedFunding}
              </span>
              <span>•</span>
              <span>{project.locations?.length || 24} locations</span>
              <span>•</span>
              <span>{mediaList.length > 0 ? mediaList.length : '1,842'} media assets</span>
              <span>•</span>
              <span>{new Date(project.approvalDate).getFullYear()} – {new Date(project.closingDate).getFullYear()}</span>
            </div>
          </div>

          {/* Action button: Black pill with sparkle matching screenshot */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onCreateImpactStory(project)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#191815] hover:bg-[#25221E] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-all"
              data-cursor="target"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8754A]" />
              <span>Create Impact Story</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-4 border-b border-[#EAE4DC] overflow-x-auto text-xs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-1 transition-colors relative whitespace-nowrap font-medium ${
              activeTab === tab
                ? 'text-[#C8754A] border-b-2 border-[#C8754A]'
                : 'text-[#7A7369] hover:text-[#1E1B18]'
            }`}
            data-cursor="target"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content: 3 Columns Layout matching screenshot */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* COLUMN 1: Funding & Activities (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#EAE4DC] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
              <h3 className="text-xs font-sans font-semibold text-[#1E1B18] uppercase tracking-wider">
                Funding & Activities ▾
              </h3>
            </div>

            {/* Total Project Funding Card */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE4DC] space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#7A7369]">
                <DollarSign className="w-4 h-4 text-[#C8754A]" />
                <span>Total Project Funding</span>
              </div>
              <div className="text-xl font-bold font-sans text-[#1E1B18]">
                {formattedFunding}
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-2.5">
              {[
                { name: 'Waste removal', assets: '342 media assets', cost: '₹ 8.2L' },
                { name: 'Plantation', assets: '210 media assets', cost: '₹ 6.4L' },
                { name: 'Water treatment', assets: '156 media assets', cost: '₹ 5.1L' },
                { name: 'Infrastructure', assets: '128 media assets', cost: '₹ 5.3L' }
              ].map((act, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-[#F0EBE3] hover:border-[#C8754A]/30 transition-all flex items-center justify-between bg-white"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#C8754A] flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-[#1E1B18]">{act.name}</h5>
                      <span className="text-[11px] text-[#7A7369]">{act.assets}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#1E1B18]">{act.cost}</span>
                </div>
              ))}
            </div>

            {/* Financial Disclosure Notice */}
            <div className="pt-2 text-[11px] text-[#7A7369] leading-relaxed border-t border-[#F0EBE3]">
              Activity-level financial breakdown verified from project execution authority reports.
              <div className="mt-1">
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C8754A] hover:underline font-mono text-[10px] uppercase font-semibold inline-flex items-center gap-1"
                >
                  <span>VIEW SOURCE DATA →</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Evidence Coverage & Key Insights (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#EAE4DC] rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-sans font-semibold text-[#1E1B18] uppercase tracking-wider pb-2 border-b border-[#F0EBE3]">
              Evidence Coverage
            </h3>

            {/* Progress Bars matching screenshot */}
            <div className="space-y-3">
              {[
                { name: 'Waste removal', percent: 94 },
                { name: 'Plantation', percent: 81 },
                { name: 'Water treatment', percent: 43 },
                { name: 'Final outcome', percent: 21 }
              ].map((cov) => (
                <div key={cov.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-[#1E1B18]">{cov.name}</span>
                    <span className="text-[#7A7369] font-mono">{cov.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#FAF7F2] rounded-full overflow-hidden border border-[#EAE4DC]">
                    <div
                      className="h-full bg-[#C8754A] rounded-full transition-all duration-500"
                      style={{ width: `${cov.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Alert Box matching screenshot */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE4DC] space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#C8754A] shrink-0 mt-0.5" />
                <div className="text-xs text-[#1E1B18] leading-snug">
                  Zone C has insufficient post-completion evidence.
                </div>
              </div>
              <button
                onClick={() => onRequestEvidence && onRequestEvidence({ targetEntity: 'Zone C' })}
                className="px-3 py-1.5 rounded-lg bg-[#C8754A] hover:bg-[#C8754A]/90 text-white text-[11px] font-mono uppercase tracking-wider font-semibold transition-colors"
                data-cursor="target"
              >
                Request Evidence →
              </button>
            </div>

            {/* Key Insights matching screenshot */}
            <div className="space-y-2.5 pt-2 border-t border-[#F0EBE3]">
              <div className="text-[11px] font-sans font-semibold text-[#7A7369] uppercase tracking-wider">
                Key Insights
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border border-[#F0EBE3] flex items-center gap-2.5 bg-[#FAF7F2]/50">
                  <ShieldCheck className="w-4 h-4 text-[#C8754A] shrink-0" />
                  <span className="text-[#1E1B18]">Visible waste decreased by -64%</span>
                </div>
                <div className="p-2.5 rounded-xl border border-[#F0EBE3] flex items-center gap-2.5 bg-[#FAF7F2]/50">
                  <ShieldCheck className="w-4 h-4 text-[#C8754A] shrink-0" />
                  <span className="text-[#1E1B18]">Vegetation increased in 3 locations</span>
                </div>
                <div className="p-2.5 rounded-xl border border-[#F0EBE3] flex items-center gap-2.5 bg-[#FAF7F2]/50">
                  <ShieldCheck className="w-4 h-4 text-[#C8754A] shrink-0" />
                  <span className="text-[#1E1B18]">Infrastructure work completed in Zone A</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Before / After (Zone B) (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#EAE4DC] rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-sans font-semibold text-[#1E1B18] uppercase tracking-wider pb-2 border-b border-[#F0EBE3]">
              Before / After (Zone B)
            </h3>

            {/* Interactive Before/After slider */}
            <BeforeAfterSlider
              beforeAsset={primaryObservation?.beforeAsset}
              afterAsset={primaryObservation?.afterAsset}
              title="Zone B Comparative Field Telemetry"
              onOpenSourceDetails={onOpenSourceDetails}
            />

            {/* 4 Thumbnails Gallery below slider matching screenshot */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {[
                'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=200&auto=format&fit=crop'
              ].map((thumbUrl, idx) => (
                <div key={idx} className="h-14 rounded-lg overflow-hidden border border-[#EAE4DC] shadow-xs cursor-pointer hover:border-[#C8754A] transition-colors" data-cursor="target">
                  <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map Tab */}
      {activeTab === 'Map' && (
        <div className="bg-white border border-[#EAE4DC] rounded-2xl p-5 shadow-xs">
          <ProjectMap
            locations={project.locations || []}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            onOpenSourceDetails={onOpenSourceDetails}
            height="500px"
            title={`Geospatial Markers: ${project.title}`}
          />
        </div>
      )}

      {/* Evidence Tab */}
      {activeTab === 'Evidence' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mediaList.map((media) => (
            <div key={media.assetId} className="bg-white border border-[#EAE4DC] rounded-2xl p-4 shadow-xs space-y-3">
              <div className="relative h-48 w-full bg-black rounded-xl overflow-hidden">
                <img src={media.url} alt={media.activityName} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-[#D5A04B]">
                  {media.locationName}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#1E1B18]">{media.activityName}</h4>
                <div className="mt-1 text-xs text-[#7A7369] font-mono space-y-0.5">
                  <div>Asset ID: {media.assetId}</div>
                  <div>Captured: {new Date(media.captureDate).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activities Tab */}
      {activeTab === 'Activities' && (
        <div className="bg-white border border-[#EAE4DC] rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-semibold text-[#1E1B18]">Verified Activities</h3>
          {project.activities?.map(act => (
            <div key={act.id} className="p-3.5 rounded-xl border border-[#F0EBE3] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-[#1E1B18]">{act.name}</h4>
                <span className="text-[11px] text-[#7A7369]">Sector: {act.sector}</span>
              </div>
              <span className="text-xs font-mono text-[#C8754A] font-semibold">{act.mediaCount} assets</span>
            </div>
          ))}
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'Timeline' && (
        <div className="bg-white border border-[#EAE4DC] rounded-2xl p-6 shadow-xs space-y-3 text-xs">
          <h3 className="text-sm font-semibold text-[#1E1B18]">Timeline</h3>
          <div className="p-3 rounded-xl border border-[#F0EBE3] flex justify-between">
            <span className="font-semibold text-[#1E1B18]">Approved</span>
            <span className="text-[#7A7369]">{new Date(project.approvalDate).toDateString()}</span>
          </div>
          <div className="p-3 rounded-xl border border-[#F0EBE3] flex justify-between">
            <span className="font-semibold text-[#1E1B18]">Scheduled Closing</span>
            <span className="text-[#7A7369]">{new Date(project.closingDate).toDateString()}</span>
          </div>
        </div>
      )}

      {/* Report Tab */}
      {activeTab === 'Report' && (
        <div className="bg-white border border-[#EAE4DC] rounded-2xl p-8 text-center shadow-xs space-y-3">
          <Sparkles className="w-8 h-8 text-[#C8754A] mx-auto" />
          <h3 className="text-base font-semibold text-[#1E1B18]">Generate Auditable Impact Report</h3>
          <p className="text-xs text-[#7A7369] max-w-sm mx-auto">
            Create an audited PDF dossier containing all before/after photos and verified telemetry.
          </p>
          <button
            onClick={() => onCreateImpactStory(project)}
            className="px-4 py-2 rounded-xl bg-[#C8754A] text-white text-xs font-mono font-semibold"
            data-cursor="target"
          >
            Create Dossier Now
          </button>
        </div>
      )}
    </div>
  );
}
