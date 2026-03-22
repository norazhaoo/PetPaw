import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { useLanguage } from '../context/LanguageContext';
import { Plus, XCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const ICONS = ['Package', 'Archive', 'Bone', 'Fish', 'Cylinder', 'Star', 'Heart', 'Apple', 'Pizza', 'Coffee', 'Pill'];
const COLORS = ['#F5B041', '#AAB7B8', '#E74C3C', '#3498DB', '#9B59B6', '#1ABC9C', '#F1948A', '#5DADE2', '#48C9B0', '#F4D03F'];

const StockControls = ({ item, adjustInventory, updateInventory, deleteInventoryItem, t }) => {
  return (
    <div className="card" style={{ marginBottom: '16px', position: 'relative' }}>
      {item.id !== 'food' && item.id !== 'litter' && (
        <button 
          onClick={() => { if(confirm(`${t('delete_confirm')} ${item.label}?`)) deleteInventoryItem(item.id); }}
          style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#E74C3C', cursor: 'pointer' }}
        >
          <XCircle size={18} />
        </button>
      )}
      <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>{item.label}</h2>
      
      {/* Current Amount Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F0EDE6', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
        <button 
          onClick={() => adjustInventory(item.id, -100)}
          style={{ background: 'var(--card-bg)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-soft)' }}
        >
          -
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <input 
            type="number"
            value={Math.round(item.current)}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              updateInventory(item.id, { current: Math.max(0, val) });
            }}
            style={{ 
              fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', 
              width: '90px', textAlign: 'center', background: 'transparent', border: 'none', 
              borderBottom: '2px dashed transparent', outline: 'none'
            }}
          />
          <span style={{ fontSize: '16px', color: 'var(--text-muted)', marginLeft: '4px' }}>g</span>
        </div>
        <button 
          onClick={() => adjustInventory(item.id, 100)}
          style={{ background: 'var(--primary)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-soft)' }}
        >
          +
        </button>
      </div>

      {/* Daily Consumption Row */}
      <div style={{ padding: '0 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
          <span className="text-muted font-bold">{t('daily_consumption')}</span>
          <span className="font-bold">{item.dailyConsumption} {t('g_per_day')}</span>
        </div>
        <input 
          type="range" 
          min={1} max={500} step={5}
          value={item.dailyConsumption} 
          onChange={(e) => updateInventory(item.id, { dailyConsumption: parseInt(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

const InventoryManager = () => {
  const { state, adjustInventory, updateInventory, addInventoryItem, deleteInventoryItem } = usePet();
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('Star');
  const [newColor, setNewColor] = useState(COLORS[0]);

  const handleAddSubmit = () => {
    if (newLabel.trim()) {
      addInventoryItem(newLabel, newIcon, newColor, 10);
      setNewLabel('');
      setNewIcon('Star');
      setIsAdding(false);
    }
  };

  return (
    <div className="desktop-cols-2">
      {state.inventoryItems.map(item => (
        <StockControls 
          key={item.id} 
          item={item}
          adjustInventory={adjustInventory} 
          updateInventory={updateInventory} 
          deleteInventoryItem={deleteInventoryItem}
          t={t}
        />
      ))}

      <button 
        onClick={() => setIsAdding(true)}
        style={{
          background: 'transparent', border: '2px dashed var(--primary)', padding: '16px', 
          borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          cursor: 'pointer', width: '100%', color: 'var(--text-main)', marginTop: '8px', marginBottom: '40px'
        }}
      >
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={24} color="var(--text-main)" />
        </div>
        <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-muted)' }}>{t('add_custom_stock')}</span>
      </button>

      {isAdding && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '90%', maxWidth: '350px' }}>
            <h2>{t('new_stock_item')}</h2>
            <div style={{ marginBottom: '16px', marginTop: '16px' }}>
              <label className="font-bold" style={{ display: 'block', marginBottom: '8px' }}>{t('name')}</label>
              <input 
                type="text" 
                value={newLabel} 
                onChange={e => setNewLabel(e.target.value)} 
                placeholder="..."
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #E0DACA', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label className="font-bold" style={{ display: 'block', marginBottom: '8px' }}>{t('select_icon')}</label>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {ICONS.map((icName, idx) => {
                  const IconComp = LucideIcons[icName] || LucideIcons.Star;
                  return (
                    <button 
                      key={icName} 
                      onClick={() => { setNewIcon(icName); setNewColor(COLORS[idx % COLORS.length]); }}
                      style={{ 
                        background: newIcon === icName ? newColor : 'transparent', 
                        border: '1px solid #E0DACA', borderRadius: '12px', padding: '8px', cursor: 'pointer',
                        color: newIcon === icName ? '#fff' : 'var(--text-main)', flexShrink: 0
                      }}
                    >
                      <IconComp size={24} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsAdding(false)}>{t('cancel')}</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleAddSubmit} disabled={!newLabel.trim()}>{t('create')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
