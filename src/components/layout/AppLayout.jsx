import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Sparkles } from 'lucide-react';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isCopilotPage = location.pathname === '/ai-copilot';

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0A0F1D] flex flex-col font-sans transition-colors duration-200">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Floating Gemini Copilot Quick Action (Visible when not already on copilot page) */}
      {!isCopilotPage && (
        <button
          onClick={() => navigate('/ai-copilot')}
          aria-label="Open LoanMitra AI Copilot"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-navy-900 via-electric-600 to-cyanAccent-500 text-white shadow-xl shadow-electric-500/30 hover:shadow-cyanAccent-500/40 hover:scale-105 active:scale-95 transition-all duration-200 group border border-white/20"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-cyanAccent-300 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyanAccent-400 animate-ping" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-wide">
            LoanMitra <span className="text-cyanAccent-300">AI</span>
          </span>
        </button>
      )}
    </div>
  );
}
