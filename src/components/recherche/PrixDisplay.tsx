// components/recherche/PrixDisplay.tsx
interface PrixDisplayProps {
  prixParKg: number;
  poids: number;
  className?: string;
}

export function PrixDisplay({ prixParKg, poids, className }: PrixDisplayProps) {
  const total = prixParKg * poids;
  
  return (
    <div className={className} style={{ textAlign: 'right' }}>
      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Prix estimé</div>
      <div style={{ fontSize: '16px', fontWeight: 700, color: '#2563eb' }}>
        {total.toLocaleString()} FCFA
      </div>
      <div style={{ fontSize: '10px', color: '#94a3b8' }}>
        ({prixParKg.toLocaleString()} FCFA/kg × {poids} kg)
      </div>
    </div>
  );
}