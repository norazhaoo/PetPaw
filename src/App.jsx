import React, { useState } from 'react';
import { usePet } from './context/PetContext';
import Layout from './components/Layout';
import PetSelection from './components/PetSelection';
import Dashboard from './components/Dashboard';
import InventoryManager from './components/InventoryManager';
import MedicalLog from './components/MedicalLog';
import Settings from './components/Settings';
import { PetProvider } from './context/PetContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function AppContent() {
  const { state } = usePet();
  const [activeTab, setActiveTab] = useState('pawfile');

  if (!state.activePetId) {
    return <PetSelection onPetSelect={() => setActiveTab('dashboard')} />;
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'pawfile': return <PetSelection isTab onPetSelect={() => setActiveTab('dashboard')} />;
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <InventoryManager />;
      case 'medical': return <MedicalLog />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <PetProvider>
        <AppContent />
      </PetProvider>
    </LanguageProvider>
  );
}
