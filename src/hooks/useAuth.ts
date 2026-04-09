import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextValue } from '../context/AuthContext';
import type { UserRole } from '../types/auth.types';

// ============================================================
// HOOK PRINCIPAL
// ============================================================
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un <AuthProvider>');
  }

  return context;
}

// ============================================================
// HOOKS DÉRIVÉS (utilitaires)
// ============================================================

/** Retourne true si l'utilisateur a le rôle demandé */
export function useHasRole(role: UserRole): boolean {
  const { user } = useAuth();
  return user?.role === role;
}

/** Retourne true si l'utilisateur est authentifié et son token valide */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/** Retourne uniquement les infos de l'utilisateur connecté */
export function useCurrentUser() {
  const { user } = useAuth();
  return user;
}