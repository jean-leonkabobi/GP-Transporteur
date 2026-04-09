// components/rendezvous/RendezVousForm.tsx
import { useState } from 'react';

interface RendezVousFormData {
  commandeId: string;
  date: string;
  heure: string;
  lieu: string;
  notes: string;
}

interface RendezVousFormProps {
  commandes: Array<{ id: string; destination: string; type: string }>;
  onSubmit: (data: RendezVousFormData) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const HEURES_DISPO = [
  '07:00', '08:00', '09:00', '10:00', '10:30', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

export function RendezVousForm({ commandes, onSubmit, onClose, isLoading = false }: RendezVousFormProps) {
  const [form, setForm] = useState<RendezVousFormData>({
    commandeId: '',
    date: '',
    heure: '',
    lieu: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RendezVousFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RendezVousFormData, string>> = {};
    if (!form.commandeId) newErrors.commandeId = 'Sélectionnez une commande';
    if (!form.date) newErrors.date = 'La date est requise';
    if (!form.heure) newErrors.heure = "L'heure est requise";
    if (!form.lieu.trim()) newErrors.lieu = 'Le lieu est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const inputStyle = (error?: string): React.CSSProperties => ({
    padding: '9px 12px',
    border: `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    background: '#fff',
    transition: 'border-color 0.15s',
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.45)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}
    onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}
      >
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
            📅 Nouveau rendez-vous
          </h2>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '7px',
              padding: '7px',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
              Commande <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={form.commandeId}
              onChange={(e) => setForm({ ...form, commandeId: e.target.value })}
              style={{ ...inputStyle(errors.commandeId), color: form.commandeId ? '#111827' : '#9ca3af' }}
            >
              <option value="">Sélectionner une commande...</option>
              {commandes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.destination} ({c.type})
                </option>
              ))}
            </select>
            {errors.commandeId && <span style={{ fontSize: '11.5px', color: '#ef4444' }}>{errors.commandeId}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                Date <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={inputStyle(errors.date)}
              />
              {errors.date && <span style={{ fontSize: '11.5px', color: '#ef4444' }}>{errors.date}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                Heure <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={form.heure}
                onChange={(e) => setForm({ ...form, heure: e.target.value })}
                style={{ ...inputStyle(errors.heure), color: form.heure ? '#111827' : '#9ca3af' }}
              >
                <option value="">Choisir...</option>
                {HEURES_DISPO.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              {errors.heure && <span style={{ fontSize: '11.5px', color: '#ef4444' }}>{errors.heure}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
              Lieu <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: 12 Rue Carnot, Dakar"
              value={form.lieu}
              onChange={(e) => setForm({ ...form, lieu: e.target.value })}
              style={inputStyle(errors.lieu)}
            />
            {errors.lieu && <span style={{ fontSize: '11.5px', color: '#ef4444' }}>{errors.lieu}</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
              Notes / Instructions
            </label>
            <textarea
              rows={3}
              placeholder="Code d'accès, précisions sur le lieu..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={{ ...inputStyle(), resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                background: '#fff',
                color: '#374151',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 2,
                padding: '10px',
                background: isLoading ? '#93c5fd' : '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '13px',
                    height: '13px',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }}/>
                  Création...
                </>
              ) : 'Créer le rendez-vous'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}