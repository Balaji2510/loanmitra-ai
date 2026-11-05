import React, { useState } from 'react';
import { useLanguage } from '../locales/i18n';
import { EligibilityCalculator } from '../components/calculator/EligibilityCalculator';
import { EmiCalculator } from '../components/calculator/EmiCalculator';
import { Calculator, Percent } from 'lucide-react';

export function EligibilityPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('eligibility');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight">
          {t('calculator.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('calculator.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('eligibility')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'eligibility'
              ? 'border-electric-600 text-electric-600 dark:text-cyanAccent-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>{t('calculator.tabEligibility')}</span>
        </button>

        <button
          onClick={() => setActiveTab('emi')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'emi'
              ? 'border-electric-600 text-electric-600 dark:text-cyanAccent-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>{t('calculator.tabEmi')}</span>
        </button>
      </div>

      {/* Active Tab Component */}
      <div>
        {activeTab === 'eligibility' ? <EligibilityCalculator /> : <EmiCalculator />}
      </div>
    </div>
  );
}
