// components/commandes/CommandeDetail.tsx
import { StatusBadge } from '../suivi/StatusBadge';
import type { Commande, StatutCommande } from '../../types/commande.types';

interface CommandeDetailProps {
  commande: Commande;
  isTransporteur: boolean;
  onClose: () => void;
  onAnnuler: () => void;
  onTelecharger: () => void;
  onContacter: () => void;
}

const STATUT_CONFIG: Record<StatutCommande, { color: string; bg: string; icon: string }> = {
  'En attente': { color: '#d97706', bg: '#fffbeb', icon: '⏳' },
  'Confirmée': { color: '#7c3aed', bg: '#f5f3ff', icon: '✅' },
  'En cours': { color: '#2563eb', bg: '#eff6ff', icon: '🚚' },
  'Livré': { color: '#16a34a', bg: '#f0fdf4', icon: '📦' },
  'Annulée': { color: '#dc2626', bg: '#fef2f2', icon: '❌' },
};

export function CommandeDetail({
  commande,
  isTransporteur,
  onClose,
  onAnnuler,
  onTelecharger,
  onContacter,
}: CommandeDetailProps) {
  const cfg = STATUT_CONFIG[commande.statut];
  const peutAnnuler = ['En attente', 'Confirmée'].includes(commande.statut);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
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
          animation: 'slideInRight 0.25s ease',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 10,
        }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
              {commande.id}
            </h2>
            <div style={{ marginTop: '6px' }}>
              <StatusBadge statut={commande.statut} />
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Trajet */}
          <div style={{
            background: cfg.bg,
            border: `1px solid ${cfg.color}20`,
            borderRadius: '12px',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Départ</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{commande.origine}</div>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ flex: 1, height: '2px', background: cfg.color, borderRadius: '1px' }}/>
                <span style={{ fontSize: '16px' }}>{cfg.icon}</span>
                <div style={{ flex: 1, height: '2px', background: cfg.color, borderRadius: '1px' }}/>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Arrivée</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{commande.destination}</div>
              </div>
            </div>
          </div>

          {/* Détails */}
          <Section titre="Détails de la commande">
            <InfoRow label="Type de marchandise" value={commande.type} />
            <InfoRow label="Poids" value={`${commande.poids} kg`} />
            <InfoRow label="Volume" value={`${commande.volume} m³`} />
            <InfoRow label="Prix total" value={`${commande.prix.toLocaleString()} FCFA`} highlight />
            {commande.description && <InfoRow label="Description" value={commande.description} />}
          </Section>

          {/* Dates */}
          <Section titre="Dates">
            <InfoRow label="Date de commande" value={commande.date} />
            <InfoRow label="Livraison prévue" value={commande.datelivraison ?? 'Non définie'} />
          </Section>

          {/* Interlocuteur */}
          <Section titre={isTransporteur ? 'Informations client' : 'Informations transporteur'}>
            <InfoRow label="Nom" value={isTransporteur ? commande.client : commande.transporteur} />
            <InfoRow label="Téléphone" value={isTransporteur ? commande.clientTel : commande.transporteurTel} />
          </Section>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: 0 }}>
              Actions
            </h3>

            <button
              onClick={onContacter}
              style={{
                width: '100%',
                padding: '11px',
                background: '#fff',
                color: '#2563eb',
                border: '1.5px solid #2563eb',
                borderRadius: '9px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#eff6ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 0 0 .07 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Contacter {isTransporteur ? 'le client' : 'le transporteur'}
            </button>

            <button
              onClick={onTelecharger}
              style={{
                width: '100%',
                padding: '11px',
                background: '#fff',
                color: '#374151',
                border: '1.5px solid #e2e8f0',
                borderRadius: '9px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
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

            {peutAnnuler && (
              <button
                onClick={onAnnuler}
                style={{
                  width: '100%',
                  padding: '11px',
                  background: '#fff',
                  color: '#dc2626',
                  border: '1.5px solid #fecaca',
                  borderRadius: '9px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
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

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
        {titre}
      </h3>
      <div style={{
        background: '#f8fafc',
        border: '1px solid #f1f5f9',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 14px',
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