// services/suiviService.ts
import { get, post } from './api/axiosConfig';
import { API_ROUTES } from './api/apiRoutes';

export interface Position {
  lat: number;
  lng: number;
  address: string;
  timestamp: string;
}

export interface EtapeSuivi {
  id: number;
  titre: string;
  description: string;
  date: string;
  statut: 'completed' | 'current' | 'pending';
  position?: Position;
}

export interface SuiviLivraison {
  commandeId: string;
  transporteur: string;
  chauffeur: string;
  chauffeurTel: string;
  vehicule: string;
  statut: string;
  positionActuelle: Position;
  destination: Position;
  origine: Position;
  etapes: EtapeSuivi[];
  miseAJour: string;
  estimationArrivee?: string;
}

export interface HistoriquePosition {
  commandeId: string;
  positions: Position[];
}

const suiviService = {
  /**
   * Récupérer le suivi d'une commande
   */
  async getSuiviByCommande(commandeId: string): Promise<SuiviLivraison> {
    return await get<SuiviLivraison>(API_ROUTES.SUIVI.GET_BY_COMMANDE(commandeId));
  },

  /**
   * Mettre à jour la position (pour transporteur)
   */
  async updatePosition(commandeId: string, position: { lat: number; lng: number; address: string }): Promise<SuiviLivraison> {
    return await post<SuiviLivraison>(API_ROUTES.SUIVI.UPDATE_POSITION(commandeId), position);
  },

  /**
   * Récupérer l'historique des positions
   */
  async getHistoriquePositions(commandeId: string): Promise<HistoriquePosition> {
    return await get<HistoriquePosition>(API_ROUTES.SUIVI.GET_HISTORIQUE(commandeId));
  },

  /**
   * WebSocket pour le suivi en temps réel
   */
  connectWebSocket(commandeId: string, onMessage: (data: SuiviLivraison) => void): WebSocket {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
    const ws = new WebSocket(`${wsUrl}/suivi/${commandeId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as SuiviLivraison;
      onMessage(data);
    };
    
    return ws;
  },
};

export default suiviService;