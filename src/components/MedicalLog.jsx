import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { useLanguage } from '../context/LanguageContext';
import { Camera, Image as ImageIcon, Thermometer, Wind, Frown, Coffee, AlertTriangle, Droplet, XCircle, Check, Bug, Stethoscope, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const MedicalLog = () => {
  const { state, addMedicalRecord, deleteMedicalRecord } = usePet();
  const { t } = useLanguage();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [image, setImage] = useState(null);

  const SYMPTOMS = [
    { id: 'fever', label: t('fever'), icon: Thermometer, color: '#FF7B54' },
    { id: 'vomiting', label: t('vomiting'), icon: Frown, color: '#3498DB' },
    { id: 'lethargy', label: t('lethargy'), icon: Coffee, color: '#9B59B6' },
    { id: 'no_appetite', label: t('no_appetite'), icon: Frown, color: '#E74C3C' },
    { id: 'diarrhea', label: t('diarrhea'), icon: Droplet, color: '#AAB7B8' },
    { id: 'coughing', label: t('coughing'), icon: Wind, color: '#1ABC9C' },
    { id: 'sneezing', label: t('sneezing'), icon: Bug, color: '#F1948A' }
  ];

  const toggleTag = (tag) => {
    if (selectedSymptoms.includes(tag)) {
      setSelectedSymptoms(selectedSymptoms.filter(sym => sym !== tag));
    } else {
      setSelectedSymptoms([...selectedSymptoms, tag]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 400;
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
          setImage(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (selectedSymptoms.length > 0 || image) {
      addMedicalRecord(selectedSymptoms, image);
      setSelectedSymptoms([]);
      setImage(null);
    }
  };

  return (
    <div className="desktop-cols-2">
      <div className="card">
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Stethoscope color="var(--primary)" size={24} /> {t('medical_log')}</h2>
        <div className="card" style={{ marginBottom: '24px', backgroundColor: 'var(--bg-main)' }}>
          <h3 style={{ marginBottom: '16px' }}>{t('symptoms')}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {SYMPTOMS.map((sym) => {
               const Icon = sym.icon;
               const isSelected = selectedSymptoms.includes(sym.id);
               return (
                 <button 
                   key={sym.id}
                   onClick={() => toggleTag(sym.id)}
                   style={{ 
                     display: 'flex', alignItems: 'center', gap: '8px', 
                     padding: '8px 16px', borderRadius: '16px', border: '1px solid #E0DACA',
                     background: isSelected ? 'var(--primary)' : 'var(--card-bg)',
                     cursor: 'pointer', transition: 'all 0.2s', boxShadow: isSelected ? 'var(--shadow-soft)' : 'none'
                   }}
                 >
                   <Icon size={20} color={sym.color} />
                   <span style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--text-main)' }}>{sym.label}</span>
                 </button>
               );
            })}
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
            {image ? (
              <div style={{ position: 'relative', flex: 1, height: '100px', borderRadius: '12px', overflow: 'hidden' }}>
                <img src={image} alt="Symptom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  onClick={() => setImage(null)}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                flex: 1, height: '100px', border: '2px dashed #E0DACA', borderRadius: '12px', cursor: 'pointer',
                color: 'var(--text-muted)'
              }}>
                <Camera size={24} color="#F5B041" />
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '4px' }}>
                  {t('photo')}
                </span>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
            )}
            
            <button 
              className="btn-primary" 
              onClick={handleSave} 
              disabled={selectedSymptoms.length === 0 && !image}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '100px' }}
            >
              <Check size={20} />
              {t('add_record')}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>{t('medical_log')}</h3>
        {state.medicalRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}><FileText size={48} color="#E0DACA" /></div>
            <p>{t('no_records_yet')}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {state.medicalRecords.map((record) => (
              <div key={record.id} style={{ position: 'relative', padding: '12px', border: '1px solid #F0EDE6', borderRadius: '12px' }}>
                <button 
                  onClick={() => deleteMedicalRecord(record.id)}
                  style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#E74C3C', cursor: 'pointer' }}
                >
                  <XCircle size={18} />
                </button>
                <p className="text-muted" style={{ fontSize: '12px', marginBottom: '8px' }}>
                  {format(parseISO(record.date), 'MMM dd, yyyy h:mm a')}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {record.tags.map(tagId => {
                    const sym = SYMPTOMS.find(s => s.id === tagId);
                    if (!sym) {
                      return (
                        <span key={tagId} style={{ background: 'var(--primary)', padding: '4px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                          {tagId}
                        </span>
                      );
                    }
                    const Icon = sym.icon;
                    return (
                      <span key={tagId} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--primary)', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold' }}>
                        <Icon size={14} color={sym.color} /> {sym.label}
                      </span>
                    )
                  })}
                </div>
                {record.image && (
                  <img src={record.image} alt="Record" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalLog;
