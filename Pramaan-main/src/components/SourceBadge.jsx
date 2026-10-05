import React from 'react';
import { getSourceDetails } from '../config/dataSources';

/**
 * Clickable Source Transparency Badge
 */
export default function SourceBadge({ source, timestamp, onOpenDetails, className = '' }) {
  const details = getSourceDetails(source);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (onOpenDetails) onOpenDetails({ source: details, timestamp });
      }}
      title={`Click to view verifiable source metadata for ${details.name}`}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border uppercase transition-all duration-150 hover:bg-surface-hover ${details.badgeColor} ${className}`}
      data-cursor="target"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse" />
      <span>SRC: {details.shortName}</span>
    </button>
  );
}
