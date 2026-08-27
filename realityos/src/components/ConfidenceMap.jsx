import { CheckCircle2, AlertCircle } from "lucide-react";

export default function ConfidenceMap({ insights }) {
  return (
    <div className="confidence-map">
      {insights.map((insight) => {
        const Icon = insight.verified ? CheckCircle2 : AlertCircle;

        return (
          <div className="confidence-row" key={insight.id}>
            <div className="confidence-label">
              <Icon size={16} />
              <div>
                <strong>{insight.label}</strong>
                <span>{insight.verified ? "Verified" : "Needs review"}</span>
              </div>
            </div>
            <div className="confidence-track">
              <div style={{ width: `${insight.confidence}%` }} />
            </div>
            <span className="confidence-number">{insight.confidence}%</span>
          </div>
        );
      })}
    </div>
  );
}
