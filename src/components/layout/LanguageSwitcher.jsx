import React from 'react';
import { useLanguage } from '../../locales/i18n';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'tanglish', label: 'Tanglish', native: 'Tanglish' },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
      {!compact && <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />}
      {languages.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-150 ${
              isActive
                ? 'bg-white dark:bg-navy-900 text-electric-600 dark:text-cyanAccent-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang.native}
          </button>
        );
      })}
    </div>
  );
}
