import { useEffect, useRef, useState } from "react";

import {
  Check,
  Info,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Brain,
  AlertTriangle,
  Download,
  Share2,
  Command,
  Search,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import CameraView from "./components/camera/CameraView";
import Workflow from "./components/Workflow";
import ExtractedCard from "./components/ExtractedCard";
import EvidenceViewer from "./components/EvidenceViewer";
import ConfidenceMap from "./components/ConfidenceMap";
import ActionPanel from "./components/ActionPanel";
import AskReality from "./components/ai/AskReality";
import History from "./components/History";
import MemoryPanel from "./components/MemoryPanel";
import ProcessingTimeline from "./components/ProcessingTimeline";
import Privacy from "./components/Privacy";
import Settings from "./components/Settings";
import Login from "./components/Login";
import WorkspacePage from "./components/WorkspacePage";

import {
  analyzeImage,
  isRetryableAnalysisError,
} from "./services/analysisService";

import {
  executeAction,
} from "./services/actionService";
import { saveAnalysisToHistory } from "./services/historyService";
import { downloadAnalysisReport, shareAnalysisReport } from "./services/reportService";
import { saveMemory } from "./services/memoryService";
import { startReminderScheduler } from "./services/reminderService";
import { enqueueScan, queuedScanToFile, removeQueuedScan } from "./services/scanQueueService";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("realityos-theme") || "dark"
  );
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("realityos-user") || "null")
  );

  const [analysis, setAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [step, setStep] =
    useState("explain");

  const [evidence, setEvidence] =
    useState(null);

  const [actionMessage, setActionMessage] =
    useState("");

  const [analysisError, setAnalysisError] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");
  const [backendLatency, setBackendLatency] = useState(null);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    const updateSpotlight = (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", updateSpotlight, { passive: true });
    return () => window.removeEventListener("pointermove", updateSpotlight);
  }, []);

  useEffect(() => {
    let active = true;
    const checkBackend = () => {
      const startedAt = performance.now();
      return fetch("/api/health")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error()))
      .then((health) => {
        if (!active) return;
        setBackendStatus(health.aiConfigured ? "online" : "unconfigured");
        setBackendLatency(Math.round(performance.now() - startedAt));
      })
      .catch(() => {
        if (!active) return;
        setBackendStatus("offline");
        setBackendLatency(null);
      });
    };
    checkBackend();
    const interval = window.setInterval(checkBackend, 30000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => startReminderScheduler(), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("realityos-theme", theme);
  }, [theme]);

  const signIn = (profile) => {
    localStorage.setItem("realityos-user", JSON.stringify(profile));
    setUser(profile);
  };

  const signOut = () => {
    localStorage.removeItem("realityos-user");
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={signIn} />;
  }

  const analyze = async (file, mode, language, queuedId = null) => {
    setLoading(true);
    setAnalysis(null);
    setActionMessage("");
    setAnalysisError("");
    setStep("explain");

    try {
      const result = await analyzeImage(file, mode, language);
      saveAnalysisToHistory(result);
      if (queuedId) removeQueuedScan(queuedId);
      setAnalysis(result);
    } catch (error) {
      if (!queuedId && isRetryableAnalysisError(error)) {
        try {
          await enqueueScan(file, mode, language);
          setAnalysisError("The AI service is unavailable. Your capture is safely queued and will be ready to retry from the dashboard.");
        } catch (queueError) {
          setAnalysisError(queueError.message || "Could not save this capture for later.");
        }
      } else {
        setAnalysisError(error.message || "Could not analyze this image. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const retryQueuedScan = (item) => {
    try {
      setPage("analyze");
      return analyze(queuedScanToFile(item), item.mode, item.language, item.id);
    } catch (error) {
      setAnalysisError(error.message || "This queued capture could not be reopened.");
      return Promise.resolve();
    }
  };

  const reset = () => {
    setAnalysis(null);
    setStep("explain");
    setActionMessage("");
  };

  const performAction = (action) => {
    const result = executeAction(
      action,
      analysis
    );

    setActionMessage(
      `${result.title}: ${result.message}`
    );
  };

  const rememberInsight = (insight) => {
    saveMemory(insight, analysis);
    setActionMessage(`${insight.label} saved to Reality Memory.`);
  };

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        theme={theme}
        setTheme={setTheme}
        user={user}
        backendStatus={backendStatus}
      />

      <main className="main">
        <header className="topbar">
          <div>
            <span className="topbar-label">
              REALITY INTERFACE
            </span>

            <h1>
              See it. Understand it. Act on it.
            </h1>
          </div>

          <div className="privacy-chip">
            <ShieldCheck size={14} />
            Privacy first
          </div>

          <button className="command-trigger" onClick={() => setCommandOpen(true)} aria-label="Open command palette">
            <Command size={14} />
            <span>Quick switch</span>
            <kbd>⌘K</kbd>
          </button>
          <LiveClock />
        </header>

        <div className="content">
          {page === "dashboard" && <WorkspacePage type="dashboard" setPage={setPage} onRetryScan={retryQueuedScan} />}

          {page === "analyze" && (
            <>
              {!analysis && !loading && (
                <div className="hero">
                  <div className="hero-copy">
                    <div className="hero-badge">
                      <Sparkles size={14} />
                      AI-powered reality layer
                    </div>

                    <h2>
                      Turn the world
                      <br />
                      <span>
                        into something actionable.
                      </span>
                    </h2>

                    <p>
                      RealityOS sees what's around
                      you, extracts what matters,
                      verifies it, and helps you act.
                    </p>

                    <div className="hero-features">
                      <Feature
                        title="Understand"
                        text="Visual context and objects"
                      />

                      <Feature
                        title="Verify"
                        text="Confidence and evidence"
                      />

                      <Feature
                        title="Act"
                        text="Tasks, reminders and navigation"
                      />
                    </div>

                    <div className="hero-stats" aria-label="RealityOS capabilities">
                      <div><strong>97%</strong><span>average clarity</span></div>
                      <div><strong>3 sec</strong><span>to understand</span></div>
                      <div><strong>Private</strong><span>by default</span></div>
                    </div>
                  </div>

                  <CameraView
                    onCapture={analyze}
                  />

                  {analysisError && (
                    <p role="alert" className="action-success">
                      {analysisError}
                    </p>
                  )}
                </div>
              )}

              {loading && (
                <div className="loading-page">
                  <div className="processing-card">
                    <div className="processing-orb">
                      <Sparkles size={28} />
                    </div>

                    <span className="eyebrow">
                      REALITY ENGINE
                    </span>

                    <h2>
                      Understanding your reality...
                    </h2>

                    <p>
                      Detecting objects, text,
                      dates and actionable information.
                    </p>

                    <ProcessingTimeline />
                  </div>
                </div>
              )}

              {analysis && !loading && (
                <AnalysisScreen
                  analysis={analysis}
                  step={step}
                  setStep={setStep}
                  reset={reset}
                  setEvidence={setEvidence}
                  performAction={performAction}
                  actionMessage={actionMessage}
                  onRemember={rememberInsight}
                />
              )}
            </>
          )}

          {page === "ask" && (
            <AskReality
              analysis={
                analysis || {
                  object: {
                    name: "your latest scan",
                    confidence: 94,
                  },
                  summary:
                    "No recent scan is available yet.",
                  insights: [],
                }
              }
            />
          )}

          {page === "history" && (
            <History />
          )}

          {page === "memory" && (
            <MemoryPanel />
          )}

          {page === "privacy" && <Privacy />}

          {page === "settings" && (
            <Settings
              theme={theme}
              setTheme={setTheme}
              user={user}
              onSignOut={signOut}
            />
          )}

          {page === "tasks" && <WorkspacePage type="tasks" />}

          {page === "places" && <WorkspacePage type="places" />}
        </div>

        <div className="bottom-status">
          <div>
            <span className="status-dot" />
            Vision engine online
          </div>

          <div>
            <ShieldCheck size={14} />
            Images processed privately
          </div>

          <div>
            <Brain size={14} />
            {backendStatus === "online" ? `Context aware · ${backendLatency ?? "—"} ms` : "AI reconnecting"}
          </div>
        </div>
      </main>

      {evidence && (
        <EvidenceViewer
          insight={evidence}
          onClose={() => setEvidence(null)}
        />
      )}

      {commandOpen && <CommandPalette page={page} setPage={setPage} onClose={() => setCommandOpen(false)} />}
    </div>
  );
}

function CommandPalette({ page, setPage, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const commands = [
    ["dashboard", "Dashboard", "Overview of your reality"],
    ["analyze", "New scan", "Capture and understand something"],
    ["ask", "Ask RealityOS", "Ask a contextual question"],
    ["history", "History", "Review and compare scans"],
    ["memory", "Reality Memory", "Search remembered facts"],
    ["tasks", "Tasks", "Continue your action list"],
    ["places", "Saved places", "Open location-aware directions"],
  ];
  const results = commands.filter(([, label, description]) => `${label} ${description}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => inputRef.current?.focus(), []);

  const choose = (nextPage) => {
    setPage(nextPage);
    onClose();
  };

  return <div className="modal-backdrop palette-backdrop" role="presentation" onMouseDown={onClose}><section className="command-palette" role="dialog" aria-modal="true" aria-label="RealityOS command palette" onMouseDown={(event) => event.stopPropagation()}><div className="command-search"><Search size={17} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Jump to a RealityOS view…" aria-label="Search commands" /></div><div className="command-results">{results.map(([id, label, description]) => <button key={id} className={`command-item ${page === id ? "current" : ""}`} onClick={() => choose(id)}><span><strong>{label}</strong><small>{description}</small></span><kbd>↵</kbd></button>)}{!results.length && <p className="command-empty">No matching views.</p>}</div><div className="command-footer"><span><kbd>Esc</kbd> close</span><span><kbd>↑↓</kbd> browse</span></div></section></div>;
}

function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);
  return <time className="live-clock" dateTime={now.toISOString()}><span className="live-clock-dot" />{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>;
}

function Feature({ title, text }) {
  return (
    <div className="feature">
      <Check size={15} />
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

function AnalysisScreen({
  analysis,
  step,
  setStep,
  reset,
  setEvidence,
  performAction,
  actionMessage,
  onRemember,
}) {
  const [reportMessage, setReportMessage] = useState("");

  const shareReport = async () => {
    try {
      setReportMessage(await shareAnalysisReport(analysis));
    } catch (error) {
      if (error.name !== "AbortError") setReportMessage("Could not share this snapshot.");
    }
  };

  return (
    <>
      <div className="result-header">
        <div className="result-header-left">
          <button
            className="back-button"
            onClick={reset}
          >
            <RotateCcw size={15} />
            New scan
          </button>

          <div className="analysis-complete">
            <span />
            Analysis complete
          </div>
        </div>

        <div className="result-tools">
          <button className="result-tool" onClick={() => downloadAnalysisReport(analysis)} title="Download snapshot" aria-label="Download snapshot">
            <Download size={15} />
          </button>
          <button className="result-tool" onClick={shareReport} title="Share snapshot" aria-label="Share snapshot">
            <Share2 size={15} />
          </button>
        </div>
      </div>

      {reportMessage && <p className="report-message" role="status">{reportMessage}</p>}

      <Workflow
        active={step}
        onChange={setStep}
      />

      <div className="analysis-layout">
        <section className="analysis-panel">
          <div className="analysis-heading">
            <div className="object-title">
              <div className="object-ai-icon">
                <Sparkles size={20} />
              </div>

              <div>
                <span className="eyebrow">
                  OBJECT DETECTED
                </span>

                <h2>
                  {analysis.object.name}
                </h2>

                <p>
                  {analysis.object.type}
                </p>
              </div>
            </div>

            <div className="big-confidence">
              <ShieldCheck size={15} />
              {analysis.object.confidence}%
            </div>
          </div>

          {step === "explain" && (
            <ExplainStep
              analysis={analysis}
              setStep={setStep}
              setEvidence={setEvidence}
              onRemember={onRemember}
            />
          )}

          {step === "verify" && (
            <VerifyStep
              analysis={analysis}
              setStep={setStep}
            />
          )}

          {step === "act" && (
            <ActStep
              analysis={analysis}
              performAction={performAction}
              actionMessage={actionMessage}
            />
          )}
        </section>

        <aside className="analysis-side">
          <div className="score-card">
            <div className="score-top">
              <span>REALITY SCORE</span>
              <Sparkles size={16} />
            </div>

            <strong>
              {analysis.score}
            </strong>

            <div className="score-track">
              <div
                style={{
                  width: `${analysis.score}%`,
                }}
              />
            </div>

            <p>
              Strong visual understanding with
              verified key information.
            </p>
          </div>

          <div className="objects-card">
            <span className="eyebrow">
              DETECTED ELEMENTS
            </span>

            {analysis.objects.map(
              (object) => (
                <div
                  className="object-row"
                  key={object.id}
                >
                  <span />
                  <div>
                    <strong>
                      {object.name}
                    </strong>

                    <small>
                      {object.confidence}%
                    </small>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="warning-card">
            <AlertTriangle size={17} />

            <div>
              <span>ATTENTION</span>

              <strong>
                {analysis.warnings[0].title}
              </strong>

              <p>
                {
                  analysis.warnings[0]
                    .description
                }
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function ExplainStep({
  analysis,
  setStep,
  setEvidence,
  onRemember,
}) {
  return (
    <div className="step-content">
      <div className="explanation-card">
        <div className="info-icon">
          <Info size={19} />
        </div>

        <div>
          <span className="eyebrow">
            EXPLANATION
          </span>

          <p>{analysis.summary}</p>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">
            EXTRACTED INFORMATION
          </span>

          <h3>
            What RealityOS found
          </h3>
        </div>

        <span>
          {analysis.insights.length} items
        </span>
      </div>

      <div className="extracted-grid">
        {analysis.insights.map(
          (insight) => (
            <ExtractedCard
              key={insight.id}
              insight={insight}
              onEvidence={setEvidence}
              onRemember={onRemember}
            />
          )
        )}
      </div>

      <button
        className="continue-button"
        onClick={() => setStep("verify")}
      >
        Verify information
        <span>→</span>
      </button>
    </div>
  );
}

function VerifyStep({
  analysis,
  setStep,
}) {
  return (
    <div className="step-content">
      <div className="verification-card">
        <div className="verification-icon">
          <Check size={19} />
        </div>

        <div>
          <strong>
            Verification complete
          </strong>

          <p>
            RealityOS found high-confidence
            information and flagged uncertain
            fields for review.
          </p>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">
            CONFIDENCE MAP
          </span>

          <h3>
            How certain are we?
          </h3>
        </div>
      </div>

      <ConfidenceMap
        insights={analysis.insights}
      />

      <button
        className="continue-button"
        onClick={() => setStep("act")}
      >
        Continue to actions
        <span>→</span>
      </button>
    </div>
  );
}

function ActStep({
  analysis,
  performAction,
  actionMessage,
}) {
  return (
    <div className="step-content">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            TAKE ACTION
          </span>

          <h3>
            What should RealityOS do?
          </h3>

          <p>
            Recommended actions are based on
            what was detected.
          </p>
        </div>
      </div>

      <ActionPanel
        actions={analysis.suggestedActions}
        onAction={performAction}
      />

      {actionMessage && (
        <div className="action-success">
          <Check size={16} />
          {actionMessage}
        </div>
      )}
    </div>
  );
}
