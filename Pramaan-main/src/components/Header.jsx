import React, { useState } from 'react';
import { Search, Bell, Sparkles, Menu, X } from 'lucide-react';
import SourceBadge from './SourceBadge';
import NotificationPanel from './NotificationPanel';
import ProfileDropdown from './ProfileDropdown';

const MOCK_SUGGESTIONS = [
  'India Water Sector',
  'National Rural Livelihood Mission',
  'Urban Transport Infrastructure',
  'Renewable Energy Development',
  'Rajasthan field inspection',
  'P178253',
  'P174175',
];

export default function Header({
  searchQuery,
  onSearchChange,
  onStartDemo,
  onOpenSourceDetails,
  onToggleMobileMenu,
  onSignOut,
  user,
  onNavigate,
}) {
  const userName = user?.name || 'Rajni';
  const initial = userName.trim().charAt(0).toUpperCase();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = searchQuery.length > 0
    ? MOCK_SUGGESTIONS.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && onNavigate) {
      onNavigate('projects');
      setIsFocused(false);
    }
    if (e.key === 'Escape') {
      onSearchChange('');
      setIsFocused(false);
    }
  };

  return (
    <header className="h-16 bg-[#FAF7F2] border-b border-[#EAE4DC] px-4 md:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile Menu + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded md:hidden text-[#7A7369] hover:text-[#1E1B18] hover:bg-[#EFEAE2]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search with suggestions dropdown */}
        <div className="relative w-full">
          <input
            type="text"
            id="global-search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search projects, locations, activities..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-white border border-[#E2DDD5] text-xs text-[#1E1B18] placeholder-[#8F877C] focus:outline-none focus:border-[#C8754A] shadow-xs font-sans transition-colors"
            data-cursor="target"
            autoComplete="off"
          />
          <Search className="w-4 h-4 text-[#8F877C] absolute left-3 top-2.5 pointer-events-none" />

          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-[#8F877C] hover:text-[#1E1B18] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Suggestions dropdown */}
          {isFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2DDD5] rounded-lg shadow-xl z-50 overflow-hidden">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => {
                    onSearchChange(s);
                    if (onNavigate) onNavigate('projects');
                    setIsFocused(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-[#1E1B18] hover:bg-[#FAF7F2] flex items-center gap-2.5 transition-colors border-b border-[#F0EBE3] last:border-0"
                >
                  <Search className="w-3 h-3 text-[#C8754A] flex-shrink-0" />
                  <span>{s}</span>
                </button>
              ))}
              <div className="px-4 py-2 bg-[#FAF7F2] border-t border-[#EAE4DC]">
                <span className="text-[10px] font-mono text-[#918A7D] uppercase tracking-wider">
                  Press Enter to search all projects
                </span>
              </div>
            </div>
          )}

          {/* "No results" hint when typing with no matches */}
          {isFocused && searchQuery.length > 1 && suggestions.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2DDD5] rounded-lg shadow-xl z-50 px-4 py-3">
              <span className="text-xs text-[#918A7D] font-mono">
                Press <kbd className="px-1.5 py-0.5 rounded bg-[#EAE4DC] text-[#1E1B18] text-[10px]">Enter</kbd> to search for "<strong>{searchQuery}</strong>"
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* LIVE DEMO Button */}
        <button
          onClick={onStartDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8754A] hover:bg-[#B8643A] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-xs transition-all active:scale-95"
          data-cursor="target"
          title="Start live guided tour"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">LIVE DEMO</span>
          <span className="sm:hidden">DEMO</span>
        </button>

        {/* Data Source Badge */}
        <SourceBadge
          source="World Bank Projects API"
          timestamp={new Date().toISOString()}
          onOpenDetails={onOpenSourceDetails}
          className="hidden sm:inline-flex"
        />

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="notification-bell"
            onClick={() => { setIsNotifOpen(v => !v); setIsProfileOpen(false); }}
            className={`p-2 rounded-lg border text-[#7A7369] transition-all shadow-xs ${
              isNotifOpen
                ? 'bg-[#F3EFE9] border-[#C8754A]/40 text-[#1E1B18]'
                : 'bg-white hover:bg-[#F3EFE9] border-[#E2DDD5] hover:text-[#1E1B18]'
            }`}
            data-cursor="target"
            title="View notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C8754A] pointer-events-none ring-2 ring-[#FAF7F2]" />
          <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* Profile Button */}
        <div className="relative">
          <button
            id="profile-button"
            type="button"
            onClick={() => { setIsProfileOpen(v => !v); setIsNotifOpen(false); }}
            title="View profile & account settings"
            className={`flex items-center gap-2 pl-2 border-l border-[#EAE4DC] transition-opacity ${isProfileOpen ? 'opacity-80' : 'hover:opacity-85'}`}
            data-cursor="target"
          >
            <div className={`w-8 h-8 rounded-full bg-[#C8754A] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 transition-all ${isProfileOpen ? 'ring-[#C8754A]' : 'ring-transparent'}`}>
              {initial}
            </div>
            <div className="hidden sm:block text-left text-xs font-medium text-[#1E1B18]">
              Hi, {userName} ▾
            </div>
          </button>
          <ProfileDropdown
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            user={user}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </header>
  );
}
