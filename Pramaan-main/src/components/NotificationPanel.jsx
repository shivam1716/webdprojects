import React, { useEffect, useRef } from 'react';
import { Bell, X, AlertTriangle, CheckCircle, Info, Clock, ChevronRight } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'alert',
    title: 'Evidence Gap Detected',
    message: 'Project P178253 is missing post-construction field imagery for 3 sites.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'success',
    title: 'Impact Report Generated',
    message: 'Automated audit report for "India Water Sector" has been compiled successfully.',
    time: '18 min ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'info',
    title: 'World Bank API Synced',
    message: '15 India projects refreshed from the World Bank Projects API.',
    time: '1 hr ago',
    read: true,
  },
  {
    id: 'n4',
    type: 'alert',
    title: 'Funding Anomaly Flagged',
    message: 'Disbursement rate for "National Rural Livelihood Mission" is below 40% threshold.',
    time: '3 hr ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'info',
    title: 'Field Team Update',
    message: 'Rajasthan field inspection completed — 12 new photos uploaded to Evidence Wall.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 'n6',
    type: 'success',
    title: 'Audit Compliance Cleared',
    message: 'Project P174175 passed the quarterly evidence review with 94% coverage.',
    time: '2 days ago',
    read: true,
  },
];

const typeConfig = {
  alert: { icon: AlertTriangle, color: '#E57373', bg: 'bg-[#E57373]/10', border: 'border-[#E57373]/20' },
  success: { icon: CheckCircle, color: '#66BB6A', bg: 'bg-[#66BB6A]/10', border: 'border-[#66BB6A]/20' },
  info: { icon: Info, color: '#64B5F6', bg: 'bg-[#64B5F6]/10', border: 'border-[#64B5F6]/20' },
};

export default function NotificationPanel({ isOpen, onClose }) {
  const panelRef = useRef(null);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 bg-[#191815] border border-[#2C2822] rounded-xl shadow-2xl z-50 overflow-hidden animate-slideDown"
      style={{ animation: 'slideDown 0.18s ease-out' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2C2822]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#C8754A]" />
          <span className="text-xs font-mono font-semibold text-[#EEE7DA] uppercase tracking-wider">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#C8754A] text-[10px] font-bold text-white leading-none">
              {unreadCount}
            </span>
          )}
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[#2C2822] text-[#918A7D] hover:text-[#EEE7DA] transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Notification list */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[#2C2822]/60 scrollbar-thin">
        {MOCK_NOTIFICATIONS.map((n) => {
          const cfg = typeConfig[n.type];
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              className={`flex gap-3 px-4 py-3 hover:bg-[#211F1B] transition-colors cursor-pointer relative ${!n.read ? 'bg-[#1E1C18]' : ''}`}
            >
              {!n.read && (
                <span className="absolute left-1.5 top-4 w-1.5 h-1.5 rounded-full bg-[#C8754A]" />
              )}
              <div className={`flex-shrink-0 w-7 h-7 rounded-lg ${cfg.bg} border ${cfg.border} flex items-center justify-center mt-0.5`}>
                <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#EEE7DA] leading-snug">{n.title}</p>
                <p className="text-[11px] text-[#918A7D] mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-[#918A7D]/60" />
                  <span className="text-[10px] font-mono text-[#918A7D]/60">{n.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[#2C2822] flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#918A7D] uppercase tracking-wider">
          {unreadCount} unread
        </span>
        <button className="flex items-center gap-1 text-[10px] font-mono text-[#C8754A] hover:underline uppercase tracking-wider">
          Mark all read <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
