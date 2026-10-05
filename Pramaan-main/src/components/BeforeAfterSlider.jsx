import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SlidersHorizontal, AlertCircle, Camera, Calendar, MapPin, Hash, Database } from 'lucide-react';
import SourceBadge from './SourceBadge';

export default function BeforeAfterSlider({ beforeAsset, afterAsset, title = 'Comparative Visual Analysis', onOpenSourceDetails }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(rect.width, x));
    const percent = (clamped / rect.width) * 100;
    setSliderPos(percent);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !e.touches[0]) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Strict rule: If matching before/after media does not exist:
  if (!beforeAsset || !afterAsset) {
    return (
      <div className="w-full bg-[#191815] border border-[#2C2822] rounded-lg p-6 flex flex-col items-center justify-center min-h-[320px] text-center">
        <div className="p-3 rounded-full bg-[#C75B45]/15 border border-[#C75B45]/30 text-[#C75B45] mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-mono tracking-wider uppercase text-[#EEE7DA] mb-1">
          INSUFFICIENT COMPARABLE MEDIA
        </h4>
        <p className="text-xs text-[#918A7D] max-w-sm leading-relaxed mb-4">
          Comparative before/after analysis requires both verified baseline and post-intervention assets captured at the same ground-truth coordinates.
        </p>
        <div className="text-[11px] font-mono text-[#D5A04B] p-2 rounded bg-[#11110F] border border-[#2C2822]">
          Available assets: {beforeAsset ? 'Baseline recorded (missing post-audit)' : 'Zero baseline recorded'}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#191815] border border-[#2C2822] rounded-lg overflow-hidden shadow-lg">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2C2822] bg-[#141311]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#C8754A]" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#EEE7DA]">
            {title}
          </span>
        </div>
        <SourceBadge
          source={beforeAsset.source || 'Cloudinary'}
          timestamp={beforeAsset.retrievedAt}
          onOpenDetails={onOpenSourceDetails}
        />
      </div>

      {/* Slider Viewport */}
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          if (e.touches[0]) handleMove(e.touches[0].clientX);
        }}
        className="relative w-full h-[340px] md:h-[380px] select-none cursor-ew-resize overflow-hidden bg-black"
        data-cursor="target"
      >
        {/* AFTER Image (Background full width) */}
        <img
          src={afterAsset.url}
          alt={`After: ${afterAsset.activityName}`}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* BEFORE Image (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={beforeAsset.url}
            alt={`Before: ${beforeAsset.activityName}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Label Before */}
          <div className="absolute top-3 left-3 bg-[#11110F]/85 backdrop-blur-md px-2.5 py-1 rounded border border-[#C8754A]/40 text-[#C8754A] font-mono text-[11px] tracking-wider font-semibold">
            BEFORE · {new Date(beforeAsset.captureDate).toLocaleDateString()}
          </div>
        </div>

        {/* Label After */}
        <div className="absolute top-3 right-3 bg-[#11110F]/85 backdrop-blur-md px-2.5 py-1 rounded border border-[#D5A04B]/40 text-[#D5A04B] font-mono text-[11px] tracking-wider font-semibold pointer-events-none">
          AFTER · {new Date(afterAsset.captureDate).toLocaleDateString()}
        </div>

        {/* Divider Handle Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#EEE7DA] pointer-events-none shadow-[0_0_8px_rgba(0,0,0,0.8)]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#191815] border-2 border-[#C8754A] text-[#EEE7DA] flex items-center justify-center shadow-lg">
            <span className="text-[10px] font-mono tracking-tighter">◀ ▶</span>
          </div>
        </div>
      </div>

      {/* Metadata Footers Comparison */}
      <div className="grid grid-cols-2 divide-x divide-[#2C2822] bg-[#141311] border-t border-[#2C2822] text-[11px] font-mono text-[#918A7D]">
        {/* Left: Before Details */}
        <div className="p-3 space-y-1">
          <div className="text-[#C8754A] font-semibold uppercase tracking-wider mb-1">Baseline Ground Truth</div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3 h-3 text-[#918A7D]" />
            <span className="text-[#EEE7DA]">{beforeAsset.locationName}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3 h-3 text-[#918A7D]" />
            <span>Captured: {new Date(beforeAsset.captureDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Hash className="w-3 h-3 text-[#918A7D]" />
            <span className="text-[10px] text-[#918A7D]/70">{beforeAsset.assetId}</span>
          </div>
        </div>

        {/* Right: After Details */}
        <div className="p-3 space-y-1">
          <div className="text-[#D5A04B] font-semibold uppercase tracking-wider mb-1">Post-Intervention State</div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3 h-3 text-[#918A7D]" />
            <span className="text-[#EEE7DA]">{afterAsset.locationName}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3 h-3 text-[#918A7D]" />
            <span>Captured: {new Date(afterAsset.captureDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Hash className="w-3 h-3 text-[#918A7D]" />
            <span className="text-[10px] text-[#918A7D]/70">{afterAsset.assetId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
