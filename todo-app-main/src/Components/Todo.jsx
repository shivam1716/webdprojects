import { useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { TodoInput } from "./TodoInput";
import Todolist from "./Todolist";

const TODO_STORAGE_KEY = "todos";
const THEME_STORAGE_KEY = "todo-app-theme";
const ACTIVITY_STORAGE_KEY = "todo-app-activity";
const priorities = ["low", "medium", "high"];

const seedTodos = [
  {
    id: "seed-build",
    title: "Build a Todo App",
    description: "Create a responsive and user-friendly todo app",
    priority: "high",
    status: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: "seed-learn",
    title: "Learn React.js",
    description: "Complete the React tutorial on the official website",
    priority: "low",
    status: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    completedAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "seed-gym",
    title: "Go to the Gym",
    description: "Chest workout and 30 minutes of cardio",
    priority: "medium",
    status: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: "seed-read",
    title: "Read a Book",
    description: "Read at least 20 pages",
    priority: "low",
    status: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 28,
  },
];

function normalizeTodos(value) {
  if (!Array.isArray(value) || value.length === 0) return seedTodos;

  return value.map((todo, index) => ({
    id: todo.id || nanoid(),
    title: String(todo.title || "Untitled task").slice(0, 120),
    description: String(todo.description || "No details added yet.").slice(0, 180),
    priority: priorities.includes(todo.priority) ? todo.priority : "medium",
    status: Boolean(todo.status),
    createdAt: Number(todo.createdAt) || Date.now() - index * 1000 * 60,
    updatedAt: Number(todo.updatedAt) || undefined,
    completedAt: Number(todo.completedAt) || undefined,
  }));
}

function readTodos() {
  try {
    return normalizeTodos(JSON.parse(localStorage.getItem(TODO_STORAGE_KEY)));
  } catch {
    return seedTodos;
  }
}

function initialActivity(tasks) {
  return tasks.slice(0, 4).map((task) => ({
    id: `initial-${task.id}`,
    type: task.status ? "completed" : "created",
    title: task.title,
    timestamp: task.completedAt || task.createdAt,
  }));
}

function readActivity() {
  try {
    const saved = JSON.parse(localStorage.getItem(ACTIVITY_STORAGE_KEY));
    if (Array.isArray(saved)) return saved.slice(0, 12);
  } catch {
    // Fall back to activity derived from the first task list.
  }
  return initialActivity(readTodos());
}

function LogoMark() {
  return <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m7.5 12.3 2.9 2.9 6.3-6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
}

function ThemeIcon({ theme }) {
  return theme === "light" ? (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v2.1M12 18.9V21M3 12h2.1M18.9 12H21M5.64 5.64l1.49 1.49M16.87 16.87l1.49 1.49M18.36 5.64l-1.49 1.49M7.13 16.87l-1.49 1.49" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.2 15.4A8.2 8.2 0 0 1 8.6 3.8 8.2 8.2 0 1 0 20.2 15.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

function DashboardIcon({ type }) {
  if (type === "total") return <svg viewBox="0 0 24 24" fill="none"><rect x="6.5" y="5" width="11" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M9.5 4v2M14.5 4v2M9.5 10h5M9.5 14h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  if (type === "pending") return <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7.2" stroke="currentColor" strokeWidth="1.8" /><path d="M12 8v4.4l2.8 1.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (type === "completed") return <svg viewBox="0 0 24 24" fill="none"><path d="M7 12.2 10.2 15.4 17 8.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none"><path d="M5 18.5V13M10 18.5V9M15 18.5v-4M20 18.5V5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M4 19.5h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

function relativeTime(timestamp) {
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (seconds < 50) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) === 1 ? "" : "s"} ago`;
}

function activityCopy(item) {
  if (item.type === "completed") return "Completed";
  if (item.type === "reopened") return "Moved to pending";
  if (item.type === "updated") return "Updated";
  if (item.type === "deleted") return "Removed";
  if (item.type === "cleared") return "Cleared";
  return "Added";
}

function Todo() {
  const [todos, setTodos] = useState(readTodos);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light");
  const [activity, setActivity] = useState(readActivity);
  const [filter, setFilter] = useState("all");
  const [activeView, setActiveView] = useState("tasks");
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity));
  }, [activity]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const timer = window.setInterval(() => setToday(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const recordActivity = (type, title) => {
    setActivity((items) => [{ id: nanoid(), type, title, timestamp: Date.now() }, ...items].slice(0, 12));
  };

  const addTodo = ({ title, description, priority }) => {
    const task = {
      id: nanoid(),
      title: title.trim(),
      description: description.trim() || "No details added yet.",
      priority,
      status: false,
      createdAt: Date.now(),
    };
    setTodos((items) => [task, ...items]);
    recordActivity("created", task.title);
  };

  const handleStatus = (id) => {
    const task = todos.find((item) => item.id === id);
    if (!task) return;
    const now = Date.now();
    setTodos((items) => items.map((item) => item.id === id ? {
      ...item,
      status: !item.status,
      completedAt: item.status ? undefined : now,
      updatedAt: now,
    } : item));
    recordActivity(task.status ? "reopened" : "completed", task.title);
  };

  const handleDelete = (id) => {
    const task = todos.find((item) => item.id === id);
    if (!task) return;
    setTodos((items) => items.filter((item) => item.id !== id));
    recordActivity("deleted", task.title);
  };

  const handleUpdate = (id, changes) => {
    const task = todos.find((item) => item.id === id);
    if (!task) return;
    setTodos((items) => items.map((item) => item.id === id ? { ...item, ...changes, updatedAt: Date.now() } : item));
    recordActivity("updated", changes.title || task.title);
  };

  const clearCompleted = () => {
    const count = todos.filter((item) => item.status).length;
    if (!count) return;
    setTodos((items) => items.filter((item) => !item.status));
    recordActivity("cleared", `${count} completed task${count === 1 ? "" : "s"}`);
  };

  const completed = todos.filter((todo) => todo.status).length;
  const pending = todos.length - completed;
  const completionRate = todos.length ? Math.round((completed / todos.length) * 100) : 0;
  const visibleTodos = useMemo(() => todos.filter((todo) => {
    if (filter === "pending") return !todo.status;
    if (filter === "completed") return todo.status;
    return true;
  }), [todos, filter]);
  const dateLabel = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const stats = [
    { type: "total", label: "Total Tasks", value: todos.length, helper: "All time tasks" },
    { type: "pending", label: "Pending", value: pending, helper: "Tasks to do" },
    { type: "completed", label: "Completed", value: completed, helper: "Tasks done" },
    { type: "rate", label: "Completion Rate", value: `${completionRate}%`, helper: completionRate ? "Keep going!" : "Start your first task" },
  ];

  return (
    <main className="todo-app" data-theme={theme}>
      <section className="app-frame">
        <header className="topbar">
          <button className="brand" onClick={() => setActiveView("tasks")} aria-label="Open tasks"><LogoMark /><span>Todo App</span></button>
          <nav className="app-nav" aria-label="Main navigation">
            {[['tasks', 'Tasks'], ['stats', 'Stats'], ['about', 'About']].map(([view, label]) => <button key={view} className={activeView === view ? "nav-item active" : "nav-item"} onClick={() => setActiveView(view)}>{label}</button>)}
          </nav>
          <button className="theme-toggle" onClick={() => setTheme((current) => current === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}><ThemeIcon theme={theme} /></button>
        </header>

        {activeView === "tasks" && <section className="view tasks-view" aria-labelledby="tasks-heading">
          <div className="intro">
            <div className="hero-orb" aria-hidden="true"><span className="spark spark-one" /><span className="spark spark-two" /><LogoMark /></div>
            <p className="date-kicker">{dateLabel}</p>
            <h1 id="tasks-heading">Organize your tasks,<br />boost your <span>productivity</span></h1>
            <p>Simple, beautiful and powerful task planning<br className="desktop-break" /> to get things done.</p>
          </div>

          <section className="tasks-panel" aria-label="Your tasks">
            <TodoInput onAdd={addTodo} />
            <div className="task-toolbar">
              <div className="filters" role="group" aria-label="Filter tasks">
                {[['all', 'All'], ['pending', 'Pending'], ['completed', 'Completed']].map(([key, label]) => <button key={key} className={filter === key ? "filter active" : "filter"} onClick={() => setFilter(key)}>{label}<span>{key === "all" ? todos.length : key === "pending" ? pending : completed}</span></button>)}
              </div>
              <button className="clear-button" onClick={clearCompleted} disabled={!completed}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M10 11v5M14 11v5M9 7l.7-2h4.6l.7 2M6.5 7l.7 11h9.6l.7-11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>Clear Completed</button>
            </div>
            <Todolist todos={visibleTodos} filter={filter} onToggle={handleStatus} onDelete={handleDelete} onUpdate={handleUpdate} />
            <footer className="task-footer"><span>{pending} task{pending === 1 ? "" : "s"} left</span><span>{completed} completed</span></footer>
          </section>
          <p className="made-with">Made with <span>love</span> for a more focused day</p>
        </section>}

        {activeView === "stats" && <section className="view stats-view" aria-labelledby="stats-heading">
          <div className="view-heading"><p className="date-kicker">YOUR PROGRESS</p><h1 id="stats-heading">Your Productivity Overview</h1><p>Track your progress and stay motivated.</p></div>
          <div className="stats-grid">
            {stats.map((stat) => <article className={`stat-card ${stat.type}`} key={stat.type}><span className="stat-icon"><DashboardIcon type={stat.type} /></span><p>{stat.label}</p><strong>{stat.value}</strong><small>{stat.helper}</small></article>)}
          </div>
          <section className="activity-card" aria-labelledby="activity-heading"><div className="activity-heading"><div><h2 id="activity-heading">Recent Activity</h2><p>Everything you do is saved automatically.</p></div><span className="sync-status"><i /> Live</span></div>
            <div className="activity-list">{activity.length ? activity.map((item) => <article className="activity-row" key={item.id}><span className={`activity-dot ${item.type}`}>{item.type === "completed" ? <svg viewBox="0 0 24 24" fill="none"><path d="m7.5 12.3 2.9 2.9 6.3-6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}</span><p><strong>{item.title}</strong><em className={item.type}>{activityCopy(item)}</em></p><time>{relativeTime(item.timestamp)}</time></article>) : <p className="no-activity">Your recent task activity will appear here.</p>}</div>
          </section>
        </section>}

        {activeView === "about" && <section className="view about-view" aria-labelledby="about-heading"><div className="about-mark"><LogoMark /></div><p className="date-kicker">A CALMER WAY TO PLAN</p><h1 id="about-heading">A focused day starts with a clear list.</h1><p>Todo App keeps your plans, priorities and progress together in one private space. Everything is saved in your browser and instantly adapts to your chosen theme.</p><div className="about-points"><article><strong>Local first</strong><span>Your tasks remain on this device.</span></article><article><strong>Priority aware</strong><span>Give the important work a clearer signal.</span></article><article><strong>Always in sync</strong><span>Every change updates your overview right away.</span></article></div></section>}
      </section>
    </main>
  );
}

export { Todo };
