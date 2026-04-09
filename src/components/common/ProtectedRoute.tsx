import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useHasRole } from '../../hooks/useAuth';
import type { UserRole } from '../../types/auth.types';
import type { ReactNode } from 'react';

// ============================================================
// TYPES
// ============================================================
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;       // si défini, seul ce rôle peut accéder
  redirectTo?: string;           // redirection custom si non autorisé
}

// ============================================================
// COMPOSANT DE CHARGEMENT (pendant la restauration de session)
// ============================================================
function AuthLoader() {
  return (
    <div
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        height:         '100vh',
        gap:            '16px',
      }}
    >
      <div
        style={{
          width:           '40px',
          height:          '40px',
          border:          '3px solid #e2e8f0',
          borderTopColor:  '#3b82f6',
          borderRadius:    '50%',
          animation:       'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: '#64748b', fontSize: '14px' }}>Vérification de la session...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ============================================================
// PROTECTED ROUTE
// ============================================================
export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const hasRequiredRole = useHasRole(requiredRole as UserRole);
  const location = useLocation();

  // --- 1. Attendre la restauration de session ---
  if (isLoading) {
    return <AuthLoader />;
  }

  // --- 2. Non connecté → vers /login ---
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }} // mémorise la page demandée
        replace
      />
    );
  }

  // --- 3. Connecté mais mauvais rôle ---
  if (requiredRole && !hasRequiredRole) {
    // Redirection custom ou vers le dashboard du bon rôle
    const fallback = redirectTo ?? (user?.role === 'transporteur' ? '/dashboard/transporteur' : '/dashboard/client');
    return <Navigate to={fallback} replace />;
  }

  // --- 4. Tout est OK ---
  return <>{children}</>;
}

// ============================================================
// VARIANTE : ROUTE PUBLIQUE UNIQUEMENT
// (redirige vers le dashboard si déjà connecté)
// ex : /login, /register → inutile d'y accéder si déjà auth
// ============================================================
interface PublicOnlyRouteProps {
  children: ReactNode;
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoader />;
  }

  if (isAuthenticated) {
    // Redirige vers la page d'origine si elle existe, sinon dashboard selon rôle
    const from = (location.state as { from?: string })?.from;
    const dashboard =
      user?.role === 'transporteur'
        ? '/dashboard/transporteur'
        : '/dashboard/client';

    return <Navigate to={from ?? dashboard} replace />;
  }

  return <>{children}</>;
}