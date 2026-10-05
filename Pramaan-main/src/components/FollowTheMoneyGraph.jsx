import React from 'react';
import { DollarSign, Layers, Camera, CheckCircle2, ArrowRight, ExternalLink, AlertCircle, FileText } from 'lucide-react';
import SourceBadge from './SourceBadge';

export default function FollowTheMoneyGraph({ project, mediaCount = 0, evidenceScore = 0, onOpenSourceDetails }) {
  if (!project) return null;

  const formattedFunding = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: project.currency || 'USD',
    maximumFractionDigits: 0
  }).format(project.commitmentAmount);

  // Check if any activity has an explicit financial allocation reported in source
  const hasActivityAllocations = project.activities?.some(a => a.allocatedAmount !== null && a.allocatedAmount !== undefined);

  return (
    <div className="w-full bg-[#191815] border border-[#2C2822] rounded-lg p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#2C2822] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#C8754A] uppercase font-semibold">
              Traceability Pipeline
            </span>
            <span className="text-[#918A7D]">·</span>
            <span className="text-xs font-mono text-[#918A7D]">{project.id}</span>
          </div>
          <h3 className="text-xl font-serif font-medium text-[#EEE7DA] mt-0.5">
            Follow the Money: Funding to Ground Proof
          </h3>
        </div>

        <SourceBadge
          source={project.dataSource || 'World Bank Projects API'}
          timestamp={project.retrievedAt}
          onOpenDetails={onOpenSourceDetails}
        />
      </div>

      {/* Traceability Flow Nodes */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-6 gap-3 relative">
        {/* Step 1: PROJECT */}
        <div className="bg-[#141311] border border-[#2C2822] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#C8754A]/40 transition-colors">
          <div>
            <div className="text-[10px] font-mono text-[#918A7D] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>01 · PROJECT</span>
              <FileText className="w-3.5 h-3.5 text-[#C8754A]" />
            </div>
            <div className="text-xs font-serif font-semibold text-[#EEE7DA] line-clamp-2" title={project.title}>
              {project.title}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#2C2822] text-[10px] font-mono text-[#918A7D]">
            <span>{project.country}</span>
          </div>
        </div>

        {/* Step 2: FUNDING */}
        <div className="bg-[#141311] border border-[#2C2822] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#C8754A]/40 transition-colors">
          <div>
            <div className="text-[10px] font-mono text-[#918A7D] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>02 · FUNDING</span>
              <DollarSign className="w-3.5 h-3.5 text-[#D5A04B]" />
            </div>
            <div className="text-sm font-mono font-bold text-[#D5A04B]">
              {formattedFunding}
            </div>
            <div className="text-[10px] text-[#918A7D] mt-0.5">
              Total Commitment
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#2C2822] text-[10px] font-mono text-[#918A7D]">
            <span>Status: {project.status}</span>
          </div>
        </div>

        {/* Step 3: ACTIVITIES */}
        <div className="bg-[#141311] border border-[#2C2822] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#C8754A]/40 transition-colors">
          <div>
            <div className="text-[10px] font-mono text-[#918A7D] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>03 · ACTIVITIES</span>
              <Layers className="w-3.5 h-3.5 text-[#C8754A]" />
            </div>
            <div className="text-sm font-mono font-semibold text-[#EEE7DA]">
              {project.activities?.length || 0} Components
            </div>
            <div className="text-[10px] text-[#918A7D] mt-0.5">
              Documented Scope
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#2C2822] text-[10px] font-mono text-[#918A7D]">
            <span>{project.locations?.length || 0} Geotagged Sites</span>
          </div>
        </div>

        {/* Step 4: MEDIA */}
        <div className="bg-[#141311] border border-[#2C2822] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#C8754A]/40 transition-colors">
          <div>
            <div className="text-[10px] font-mono text-[#918A7D] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>04 · MEDIA</span>
              <Camera className="w-3.5 h-3.5 text-[#D77A8B]" />
            </div>
            <div className="text-sm font-mono font-semibold text-[#EEE7DA]">
              {mediaCount} Assets
            </div>
            <div className="text-[10px] text-[#918A7D] mt-0.5">
              Cloudinary Vault
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#2C2822] text-[10px] font-mono text-[#D77A8B]">
            <span>EXIF + GNSS Tagged</span>
          </div>
        </div>

        {/* Step 5: EVIDENCE */}
        <div className="bg-[#141311] border border-[#2C2822] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#C8754A]/40 transition-colors">
          <div>
            <div className="text-[10px] font-mono text-[#918A7D] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>05 · EVIDENCE</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D5A04B]" />
            </div>
            <div className="text-sm font-mono font-bold text-[#D5A04B]">
              {evidenceScore}%
            </div>
            <div className="text-[10px] text-[#918A7D] mt-0.5">
              Confidence Score
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#2C2822] text-[10px] font-mono text-[#918A7D]">
            <span>Comparative Pairs</span>
          </div>
        </div>

        {/* Step 6: IMPACT */}
        <div className="bg-[#141311] border border-[#2C2822] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#C8754A]/40 transition-colors">
          <div>
            <div className="text-[10px] font-mono text-[#918A7D] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>06 · IMPACT</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C8754A]" />
            </div>
            <div className="text-xs font-serif font-medium text-[#EEE7DA] line-clamp-2">
              Verifiable Ground Proof
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#2C2822] text-[10px] font-mono text-[#C8754A]">
            <span>Auditable Claim</span>
          </div>
        </div>
      </div>

      {/* Financial Allocation Transparency Banner */}
      <div className="mt-5 p-4 rounded-lg bg-[#141311] border border-[#2C2822]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#D5A04B] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#EEE7DA]">
                Component-Level Allocation Disclosure
              </div>
              <div className="text-xs text-[#918A7D] mt-0.5">
                {hasActivityAllocations ? (
                  <span>Contractual sub-allocations verified from project procurement schedule.</span>
                ) : (
                  <span>Activity-level financial breakdown unavailable from source. Total commitment sanctioned at project level.</span>
                )}
              </div>
            </div>
          </div>

          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider bg-[#211F1B] hover:bg-[#2C2822] text-[#C8754A] border border-[#C8754A]/30 transition-colors shrink-0"
            data-cursor="target"
          >
            <span>VIEW SOURCE DATA</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
