import {
  Calendar,
  IndianRupee,
  FileText,
  Hash,
  CheckCircle2,
  AlertCircle,
  Brain,
} from "lucide-react";

const icons = {
  currency: IndianRupee,
  date: Calendar,
  text: FileText,
};

export default function ExtractedCard({
  insight,
  onEvidence,
  onRemember,
}) {
  const Icon = icons[insight.type] || Hash;

  return (
    <div className="extracted-card">
      <div className="extracted-icon">
        <Icon size={18} />
      </div>

      <div className="extracted-main">
        <span>{insight.label}</span>
        <strong>{insight.value}</strong>
      </div>

      <div
        className={`confidence-mini ${
          insight.verified
            ? "verified"
            : "uncertain"
        }`}
      >
        {insight.verified ? (
          <CheckCircle2 size={13} />
        ) : (
          <AlertCircle size={13} />
        )}

        {insight.confidence}%
      </div>

      <button
        className="evidence-button"
        onClick={() => onEvidence(insight)}
      >
        Evidence
      </button>

      {onRemember && <button
        className="remember-button"
        onClick={() => onRemember(insight)}
        aria-label={`Remember ${insight.label}`}
        title="Remember this fact"
      >
        <Brain size={14} />
      </button>}
    </div>
  );
}
