// types/rendezvousTypes.ts
export type StatutRDV = 'En attente' | 'Confirmé' | 'Refusé' | 'Annulé' | 'Terminé';

export interface RendezVous {
  id: string;
  commandeId: string;
  date: string;
  heure: string;
  lieu: string;
  notes: string;
  statut: StatutRDV;
  client: string;
  clientTel: string;
  transporteur: string;
  transporteurTel: string;
  destination: string;
  type: string;
}

export interface CreateRendezVousPayload {
  commandeId: string;
  date: string;
  heure: string;
  lieu: string;
  notes?: string;
}