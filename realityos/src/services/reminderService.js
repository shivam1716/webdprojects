const STORAGE_KEY = "realityos-reminders";

export function scheduleReminder(analysis) {
  const dueInsight = analysis.insights?.find((item) => /due|deadline|expiry|date/i.test(item.label));
  const dueAt = parseDate(dueInsight?.value);
  const reminderAt = dueAt ? Math.max(Date.now() + 60_000, dueAt - 86_400_000) : Date.now() + 86_400_000;
  const reminder = {
    id: `reminder-${Date.now()}`,
    title: `Review ${analysis.object?.name || "your scan"}`,
    body: dueInsight ? `${dueInsight.label}: ${dueInsight.value}` : "Your RealityOS scan is ready to review.",
    remindAt: reminderAt,
    notified: false,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([reminder, ...getReminders()].slice(0, 50)));
  return reminder;
}

export async function enableNotifications() {
  if (!("Notification" in window)) return "unsupported";
  return Notification.requestPermission();
}

export function startReminderScheduler() {
  const check = () => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const now = Date.now();
    let changed = false;
    const reminders = getReminders().map((reminder) => {
      if (!reminder.notified && reminder.remindAt <= now) {
        new Notification(`RealityOS · ${reminder.title}`, { body: reminder.body });
        changed = true;
        return { ...reminder, notified: true };
      }
      return reminder;
    });
    if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  };

  check();
  const interval = window.setInterval(check, 60_000);
  return () => window.clearInterval(interval);
}

export function getReminders() {
  try {
    const reminders = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(reminders) ? reminders : [];
  } catch {
    return [];
  }
}

function parseDate(value) {
  if (!value) return null;
  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct.getTime();
  const match = String(value).match(/(\d{1,2})[\s/-]+([A-Za-z]+|\d{1,2})[\s/-]+(\d{4})/);
  if (!match) return null;
  const parsed = new Date(`${match[1]} ${match[2]} ${match[3]}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
}
