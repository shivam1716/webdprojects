import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, MapPin, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import SourceBadge from './SourceBadge';

export default function AskTheEvidence({ projects = [], mediaList = [], onSelectProject, onOpenSourceDetails }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Generate suggested dynamic query examples from actual projects
  const sampleProject = projects[0];
  const suggestedQueries = [
    sampleProject ? `Evidence for ${sampleProject.title.substring(0, 30)}...` : 'Find projects with evidence of completed environmental work',
    'Find riparian buffer waste removal evidence',
    'Hydrology and check dam telemetry records'
  ];

  useEffect(() => {
    if (!query.trim()) {
      // By default show recent verified evidence matches
      const initial = [];
      mediaList.slice(0, 3).forEach((media) => {
        const proj = projects.find(p => p.id === media.projectId) || { title: 'Development Financing Operation', id: media.projectId };
        initial.push({
          media,
          project: proj,
          relevance: 'High Confidence Match'
        });
      });
      setResults(initial);
      return;
    }

    const q = query.toLowerCase().trim();
    const matched = [];

    mediaList.forEach((media) => {
      const proj = projects.find(p => p.id === media.projectId) || { title: 'Verified Operation', id: media.projectId, sector: 'Development' };
      const textCorpus = `${proj.title} ${proj.sector} ${media.locationName} ${media.activityName} ${media.tags.join(' ')}`.toLowerCase();

      if (textCorpus.includes(q)) {
        matched.push({
          media,
          project: proj,
          relevance: 'Verified Ground Trace'
        });
      }
    });

    setResults(matched);
  }, [query, projects, mediaList]);

  return (
    <div className="w-full bg-[#191815] border border-[#2C2822] rounded-lg p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2C2822]">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-[#C8754A]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#EEE7DA] font-semibold">
            ASK THE EVIDENCE
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#918A7D]">
          Metadata Query Engine
        </span>
      </div>

      {/* Query Input */}
      <div className="mt-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verified metadata, e.g. 'riparian buffer', 'canal desiltation', or project code..."
            className="w-full pl-10 pr-24 py-2.5 rounded bg-[#11110F] border border-[#2C2822] text-xs font-sans text-[#EEE7DA] placeholder-[#918A7D]/60 focus:outline-none focus:border-[#C8754A] transition-colors"
            data-cursor="target"
          />
          <Search className="w-4 h-4 text-[#918A7D] absolute left-3.5 top-3" />
          <div className="absolute right-2 top-1.5 flex items-center">
            <span className="text-[10px] font-mono text-[#918A7D] px-2 py-1 rounded bg-[#191815] border border-[#2C2822]">
              {results.length} results
            </span>
          </div>
        </div>

        {/* Dynamic Suggested Query Chips */}
        <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
          <span className="text-[#918A7D] text-[10px] uppercase font-mono tracking-wider shrink-0">Try:</span>
          {suggestedQueries.map((suggested, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setQuery(suggested.replace('...', ''))}
              className="text-[#C8754A] hover:text-[#EEE7DA] bg-[#C8754A]/10 hover:bg-[#C8754A]/20 px-2 py-0.5 rounded border border-[#C8754A]/20 transition-colors whitespace-nowrap text-[11px]"
              data-cursor="target"
            >
              {suggested}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {results.length === 0 ? (
          <div className="col-span-3 p-6 text-center bg-[#11110F] rounded border border-[#2C2822] text-[#918A7D] text-xs">
            No verified evidence metadata matching "{query}". Try adjusting keywords.
          </div>
        ) : (
          results.map(({ media, project }, idx) => (
            <div
              key={idx}
              onClick={() => onSelectProject && onSelectProject(project.id)}
              className="bg-[#141311] border border-[#2C2822] rounded-lg overflow-hidden hover:border-[#C8754A]/50 transition-all duration-200 cursor-pointer flex flex-col group"
              data-cursor="target"
            >
              {/* Media Thumbnail */}
              <div className="relative h-28 w-full bg-black overflow-hidden">
                <img
                  src={media.thumbnailUrl || media.url}
                  alt={media.activityName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-[#11110F]/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-mono text-[#D5A04B] border border-[#D5A04B]/30">
                  {media.locationName}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="text-[10px] font-mono text-[#918A7D] uppercase tracking-wider mb-0.5">
                    {project.id}
                  </div>
                  <h5 className="text-xs font-serif font-semibold text-[#EEE7DA] line-clamp-1 group-hover:text-[#C8754A] transition-colors">
                    {project.title}
                  </h5>
                  <div className="text-[11px] text-[#918A7D] line-clamp-1 mt-1">
                    Activity: <span className="text-[#EEE7DA]">{media.activityName}</span>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="pt-2 border-t border-[#2C2822] flex items-center justify-between text-[10px] font-mono text-[#918A7D]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(media.captureDate).toLocaleDateString()}</span>
                  </div>

                  <SourceBadge
                    source={media.source}
                    timestamp={media.retrievedAt}
                    onOpenDetails={onOpenSourceDetails}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
