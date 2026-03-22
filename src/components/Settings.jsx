import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Settings as SettingsIcon, Globe, HelpCircle, Info, Trash2, ChevronRight, Check } from 'lucide-react';

const Settings = () => {
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文 (简体)' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'es', label: 'Español' },
    { code: 'th', label: 'ภาษาไทย' }
  ];

  const handleClearData = () => {
    if (window.confirm(t('clear_confirm'))) {
      localStorage.removeItem('petpaw_data');
      alert(t('data_cleared'));
      window.location.reload();
    }
  };

  const MenuItem = ({ icon: Icon, label, onClick, rightElement, danger }) => (
    <button 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        width: '100%', padding: '16px', background: 'transparent', border: 'none', 
        borderBottom: '1px solid #F0EDE6', cursor: 'pointer', transition: 'background 0.2s',
        color: danger ? '#E74C3C' : 'var(--text-main)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Icon size={20} color={danger ? '#E74C3C' : 'var(--text-muted)'} />
        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{label}</span>
      </div>
      {rightElement || <ChevronRight size={18} color="var(--text-muted)" />}
    </button>
  );

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #F0EDE6', background: '#FFFDF2' }}>
          <SettingsIcon color="var(--primary)" size={24} /> 
          <h2 style={{ margin: 0, fontSize: '18px' }}>{t('settings')}</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <MenuItem 
            icon={Globe} label={t('language')} 
            onClick={() => setShowLangMenu(!showLangMenu)}
            rightElement={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{LANGUAGES.find(l => l.code === language)?.label}</span>
                <ChevronRight size={18} style={{ transform: showLangMenu ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            }
          />

          {showLangMenu && (
            <div style={{ background: '#FAF9F5', padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderBottom: '1px solid #F0EDE6' }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                  style={{
                    background: language === lang.code ? 'var(--primary)' : 'var(--card-bg)',
                    color: language === lang.code ? '#fff' : 'var(--text-main)',
                    border: language === lang.code ? '2px solid var(--primary)' : '2px solid #E0DACA', 
                    padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: language === lang.code ? 'var(--shadow-soft)' : 'none'
                  }}
                >
                  {language === lang.code && <Check size={16} />}
                  {lang.label}
                </button>
              ))}
            </div>
          )}

          <MenuItem icon={HelpCircle} label={t('help')} onClick={() => alert("Please email support@petpaw.com for assistance or join our Discord!")} />
          <MenuItem icon={Info} label={t('about')} onClick={() => alert("PetPaw v2.5\nLocally encrypted, species-adaptive smart tracking.")} />
          
          <button 
            onClick={handleClearData}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: '16px', background: 'transparent', border: 'none', 
              cursor: 'pointer', color: '#E74C3C', marginTop: '8px'
            }}
          >
            <Trash2 size={18} />
            <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{t('clear_data')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
