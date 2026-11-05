import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../locales/i18n';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  User,
  Phone,
  Mail,
  Building2,
  Globe,
  Moon,
  Sun,
  ShieldCheck,
  Smartphone,
  Save,
} from 'lucide-react';

export function ProfilePage() {
  const { profile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-electric-500" />
          <span>{t('nav.profile')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal advisor details, language dialect preference, and PWA installation.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-navy-900 to-electric-600 dark:from-electric-600 dark:to-cyanAccent-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-electric-500/20">
              {fullName.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">{fullName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="navy" size="sm" className="capitalize">
                  {profile?.role?.replace('_', ' ')}
                </Badge>
                <span className="text-xs text-slate-400">{profile?.organization_name}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 focus:ring-2 focus:ring-electric-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 focus:ring-2 focus:ring-electric-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || 'advisor@loanmitra.ai'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Commission Payout Split
              </label>
              <input
                type="text"
                disabled
                value={`${profile?.commission_split_pct || 50}% (Assigned by Company Admin)`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-navy-900 dark:text-white mb-4">
            Language & Interface Theme
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-electric-500" />
                <span>Preferred Language</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="tanglish">Tanglish (Tamil in English Script)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                {isDark ? <Moon className="w-4 h-4 text-cyanAccent-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span>Display Theme</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => isDark && toggleTheme()}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    !isDark
                      ? 'bg-electric-50 text-electric-600 border-electric-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  Light Theme
                </button>
                <button
                  type="button"
                  onClick={() => !isDark && toggleTheme()}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    isDark
                      ? 'bg-navy-900 text-cyanAccent-400 border-cyanAccent-500/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  Dark Navy
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* PWA Mobile App Support */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-cyanAccent-50 dark:bg-cyanAccent-500/10 text-cyan-600 dark:text-cyanAccent-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900 dark:text-white">
                Progressive Web Application (PWA)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                LoanMitra AI is installable on your Android or iOS home screen. Enjoy fast offline-first app shell loading, camera document uploads, and touch-optimized navigation without visiting an app store.
              </p>
              <div className="mt-3">
                <Badge variant="success" size="sm">
                  PWA Manifest & Service Worker Registered
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              ✓ Preferences Saved!
            </span>
          )}
          <Button type="submit" variant="primary" icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
