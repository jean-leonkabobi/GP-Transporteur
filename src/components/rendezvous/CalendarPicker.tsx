// components/rendezvous/CalendarPicker.tsx
import { useState } from 'react';
import type { RendezVous, StatutRDV } from '../../types/rendezvous.types';

interface CalendarPickerProps {
  rdvList: RendezVous[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const MOIS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const JOURS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const STATUT_CFG: Record<StatutRDV, { color: string }> = {
  'En attente': { color: '#d97706' },
  'Confirmé': { color: '#16a34a' },
  'Refusé': { color: '#dc2626' },
  'Annulé': { color: '#64748b' },
  'Terminé': { color: '#7c3aed' },
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function CalendarPicker({ rdvList, selectedDate, onSelectDate }: CalendarPickerProps) {
  const today = new Date();
  const [annee, setAnnee] = useState(today.getFullYear());
  const [mois, setMois] = useState(today.getMonth());

  const nbJours = getDaysInMonth(annee, mois);
  const premierJour = getFirstDayOfMonth(annee, mois);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const rdvParDate: Record<string, RendezVous[]> = {};
  rdvList.forEach((r) => {
    if (!rdvParDate[r.date]) rdvParDate[r.date] = [];
    rdvParDate[r.date].push(r);
  });

  const prevMois = () => {
    if (mois === 0) {
      setMois(11);
      setAnnee(a => a - 1);
    } else {
      setMois(m => m - 1);
    }
  };

  const nextMois = () => {
    if (mois === 11) {
      setMois(0);
      setAnnee(a => a + 1);
    } else {
      setMois(m => m + 1);
    }
  };

  const cells: (number | null)[] = [
    ...Array(premierJour).fill(null),
    ...Array.from({ length: nbJours }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        borderBottom: '1px solid #f1f5f9',
      }}>
        <button
          onClick={prevMois}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
          {MOIS_FR[mois]} {annee}
        </span>
        <button
          onClick={nextMois}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Jours de semaine */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '8px 12px 4px' }}>
        {JOURS_FR.map(j => (
          <div key={j} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>
            {j}
          </div>
        ))}
      </div>

      {/* Jours */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 12px 12px', gap: '2px' }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const dateStr = toDateStr(annee, mois, day);
          const rdvsJour = rdvParDate[dateStr] ?? [];
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              style={{
                padding: '6px 4px',
                textAlign: 'center',
                borderRadius: '8px',
                cursor: 'pointer',
                background: isSelected ? '#2563eb' : isToday ? '#eff6ff' : 'transparent',
                border: isToday && !isSelected ? '1.5px solid #bfdbfe' : '1.5px solid transparent',
                position: 'relative',
              }}
            >
              <span style={{
                fontSize: '13px',
                fontWeight: isToday || isSelected ? 700 : 400,
                color: isSelected ? '#fff' : isToday ? '#2563eb' : '#374151',
              }}>
                {day}
              </span>
              {rdvsJour.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '3px' }}>
                  {rdvsJour.slice(0, 3).map(r => (
                    <div
                      key={r.id}
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: isSelected ? 'rgba(255,255,255,0.8)' : STATUT_CFG[r.statut].color,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}