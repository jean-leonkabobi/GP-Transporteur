import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// ============================================================
// TYPES
// ============================================================
interface Transporteur {
  id: string;
  nom: string;
  photo: string;
  note: number;
  nbAvis: number;
  prix: number;         // FCFA par kg
  delai: string;        // ex: "1-2 jours"
  zones: string[];
  disponible: boolean;
  vehicule: string;
  telephone: string;
  lat: number;
  lng: number;
}

interface FiltresRecherche {
  destination: string;
  date: string;
  type: string;
  poids: string;
  volume: string;
}

// ============================================================
// DONNÉES MOCK
// ============================================================
const TYPES_MARCHANDISE = [
  'Colis standard',
  'Marchandises fragiles',
  'Produits alimentaires',
  'Matériaux de construction',
  'Électroménager',
  'Textile / Vêtements',
  'Autres',
];

const MOCK_TRANSPORTEURS: Transporteur[] = [
  {
    id: 'tr-001',
    nom: 'Ndiaye Express',
    photo: 'NE',
    note: 4.8,
    nbAvis: 124,
    prix: 850,
    delai: '1 jour',
    zones: ['Thiès', 'Mbour', 'Saly'],
    disponible: true,
    vehicule: 'Camion 5T',
    telephone: '+221 77 111 22 33',
    lat: 14.7667,
    lng: -17.3667,
  },
  {
    id: 'tr-002',
    nom: 'Sénégal Transport Co.',
    photo: 'ST',
    note: 4.5,
    nbAvis: 89,
    prix: 1200,
    delai: '1-2 jours',
    zones: ['Saint-Louis', 'Louga', 'Kébémer'],
    disponible: true,
    vehicule: 'Camionnette',
    telephone: '+221 77 222 33 44',
    lat: 16.0179,
    lng: -16.4896,
  },
  {
    id: 'tr-003',
    nom: 'Diallo & Frères',
    photo: 'DF',
    note: 4.2,
    nbAvis: 56,
    prix: 700,
    delai: '2 jours',
    zones: ['Kaolack', 'Fatick', 'Gossas'],
    disponible: false,
    vehicule: 'Pick-up',
    telephone: '+221 77 333 44 55',
    lat: 14.1652,
    lng: -16.0726,
  },
  {
    id: 'tr-004',
    nom: 'Trans Ziguinchor',
    photo: 'TZ',
    note: 4.6,
    nbAvis: 201,
    prix: 2500,
    delai: '2-3 jours',
    zones: ['Ziguinchor', 'Kolda', 'Sédhiou'],
    disponible: true,
    vehicule: 'Camion 10T',
    telephone: '+221 77 444 55 66',
    lat: 12.5583,
    lng: -16.2719,
  },
  {
    id: 'tr-005',
    nom: 'Rapid Livraison Dakar',
    photo: 'RL',
    note: 4.9,
    nbAvis: 312,
    prix: 500,
    delai: 'Même jour',
    zones: ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque'],
    disponible: true,
    vehicule: 'Moto / Scooter',
    telephone: '+221 77 555 66 77',
    lat: 14.6937,
    lng: -17.4441,
  },
  {
    id: 'tr-006',
    nom: 'Touba Transport Plus',
    photo: 'TP',
    note: 4.3,
    nbAvis: 78,
    prix: 1800,
    delai: '1-2 jours',
    zones: ['Touba', 'Diourbel', 'Bambey'],
    disponible: true,
    vehicule: 'Camion 5T',
    telephone: '+221 77 666 77 88',
    lat: 14.8575,
    lng: -15.8830,
  },
];

// ============================================================
// SOUS-COMPOSANTS
// ============================================================

// --- Étoiles ---
function Stars({ note }: { note: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i <= Math.round(note) ? '#f59e0b' : '#e2e8f0'}
          stroke={i <= Math.round(note) ? '#f59e0b' : '#e2e8f0'}
          strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

// --- Badge disponibilité ---
function DisponibiliteBadge({ disponible }: { disponible: boolean }) {
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600, padding: '2px 8px',
      borderRadius: '20px',
      color: disponible ? '#16a34a' : '#dc2626',
      background: disponible ? '#f0fdf4' : '#fef2f2',
    }}>
      {disponible ? '● Disponible' : '● Indisponible'}
    </span>
  );
}

