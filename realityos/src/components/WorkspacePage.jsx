import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, BellRing, Camera, Check, ClipboardList, CloudOff, MapPin, Navigation, Pause, Play, Radio, RotateCcw, ScanLine, Sparkles, Timer, Trash2, Activity, Clock3, ShieldCheck, CloudSun, LocateFixed, Wifi, WifiOff } from "lucide-react";
import { getSavedAnalyses } from "../services/historyService";
import { getTasks, saveTasks } from "../services/actionService";
import { getLiveContext } from "../services/contextService";
import { getQueuedScans, removeQueuedScan } from "../services/scanQueueService";
import { completeFocusSession, getFocusSession, pauseFocusSession, resetFocusSession, resumeFocusSession, startFocusSession } from "../services/focusService";

const taskItems = [
  { id: 1, title: "Pay electricity bill", detail: "Due 31 Aug · High priority" },
  { id: 2, title: "Review product expiry", detail: "Package scanned today" },
  { id: 3, title: "Submit college notice", detail: "Deadline 30 Aug" },
];

export default function WorkspacePage({ type, setPage, onRetryScan }) {
  const [tasks, setTasks] = useState(() => {
    const saved = getTasks();
    return saved.length ? saved : taskItems;
  });
  useEffect(() => saveTasks(tasks), [tasks]);
  if (type === "dashboard") return <Dashboard setPage={setPage} onRetryScan={onRetryScan} />;
  if (type === "tasks") return <Tasks tasks={tasks} setTasks={setTasks} />;
  return <Places />;
}

function Dashboard({ setPage, onRetryScan }) { return <><DashboardContent setPage={setPage} /><LivePulse setPage={setPage} /><AttentionRadar setPage={setPage} /><RealityStream setPage={setPage} /><FocusDock setPage={setPage} /><ScanQueue onRetry={onRetryScan} /><LiveContextCard /><InstallPrompt /></>; }

function DashboardContent({ setPage }) {
  const savedScans = getSavedAnalyses();
  const scans = savedScans.length
    ? savedScans.slice(0, 3).map((scan) => [scan.title, `${scan.confidence}% confidence`, scan.time])
    : [["Electricity bill", "97% confidence", "2 min ago"], ["Product package", "94% confidence", "1 hr ago"], ["College notice", "92% confidence", "3 hrs ago"]];
  return <section className="workspace-page"><div className="workspace-heading"><div><span className="eyebrow">YOUR WORKSPACE</span><h2>Good to see you.</h2><p>Pick up where your recent real-world insights left off.</p></div><button className="workspace-cta" onClick={() => setPage("analyze")}><ScanLine size={17} /> New scan</button></div><div className="overview-grid"><Overview icon={Sparkles} value="12" label="Items understood" /><Overview icon={ClipboardList} value="3" label="Actions waiting" /><Overview icon={MapPin} value="2" label="Saved places" /></div><div className="dashboard-panel"><div><span className="eyebrow">NEXT UP</span><h3>Pay your electricity bill</h3><p>₹2,480 is due on 31 August. Create a reminder or open your tasks to stay on track.</p></div><button onClick={() => setPage("tasks")}>View tasks <ArrowRight size={16} /></button></div><div className="dashboard-detail-grid"><section className="dashboard-feed"><div className="dashboard-section-title"><div><span className="eyebrow">RECENT ACTIVITY</span><h3>Latest scans</h3></div><button onClick={() => setPage("history")}>See all</button></div>{scans.map(([name, confidence, time]) => <button className="scan-row" key={name} onClick={() => setPage("history")}><span className="scan-row-icon"><ScanLine size={16} /></span><span><strong>{name}</strong><small>{confidence}</small></span><time><Clock3 size={12} />{time}</time></button>)}</section><aside className="engine-card"><div className="engine-icon"><Activity size={20} /></div><span className="eyebrow">REALITY ENGINE</span><h3>Everything is ready.</h3><p>Vision, memory, and action recommendations are online.</p><div className="engine-status"><ShieldCheck size={15} /> Private processing active</div></aside></div></section>;
}

function Overview({ icon: Icon, value, label }) { return <article className="overview-card"><Icon size={19} /><strong>{value}</strong><span>{label}</span></article>; }

