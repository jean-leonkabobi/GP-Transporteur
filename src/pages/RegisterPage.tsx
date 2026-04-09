// pages/RegisterPage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { RegisterPayload } from '../types/auth.types';

// Composant Input réutilisable
function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
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

export default function RegisterPage() {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterPayload>({
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    role: 'client', // Valeur par défaut : client
    telephone: '',
  });
  
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterPayload, string>>>({});

  // Nettoie l'erreur globale quand l'utilisateur modifie le formulaire
  useEffect(() => {
    if (error) clearError();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.email, form.password, form.nom, form.prenom, form.role]);

  const validate = (): boolean => {
    const errors: Partial<Record<keyof RegisterPayload, string>> = {};

    if (!form.nom.trim()) {
      errors.nom = 'Le nom est requis.';
    }

    if (!form.prenom.trim()) {
      errors.prenom = 'Le prénom est requis.';
    }

    if (!form.role) {
      errors.role = 'Veuillez sélectionner un type de compte.';
    }

    if (!form.email.trim()) {
      errors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Email invalide.';
    }

    if (!form.password) {
      errors.password = 'Le mot de passe est requis.';
    } else if (form.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas.';
    }

    if (form.telephone && !/^[\d\s+]{8,15}$/.test(form.telephone.replace(/\s/g, ''))) {
      errors.telephone = 'Numéro de téléphone invalide.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      await register(form);
      navigate('/');
    } catch {
      // L'erreur est déjà gérée dans AuthContext
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Panneau gauche (illustration) */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(160deg, #1d4ed8 0%, #1e40af 50%, #1e3a8a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 48px',
          color: '#fff',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '56px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255,255,255,0.15)',
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

        {/* Illustration SVG */}
        <svg width="260" height="200" viewBox="0 0 260 200" style={{ marginBottom: '40px', opacity: 0.92 }}>
          <path d="M0 160 Q130 120 260 160" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="40" strokeLinecap="round"/>
          <path d="M0 160 Q130 120 260 160" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="12 8"/>
          <rect x="80" y="105" width="60" height="35" rx="6" fill="rgba(255,255,255,0.9)"/>
          <rect x="140" y="113" width="30" height="27" rx="4" fill="rgba(255,255,255,0.7)"/>
          <circle cx="95" cy="142" r="8" fill="rgba(255,255,255,0.95)" stroke="#1d4ed8" strokeWidth="2"/>
          <circle cx="125" cy="142" r="8" fill="rgba(255,255,255,0.95)" stroke="#1d4ed8" strokeWidth="2"/>
          <circle cx="160" cy="142" r="8" fill="rgba(255,255,255,0.95)" stroke="#1d4ed8" strokeWidth="2"/>
          <rect x="90" y="112" width="16" height="16" rx="3" fill="#93c5fd"/>
          <rect x="110" y="112" width="16" height="16" rx="3" fill="#60a5fa"/>
          <circle cx="200" cy="72" r="14" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
          <circle cx="200" cy="72" r="6" fill="#fff"/>
          <path d="M200 86 L200 100" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
        </svg>

        <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '14px', textAlign: 'center', lineHeight: 1.3 }}>
          Rejoignez notre plateforme
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 1.7, maxWidth: '320px' }}>
          Créez votre compte et accédez à tous nos services de transport.
        </p>
      </div>

      {/* Panneau droit (formulaire) */}
      <div
        style={{
          width: '520px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 56px',
          background: '#fff',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.06)',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* En-tête */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
              Inscription
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Déjà un compte ?{' '}
              <Link to="/login" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>
                Se connecter
              </Link>
            </p>
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: '13px', color: '#dc2626' }}>{error}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <InputField
                label="Nom"
                value={form.nom}
                onChange={(v) => setForm((f) => ({ ...f, nom: v }))}
                placeholder="Diallo"
                error={fieldErrors.nom}
                required
                autoComplete="family-name"
              />
              <InputField
                label="Prénom"
                value={form.prenom}
                onChange={(v) => setForm((f) => ({ ...f, prenom: v }))}
                placeholder="Amadou"
                error={fieldErrors.prenom}
                required
                autoComplete="given-name"
              />
            </div>

            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              placeholder="vous@exemple.com"
              error={fieldErrors.email}
              required
              autoComplete="email"
            />

            <InputField
              label="Téléphone"
              type="tel"
              value={form.telephone || ''}
              onChange={(v) => setForm((f) => ({ ...f, telephone: v }))}
              placeholder="+221 77 000 00 01"
              error={fieldErrors.telephone}
              autoComplete="tel"
            />

            {/* Sélection du rôle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                Type de compte <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={form.role === 'client'}
                    onChange={() => setForm((f) => ({ ...f, role: 'client' }))}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', color: '#374151' }}>Client</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="role"
                    value="transporteur"
                    checked={form.role === 'transporteur'}
                    onChange={() => setForm((f) => ({ ...f, role: 'transporteur' }))}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', color: '#374151' }}>Transporteur</span>
                </label>
              </div>
              {fieldErrors.role && (
                <span style={{ fontSize: '12px', color: '#ef4444' }}>{fieldErrors.role}</span>
              )}
            </div>

            <InputField
              label="Mot de passe"
              type="password"
              value={form.password}
              onChange={(v) => setForm((f) => ({ ...f, password: v }))}
              placeholder="••••••••"
              error={fieldErrors.password}
              required
              autoComplete="new-password"
            />

            <InputField
              label="Confirmer le mot de passe"
              type="password"
              value={form.confirmPassword}
              onChange={(v) => setForm((f) => ({ ...f, confirmPassword: v }))}
              placeholder="••••••••"
              error={fieldErrors.confirmPassword}
              required
              autoComplete="new-password"
            />

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
                transition: 'background 0.2s',
                marginTop: '8px',
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
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>

          <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '28px' }}>
            En vous inscrivant, vous acceptez nos{' '}
            <span style={{ color: '#6b7280', textDecoration: 'underline', cursor: 'pointer' }}>
              Conditions d'utilisation
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .left-panel { display: none; }
        }
      `}</style>
    </div>
  );
}