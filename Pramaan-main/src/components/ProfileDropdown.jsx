import React, { useEffect, useRef } from 'react';
import { User, LogOut, Shield, Settings, ChevronRight, Building2 } from 'lucide-react';

export default function ProfileDropdown({ isOpen, onClose, user, onSignOut }) {
  const dropdownRef = useRef(null);
  const userName = user?.name || 'Rajni';
  const userEmail = user?.email || 'rajni@gmail.com';
  const userRole = user?.role || 'Lead Evidence Auditor';
  const initial = userName.trim().charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: User, label: 'View Profile', sub: 'Audit credentials & activity' },
    { icon: Shield, label: 'Access & Permissions', sub: 'Role: ' + userRole },
    { icon: Building2, label: 'Organization', sub: 'World Bank Evidence Audit' },
    { icon: Settings, label: 'Settings', sub: 'Preferences & integrations' },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-72 bg-[#191815] border border-[#2C2822] rounded-xl shadow-2xl z-50 overflow-hidden"
      style={{ animation: 'slideDown 0.18s ease-out' }}
    >
      {/* Profile Header */}
      <div className="px-4 py-4 border-b border-[#2C2822] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#C8754A] text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#EEE7DA] leading-tight truncate">{userName}</p>
          <p className="text-[11px] text-[#918A7D] truncate">{userEmail}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-[#C8754A]/15 text-[#C8754A] border border-[#C8754A]/25">
            {userRole}
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#211F1B] transition-colors text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#2C2822] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C8754A]/10 transition-colors">
                <Icon className="w-3.5 h-3.5 text-[#918A7D] group-hover:text-[#C8754A] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#EEE7DA]">{item.label}</p>
                <p className="text-[10px] text-[#918A7D] truncate">{item.sub}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#918A7D]/40 group-hover:text-[#918A7D] transition-colors" />
            </button>
          );
        })}
      </div>

      {/* Sign Out */}
      <div className="border-t border-[#2C2822] py-1.5">
        <button
          onClick={() => { onClose(); onSignOut(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#E57373]/10 transition-colors text-left group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#2C2822] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E57373]/10 transition-colors">
            <LogOut className="w-3.5 h-3.5 text-[#E57373]" />
          </div>
          <span className="text-xs font-medium text-[#E57373]">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
