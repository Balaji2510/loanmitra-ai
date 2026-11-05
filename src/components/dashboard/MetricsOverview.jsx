import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../locales/i18n';
import { formatRupee } from '../../utils/formatters';
import { StatCard } from '../common/StatCard';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  BadgePercent,
} from 'lucide-react';

export function MetricsOverview() {
  const { stats } = useData();
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      <StatCard
        title={t('dashboard.totalCustomers')}
        value={stats.totalCustomers}
        icon={Users}
        color="electric"
        change="+18%"
        trend="up"
      />
      <StatCard
        title={t('dashboard.newLeads')}
        value={stats.newLeads}
        icon={UserPlus}
        color="cyan"
        change="+24%"
        trend="up"
      />
      <StatCard
        title={t('dashboard.activeApplications')}
        value={stats.activeApplications}
        icon={FileSpreadsheet}
        color="purple"
        change="+12%"
        trend="up"
      />
      <StatCard
        title={t('dashboard.pendingDocuments')}
        value={stats.pendingDocuments}
        icon={Clock}
        color="amber"
        subtitle="Requires advisor action"
      />
      <StatCard
        title={t('dashboard.approvedLoans')}
        value={stats.approvedLoans}
        icon={CheckCircle2}
        color="emerald"
        change="+15%"
        trend="up"
      />
      <StatCard
        title={t('dashboard.rejectedApplications')}
        value={stats.rejectedApplications}
        icon={XCircle}
        color="rose"
        subtitle="Due to CIBIL / FOIR"
      />
      <StatCard
        title={t('dashboard.totalDisbursement')}
        value={formatRupee(stats.totalDisbursement, { compact: true })}
        icon={IndianRupee}
        color="emerald"
        subtitle={`Actual: ${formatRupee(stats.totalDisbursement)}`}
      />
      <StatCard
        title={t('dashboard.monthlyCommission')}
        value={formatRupee(stats.monthlyCommission)}
        icon={BadgePercent}
        color="electric"
        change="+22%"
        trend="up"
      />
    </div>
  );
}
