// services/commandeService.ts
import { get, post, put, patch } from './api/axiosConfig';
import { API_ROUTES } from './api/apiRoutes';
import type { Commande, StatutCommande, CreateCommandePayload } from '../types/commande.types';

// Types spécifiques
export interface CommandeFilters {
  statut?: StatutCommande;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const commandeService = {
  /**
   * Récupérer toutes les commandes de l'utilisateur connecté
   */
  async getAllCommandes(filters?: CommandeFilters): Promise<Commande[]> {
    const params = new URLSearchParams();
    if (filters?.statut) params.append('statut', filters.statut);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.size) params.append('size', filters.size.toString());
    
    const url = params.toString() 
      ? `${API_ROUTES.COMMANDES.GET_ALL}?${params.toString()}`
      : API_ROUTES.COMMANDES.GET_ALL;
    
    return await get<Commande[]>(url);
  },

  /**
   * Récupérer les commandes du client connecté
   */
  async getMesCommandes(filters?: CommandeFilters): Promise<Commande[]> {
    const params = new URLSearchParams();
    if (filters?.statut) params.append('statut', filters.statut);
    
    const url = params.toString()
      ? `${API_ROUTES.COMMANDES.GET_MES_COMMANDES}?${params.toString()}`
      : API_ROUTES.COMMANDES.GET_MES_COMMANDES;
    
    return await get<Commande[]>(url);
  },

  /**
   * Récupérer les commandes reçues par le transporteur
   */
  async getCommandesRecues(filters?: CommandeFilters): Promise<Commande[]> {
    const params = new URLSearchParams();
    if (filters?.statut) params.append('statut', filters.statut);
    
    const url = params.toString()
      ? `${API_ROUTES.COMMANDES.GET_COMMANDES_RECUES}?${params.toString()}`
      : API_ROUTES.COMMANDES.GET_COMMANDES_RECUES;
    
    return await get<Commande[]>(url);
  },

  /**
   * Récupérer une commande par son ID
   */
  async getCommandeById(id: string): Promise<Commande> {
    return await get<Commande>(API_ROUTES.COMMANDES.GET_BY_ID(id));
  },

  /**
   * Créer une nouvelle commande
   */
  async createCommande(payload: CreateCommandePayload): Promise<Commande> {
    return await post<Commande>(API_ROUTES.COMMANDES.CREATE, payload);
  },

  /**
   * Mettre à jour une commande
   */
  async updateCommande(id: string, payload: Partial<CreateCommandePayload>): Promise<Commande> {
    return await put<Commande>(API_ROUTES.COMMANDES.UPDATE(id), payload);
  },

  /**
   * Mettre à jour le statut d'une commande
   */
  async updateStatut(id: string, statut: StatutCommande): Promise<Commande> {
    return await patch<Commande>(API_ROUTES.COMMANDES.UPDATE_STATUT(id), { statut });
  },

  /**
   * Annuler une commande
   */
  async annulerCommande(id: string): Promise<Commande> {
    return await patch<Commande>(API_ROUTES.COMMANDES.CANCEL(id));
  },

  /**
   * Télécharger le bon de commande
   */
  async telechargerBonCommande(id: string): Promise<Blob> {
    const response = await fetch(`${API_ROUTES.COMMANDES.GET_BY_ID(id)}/bon`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('gp_auth_token')}`,
      },
    });
    if (!response.ok) throw new Error('Erreur lors du téléchargement');
    return response.blob();
  },
};

export default commandeService;