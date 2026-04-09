// ============================================================
// RÔLES
// ============================================================
export type UserRole = 'client' | 'transporteur';

// ============================================================
// ENTITÉ UTILISATEUR
// ============================================================
export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  telephone?: string;
  adresse?: string;
  createdAt: string;
}

// ============================================================
// ÉTAT D'AUTHENTIFICATION (pour AuthContext)
// ============================================================
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================================
// PAYLOADS (ce que l'on enverra plus tard au backend)
// ============================================================
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  nom: string;
  prenom: string;
  role: UserRole;
  telephone?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================
// RÉPONSES API (ce que retournera le backend)
// ============================================================
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number; // secondes
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string; // pour les erreurs de validation par champ
}