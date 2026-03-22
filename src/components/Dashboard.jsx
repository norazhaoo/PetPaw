import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { 
  format, parseISO, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameDay, getDay, isSameMonth, 
  addMonths, subMonths, isToday, startOfDay, isBefore, formatDistanceToNow
} from 'date-fns';
import * as LucideIcons from 'lucide-react';
import { Syringe, Bug, Package, Archive, ChevronLeft, ChevronRight, XCircle, Plus, Star, Heart, Droplet, Sun, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ToothIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3c-2 0-4 2-4 5 0 4 2 8 3 12h2l4-5 4 5h2c1-4 3-8 3-12 0-3-2-5-4-5-1.5 0-3 1-4 2-1-1-2.5-2-4-2z"/>
  </svg>
);

const ShovelIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10.5" y="2" width="3" height="6" rx="1.5" />
    <path d="M12 8v2" />
    <path d="M8.5 10h7l2 8a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2z" />
    <path d="M10 13v4" />
    <path d="M12 13v5" />
    <path d="M14 13v4" />
  </svg>
);

const ElectronicScaleIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="3" ry="3" />
    <rect x="8" y="7" width="8" height="4" rx="1" />
  </svg>
);

const CUSTOM_ICONS = [
  Star, Heart, Droplet, Sun,
  LucideIcons.Zap, LucideIcons.Smile, LucideIcons.Music, LucideIcons.Coffee,
  LucideIcons.Camera, LucideIcons.Gift, LucideIcons.Umbrella, LucideIcons.Book,
  LucideIcons.Feather, LucideIcons.Flame, LucideIcons.Moon, LucideIcons.Cloud
];

const ICON_MAP = {
  vaccine: <Syringe size={36} color="#FF7B54" />,
  deworming: <Bug size={36} color="#93C653" />,
  brush_teeth: <ToothIcon size={36} color="#5DADE2" />,
  scoop_litter: <ShovelIcon size={36} color="#8F8377" />,
  walk_dog: <LucideIcons.Bone size={36} color="#8F8377" />,
  medical: <span style={{fontSize:'24px'}}>🏥</span>,
  food_refill: <Package size={24} color="#F5B041" />,
  litter_refill: <Archive size={24} color="#AAB7B8" />
};

const SMALL_ICON_MAP = {
  vaccine: <Syringe size={14} color="#FF7B54" />,
  deworming: <Bug size={14} color="#93C653" />,
  brush_teeth: <ToothIcon size={14} color="#5DADE2" />,
  scoop_litter: <ShovelIcon size={14} color="#8F8377" />,
  walk_dog: <LucideIcons.Bone size={14} color="#8F8377" />,
  medical: <span style={{fontSize:'12px'}}>🏥</span>,
  food_refill: <Package size={14} color="#F5B041" />,
  litter_refill: <Archive size={14} color="#AAB7B8" />
};

const LABEL_MAP = {
  vaccine: 'Vaccination',
  deworming: 'Deworming',
  brush_teeth: 'Brushed Teeth',
  scoop_litter: 'Scooped Box',
  walk_dog: 'Walked Dog',
  food_refill: 'Refill Food',
  litter_refill: 'Refill Litter'
};

const COLORS = ['#FF7B54', '#93C653', '#5DADE2', '#FEE140', '#9B59B6', '#E74C3C'];

