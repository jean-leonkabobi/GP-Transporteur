// hooks/useSuivi.ts
import { useState, useEffect } from 'react';

interface SuiviData {
  commandeId: string;
  statut: string;
  positionActuelle: { lat: number; lng: number; address: string };
  etapes: Array<{ titre: string; description: string; date: string; statut: string }>;
  miseAJour: string;
}

export function useSuivi(commandeId: string) {
  const [data, setData] = useState<SuiviData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuivi = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setData({
        commandeId,
        statut: 'En cours',
        positionActuelle: {
          lat: 14.7667,
          lng: -17.3667,
          address: 'Route nationale 1, près de Pout',
        },
        etapes: [
          { titre: 'Collecte', description: 'Colis récupéré', date: '08/04/2026 09:30', statut: 'completed' },
          { titre: 'En transit', description: 'En route', date: '08/04/2026 10:15', statut: 'current' },
        ],
        miseAJour: new Date().toLocaleString(),
      });
      setLoading(false);
    };
    
    fetchSuivi();
    const interval = setInterval(fetchSuivi, 30000);
    return () => clearInterval(interval);
  }, [commandeId]);

  return { data, loading };
}