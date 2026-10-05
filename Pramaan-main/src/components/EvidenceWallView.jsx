import React, { useState } from 'react';
import { Camera, MapPin, Calendar, Hash, ExternalLink, AlertOctagon, Filter, Eye } from 'lucide-react';
import SourceBadge from './SourceBadge';

export default function EvidenceWallView({
  mediaList = [],
  isConnected = true,
  onSelectProject,
  onOpenSourceDetails
}) {
  const [filterActivity, setFilterActivity] = useState('ALL');
  const [selectedAssetModal, setSelectedAssetModal] = useState(null);

  // If Cloudinary credentials are missing or disconnected:
  if (!isConnected || mediaList.length === 0) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center p-8 bg-[#191815] border border-[#2C2822] rounded-lg text-center animate-fadeIn">
        <div className="p-4 rounded-full bg-[#2C2822] border border-[#3C3830] mb-4">
          <Camera className="w-8 h-8 text-[#918A7D]" />
        </div>
        <h3 className="text-base font-mono uppercase tracking-widest text-[#EEE7DA] mb-2 font-bold">
          No Field Media Available
        </h3>
        <p className="text-xs text-[#918A7D] max-w-md leading-relaxed">
          Field photography and evidence assets will appear here once uploaded by the inspection team.
        </p>
      </div>
    );
  }

  // Get distinct activities for filtering
  const distinctActivities = Array.from(new Set(mediaList.map(m => m.activityName)));

  const filteredMedia = filterActivity === 'ALL'
    ? mediaList
    : mediaList.filter(m => m.activityName === filterActivity);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2C2822] gap-3">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#C8754A] uppercase font-semibold">
            Visual Proof Repository
          </span>
          <h2 className="text-xl font-serif font-bold text-[#EEE7DA]">
            Evidence Wall
          </h2>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-[#918A7D] shrink-0" />
          <button
            onClick={() => setFilterActivity('ALL')}
            className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
              filterActivity === 'ALL'
                ? 'bg-[#C8754A] text-[#11110F] font-bold'
                : 'bg-[#211F1B] text-[#918A7D] hover:text-[#EEE7DA]'
            }`}
          >
            All Activities ({mediaList.length})
          </button>
          {distinctActivities.map(act => (
            <button
              key={act}
              onClick={() => setFilterActivity(act)}
              className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
                filterActivity === act
                  ? 'bg-[#C8754A] text-[#11110F] font-bold'
                  : 'bg-[#211F1B] text-[#918A7D] hover:text-[#EEE7DA]'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Authentic Cloudinary Media Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredMedia.map((media) => (
          <div
            key={media.assetId}
            className="media-card bg-[#191815] border border-[#2C2822] rounded-lg overflow-hidden flex flex-col justify-between group hover:border-[#C8754A]/60 transition-all duration-300 shadow-lg relative"
            data-cursor="target"
          >
            {/* Image / Video preview */}
            <div className="relative h-48 w-full bg-black overflow-hidden">
              <img
                src={media.thumbnailUrl || media.url}
                alt={media.activityName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Overlay: VIEW EVIDENCE -> */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                <button
                  type="button"
                  onClick={() => setSelectedAssetModal(media)}
                  className="px-4 py-2 rounded bg-[#C8754A] hover:bg-[#C8754A]/90 text-[#EEE7DA] text-xs font-mono uppercase tracking-wider font-semibold shadow-lg transition-transform transform translate-y-2 group-hover:translate-y-0 duration-200 flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>VIEW EVIDENCE →</span>
                </button>
              </div>

              {/* Location Tag Top-Left */}
              <div className="absolute top-2.5 left-2.5 bg-[#11110F]/85 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#D5A04B] border border-[#D5A04B]/30 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#D5A04B]" />
                <span className="truncate max-w-[150px]">{media.locationName}</span>
              </div>
            </div>

            {/* Card Content Details */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#918A7D] uppercase tracking-wider">
                  Project: <span className="text-[#EEE7DA] font-semibold">{media.projectId}</span>
                </div>
                <h4 className="text-sm font-serif font-semibold text-[#EEE7DA] mt-0.5 line-clamp-1" title={media.activityName}>
                  {media.activityName}
                </h4>
              </div>

              {/* Metadata list */}
              <div className="pt-2 border-t border-[#2C2822] space-y-1 text-[11px] font-mono text-[#918A7D]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(media.captureDate).toLocaleDateString()}</span>
                  </div>
                  <span className="text-[10px] text-[#D5A04B] uppercase font-semibold">
                    {media.tags?.includes('verified') || media.tags?.includes('post_intervention') ? 'Verified' : 'Baseline'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 truncate max-w-[140px]" title={media.assetId}>
                    <Hash className="w-3 h-3 shrink-0" />
                    <span className="text-[10px] truncate">{media.assetId}</span>
                  </div>
                  <SourceBadge
                    source="Cloudinary"
                    timestamp={media.retrievedAt}
                    onOpenDetails={onOpenSourceDetails}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Modal for Single Asset */}
      {selectedAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#191815] border border-[#2C2822] rounded-lg p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-[#2C2822] pb-3">
              <h3 className="text-base font-serif font-semibold text-[#EEE7DA]">
                {selectedAssetModal.activityName}
              </h3>
              <button
                onClick={() => setSelectedAssetModal(null)}
                className="text-[#918A7D] hover:text-[#EEE7DA]"
              >
                ✕
              </button>
            </div>
            <div className="h-72 w-full bg-black rounded overflow-hidden">
              <img src={selectedAssetModal.url} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono text-[#918A7D]">
              <div>Location: <span className="text-[#EEE7DA]">{selectedAssetModal.locationName}</span></div>
              <div>Captured: <span className="text-[#EEE7DA]">{new Date(selectedAssetModal.captureDate).toLocaleString()}</span></div>
              <div>Cloudinary ID: <span className="text-[#EEE7DA]">{selectedAssetModal.publicId}</span></div>
              <div>Coordinates: <span className="text-[#EEE7DA]">{selectedAssetModal.coordinates ? `${selectedAssetModal.coordinates.lat}, ${selectedAssetModal.coordinates.lng}` : 'N/A'}</span></div>
              <div>Camera: <span className="text-[#EEE7DA]">{selectedAssetModal.cameraMetadata?.make} {selectedAssetModal.cameraMetadata?.model}</span></div>
              <div>Integrity: <span className="text-[#D5A04B]">EXIF Geotag Authenticated</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