function LivePulse({ setPage }) {
  const [snapshot, setSnapshot] = useState(() => readPulseSnapshot());
  const [service, setService] = useState({ status: "checking", latency: null });

  useEffect(() => {
    let active = true;
    const readLocalState = () => setSnapshot(readPulseSnapshot());
    const checkService = async () => {
      const startedAt = performance.now();
      try {
        const response = await fetch("/api/health", { cache: "no-store" });
        const health = response.ok ? await response.json() : null;
        if (!active) return;
        setService({ status: health?.aiConfigured ? "online" : "unconfigured", latency: Math.round(performance.now() - startedAt) });
      } catch {
        if (active) setService({ status: "offline", latency: null });
      }
    };
    readLocalState();
    checkService();
    const localInterval = window.setInterval(readLocalState, 2500);
    const serviceInterval = window.setInterval(checkService, 30000);
    window.addEventListener("storage", readLocalState);
    return () => {
      active = false;
      window.clearInterval(localInterval);
      window.clearInterval(serviceInterval);
      window.removeEventListener("storage", readLocalState);
    };
  }, []);

  const serviceOnline = service.status === "online";
  const serviceLabel = service.status === "checking" ? "Connecting" : service.status === "online" ? "Live" : service.status === "unconfigured" ? "Needs key" : "Offline";
  const ServiceIcon = serviceOnline ? Wifi : WifiOff;

  return <section className="live-pulse-card" aria-label="Live RealityOS status">
    <div className="pulse-head">
      <div className="pulse-title"><span className="pulse-icon"><Radio size={17} /></span><div><span className="eyebrow">LIVE PULSE</span><h3>RealityOS is watching the edges.</h3></div></div>
      <span className={`pulse-status ${service.status}`}><ServiceIcon size={13} />{serviceLabel}</span>
    </div>
    <div className="pulse-grid">
      <LiveMetric icon={Activity} label="AI response" value={service.latency ? `${service.latency} ms` : service.status === "offline" ? "—" : "Checking"} detail={serviceOnline ? "Gemini Pro ready" : "Backend health"} />
      <LiveMetric icon={ScanLine} label="Reality memory" value={`${snapshot.scans} ${snapshot.scans === 1 ? "scan" : "scans"}`} detail={snapshot.lastScan} />
      <LiveMetric icon={ClipboardList} label="Action queue" value={`${snapshot.pendingTasks} pending`} detail={snapshot.pendingTasks ? "Ready to pick up" : "All caught up"} />
      <LiveMetric icon={Camera} label="Device senses" value={snapshot.cameraReady ? "Camera ready" : "Upload ready"} detail={snapshot.locationReady ? "Location available" : "Location on request"} />
    </div>
    <div className="pulse-foot"><span><span className="pulse-bars" aria-hidden="true"><i /><i /><i /><i /></span> Local state syncs automatically</span><button onClick={() => setPage("history")}><BellRing size={13} /> Open activity</button></div>
  </section>;
}

function LiveMetric({ icon: Icon, label, value, detail }) {
  return <div className="pulse-metric"><span className="pulse-metric-icon"><Icon size={15} /></span><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div>;
}

function readPulseSnapshot() {
  const scans = getSavedAnalyses();
  const tasks = getTasks();
  return {
    scans: scans.length,
    pendingTasks: tasks.filter((task) => !task.done).length,
    lastScan: formatLastScan(scans[0]),
    cameraReady: Boolean(navigator.mediaDevices?.getUserMedia),
    locationReady: Boolean(navigator.geolocation),
  };
}

