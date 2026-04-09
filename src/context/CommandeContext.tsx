// context/CommandeContext.tsx
import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { Commande, StatutCommande } from '../types/commande.types';

// État du contexte
interface CommandeState {
  commandes: Commande[];
  commandeSelectionnee: Commande | null;
  isLoading: boolean;
  error: string | null;
}

// Actions
type CommandeAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_COMMANDES'; payload: Commande[] }
  | { type: 'SET_COMMANDE_SELECTIONNEE'; payload: Commande | null }
  | { type: 'ADD_COMMANDE'; payload: Commande }
  | { type: 'UPDATE_COMMANDE'; payload: { id: string; updates: Partial<Commande> } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// État initial
const initialState: CommandeState = {
  commandes: [],
  commandeSelectionnee: null,
  isLoading: false,
  error: null,
};

// Reducer
function commandeReducer(state: CommandeState, action: CommandeAction): CommandeState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_COMMANDES':
      return { ...state, commandes: action.payload, isLoading: false };
    
    case 'SET_COMMANDE_SELECTIONNEE':
      return { ...state, commandeSelectionnee: action.payload };
    
    case 'ADD_COMMANDE':
      return { ...state, commandes: [action.payload, ...state.commandes] };
    
    case 'UPDATE_COMMANDE':
      return {
        ...state,
        commandes: state.commandes.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

// Types du contexte
interface CommandeContextValue extends CommandeState {
  fetchCommandes: () => Promise<void>;
  getCommandeById: (id: string) => Commande | undefined;
  createCommande: (commande: Omit<Commande, 'id' | 'statut' | 'date'>) => Promise<Commande>;
  updateCommandeStatut: (id: string, statut: StatutCommande) => Promise<void>;
  annulerCommande: (id: string) => Promise<void>;
  setCommandeSelectionnee: (commande: Commande | null) => void;
  clearError: () => void;
}

// Création du contexte
const CommandeContext = createContext<CommandeContextValue | null>(null);

// Provider
export function CommandeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(commandeReducer, initialState);

  // Fetch des commandes (mock)
  const fetchCommandes = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Données mockées
      const mockCommandes: Commande[] = [
        {
          id: 'CMD-001',
          origine: 'Dakar',
          destination: 'Thiès',
          statut: 'En cours',
          date: '08 avr. 2026',
          datelivraison: '09 avr. 2026',
          transporteur: 'Ndiaye Express',
          transporteurTel: '+221 77 111 22 33',
          client: 'Amadou Diallo',
          clientTel: '+221 77 000 00 01',
          type: 'Colis standard',
          poids: 25,
          volume: 0.5,
          prix: 21250,
          description: 'Cartons de vêtements, fragiles',
        },
        {
          id: 'CMD-002',
          origine: 'Dakar',
          destination: 'Saint-Louis',
          statut: 'Livré',
          date: '05 avr. 2026',
          datelivraison: '06 avr. 2026',
          transporteur: 'Sénégal Transport Co.',
          transporteurTel: '+221 77 222 33 44',
          client: 'Amadou Diallo',
          clientTel: '+221 77 000 00 01',
          type: 'Marchandises fragiles',
          poids: 10,
          volume: 0.3,
          prix: 12000,
          description: 'Équipement électronique',
        },
      ];
      
      dispatch({ type: 'SET_COMMANDES', payload: mockCommandes });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des commandes' });
    }
  }, []);

  // Récupérer une commande par ID
  const getCommandeById = useCallback((id: string) => {
    return state.commandes.find(c => c.id === id);
  }, [state.commandes]);

  // Créer une commande
  const createCommande = useCallback(async (commande: Omit<Commande, 'id' | 'statut' | 'date'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCommande: Commande = {
        ...commande,
        id: `CMD-${String(state.commandes.length + 1).padStart(3, '0')}`,
        statut: 'En attente',
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      
      dispatch({ type: 'ADD_COMMANDE', payload: newCommande });
      return newCommande;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la création de la commande' });
      throw error;
    }
  }, [state.commandes.length]);

  // Mettre à jour le statut d'une commande
  const updateCommandeStatut = useCallback(async (id: string, statut: StatutCommande) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'UPDATE_COMMANDE', payload: { id, updates: { statut } } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la mise à jour' });
      throw error;
    }
  }, []);

  // Annuler une commande
  const annulerCommande = useCallback(async (id: string) => {
    await updateCommandeStatut(id, 'Annulée');
  }, [updateCommandeStatut]);

  // Sélectionner une commande
  const setCommandeSelectionnee = useCallback((commande: Commande | null) => {
    dispatch({ type: 'SET_COMMANDE_SELECTIONNEE', payload: commande });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: CommandeContextValue = {
    ...state,
    fetchCommandes,
    getCommandeById,
    createCommande,
    updateCommandeStatut,
    annulerCommande,
    setCommandeSelectionnee,
    clearError,
  };

  return (
    <CommandeContext.Provider value={value}>
      {children}
    </CommandeContext.Provider>
  );
}

// Hook personnalisé
export function useCommande() {
  const context = useContext(CommandeContext);
  if (!context) {
    throw new Error('useCommande must be used within a CommandeProvider');
  }
  return context;
}