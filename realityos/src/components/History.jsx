import { useState } from "react";
import { Check, Clock, FileText, ShieldCheck, X } from "lucide-react";

const initialHistory = [
  { id: "electricity-bill", title: "Electricity Bill", detail: "₹2,480 · Due Aug 31", time: "2 min ago", summary: "A City Power electricity bill with an upcoming payment date.", fields: [["Amount due", "₹2,480"], ["Due date", "31 Aug 2026"], ["Account", "AC-204891"]], confidence: 97 },
  { id: "product-package", title: "Product Package", detail: "Expiry · Aug 28", time: "1 hour ago", summary: "A product label with an expiry date that is coming up soon.", fields: [["Product", "Daily Essentials Pack"], ["Expiry date", "28 Aug 2026"], ["Status", "Use soon"]], confidence: 94 },
  { id: "college-notice", title: "College Notice", detail: "Deadline · Aug 30", time: "3 hours ago", summary: "A college notice containing a submission deadline and instructions.", fields: [["Deadline", "30 Aug 2026"], ["Category", "Student submission"], ["Status", "Action needed"]], confidence: 92 },
];

export default function History() {
  const [history, setHistory] = useState(initialHistory);
  const [selected, setSelected] = useState(null);
  const markReviewed = () => {
    setHistory((items) => items.map((item) => item.id === selected.id ? { ...item, reviewed: true } : item));
    setSelected((item) => ({ ...item, reviewed: true }));
  };

  return <div className="history-page">
    <div className="page-intro"><span className="eyebrow">VISUAL HISTORY</span><h2>Recent Reality</h2><p>Things you've recently asked RealityOS to understand.</p></div>
    <div className="history-list">
      {history.map((item) => <button className="history-card" key={item.id} onClick={() => setSelected(item)}><div className="history-icon"><FileText size={18} /></div><div className="history-content"><strong>{item.title}</strong><span>{item.detail}</span><small><Clock size={12} />{item.reviewed ? "Reviewed" : item.time}</small></div><span className="history-open">Open</span></button>)}
    </div>
    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><section className="history-modal" role="dialog" aria-modal="true" aria-label={`${selected.title} details`} onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">SAVED ANALYSIS</span><h3>{selected.title}</h3></div><button className="icon-button" onClick={() => setSelected(null)} aria-label="Close details"><X size={18} /></button></div><p className="history-summary">{selected.summary}</p><div className="history-confidence"><ShieldCheck size={17} /><span>{selected.confidence}% confidence</span></div><div className="history-fields">{selected.fields.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="history-actions"><button className="secondary-action" onClick={() => setSelected(null)}>Close</button><button className="primary-action" disabled={selected.reviewed} onClick={markReviewed}><Check size={16} />{selected.reviewed ? "Reviewed" : "Mark as reviewed"}</button></div></section></div>}
  </div>;
}
