import {
  Brain,
  Search,
  Calendar,
  MapPin,
} from "lucide-react";

export default function MemoryPanel() {
  const memories = [
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

        <input placeholder="Search your reality..." />
      </div>

      <div className="memory-list">
        {memories.map((memory) => {
          const Icon = memory.icon;

          return (
            <div
              className="memory-card"
              key={memory.title}
            >
              <div className="memory-icon">
                <Icon size={18} />
              </div>

              <div>
                <strong>{memory.title}</strong>
                <span>{memory.detail}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}