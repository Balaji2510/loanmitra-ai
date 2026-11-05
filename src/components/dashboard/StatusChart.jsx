import React from 'react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../locales/i18n';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export function StatusChart() {
  const { applications } = useData();
  const { t } = useLanguage();

  const stageKeys = [
    { key: 'new_lead', label: 'Lead', color: '#64748b' },
    { key: 'eligibility_checked', label: 'Eligibility', color: '#6366f1' },
    { key: 'documents_pending', label: 'Docs Pend', color: '#f59e0b' },
    { key: 'application_submitted', label: 'Logged', color: '#06b6d4' },
    { key: 'under_verification', label: 'Verif', color: '#8b5cf6' },
    { key: 'approved', label: 'Approved', color: '#10b981' },
    { key: 'disbursed', label: 'Disbursed', color: '#0d9488' },
  ];

  const data = stageKeys.map((s) => ({
    name: s.label,
    count: applications.filter((a) => a.status === s.key).length,
    color: s.color,
  }));

  return (
    <Card>
      <CardHeader
        title={t('dashboard.appStatusChart')}
        subtitle="Distribution of loan applications across processing stages"
      />
      <CardBody>
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#101B35',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
                cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
