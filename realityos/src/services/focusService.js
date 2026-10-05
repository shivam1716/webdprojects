const FOCUS_KEY = "realityos-focus-session";

export function getFocusSession() {
  try {
    const session = JSON.parse(localStorage.getItem(FOCUS_KEY) || "null");
    return session && typeof session === "object" ? session : null;
  } catch {
    return null;
  }
}

export function startFocusSession(task, duration = 25 * 60) {
  const session = {
    id: `focus-${Date.now()}`,
    taskId: task?.id || null,
    taskTitle: task?.title || "Reality reset",
    duration,
    remaining: duration,
    startedAt: Date.now(),
    status: "running",
  };
  saveFocusSession(session);
  return session;
}

export function pauseFocusSession(session) {
  const next = getSessionWithElapsed(session);
  next.status = "paused";
  delete next.startedAt;
  saveFocusSession(next);
  return next;
}

export function resumeFocusSession(session) {
  const next = { ...session, status: "running", startedAt: Date.now() };
  saveFocusSession(next);
  return next;
}

export function completeFocusSession(session) {
  const next = { ...session, remaining: 0, status: "complete" };
  delete next.startedAt;
  saveFocusSession(next);
  return next;
}

export function resetFocusSession() {
  localStorage.removeItem(FOCUS_KEY);
  notifyFocusChanged();
}

function getSessionWithElapsed(session) {
  if (!session?.startedAt || session.status !== "running") return { ...session };
  const elapsed = Math.max(0, Math.floor((Date.now() - session.startedAt) / 1000));
  return { ...session, remaining: Math.max(0, session.remaining - elapsed) };
}

function saveFocusSession(session) {
  localStorage.setItem(FOCUS_KEY, JSON.stringify(session));
  notifyFocusChanged();
}

function notifyFocusChanged() {
  window.dispatchEvent(new CustomEvent("realityos:focus"));
}
