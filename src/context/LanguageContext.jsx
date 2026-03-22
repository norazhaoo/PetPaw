import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('petpaw_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('petpaw_language', language);
  }, [language]);

  const t = useCallback((key) => {
    const translationSet = translations[language] || translations['en'];
    return translationSet[key] || translations['en'][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
