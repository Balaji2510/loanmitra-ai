import React from 'react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../locales/i18n';
import { formatRupee, formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Phone, MapPin } from 'lucide-react';

export function RecentCustomers() {
  const { customers } = useData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const recent = customers.slice(0, 4);

  return (
    <Card>
      <CardHeader
        title={t('dashboard.recentCustomers')}
        subtitle="Newly registered borrower inquiries"
        action={
          <button
            onClick={() => navigate('/customers')}
            className="text-xs font-semibold text-electric-600 dark:text-cyanAccent-400 hover:underline flex items-center gap-1"
          >
            <span>{t('dashboard.viewAll')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        }
      />
      <CardBody className="p-0">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recent.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate('/customers')}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-electric-50 dark:bg-electric-500/10 text-electric-600 dark:text-cyanAccent-400 font-bold flex items-center justify-center text-sm border border-electric-500/20">
                  {c.full_name?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2">
                    {c.full_name}
                    <Badge variant="default" size="sm" className="capitalize">
                      {c.preferred_loan_type}
                    </Badge>
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {c.city}
                    </span>
                    <span>•</span>
                    <span>Income: {formatRupee(c.monthly_income)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-navy-900 dark:text-white font-sans">
                  {formatRupee(c.required_loan_amount)}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(c.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
