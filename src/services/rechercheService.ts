// services/rechercheService.ts
import { get } from './api/axiosConfig';
import { API_ROUTES } from './api/apiRoutes';
import type { Transporteur, RechercheFilters } from '../types/transporteur.types';

export interface RechercheResult {
  transporteurs: Transporteur[];
  total: number;
  tempsEstime?: number;
}

export interface PrixEstime {
  transporteurId: string;
  transporteurNom: string;
  prixParKg: number;
  prixTotal: number;
  delai: string;
}

const rechercheService = {
  /**
   * Rechercher des transporteurs
   */
  async rechercherTransporteurs(filters: RechercheFilters): Promise<RechercheResult> {
    const params = new URLSearchParams();
    
    if (filters.destination) params.append('destination', filters.destination);
    if (filters.date) params.append('date', filters.date);
    if (filters.type) params.append('typeMarchandise', filters.type);
    if (filters.poids) params.append('poids', filters.poids);
    if (filters.volume) params.append('volume', filters.volume);
    
    const url = params.toString()
      ? `${API_ROUTES.RECHERCHE.TRANSPORTEURS}?${params.toString()}`
      : API_ROUTES.RECHERCHE.TRANSPORTEURS;
    
    return await get<RechercheResult>(url);
  },

  /**
   * Obtenir les prix estimés pour une destination
   */
  async getPrixEstimes(destination: string, poids: number): Promise<PrixEstime[]> {
    const params = new URLSearchParams();
    params.append('destination', destination);
    params.append('poids', poids.toString());
    
    return await get<PrixEstime[]>(`${API_ROUTES.RECHERCHE.PRIX}?${params.toString()}`);
  },

  /**
   * Vérifier la disponibilité des transporteurs
   */
  async checkDisponibilite(destination: string, date: string): Promise<{ disponible: boolean; transporteursDisponibles: number }> {
    const params = new URLSearchParams();
    params.append('destination', destination);
    params.append('date', date);
    
    return await get<{ disponible: boolean; transporteursDisponibles: number }>(
      `${API_ROUTES.RECHERCHE.DISPONIBILITE}?${params.toString()}`
    );
  },

  /**
   * Obtenir tous les transporteurs
   */
  async getAllTransporteurs(): Promise<Transporteur[]> {
    return await get<Transporteur[]>(API_ROUTES.TRANSPORTEURS.GET_ALL);
  },

  /**
   * Obtenir un transporteur par son ID
   */
  async getTransporteurById(id: string): Promise<Transporteur> {
    return await get<Transporteur>(API_ROUTES.TRANSPORTEURS.GET_BY_ID(id));
  },
};

export default rechercheService;