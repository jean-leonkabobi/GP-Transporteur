// types/commandeTypes.ts
export type StatutCommande = 'En attente' | 'Confirmée' | 'En cours' | 'Livré' | 'Annulée';

export interface Commande {
  id: string;
  destination: string;
  origine: string;
  statut: StatutCommande;
  date: string;
  datelivraison?: string;
  transporteur: string;
  transporteurTel: string;
  client: string;
  clientTel: string;
  type: string;
  poids: number;
  volume: number;
  prix: number;
  description?: string;
}

export interface CreateCommandePayload {
  destination: string;
  origine: string;
  type: string;
  poids: number;
  volume: number;
  description?: string;
  transporteurId: string;
  dateCollecte: string;
  adresseCollecte: string;
  instructionsSpeciales?: string;
}