import React from 'react';
import { AlertTriangle, Clock, MapPinOff, FileSearch, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function EvidenceGapCard({ gaps = [], onRequestEvidence }) {
  const getGapIcon = (type) => {
    switch (type) {
      case 'missing_location_evidence':
        return <MapPinOff className="w-4 h-4 text-[#C75B45]" />;
      case 'missing_recent_visit':
        return <Clock className="w-4 h-4 text-[#D5A04B]" />;
      case 'insufficient_before_after':
        return <FileSearch className="w-4 h-4 text-[#D77A8B]" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-[#C75B45]" />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-[#C75B45] border-[#C75B45]/40 bg-[#C75B45]/10';
      case 'medium':
        return 'text-[#D5A04B] border-[#D5A04B]/40 bg-[#D5A04B]/10';
      default:
        return 'text-[#918A7D] border-[#918A7D]/40 bg-[#918A7D]/10';
    }
  };

  return (
    <div className="w-full bg-[#191815] border border-[#2C2822] rounded-lg p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-[#2C2822]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#C75B45]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#C75B45] font-semibold">
            WHAT'S MISSING?
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#918A7D]">
          {gaps.length} {gaps.length === 1 ? 'Audit Gap' : 'Audit Gaps'} Identified
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {gaps.length === 0 ? (
          <div className="p-4 rounded bg-[#11110F] border border-[#2C2822] text-center">
            <CheckCircle2 className="w-5 h-5 text-[#D5A04B] mx-auto mb-1.5" />
            <div className="text-xs font-serif text-[#EEE7DA]">Full Photographic Verification Established</div>
            <p className="text-[11px] text-[#918A7D] mt-1">
              All registered project locations and activities possess verified ground media records.
            </p>
          </div>
        ) : (
          gaps.map((gap) => (
            <div
              key={gap.id}
              className="p-3.5 rounded-lg bg-[#141311] border border-[#2C2822] hover:border-[#C75B45]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">{getGapIcon(gap.gapType)}</div>
                  <div>
                    <h5 className="text-xs font-semibold text-[#EEE7DA]">{gap.title}</h5>
                    <p className="text-[11px] text-[#918A7D] mt-1 leading-relaxed">
                      {gap.description}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border shrink-0 ${getSeverityBadge(gap.severity)}`}>
                  {gap.severity}
                </span>
              </div>

              {/* Action row */}
              <div className="mt-3 pt-2.5 border-t border-[#2C2822] flex items-center justify-between text-[11px]">
                <span className="text-[#918A7D] truncate max-w-[200px]">
                  Target: <strong className="text-[#EEE7DA]">{gap.targetEntity}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => onRequestEvidence && onRequestEvidence(gap)}
                  className="inline-flex items-center gap-1 text-[#C8754A] hover:underline font-mono text-[10px] uppercase tracking-wider"
                  data-cursor="target"
                >
                  <span>Request Evidence</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
