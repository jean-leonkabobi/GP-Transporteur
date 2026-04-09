// components/recherche/TransporteurCard.tsx
import type { Transporteur } from '../../types/transporteur.types';

interface TransporteurCardProps {
  transporteur: Transporteur;
  selected: boolean;
  onSelect: () => void;
  onCommander: () => void;
}

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

export function TransporteurCard({ transporteur, selected, onSelect, onCommander }: TransporteurCardProps) {
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '11px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: 700,
          color: '#2563eb',
          flexShrink: 0,
        }}>
          {transporteur.photo}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>
              {transporteur.nom}
            </h3>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '20px',
              color: transporteur.disponible ? '#16a34a' : '#dc2626',
              background: transporteur.disponible ? '#f0fdf4' : '#fef2f2',
            }}>
              {transporteur.disponible ? '● Disponible' : '● Indisponible'}
            </span>
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
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginBottom: '12px',
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

      {/* Zones */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginBottom: '5px' }}>
          Zones couvertes
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {transporteur.zones.map((zone) => (
            <span key={zone} style={{
              fontSize: '11px',
              padding: '2px 8px',
              background: '#f1f5f9',
              color: '#475569',
              borderRadius: '20px',
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
          width: '100%',
          padding: '9px',
          background: transporteur.disponible ? '#2563eb' : '#e2e8f0',
          color: transporteur.disponible ? '#fff' : '#94a3b8',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: transporteur.disponible ? 'pointer' : 'not-allowed',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => {
          if (transporteur.disponible) e.currentTarget.style.background = '#1d4ed8';
        }}
        onMouseLeave={(e) => {
          if (transporteur.disponible) e.currentTarget.style.background = '#2563eb';
        }}
      >
        {transporteur.disponible ? 'Commander' : 'Indisponible'}
      </button>
    </div>
  );
}