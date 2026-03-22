import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { differenceInDays, parseISO } from 'date-fns';

const PetContext = createContext();

const initialDate = new Date().toISOString();

const defaultState = {
  activePetId: null,
  pets: [], 
  inventoryItems: [
    { id: 'food', label: 'Food', current: 0, dailyConsumption: 50, icon: 'Package', color: '#F5B041' },
    { id: 'litter', label: 'Litter', current: 0, dailyConsumption: 200, icon: 'Archive', color: '#AAB7B8' }
  ],
  lastDeductionDate: initialDate,
  logs: [], 
  reminders: [], 
  weightHistory: [],
  medicalRecords: [],
  customActions: [] 
};

export const PetProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('petpaw_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.pets) parsed.pets = [];
        if (!parsed.customActions) parsed.customActions = [];
        
        // Migrate to array structure
        if (parsed.inventory && !parsed.inventoryItems) {
           parsed.inventoryItems = [
             { id: 'food', label: 'Food', current: parsed.inventory.food?.current || 0, dailyConsumption: parsed.inventory.food?.dailyConsumption || 50, icon: 'Package', color: '#F5B041' },
             { id: 'litter', label: 'Litter', current: parsed.inventory.litter?.current || 0, dailyConsumption: parsed.inventory.litter?.dailyConsumption || 200, icon: 'Archive', color: '#AAB7B8' }
           ];
           delete parsed.inventory; // Housekeeping
        } else if (!parsed.inventoryItems) {
           parsed.inventoryItems = defaultState.inventoryItems;
        } else {
           parsed.inventoryItems = parsed.inventoryItems.map(item => {
             if (item.id === 'food' && item.label.includes('Cat Food')) return { ...item, label: 'Food' };
             if (item.id === 'litter' && item.label.includes('Cat Litter')) return { ...item, label: 'Litter' };
             if (item.id === 'food' && item.label.includes('🦴')) return { ...item, label: 'Food' };
             return item;
           });
        }

        return parsed;
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    const today = new Date();
    const lastDeduction = parseISO(state.lastDeductionDate || initialDate);
    const daysPassed = differenceInDays(today, lastDeduction);

    if (daysPassed > 0) {
      setState(prev => {
        const newItems = prev.inventoryItems.map(item => ({
          ...item,
          current: Math.max(0, item.current - ((item.dailyConsumption || 0) * daysPassed))
        }));
        
        return {
          ...prev,
          inventoryItems: newItems,
          lastDeductionDate: today.toISOString()
        };
      });
    }
  }, [state.lastDeductionDate]);

  useEffect(() => {
    localStorage.setItem('petpaw_data', JSON.stringify(state));
  }, [state]);

  const setActivePetId = (id) => {
    setState(prev => ({ ...prev, activePetId: id }));
  };

  const addPet = (petData) => {
    const id = uuidv4();
    const newPet = { ...petData, id };

    setState(prev => {
      let nextInventory = [...prev.inventoryItems];
      if (petData.species === 'dog') {
        nextInventory = nextInventory.filter(i => i.id !== 'litter');
      } else if (petData.species === 'cat') {
        if (!nextInventory.some(i => i.id === 'litter')) {
          nextInventory.unshift({ id: 'litter', label: 'Litter', current: 0, dailyConsumption: 200, icon: 'Archive', color: '#AAB7B8' });
        }
      }
      return {
        ...prev,
        pets: [...prev.pets, newPet],
        activePetId: id,
        inventoryItems: nextInventory
      };
    });

    if (petData.initialWeight) {
      _addWeightInternal(id, parseFloat(petData.initialWeight));
    }
  };

  const editPet = (id, petData) => {
    setState(prev => ({
      ...prev,
      pets: prev.pets.map(p => p.id === id ? { ...p, ...petData } : p)
    }));
  };

  const deletePet = (id) => {
    setState(prev => {
      const nextPets = prev.pets.filter(p => p.id !== id);
      return { 
        ...prev, 
        pets: nextPets, 
        activePetId: prev.activePetId === id ? (nextPets.length > 0 ? nextPets[0].id : null) : prev.activePetId 
      };
    });
  };

  const updateInventory = (id, values) => {
    setState(prev => ({
      ...prev,
      inventoryItems: prev.inventoryItems.map(item => item.id === id ? { ...item, ...values } : item)
    }));
  };

  const adjustInventory = (id, amount) => {
    setState(prev => ({
      ...prev,
      inventoryItems: prev.inventoryItems.map(item => item.id === id ? { ...item, current: Math.max(0, item.current + amount) } : item)
    }));
  };

  const addInventoryItem = (label, icon, color, dailyConsumption) => {
    const newItem = { id: uuidv4(), label, icon, color, current: 0, dailyConsumption: parseInt(dailyConsumption) || 0 };
    setState(prev => ({ ...prev, inventoryItems: [...prev.inventoryItems, newItem] }));
  };

  const deleteInventoryItem = (id) => {
    setState(prev => ({ ...prev, inventoryItems: prev.inventoryItems.filter(i => i.id !== id) }));
  };

  const addCustomAction = (label, color, iconIdx) => {
    if (!state.activePetId) return;
    const newAction = { id: uuidv4(), petId: state.activePetId, label, color, iconIdx };
    setState(prev => ({ ...prev, customActions: [...prev.customActions, newAction] }));
  };

  const deleteCustomAction = (id) => {
    setState(prev => ({ ...prev, customActions: prev.customActions.filter(ca => ca.id !== id) }));
  };

  const addLog = (type, targetDate = new Date().toISOString(), note = '', color = null, iconIdx = null) => {
    if (!state.activePetId) return;
    const newLog = { id: uuidv4(), petId: state.activePetId, type, date: targetDate, note, color, iconIdx };
    
    setState(prev => {
      const clearedReminders = prev.reminders.map(r => 
        (r.petId === prev.activePetId && r.type === type && !r.done) ? { ...r, done: true } : r
      );
      
      const nextState = { ...prev, logs: [newLog, ...prev.logs], reminders: clearedReminders };
      return nextState;
    });
    
    const daysToAdd = {
      'deworming': 30,
      'vaccine': 365,
      'brush_teeth': 1,
      'scoop_litter': 1
    };

    if (daysToAdd[type]) {
      const dueDate = new Date(targetDate);
      dueDate.setDate(dueDate.getDate() + daysToAdd[type]);
      addReminder(type, dueDate.toISOString());
    }
  };

  const deleteLog = (id) => {
    setState(prev => ({ ...prev, logs: prev.logs.filter(l => l.id !== id) }));
  };

  const deleteMedicalRecord = (id) => {
    setState(prev => ({ ...prev, medicalRecords: prev.medicalRecords.filter(m => m.id !== id) }));
  };

  const addReminder = (type, dueDate) => {
    if (!state.activePetId) return;
    const newReminder = { id: uuidv4(), petId: state.activePetId, type, dueDate, done: false };
    setState(prev => ({ ...prev, reminders: [newReminder, ...prev.reminders] }));
  };

  const completeReminder = (id) => {
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, done: true } : r)
    }));
  };

  const _addWeightInternal = (petId, weight, targetDate = new Date().toISOString()) => {
    const newEntry = { id: uuidv4(), petId, date: targetDate, weight: parseFloat(weight) };
    setState(prev => ({
      ...prev,
      weightHistory: [...prev.weightHistory, newEntry].sort((a,b) => new Date(a.date) - new Date(b.date))
    }));
  };

  const addWeight = (weight, targetDate = new Date().toISOString()) => {
    if (!state.activePetId) return;
    _addWeightInternal(state.activePetId, weight, targetDate);
  };

  const deleteWeight = (id) => {
    setState(prev => ({ ...prev, weightHistory: prev.weightHistory.filter(w => w.id !== id) }));
  };

  const addMedicalRecord = (tags, imageStr, targetDate = new Date().toISOString()) => {
    if (!state.activePetId) return;
    const newRecord = { id: uuidv4(), petId: state.activePetId, date: targetDate, tags, image: imageStr };
    setState(prev => ({
      ...prev,
      medicalRecords: [newRecord, ...prev.medicalRecords]
    }));
  };

  return (
    <PetContext.Provider value={{
      state,
      setActivePetId,
      addPet,
      editPet,
      deletePet,
      updateInventory,
      adjustInventory,
      addInventoryItem,
      deleteInventoryItem,
      addCustomAction,
      deleteCustomAction,
      addLog,
      deleteLog,
      addReminder,
      completeReminder,
      addWeight,
      deleteWeight,
      addMedicalRecord,
      deleteMedicalRecord
    }}>
      {children}
    </PetContext.Provider>
  );
};

export default PetContext;
export const usePet = () => useContext(PetContext);
