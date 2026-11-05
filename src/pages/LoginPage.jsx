import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../locales/i18n';
import { Button } from '../components/common/Button';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import {
  Sparkles,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export function LoginPage() {
  const { login, availableDemoRoles } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('suresh@loanmitra.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
    setLoading(false);
  };

  const handleQuickDemoLogin = async (demoRoleKey) => {
    const demo = availableDemoRoles[demoRoleKey];
    if (demo) {
      setEmail(demo.email);
      setLoading(true);
      await login(demo.email, 'demo-secret');
      navigate('/');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0A0F1D] flex flex-col justify-between p-4 sm:p-6 selection:bg-electric-500 selection:text-white">
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyanAccent-500 to-electric-600 flex items-center justify-center text-navy-950 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base sm:text-lg text-navy-900 dark:text-white">
            LoanMitra<span className="text-cyanAccent-500">.AI</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <div className="bg-white dark:bg-surface-darkCard rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              Sign In to LoanMitra
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              AI-Powered Bilingual Loan Advisory & CRM Platform
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Advisor Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="advisor@loanmitra.ai"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-electric-600 dark:text-cyanAccent-400 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              loading={loading}
              icon={ArrowRight}
            >
              Sign In to Platform
            </Button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-2.5">
              Instant 1-Click Demo Login
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('loan_advisor')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-navy-900 hover:bg-electric-50 dark:hover:bg-electric-500/10 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-navy-900 dark:text-slate-200 text-center transition-all"
              >
                Loan Advisor
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('company_admin')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-navy-900 hover:bg-electric-50 dark:hover:bg-electric-500/10 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-navy-900 dark:text-slate-200 text-center transition-all"
              >
                Branch Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('super_admin')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-navy-900 hover:bg-electric-50 dark:hover:bg-electric-500/10 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-navy-900 dark:text-slate-200 text-center transition-all"
              >
                Super Admin
              </button>
            </div>
          </div>
        </div>

        {/* Security Assurance */}
        <p className="text-center text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyanAccent-500" />
          <span>Secured with Supabase Authentication & 256-bit Row Level Security</span>
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400">
        © 2025 LoanMitra AI. Smart Loans. Faster Approvals.
      </div>
    </div>
  );
}
