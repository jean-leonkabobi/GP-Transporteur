// services/rendezVousService.ts
import { get, post, patch, del } from './api/axiosConfig';
import { API_ROUTES } from './api/apiRoutes';
import type { RendezVous, CreateRendezVousPayload, StatutRDV } from '../types/rendezvous.types';

export interface RendezVousFilters {
  statut?: StatutRDV;
  date?: string;
  page?: number;
  size?: number;
}

const rendezVousService = {
  /**
   * Récupérer tous les rendez-vous de l'utilisateur
   */
  async getAllRendezVous(filters?: RendezVousFilters): Promise<RendezVous[]> {
    const params = new URLSearchParams();
    if (filters?.statut) params.append('statut', filters.statut);
    if (filters?.date) params.append('date', filters.date);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.size) params.append('size', filters.size.toString());
    
    const url = params.toString()
      ? `${API_ROUTES.RENDEZ_VOUS.GET_ALL}?${params.toString()}`
      : API_ROUTES.RENDEZ_VOUS.GET_ALL;
    
    return await get<RendezVous[]>(url);
  },

  /**
   * Récupérer les rendez-vous du client connecté
   */
  async getMesRendezVous(filters?: RendezVousFilters): Promise<RendezVous[]> {
    const params = new URLSearchParams();
    if (filters?.statut) params.append('statut', filters.statut);
    if (filters?.date) params.append('date', filters.date);
    
    const url = params.toString()
      ? `${API_ROUTES.RENDEZ_VOUS.GET_MES_RENDEZ_VOUS}?${params.toString()}`
      : API_ROUTES.RENDEZ_VOUS.GET_MES_RENDEZ_VOUS;
    
    return await get<RendezVous[]>(url);
  },

  /**
   * Récupérer un rendez-vous par son ID
   */
  async getRendezVousById(id: string): Promise<RendezVous> {
    return await get<RendezVous>(API_ROUTES.RENDEZ_VOUS.GET_BY_ID(id));
  },

  /**
   * Créer un nouveau rendez-vous
   */
  async createRendezVous(payload: CreateRendezVousPayload): Promise<RendezVous> {
    return await post<RendezVous>(API_ROUTES.RENDEZ_VOUS.CREATE, payload);
  },

  /**
   * Mettre à jour un rendez-vous
   */
  async updateRendezVous(id: string, payload: Partial<CreateRendezVousPayload>): Promise<RendezVous> {
    return await patch<RendezVous>(API_ROUTES.RENDEZ_VOUS.UPDATE(id), payload);
  },

  /**
   * Mettre à jour le statut d'un rendez-vous
   */
  async updateStatut(id: string, statut: StatutRDV): Promise<RendezVous> {
    return await patch<RendezVous>(API_ROUTES.RENDEZ_VOUS.UPDATE_STATUT(id), { statut });
  },

  /**
   * Annuler un rendez-vous
   */
  async annulerRendezVous(id: string): Promise<RendezVous> {
    return await patch<RendezVous>(API_ROUTES.RENDEZ_VOUS.CANCEL(id));
  },

  /**
   * Supprimer un rendez-vous
   */
  async deleteRendezVous(id: string): Promise<void> {
    return await del<void>(API_ROUTES.RENDEZ_VOUS.GET_BY_ID(id));
  },
};

export default rendezVousService;