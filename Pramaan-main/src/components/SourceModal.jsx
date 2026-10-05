import React from 'react';
import { X, ExternalLink, ShieldCheck, Database, Clock, AlertTriangle } from 'lucide-react';

export default function SourceModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const { source, timestamp } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#191815] border border-[#2C2822] rounded-lg p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2C2822]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#C8754A]/10 border border-[#C8754A]/30 text-[#C8754A]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#918A7D] uppercase">Data Provenance Record</span>
              <h3 className="text-lg font-serif font-medium text-[#EEE7DA]">{source.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#918A7D] hover:text-[#EEE7DA] hover:bg-[#211F1B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-sm text-[#EEE7DA]/90">
          <div>
            <p className="text-xs text-[#918A7D] mb-1">Description</p>
            <p className="font-sans leading-relaxed text-[#EEE7DA]/80">{source.tagline || source.description}</p>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 p-2.5 rounded bg-[#11110F] border border-[#2C2822]">
            <Clock className="w-4 h-4 text-[#D5A04B] shrink-0" />
            <div className="text-xs">
              <span className="text-[#918A7D]">Data retrieved: </span>
              <span className="font-mono text-[#EEE7DA]">
                {timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Endpoint / Source URL */}
          <div className="space-y-1">
            <span className="text-xs text-[#918A7D]">Connected Endpoint</span>
            <div className="flex items-center justify-between p-2 rounded bg-[#11110F] border border-[#2C2822] text-xs font-mono text-[#918A7D] break-all">
              <span>{source.endpoint || source.url}</span>
              {source.catalogUrl && (
                <a
                  href={source.catalogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 inline-flex items-center gap-1 text-[#C8754A] hover:underline shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Catalog</span>
                </a>
              )}
            </div>
          </div>

          {/* Limitations Disclosure */}
          {source.limitations && (
            <div className="p-3 rounded bg-[#C75B45]/10 border border-[#C75B45]/25 text-xs text-[#EEE7DA]">
              <div className="flex items-center gap-2 text-[#C75B45] font-medium mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Scope & Transparency Disclosure</span>
              </div>
              <p className="text-[#EEE7DA]/80 leading-relaxed">{source.limitations}</p>
            </div>
          )}

          {/* Attribution */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#2C2822] text-[#918A7D]">
            <span>Attribution: {source.attribution}</span>
            <div className="flex items-center gap-1 text-[#D5A04B]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cryptographically Audited</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded bg-[#211F1B] hover:bg-[#2C2822] text-[#EEE7DA] transition-colors border border-[#2C2822]"
          >
            Close Provenance
          </button>
        </div>
      </div>
    </div>
  );
}
