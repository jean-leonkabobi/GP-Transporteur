// components/suivi/StatusBadge.tsx
import type { StatutCommande } from '../../types/commande.types';

interface StatusBadgeProps {
  statut: StatutCommande;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<StatutCommande, { color: string; bg: string; icon: string }> = {
  'En attente': { color: '#d97706', bg: '#fffbeb', icon: '⏳' },
  'Confirmée': { color: '#7c3aed', bg: '#f5f3ff', icon: '✅' },
  'En cours': { color: '#2563eb', bg: '#eff6ff', icon: '🚚' },
  'Livré': { color: '#16a34a', bg: '#f0fdf4', icon: '📦' },
  'Annulée': { color: '#dc2626', bg: '#fef2f2', icon: '❌' },
};

export function StatusBadge({ statut, size = 'md' }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[statut];
  const fontSize = size === 'sm' ? '10px' : '11px';
  const padding = size === 'sm' ? '2px 7px' : '3px 9px';

  return (
    <span style={{
      fontSize,
      fontWeight: 600,
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.color}20`,
      padding,
      borderRadius: '20px',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
    }}>
      <span style={{ fontSize: size === 'sm' ? '9px' : '10px' }}>{cfg.icon}</span>
      {statut}
    </span>
  );
}