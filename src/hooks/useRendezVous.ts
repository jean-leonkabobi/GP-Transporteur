// hooks/useRendezVous.ts
import { useState, useCallback } from 'react';
import type { RendezVous, CreateRendezVousPayload, StatutRDV } from '../types/rendezvous.types';

const MOCK_RDV: RendezVous[] = [
  // ... rendez-vous mockés
];

export function useRendezVous() {
  const [rdvList, setRdvList] = useState<RendezVous[]>(MOCK_RDV);
  const [loading, setLoading] = useState(false);

  const createRendezVous = useCallback(async (payload: CreateRendezVousPayload) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newRdv: RendezVous = {
      id: `RDV-${String(rdvList.length + 1).padStart(3, '0')}`,
      ...payload,
      notes: payload.notes || '',
      statut: 'En attente',
      client: 'Client Name',
      clientTel: '+221 77 000 00 01',
      transporteur: '—',
      transporteurTel: '—',
      destination: 'Destination',
      type: 'Type',
    };
    
    setRdvList(prev => [newRdv, ...prev]);
    setLoading(false);
    return newRdv;
  }, [rdvList.length]);

  const updateStatut = useCallback(async (id: string, statut: StatutRDV) => {
    setRdvList(prev => prev.map(r => r.id === id ? { ...r, statut } : r));
  }, []);

  return { rdvList, loading, createRendezVous, updateStatut };
}