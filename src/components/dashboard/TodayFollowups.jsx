import React from 'react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../locales/i18n';
import { Badge } from '../common/Badge';
import { Check, Clock, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TodayFollowups() {
  const { followups, markFollowupCompleted } = useData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const pendingFollowups = followups.filter((f) => f.status === 'pending').slice(0, 3);

  return (
    <Card>
      <CardHeader
        title={t('dashboard.todayFollowups')}
        subtitle="Active client follow-ups requiring advisor attention"
        action={
          <button
            onClick={() => navigate('/followups')}
            className="text-xs font-semibold text-electric-600 dark:text-cyanAccent-400 hover:underline flex items-center gap-1"
          >
            <span>{t('dashboard.viewAll')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        }
      />
      <CardBody className="p-0">
        {pendingFollowups.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            {t('dashboard.noFollowups')}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {pendingFollowups.map((f) => (
              <div key={f.id} className="p-4 sm:p-5 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-navy-900 dark:text-white">{f.title}</h4>
                    <Badge variant={f.priority === 'high' ? 'danger' : 'warning'} size="sm">
                      {f.priority}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
                    Customer: <span className="font-bold text-navy-900 dark:text-white">{f.customer_name}</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {f.description}
                  </p>

                  {f.suggested_message_ta && (
                    <div className="mt-2.5 p-2 rounded-lg bg-cyanAccent-50 dark:bg-cyanAccent-500/10 border border-cyanAccent-200 dark:border-cyanAccent-500/20 text-xs text-navy-900 dark:text-cyanAccent-200 font-tamil flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-cyanAccent-600 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{f.suggested_message_ta}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => markFollowupCompleted(f.id)}
                  title="Mark as completed"
                  className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 transition-all active:scale-95 shrink-0"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
