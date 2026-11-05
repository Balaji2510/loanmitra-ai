import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Award,
} from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('advisor@loanmitra.ai');
  const [password, setPassword] = useState('advisor123');
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
      setError(res.error || 'Authentication failed. Please check credentials.');
    }
    setLoading(false);
  };

  const handleInstantDemoLogin = async () => {
    setLoading(true);
    await login('advisor@loanmitra.ai', 'demo-secret');
    navigate('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0A0F1D] flex flex-col justify-between p-4 sm:p-6 selection:bg-electric-500 selection:text-white">
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyanAccent-500 to-electric-600 flex items-center justify-center text-navy-950 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg text-navy-900 dark:text-white">
              LoanMitra<span className="text-cyanAccent-500">.AI</span>
            </span>
            <span className="ml-2 text-[10px] bg-electric-50 text-electric-600 dark:bg-electric-500/10 dark:text-electric-400 border border-electric-200 dark:border-electric-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
              LOAN ADVISOR WORKSPACE
            </span>
          </div>
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
            <div className="w-12 h-12 rounded-2xl bg-electric-50 dark:bg-electric-500/10 text-electric-600 dark:text-cyanAccent-400 mx-auto flex items-center justify-center mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              Advisor Portal Login
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Smart Loans. Faster Approvals. Bilingual CRM & AI Copilot.
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
                Loan Advisor Email
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
              Sign In to Advisor Workspace
            </Button>
          </form>

          {/* Quick Instant Access */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs font-bold"
              icon={UserCheck}
              onClick={handleInstantDemoLogin}
            >
              Instant Demo Access as Senior Advisor
            </Button>
            <p className="text-[11px] text-slate-400 mt-2">
              Pre-loaded with verified Indian bank guidelines, active borrowers & Tamil AI assistant.
            </p>
          </div>
        </div>

        {/* Security Assurance */}
        <p className="text-center text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyanAccent-500" />
          <span>Secured with Supabase Authentication & Private Document Vault</span>
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400">
        © 2025 LoanMitra AI. Built Exclusively for Loan Advisors.
      </div>
    </div>
  );
}