function formatLastScan(scan) {
  if (!scan) return "No scans yet";
  const timestamp = Number(String(scan.id || "").replace("scan-", ""));
  if (!Number.isFinite(timestamp)) return scan.time || "Recently captured";
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "Captured just now";
  if (minutes < 60) return `Captured ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `Captured ${hours}h ago` : `Captured ${Math.floor(hours / 24)}d ago`;
}

function AttentionRadar({ setPage }) {
  const [snapshot, setSnapshot] = useState(() => readRadarSnapshot());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const refresh = () => {
      setSnapshot(readRadarSnapshot());
      setNow(Date.now());
    };
    refresh();
    const interval = window.setInterval(refresh, 1000);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const focusTask = snapshot.tasks
    .filter((task) => !task.done)
    .sort((first, second) => (first.deadline ?? Number.POSITIVE_INFINITY) - (second.deadline ?? Number.POSITIVE_INFINITY))[0];
  const latestScan = snapshot.scans[0];
  const deadlineState = focusTask?.deadline ? formatCountdown(focusTask.deadline - now) : "No deadline set";
  const deadlineLabel = focusTask?.deadline ? formatDeadline(focusTask.deadline) : "Choose a time when you are ready";

  return <section className="attention-radar" aria-label="Attention radar">
    <div className="radar-head">
      <div className="radar-title"><span className="radar-icon"><AlertTriangle size={17} /></span><div><span className="eyebrow">ATTENTION RADAR</span><h3>One clear next move.</h3></div></div>
      <span className="radar-live"><span />Updates live</span>
    </div>
    <div className="radar-body">
      <div className={`radar-focus ${focusTask?.deadline && focusTask.deadline < now ? "overdue" : ""}`}>
        {focusTask ? <><span className="radar-kicker">NEXT ACTION</span><h4>{focusTask.title}</h4><p>{focusTask.detail}</p><div className="radar-meta"><strong><Clock3 size={14} />{deadlineState}</strong><span>{deadlineLabel}</span></div></> : <><span className="radar-kicker">CLEAR HORIZON</span><h4>No pending actions</h4><p>Your queue is clear. Capture something new to give RealityOS context.</p></>}
      </div>
      <div className="radar-latest"><span className="radar-kicker">LATEST SIGNAL</span>{latestScan ? <><strong>{latestScan.title}</strong><span>{latestScan.confidence}% confidence</span><small>{formatLastScan(latestScan)}</small></> : <><strong>Waiting for your first scan</strong><span>Camera, screen, or upload</span><small>Private by default</small></>}<button onClick={() => setPage(latestScan ? "history" : "analyze")}><ScanLine size={13} />{latestScan ? "Review scan" : "Start a scan"}</button></div>
    </div>
    <div className="radar-foot"><span>{snapshot.tasks.filter((task) => !task.done).length} pending {snapshot.tasks.filter((task) => !task.done).length === 1 ? "action" : "actions"} in your queue</span><button onClick={() => setPage("tasks")}>Open action centre <ArrowRight size={13} /></button></div>
  </section>;
}

function readRadarSnapshot() {
  return { tasks: getTasks().map((task) => ({ ...task, deadline: getTaskDeadline(task) })), scans: getSavedAnalyses() };
}

function getTaskDeadline(task) {
  if (task?.dueAt) {
    const timestamp = new Date(task.dueAt).getTime();
    if (Number.isFinite(timestamp)) return timestamp;
  }
  const match = String(task?.detail || "").match(/(?:due|deadline)\s+(\d{1,2})\s+([a-z]+)/i);
  if (!match) return null;
  const year = new Date().getFullYear();
  const parsed = new Date(`${match[2]} ${match[1]} ${year} 23:59:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  if (parsed.getTime() < Date.now()) parsed.setFullYear(year + 1);
  return parsed.getTime();
}

