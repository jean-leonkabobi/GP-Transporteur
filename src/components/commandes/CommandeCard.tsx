// components/commandes/CommandeCard.tsx
import { StatusBadge } from '../suivi/StatusBadge';
import type { Commande } from '../../types/commande.types';

interface CommandeCardProps {
  commande: Commande;
  isTransporteur: boolean;
  onClick: () => void;
}

export function CommandeCard({ commande, isTransporteur, onClick }: CommandeCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#93c5fd';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>
            {commande.id}
          </span>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            {commande.origine} → {commande.destination}
          </div>
        </div>
        <StatusBadge statut={commande.statut} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Type</div>
          <div style={{ fontSize: '12px', color: '#374151' }}>{commande.type}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Poids</div>
          <div style={{ fontSize: '12px', color: '#374151' }}>{commande.poids} kg</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Prix</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>
            {commande.prix.toLocaleString()} FCFA
          </div>
        </div>
      </div>

      <div style={{
        fontSize: '11px',
        color: '#94a3b8',
        borderTop: '1px solid #f1f5f9',
        paddingTop: '8px',
        marginTop: '4px',
      }}>
        {isTransporteur ? `Client: ${commande.client}` : `Transporteur: ${commande.transporteur}`}
      </div>
    </div>
  );
}