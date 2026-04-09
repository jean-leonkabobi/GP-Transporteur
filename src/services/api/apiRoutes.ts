// services/api/apiRoutes.ts

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ROUTES = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },

  // Commandes
  COMMANDES: {
    BASE: '/commandes',
    GET_ALL: '/commandes',
    GET_BY_ID: (id: string) => `/commandes/${id}`,
    CREATE: '/commandes',
    UPDATE: (id: string) => `/commandes/${id}`,
    UPDATE_STATUT: (id: string) => `/commandes/${id}/statut`,
    CANCEL: (id: string) => `/commandes/${id}/annuler`,
    GET_MES_COMMANDES: '/commandes/mes-commandes',
    GET_COMMANDES_RECUES: '/commandes/recues',
  },

  // Recherche
  RECHERCHE: {
    TRANSPORTEURS: '/recherche/transporteurs',
    PRIX: '/recherche/prix',
    DISPONIBILITE: '/recherche/disponibilite',
  },

  // Rendez-vous
  RENDEZ_VOUS: {
    BASE: '/rendez-vous',
    GET_ALL: '/rendez-vous',
    GET_BY_ID: (id: string) => `/rendez-vous/${id}`,
    CREATE: '/rendez-vous',
    UPDATE: (id: string) => `/rendez-vous/${id}`,
    UPDATE_STATUT: (id: string) => `/rendez-vous/${id}/statut`,
    CANCEL: (id: string) => `/rendez-vous/${id}/annuler`,
    GET_MES_RENDEZ_VOUS: '/rendez-vous/mes-rendez-vous',
  },

  // Suivi
  SUIVI: {
    GET_BY_COMMANDE: (commandeId: string) => `/suivi/${commandeId}`,
    UPDATE_POSITION: (commandeId: string) => `/suivi/${commandeId}/position`,
    GET_HISTORIQUE: (commandeId: string) => `/suivi/${commandeId}/historique`,
  },

  // Transporteurs
  TRANSPORTEURS: {
    BASE: '/transporteurs',
    GET_ALL: '/transporteurs',
    GET_BY_ID: (id: string) => `/transporteurs/${id}`,
    GET_AVAILABLE: '/transporteurs/disponibles',
  },
} as const;

export type ApiRoutes = typeof API_ROUTES;