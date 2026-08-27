import {
  Check,
  ScanSearch,
  Brain,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function ProcessingTimeline() {
  const steps = [
    ["Image received", Check],
    ["Objects detected", ScanSearch],
    ["Information extracted", Brain],
    ["Information verified", ShieldCheck],
    ["Actions prepared", Sparkles],
  ];

  return (
    <div className="processing-timeline">
      {steps.map(([label, Icon], index) => (
        <div
          className="timeline-step"
          key={label}
        >
          <div className="timeline-icon">
            <Icon size={15} />
          </div>

          <span>{label}</span>

          {index !== steps.length - 1 && (
            <div className="timeline-line" />
          )}
        </div>
      ))}
    </div>
  );
}