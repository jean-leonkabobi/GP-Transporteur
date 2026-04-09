// components/commandes/CommandeList.tsx
import { useState } from 'react';
import { CommandeCard } from './CommandeCard';
import type { Commande, StatutCommande } from '../../types/commande.types';

interface CommandeListProps {
  commandes: Commande[];
  isTransporteur: boolean;
  onSelectCommande: (commande: Commande) => void;
}

const ONGLETS: { label: string; statut: StatutCommande | 'Toutes' }[] = [
  { label: 'Toutes', statut: 'Toutes' },
  { label: 'En attente', statut: 'En attente' },
  { label: 'Confirmée', statut: 'Confirmée' },
  { label: 'En cours', statut: 'En cours' },
  { label: 'Livré', statut: 'Livré' },
  { label: 'Annulée', statut: 'Annulée' },
];

export function CommandeList({ commandes, isTransporteur, onSelectCommande }: CommandeListProps) {
  const [ongletActif, setOngletActif] = useState<StatutCommande | 'Toutes'>('Toutes');
  const [searchQuery, setSearchQuery] = useState('');

  const commandesFiltrees = commandes.filter((c) => {
    const matchOnglet = ongletActif === 'Toutes' || c.statut === ongletActif;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || 
      [c.id, c.destination, c.origine, c.transporteur, c.client].some(v => v.toLowerCase().includes(q));
    return matchOnglet && matchSearch;
  });

  const countByStatut = (statut: StatutCommande | 'Toutes') =>
    statut === 'Toutes' ? commandes.length : commandes.filter(c => c.statut === statut).length;

  return (
    <div>
      {/* Barre de recherche */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '20px',
      }}>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <svg
              width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="#94a3b8" strokeWidth="2"
              style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher par ID, destination, transporteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            {commandesFiltrees.length} résultat{commandesFiltrees.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Onglets */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #f1f5f9',
          padding: '0 16px',
          gap: '4px',
          overflowX: 'auto',
        }}>
          {ONGLETS.map((o) => {
            const count = countByStatut(o.statut);
            const actif = ongletActif === o.statut;
            return (
              <button
                key={o.statut}
                onClick={() => setOngletActif(o.statut)}
                style={{
                  padding: '11px 14px',
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${actif ? '#2563eb' : 'transparent'}`,
                  color: actif ? '#2563eb' : '#64748b',
                  fontSize: '13px',
                  fontWeight: actif ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '-1px',
                }}
              >
                {o.label}
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: actif ? '#eff6ff' : '#f1f5f9',
                  color: actif ? '#2563eb' : '#94a3b8',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Liste des commandes */}
      {commandesFiltrees.length === 0 ? (
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '60px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            Aucune commande trouvée
          </p>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            {searchQuery ? 'Essayez un autre terme de recherche.' : 'Aucune commande dans cette catégorie.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {commandesFiltrees.map((commande) => (
            <CommandeCard
              key={commande.id}
              commande={commande}
              isTransporteur={isTransporteur}
              onClick={() => onSelectCommande(commande)}
            />
          ))}
        </div>
      )}
    </div>
  );
}