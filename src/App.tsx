import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/common/ProtectedRoute';

// Pages auth
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Pages app (placeholders — à remplacer au fur et à mesure)
import HomePage            from './pages/HomePage';
import RecherchePage       from './pages/RecherchePage';
import CommandePage        from './pages/CommandePage';
import NouvelleCommandePage from './pages/NouvelleCommandePage';
import RendezVousPage      from './pages/RendezVousPage';
import SuiviPage           from './pages/SuiviPage';
import MonComptePage       from './pages/MonComptePage';

// ============================================================
// PLACEHOLDER — retire ce composant quand une vraie page existe
// ============================================================
function ComingSoon({ title }: { title: string }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: '#f8fafc', gap: '16px',
    }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '16px',
        background: '#eff6ff', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8">
          <rect x="1" y="3" width="15" height="13" rx="2"/>
          <path d="M16 8h4l3 5v3h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      </div>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h1>
      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Page en cours de développement</p>
      <a
        href="/"
        style={{
          marginTop: '8px', fontSize: '13px', color: '#2563eb',
          textDecoration: 'none', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
      >
        ← Retour à l'accueil
      </a>
    </div>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ------------------------------------------------ */}
          {/* ROUTES PUBLIQUES UNIQUEMENT                       */}
          {/* (redirigent vers dashboard si déjà connecté)     */}
          {/* ------------------------------------------------ */}
          <Route path="/login" element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }/>

          <Route path="/register" element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }/>

          <Route path="/forgot-password" element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }/>

          {/* ------------------------------------------------ */}
          {/* ROUTES PRIVÉES — accessibles à tous les rôles    */}
          {/* ------------------------------------------------ */}
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }/>

          <Route path="/recherche" element={
            <ProtectedRoute>
              <RecherchePage />
            </ProtectedRoute>
          }/>

          <Route path="/commandes" element={
            <ProtectedRoute>
              <CommandePage />
            </ProtectedRoute>
          }/>

          <Route path="/commandes/nouvelle" element={
            <ProtectedRoute>
              <NouvelleCommandePage />
            </ProtectedRoute>
          }/>

          <Route path="/rendez-vous" element={
            <ProtectedRoute>
              <RendezVousPage />
            </ProtectedRoute>
          }/>

          <Route path="/suivi" element={
            <ProtectedRoute>
              <SuiviPage />
            </ProtectedRoute>
          }/>

          <Route path="/mon-compte" element={
            <ProtectedRoute>
              <MonComptePage />
            </ProtectedRoute>
          }/>

          {/* ------------------------------------------------ */}
          {/* ROUTES PRIVÉES — réservées aux transporteurs     */}
          {/* ------------------------------------------------ */}
          <Route path="/dashboard/transporteur" element={
            <ProtectedRoute requiredRole="transporteur">
              <ComingSoon title="Dashboard Transporteur" />
            </ProtectedRoute>
          }/>

          {/* ------------------------------------------------ */}
          {/* ROUTES PRIVÉES — réservées aux clients           */}
          {/* ------------------------------------------------ */}
          <Route path="/dashboard/client" element={
            <ProtectedRoute requiredRole="client">
              <ComingSoon title="Dashboard Client" />
            </ProtectedRoute>
          }/>

          {/* ------------------------------------------------ */}
          {/* FALLBACK — 404                                    */}
          {/* ------------------------------------------------ */}
          <Route path="*" element={<Navigate to="/" replace />}/>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}