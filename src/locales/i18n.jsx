import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './en.json';
import ta from './ta.json';
import tanglish from './tanglish.json';

const translations = {
  en,
  ta,
  tanglish,
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('loanmitra_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('loanmitra_lang', language);
    // Apply font-family helper class to body for Tamil
    if (language === 'ta') {
      document.documentElement.classList.add('font-tamil');
    } else {
      document.documentElement.classList.remove('font-tamil');
    }
  }, [language]);

  // Nested object lookup with fallback
  const t = (path, fallback = '') => {
    if (!path) return '';
    const keys = path.split('.');
    let current = translations[language];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallbackVal = translations.en;
        for (const fbKey of keys) {
          if (fallbackVal && fallbackVal[fbKey] !== undefined) {
            fallbackVal = fallbackVal[fbKey];
          } else {
            return fallback || path;
          }
        }
        return fallbackVal;
      }
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
