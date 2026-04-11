import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { LoginPayload } from '../types/auth.types';
import loginBg from '../assets/login-bg.jpg'; 

// ============================================================
// COMPOSANTS UI LOCAUX
// ============================================================
function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width: '100%',
            padding: isPassword ? '11px 44px 11px 14px' : '11px 14px',
            border: `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
            borderRadius: '10px',
            fontSize: '14px',
            color: '#111827',
            background: '#fff',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#3b82f6';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <span style={{ fontSize: '12px', color: '#ef4444' }}>{error}</span>
      )}
    </div>
  );
}

// ============================================================
// PAGE LOGIN
// ============================================================
export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from ?? '/';

  const [form, setForm] = useState<LoginPayload>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Partial<LoginPayload>>({});

  // ============================================================
  // COMPTES DE DÉMO PERSONNALISÉS
  // ============================================================
  const demoAccounts = {
    client: {
      email: 'ndeyelo@client.com',
      password: 'password123',
      name: 'Ndeye Lo'
    },
    transporteur: {
      email: 'jeanleon@transporteur.com',
      password: 'password123',
      name: 'Jean Léon'
    }
  };

  // Nettoie l'erreur globale quand l'utilisateur retape
  useEffect(() => {
    if (error) clearError();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.email, form.password]);

  // ----------------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------------
  const validate = (): boolean => {
    const errors: Partial<LoginPayload> = {};
    if (!form.email.trim()) {
      errors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Email invalide.';
    }
    if (!form.password) {
      errors.password = 'Le mot de passe est requis.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ----------------------------------------------------------
  // SOUMISSION
  // ----------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch {
      // L'erreur est déjà gérée dans AuthContext
    }
  };

  // ----------------------------------------------------------
  // COMPTES DE DÉMO (version modifiée)
  // ----------------------------------------------------------
  const fillDemo = (role: 'client' | 'transporteur') => {
    const account = demoAccounts[role];
    setForm({
      email: account.email,
      password: account.password,
    });
    setFieldErrors({});
  };

  // ----------------------------------------------------------
  // RENDU
  // ----------------------------------------------------------
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* ---- Panneau gauche avec IMAGE au lieu du dégradé ---- */}
      <div
        style={{
          flex: 1,
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 48px',
          color: '#fff',
          position: 'relative',
        }}
        className="left-panel"
      >
        {/* Overlay semi-transparent pour que le texte soit lisible */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 60%)',
          zIndex: 1,
        }} />
        
        {/* Contenu au-dessus de l'overlay */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '56px', justifyContent: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4l3 5v3h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <span style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px' }}>
              GP Transporteurs
            </span>
          </div>

          {/* Titre principal */}
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 700, 
            marginBottom: '16px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            GP Transporteurs
          </h1>
          
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 600, 
            marginBottom: '16px',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            Connectez-vous à votre espace
          </h2>
          
          <p style={{ 
            fontSize: '16px', 
            color: 'rgba(255,255,255,0.9)', 
            maxWidth: '400px', 
            margin: '0 auto',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            Accédez à vos commandes, suivez vos livraisons et gérez vos rendez-vous en temps réel.
          </p>
        </div>
      </div>

      {/* ---- Panneau droit (formulaire) ---- */}
      <div
        style={{
          width: '480px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 56px',
          background: '#fff',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.06)',
          overflowY: 'auto',
        }}
        className="right-panel"
      >
        <div style={{ width: '100%', maxWidth: '360px' }}>

          {/* En-tête */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
              Connexion
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Pas encore de compte ?{' '}
              <Link to="/register" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Comptes démo - Version avec les nouveaux comptes */}
          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '24px',
            }}
          >
            <p style={{ fontSize: '12px', color: '#0369a1', fontWeight: 500, marginBottom: '8px' }}>
              Comptes de démonstration
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => fillDemo('client')}
                style={{
                  flex: 1,
                  padding: '7px',
                  background: '#fff',
                  border: '1px solid #7dd3fc',
                  borderRadius: '7px',
                  fontSize: '12px',
                  color: '#0369a1',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
              >
                {demoAccounts.client.name} (Client)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('transporteur')}
                style={{
                  flex: 1,
                  padding: '7px',
                  background: '#fff',
                  border: '1px solid #7dd3fc',
                  borderRadius: '7px',
                  fontSize: '12px',
                  color: '#0369a1',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
              >
                {demoAccounts.transporteur.name} (Transporteur)
              </button>
            </div>
            {/* Affichage des emails en petit */}
            <div style={{ 
              fontSize: '10px', 
              color: '#6b7280', 
              marginTop: '8px',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <span>{demoAccounts.client.email}</span>
              <span>•</span>
              <span>{demoAccounts.transporteur.email}</span>
            </div>
          </div>

          {/* Erreur globale */}
          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: '13px', color: '#dc2626' }}>{error}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <InputField
              label="Adresse email"
              type="email"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              placeholder="vous@exemple.com"
              error={fieldErrors.email}
              autoComplete="email"
            />
            <InputField
              label="Mot de passe"
              type="password"
              value={form.password}
              onChange={(v) => setForm((f) => ({ ...f, password: v }))}
              placeholder="••••••••"
              error={fieldErrors.password}
              autoComplete="current-password"
            />

            {/* Mot de passe oublié */}
            <div style={{ textAlign: 'right', marginTop: '-8px' }}>
              <Link
                to="/forgot-password"
                style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '13px',
                background: isLoading ? '#93c5fd' : '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'background 0.2s, transform 0.1s',
                marginTop: '4px',
              }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = '#2563eb'; }}
            >
              {isLoading ? (
                <>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '32px' }}>
            En vous connectant, vous acceptez nos{' '}
            <span style={{ color: '#6b7280', textDecoration: 'underline', cursor: 'pointer' }}>
              Conditions d'utilisation
            </span>
          </p>
        </div>
      </div>

      {/* Styles responsive */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        @media (max-width: 900px) {
          .left-panel {
            display: none !important;
          }
          .right-panel {
            width: 100% !important;
            padding: 48px 24px !important;
          }
        }
        
        @media (max-width: 480px) {
          .right-panel {
            padding: 32px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}