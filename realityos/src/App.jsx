import { useEffect, useState } from "react";

import {
  Check,
  Info,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Brain,
  AlertTriangle,
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
} from "./services/analysisService";

import {
  executeAction,
} from "./services/actionService";

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

  const analyze = async (file) => {
    setLoading(true);
    setAnalysis(null);
    setActionMessage("");
    setAnalysisError("");
    setStep("explain");

    try {
      const result = await analyzeImage(file);
      setAnalysis(result);
    } catch (error) {
      setAnalysisError(error.message || "Could not analyze this image. Please try again.");
    } finally {
      setLoading(false);
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

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        theme={theme}
        setTheme={setTheme}
        user={user}
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
        </header>

        <div className="content">
          {page === "dashboard" && <WorkspacePage type="dashboard" setPage={setPage} />}

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
            Context aware
          </div>
        </div>
      </main>

      {evidence && (
        <EvidenceViewer
          insight={evidence}
          onClose={() => setEvidence(null)}
        />
      )}
    </div>
  );
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
}) {
  return (
    <>
      <div className="result-header">
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
