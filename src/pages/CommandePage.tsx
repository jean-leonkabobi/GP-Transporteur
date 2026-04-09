import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHasRole } from '../hooks/useAuth';

// ============================================================
// TYPES
// ============================================================
type StatutCommande =
  | 'En attente'
  | 'Confirmée'
  | 'En cours'
  | 'Livré'
  | 'Annulée';

interface Commande {
  id: string;
  destination: string;
  origine: string;
  statut: StatutCommande;
  date: string;
  datelivraison?: string;
  transporteur: string;
  transporteurTel: string;
  client: string;
  clientTel: string;
  type: string;
  poids: number;
  volume: number;
  prix: number;
  description?: string;
}

// ============================================================
// DONNÉES MOCK
// ============================================================
const MOCK_COMMANDES: Commande[] = [
  {
    id: 'CMD-001',
    origine: 'Dakar',
    destination: 'Thiès',
    statut: 'En cours',
    date: '08 avr. 2026',
    datelivraison: '09 avr. 2026',
    transporteur: 'Ndiaye Express',
    transporteurTel: '+221 77 111 22 33',
    client: 'Amadou Diallo',
    clientTel: '+221 77 000 00 01',
    type: 'Colis standard',
    poids: 25,
    volume: 0.5,
    prix: 21250,
    description: 'Cartons de vêtements, fragiles',
  },
  {
    id: 'CMD-002',
    origine: 'Dakar',
    destination: 'Saint-Louis',
    statut: 'Livré',
    date: '05 avr. 2026',
    datelivraison: '06 avr. 2026',
    transporteur: 'Sénégal Transport Co.',
    transporteurTel: '+221 77 222 33 44',
    client: 'Amadou Diallo',
    clientTel: '+221 77 000 00 01',
    type: 'Marchandises fragiles',
    poids: 10,
    volume: 0.3,
    prix: 12000,
    description: 'Équipement électronique',
  },
  {
    id: 'CMD-003',
    origine: 'Dakar',
    destination: 'Ziguinchor',
    statut: 'En attente',
    date: '03 avr. 2026',
    transporteur: '—',
    transporteurTel: '—',
    client: 'Amadou Diallo',
    clientTel: '+221 77 000 00 01',
    type: 'Produits alimentaires',
    poids: 80,
    volume: 2,
    prix: 200000,
    description: 'Sacs de riz, denrées alimentaires',
  },
  {
    id: 'CMD-004',
    origine: 'Thiès',
    destination: 'Dakar',
    statut: 'Confirmée',
    date: '09 avr. 2026',
    datelivraison: '10 avr. 2026',
    transporteur: 'Ndiaye Express',
    transporteurTel: '+221 77 111 22 33',
    client: 'Mariama Sow',
    clientTel: '+221 77 999 88 77',
    type: 'Textile / Vêtements',
    poids: 15,
    volume: 0.4,
    prix: 12750,
    description: 'Rouleaux de tissu',
  },
  {
    id: 'CMD-005',
    origine: 'Dakar',
    destination: 'Kaolack',
    statut: 'Annulée',
    date: '01 avr. 2026',
    transporteur: 'Diallo & Frères',
    transporteurTel: '+221 77 333 44 55',
    client: 'Ibrahima Fall',
    clientTel: '+221 77 888 77 66',
    type: 'Matériaux de construction',
    poids: 200,
    volume: 5,
    prix: 140000,
    description: 'Ciment et briques',
  },
  {
    id: 'CMD-006',
    origine: 'Mbour',
    destination: 'Touba',
    statut: 'En cours',
    date: '07 avr. 2026',
    datelivraison: '09 avr. 2026',
    transporteur: 'Ndiaye Express',
    transporteurTel: '+221 77 111 22 33',
    client: 'Fatou Ndiaye',
    clientTel: '+221 77 777 66 55',
    type: 'Électroménager',
    poids: 45,
    volume: 1.2,
    prix: 38250,
    description: 'Réfrigérateur et machine à laver',
  },
];

