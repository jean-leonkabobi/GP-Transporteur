// hooks/useCommande.ts
import { useCommande as useCommandeContext } from '../context/CommandeContext.tsx';

export function useCommande() {
  const context = useCommandeContext();
  
  if (!context) {
    throw new Error('useCommande must be used within a CommandeProvider');
  }
  
  return context;
}