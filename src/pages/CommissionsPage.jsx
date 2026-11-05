import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../locales/i18n';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { formatRupee, formatDate } from '../utils/formatters';
import {
  BadgePercent,
  Settings,
  IndianRupee,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export function CommissionsPage() {
  const { commissions } = useData();
  const { isCompanyAdmin, isSuperAdmin, profile } = useAuth();
  const { t } = useLanguage();

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [defaultRate, setDefaultRate] = useState(1.5);
  const [advisorSplit, setAdvisorSplit] = useState(50);

  const totalCommissions = commissions.reduce((sum, c) => sum + (Number(c.commission_amount) || 0), 0);
  const totalAdvisorEarnings = commissions.reduce((sum, c) => sum + (Number(c.advisor_share_amount) || 0), 0);
  const pendingPayouts = commissions
    .filter((c) => c.status === 'pending' || c.status === 'approved')
    .reduce((sum, c) => sum + (Number(c.advisor_share_amount) || 0), 0);
  const completedPayouts = commissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + (Number(c.advisor_share_amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight flex items-center gap-2">
            <BadgePercent className="w-6 h-6 text-electric-500" />
            <span>{t('commissions.title')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('commissions.subtitle')}
          </p>
        </div>

        {(isCompanyAdmin || isSuperAdmin) && (
          <Button
            variant="outline"
            icon={Settings}
            onClick={() => setIsConfigModalOpen(true)}
          >
            Configure Commission Rates
          </Button>
        )}
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Sanction Commission</span>
          <p className="text-2xl font-extrabold text-navy-900 dark:text-white mt-1 font-sans">
            {formatRupee(totalCommissions)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Across all approved loan files</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-500 dark:text-slate-400">Advisor Share Earnings</span>
          <p className="text-2xl font-extrabold text-electric-600 dark:text-cyanAccent-400 mt-1 font-sans">
            {formatRupee(totalAdvisorEarnings)}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {profile?.commission_split_pct || 50}% configured split
          </p>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-500 dark:text-slate-400">Pending Payout</span>
          <p className="text-2xl font-extrabold text-amber-500 mt-1 font-sans">
            {formatRupee(pendingPayouts)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting lender settlement</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-500 dark:text-slate-400">Disbursed / Paid Out</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-sans">
            {formatRupee(completedPayouts)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Credited to bank account</p>
        </Card>
      </div>

      {/* Commission Ledger Table */}
      <Card>
        <CardHeader
          title="Application Payout Audit Ledger"
          subtitle="Transparent, auditable calculation for every sanctioned loan"
          action={
            <Button
              variant="ghost"
              size="sm"
              icon={Download}
              onClick={() => alert('Exporting monthly commission CSV statement...')}
            >
              Export Report
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-500 font-semibold">
                <th className="p-4">Customer & Lender</th>
                <th className="p-4">Loan Category</th>
                <th className="p-4">Loan Amount</th>
                <th className="p-4">Commission Rate</th>
                <th className="p-4">Gross Payout</th>
                <th className="p-4">Advisor Split</th>
                <th className="p-4">Agency Split</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {commissions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    No commission payouts generated yet. Approve an application to create entries.
                  </td>
                </tr>
              ) : (
                commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="font-bold text-navy-900 dark:text-white">
                        {comm.customer_name}
                      </div>
                      <div className="text-[11px] text-slate-400">{comm.lender_name}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant="default" size="sm" className="capitalize">
                        {comm.loan_type}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-navy-900 dark:text-white font-sans">
                      {formatRupee(comm.loan_amount)}
                    </td>
                    <td className="p-4 font-semibold text-slate-600 dark:text-slate-300">
                      {comm.commission_rate_pct}%
                    </td>
                    <td className="p-4 font-extrabold text-navy-900 dark:text-white font-sans">
                      {formatRupee(comm.commission_amount)}
                    </td>
                    <td className="p-4 font-bold text-electric-600 dark:text-cyanAccent-400 font-sans">
                      {formatRupee(comm.advisor_share_amount)}
                    </td>
                    <td className="p-4 font-medium text-slate-500 dark:text-slate-400 font-sans">
                      {formatRupee(comm.company_share_amount)}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          comm.status === 'paid'
                            ? 'success'
                            : comm.status === 'approved'
                            ? 'primary'
                            : 'warning'
                        }
                        size="sm"
                        className="capitalize"
                      >
                        {comm.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Admin Commission Config Modal */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title="Agency Commission Settings"
        subtitle="Configure default payout rates and advisor profit-share ratios"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Base Lender Payout Rate (% of Disbursal)
            </label>
            <input
              type="number"
              step="0.1"
              value={defaultRate}
              onChange={(e) => setDefaultRate(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Standard market average: 1.00% to 2.50% depending on bank policy.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Advisor Share Percentage (%)
            </label>
            <input
              type="number"
              step="5"
              value={advisorSplit}
              onChange={(e) => setAdvisorSplit(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Remaining ({100 - advisorSplit}%) is retained as agency operational overhead.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsConfigModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                alert('Commission rules updated successfully!');
                setIsConfigModalOpen(false);
              }}
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
