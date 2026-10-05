import { scheduleReminder } from "./reminderService";

export function executeAction(action, analysis) {
  switch (action.id) {
    case "reminder":
      scheduleReminder(analysis);
      return {
        type: "reminder",
        title: "Reminder prepared",
        message: `Reminder created for ${
          analysis.object.name
        }.`,
      };

    case "task":
      createTask(analysis);
      return {
        type: "task",
        title: "Task created",
        message: "Payment task added to your RealityOS tasks.",
      };

    case "navigate":
      openNearbySearch(analysis);
      return {
        type: "navigate",
        title: "Navigation ready",
        message: "Nearby payment centers are ready to open.",
      };

    case "calendar":
      openCalendarEvent(analysis);
      return {
        type: "calendar",
        title: "Calendar event ready",
        message: "A prefilled calendar event is opening with the detected deadline.",
      };

    default:
      return {
        type: "success",
        title: "Action completed",
        message: "RealityOS completed the action.",
      };
  }
}

function openNearbySearch(analysis) {
  const label = analysis.object?.name || "payment center";
  const fallback = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${label} payment center`)}`;
  const popup = window.open("about:blank", "_blank", "noopener,noreferrer");
  if (!popup || !navigator.geolocation) {
    if (popup) popup.location.href = fallback;
    return;
  }
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      popup.location.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${label} payment center`)}&center=${coords.latitude},${coords.longitude}`;
    },
    () => { popup.location.href = fallback; },
    { enableHighAccuracy: false, timeout: 6000 },
  );
}

function openCalendarEvent(analysis) {
  const insight = analysis.insights?.find((item) => /due|deadline|expiry|date/i.test(item.label));
  const date = parseDate(insight?.value) || new Date(Date.now() + 86_400_000);
  const end = new Date(date.getTime() + 60 * 60 * 1000);
  const format = (value) => value.toISOString().replace(/[-.:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const title = `RealityOS · ${analysis.object?.name || "Follow-up"}`;
  const details = `${analysis.summary || "Review this RealityOS insight."}${insight ? ` ${insight.label}: ${insight.value}.` : ""}`;
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${format(date)}/${format(end)}&details=${encodeURIComponent(details)}`;
  const popup = window.open("about:blank", "_blank", "noopener,noreferrer");
  if (popup) popup.location.href = url;
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

const TASKS_KEY = "realityos-tasks";

export function createTask(analysis) {
  const tasks = readTasks();
  const dueInsight = analysis.insights?.find((item) => /due|deadline|expiry|date/i.test(item.label));
  const dueAt = parseDate(dueInsight?.value)?.toISOString() || null;
  const task = {
    id: `task-${Date.now()}`,
    dueAt,
    createdAt: new Date().toISOString(),
    title: `Review ${analysis.object?.name || "scanned item"}`,
    detail: `Created from your live scan · ${new Date().toLocaleDateString()}`,
  };
  localStorage.setItem(TASKS_KEY, JSON.stringify([task, ...tasks].slice(0, 50)));
  window.dispatchEvent(new CustomEvent("realityos:activity"));
  return task;
}

export function getTasks() {
  return readTasks();
}

export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  window.dispatchEvent(new CustomEvent("realityos:activity"));
}

function readTasks() {
  try {
    const tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    return Array.isArray(tasks) ? tasks : [];
  } catch {
    return [];
  }
}
