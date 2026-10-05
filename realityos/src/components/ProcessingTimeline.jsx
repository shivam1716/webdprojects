import {
  Check,
  ScanSearch,
  Brain,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function ProcessingTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    ["Image received", Check],
    ["Objects detected", ScanSearch],
    ["Information extracted", Brain],
    ["Information verified", ShieldCheck],
    ["Actions prepared", Sparkles],
  ];

  useEffect(() => {
    const timer = window.setInterval(() => setActiveStep((step) => Math.min(step + 1, steps.length - 1)), 850);
    return () => window.clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="processing-timeline" aria-live="polite">
      {steps.map(([label, Icon], index) => (
        <div
          className={`timeline-step ${index < activeStep ? "complete" : ""} ${index === activeStep ? "active" : ""}`}
          key={label}
        >
          <div className="timeline-icon">
            <Icon size={15} />
          </div>

          <span>{label}{index === activeStep && <small>Live</small>}</span>

          {index !== steps.length - 1 && (
            <div className="timeline-line" />
          )}
        </div>
      ))}
    </div>
  );
}
