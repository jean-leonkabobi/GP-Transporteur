// components/suivi/SuiviMap.tsx
interface Position {
  lat: number;
  lng: number;
  address: string;
}

interface SuiviMapProps {
  start: Position;
  end: Position;
  current: Position;
}

export function SuiviMap({ start, end, current }: SuiviMapProps) {
  return (
    <div style={{
      background: '#f0f9ff',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #e2e8f0',
    }}>
      <svg
        viewBox="0 0 600 200"
        width="100%"
        style={{ display: 'block', borderRadius: '8px' }}
      >
        <rect x="0" y="0" width="600" height="200" fill="#dbeafe" rx="8"/>
        
        {/* Route */}
        <path
          d="M 50 100 Q 300 60 550 100"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="40"
          strokeLinecap="round"
        />
        <path
          d="M 50 100 Q 300 60 550 100"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeDasharray="10 8"
        />
        
        {/* Départ */}
        <circle cx="50" cy="100" r="10" fill="#16a34a" stroke="#fff" strokeWidth="3"/>
        <text x="50" y="135" textAnchor="middle" fontSize="10" fill="#166534" fontWeight="bold">
          Départ
        </text>
        <text x="50" y="148" textAnchor="middle" fontSize="8" fill="#15803d">
          {start.address.split(',')[0]}
        </text>
        
        {/* Position actuelle */}
        <circle cx="300" cy="76" r="12" fill="#2563eb" stroke="#fff" strokeWidth="3"/>
        <circle cx="300" cy="76" r="5" fill="#fff"/>
        <text x="300" y="50" textAnchor="middle" fontSize="9" fill="#1d4ed8" fontWeight="bold">
          Position actuelle
        </text>
        <text x="300" y="62" textAnchor="middle" fontSize="8" fill="#2563eb">
          {current.address.split(',')[0]}
        </text>
        
        {/* Arrivée */}
        <circle cx="550" cy="100" r="10" fill="#d97706" stroke="#fff" strokeWidth="3"/>
        <text x="550" y="135" textAnchor="middle" fontSize="10" fill="#92400e" fontWeight="bold">
          Arrivée
        </text>
        <text x="550" y="148" textAnchor="middle" fontSize="8" fill="#b45309">
          {end.address.split(',')[0]}
        </text>
      </svg>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '12px',
        padding: '0 8px',
      }}>
        <div style={{ fontSize: '11px', color: '#64748b' }}>📍 {start.address}</div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>🎯 {end.address}</div>
      </div>
    </div>
  );
}