import {
  Scan,
  History,
  Brain,
  MessageCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  Moon,
  Sun,
  LayoutDashboard,
  ListTodo,
  MapPin,
} from "lucide-react";

export default function Sidebar({
  page,
  setPage,
  theme,
  setTheme,
  user,
  backendStatus = "checking",
}) {
  const items = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "analyze",
      label: "Analyze",
      icon: Scan,
    },
    {
      id: "ask",
      label: "Ask RealityOS",
      icon: MessageCircle,
    },
    {
      id: "history",
      label: "History",
      icon: History,
    },
    {
      id: "memory",
      label: "Memory",
      icon: Brain,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: ListTodo,
    },
    {
      id: "places",
      label: "Saved places",
      icon: MapPin,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Sparkles size={19} />
        </div>

        <span>
          Reality<span>OS</span>
        </span>
      </div>

      <nav className="side-nav">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`nav-item ${
                page === item.id ? "active" : ""
              }`}
              onClick={() => setPage(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button
          className={`nav-item ${page === "privacy" ? "active" : ""}`}
          onClick={() => setPage("privacy")}
        >
          <ShieldCheck size={18} />
          <span>Privacy</span>
        </button>

        <button
          className={`nav-item ${page === "settings" ? "active" : ""}`}
          onClick={() => setPage("settings")}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle colour theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === "dark" ? "Light theme" : "Dark theme"}</span>
        </button>

        <div className="account-summary">
          <span>{user.name.slice(0, 1).toUpperCase()}</span>
          <small>{user.name}</small>
        </div>

        <div className="system-status">
          <span className={`system-status-dot ${backendStatus}`} />
          {backendStatus === "online" ? "AI system online" : backendStatus === "checking" ? "Checking AI system" : "AI system offline"}
        </div>
      </div>
    </aside>
  );
}
