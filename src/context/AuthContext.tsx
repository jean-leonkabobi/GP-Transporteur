// context/AuthContext.tsx
import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';

import authService from '../services/authService';
import type {
  AuthState,
  User,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
} from '../types/auth.types';


// ============================================================
// CLÉS LOCALSTORAGE
// ============================================================
const TOKEN_KEY = 'gp_auth_token';
const USER_KEY  = 'gp_auth_user';

// ============================================================
// ACTIONS DU REDUCER
// ============================================================
type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR';   payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// ============================================================
// ÉTAT INITIAL
// ============================================================
const initialState: AuthState = {
  user:            null,
  token:           null,
  isAuthenticated: false,
  isLoading:       true,  // true au démarrage le temps de lire le localStorage
  error:           null,
};

// ============================================================
// REDUCER
// ============================================================
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {

    case 'AUTH_LOADING':
      return { ...state, isLoading: true, error: null };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user:            action.payload.user,
        token:           action.payload.token,
        isAuthenticated: true,
        isLoading:       false,
        error:           null,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error:     action.payload,
      };

    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

// ============================================================
// HELPERS LOCALSTORAGE
// ============================================================
const storage = {
  save(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  getUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },
};

// ============================================================
// SHAPE DU CONTEXTE
// ============================================================
interface AuthContextValue extends AuthState {
  login:          (payload: LoginPayload)          => Promise<void>;
  register:       (payload: RegisterPayload)        => Promise<void>;
  logout:         ()                               => Promise<void>;
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<string>;
  clearError:     ()                               => void;
}

// ============================================================
// CRÉATION DU CONTEXTE
// ============================================================
const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ----------------------------------------------------------
  // RESTAURATION DE SESSION au montage
  // ----------------------------------------------------------
  useEffect(() => {
    const restoreSession = async () => {
      const token = storage.getToken();
      const user  = storage.getUser();

      if (!token || !user) {
        dispatch({ type: 'AUTH_LOGOUT' });
        return;
      }

      try {
        // Revalide le token auprès du service (mock ou futur vrai backend)
        const freshUser = await authService.getMe(token);
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: freshUser, token } });
      } catch {
        // Token expiré ou invalide → on nettoie
        storage.clear();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    restoreSession();
  }, []);

  // ----------------------------------------------------------
  // LOGIN
  // ----------------------------------------------------------
  const login = useCallback(async (payload: LoginPayload) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const response = await authService.login(payload);
      storage.save(response.token, response.user);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.user, token: response.token } });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion.';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw err; // re-throw pour que la page puisse réagir si besoin
    }
  }, []);

  // ----------------------------------------------------------
  // REGISTER
  // ----------------------------------------------------------
  const register = useCallback(async (payload: RegisterPayload) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const response = await authService.register(payload);
      storage.save(response.token, response.user);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.user, token: response.token } });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'inscription.";
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw err;
    }
  }, []);

  // ----------------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------------
  const logout = useCallback(async () => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      await authService.logout();
    } finally {
      storage.clear();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, []);

  // ----------------------------------------------------------
  // MOT DE PASSE OUBLIÉ
  // ----------------------------------------------------------
  const forgotPassword = useCallback(async (payload: ForgotPasswordPayload): Promise<string> => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const response = await authService.forgotPassword(payload);
      dispatch({ type: 'AUTH_ERROR', payload: '' }); // stoppe le loading sans erreur
      return response.message;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la demande.';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw err;
    }
  }, []);

  // ----------------------------------------------------------
  // CLEAR ERROR
  // ----------------------------------------------------------
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // ----------------------------------------------------------
  // VALEUR EXPOSÉE
  // ----------------------------------------------------------
  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// EXPORT DU CONTEXTE BRUT (pour useAuth)
// ============================================================
export { AuthContext };
export type { AuthContextValue };