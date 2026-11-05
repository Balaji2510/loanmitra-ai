import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../locales/i18n';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatRupee, formatDate } from '../utils/formatters';
import {
  BadgePercent,
  IndianRupee,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  Building,
} from 'lucide-react';

export function CommissionsPage() {
  const { commissions } = useData();
  const { profile } = useAuth();
  const { t } = useLanguage();

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
            <span>My Commission Earnings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your personal loan sanction payouts, upcoming bank disbursements, and payout history.
          </p>
        </div>

        <Button
          variant="outline"
          icon={Download}
          onClick={() => alert('Downloading official Advisor Commission Statement (PDF)...')}
        >
          Download Payout Statement
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Advisor Earnings</span>
          <p className="text-3xl font-extrabold text-navy-900 dark:text-white mt-1 font-sans">
            {formatRupee(totalAdvisorEarnings)}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Across {commissions.length} sanctioned loan files
          </p>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-500 dark:text-slate-400">Pending Bank Payout</span>
          <p className="text-3xl font-extrabold text-amber-500 mt-1 font-sans">
            {formatRupee(pendingPayouts)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Scheduled for next lender billing cycle</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-500 dark:text-slate-400">Disbursed to Bank Account</span>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-sans">
            {formatRupee(completedPayouts)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Successfully credited via NEFT/IMPS</p>
        </Card>
      </div>

      {/* Commission Ledger Table */}
      <Card>
        <CardHeader
          title="Advisor Application Payout Ledger"
          subtitle="File-wise commission breakdown with verified lender sanction amounts"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-500 font-semibold">
                <th className="p-4">Customer & Lender</th>
                <th className="p-4">Loan Category</th>
                <th className="p-4">Disbursed Loan Amount</th>
                <th className="p-4">Commission Rate</th>
                <th className="p-4">My Payout Share</th>
                <th className="p-4">Estimated Payout Date</th>
                <th className="p-4">Payout Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {commissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No commissions recorded yet. Approved loan applications will automatically reflect here.
                  </td>
                </tr>
              ) : (
                commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="font-bold text-navy-900 dark:text-white">
                        {comm.customer_name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3" />
                        {comm.lender_name}
                      </div>
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
                    <td className="p-4 font-extrabold text-electric-600 dark:text-cyanAccent-400 font-sans">
                      {formatRupee(comm.advisor_share_amount)}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 text-xs">
                      {comm.payout_date ? formatDate(comm.payout_date) : 'Pending UTR'}
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
                        {comm.status === 'paid' ? 'Paid to Bank' : comm.status === 'approved' ? 'Approved' : 'Pending'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transparent Advisor Commission Policy Card */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-electric-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-navy-900 dark:text-white block mb-0.5">
            Transparent Payout Schedule:
          </strong>
          Commissions are processed bi-weekly upon lender disbursement confirmation. Personal loan and auto loan payouts are settled within 10 business days of UTR generation; Home loan and LAP files are settled on the 1st and 15th of each month.
        </div>
      </div>
    </div>
  );
}
