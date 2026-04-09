// components/suivi/SuiviTimeline.tsx

interface Etape {
  id: number;
  titre: string;
  description: string;
  date: string;
  statut: 'completed' | 'current' | 'pending';
}

interface SuiviTimelineProps {
  etapes: Etape[];
}

function TimelineStep({ etape, isLast }: { etape: Etape; isLast: boolean }) {
  const getIcon = () => {
    if (etape.statut === 'completed') return '✅';
    if (etape.statut === 'current') return '🚚';
    return '⏳';
  };
  
  const getColor = () => {
    if (etape.statut === 'completed') return '#16a34a';
    if (etape.statut === 'current') return '#2563eb';
    return '#94a3b8';
  };
  
  return (
    <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
      {!isLast && (
        <div style={{
          position: 'absolute',
          left: '15px',
          top: '32px',
          width: '2px',
          height: 'calc(100% - 20px)',
          background: etape.statut === 'completed' ? '#16a34a' : '#e2e8f0',
        }} />
      )}
      
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: getColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        color: '#fff',
        zIndex: 1,
        flexShrink: 0,
      }}>
        {getIcon()}
      </div>
      
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '4px',
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: etape.statut === 'current' ? 700 : 600,
            color: etape.statut === 'current' ? '#2563eb' : '#111827',
          }}>
            {etape.titre}
          </span>
          {etape.date && (
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{etape.date}</span>
          )}
        </div>
        <p style={{
          fontSize: '13px',
          color: '#64748b',
          margin: 0,
          lineHeight: 1.5,
        }}>
          {etape.description}
        </p>
      </div>
    </div>
  );
}

export function SuiviTimeline({ etapes }: SuiviTimelineProps) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '24px',
    }}>
      <h3 style={{
        fontSize: '14px',
        fontWeight: 700,
        color: '#111827',
        marginBottom: '20px',
      }}>
        Suivi de la livraison
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {etapes.map((etape, index) => (
          <TimelineStep
            key={etape.id}
            etape={etape}
            isLast={index === etapes.length - 1}
          />
        ))}
      </div>
    </div>
  );
}