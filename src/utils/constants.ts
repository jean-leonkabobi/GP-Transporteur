// utils/constants.ts

// Statuts des commandes
export const STATUTS_COMMANDE = {
  EN_ATTENTE: 'En attente',
  CONFIRMEE: 'Confirmée',
  EN_COURS: 'En cours',
  LIVRE: 'Livré',
  ANNULEE: 'Annulée',
} as const;

// Statuts des rendez-vous
export const STATUTS_RENDEZ_VOUS = {
  EN_ATTENTE: 'En attente',
  CONFIRME: 'Confirmé',
  REFUSE: 'Refusé',
  ANNULE: 'Annulé',
  TERMINE: 'Terminé',
} as const;

// Types de marchandise
export const TYPES_MARCHANDISE = [
  'Colis standard',
  'Marchandises fragiles',
  'Produits alimentaires',
  'Matériaux de construction',
  'Électroménager',
  'Textile / Vêtements',
  'Documents',
  'Médicaments',
  'Animaux vivants',
  'Matières dangereuses',
  'Autres',
] as const;

// Créneaux horaires
export const CRENEAUX_HORAIRES = [
  '08h00 - 10h00',
  '10h00 - 12h00',
  '12h00 - 14h00',
  '14h00 - 16h00',
  '16h00 - 18h00',
  '18h00 - 20h00',
] as const;

// Rôles utilisateur
export const ROLES = {
  CLIENT: 'client',
  TRANSPORTEUR: 'transporteur',
} as const;

// Configuration des prix
export const PRIX_PAR_KG_DEFAUT = 1000;
export const PRIX_MINIMAL = 500;
export const FRAIS_FIXES = 0;

// Messages d'erreur
export const ERROR_MESSAGES = {
  REQUIRED: 'Ce champ est requis',
  INVALID_EMAIL: 'Email invalide',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 6 caractères',
  PASSWORDS_DO_NOT_MATCH: 'Les mots de passe ne correspondent pas',
  NETWORK_ERROR: 'Erreur de connexion',
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès interdit',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur serveur',
} as const;

// LocalStorage keys
export const STORAGE_KEYS = {
  TOKEN: 'gp_auth_token',
  USER: 'gp_auth_user',
  THEME: 'gp_theme',
  LANGUAGE: 'gp_language',
} as const;

// Configuration de la carte
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 14.6937, lng: -17.4441 }, // Dakar
  DEFAULT_ZOOM: 7,
  MIN_ZOOM: 6,
  MAX_ZOOM: 12,
} as const;

// Format de date
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_LONG: 'dd MMMM yyyy',
  DISPLAY_SHORT: 'dd/MM/yy',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  SIZES: [5, 10, 20, 50],
} as const;