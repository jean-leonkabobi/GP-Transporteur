import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useAuth';

// ============================================================
// TYPES
// ============================================================
interface Transporteur {
  id: string;
  nom: string;
  photo: string;
  prix: number;
  delai: string;
  note: number;
  vehicule: string;
  zones: string[];
}

interface FormCommande {
  // Étape 1 — Marchandise
  type: string;
  poids: string;
  volume: string;
  description: string;
  // Étape 2 — Livraison
  adresseCollecte: string;
  destination: string;
  dateCollecte: string;
  creneauCollecte: string;
  instructionsSpeciales: string;
  // Étape 3 — Transporteur
  transporteurId: string;
}

type FieldErrors = Partial<Record<keyof FormCommande, string>>;

// ============================================================
// MOCK TRANSPORTEURS
// ============================================================
const MOCK_TRANSPORTEURS: Transporteur[] = [
  { id: 'tr-001', nom: 'Ndiaye Express',         photo: 'NE', prix: 850,  delai: '1 jour',     note: 4.8, vehicule: 'Camion 5T',    zones: ['Thiès', 'Mbour'] },
  { id: 'tr-002', nom: 'Sénégal Transport Co.',   photo: 'ST', prix: 1200, delai: '1-2 jours',  note: 4.5, vehicule: 'Camionnette',  zones: ['Saint-Louis', 'Louga'] },
  { id: 'tr-003', nom: 'Diallo & Frères',          photo: 'DF', prix: 700,  delai: '2 jours',    note: 4.2, vehicule: 'Pick-up',      zones: ['Kaolack', 'Fatick'] },
  { id: 'tr-004', nom: 'Trans Ziguinchor',         photo: 'TZ', prix: 2500, delai: '2-3 jours',  note: 4.6, vehicule: 'Camion 10T',  zones: ['Ziguinchor', 'Kolda'] },
  { id: 'tr-005', nom: 'Rapid Livraison Dakar',    photo: 'RL', prix: 500,  delai: 'Même jour',  note: 4.9, vehicule: 'Moto',        zones: ['Dakar', 'Pikine'] },
  { id: 'tr-006', nom: 'Touba Transport Plus',     photo: 'TP', prix: 1800, delai: '1-2 jours',  note: 4.3, vehicule: 'Camion 5T',   zones: ['Touba', 'Diourbel'] },
];

const TYPES_MARCHANDISE = [
  'Colis standard', 'Marchandises fragiles', 'Produits alimentaires',
  'Matériaux de construction', 'Électroménager', 'Textile / Vêtements', 'Autres',
];

const CRENEAUX = [
  '08h00 - 10h00', '10h00 - 12h00', '12h00 - 14h00',
  '14h00 - 16h00', '16h00 - 18h00', '18h00 - 20h00',
];