function formatCountdown(milliseconds) {
  if (milliseconds <= 0) return "Past due · act now";
  const minutes = Math.ceil(milliseconds / 60000);
  if (minutes < 60) return `${minutes}m remaining`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m remaining`;
  return `${Math.floor(hours / 24)}d ${hours % 24}h remaining`;
}

function formatDeadline(timestamp) {
  return `Due ${new Date(timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}`;
}

function RealityStream({ setPage }) {
  const [events, setEvents] = useState(() => readRealityEvents());

  useEffect(() => {
    const refresh = () => setEvents(readRealityEvents());
    refresh();
    const interval = window.setInterval(refresh, 2500);
    window.addEventListener("storage", refresh);
    window.addEventListener("realityos:activity", refresh);
    window.addEventListener("realityos:scan-queue", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("realityos:activity", refresh);
      window.removeEventListener("realityos:scan-queue", refresh);
    };
  }, []);

  return <section className="reality-stream-card" aria-label="Live activity stream">
    <div className="stream-head"><div className="stream-title"><span className="stream-icon"><Activity size={17} /></span><div><span className="eyebrow">REALITY STREAM</span><h3>Everything happening around your layer.</h3></div></div><span className="stream-live"><span />Live feed</span></div>
    <div className="stream-list">{events.length ? events.map((event) => <button className="stream-event" key={event.id} onClick={() => setPage(event.page)}><span className={`stream-event-icon ${event.kind}`}><event.Icon size={14} /></span><span className="stream-event-copy"><strong>{event.title}</strong><small>{event.detail}</small></span><time>{formatEventTime(event.timestamp)}</time><ArrowRight size={13} /></button>) : <p className="stream-empty">Your live stream will appear as soon as you scan something or create an action.</p>}</div>
    <div className="stream-foot"><span>Updates across tabs and device sessions</span><button onClick={() => setPage("history")}>View full history <ArrowRight size={13} /></button></div>
  </section>;
}

function readRealityEvents() {
  const scans = getSavedAnalyses().slice(0, 8).map((scan) => ({
    id: `stream-${scan.id}`,
    kind: "scan",
    Icon: ScanLine,
    title: scan.title,
    detail: `${scan.confidence}% confidence · Visual insight saved`,
    timestamp: timestampFromId(scan.id),
    page: "history",
  }));
  const tasks = getTasks().map((task) => ({
    id: `stream-${task.id}`,
    kind: task.done ? "done" : "task",
    Icon: task.done ? Check : ClipboardList,
    title: task.title,
    detail: task.done ? "Action completed" : "Action waiting for you",
    timestamp: taskTimestamp(task),
    page: "tasks",
  }));
  const queued = getQueuedScans().map((item) => ({
    id: `stream-${item.id}`,
    kind: "queue",
    Icon: CloudOff,
    title: item.name,
    detail: `${labelForMode(item.mode)} · Waiting for connection`,
    timestamp: Date.parse(item.createdAt) || 0,
    page: "dashboard",
  }));
  return [...scans, ...tasks, ...queued].sort((first, second) => second.timestamp - first.timestamp).slice(0, 5);
}

function timestampFromId(id) {
  const timestamp = Number(String(id || "").replace("scan-", ""));
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function taskTimestamp(task) {
  if (task.createdAt) return Date.parse(task.createdAt) || 0;
  const timestamp = Number(String(task.id || "").replace("task-", ""));
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function formatEventTime(timestamp) {
  if (!timestamp) return "Earlier";
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "Now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d`;
}

function FocusDock({ setPage }) {
  const [tasks, setTasks] = useState(() => getTasks());
  const [session, setSession] = useState(() => getFocusSession());
  const [now, setNow] = useState(() => Date.now());
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const pendingTasks = tasks.filter((task) => !task.done);
  const selectedTask = pendingTasks.find((task) => String(task.id) === String(selectedTaskId)) || pendingTasks.find((task) => String(task.id) === String(session?.taskId)) || pendingTasks[0];
  const remaining = session?.status === "running" && session.startedAt
    ? Math.max(0, session.remaining - Math.floor((now - session.startedAt) / 1000))
    : session?.remaining ?? 25 * 60;
  const duration = session?.duration || 25 * 60;
  const progress = Math.min(100, Math.max(0, ((duration - remaining) / duration) * 100));
  const status = session?.status === "running" ? "In focus" : session?.status === "paused" ? "Paused" : session?.status === "complete" ? "Complete" : "Ready";

  useEffect(() => {
    const refresh = () => {
      setTasks(getTasks());
      setSession(getFocusSession());
      setNow(Date.now());
    };
    refresh();
    const interval = window.setInterval(refresh, 1000);
    window.addEventListener("realityos:focus", refresh);
    window.addEventListener("realityos:activity", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("realityos:focus", refresh);
      window.removeEventListener("realityos:activity", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    if (session?.status !== "running" || remaining > 0) return;
    completeFocusSession(session);
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("RealityOS focus complete", { body: `${session.taskTitle} is ready for your attention.` });
    }
  }, [remaining, session]);

  const start = () => setSession(startFocusSession(selectedTask));
  const pause = () => setSession(pauseFocusSession(session));
  const resume = () => setSession(resumeFocusSession(session));
  const reset = () => {
    resetFocusSession();
    setSession(null);
  };

  return <section className="focus-dock-card" aria-label="Focus dock">
    <div className="focus-head"><div className="focus-title"><span className="focus-icon"><Timer size={17} /></span><div><span className="eyebrow">FOCUS DOCK</span><h3>Make one real-world action visible.</h3></div></div><span className={`focus-status ${session?.status || "ready"}`}><span />{status}</span></div>
    <div className="focus-body">
      <div className="focus-ring" style={{ "--focus-progress": `${progress}%` }}><strong>{formatFocusTime(remaining)}</strong><span>{status}</span></div>
      <div className="focus-copy"><span className="focus-kicker">ACTIVE THREAD</span><h4>{session ? session.taskTitle : "A calm 25-minute window"}</h4><p>{session?.status === "complete" ? "Nice work. Reset the dock to choose another action." : "A distraction-free timer that stays with you across tabs and refreshes."}</p>{!session || session.status === "complete" ? <label className="focus-task-select">Focus on<select value={selectedTask?.id || ""} onChange={(event) => setSelectedTaskId(event.target.value)}><option value="">A fresh reality reset</option>{pendingTasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}</select></label> : null}<div className="focus-controls">{session?.status === "running" ? <button onClick={pause}><Pause size={14} />Pause</button> : session?.status === "paused" ? <button onClick={resume}><Play size={14} />Resume</button> : <button className="focus-primary" onClick={start}><Play size={14} />{session?.status === "complete" ? "Start again" : "Start focus"}</button>}{session && <button className="focus-reset" onClick={reset} aria-label="Reset focus timer"><RotateCcw size={14} /></button>}</div></div>
    </div>
    <div className="focus-foot"><span>{pendingTasks.length ? `${pendingTasks.length} pending ${pendingTasks.length === 1 ? "action" : "actions"} ready to focus` : "No pending actions · a fresh reset is ready"}</span><button onClick={() => setPage("tasks")}>Manage actions <ArrowRight size={13} /></button></div>
  </section>;
}

function formatFocusTime(seconds) {
  const minutes = Math.floor(Math.max(0, seconds) / 60);
  const remainder = Math.max(0, seconds) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function ScanQueue({ onRetry }) {
  const [items, setItems] = useState(() => getQueuedScans());
  const [retrying, setRetrying] = useState("");

  useEffect(() => {
    const refresh = () => setItems(getQueuedScans());
    refresh();
    const interval = window.setInterval(refresh, 2500);
    window.addEventListener("realityos:scan-queue", refresh);
    window.addEventListener("online", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("realityos:scan-queue", refresh);
      window.removeEventListener("online", refresh);
    };
  }, []);

  if (!items.length) return null;
  const retry = async (item) => {
    if (!onRetry) return;
    setRetrying(item.id);
    try { await onRetry(item); } finally { setRetrying(""); }
  };
  return <section className="scan-queue-card" aria-label="Queued scans" aria-live="polite">
    <div className="queue-head"><div className="queue-title"><span className="queue-icon"><CloudOff size={17} /></span><div><span className="eyebrow">OFFLINE SCAN QUEUE</span><h3>{items.length} capture{items.length === 1 ? "" : "s"} waiting for the reality engine</h3></div></div><span className="queue-state">Saved on this device</span></div>
    <div className="queue-list">{items.map((item) => <article className="queue-item" key={item.id}><div className="queue-item-thumb"><img src={item.dataUrl} alt="" /></div><div className="queue-item-copy"><strong>{item.name}</strong><span>{labelForMode(item.mode)} · {formatQueuedTime(item.createdAt)}</span></div><button className="queue-retry" onClick={() => retry(item)} disabled={retrying === item.id}>{retrying === item.id ? "Retrying…" : <><RotateCcw size={13} />Retry</>}</button><button className="queue-remove" onClick={() => removeQueuedScan(item.id)} aria-label={`Remove queued capture ${item.name}`}><Trash2 size={14} /></button></article>)}</div>
    <p className="queue-note">Captures stay private in local storage until you choose to retry. They are removed automatically after a successful analysis.</p>
  </section>;
}

function labelForMode(mode) {
  return { auto: "Auto Lens", document: "Document Lens", product: "Product Lens", place: "Place Lens", object: "Object Lens", translate: "Translation Lens" }[mode] || "Reality Lens";
}

function formatQueuedTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "recently" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function LiveContextCard() {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const refresh = async () => {
    setLoading(true);
    setError("");
    try { setContext(await getLiveContext()); } catch (reason) { setError(reason.message); } finally { setLoading(false); }
  };
  return <section className="live-context-card"><div className="live-context-icon"><CloudSun size={20} /></div><div className="live-context-copy"><span className="eyebrow">LIVE REALITY CONTEXT</span>{context ? <><h3>{context.temperature}{context.unit} · {context.condition}</h3><p>{context.humidity}% humidity · Wind {context.wind} km/h · Local time {context.localTime}</p></> : <><h3>{loading ? "Reading your surroundings…" : "Add live context to your workspace"}</h3><p>{error || "Use your location to see conditions around the things RealityOS understands."}</p></>}</div><button className="live-context-action" onClick={refresh} disabled={loading} aria-label="Refresh live context"><LocateFixed size={16} />{loading ? "Reading" : context ? "Refresh" : "Use location"}</button></section>;
}

function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  useEffect(() => {
    const capture = (event) => {
      event.preventDefault();
      setInstallEvent(event);
    };
    window.addEventListener("beforeinstallprompt", capture);
    return () => window.removeEventListener("beforeinstallprompt", capture);
  }, []);
  if (!installEvent) return null;
  const install = async () => {
    await installEvent.prompt();
    setInstallEvent(null);
  };
  return <section className="install-card"><div><span className="eyebrow">MAKE IT YOURS</span><h3>Install RealityOS</h3><p>Keep your reality layer one tap away, even when you’re offline.</p></div><button onClick={install}>Install app</button></section>;
}

function Tasks({ tasks, setTasks }) {
  const toggleTask = (id) => setTasks((items) => items.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  const removeTask = (id) => setTasks((items) => items.filter((task) => task.id !== id));
  return <section className="workspace-page"><div className="workspace-heading"><div><span className="eyebrow">ACTION CENTRE</span><h2>Your tasks</h2><p>Suggested from the things RealityOS has understood.</p></div></div><div className="task-list">{tasks.length ? tasks.map((task) => <article className={`task-card ${task.done ? "done" : ""}`} key={task.id}><button className="task-main" onClick={() => toggleTask(task.id)}><span className="task-check">{task.done && <Check size={14} />}</span><div><strong>{task.title}</strong><small>{task.detail}</small></div><span>{task.done ? "Completed" : "Mark done"}</span></button><button className="task-remove" onClick={() => removeTask(task.id)} aria-label={`Remove ${task.title}`}><Trash2 size={16} /></button></article>) : <div className="empty-tasks"><Check size={19} /> All caught up — no tasks remaining.</div>}</div></section>;
}

function Places() {
  const places = [["City Power payment centre", "2.4 km away · Open until 6:00 PM"], ["Campus administration office", "1.1 km away · Opens tomorrow at 9:00 AM"]];
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const locate = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported in this browser.");
      return;
    }
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        setLocating(false);
      },
      () => {
        setLocationError("Location permission was not granted.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };
  return <section className="workspace-page"><div className="workspace-heading"><div><span className="eyebrow">SAVED CONTEXT</span><h2>Your places</h2><p>Locations connected to your reminders and real-world tasks.</p></div><button className="workspace-cta" onClick={locate} disabled={locating}><MapPin size={16} />{locating ? "Locating…" : location ? "Location ready" : "Use my location"}</button></div>{locationError && <p className="location-error" role="alert">{locationError}</p>}{location && <p className="location-ready"><MapPin size={14} /> Live location ready for directions</p>}<div className="place-list">{places.map(([name, detail]) => <article className="place-card" key={name}><div className="place-icon"><MapPin size={19} /></div><div><strong>{name}</strong><span>{detail}</span></div><button aria-label={`Get directions to ${name}`} onClick={() => window.open(location ? `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${encodeURIComponent(name)}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`, "_blank", "noopener,noreferrer")}><Navigation size={17} /></button></article>)}</div></section>;
}
