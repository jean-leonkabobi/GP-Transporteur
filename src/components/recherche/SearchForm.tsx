// components/recherche/SearchForm.tsx
import { useState } from 'react';

interface SearchFormData {
  destination: string;
  date: string;
  type: string;
  poids: string;
  volume: string;
}

interface SearchFormProps {
  onSearch: (data: SearchFormData) => void;
  isLoading?: boolean;
  initialValues?: Partial<SearchFormData>;
}

const TYPES_MARCHANDISE = [
  'Colis standard',
  'Marchandises fragiles',
  'Produits alimentaires',
  'Matériaux de construction',
  'Électroménager',
  'Textile / Vêtements',
  'Autres',
];

export function SearchForm({ onSearch, isLoading = false, initialValues = {} }: SearchFormProps) {
  const [form, setForm] = useState<SearchFormData>({
    destination: initialValues.destination || '',
    date: initialValues.date || '',
    type: initialValues.type || '',
    poids: initialValues.poids || '',
    volume: initialValues.volume || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.destination.trim()) {
      onSearch(form);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: '9px 12px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    color: '#111827',
    background: '#fff',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '14px', padding: '20px 24px' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '16px' }}>
        Critères de recherche
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
            Destination <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            placeholder="Ex: Thiès, Saint-Louis..."
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
            Date d'enlèvement
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
            Type de marchandise
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            style={{ ...inputStyle, color: form.type ? '#111827' : '#9ca3af' }}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
          >
            <option value="">Sélectionner...</option>
            {TYPES_MARCHANDISE.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
            Poids estimé (kg)
          </label>
          <input
            type="number"
            min="0"
            value={form.poids}
            onChange={(e) => setForm({ ...form, poids: e.target.value })}
            placeholder="Ex: 50"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
            Volume estimé (m³)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.volume}
            onChange={(e) => setForm({ ...form, volume: e.target.value })}
            placeholder="Ex: 2"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 28px',
            background: isLoading ? '#93c5fd' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '9px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = '#1d4ed8'; }}
          onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = '#2563eb'; }}
        >
          {isLoading ? (
            <>
              <div style={{
                width: '14px',
                height: '14px',
                border: '2px solid rgba(255,255,255,0.4)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }}/>
              Recherche...
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              Rechercher
            </>
          )}
        </button>
      </div>
    </form>
  );
}