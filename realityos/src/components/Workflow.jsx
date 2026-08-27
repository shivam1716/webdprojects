const steps = [
  { id: "explain", label: "Explain" },
  { id: "verify", label: "Verify" },
  { id: "act", label: "Act" },
];

export default function Workflow({ active, onChange }) {
  return (
    <nav className="workflow" aria-label="Analysis workflow">
      {steps.map((step, index) => (
        <div className="workflow-item" key={step.id}>
          <button
            className={`workflow-button ${active === step.id ? "active" : ""}`}
            onClick={() => onChange(step.id)}
          >
            <span>{index + 1}</span>
            {step.label}
          </button>
          {index < steps.length - 1 && <div className="workflow-line" />}
        </div>
      ))}
    </nav>
  );
}
