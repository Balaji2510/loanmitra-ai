import React from 'react';
import { Menu, Sparkles, Bell, Shield, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

export function Navbar({ onOpenSidebar }) {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-surface-darkCard/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Hamburger & Organization */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-electric-500" />
            <span>Chennai / TN</span>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden md:inline">
            {profile?.organization_name || 'LoanMitra Prime Advisory'}
          </span>
        </div>
      </div>

      {/* Right side: AI Quick Action, Language, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Launch Copilot */}
        <button
          onClick={() => navigate('/ai-copilot')}
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-electric-600 to-cyanAccent-600 hover:from-electric-500 hover:to-cyanAccent-500 text-white text-xs font-bold shadow-md shadow-cyanAccent-500/20 active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Gemini AI</span>
        </button>

        {/* Multilingual Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Avatar */}
        <div
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-xl bg-gradient-to-tr from-navy-900 to-electric-600 dark:from-electric-600 dark:to-cyanAccent-500 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:opacity-90 transition-opacity border border-white/20"
          title={`${profile?.full_name} (${profile?.role})`}
        >
          {profile?.full_name?.charAt(0) || 'A'}
        </div>
      </div>
    </header>
  );
}
