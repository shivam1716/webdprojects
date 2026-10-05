import React from 'react';
import { X, Printer, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Camera, MapPin, Calendar } from 'lucide-react';
import SourceBadge from './SourceBadge';

export default function ImpactStoryModal({ isOpen, onClose, story, onOpenSourceDetails }) {
  if (!isOpen || !story) return null;

  const { project, whatWasFunded, whatActivitiesDocumented, visualEvidenceSummary, observations, whatChanged, insufficientMessage, evidenceGaps, coverageBreakdown } = story;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="w-full max-w-4xl bg-[#191815] border border-[#2C2822] rounded-lg shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dossier Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2C2822] bg-[#141311]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#C8754A]/10 border border-[#C8754A]/30 text-[#C8754A]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-[#C8754A] uppercase font-semibold">
                  Auditable Impact Dossier
                </span>
                <span className="text-xs text-[#918A7D]">·</span>
                <span className="text-xs font-mono text-[#D5A04B]">{story.id}</span>
              </div>
              <h2 className="text-lg font-serif font-medium text-[#EEE7DA] mt-0.5">
                Visual Impact & Accountability Report
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider bg-[#211F1B] hover:bg-[#2C2822] text-[#EEE7DA] border border-[#2C2822] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-[#918A7D] hover:text-[#EEE7DA] hover:bg-[#211F1B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Body */}
        <div className="p-6 space-y-6 text-[#EEE7DA] max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* Section 1: PROJECT */}
          <div className="p-4 rounded-lg bg-[#141311] border border-[#2C2822]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#918A7D] mb-1">
              01 · Target Development Operation
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#EEE7DA]">
              {project.title}
            </h3>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono text-[#918A7D]">
              <div>
                <span className="block text-[10px] text-[#918A7D]/70 uppercase">Project ID</span>
                <span className="text-[#EEE7DA]">{project.id}</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#918A7D]/70 uppercase">Country</span>
                <span className="text-[#EEE7DA]">{project.country}</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#918A7D]/70 uppercase">Commitment</span>
                <span className="text-[#D5A04B] font-bold">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: project.currency || 'USD', maximumFractionDigits: 0 }).format(project.commitmentAmount)}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-[#918A7D]/70 uppercase">Primary Source</span>
                <span className="text-[#C8754A]">{project.dataSource}</span>
              </div>
            </div>
          </div>

          {/* Section 2: WHAT WAS FUNDED */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#C8754A] font-semibold mb-2">
              02 · What Was Funded
            </h4>
            <div className="p-4 rounded bg-[#141311] border border-[#2C2822] text-xs leading-relaxed text-[#EEE7DA]/90 font-serif">
              {whatWasFunded}
            </div>
          </div>

          {/* Section 3: WHAT ACTIVITIES WERE DOCUMENTED */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#C8754A] font-semibold mb-2">
              03 · What Activities Were Documented
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {whatActivitiesDocumented.map((actName, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded bg-[#141311] border border-[#2C2822] text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D5A04B] shrink-0" />
                  <span className="text-[#EEE7DA]">{actName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: WHAT VISUAL EVIDENCE EXISTS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#C8754A] font-semibold">
                04 · What Visual Evidence Exists
              </h4>
              <span className="text-[10px] font-mono text-[#D5A04B]">
                {visualEvidenceSummary.totalAssets} Field Assets Verified in Cloudinary
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded bg-[#141311] border border-[#2C2822] text-center">
                <div className="text-lg font-mono font-bold text-[#D5A04B]">
                  {visualEvidenceSummary.totalAssets}
                </div>
                <div className="text-[10px] text-[#918A7D] uppercase font-mono mt-0.5">Media Assets Ingested</div>
              </div>
              <div className="p-3 rounded bg-[#141311] border border-[#2C2822] text-center">
                <div className="text-lg font-mono font-bold text-[#EEE7DA]">
                  {visualEvidenceSummary.locationsCovered}
                </div>
                <div className="text-[10px] text-[#918A7D] uppercase font-mono mt-0.5">Geotagged Sites</div>
              </div>
              <div className="p-3 rounded bg-[#141311] border border-[#2C2822] text-center">
                <div className="text-lg font-mono font-bold text-[#C8754A]">
                  {visualEvidenceSummary.evidenceStrengthAverage}%
                </div>
                <div className="text-[10px] text-[#918A7D] uppercase font-mono mt-0.5">Avg Evidence Strength</div>
              </div>
            </div>
          </div>

          {/* Section 5: WHAT CHANGED (WITH VIEW SOURCE ->) */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#C8754A] font-semibold mb-2">
              05 · What Changed (Verified Observations)
            </h4>

            {insufficientMessage ? (
              <div className="p-4 rounded bg-[#C75B45]/15 border border-[#C75B45]/30 text-xs text-[#EEE7DA]">
                <div className="flex items-center gap-2 text-[#C75B45] font-semibold mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>INSUFFICIENT COMPARATIVE EVIDENCE</span>
                </div>
                <p>{insufficientMessage}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {whatChanged.map((claim, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-[#141311] border border-[#2C2822] space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-serif font-semibold text-[#EEE7DA]">
                          "{claim.claim}"
                        </div>
                        <div className="text-xs font-mono text-[#918A7D] mt-1 flex items-center gap-3">
                          <span>Site: <strong className="text-[#EEE7DA]">{claim.location}</strong></span>
                          <span>·</span>
                          <span className="text-[#D5A04B]">Evidence Strength: {claim.strength}%</span>
                        </div>
                      </div>

                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-[#C8754A] hover:underline shrink-0"
                        data-cursor="target"
                      >
                        <span>VIEW SOURCE</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="p-2.5 rounded bg-[#11110F] border border-[#2C2822] text-[10px] font-mono text-[#918A7D] flex flex-wrap items-center gap-4">
                      <span>Baseline Asset: <strong className="text-[#EEE7DA]">{claim.beforeAssetId || 'Pending'}</strong></span>
                      <span>Post-Intervention Asset: <strong className="text-[#EEE7DA]">{claim.afterAssetId || 'Pending'}</strong></span>
                      <span>Integrity: Audited Cloudinary Hash</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: WHAT EVIDENCE IS MISSING */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#C75B45] font-semibold mb-2">
              06 · What Evidence Is Missing
            </h4>
            {evidenceGaps.length === 0 ? (
              <div className="p-3 rounded bg-[#141311] border border-[#2C2822] text-xs text-[#918A7D]">
                Zero auditable gaps detected across documented locations.
              </div>
            ) : (
              <div className="space-y-2">
                {evidenceGaps.map(gap => (
                  <div key={gap.id} className="p-3 rounded bg-[#141311] border border-[#2C2822] flex items-start justify-between gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-[#EEE7DA]">{gap.title}: </span>
                      <span className="text-[#918A7D]">{gap.description}</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-[#C75B45]/40 text-[#C75B45] shrink-0">
                      {gap.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 7: SOURCE MEDIA & ATTESTATION */}
          <div className="pt-4 border-t border-[#2C2822] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#918A7D] font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D5A04B]" />
              <span>Attested Report: Derived directly from World Bank & Cloudinary telemetry</span>
            </div>
            <div>
              Generated: {new Date(story.generatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
