// hooks/useRecherche.ts
import { useState, useCallback } from 'react';
import type { Transporteur, RechercheFilters } from '../types/transporteur.types';

const MOCK_TRANSPORTEURS: Transporteur[] = [
  {
    id: 'tr-001',
    nom: 'Ndiaye Express',
    photo: 'NE',
    note: 4.8,
    nbAvis: 124,
    prix: 850,
    delai: '1 jour',
    zones: ['Thiès', 'Mbour', 'Saly'],
    disponible: true,
    vehicule: 'Camion 5T',
    telephone: '+221 77 111 22 33',
    lat: 14.7667,
    lng: -17.3667,
  },
  // ... autres transporteurs
];

export function useRecherche() {
  const [results, setResults] = useState<Transporteur[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (filters: RechercheFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulation API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const filtered = MOCK_TRANSPORTEURS.filter(t =>
        filters.destination
          ? t.zones.some(z => z.toLowerCase().includes(filters.destination.toLowerCase()))
          : true
      );
      
      setResults(filtered);
    } catch (err) {
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}