import {
  Brain,
  Search,
  Calendar,
  MapPin,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { getMemories, removeMemory } from "../services/memoryService";

export default function MemoryPanel() {
  const starterMemories = [
    {
      title: "Electricity account",
      detail: "City Power · AC-204891",
      icon: Calendar,
    },
    {
      title: "Home utility bill",
      detail: "Due near the end of each month",
      icon: Brain,
    },
    {
      title: "Preferred payment center",
      detail: "Saved location",
      icon: MapPin,
    },
  ];
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(() => getMemories());
  const memories = [...saved.map((memory) => ({ ...memory, saved: true, icon: Brain })), ...starterMemories]
    .filter((memory) => `${memory.title} ${memory.detail}`.toLowerCase().includes(query.toLowerCase()));

  const forget = (id) => {
    removeMemory(id);
    setSaved((items) => items.filter((memory) => memory.id !== id));
  };

  return (
    <div className="memory-page">
      <div className="page-intro">
        <div className="ai-large-icon">
          <Brain size={24} />
        </div>

        <span className="eyebrow">
          PERSONAL CONTEXT
        </span>

        <h2>Reality Memory</h2>

        <p>
          Things you've intentionally asked
          RealityOS to remember.
        </p>
      </div>

      <div className="memory-search">
        <Search size={18} />

        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your reality..." />
      </div>

      <div className="memory-list">
        {memories.map((memory) => {
          const Icon = memory.icon;

          return (
            <div
              className="memory-card"
              key={memory.id || memory.title}
            >
              <div className="memory-icon">
                <Icon size={18} />
              </div>

              <div>
                <strong>{memory.title}</strong>
                <span>{memory.detail}</span>
              </div>
              {memory.saved && <button className="memory-remove" onClick={() => forget(memory.id)} aria-label={`Forget ${memory.title}`} title="Forget this memory"><Trash2 size={14} /></button>}
            </div>
          );
        })}
      </div>
      {!memories.length && <div className="memory-empty"><Search size={17} /> No memories match that search.</div>}
    </div>
  );
}
