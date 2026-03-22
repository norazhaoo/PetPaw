import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { language, setLanguage, t } = useLanguage();

  const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文 (简体)' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'es', label: 'Español' },
    { code: 'th', label: 'ภาษาไทย' }
  ];

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <h2 style={{ marginBottom: '24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <SettingsIcon color="var(--text-main)" size={24} /> {t('settings')}
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '16px', fontWeight: 'bold', fontSize: '18px' }}>
          {t('language')}
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              style={{
                background: language === lang.code ? 'var(--primary)' : 'var(--card-bg)',
                color: language === lang.code ? '#fff' : 'var(--text-main)',
                border: language === lang.code ? 'none' : '1px solid #E0DACA',
                padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold',
                cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                boxShadow: language === lang.code ? 'var(--shadow-soft)' : 'none'
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