// ============================================================
// SOUS-COMPOSANTS PARTAGÉS
// ============================================================
function FieldWrapper({ label, required, error, children }: {
  label: string; required?: boolean;
  error?: string; children: React.ReactNode;
}) {
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

const inputStyle = (error?: string): React.CSSProperties => ({
  padding: '10px 13px',
  border: `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
  borderRadius: '9px', fontSize: '14px',
  color: '#111827', outline: 'none',
  background: '#fff', transition: 'border-color 0.15s',
  width: '100%', boxSizing: 'border-box' as const,
});

// ============================================================
// ÉTAPE 1 — Marchandise
// ============================================================
function EtapeMarchandise({ form, errors, onChange }: {
  form: FormCommande;
  errors: FieldErrors;
  onChange: (f: keyof FormCommande, v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <FieldWrapper label="Type de marchandise" required error={errors.type}>
        <select
          value={form.type}
          onChange={(e) => onChange('type', e.target.value)}
          style={{ ...inputStyle(errors.type), color: form.type ? '#111827' : '#9ca3af' }}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e)  => (e.target.style.borderColor = errors.type ? '#ef4444' : '#e5e7eb')}
        >
          <option value="">Sélectionner un type...</option>
          {TYPES_MARCHANDISE.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </FieldWrapper>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <FieldWrapper label="Poids estimé (kg)" required error={errors.poids}>
          <input
            type="number" min="0" placeholder="Ex : 50"
            value={form.poids}
            onChange={(e) => onChange('poids', e.target.value)}
            style={inputStyle(errors.poids)}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e)  => (e.target.style.borderColor = errors.poids ? '#ef4444' : '#e5e7eb')}
          />
        </FieldWrapper>
        <FieldWrapper label="Volume estimé (m³)" error={errors.volume}>
          <input
            type="number" min="0" step="0.1" placeholder="Ex : 2"
            value={form.volume}
            onChange={(e) => onChange('volume', e.target.value)}
            style={inputStyle(errors.volume)}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e)  => (e.target.style.borderColor = '#e5e7eb')}
          />
        </FieldWrapper>
      </div>

      <FieldWrapper label="Description du contenu" error={errors.description}>
        <textarea
          rows={3}
          placeholder="Décrivez brièvement le contenu (nature, fragilité, précautions...)"
          value={form.description}
          onChange={(e) => onChange('description', e.target.value)}
          style={{
            ...inputStyle(errors.description),
            resize: 'vertical', minHeight: '80px', lineHeight: 1.5,
          }}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e)  => (e.target.style.borderColor = '#e5e7eb')}
        />
      </FieldWrapper>
    </div>
  );
}

// ============================================================
// ÉTAPE 2 — Livraison
// ============================================================
function EtapeLivraison({ form, errors, onChange }: {
  form: FormCommande;
  errors: FieldErrors;
  onChange: (f: keyof FormCommande, v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <FieldWrapper label="Adresse de collecte" required error={errors.adresseCollecte}>
        <input
          type="text" placeholder="Ex : 12 Rue Carnot, Dakar"
          value={form.adresseCollecte}
          onChange={(e) => onChange('adresseCollecte', e.target.value)}
          style={inputStyle(errors.adresseCollecte)}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e)  => (e.target.style.borderColor = errors.adresseCollecte ? '#ef4444' : '#e5e7eb')}
        />
      </FieldWrapper>

      <FieldWrapper label="Destination" required error={errors.destination}>
        <input
          type="text" placeholder="Ex : Thiès, Saint-Louis..."
          value={form.destination}
          onChange={(e) => onChange('destination', e.target.value)}
          style={inputStyle(errors.destination)}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e)  => (e.target.style.borderColor = errors.destination ? '#ef4444' : '#e5e7eb')}
        />
      </FieldWrapper>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <FieldWrapper label="Date de collecte" required error={errors.dateCollecte}>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={form.dateCollecte}
            onChange={(e) => onChange('dateCollecte', e.target.value)}
            style={inputStyle(errors.dateCollecte)}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e)  => (e.target.style.borderColor = errors.dateCollecte ? '#ef4444' : '#e5e7eb')}
          />
        </FieldWrapper>

        <FieldWrapper label="Créneau horaire" required error={errors.creneauCollecte}>
          <select
            value={form.creneauCollecte}
            onChange={(e) => onChange('creneauCollecte', e.target.value)}
            style={{ ...inputStyle(errors.creneauCollecte), color: form.creneauCollecte ? '#111827' : '#9ca3af' }}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e)  => (e.target.style.borderColor = errors.creneauCollecte ? '#ef4444' : '#e5e7eb')}
          >
            <option value="">Choisir un créneau...</option>
            {CRENEAUX.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FieldWrapper>
      </div>

      <FieldWrapper label="Instructions spéciales" error={errors.instructionsSpeciales}>
        <textarea
          rows={3}
          placeholder="Code d'accès, étage, instructions de manipulation..."
          value={form.instructionsSpeciales}
          onChange={(e) => onChange('instructionsSpeciales', e.target.value)}
          style={{
            ...inputStyle(),
            resize: 'vertical', minHeight: '80px', lineHeight: 1.5,
          }}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e)  => (e.target.style.borderColor = '#e5e7eb')}
        />
      </FieldWrapper>
    </div>
  );
}

// ============================================================
// ÉTAPE 3 — Choix du transporteur
// ============================================================
function EtapeTransporteur({ form, errors, onChange }: {
  form: FormCommande;
  errors: FieldErrors;
  onChange: (f: keyof FormCommande, v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {errors.transporteurId && (
        <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.transporteurId}</span>
      )}
      {MOCK_TRANSPORTEURS.map((t) => {
        const selected = form.transporteurId === t.id;
        const prixTotal = form.poids ? t.prix * parseFloat(form.poids) : null;
        return (
          <div
            key={t.id}
            onClick={() => onChange('transporteurId', t.id)}
            style={{
              border: `2px solid ${selected ? '#2563eb' : '#e2e8f0'}`,
              borderRadius: '12px', padding: '14px 16px',
              cursor: 'pointer', background: selected ? '#eff6ff' : '#fff',
              boxShadow: selected ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = '#93c5fd'; }}
            onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Avatar */}
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: selected ? '#dbeafe' : '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700,
                color: selected ? '#2563eb' : '#64748b', flexShrink: 0,
              }}>
                {t.photo}
              </div>

              {/* Infos */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: selected ? '#1d4ed8' : '#111827' }}>
                    {t.nom}
                  </span>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: selected ? '#2563eb' : '#111827' }}>
                      {t.prix.toLocaleString()} FCFA<span style={{ fontSize: '11px', fontWeight: 400, color: '#94a3b8' }}>/kg</span>
                    </div>
                    {prixTotal && (
                      <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                        ≈ {prixTotal.toLocaleString()} FCFA total
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⭐ <strong>{t.note}</strong>
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>⏱️ {t.delai}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>🚛 {t.vehicule}</span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {t.zones.map((z) => (
                      <span key={z} style={{
                        fontSize: '11px', padding: '1px 7px',
                        background: selected ? '#dbeafe' : '#f1f5f9',
                        color: selected ? '#1d4ed8' : '#475569',
                        borderRadius: '20px',
                      }}>{z}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Radio */}
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                border: `2px solid ${selected ? '#2563eb' : '#d1d5db'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.15s',
                background: selected ? '#2563eb' : '#fff',
              }}>
                {selected && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }}/>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// ÉTAPE 4 — Récapitulatif
// ============================================================
function EtapeRecap({ form, transporteur, prixTotal, onConfirmer, loading }: {
  form: FormCommande;
  transporteur: Transporteur | null;
  prixTotal: number;
  onConfirmer: () => void;
  loading: boolean;
}) {
  const sections = [
    {
      titre: '📦 Marchandise',
      rows: [
        { label: 'Type',        value: form.type },
        { label: 'Poids',       value: `${form.poids} kg` },
        { label: 'Volume',      value: form.volume ? `${form.volume} m³` : '—' },
        { label: 'Description', value: form.description || '—' },
      ],
    },
    {
      titre: '🚚 Livraison',
      rows: [
        { label: 'Collecte',     value: form.adresseCollecte },
        { label: 'Destination',  value: form.destination },
        { label: 'Date',         value: form.dateCollecte },
        { label: 'Créneau',      value: form.creneauCollecte },
        { label: 'Instructions', value: form.instructionsSpeciales || '—' },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {sections.map((s) => (
        <div key={s.titre}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>{s.titre}</h3>
          <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
            {s.rows.map((r, i) => (
              <div key={r.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 14px', alignItems: 'flex-start',
                borderBottom: i < s.rows.length - 1 ? '1px solid #f1f5f9' : 'none',
                gap: '16px',
              }}>
                <span style={{ fontSize: '12px', color: '#64748b', flexShrink: 0 }}>{r.label}</span>
                <span style={{ fontSize: '13px', color: '#111827', fontWeight: 500, textAlign: 'right' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Transporteur sélectionné */}
      {transporteur && (
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>🏢 Transporteur</h3>
          <div style={{
            background: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: '10px', padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '9px',
                background: '#dbeafe', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700, color: '#2563eb',
              }}>
                {transporteur.photo}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1d4ed8' }}>{transporteur.nom}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>⏱️ {transporteur.delai} · ⭐ {transporteur.note}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{transporteur.prix.toLocaleString()} FCFA/kg</div>
            </div>
          </div>
        </div>
      )}

      {/* Prix total */}
      <div style={{
        background: '#f0fdf4', border: '1px solid #bbf7d0',
        borderRadius: '12px', padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>Prix total estimé</div>
          <div style={{ fontSize: '11px', color: '#4ade80', marginTop: '2px' }}>
            {form.poids} kg × {transporteur?.prix.toLocaleString()} FCFA/kg
          </div>
        </div>
        <div style={{ fontSize: '26px', fontWeight: 800, color: '#16a34a' }}>
          {prixTotal.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500 }}>FCFA</span>
        </div>
      </div>

      {/* Bouton confirmation */}
      <button
        onClick={onConfirmer}
        disabled={loading}
        style={{
          width: '100%', padding: '14px',
          background: loading ? '#86efac' : '#16a34a',
          color: '#fff', border: 'none', borderRadius: '10px',
          fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '10px',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#15803d'; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#16a34a'; }}
      >
        {loading ? (
          <>
            <div style={{
              width: '16px', height: '16px',
              border: '2px solid rgba(255,255,255,0.4)',
              borderTopColor: '#fff', borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }}/>
            Envoi en cours...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Confirmer la commande
          </>
        )}
      </button>
    </div>
  );
}

// ============================================================
// PAGE PRINCIPALE
// ============================================================
const ETAPES = [
  { numero: 1, label: 'Marchandise', icon: '📦' },
  { numero: 2, label: 'Livraison',   icon: '🚚' },
  { numero: 3, label: 'Transporteur', icon: '🏢' },
  { numero: 4, label: 'Confirmation', icon: '✅' },
];

export default function NouvelleCommandePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useCurrentUser();

  const transporteurIdParam = searchParams.get('transporteur') ?? '';

  const [etape, setEtape] = useState(transporteurIdParam ? 2 : 1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [form, setForm] = useState<FormCommande>({
    type: '', poids: '', volume: '', description: '',
    adresseCollecte: user?.adresse ?? '',
    destination: '', dateCollecte: '', creneauCollecte: '',
    instructionsSpeciales: '',
    transporteurId: transporteurIdParam,
  });

  // Si transporteur pré-sélectionné, passer directement à l'étape livraison
  useEffect(() => {
    if (transporteurIdParam) setEtape(2);
  }, [transporteurIdParam]);

  const setField = (field: keyof FormCommande, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const transporteurSelectionne = MOCK_TRANSPORTEURS.find((t) => t.id === form.transporteurId) ?? null;
  const prixTotal = transporteurSelectionne && form.poids
    ? transporteurSelectionne.prix * parseFloat(form.poids)
    : 0;

  // ----------------------------------------------------------
  // VALIDATIONS PAR ÉTAPE
  // ----------------------------------------------------------
  const validateEtape = (num: number): boolean => {
    const errs: FieldErrors = {};

    if (num === 1) {
      if (!form.type)   errs.type  = 'Le type de marchandise est requis.';
      if (!form.poids)  errs.poids = 'Le poids est requis.';
      else if (parseFloat(form.poids) <= 0) errs.poids = 'Le poids doit être supérieur à 0.';
    }

    if (num === 2) {
      if (!form.adresseCollecte)  errs.adresseCollecte  = "L'adresse de collecte est requise.";
      if (!form.destination)      errs.destination      = 'La destination est requise.';
      if (!form.dateCollecte)     errs.dateCollecte     = 'La date de collecte est requise.';
      if (!form.creneauCollecte)  errs.creneauCollecte  = 'Le créneau est requis.';
    }

    if (num === 3) {
      if (!form.transporteurId) errs.transporteurId = 'Veuillez sélectionner un transporteur.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ----------------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------------
  const goNext = () => {
    if (validateEtape(etape)) setEtape((e) => Math.min(e + 1, 4) as 1 | 2 | 3 | 4);
  };

  const goBack = () => {
    setErrors({});
    setEtape((e) => Math.max(e - 1, 1) as 1 | 2 | 3 | 4);
  };

  // ----------------------------------------------------------
  // CONFIRMATION FINALE
  // ----------------------------------------------------------
  const handleConfirmer = async () => {
    setLoading(true);
    // Simule appel API
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    // Redirige vers les commandes avec un message de succès
    navigate('/commandes', { state: { success: 'Commande créée avec succès !' } });
  };

  // ----------------------------------------------------------
  // RENDU
  // ----------------------------------------------------------
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>

      {/* ====== HEADER ====== */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', gap: '16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', display: 'flex', alignItems: 'center',
            gap: '6px', fontSize: '13px', fontWeight: 500, padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Retour
        </button>
        <span style={{ color: '#e2e8f0' }}>|</span>
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
          Nouvelle commande
        </h1>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ====== STEPPER ====== */}
        <div style={{
          display: 'flex', alignItems: 'center',
          marginBottom: '32px', gap: '0',
        }}>
          {ETAPES.map((e, i) => {
            const done    = etape > e.numero;
            const active  = etape === e.numero;
            return (
              <div key={e.numero} style={{ display: 'flex', alignItems: 'center', flex: i < ETAPES.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: done ? '#16a34a' : active ? '#2563eb' : '#e2e8f0',
                    color: done || active ? '#fff' : '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: done ? '14px' : '15px',
                    fontWeight: 600, transition: 'all 0.3s', flexShrink: 0,
                  }}>
                    {done ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : e.icon}
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: active ? 600 : 500,
                    color: active ? '#2563eb' : done ? '#16a34a' : '#94a3b8',
                    whiteSpace: 'nowrap',
                  }}>
                    {e.label}
                  </span>
                </div>
                {i < ETAPES.length - 1 && (
                  <div style={{
                    flex: 1, height: '2px', margin: '0 8px', marginBottom: '18px',
                    background: done ? '#16a34a' : '#e2e8f0',
                    transition: 'background 0.3s',
                  }}/>
                )}
              </div>
            );
          })}
        </div>

        {/* ====== CARTE FORMULAIRE ====== */}
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: '16px', padding: '28px 32px',
          boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
        }}>
          {/* Titre étape */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              {ETAPES[etape - 1].icon} {ETAPES[etape - 1].label}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              {etape === 1 && 'Décrivez la marchandise à transporter.'}
              {etape === 2 && 'Indiquez les détails de collecte et de livraison.'}
              {etape === 3 && 'Choisissez le transporteur qui vous convient.'}
              {etape === 4 && 'Vérifiez les informations avant de confirmer.'}
            </p>
          </div>

          {/* Contenu étape */}
          {etape === 1 && <EtapeMarchandise  form={form} errors={errors} onChange={setField} />}
          {etape === 2 && <EtapeLivraison    form={form} errors={errors} onChange={setField} />}
          {etape === 3 && <EtapeTransporteur form={form} errors={errors} onChange={setField} />}
          {etape === 4 && (
            <EtapeRecap
              form={form}
              transporteur={transporteurSelectionne}
              prixTotal={prixTotal}
              onConfirmer={handleConfirmer}
              loading={loading}
            />
          )}

          {/* Boutons navigation (sauf étape 4 qui a son propre bouton) */}
          {etape < 4 && (
            <div style={{
              display: 'flex', gap: '10px',
              marginTop: '28px', paddingTop: '20px',
              borderTop: '1px solid #f1f5f9',
            }}>
              {etape > 1 && (
                <button
                  onClick={goBack}
                  style={{
                    flex: 1, padding: '11px',
                    background: '#fff', color: '#374151',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '9px', fontSize: '14px',
                    fontWeight: 500, cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#94a3b8')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                >
                  ← Retour
                </button>
              )}
              <button
                onClick={goNext}
                style={{
                  flex: 2, padding: '11px',
                  background: '#2563eb', color: '#fff',
                  border: 'none', borderRadius: '9px',
                  fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
              >
                {etape === 3 ? 'Voir le récapitulatif →' : 'Continuer →'}
              </button>
            </div>
          )}
        </div>

        {/* Indicateur texte */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>
          Étape {etape} sur {ETAPES.length}
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}