// ============================================================
// CONFIG STATUTS
// ============================================================
const STATUT_CONFIG: Record<StatutCommande, { color: string; bg: string; border: string; icon: string }> = {
  'En attente': { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '⏳' },
  'Confirmée':  { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: '✅' },
  'En cours':   { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: '🚚' },
  'Livré':      { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '📦' },
  'Annulée':    { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: '❌' },
};

const ONGLETS: { label: string; statut: StatutCommande | 'Toutes' }[] = [
  { label: 'Toutes',     statut: 'Toutes'     },
  { label: 'En attente', statut: 'En attente' },
  { label: 'Confirmée',  statut: 'Confirmée'  },
  { label: 'En cours',   statut: 'En cours'   },
  { label: 'Livré',      statut: 'Livré'      },
  { label: 'Annulée',    statut: 'Annulée'    },
];

// ============================================================
// SOUS-COMPOSANTS
// ============================================================

function StatutBadge({ statut }: { statut: StatutCommande }) {
  const cfg = STATUT_CONFIG[statut];
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600,
      color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      padding: '3px 9px', borderRadius: '20px',
      whiteSpace: 'nowrap', display: 'inline-flex',
      alignItems: 'center', gap: '4px',
    }}>
      <span style={{ fontSize: '10px' }}>{cfg.icon}</span>
      {statut}
    </span>
  );
}

// --- Ligne de commande ---
function CommandeRow({
  commande,
  isTransporteur,
  onClick,
}: {
  commande: Commande;
  isTransporteur: boolean;
  onClick: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      style={{ cursor: 'pointer', transition: 'background 0.1s' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <td style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>
          {commande.id}
        </span>
      </td>
      <td style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>
          {commande.origine} → {commande.destination}
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
          {commande.type}
        </div>
      </td>
      <td style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: '12px', color: '#374151' }}>
          {isTransporteur ? commande.client : commande.transporteur}
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
          {isTransporteur ? commande.clientTel : commande.transporteurTel}
        </div>
      </td>
      <td style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: '12px', color: '#374151' }}>{commande.date}</div>
        {commande.datelivraison && (
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            Livraison : {commande.datelivraison}
          </div>
        )}
      </td>
      <td style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
          {commande.prix.toLocaleString()} FCFA
        </div>
      </td>
      <td style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <StatutBadge statut={commande.statut} />
      </td>
      <td style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </td>
    </tr>
  );
}

