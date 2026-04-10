import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useHasRole } from '../hooks/useAuth';

// ============================================================
// DONNÉES MOCK — remplacer par vrais appels API plus tard
// ============================================================
const MOCK_STATS_CLIENT = [
  { label: 'Commandes en cours',  value: '3',   icon: '📦', color: '#2563eb', bg: '#eff6ff' },
  { label: 'Livraisons ce mois',  value: '12',  icon: '🚚', color: '#16a34a', bg: '#f0fdf4' },
  { label: 'Rendez-vous à venir', value: '2',   icon: '📅', color: '#d97706', bg: '#fffbeb' },
  { label: 'Transporteurs vus',   value: '28',  icon: '🔍', color: '#7c3aed', bg: '#f5f3ff' },
];

const MOCK_STATS_TRANSPORTEUR = [
  { label: 'Commandes reçues',    value: '7',   icon: '📥', color: '#2563eb', bg: '#eff6ff' },
  { label: 'Livraisons ce mois',  value: '19',  icon: '✅', color: '#16a34a', bg: '#f0fdf4' },
  { label: 'Rendez-vous today',   value: '1',   icon: '📅', color: '#d97706', bg: '#fffbeb' },
  { label: 'Note moyenne',        value: '4.8', icon: '⭐', color: '#ea580c', bg: '#fff7ed' },
];

const MOCK_COMMANDES = [
  {
    id: 'CMD-001',
    destination: 'Thiès',
    statut: 'En cours',
    date: '08 avr. 2026',
    transporteur: 'Ndiaye Transport',
    statutColor: '#2563eb',
    statutBg: '#eff6ff',
  },
  {
    id: 'CMD-002',
    destination: 'Saint-Louis',
    statut: 'Livré',
    date: '05 avr. 2026',
    transporteur: 'Sénégal Express',
    statutColor: '#16a34a',
    statutBg: '#f0fdf4',
  },
  {
    id: 'CMD-003',
    destination: 'Ziguinchor',
    statut: 'En attente',
    date: '03 avr. 2026',
    transporteur: '—',
    statutColor: '#d97706',
    statutBg: '#fffbeb',
  },
];

const MOCK_COMMANDES_TRANSPORTEUR = [
  {
    id: 'CMD-010',
    destination: 'Kaolack',
    statut: 'À confirmer',
    date: '09 avr. 2026',
    client: 'Amadou Diallo',
    statutColor: '#7c3aed',
    statutBg: '#f5f3ff',
  },
  {
    id: 'CMD-011',
    destination: 'Mbour',
    statut: 'En cours',
    date: '07 avr. 2026',
    client: 'Mariama Sow',
    statutColor: '#2563eb',
    statutBg: '#eff6ff',
  },
  {
    id: 'CMD-012',
    destination: 'Touba',
    statut: 'Livré',
    date: '04 avr. 2026',
    client: 'Ibrahima Fall',
    statutColor: '#16a34a',
    statutBg: '#f0fdf4',
  },
];

