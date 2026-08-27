import {
  Bell,
  CheckSquare,
  Navigation,
  ArrowUpRight,
} from "lucide-react";

const actionIcons = {
  reminder: Bell,
  task: CheckSquare,
  navigate: Navigation,
};

export default function ActionPanel({ actions, onAction }) {
  return (
    <div className="action-grid">
      {actions.map((action) => {
        const Icon = actionIcons[action.id] || ArrowUpRight;

        return (
          <button
            key={action.id}
            className="action-card"
            onClick={() => onAction(action)}
          >
            <div className="action-icon">
              <Icon size={20} />
            </div>

            <div className="action-text">
              <strong>{action.title}</strong>
              <span>{action.description}</span>
            </div>

            <ArrowUpRight
              size={18}
              className="action-arrow"
            />
          </button>
        );
      })}
    </div>
  );
}