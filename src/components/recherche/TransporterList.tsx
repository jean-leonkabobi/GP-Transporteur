// components/recherche/TransporterList.tsx
import { TransporteurCard } from './TransporteurCard';
import type { Transporteur } from '../../types/transporteur.types';

interface TransporterListProps {
  transporteurs: Transporteur[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCommander: (id: string) => void;
  sortBy?: 'prix' | 'note' | 'delai';
  onSortChange?: (sort: 'prix' | 'note' | 'delai') => void;
}

export function TransporterList({
  transporteurs,
  selectedId,
  onSelect,
  onCommander,
  sortBy = 'note',
  onSortChange,
}: TransporterListProps) {
  const resultsTries = [...transporteurs].sort((a, b) => {
    if (sortBy === 'prix') return a.prix - b.prix;
    if (sortBy === 'note') return b.note - a.note;
    return a.delai.localeCompare(b.delai);
  });

  return (
    <div>
      {/* Tri */}
      {onSortChange && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Trier par :
          </p>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['note', 'prix', 'delai'] as const).map((tri) => (
              <button
                key={tri}
                onClick={() => onSortChange(tri)}
                style={{
                  padding: '5px 12px',
                  background: sortBy === tri ? '#2563eb' : '#fff',
                  color: sortBy === tri ? '#fff' : '#374151',
                  border: `1px solid ${sortBy === tri ? '#2563eb' : '#e2e8f0'}`,
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {tri === 'note' ? '⭐ Note' : tri === 'prix' ? '💰 Prix' : '⏱️ Délai'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Liste */}
      {resultsTries.length === 0 ? (
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '48px 24px',
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
          {resultsTries.map((transporteur) => (
            <TransporteurCard
              key={transporteur.id}
              transporteur={transporteur}
              selected={selectedId === transporteur.id}
              onSelect={() => onSelect(transporteur.id)}
              onCommander={() => onCommander(transporteur.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}