import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { useLanguage } from '../context/LanguageContext';
import { Camera, Plus, ArrowLeft, Pencil, Trash2 } from 'lucide-react';

const PetSelection = ({ isTab = false, onPetSelect }) => {
  const { state, setActivePetId, addPet, editPet, deletePet } = usePet();
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [editingPetId, setEditingPetId] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('cat');
  const [breed, setBreed] = useState('');
  const [birthday, setBirthday] = useState('');
  const [initialWeight, setInitialWeight] = useState(4.0);
  const [avatar, setAvatar] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 200;
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          } else if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          setAvatar(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (name.trim() === '') return;
    if (editingPetId) {
      editPet(editingPetId, { name, species, breed, birthday, initialWeight, avatar });
      setEditingPetId(null);
    } else {
      addPet({ name, species, breed, birthday, initialWeight, avatar });
    }
    setIsAdding(false);
  };

  const resetForm = () => {
    setName('');
    setSpecies('cat');
    setBreed('');
    setBirthday('');
    setInitialWeight(4.0);
    setAvatar(null);
    setEditingPetId(null);
    setIsAdding(false);
  };

  const handleEditClick = (e, pet) => {
    e.stopPropagation();
    setName(pet.name);
    setSpecies(pet.species || 'cat');
    setBreed(pet.breed || '');
    setBirthday(pet.birthday || '');
    setInitialWeight(pet.initialWeight || 4.0); // Ensure initialWeight is a number
    setAvatar(pet.avatar || null);
    setEditingPetId(pet.id);
    setIsAdding(true);
  };

  if (isAdding) {
    return (
      <div className={isTab ? "" : "app-container"} style={{ paddingBottom: '24px' }}>
        <header style={{ marginBottom: '24px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={resetForm} 
          style={{ position: 'absolute', left: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
        >
          <ArrowLeft />
        </button>
        <h2 style={{ margin: 0 }}>{editingPetId ? t('edit_pet') : t('add_pet')}</h2>
      </header>
        
        <div className="card">
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            {avatar ? (
              <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--primary)' }}>
                <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => setAvatar(null)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            ) : (
               <label style={{
                 width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#F0EDE6',
                 display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                 cursor: 'pointer', border: '2px dashed var(--text-muted)'
               }}>
                 <Camera size={32} color="var(--text-muted)" />
                 <span style={{ fontSize: '10px', marginTop: '4px', color: 'var(--text-muted)' }}>{t('photo')}</span>
                 <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
               </label>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t('species')} *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['cat', 'dog', 'other'].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSpecies(s)}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '12px', 
                      background: species === s ? 'var(--primary)' : 'var(--card-bg)',
                      border: species === s ? 'none' : '1px solid #E0DACA',
                      color: species === s ? '#fff' : 'var(--text-main)',
                      fontWeight: 'bold', cursor: 'pointer'
                    }}
                  >
                    {t(s)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t('name')} *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E0DACA', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t('breed_optional')}</label>
              <input type="text" value={breed} onChange={e => setBreed(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E0DACA', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t('birthday_optional')}</label>
              <input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E0DACA', boxSizing: 'border-box' }} />
            </div>
            {!editingPetId && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t('weight_kg')} *</label>
                <input type="number" step="0.1" value={initialWeight} onChange={e => setInitialWeight(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E0DACA', boxSizing: 'border-box' }} />
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t('photo_url')}</label>
              <input type="text" value={avatar || ''} onChange={e => setAvatar(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E0DACA', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={resetForm}>{t('cancel')}</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={!name}>{t('save')}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isTab ? "" : "app-container"} style={{ paddingBottom: '24px' }}>
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px' }}>🐾 PetPaw</h1>
        <p className="text-muted">Who are we caring for today?</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {state.pets.map(pet => (
          <div key={pet.id} style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
            <button 
              onClick={() => {
                setActivePetId(pet.id);
                if (onPetSelect) onPetSelect();
              }}
              style={{
                background: 'var(--card-bg)', padding: '16px', borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-soft)', display: 'flex', alignItems: 'center', gap: '16px',
                border: 'none', cursor: 'pointer', textAlign: 'left', flex: 1
              }}
            >
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0, backgroundColor: 'var(--primary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pet.avatar ? (
                  <img src={pet.avatar} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)' }}>{pet.name.charAt(0)}</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--text-main)' }}>{pet.name}</div>
                {pet.breed && <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{pet.breed}</div>}
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                <ArrowLeft style={{ transform: 'rotate(180deg)' }} />
              </div>
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={(e) => handleEditClick(e, pet)}
                style={{ background: 'var(--card-bg)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-soft)' }}
              >
                <Pencil size={16} color="var(--text-muted)" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`${t('delete_confirm')} ${pet.name}?`)) deletePet(pet.id);
                }}
                style={{ background: '#FDEBD0', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-soft)' }}
              >
                <Trash2 size={16} color="#E74C3C" />
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={() => setIsAdding(true)}
          style={{
            background: 'transparent', border: '2px dashed var(--primary)', padding: '16px', 
            borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            cursor: 'pointer', width: '100%', color: 'var(--text-main)'
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={24} color="var(--text-main)" />
          </div>
          <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-muted)' }}>{t('add_pet')}</span>
        </button>
      </div>
    </div>
  );
};

export default PetSelection;
