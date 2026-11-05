import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Briefcase,
  Award,
  MapPin,
} from 'lucide-react';

export function ProfilePage() {
  const { profile, updateProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || 'Suresh Kumar',
    title: profile?.title || 'Senior Loan Advisor',
    phone: profile?.phone || '+91 98403 98765',
    email: profile?.email || 'advisor@loanmitra.ai',
    organizationName: profile?.organization_name || 'LoanMitra Advisory Services',
    licenseNo: profile?.license_no || 'LM-ADV-TN-2025-084',
    city: profile?.city || 'Chennai, Tamil Nadu',
    commissionSplit: profile?.commission_split_pct || 100,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        title: profile.title || 'Senior Loan Advisor',
        phone: profile.phone || '',
        email: profile.email || 'advisor@loanmitra.ai',
        organizationName: profile.organization_name || 'LoanMitra Advisory Services',
        licenseNo: profile.license_no || 'LM-ADV-TN-2025-084',
        city: profile.city || 'Chennai, Tamil Nadu',
        commissionSplit: profile.commission_split_pct || 100,
      });
    }
  }, [profile]);

  const handleSave = (e) => {
    e.preventDefault();
    if (updateProfile) {
      updateProfile({
        full_name: formData.fullName,
        title: formData.title,
        phone: formData.phone,
        email: formData.email,
        organization_name: formData.organizationName,
        license_no: formData.licenseNo,
        city: formData.city,
        commission_split_pct: Number(formData.commissionSplit),
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
          Manage your advisor credentials, agency details, language dialect preference, and PWA installation.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-bold">Advisor Profile Updated Successfully!</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Your name, agency details, and contact numbers have been saved and updated across your entire workspace.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Header Banner */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-navy-900 to-electric-600 dark:from-electric-600 dark:to-cyanAccent-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-electric-500/20">
                {formData.fullName.charAt(0) || 'A'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900 dark:text-white">
                  {formData.fullName || 'Advisor Name'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="navy" size="sm" className="capitalize">
                    {formData.title}
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {formData.organizationName}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{formData.licenseNo}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs sm:text-sm">
            {/* Full Name */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-electric-500" />
                <span>Advisor Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Suresh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:outline-none"
              />
            </div>

            {/* Title / Role */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-electric-500" />
                <span>Designation / Title *</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Loan Advisor / Certified DSA"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-electric-500" />
                <span>Direct Phone / WhatsApp *</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98403 98765"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-electric-500" />
                <span>Advisor Email Address</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="advisor@loanmitra.ai"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:outline-none"
              />
            </div>

            {/* Organization / Agency */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-electric-500" />
                <span>Agency / Business Name</span>
              </label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                placeholder="e.g. LoanMitra Prime Advisory Services"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:outline-none"
              />
            </div>

            {/* Operating City / Branch */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-electric-500" />
                <span>Branch Location / City</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Chennai, Tamil Nadu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:outline-none"
              />
            </div>

            {/* License / ARN */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-electric-500" />
                <span>DSA Code / License Registration</span>
              </label>
              <input
                type="text"
                value={formData.licenseNo}
                onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                placeholder="e.g. LM-ADV-TN-2025-084"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:outline-none"
              />
            </div>

            {/* Commission Payout Split */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Commission Payout Split (%)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.commissionSplit}
                onChange={(e) => setFormData({ ...formData, commissionSplit: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:outline-none"
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
              ✓ Saved & Reflected Across App!
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
