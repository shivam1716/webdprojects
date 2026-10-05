import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

// Per-location thumbnail images (free Unsplash, no API key)
const LOCATION_IMAGES = {
  lake:   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop',
  tree:   'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=400&auto=format&fit=crop',
  school: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=400&auto=format&fit=crop',
  other:  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&auto=format&fit=crop',
};

const ALL_LOCATIONS = [
  { id: 'loc_lucknow', name: 'Lake Restoration',     zone: 'Zone B',        state: 'Lucknow',     lat: 26.8467, lng: 80.9462, type: 'lake',   evidenceScore: 92, visits: 12, photos: 84, videos: 7  },
  { id: 'loc_indore',  name: 'Tree Plantation',       zone: 'Indore Basin',  state: 'Indore',      lat: 22.7196, lng: 75.8577, type: 'tree',   evidenceScore: 78, visits: 8,  photos: 45, videos: 3  },
  { id: 'loc_varanasi',name: 'School Upgrade',        zone: 'Varanasi East', state: 'Varanasi',    lat: 25.3176, lng: 82.9739, type: 'school', evidenceScore: 85, visits: 14, photos: 62, videos: 4  },
  { id: 'loc_gujarat', name: 'Water Harvesting',      zone: 'Kutch Basin',   state: 'Gujarat',     lat: 23.2420, lng: 69.6669, type: 'other',  evidenceScore: 64, visits: 6,  photos: 30, videos: 2  },
  { id: 'loc_south',   name: 'Canopy Reforestation',  zone: 'Nilgiris',      state: 'Tamil Nadu',  lat: 11.4064, lng: 76.6932, type: 'tree',   evidenceScore: 88, visits: 11, photos: 54, videos: 5  },
  { id: 'loc_bengal',  name: 'Mangrove Buffer',       zone: 'Sundarbans',    state: 'West Bengal', lat: 21.9497, lng: 89.1833, type: 'lake',   evidenceScore: 70, visits: 7,  photos: 38, videos: 1  },
];

const PIN_COLOR = { lake: '#C8754A', school: '#D5A04B', tree: '#D77A8B', other: '#6BA4B8' };

export default function ProjectMap({
  height = '420px',
  onSelectLocation: onSelectLocationProp,
  externalSelected = null,   // controlled from parent (EvidenceMapView)
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [activeLocation, setActiveLocation] = useState(ALL_LOCATIONS[0]);

  // If parent controls selection (e.g. from sidebar list), sync it
  useEffect(() => {
    if (externalSelected) setActiveLocation(externalSelected);
  }, [externalSelected]);

  const handleSelect = (loc) => {
    setActiveLocation(loc);
    if (onSelectLocationProp) onSelectLocationProp(loc);
    // Pan map to clicked pin
    if (mapRef.current) {
      mapRef.current.flyTo([loc.lat, loc.lng], 7, { duration: 0.8 });
    }
  };

  // Build map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [22.5937, 78.9629],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });

    // ── OpenStreetMap — completely free, zero API key needed ──
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { subdomains: 'abc', maxZoom: 19 }
    ).addTo(map);

    mapRef.current = map;

    // Add pins
    ALL_LOCATIONS.forEach((loc) => {
      const color = PIN_COLOR[loc.type] || '#C8754A';

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:24px;height:24px;cursor:pointer;">
            <span style="position:absolute;inset:-8px;border-radius:50%;background:${color};opacity:0.35;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>
            <div style="position:relative;width:22px;height:22px;border-radius:50%;background:rgba(20,18,15,0.88);border:2.5px solid ${color};box-shadow:0 0 10px ${color}88;display:flex;align-items:center;justify-content:center;">
              <div style="width:8px;height:8px;border-radius:50%;background:${color};"></div>
            </div>
            <span style="position:absolute;top:26px;left:50%;transform:translateX(-50%);font-size:9px;font-family:monospace;color:rgba(255,255,255,0.9);background:rgba(0,0,0,0.6);padding:1px 5px;border-radius:3px;white-space:nowrap;border:1px solid rgba(255,255,255,0.12);">• ${loc.state}</span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon });
      marker.on('click', () => handleSelect(loc));
      marker.addTo(map);
      markersRef.current[loc.id] = marker;
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const img = LOCATION_IMAGES[activeLocation?.type] || LOCATION_IMAGES.other;
  const color = PIN_COLOR[activeLocation?.type] || '#C8754A';

  return (
    <div className="w-full relative overflow-hidden rounded-xl border border-[#26231E] select-none" style={{ height }}>
      {/* Leaflet canvas — invert + hue-rotate turns OSM into a dark premium map */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0"
        style={{ filter: 'invert(1) hue-rotate(180deg) brightness(0.75) contrast(1.1) saturate(0.85)' }}
      />

      {/* "INDIA" ghost label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-white/10 font-serif tracking-[0.3em] text-2xl font-bold uppercase">
        INDIA
      </div>

      {/* ── Floating active-location card (top-center, updates on click) ── */}
      <div
        key={activeLocation?.id}
        className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-[#161513]/95 backdrop-blur-md border rounded-xl p-2.5 shadow-2xl flex items-center gap-3 max-w-[240px] animate-fadeIn transition-all cursor-pointer"
        style={{ borderColor: `${color}66` }}
      >
        <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: `${color}55` }}>
          <img src={img} alt={activeLocation?.name} className="w-full h-full object-cover" />
        </div>
        <div className="pr-1 min-w-0">
          <div className="text-xs font-semibold text-white font-serif leading-tight truncate">
            {activeLocation?.name}
          </div>
          <div className="text-[11px] font-mono mt-0.5 flex items-center gap-1.5" style={{ color: '#D5A04B' }}>
            <span>{activeLocation?.zone}</span>
            <span>•</span>
            <span className="font-bold" style={{ color }}>{activeLocation?.evidenceScore}% evidence</span>
          </div>
        </div>
      </div>

      {/* ── Legend bottom-right ── */}
      <div className="absolute bottom-3 right-3 z-20 bg-[#161513]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 text-[11px] space-y-2 shadow-2xl text-left">
        {[
          { label: 'Lake Restoration', color: '#C8754A' },
          { label: 'School Upgrade',   color: '#D5A04B' },
          { label: 'Tree Plantation',  color: '#D77A8B' },
          { label: 'Other Projects',   color: '#6BA4B8' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
            <span className="text-white/90 font-medium font-sans">{l.label}</span>
          </div>
        ))}
      </div>

      {/* ── Tile source badge top-left ── */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-[#161513]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-white/80">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>OpenStreetMap · Free Tiles</span>
      </div>

      {/* ping keyframe injected once */}
      <style>{`@keyframes ping{75%,100%{transform:scale(2);opacity:0}}`}</style>
    </div>
  );
}