// --- Panneau de détail ---
function DetailPanel({
  commande,
  isTransporteur,
  onClose,
  onAnnuler,
  onTelecharger,
  onContacter,
}: {
  commande: Commande;
  isTransporteur: boolean;
  onClose: () => void;
  onAnnuler: () => void;
  onTelecharger: () => void;
  onContacter: () => void;
}) {
  const cfg = STATUT_CONFIG[commande.statut];
  const peutAnnuler = ['En attente', 'Confirmée'].includes(commande.statut);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
    }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '480px',
          height: '100vh',
          background: '#fff',
          overflowY: 'auto',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          animation: 'slideIn 0.25s ease',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky', top: 0,
          background: '#fff', zIndex: 10,
        }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
              {commande.id}
            </h2>
            <div style={{ marginTop: '6px' }}>
              <StatutBadge statut={commande.statut} />
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9', border: 'none',
              borderRadius: '8px', padding: '8px',
              cursor: 'pointer', color: '#64748b',
              display: 'flex', alignItems: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Contenu */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Trajet */}
          <div style={{
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: '12px',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Départ</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{commande.origine}</div>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ flex: 1, height: '2px', background: cfg.border, borderRadius: '1px' }}/>
                <span style={{ fontSize: '16px' }}>{cfg.icon}</span>
                <div style={{ flex: 1, height: '2px', background: cfg.border, borderRadius: '1px' }}/>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Arrivée</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{commande.destination}</div>
              </div>
            </div>
          </div>

          {/* Infos commande */}
          <Section titre="Détails de la commande">
            <InfoRow label="Type de marchandise" value={commande.type} />
            <InfoRow label="Poids" value={`${commande.poids} kg`} />
            <InfoRow label="Volume" value={`${commande.volume} m³`} />
            <InfoRow label="Prix total" value={`${commande.prix.toLocaleString()} FCFA`} highlight />
            {commande.description && (
              <InfoRow label="Description" value={commande.description} />
            )}
          </Section>

          {/* Dates */}
          <Section titre="Dates">
            <InfoRow label="Date de commande"  value={commande.date} />
            <InfoRow
              label="Livraison prévue"
              value={commande.datelivraison ?? 'Non définie'}
            />
          </Section>

          {/* Interlocuteur */}
          <Section titre={isTransporteur ? 'Informations client' : 'Informations transporteur'}>
            <InfoRow
              label="Nom"
              value={isTransporteur ? commande.client : commande.transporteur}
            />
            <InfoRow
              label="Téléphone"
              value={isTransporteur ? commande.clientTel : commande.transporteurTel}
            />
          </Section>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: 0 }}>
              Actions
            </h3>

            {/* Contacter */}
            <button
              onClick={onContacter}
              style={{
                width: '100%', padding: '11px',
                background: '#fff', color: '#2563eb',
                border: '1.5px solid #2563eb',
                borderRadius: '9px', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 0 0 .07 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Contacter {isTransporteur ? 'le client' : 'le transporteur'}
            </button>

            {/* Télécharger bon */}
            <button
              onClick={onTelecharger}
              style={{
                width: '100%', padding: '11px',
                background: '#fff', color: '#374151',
                border: '1.5px solid #e2e8f0',
                borderRadius: '9px', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Télécharger le bon de commande
            </button>

            {/* Annuler */}
            {peutAnnuler && (
              <button
                onClick={onAnnuler}
                style={{
                  width: '100%', padding: '11px',
                  background: '#fff', color: '#dc2626',
                  border: '1.5px solid #fecaca',
                  borderRadius: '9px', fontSize: '13px',
                  fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                Annuler la commande
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers détail
function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
        {titre}
      </h3>
      <div style={{
        background: '#f8fafc', border: '1px solid #f1f5f9',
        borderRadius: '10px', overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '10px 14px',
      borderBottom: '1px solid #f1f5f9',
    }}>
      <span style={{ fontSize: '12px', color: '#64748b' }}>{label}</span>
      <span style={{
        fontSize: '13px',
        fontWeight: highlight ? 700 : 500,
        color: highlight ? '#2563eb' : '#111827',
      }}>
        {value}
      </span>
    </div>
  );
}

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function CommandePage() {
  const navigate = useNavigate();
  const isTransporteur = useHasRole('transporteur');

  const [ongletActif, setOngletActif] = useState<StatutCommande | 'Toutes'>('Toutes');
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null);
  const [commandes, setCommandes] = useState<Commande[]>(MOCK_COMMANDES);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filtre par onglet + recherche
  const commandesFiltrees = commandes.filter((c) => {
    const matchOnglet = ongletActif === 'Toutes' || c.statut === ongletActif;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || [c.id, c.destination, c.origine, c.transporteur, c.client]
      .some((v) => v.toLowerCase().includes(q));
    return matchOnglet && matchSearch;
  });

  // Compteur par statut
  const countByStatut = (statut: StatutCommande | 'Toutes') =>
    statut === 'Toutes'
      ? commandes.length
      : commandes.filter((c) => c.statut === statut).length;

  // Actions
  const handleAnnuler = (id: string) => {
    setCommandes((prev) =>
      prev.map((c) => c.id === id ? { ...c, statut: 'Annulée' as StatutCommande } : c)
    );
    setSelectedCommande(null);
    showToast('Commande annulée avec succès.');
  };

  const handleTelecharger = (id: string) => {
    showToast(`Bon de commande ${id} téléchargé.`);
  };

  const handleContacter = (commande: Commande) => {
    const tel = isTransporteur ? commande.clientTel : commande.transporteurTel;
    const nom = isTransporteur ? commande.client : commande.transporteur;
    showToast(`Appel vers ${nom} — ${tel}`);
  };

  // Résumé stats
  const stats = [
    { label: 'Total', value: commandes.length, color: '#374151', bg: '#f1f5f9' },
    { label: 'En cours', value: commandes.filter((c) => c.statut === 'En cours').length, color: '#2563eb', bg: '#eff6ff' },
    { label: 'En attente', value: commandes.filter((c) => c.statut === 'En attente').length, color: '#d97706', bg: '#fffbeb' },
    { label: 'Livrées', value: commandes.filter((c) => c.statut === 'Livré').length, color: '#16a34a', bg: '#f0fdf4' },
  ];

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
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', display: 'flex', alignItems: 'center',
              gap: '6px', fontSize: '13px', fontWeight: 500, padding: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Accueil
          </button>
          <span style={{ color: '#e2e8f0' }}>|</span>
          <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
            {isTransporteur ? 'Commandes reçues' : 'Mes commandes'}
          </h1>
        </div>

        {!isTransporteur && (
          <button
            onClick={() => navigate('/commandes/nouvelle')}
            style={{
              padding: '9px 18px',
              background: '#2563eb', color: '#fff',
              border: 'none', borderRadius: '9px',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '7px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouvelle commande
          </button>
        )}
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px' }}>

        {/* ====== STATS ====== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px', marginBottom: '24px',
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              background: '#fff', border: '1px solid #f1f5f9',
              borderRadius: '10px', padding: '14px 18px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ====== BARRE RECHERCHE + ONGLETS ====== */}
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>

          {/* Recherche */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
              <svg
                width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="#94a3b8" strokeWidth="2"
                style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher par ID, destination, transporteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px 8px 34px',
                  border: '1.5px solid #e5e7eb', borderRadius: '8px',
                  fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                  color: '#111827', transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e)  => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              {commandesFiltrees.length} résultat{commandesFiltrees.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Onglets */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #f1f5f9',
            padding: '0 16px', gap: '4px', overflowX: 'auto',
          }}>
            {ONGLETS.map((o) => {
              const count = countByStatut(o.statut);
              const actif = ongletActif === o.statut;
              return (
                <button
                  key={o.statut}
                  onClick={() => setOngletActif(o.statut)}
                  style={{
                    padding: '11px 14px',
                    background: 'none', border: 'none',
                    borderBottom: `2px solid ${actif ? '#2563eb' : 'transparent'}`,
                    color: actif ? '#2563eb' : '#64748b',
                    fontSize: '13px', fontWeight: actif ? 600 : 500,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'color 0.15s',
                    marginBottom: '-1px',
                  }}
                >
                  {o.label}
                  <span style={{
                    fontSize: '11px', fontWeight: 600,
                    padding: '1px 6px', borderRadius: '10px',
                    background: actif ? '#eff6ff' : '#f1f5f9',
                    color: actif ? '#2563eb' : '#94a3b8',
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tableau */}
          {commandesFiltrees.length === 0 ? (
            <div style={{
              padding: '60px 24px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Aucune commande trouvée
              </p>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                {searchQuery ? 'Essayez un autre terme de recherche.' : 'Aucune commande dans cette catégorie.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['N° Commande', 'Trajet / Type', isTransporteur ? 'Client' : 'Transporteur', 'Dates', 'Prix', 'Statut', ''].map((h) => (
                      <th key={h} style={{
                        padding: '10px 16px', textAlign: 'left',
                        fontSize: '11px', fontWeight: 600,
                        color: '#94a3b8', textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        borderBottom: '1px solid #f1f5f9',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {commandesFiltrees.map((cmd) => (
                    <CommandeRow
                      key={cmd.id}
                      commande={cmd}
                      isTransporteur={isTransporteur}
                      onClick={() => setSelectedCommande(cmd)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ====== PANNEAU DÉTAIL ====== */}
      {selectedCommande && (
        <DetailPanel
          commande={selectedCommande}
          isTransporteur={isTransporteur}
          onClose={() => setSelectedCommande(null)}
          onAnnuler={() => handleAnnuler(selectedCommande.id)}
          onTelecharger={() => handleTelecharger(selectedCommande.id)}
          onContacter={() => handleContacter(selectedCommande)}
        />
      )}

      {/* ====== TOAST ====== */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%',
          transform: 'translateX(-50%)',
          background: toast.type === 'success' ? '#111827' : '#dc2626',
          color: '#fff', padding: '12px 20px',
          borderRadius: '10px', fontSize: '13px', fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          animation: 'fadeUp 0.3s ease',
          zIndex: 300, whiteSpace: 'nowrap',
        }}>
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
    </div>
  );
}