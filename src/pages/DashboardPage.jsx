import React, { useState } from 'react';
import { useLanguage } from '../locales/i18n';
import { useAuth } from '../contexts/AuthContext';
import { MetricsOverview } from '../components/dashboard/MetricsOverview';
import { StatusChart } from '../components/dashboard/StatusChart';
import { DisbursementChart } from '../components/dashboard/DisbursementChart';
import { RecentCustomers } from '../components/dashboard/RecentCustomers';
import { TodayFollowups } from '../components/dashboard/TodayFollowups';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  UserPlus,
  FilePlus,
  Calculator,
  Calendar,
  Building2,
} from 'lucide-react';

export function DashboardPage() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('current_month');

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Date Filter & Quick Launch */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="current_month">Current Month (Feb 2025)</option>
              <option value="last_quarter">Last Quarter</option>
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => navigate('/customers')}
          >
            Add Customer
          </Button>

          <Button
            variant="accent"
            size="sm"
            icon={Sparkles}
            onClick={() => navigate('/ai-copilot')}
          >
            AI Assistant
          </Button>
        </div>
      </div>

      {/* Actual Database Aggregate Metrics */}
      <MetricsOverview />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart />
        <DisbursementChart />
      </div>

      {/* Recent Activity and Follow-up Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCustomers />
        <TodayFollowups />
      </div>
    </div>
  );
}
