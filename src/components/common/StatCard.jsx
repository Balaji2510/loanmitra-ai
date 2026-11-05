import React from 'react';
import { Card } from './Card';

export function StatCard({ title, value, icon: Icon, change, trend = 'neutral', color = 'electric', subtitle }) {
  const colorMap = {
    electric: {
      bg: 'bg-electric-50 dark:bg-electric-500/10 text-electric-600 dark:text-electric-400',
      border: 'border-electric-500/20',
      glow: 'shadow-electric-500/10',
    },
    cyan: {
      bg: 'bg-cyanAccent-50 dark:bg-cyanAccent-500/10 text-cyan-600 dark:text-cyanAccent-400',
      border: 'border-cyanAccent-500/20',
      glow: 'shadow-cyanAccent-500/10',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/10',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/10',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
      border: 'border-purple-500/20',
      glow: 'shadow-purple-500/10',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
      border: 'border-rose-500/20',
      glow: 'shadow-rose-500/10',
    },
  };

  const scheme = colorMap[color] || colorMap.electric;

  return (
    <Card className="p-5 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white mt-1.5 tracking-tight font-sans">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl ${scheme.bg} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>

      {change && (
        <div className="mt-3.5 flex items-center gap-1.5 text-xs font-semibold">
          <span className={trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : trend === 'down' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}>
            {change}
          </span>
          <span className="text-slate-400 font-normal">vs last month</span>
        </div>
      )}
    </Card>
  );
}
