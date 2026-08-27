import { useState } from "react";
import { ArrowRight, Check, ClipboardList, MapPin, Navigation, ScanLine, Sparkles, Trash2, Activity, Clock3, ShieldCheck } from "lucide-react";

const taskItems = [
  { id: 1, title: "Pay electricity bill", detail: "Due 31 Aug · High priority" },
  { id: 2, title: "Review product expiry", detail: "Package scanned today" },
  { id: 3, title: "Submit college notice", detail: "Deadline 30 Aug" },
];

export default function WorkspacePage({ type, setPage }) {
  const [tasks, setTasks] = useState(taskItems);
  if (type === "dashboard") return <Dashboard setPage={setPage} />;
  if (type === "tasks") return <Tasks tasks={tasks} setTasks={setTasks} />;
  return <Places />;
}

function Dashboard({ setPage }) {
  const scans = [["Electricity bill", "97% confidence", "2 min ago"], ["Product package", "94% confidence", "1 hr ago"], ["College notice", "92% confidence", "3 hrs ago"]];
  return <section className="workspace-page"><div className="workspace-heading"><div><span className="eyebrow">YOUR WORKSPACE</span><h2>Good to see you.</h2><p>Pick up where your recent real-world insights left off.</p></div><button className="workspace-cta" onClick={() => setPage("analyze")}><ScanLine size={17} /> New scan</button></div><div className="overview-grid"><Overview icon={Sparkles} value="12" label="Items understood" /><Overview icon={ClipboardList} value="3" label="Actions waiting" /><Overview icon={MapPin} value="2" label="Saved places" /></div><div className="dashboard-panel"><div><span className="eyebrow">NEXT UP</span><h3>Pay your electricity bill</h3><p>₹2,480 is due on 31 August. Create a reminder or open your tasks to stay on track.</p></div><button onClick={() => setPage("tasks")}>View tasks <ArrowRight size={16} /></button></div><div className="dashboard-detail-grid"><section className="dashboard-feed"><div className="dashboard-section-title"><div><span className="eyebrow">RECENT ACTIVITY</span><h3>Latest scans</h3></div><button onClick={() => setPage("history")}>See all</button></div>{scans.map(([name, confidence, time]) => <button className="scan-row" key={name} onClick={() => setPage("history")}><span className="scan-row-icon"><ScanLine size={16} /></span><span><strong>{name}</strong><small>{confidence}</small></span><time><Clock3 size={12} />{time}</time></button>)}</section><aside className="engine-card"><div className="engine-icon"><Activity size={20} /></div><span className="eyebrow">REALITY ENGINE</span><h3>Everything is ready.</h3><p>Vision, memory, and action recommendations are online.</p><div className="engine-status"><ShieldCheck size={15} /> Private processing active</div></aside></div></section>;
}

function Overview({ icon: Icon, value, label }) { return <article className="overview-card"><Icon size={19} /><strong>{value}</strong><span>{label}</span></article>; }

function Tasks({ tasks, setTasks }) {
  const toggleTask = (id) => setTasks((items) => items.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  const removeTask = (id) => setTasks((items) => items.filter((task) => task.id !== id));
  return <section className="workspace-page"><div className="workspace-heading"><div><span className="eyebrow">ACTION CENTRE</span><h2>Your tasks</h2><p>Suggested from the things RealityOS has understood.</p></div></div><div className="task-list">{tasks.length ? tasks.map((task) => <article className={`task-card ${task.done ? "done" : ""}`} key={task.id}><button className="task-main" onClick={() => toggleTask(task.id)}><span className="task-check">{task.done && <Check size={14} />}</span><div><strong>{task.title}</strong><small>{task.detail}</small></div><span>{task.done ? "Completed" : "Mark done"}</span></button><button className="task-remove" onClick={() => removeTask(task.id)} aria-label={`Remove ${task.title}`}><Trash2 size={16} /></button></article>) : <div className="empty-tasks"><Check size={19} /> All caught up — no tasks remaining.</div>}</div></section>;
}

function Places() {
  const places = [["City Power payment centre", "2.4 km away · Open until 6:00 PM"], ["Campus administration office", "1.1 km away · Opens tomorrow at 9:00 AM"]];
  return <section className="workspace-page"><div className="workspace-heading"><div><span className="eyebrow">SAVED CONTEXT</span><h2>Your places</h2><p>Locations connected to your reminders and real-world tasks.</p></div></div><div className="place-list">{places.map(([name, detail]) => <article className="place-card" key={name}><div className="place-icon"><MapPin size={19} /></div><div><strong>{name}</strong><span>{detail}</span></div><button aria-label={`Get directions to ${name}`}><Navigation size={17} /></button></article>)}</div></section>;
}
