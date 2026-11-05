import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../locales/i18n';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatDate } from '../utils/formatters';
import {
  ShieldCheck,
  Users,
  Building2,
  Cpu,
  History,
  Lock,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export function AdminPage() {
  const { profile, isSuperAdmin, isCompanyAdmin, availableDemoRoles } = useAuth();
  const { customers, applications } = useData();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('advisors');

  const auditLogs = [
    {
      id: 'log-1',
      action: 'APPLICATION_STATUS_UPDATE',
      entity: 'Application #e00000000001',
      actor: 'Suresh Kumar',
      details: 'Stage changed to Approved (Sanction letter generated)',
      ip: '106.51.72.18 (Chennai)',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: 'log-2',
      action: 'DOCUMENT_AI_VERIFICATION',
      entity: 'Document #doc-001',
      actor: 'Suresh Kumar',
      details: 'Salary slip gross income verified at ₹82,500',
      ip: '106.51.72.18 (Chennai)',
      timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    },
    {
      id: 'log-3',
      action: 'CUSTOMER_CONSENT_RECORDED',
      entity: 'Customer: Ananya Sundaram',
      actor: 'Ananya Sundaram (via OTP)',
      details: 'Digital credit check authorization granted',
      ip: '49.207.214.55 (Coimbatore)',
      timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'log-4',
      action: 'ORGANIZATION_SETTINGS_CHANGE',
      entity: 'LoanMitra Prime Advisory',
      actor: 'Rajesh K (Super Admin)',
      details: 'Default commission split configured to 50%',
      ip: '122.178.14.92 (Chennai)',
      timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-electric-500" />
          <span>{t('nav.admin')}</span>
          <Badge variant="navy" size="sm">
            {profile?.role?.replace('_', ' ')}
          </Badge>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage organizational users, partner bank policies, AI API monitoring, and regulatory audit trails.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { key: 'advisors', label: 'Advisors & Users', icon: Users },
          { key: 'ai_usage', label: 'Gemini AI Telemetry', icon: Cpu },
          { key: 'audit_logs', label: 'Security Audit Logs', icon: History },
          { key: 'org_settings', label: 'Organization Settings', icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 pb-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-electric-600 text-electric-600 dark:text-cyanAccent-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Advisors & Users */}
      {activeTab === 'advisors' && (
        <Card>
          <CardHeader
            title="Team & Advisor Management"
            subtitle="Configured advisors within your branch or organization"
            action={<Button variant="primary" size="sm" icon={Plus}>Add Advisor</Button>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-500 font-semibold">
                  <th className="p-4">Advisor Name</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Email & Phone</th>
                  <th className="p-4">Commission Split</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {Object.values(availableDemoRoles).map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-navy-900 dark:text-white">{u.full_name}</td>
                    <td className="p-4">
                      <Badge
                        variant={u.role === 'super_admin' ? 'navy' : u.role === 'company_admin' ? 'primary' : 'default'}
                        size="sm"
                        className="capitalize"
                      >
                        {u.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div>{u.email}</div>
                      <div className="text-[11px] text-slate-400">{u.phone}</div>
                    </td>
                    <td className="p-4 font-extrabold text-navy-900 dark:text-white">
                      {u.commission_split_pct}%
                    </td>
                    <td className="p-4">
                      <Badge variant="success" size="sm">Active</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-xs text-electric-600 dark:text-cyanAccent-400 font-bold hover:underline">
                        Edit Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab: Gemini AI Usage */}
      {activeTab === 'ai_usage' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5">
              <span className="text-xs text-slate-400">Total AI Tokens Ingested</span>
              <p className="text-2xl font-extrabold text-navy-900 dark:text-white mt-1">142,850</p>
              <p className="text-[11px] text-emerald-500 font-semibold mt-1">Free Tier Quota Healthy</p>
            </Card>
            <Card className="p-5">
              <span className="text-xs text-slate-400">Multimodal Document OCR Calls</span>
              <p className="text-2xl font-extrabold text-cyanAccent-500 mt-1">38 Documents</p>
              <p className="text-[11px] text-slate-400 mt-1">Average latency: 1.2s</p>
            </Card>
            <Card className="p-5">
              <span className="text-xs text-slate-400">Tamil Copilot Interactions</span>
              <p className="text-2xl font-extrabold text-electric-600 mt-1">184 Queries</p>
              <p className="text-[11px] text-slate-400 mt-1">Bilingual Tamil & Tanglish</p>
            </Card>
          </div>

          <Card className="p-5">
            <h4 className="text-sm font-bold text-navy-900 dark:text-white mb-2">
              Gemini API Rate Limiting & Protection Guardrails
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Backend isolation enabled in <code>/api/assistant.js</code> - Frontend never exposes API keys.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Deterministic banking policy grounding active - Hallucinated interest rates blocked.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Human-in-the-loop requirement enforced - AI extracted data cannot be finalized without advisor verification.</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Security Audit Logs */}
      {activeTab === 'audit_logs' && (
        <Card>
          <CardHeader
            title="System Audit & Compliance Log"
            subtitle="Immutable activity ledger tracking customer access and status transitions"
          />
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-electric-600 dark:text-cyanAccent-400">
                      {log.action}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-navy-900 dark:text-white">{log.actor}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{log.details}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Entity: {log.entity}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-slate-400">{formatDate(log.timestamp, true)}</div>
                  <div className="text-[10px] font-mono text-slate-400">{log.ip}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab: Organization Settings */}
      {activeTab === 'org_settings' && (
        <Card className="p-6">
          <h3 className="text-base font-bold text-navy-900 dark:text-white mb-4">
            Agency Profile & Compliance Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Organization Legal Name
              </label>
              <input
                type="text"
                defaultValue="LoanMitra Prime Advisory Services Private Limited"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Headquarters Hub
              </label>
              <input
                type="text"
                defaultValue="Chennai, Tamil Nadu"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Default Currency & Accounting
              </label>
              <input
                type="text"
                disabled
                defaultValue="INR (₹ Indian Rupee)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Supported Dialects
              </label>
              <input
                type="text"
                disabled
                defaultValue="Tamil (தமிழ்), Tanglish, English"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-400"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
