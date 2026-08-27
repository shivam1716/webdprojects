import {
  X,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

export default function EvidenceViewer({
  insight,
  onClose,
}) {
  if (!insight) return null;

  return (
    <div className="modal-backdrop">
      <div className="evidence-modal">
        <div className="modal-header">
          <div>
            <span className="eyebrow">
              VISUAL EVIDENCE
            </span>

            <h3>{insight.label}</h3>
          </div>

          <button
            className="icon-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="evidence-image">
          <ScanSearch size={40} />

          <div className="evidence-highlight">
            {insight.value}
          </div>
        </div>

        <div className="evidence-result">
          <ShieldCheck size={18} />

          <div>
            <strong>
              {insight.confidence}% confidence
            </strong>

            <p>
              RealityOS extracted this information
              from the highlighted visual evidence.
            </p>
          </div>
        </div>

        <div className="evidence-text">
          <span>Detected text</span>
          <strong>{insight.evidence}</strong>
        </div>
      </div>
    </div>
  );
}