// ============================================================
// RACCOURCIS
// ============================================================
const SHORTCUTS_CLIENT = [
  { label: 'Rechercher un transporteur', icon: '🔍', path: '/recherche',         color: '#2563eb', bg: '#eff6ff' },
  { label: 'Nouvelle commande',          icon: '➕', path: '/commandes/nouvelle', color: '#16a34a', bg: '#f0fdf4' },
  { label: 'Mes commandes',              icon: '📦', path: '/commandes',          color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Prendre rendez-vous',        icon: '📅', path: '/rendez-vous',        color: '#d97706', bg: '#fffbeb' },
  { label: 'Suivi livraison',            icon: '📍', path: '/suivi',              color: '#ea580c', bg: '#fff7ed' },
  { label: 'Mon compte',                 icon: '👤', path: '/mon-compte',         color: '#0891b2', bg: '#ecfeff' },
];

const SHORTCUTS_TRANSPORTEUR = [
  { label: 'Commandes reçues',     icon: '📥', path: '/commandes',          color: '#2563eb', bg: '#eff6ff' },
  { label: 'Mes rendez-vous',      icon: '📅', path: '/rendez-vous',        color: '#d97706', bg: '#fffbeb' },
  { label: 'Suivi des livraisons', icon: '📍', path: '/suivi',              color: '#ea580c', bg: '#fff7ed' },
  { label: 'Mon profil',           icon: '👤', path: '/mon-compte',         color: '#0891b2', bg: '#ecfeff' },
];

// ============================================================
// SOUS-COMPOSANTS
// ============================================================

// --- Carte statistique ---
function StatCard({ label, value, icon, color, bg }: {
  label: string; value: string; icon: string;
  color: string; bg: string;
}) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #f1f5f9',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.2s, transform 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <div style={{
        width: '46px', height: '46px', borderRadius: '12px',
        background: bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '22px', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '24px', fontWeight: 700, color, lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// --- Raccourci ---
function ShortcutCard({ label, icon, path, color, bg }: {
  label: string; icon: string; path: string;
  color: string; bg: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      style={{
        background: '#fff',
        border: '1px solid #f1f5f9',
        borderRadius: '12px',
        padding: '16px 12px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.08)`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#f1f5f9';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '22px',
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: '12px', fontWeight: 500,
        color: '#374151', textAlign: 'center', lineHeight: 1.4,
      }}>
        {label}
      </span>
    </button>
  );
}

// --- Badge statut ---
function StatutBadge({ statut, color, bg }: { statut: string; color: string; bg: string }) {
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600, color,
      background: bg, padding: '3px 9px',
      borderRadius: '20px', whiteSpace: 'nowrap',
    }}>
      {statut}
    </span>
  );
}

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function HomePage() {
  const { user } = useAuth();
  const isTransporteur = useHasRole('transporteur');
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const stats     = isTransporteur ? MOCK_STATS_TRANSPORTEUR : MOCK_STATS_CLIENT;
  const commandes = isTransporteur ? MOCK_COMMANDES_TRANSPORTEUR : MOCK_COMMANDES;
  const shortcuts = isTransporteur ? SHORTCUTS_TRANSPORTEUR : SHORTCUTS_CLIENT;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?destination=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // MODIFICATION: Plus de navbar ici, elle est dans AppLayout
  return (
    <div style={{ width: '100%' }}>
      {/* Salutation */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
          Bonjour, {user?.prenom} 👋
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          {isTransporteur
            ? 'Voici un aperçu de votre activité du jour.'
            : 'Que souhaitez-vous faire aujourd\'hui ?'}
        </p>
      </div>

      {/* Barre de recherche rapide (CLIENT uniquement) */}
      {!isTransporteur && (
        <form
          onSubmit={handleSearch}
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '20px 24px',
            marginBottom: '28px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
            🔍 Recherche rapide
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Entrez une destination (ex : Thiès, Saint-Louis...)"
              style={{
                flex: 1, padding: '10px 14px',
                border: '1.5px solid #e5e7eb', borderRadius: '9px',
                fontSize: '14px', color: '#ffffff', outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
              onBlur={(e)  => (e.target.style.borderColor = '#e5e7eb')}
            />
            <button
              type="submit"
              style={{
                padding: '10px 22px',
                background: '#2563eb', color: '#fff',
                border: 'none', borderRadius: '9px',
                fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
            >
              Rechercher
            </button>
          </div>
        </form>
      )}

      {/* Statistiques */}
      <section style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '14px' }}>
          Vue d'ensemble
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
        }}>
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* Grille principale : Raccourcis + Commandes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.6fr',
        gap: '20px',
        alignItems: 'start',
      }}>

        {/* Raccourcis */}
        <section>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '14px' }}>
            Accès rapide
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
          }}>
            {shortcuts.map((s) => (
              <ShortcutCard key={s.path} {...s} />
            ))}
          </div>
        </section>

        {/* Dernières commandes */}
        <section>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '14px',
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
              {isTransporteur ? 'Dernières commandes reçues' : 'Mes dernières commandes'}
            </h2>
            <button
              onClick={() => navigate('/commandes')}
              style={{
                background: 'none', border: 'none',
                fontSize: '12px', color: '#2563eb',
                cursor: 'pointer', fontWeight: 500,
                padding: 0,
              }}
            >
              Voir tout →
            </button>
          </div>

          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            {/* En-tête tableau */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isTransporteur ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr 1fr',
              padding: '10px 16px',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
            }}>
              {['N° Commande', 'Destination', isTransporteur ? 'Client' : 'Transporteur', 'Statut'].map((h) => (
                <span key={h} style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Lignes */}
            {commandes.map((cmd, i) => (
              <div
                key={cmd.id}
                onClick={() => navigate(`/commandes`)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  padding: '13px 16px',
                  borderBottom: i < commandes.length - 1 ? '1px solid #f1f5f9' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>
                  {cmd.id}
                </span>
                <span style={{ fontSize: '13px', color: '#374151' }}>
                  {cmd.destination}
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {'client' in cmd ? cmd.client : cmd.transporteur}
                </span>
                <StatutBadge
                  statut={cmd.statut}
                  color={cmd.statutColor}
                  bg={cmd.statutBg}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bannière spécifique transporteur */}
      {isTransporteur && (
        <div style={{
          marginTop: '24px',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
          borderRadius: '14px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#fff',
        }}>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
              Nouveau rendez-vous en attente
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
              Vous avez 1 demande de rendez-vous qui nécessite votre confirmation.
            </p>
          </div>
          <button
            onClick={() => navigate('/rendez-vous')}
            style={{
              background: '#fff', color: '#1d4ed8',
              border: 'none', borderRadius: '9px',
              padding: '10px 20px', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Voir les demandes
          </button>
        </div>
      )}

      {/* Bannière spécifique client */}
      {!isTransporteur && (
        <div style={{
          marginTop: '24px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '1px solid #bbf7d0',
          borderRadius: '14px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#15803d', marginBottom: '3px' }}>
              Commande CMD-001 en cours de livraison
            </p>
            <p style={{ fontSize: '13px', color: '#16a34a' }}>
              Votre colis est en route vers Thiès — livraison prévue aujourd'hui.
            </p>
          </div>
          <button
            onClick={() => navigate('/suivi')}
            style={{
              background: '#16a34a', color: '#fff',
              border: 'none', borderRadius: '9px',
              padding: '9px 18px', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#15803d')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#16a34a')}
          >
            Suivre →
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1.6fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}