const Dashboard = () => {
  const { state, addLog, deleteLog, addCustomAction, deleteCustomAction, addWeight, deleteWeight } = usePet();
  const [feedback, setFeedback] = useState(null);
  
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customColor, setCustomColor] = useState(COLORS[4]);
  const [customIconIdx, setCustomIconIdx] = useState(0);

  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState(4.0);

  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  
  const activePet = state.pets.find(p => p.id === state.activePetId);
  if (!activePet) return null;

  const isDog = activePet.species === 'dog';
  const quickActions = isDog 
    ? ['vaccine', 'deworming', 'brush_teeth', 'walk_dog']
    : ['vaccine', 'deworming', 'brush_teeth', 'scoop_litter'];
  
  const customActions = state.customActions.filter(ca => ca.petId === state.activePetId);

  const applyTimeToDate = (baseDate) => {
    const now = new Date();
    const targetDate = new Date(baseDate);
    targetDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    return targetDate;
  };

  const handleAction = (type, color = null, iconIdx = null, label = null) => {
    addLog(type, applyTimeToDate(selectedDate).toISOString(), '', color, iconIdx);
    setFeedback(`Logged: ${label || LABEL_MAP[type]}`);
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleSaveCustom = () => {
    if (!customName.trim()) return;
    addCustomAction(customName, customColor, customIconIdx);
    setShowCustomModal(false);
    setCustomName('');
  };

  const handleSaveWeight = () => {
    addWeight(newWeight, applyTimeToDate(selectedDate).toISOString());
    setShowWeightModal(false);
    setFeedback(`Logged Weight: ${newWeight} kg`);
    setTimeout(() => setFeedback(null), 2000);
  };

  const petLogs = state.logs.filter(l => l.petId === state.activePetId);
  const petMeds = state.medicalRecords.filter(m => m.petId === state.activePetId);
  const petWeights = state.weightHistory.filter(w => w.petId === state.activePetId);

  const firstDay = startOfMonth(currentMonth);
  const lastDay = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
  const startDayOfWeek = getDay(firstDay);
  const blanks = Array.from({ length: startDayOfWeek }).map((_, i) => `blank-${i}`);

  const getSmallIcon = (type, customColor, customIdx) => {
    if (type.startsWith('custom_') && customColor) {
      const LucideIcon = CUSTOM_ICONS[customIdx] || CUSTOM_ICONS[0];
      return <LucideIcon size={14} color={customColor} />;
    }
    return SMALL_ICON_MAP[type];
  };

  const getLargeIcon = (type, customColor, customIdx) => {
    if (type.startsWith('custom_') && customColor) {
      const LucideIcon = CUSTOM_ICONS[customIdx] || CUSTOM_ICONS[0];
      return <LucideIcon size={36} color={customColor} />;
    }
    return ICON_MAP[type];
  };

  const getDayIcons = (date) => {
    const icons = [];
    petLogs.forEach(l => { 
      if (isSameDay(parseISO(l.date), date)) icons.push(getSmallIcon(l.type, l.color, l.iconIdx)); 
    });
    petMeds.forEach(m => { if (isSameDay(parseISO(m.date), date)) icons.push(SMALL_ICON_MAP.medical); });
    petWeights.forEach(w => { if (isSameDay(parseISO(w.date), date)) icons.push(<ElectronicScaleIcon size={14} color="#3498DB" />); });
    return icons.slice(0, 4);
  };

  const currentMonthLogs = petLogs.filter(l => isSameMonth(parseISO(l.date), currentMonth));
  const stats = currentMonthLogs.reduce((acc, log) => {
    const key = log.type;
    const label = log.type.startsWith('custom_') ? customActions.find(c => c.id === log.type.split('_')[1])?.label || 'Custom' : LABEL_MAP[log.type];
    if (!acc[key]) acc[key] = { count: 0, label, color: log.color, idx: log.iconIdx };
    acc[key].count += 1;
    return acc;
  }, {});

  const selectedDayLogs = petLogs.filter(l => isSameDay(parseISO(l.date), selectedDate));
  const selectedDayWeights = petWeights.filter(w => isSameDay(parseISO(w.date), selectedDate));
  
  const combinedLogs = [
    ...selectedDayLogs.map(l => ({ ...l, typeGroup: 'log' })),
    ...selectedDayWeights.map(w => ({ ...w, typeGroup: 'weight' }))
  ].sort((a,b) => parseISO(b.date) - parseISO(a.date));

  const chartData = petWeights.map(entry => ({
    ...entry,
    displayDate: format(parseISO(entry.date), 'MMM dd')
  }));

  const showWarning = state.inventoryItems?.some(item => Math.floor(item.current / (item.dailyConsumption || 1)) <= 7) || false;
  
  const targetLogType = isDog ? 'walk_dog' : 'scoop_litter';
  const actionLogs = petLogs.filter(l => l.type === targetLogType).sort((a,b) => parseISO(b.date) - parseISO(a.date));
  let lastActionText = 'Never';
  if (actionLogs.length > 0) {
    const dist = formatDistanceToNow(parseISO(actionLogs[0].date));
    lastActionText = dist.replace('about ', '').replace('less than a minute', 'just now');
    if (lastActionText !== 'just now') lastActionText += ' ago';
  }

  const listTitle = isToday(selectedDate) ? "Today's Logs" : `Logs for ${format(selectedDate, 'MMM do')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Status Indicators (Borderless 2D) */}
      <div style={{ padding: '0 10px' }}>
        <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stock Alert</h3>
      </div>
      <style>
        {`
           .hide-scroll::-webkit-scrollbar { display: none; }
           .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
      <div className="hide-scroll" style={{ display: 'flex', overflowX: 'auto', gap: '20px', padding: '10px 4px' }}>
        {state.inventoryItems?.map(item => {
          const daysLeft = Math.floor((item.current || 0) / (item.dailyConsumption || 1));
          const isLow = daysLeft <= 7;
          const IconComp = LucideIcons[item.icon] || LucideIcons.Package;
          
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <IconComp size={36} color={item.color || '#F5B041'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '900', fontSize: '18px', color: isLow ? '#E74C3C' : 'var(--text-main)' }}>{daysLeft}d</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{item.label?.replace(/ .*/, '')}</span>
              </div>
            </div>
          );
        })}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, paddingRight: '12px' }}>
          {isDog ? <LucideIcons.Bone size={36} color="#8F8377" /> : <ShovelIcon size={36} color="#8F8377" />}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '900', fontSize: '14px', color: 'var(--text-main)' }}>{lastActionText.replace(' minutes', 'm').replace(' hours', 'h').replace(' days', 'd')}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{isDog ? 'Last Walked' : 'Last Scooped'}</span>
          </div>
        </div>
      </div>

      {showCustomModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '90%', maxWidth: '350px' }}>
            <h3>New Custom Event</h3>
            <input 
              placeholder="e.g. Bath Time" 
              value={customName} 
              onChange={e=>setCustomName(e.target.value)} 
              style={{ padding: '12px', borderRadius: '12px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' }}
            />
            
            <p className="font-bold" style={{ marginTop: '12px', fontSize: '14px' }}>Select Icon</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              {CUSTOM_ICONS.map((Icon, i) => (
                <button 
                  key={i} onClick={() => setCustomIconIdx(i)}
                  style={{ border: customIconIdx === i ? '2px solid var(--text-main)' : '2px solid transparent', padding: '8px', borderRadius: '8px', background: '#F0EDE6' }}
                >
                  <Icon size={24} color={customColor} />
                </button>
              ))}
            </div>

            <p className="font-bold" style={{ marginTop: '16px', fontSize: '14px' }}>Select Color</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button 
                  key={c} onClick={() => setCustomColor(c)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: c, border: customColor === c ? '2px solid var(--text-main)' : 'none' }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowCustomModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, padding: '12px' }} onClick={handleSaveCustom}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showWeightModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '90%', maxWidth: '350px' }}>
            <h3>Log Weight</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
              <input 
                type="range" min="0.5" max="15.0" step="0.1" 
                value={newWeight} onChange={e => setNewWeight(parseFloat(e.target.value))} style={{ flex: 1 }}
              />
              <span className="font-bold" style={{ width: '60px' }}>{newWeight} kg</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowWeightModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, padding: '12px' }} onClick={handleSaveWeight}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* 2D Quick Actions */}
      <div style={{ padding: '0 10px' }}>
        <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Things to track</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '10px' }}>
          {quickActions.map(type => (
            <button
              key={type} onClick={() => handleAction(type)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '40px' }}
            >
              {ICON_MAP[type]}
            </button>
          ))}

          <button
            onClick={() => setShowWeightModal(true)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '40px' }}
          >
            <ElectronicScaleIcon size={36} color="#3498DB" />
          </button>
          
          {customActions.map(ca => {
            const LucideIcon = CUSTOM_ICONS[ca.iconIdx] || CUSTOM_ICONS[0];
            return (
              <div key={ca.id} style={{ position: 'relative' }}>
                <button
                  onClick={() => handleAction(`custom_${ca.id}`, ca.color, ca.iconIdx, ca.label)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '40px', height: '100%' }}
                >
                  <LucideIcon size={36} color={ca.color} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteCustomAction(ca.id); }}
                  style={{ position: 'absolute', top: 0, right: -4, padding: 0, background: 'var(--bg-color)', border: 'none', borderRadius: '50%', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                >
                  <XCircle size={16} />
                </button>
              </div>
            );
          })}

          <button
            onClick={() => setShowCustomModal(true)}
            style={{ background: '#F0EDE6', borderRadius: '50%', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', margin: 'auto 0' }}
          >
            <Plus size={24} />
          </button>
        </div>
        {feedback && (
          <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>{feedback}</div>
        )}
      </div>

      <div className="desktop-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Interactive Calendar + Statistics Card */}
          <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} style={{ background: 'none' }}><ChevronLeft /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ margin: 0 }}>{format(currentMonth, 'MMMM yyyy')}</h3>
            <button 
              onClick={() => { setCurrentMonth(startOfMonth(new Date())); setSelectedDate(startOfDay(new Date())); }}
              style={{ padding: '2px 8px', borderRadius: '12px', background: 'var(--primary)', color: 'var(--text-main)', fontWeight: 'bold', fontSize: '11px', border: 'none', cursor: 'pointer' }}
            >
              Today
            </button>
          </div>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={{ background: 'none' }}><ChevronRight /></button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginTop: '8px' }}>
          {blanks.map(b => <div key={b} />)}
          {daysInMonth.map(date => {
            const isSelected = isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);
            const icons = getDayIcons(date);
            return (
              <button 
                key={date.toString()} onClick={() => setSelectedDate(date)}
                style={{ 
                  minHeight: '48px', padding: '4px', borderRadius: '12px', 
                  border: isSelected ? '2px solid var(--primary)' : '2px solid transparent',
                  backgroundColor: isTodayDate ? '#FFFDF2' : 'transparent', fontWeight: isTodayDate ? '900' : 'bold',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'
                }}>
                <span style={{ fontSize: '12px', color: isTodayDate ? 'var(--warning)' : 'var(--text-main)' }}>
                  {format(date, 'd')}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center', marginTop: '4px' }}>
                  {icons.map((icon, idx) => <span key={idx}>{icon}</span>)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Integrated Statistics */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F0EDE6' }}>
          <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>Monthly Stats</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.keys(stats).length === 0 ? (
               <span className="text-muted" style={{ fontSize: '12px' }}>No activity.</span>
            ) : (
              Object.entries(stats).map(([type, data]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F0EDE6', padding: '6px 10px', borderRadius: '16px', fontSize: '13px', fontWeight: 'bold' }}>
                  {getSmallIcon(type, data.color, data.idx)} x{data.count}
                </div>
              ))
            )}
            {petWeights.filter(w => isSameMonth(parseISO(w.date), currentMonth)).length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F0EDE6', padding: '6px 10px', borderRadius: '16px', fontSize: '13px', fontWeight: 'bold' }}>
                <ElectronicScaleIcon size={14} color="#3498DB" /> x{petWeights.filter(w => isSameMonth(parseISO(w.date), currentMonth)).length}
              </div>
            )}
          </div>
        </div>
       </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '16px', margin: 0 }}>Weight History</h2>
            <ElectronicScaleIcon size={20} color="var(--text-main)" />
          </div>
          <div style={{ height: '220px', marginTop: '10px' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{fill: '#8F8377', fontSize: 12}} />
                  <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#8F8377', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: 'var(--text-main)' }}
                  />
                  <Line 
                    type="monotone" dataKey="weight" stroke="#3498DB" strokeWidth={4}
                    dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-muted" style={{ fontSize: '12px' }}>No weight history.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Selected Day Logs */}
        <div className="card" style={{ flex: 1 }}>
        <h2 style={{ fontSize: '16px', marginBottom: '8px' }}>{listTitle}</h2>
        <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '8px' }}>
          {combinedLogs.length === 0 ? (
            <p className="text-muted" style={{ fontSize: '13px' }}>No records for this day.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               {combinedLogs.map(item => {
                 if (item.typeGroup === 'weight') {
                   return (
                     <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <div><ElectronicScaleIcon size={36} color="#3498DB" /></div>
                         <div>
                           <div style={{ fontWeight: 'bold', fontSize: '13px' }}>Recorded Weight: {item.weight} kg</div>
                           <div className="text-muted" style={{ fontSize: '10px' }}>{format(parseISO(item.date), 'HH:mm')}</div>
                         </div>
                       </div>
                       <button onClick={() => deleteWeight(item.id)} style={{ color: '#FF7B54', background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={18} /></button>
                     </div>
                   );
                 } else {
                   const label = item.type.startsWith('custom_') ? customActions.find(c => c.id === item.type.split('_')[1])?.label || 'Custom' : LABEL_MAP[item.type];
                   return (
                     <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <div>{getLargeIcon(item.type, item.color, item.iconIdx)}</div>
                         <div>
                           <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{label}</div>
                           <div className="text-muted" style={{ fontSize: '10px' }}>{format(parseISO(item.date), 'HH:mm')}</div>
                         </div>
                       </div>
                       <button onClick={() => deleteLog(item.id)} style={{ color: '#FF7B54', background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={18} /></button>
                     </div>
                   );
                 }
               })}
            </div>
          )}
        </div>
      </div>
     </div>
    </div>
   </div>
  );
};

export default Dashboard;
