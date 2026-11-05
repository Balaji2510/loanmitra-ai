import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../locales/i18n';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Calculator,
  Building2,
  CalendarCheck,
  BadgePercent,
  Sparkles,
  FileScan,
  ShieldCheck,
  User,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '../common/Badge';

export function Sidebar({ isOpen, onClose }) {
  const { profile, logout, switchDemoRole, isSuperAdmin, isCompanyAdmin } = useAuth();
  const { t } = useLanguage();

  const navigation = [
    { name: t('nav.dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('nav.customers'), href: '/customers', icon: Users },
    { name: t('nav.applications'), href: '/applications', icon: FileSpreadsheet },
    { name: t('nav.eligibility'), href: '/eligibility', icon: Calculator },
    { name: t('nav.lenders'), href: '/lenders', icon: Building2 },
    { name: t('nav.followups'), href: '/followups', icon: CalendarCheck },
    { name: t('nav.commissions'), href: '/commissions', icon: BadgePercent },
    { name: t('nav.aiCopilot'), href: '/ai-copilot', icon: Sparkles, highlight: true },
    { name: t('nav.documents'), href: '/documents', icon: FileScan },
  ];

  // Include admin if privileged
  if (isCompanyAdmin || isSuperAdmin) {
    navigation.push({ name: t('nav.admin'), href: '/admin', icon: ShieldCheck });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-navy-900 text-slate-300 flex flex-col border-r border-navy-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 p-5 border-b border-navy-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyanAccent-500 to-electric-500 flex items-center justify-center shadow-lg shadow-cyanAccent-500/20">
              <Sparkles className="w-5 h-5 text-navy-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight font-sans">
                  LoanMitra<span className="text-cyanAccent-400">.AI</span>
                </span>
                <span className="text-[10px] bg-electric-500/20 text-electric-400 border border-electric-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                  BILINGUAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Smart Loans. Faster Approvals.
              </p>
            </div>
          </div>
        </div>

        {/* User Role & Demo Switcher Banner */}
        <div className="p-3.5 mx-3 my-2.5 rounded-xl bg-navy-800/60 border border-navy-700/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-electric-600/30 flex items-center justify-center text-electric-400 font-bold text-xs border border-electric-500/30">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{profile?.full_name}</p>
                <p className="text-[10px] text-cyanAccent-400 font-medium capitalize">
                  {profile?.role?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher for demonstration */}
          <div className="mt-2.5 pt-2 border-t border-navy-700/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-cyanAccent-400" /> Demo Role:
            </span>
            <select
              value={profile?.role}
              onChange={(e) => switchDemoRole(e.target.value)}
              className="text-[11px] bg-navy-900 text-slate-200 border border-navy-600 rounded px-1.5 py-0.5 focus:outline-none focus:border-cyanAccent-400 cursor-pointer"
            >
              <option value="loan_advisor">Loan Advisor</option>
              <option value="company_admin">Branch Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-electric-600 to-electric-500 text-white shadow-md shadow-electric-600/20'
                      : item.highlight
                      ? 'text-cyanAccent-400 hover:bg-navy-800/80 bg-cyanAccent-500/10 border border-cyanAccent-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-navy-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-cyanAccent-400' : ''}`} />
                  <span>{item.name}</span>
                </div>
                {item.highlight ? (
                  <span className="text-[9px] bg-cyanAccent-400 text-navy-950 font-extrabold px-1.5 py-0.5 rounded">
                    GEMINI
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer Settings & Logout */}
        <div className="p-3 border-t border-navy-800/80 space-y-1">
          <NavLink
            to="/profile"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium ${
                isActive
                  ? 'bg-navy-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800/60'
              }`
            }
          >
            <User className="w-4 h-4" />
            <span>{t('nav.profile')}</span>
          </NavLink>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
