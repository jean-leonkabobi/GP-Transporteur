// components/rendezvous/RendezVousList.tsx
import { useState } from 'react';
import type { RendezVous, StatutRDV } from '../../types/rendezvous.types';

interface RendezVousListProps {
  rendezVous: RendezVous[];
  isTransporteur: boolean;
  onConfirmer?: (id: string) => void;
  onRefuser?: (id: string) => void;
  onAnnuler?: (id: string) => void;
}

const STATUT_CFG: Record<StatutRDV, { color: string; bg: string; border: string; icon: string }> = {
  'En attente': { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '⏳' },
  'Confirmé': { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '✅' },
  'Refusé': { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: '❌' },
  'Annulé': { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', icon: '🚫' },
  'Terminé': { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: '🏁' },
};

function StatutBadge({ statut }: { statut: StatutRDV }) {
  const cfg = STATUT_CFG[statut];
  return (
    <span style={{
      fontSize: '11px',
      fontWeight: 600,
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      padding: '3px 9px',
      borderRadius: '20px',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
    }}>
      <span>{cfg.icon}</span>
      {statut}
    </span>
  );
}

function RDVCard({
  rdv,
  isTransporteur,
  onConfirmer,
  onRefuser,
  onAnnuler,
}: {
  rdv: RendezVous;
  isTransporteur: boolean;
  onConfirmer?: (id: string) => void;
  onRefuser?: (id: string) => void;
  onAnnuler?: (id: string) => void;
}) {
  const cfg = STATUT_CFG[rdv.statut];
  const dateObj = new Date(rdv.date + 'T' + rdv.heure);
  const dateFormatee = dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${cfg.border}`,
      borderLeft: `4px solid ${cfg.color}`,
      borderRadius: '10px',
      padding: '16px 18px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>{rdv.id}</span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>→</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{rdv.commandeId}</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
            {rdv.destination} — {rdv.type}
          </div>
        </div>
        <StatutBadge statut={rdv.statut} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <InfoItem icon="📅" label="Date" value={dateFormatee} />
        <InfoItem icon="⏰" label="Heure" value={rdv.heure} />
        <InfoItem icon="📍" label="Lieu" value={rdv.lieu} />
        <InfoItem
          icon="👤"
          label={isTransporteur ? 'Client' : 'Transporteur'}
          value={isTransporteur ? `${rdv.client} · ${rdv.clientTel}` : `${rdv.transporteur} · ${rdv.transporteurTel}`}
        />
      </div>

      {rdv.notes && (
        <div style={{
          background: '#f8fafc',
          borderRadius: '8px',
          padding: '9px 12px',
          marginBottom: '12px',
          fontSize: '12px',
          color: '#475569',
        }}>
          📝 {rdv.notes}
        </div>
      )}

      {isTransporteur && rdv.statut === 'En attente' && onConfirmer && onRefuser && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onConfirmer(rdv.id)}
            style={{
              flex: 1,
              padding: '8px',
              background: '#f0fdf4',
              color: '#16a34a',
              border: '1.5px solid #bbf7d0',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ✅ Confirmer
          </button>
          <button
            onClick={() => onRefuser(rdv.id)}
            style={{
              flex: 1,
              padding: '8px',
              background: '#fef2f2',
              color: '#dc2626',
              border: '1.5px solid #fecaca',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ❌ Refuser
          </button>
        </div>
      )}

      {!isTransporteur && ['En attente', 'Confirmé'].includes(rdv.statut) && onAnnuler && (
        <button
          onClick={() => onAnnuler(rdv.id)}
          style={{
            width: '100%',
            padding: '8px',
            background: '#fff',
            color: '#64748b',
            border: '1.5px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Annuler le rendez-vous
        </button>
      )}
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
      <span style={{ fontSize: '13px' }}>{icon}</span>
      <div>
        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#374151', fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
}

export function RendezVousList({
  rendezVous,
  isTransporteur,
  onConfirmer,
  onRefuser,
  onAnnuler,
}: RendezVousListProps) {
  const [filtreStatut, setFiltreStatut] = useState<StatutRDV | 'Tous'>('Tous');

  const rdvFiltres = rendezVous.filter(r => filtreStatut === 'Tous' || r.statut === filtreStatut);

  return (
    <div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {(['Tous', 'En attente', 'Confirmé', 'Refusé', 'Annulé', 'Terminé'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFiltreStatut(s)}
            style={{
              padding: '5px 12px',
              background: filtreStatut === s ? '#2563eb' : '#fff',
              color: filtreStatut === s ? '#fff' : '#374151',
              border: `1px solid ${filtreStatut === s ? '#2563eb' : '#e2e8f0'}`,
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {rdvFiltres.length === 0 ? (
        <div style={{
          background: '#fff',
          border: '1px dashed #e2e8f0',
          borderRadius: '12px',
          padding: '48px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            Aucun rendez-vous trouvé
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rdvFiltres
            .sort((a, b) => a.date.localeCompare(b.date) || a.heure.localeCompare(b.heure))
            .map(rdv => (
              <RDVCard
                key={rdv.id}
                rdv={rdv}
                isTransporteur={isTransporteur}
                onConfirmer={onConfirmer}
                onRefuser={onRefuser}
                onAnnuler={onAnnuler}
              />
            ))}
        </div>
      )}
    </div>
  );
}