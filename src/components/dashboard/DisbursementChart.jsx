import React from 'react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { useLanguage } from '../../locales/i18n';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { formatRupee } from '../../utils/formatters';

export function DisbursementChart() {
  const { t } = useLanguage();

  const data = [
    { month: 'Sep', amount: 1850000 },
    { month: 'Oct', amount: 2400000 },
    { month: 'Nov', amount: 3100000 },
    { month: 'Dec', amount: 4650000 },
    { month: 'Jan', amount: 5650000 },
    { month: 'Feb', amount: 6200000 },
  ];

  return (
    <Card>
      <CardHeader
        title={t('dashboard.monthlyDisbursementChart')}
        subtitle="Cumulative sanctioned and disbursed amounts (INR)"
      />
      <CardBody>
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="disbursedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `₹${val / 100000}L`}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [formatRupee(value), 'Disbursed']}
                contentStyle={{
                  backgroundColor: '#101B35',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#2563EB"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#disbursedGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