// --- Carte transporteur ---
function TransporteurCard({
  transporteur,
  selected,
  onSelect,
  onCommander,
}: {
  transporteur: Transporteur;
  selected: boolean;
  onSelect: () => void;
  onCommander: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: '#fff',
        border: `2px solid ${selected ? '#2563eb' : '#e2e8f0'}`,
        borderRadius: '12px',
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: selected ? '0 0 0 4px rgba(37,99,235,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#93c5fd';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      {/* En-tête carte */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        {/* Avatar */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '11px',
          background: '#eff6ff', border: '1px solid #bfdbfe',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700, color: '#2563eb', flexShrink: 0,
        }}>
          {transporteur.photo}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>
              {transporteur.nom}
            </h3>
            <DisponibiliteBadge disponible={transporteur.disponible} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <Stars note={transporteur.note} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{transporteur.note}</span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>({transporteur.nbAvis} avis)</span>
          </div>
        </div>
      </div>

      {/* Infos */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '8px', marginBottom: '12px',
      }}>
        {[
          { icon: '💰', label: 'Prix', value: `${transporteur.prix.toLocaleString()} FCFA/kg` },
          { icon: '⏱️', label: 'Délai', value: transporteur.delai },
          { icon: '🚛', label: 'Véhicule', value: transporteur.vehicule },
          { icon: '📞', label: 'Tél.', value: transporteur.telephone },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px' }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>{item.label}</div>
              <div style={{ fontSize: '12px', color: '#374151', fontWeight: 500 }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Zones couvertes */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginBottom: '5px' }}>
          Zones couvertes
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {transporteur.zones.map((zone) => (
            <span key={zone} style={{
              fontSize: '11px', padding: '2px 8px',
              background: '#f1f5f9', color: '#475569',
              borderRadius: '20px', fontWeight: 500,
            }}>
              {zone}
            </span>
          ))}
        </div>
      </div>

      {/* Bouton commander */}
      <button
        onClick={(e) => { e.stopPropagation(); onCommander(); }}
        disabled={!transporteur.disponible}
        style={{
          width: '100%', padding: '9px',
          background: transporteur.disponible ? '#2563eb' : '#e2e8f0',
          color: transporteur.disponible ? '#fff' : '#94a3b8',
          border: 'none', borderRadius: '8px',
          fontSize: '13px', fontWeight: 600,
          cursor: transporteur.disponible ? 'pointer' : 'not-allowed',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { if (transporteur.disponible) e.currentTarget.style.background = '#1d4ed8'; }}
        onMouseLeave={(e) => { if (transporteur.disponible) e.currentTarget.style.background = '#2563eb'; }}
      >
        {transporteur.disponible ? 'Commander' : 'Indisponible'}
      </button>
    </div>
  );
}

// --- Carte interactive (SVG simplifié du Sénégal) ---
function CarteInteractive({
  transporteurs,
  selectedId,
  onSelect,
}: {
  transporteurs: Transporteur[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  // Points normalisés sur une carte SVG 300x400
  const normalize = (lat: number, lng: number) => {
    const minLat = 12.3, maxLat = 16.7;
    const minLng = -17.5, maxLng = -11.3;
    const x = ((lng - minLng) / (maxLng - minLng)) * 260 + 20;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 340 + 20;
    return { x, y };
  };

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #f1f5f9',
        background: '#f8fafc',
      }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: 0 }}>
          📍 Localisation des transporteurs
        </p>
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>
          Cliquez sur un point pour sélectionner
        </p>
      </div>
      <div style={{ padding: '16px', background: '#f0f9ff' }}>
        <svg
          viewBox="0 0 300 400"
          width="100%"
          style={{ display: 'block' }}
        >
          {/* Fond carte simplifié */}
          <rect x="0" y="0" width="300" height="400" fill="#e0f2fe" rx="8"/>

          {/* Silhouette Sénégal simplifiée */}
          <path
            d="M 60 40 L 200 30 L 260 80 L 280 140 L 260 200 L 220 260 L 180 300 L 140 340 L 100 360 L 60 340 L 30 280 L 20 200 L 40 120 Z"
            fill="#dbeafe"
            stroke="#93c5fd"
            strokeWidth="1.5"
            opacity="0.7"
          />

          {/* Grille légère */}
          {[80, 160, 240].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="400" stroke="#bfdbfe" strokeWidth="0.5" opacity="0.5"/>
          ))}
          {[100, 200, 300].map((y) => (
            <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#bfdbfe" strokeWidth="0.5" opacity="0.5"/>
          ))}

          {/* Points transporteurs */}
          {transporteurs.map((t) => {
            const { x, y } = normalize(t.lat, t.lng);
            const isSelected = selectedId === t.id;
            return (
              <g
                key={t.id}
                onClick={() => onSelect(t.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Halo sélection */}
                {isSelected && (
                  <circle cx={x} cy={y} r="18" fill="rgba(37,99,235,0.15)" stroke="#2563eb" strokeWidth="1"/>
                )}
                {/* Point principal */}
                <circle
                  cx={x} cy={y} r={isSelected ? 9 : 7}
                  fill={t.disponible ? (isSelected ? '#2563eb' : '#3b82f6') : '#94a3b8'}
                  stroke="#fff"
                  strokeWidth="2"
                />
                {/* Initiales */}
                <text
                  x={x} y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="6"
                  fontWeight="700"
                  fill="#fff"
                >
                  {t.photo}
                </text>
                {/* Label nom */}
                <text
                  x={x} y={y + (isSelected ? 22 : 19)}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight={isSelected ? '700' : '500'}
                  fill={isSelected ? '#1d4ed8' : '#374151'}
                >
                  {t.nom.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Légende */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid #f1f5f9',
        display: 'flex', gap: '16px',
      }}>
        {[
          { color: '#3b82f6', label: 'Disponible' },
          { color: '#94a3b8', label: 'Indisponible' },
        ].map((l) => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }}/>
            <span style={{ fontSize: '11px', color: '#64748b' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function RecherchePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [filtres, setFiltres] = useState<FiltresRecherche>({
    destination: searchParams.get('destination') ?? '',
    date: '',
    type: '',
    poids: '',
    volume: '',
  });

  const [resultats, setResultats] = useState<Transporteur[]>([]);
  const [loading, setLoading] = useState(false);
  const [rechercheFaite, setRechercheFaite] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [triFiltres, setTriFiltres] = useState<'prix' | 'note' | 'delai'>('note');
  const selectedRef = useRef<HTMLDivElement>(null);

  const setFiltreField = (field: keyof FiltresRecherche) => (val: string) => {
    setFiltres((f) => ({ ...f, [field]: val }));
  };

  // Recherche automatique si destination dans l'URL
  useEffect(() => {
    if (filtres.destination) handleRecherche();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll vers la carte sélectionnée
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedId]);

  // ----------------------------------------------------------
  // RECHERCHE MOCK
  // ----------------------------------------------------------
  const handleRecherche = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setRechercheFaite(false);

    // Simule un délai réseau
    await new Promise((r) => setTimeout(r, 900));

    // Filtre mock : retourne tous les transporteurs qui couvrent la destination
    const dest = filtres.destination.toLowerCase().trim();
    const filtered = dest
      ? MOCK_TRANSPORTEURS.filter((t) =>
          t.zones.some((z) => z.toLowerCase().includes(dest)) ||
          dest.includes(t.zones[0].toLowerCase().split(' ')[0])
        )
      : MOCK_TRANSPORTEURS;

    setResultats(filtered.length > 0 ? filtered : MOCK_TRANSPORTEURS);
    setLoading(false);
    setRechercheFaite(true);
    setSelectedId(null);
  };

  // ----------------------------------------------------------
  // TRI
  // ----------------------------------------------------------
  const resultsTries = [...resultats].sort((a, b) => {
    if (triFiltres === 'prix') return a.prix - b.prix;
    if (triFiltres === 'note') return b.note - a.note;
    // delai — tri alphabétique simple
    return a.delai.localeCompare(b.delai);
  });

  // ----------------------------------------------------------
  // COMMANDER
  // ----------------------------------------------------------
  const handleCommander = (transporteurId: string) => {
    navigate(`/commandes/nouvelle?transporteur=${transporteurId}`);
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
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none',
            cursor: 'pointer', color: '#64748b',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', fontWeight: 500, padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Accueil
        </button>
        <span style={{ color: '#e2e8f0' }}>|</span>
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
          Recherche de transporteurs
        </h1>
        {rechercheFaite && (
          <span style={{
            marginLeft: 'auto', fontSize: '12px', color: '#64748b',
            background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px',
          }}>
            {resultats.length} transporteur{resultats.length > 1 ? 's' : ''} trouvé{resultats.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 24px' }}>

        {/* ====== FORMULAIRE DE FILTRES ====== */}
        <form
          onSubmit={handleRecherche}
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '20px 24px',
            marginBottom: '24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '16px' }}>
            Critères de recherche
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '16px',
          }}>
            {/* Destination */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                Destination <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={filtres.destination}
                onChange={(e) => setFiltreField('destination')(e.target.value)}
                placeholder="Ex : Thiès, Saint-Louis..."
                style={{
                  padding: '9px 12px', border: '1.5px solid #e5e7eb',
                  borderRadius: '8px', fontSize: '13px', outline: 'none',
                  color: '#ffffff', transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e)  => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>

            {/* Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                Date d'enlèvement
              </label>
              <input
                type="date"
                value={filtres.date}
                onChange={(e) => setFiltreField('date')(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  padding: '9px 12px', border: '1.5px solid #e5e7eb',
                  borderRadius: '8px', fontSize: '13px', outline: 'none',
                  color: '#ffffff', transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e)  => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>

            {/* Type de marchandise */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                Type de marchandise
              </label>
              <select
                value={filtres.type}
                onChange={(e) => setFiltreField('type')(e.target.value)}
                style={{
                  padding: '9px 12px', border: '1.5px solid #e5e7eb',
                  borderRadius: '8px', fontSize: '13px', outline: 'none',
                  color: filtres.type ? '#ffffff' : '#9ca3af',
                  background: '#fff', transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e)  => (e.target.style.borderColor = '#e5e7eb')}
              >
                <option value="">Sélectionner...</option>
                {TYPES_MARCHANDISE.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Poids */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                Poids estimé (kg)
              </label>
              <input
                type="number"
                value={filtres.poids}
                onChange={(e) => setFiltreField('poids')(e.target.value)}
                placeholder="Ex : 50"
                min="0"
                style={{
                  padding: '9px 12px', border: '1.5px solid #e5e7eb',
                  borderRadius: '8px', fontSize: '13px', outline: 'none',
                  color: '#ffffff', transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e)  => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>

            {/* Volume */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                Volume estimé (m³)
              </label>
              <input
                type="number"
                value={filtres.volume}
                onChange={(e) => setFiltreField('volume')(e.target.value)}
                placeholder="Ex : 2"
                min="0"
                step="0.1"
                style={{
                  padding: '9px 12px', border: '1.5px solid #e5e7eb',
                  borderRadius: '8px', fontSize: '13px', outline: 'none',
                  color: '#ffffff', transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e)  => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 28px',
                background: loading ? '#93c5fd' : '#2563eb',
                color: '#fff', border: 'none', borderRadius: '9px',
                fontSize: '14px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '14px', height: '14px',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff', borderRadius: '50%',
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

        {/* ====== RÉSULTATS ====== */}
        {rechercheFaite && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '20px',
            alignItems: 'start',
          }}>

            {/* ---- Liste transporteurs ---- */}
            <div>
              {/* Tri */}
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '14px',
              }}>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Trier par :
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['note', 'prix', 'delai'] as const).map((tri) => (
                    <button
                      key={tri}
                      onClick={() => setTriFiltres(tri)}
                      style={{
                        padding: '5px 12px',
                        background: triFiltres === tri ? '#2563eb' : '#fff',
                        color: triFiltres === tri ? '#fff' : '#374151',
                        border: `1px solid ${triFiltres === tri ? '#2563eb' : '#e2e8f0'}`,
                        borderRadius: '20px',
                        fontSize: '12px', fontWeight: 500,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {tri === 'note' ? '⭐ Note' : tri === 'prix' ? '💰 Prix' : '⏱️ Délai'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards */}
              {resultsTries.length === 0 ? (
                <div style={{
                  background: '#fff', border: '1px solid #e2e8f0',
                  borderRadius: '12px', padding: '48px 24px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Aucun transporteur trouvé
                  </p>
                  <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                    Essayez avec une autre destination.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {resultsTries.map((t) => (
                    <div
                      key={t.id}
                      ref={selectedId === t.id ? selectedRef : undefined}
                    >
                      <TransporteurCard
                        transporteur={t}
                        selected={selectedId === t.id}
                        onSelect={() => setSelectedId(t.id === selectedId ? null : t.id)}
                        onCommander={() => handleCommander(t.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ---- Carte interactive ---- */}
            <div style={{ position: 'sticky', top: '80px' }}>
              <CarteInteractive
                transporteurs={resultsTries}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
              />

              {/* Détail transporteur sélectionné */}
              {selectedId && (() => {
                const t = resultats.find((r) => r.id === selectedId);
                if (!t) return null;
                return (
                  <div style={{
                    marginTop: '12px',
                    background: '#fff',
                    border: '2px solid #2563eb',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    boxShadow: '0 0 0 4px rgba(37,99,235,0.08)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '9px',
                        background: '#eff6ff', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 700, color: '#2563eb',
                      }}>
                        {t.photo}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{t.nom}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Stars note={t.note}/>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>{t.note} ({t.nbAvis} avis)</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#2563eb' }}>
                          {t.prix.toLocaleString()} FCFA
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>/kg</span>
                      </div>
                      <button
                        onClick={() => handleCommander(t.id)}
                        disabled={!t.disponible}
                        style={{
                          padding: '7px 16px',
                          background: t.disponible ? '#2563eb' : '#e2e8f0',
                          color: t.disponible ? '#fff' : '#94a3b8',
                          border: 'none', borderRadius: '8px',
                          fontSize: '12px', fontWeight: 600,
                          cursor: t.disponible ? 'pointer' : 'not-allowed',
                        }}
                      >
                        Commander
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* État initial */}
        {!rechercheFaite && !loading && (
          <div style={{
            background: '#fff', border: '1px dashed #cbd5e1',
            borderRadius: '14px', padding: '60px 24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚚</div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
              Trouvez le transporteur idéal
            </p>
            <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '360px', margin: '0 auto' }}>
              Renseignez votre destination et vos critères pour voir les transporteurs disponibles dans votre zone.
            </p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}