import { useState } from "react";
import { Check, Clock, FileText, ShieldCheck, X } from "lucide-react";
import { getSavedAnalyses } from "../services/historyService";

const initialHistory = [
  { id: "electricity-bill", title: "Electricity Bill", detail: "₹2,480 · Due Aug 31", time: "2 min ago", summary: "A City Power electricity bill with an upcoming payment date.", fields: [["Amount due", "₹2,480"], ["Due date", "31 Aug 2026"], ["Account", "AC-204891"]], confidence: 97 },
  { id: "product-package", title: "Product Package", detail: "Expiry · Aug 28", time: "1 hour ago", summary: "A product label with an expiry date that is coming up soon.", fields: [["Product", "Daily Essentials Pack"], ["Expiry date", "28 Aug 2026"], ["Status", "Use soon"]], confidence: 94 },
  { id: "college-notice", title: "College Notice", detail: "Deadline · Aug 30", time: "3 hours ago", summary: "A college notice containing a submission deadline and instructions.", fields: [["Deadline", "30 Aug 2026"], ["Category", "Student submission"], ["Status", "Action needed"]], confidence: 92 },
];

export default function History() {
  const [history, setHistory] = useState(() => [...getSavedAnalyses(), ...initialHistory]);
  const [selected, setSelected] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState([]);
  const [comparison, setComparison] = useState(null);
  const markReviewed = () => {
    setHistory((items) => items.map((item) => item.id === selected.id ? { ...item, reviewed: true } : item));
    setSelected((item) => ({ ...item, reviewed: true }));
  };

  const toggleCompare = (item) => {
    setCompareSelection((items) => items.some((entry) => entry.id === item.id)
      ? items.filter((entry) => entry.id !== item.id)
      : items.length < 2 ? [...items, item] : [items[1], item]);
  };

  const closeCompare = () => {
    setComparison(null);
    setCompareMode(false);
    setCompareSelection([]);
  };

  return <div className="history-page">
    <div className="page-intro"><div className="history-heading"><div><span className="eyebrow">VISUAL HISTORY</span><h2>Recent Reality</h2><p>Things you've recently asked RealityOS to understand.</p></div><button className={`compare-trigger ${compareMode ? "active" : ""}`} onClick={() => { setCompareMode((value) => !value); setCompareSelection([]); }}>{compareMode ? "Exit compare" : "Compare scans"}</button></div>{compareMode && <div className="compare-hint">Select two scans to see what changed. <button disabled={compareSelection.length !== 2} onClick={() => setComparison(compareSelection)}>Compare selected ({compareSelection.length}/2)</button></div>}</div>
    <div className="history-list">
      {history.map((item) => <button className={`history-card ${compareSelection.some((entry) => entry.id === item.id) ? "compare-selected" : ""}`} key={item.id} onClick={() => compareMode ? toggleCompare(item) : setSelected(item)}><div className="history-icon"><FileText size={18} /></div><div className="history-content"><strong>{item.title}</strong><span>{item.detail}</span><small><Clock size={12} />{item.reviewed ? "Reviewed" : item.time}</small></div>{compareMode && <span className="compare-check">{compareSelection.some((entry) => entry.id === item.id) ? "Selected" : "Select"}</span>}{!compareMode && <span className="history-open">Open</span>}</button>)}
    </div>
    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><section className="history-modal" role="dialog" aria-modal="true" aria-label={`${selected.title} details`} onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">SAVED ANALYSIS</span><h3>{selected.title}</h3></div><button className="icon-button" onClick={() => setSelected(null)} aria-label="Close details"><X size={18} /></button></div><p className="history-summary">{selected.summary}</p><div className="history-confidence"><ShieldCheck size={17} /><span>{selected.confidence}% confidence</span></div><div className="history-fields">{selected.fields.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="history-actions"><button className="secondary-action" onClick={() => setSelected(null)}>Close</button><button className="primary-action" disabled={selected.reviewed} onClick={markReviewed}><Check size={16} />{selected.reviewed ? "Reviewed" : "Mark as reviewed"}</button></div></section></div>}
    {comparison && <div className="modal-backdrop" role="presentation" onMouseDown={closeCompare}><section className="comparison-modal" role="dialog" aria-modal="true" aria-label="Compare RealityOS scans" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">REALITY COMPARE</span><h3>What changed?</h3></div><button className="icon-button" onClick={closeCompare} aria-label="Close comparison"><X size={18} /></button></div><div className="comparison-grid">{comparison.map((item) => <article key={item.id}><span className="eyebrow">{item.time}</span><h4>{item.title}</h4><div className="history-confidence"><ShieldCheck size={15} />{item.confidence}% confidence</div><div className="comparison-fields">{item.fields.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></article>)}</div><button className="secondary-action comparison-close" onClick={closeCompare}>Done</button></section></div>}
  </div>;
}
