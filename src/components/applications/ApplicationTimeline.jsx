import React from 'react';
import { STAGE_CONFIG, formatDate } from '../../utils/formatters';
import { CheckCircle2, Clock, CircleDot, AlertCircle } from 'lucide-react';

export function ApplicationTimeline({ status, timeline = [] }) {
  const allStages = [
    'new_lead',
    'contacted',
    'eligibility_checked',
    'documents_pending',
    'application_submitted',
    'under_verification',
    'approved',
    'disbursed',
  ];

  const currentStep = STAGE_CONFIG[status]?.step || 1;
  const isRejected = status === 'rejected';

  return (
    <div className="py-4">
      {/* Visual Step Bar */}
      <div className="relative flex items-center justify-between">
        {/* Background connector line */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-800 -z-0" />
        
        {/* Progress active bar */}
        <div
          className={`absolute top-4 left-4 h-1 transition-all duration-500 -z-0 ${
            isRejected ? 'bg-rose-500' : 'bg-gradient-to-r from-electric-600 to-cyanAccent-500'
          }`}
          style={{
            width: isRejected ? '100%' : `${Math.min(100, Math.max(0, ((currentStep - 1) / (allStages.length - 1)) * 100))}%`,
          }}
        />

        {allStages.map((stageKey, idx) => {
          const config = STAGE_CONFIG[stageKey];
          const isPassed = config.step < currentStep;
          const isCurrent = config.step === currentStep && !isRejected;

          return (
            <div key={stageKey} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                  isCurrent
                    ? 'bg-electric-600 text-white ring-4 ring-electric-500/20 scale-110 shadow-lg shadow-electric-600/30'
                    : isPassed
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-white dark:bg-navy-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <CircleDot className="w-4 h-4 animate-pulse" />
                ) : (
                  idx + 1
                )}
              </div>
              <span className="hidden sm:block text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-2 text-center max-w-[70px] truncate">
                {config.label}
              </span>
            </div>
          );
        })}
      </div>

      {isRejected && (
        <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>This application was rejected during underwriting.</span>
        </div>
      )}

      {/* Audit Log Timeline Entries */}
      {timeline.length > 0 && (
        <div className="mt-6 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Lifecycle Activity Log
          </h5>
          <div className="space-y-2">
            {timeline.map((item, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-navy-900/60 border border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-navy-900 dark:text-white capitalize">
                    {STAGE_CONFIG[item.stage]?.label || item.stage}:
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">{item.note}</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {formatDate(item.timestamp, true)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
