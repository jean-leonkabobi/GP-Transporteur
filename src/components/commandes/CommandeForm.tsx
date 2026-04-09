// components/commandes/CommandeForm.tsx
import { useState } from 'react';

interface CommandeFormData {
  type: string;
  poids: string;
  volume: string;
  description: string;
  adresseCollecte: string;
  destination: string;
  dateCollecte: string;
  creneauCollecte: string;
  instructionsSpeciales: string;
  transporteurId: string;
}

interface CommandeFormProps {
  onSubmit: (data: CommandeFormData) => void;
  initialData?: Partial<CommandeFormData>;
  isLoading?: boolean;
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

const CRENEAUX = [
  '08h00 - 10h00',
  '10h00 - 12h00',
  '12h00 - 14h00',
  '14h00 - 16h00',
  '16h00 - 18h00',
  '18h00 - 20h00',
];

export function CommandeForm({ onSubmit, initialData = {}, isLoading = false }: CommandeFormProps) {
  const [form, setForm] = useState<CommandeFormData>({
    type: initialData.type || '',
    poids: initialData.poids || '',
    volume: initialData.volume || '',
    description: initialData.description || '',
    adresseCollecte: initialData.adresseCollecte || '',
    destination: initialData.destination || '',
    dateCollecte: initialData.dateCollecte || '',
    creneauCollecte: initialData.creneauCollecte || '',
    instructionsSpeciales: initialData.instructionsSpeciales || '',
    transporteurId: initialData.transporteurId || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CommandeFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CommandeFormData, string>> = {};
    
    if (!form.type) newErrors.type = 'Le type est requis';
    if (!form.poids) newErrors.poids = 'Le poids est requis';
    else if (parseFloat(form.poids) <= 0) newErrors.poids = 'Le poids doit être > 0';
    if (!form.adresseCollecte) newErrors.adresseCollecte = 'L\'adresse est requise';
    if (!form.destination) newErrors.destination = 'La destination est requise';
    if (!form.dateCollecte) newErrors.dateCollecte = 'La date est requise';
    if (!form.creneauCollecte) newErrors.creneauCollecte = 'Le créneau est requis';
    if (!form.transporteurId) newErrors.transporteurId = 'Le transporteur est requis';
    
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
    padding: '10px 13px',
    border: `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: '9px',
    fontSize: '14px',
    color: '#111827',
    outline: 'none',
    background: '#fff',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  });

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Field label="Type de marchandise" error={errors.type} required>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            style={inputStyle(errors.type)}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = errors.type ? '#ef4444' : '#e5e7eb')}
          >
            <option value="">Sélectionner...</option>
            {TYPES_MARCHANDISE.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>

        <Field label="Poids (kg)" error={errors.poids} required>
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.poids}
            onChange={(e) => setForm({ ...form, poids: e.target.value })}
            placeholder="Ex: 50"
            style={inputStyle(errors.poids)}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = errors.poids ? '#ef4444' : '#e5e7eb')}
          />
        </Field>
      </div>

      <Field label="Volume (m³)" error={errors.volume}>
        <input
          type="number"
          min="0"
          step="0.1"
          value={form.volume}
          onChange={(e) => setForm({ ...form, volume: e.target.value })}
          placeholder="Ex: 2"
          style={inputStyle(errors.volume)}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
        />
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Décrivez brièvement le contenu..."
          style={{ ...inputStyle(errors.description), resize: 'vertical' }}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
        />
      </Field>

      <Field label="Adresse de collecte" error={errors.adresseCollecte} required>
        <input
          type="text"
          value={form.adresseCollecte}
          onChange={(e) => setForm({ ...form, adresseCollecte: e.target.value })}
          placeholder="Ex: 12 Rue Carnot, Dakar"
          style={inputStyle(errors.adresseCollecte)}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.target.style.borderColor = errors.adresseCollecte ? '#ef4444' : '#e5e7eb')}
        />
      </Field>

      <Field label="Destination" error={errors.destination} required>
        <input
          type="text"
          value={form.destination}
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
          placeholder="Ex: Thiès, Saint-Louis..."
          style={inputStyle(errors.destination)}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.target.style.borderColor = errors.destination ? '#ef4444' : '#e5e7eb')}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Field label="Date de collecte" error={errors.dateCollecte} required>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={form.dateCollecte}
            onChange={(e) => setForm({ ...form, dateCollecte: e.target.value })}
            style={inputStyle(errors.dateCollecte)}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = errors.dateCollecte ? '#ef4444' : '#e5e7eb')}
          />
        </Field>

        <Field label="Créneau horaire" error={errors.creneauCollecte} required>
          <select
            value={form.creneauCollecte}
            onChange={(e) => setForm({ ...form, creneauCollecte: e.target.value })}
            style={inputStyle(errors.creneauCollecte)}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = errors.creneauCollecte ? '#ef4444' : '#e5e7eb')}
          >
            <option value="">Choisir...</option>
            {CRENEAUX.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Instructions spéciales" error={errors.instructionsSpeciales}>
        <textarea
          rows={2}
          value={form.instructionsSpeciales}
          onChange={(e) => setForm({ ...form, instructionsSpeciales: e.target.value })}
          placeholder="Code d'accès, étage, précautions..."
          style={{ ...inputStyle(errors.instructionsSpeciales), resize: 'vertical' }}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
        />
      </Field>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '13px',
          background: isLoading ? '#93c5fd' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: 600,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginTop: '8px',
        }}
        onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = '#1d4ed8'; }}
        onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = '#2563eb'; }}
      >
        {isLoading ? 'Création en cours...' : 'Créer la commande'}
      </button>
    </form>
  );
}

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: '11.5px', color: '#ef4444' }}>{error}</span>}
    </div>
  );
}