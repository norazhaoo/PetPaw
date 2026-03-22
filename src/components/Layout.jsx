import { usePet } from '../context/PetContext';
import { useLanguage } from '../context/LanguageContext';
import { CalendarHeart, Package, PawPrint, Stethoscope, Settings as SettingsIcon } from 'lucide-react';

const Layout = ({ children, activeTab, onTabChange }) => {
  const { state, setActivePetId } = usePet();
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'pawfile', icon: PawPrint, label: t('pawfile') },
    { id: 'dashboard', icon: CalendarHeart, label: t('diary') },
    { id: 'inventory', icon: Package, label: t('stock') },
    { id: 'medical', icon: Stethoscope, label: t('medical_log') },
    { id: 'settings', icon: SettingsIcon, label: t('settings') }
  ];

  const activePet = state.pets.find(p => p.id === state.activePetId);

  return (
    <div className="app-container">
      {activeTab !== 'pawfile' && activePet && (
        <header className="layout-header" style={{ padding: '0 20px', marginBottom: '24px', paddingTop: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'var(--card-bg)',
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 100%)',
            backdropFilter: 'blur(10px)',
            padding: '16px 20px',
            borderRadius: '24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            border: '1px solid rgba(255,255,255,0.8)'
          }}>
            {activePet.avatar ? (
              <img 
                src={activePet.avatar} 
                alt={activePet.name} 
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #FFF', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
            ) : (
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, #FFB75E 100%)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                border: '3px solid #FFF', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}>
                {activePet.species === 'dog' ? '🐶' : activePet.species === 'other' ? '🐾' : '🐱'}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ fontSize: '26px', margin: 0, fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                {activePet.name}
              </h1>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                {activePet.breed || (activePet.species === 'dog' ? 'Dog' : activePet.species === 'cat' ? 'Cat' : 'Pet Profile')}
              </span>
            </div>
            
            <div style={{ marginLeft: 'auto', opacity: 0.1, display: 'flex' }}>
              <PawPrint size={48} color="var(--text-main)" />
            </div>
          </div>
        </header>
      )}
      
      <main className="main-content">
        {children}
      </main>

      <nav className="layout-nav">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="nav-button"
            style={{
              color: activeTab === tab.id ? 'var(--text-main)' : 'var(--text-muted)',
              transform: activeTab === tab.id ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <tab.icon size={26} color={activeTab === tab.id ? 'var(--primary-hover)' : 'var(--text-muted)'} />
            <span className="nav-label" style={{ fontSize: '11px', fontWeight: '800' }}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
