import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/common/ProtectedRoute';

// Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages auth
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Pages app
import HomePage            from './pages/HomePage';
import RecherchePage       from './pages/RecherchePage';
import CommandePage        from './pages/CommandePage';
import NouvelleCommandePage from './pages/NouvelleCommandePage';
import RendezVousPage      from './pages/RendezVousPage';
import SuiviPage           from './pages/SuiviPage';
import MonComptePage       from './pages/MonComptePage';

// Layout component pour les pages authentifiées
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      background: '#f8fafc',
    }}>
      <Navbar />
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px',
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

// ============================================================
// PLACEHOLDER
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

          {/* ROUTES PUBLIQUES */}
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

          {/* ROUTES PRIVÉES AVEC LAYOUT */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <HomePage />
              </AppLayout>
            </ProtectedRoute>
          }/>

          <Route path="/recherche" element={
            <ProtectedRoute>
              <AppLayout>
                <RecherchePage />
              </AppLayout>
            </ProtectedRoute>
          }/>

          <Route path="/commandes" element={
            <ProtectedRoute>
              <AppLayout>
                <CommandePage />
              </AppLayout>
            </ProtectedRoute>
          }/>

          <Route path="/commandes/nouvelle" element={
            <ProtectedRoute>
              <AppLayout>
                <NouvelleCommandePage />
              </AppLayout>
            </ProtectedRoute>
          }/>

          <Route path="/rendez-vous" element={
            <ProtectedRoute>
              <AppLayout>
                <RendezVousPage />
              </AppLayout>
            </ProtectedRoute>
          }/>

          <Route path="/suivi" element={
            <ProtectedRoute>
              <AppLayout>
                <SuiviPage />
              </AppLayout>
            </ProtectedRoute>
          }/>

          <Route path="/mon-compte" element={
            <ProtectedRoute>
              <AppLayout>
                <MonComptePage />
              </AppLayout>
            </ProtectedRoute>
          }/>

          {/* ROUTES SPÉCIFIQUES */}
          <Route path="/dashboard/transporteur" element={
            <ProtectedRoute requiredRole="transporteur">
              <AppLayout>
                <ComingSoon title="Dashboard Transporteur" />
              </AppLayout>
            </ProtectedRoute>
          }/>

          <Route path="/dashboard/client" element={
            <ProtectedRoute requiredRole="client">
              <AppLayout>
                <ComingSoon title="Dashboard Client" />
              </AppLayout>
            </ProtectedRoute>
          }/>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />}/>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}