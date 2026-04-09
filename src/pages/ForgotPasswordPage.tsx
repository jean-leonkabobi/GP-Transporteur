import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ============================================================
// ÉTAPE 1 — Formulaire de demande
// ============================================================
function RequestForm({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');

  useEffect(() => {
    if (error) clearError();
    setFieldError('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const validate = (): boolean => {
    if (!email.trim()) {
      setFieldError("L'adresse email est requise.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('Adresse email invalide.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await forgotPassword({ email });
      onSuccess(email);
    } catch {
      // géré dans AuthContext
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Icône */}
      <div style={{
        width: '56px', height: '56px', borderRadius: '16px',
        background: '#eff6ff', display: 'flex',
        alignItems: 'center', justifyContent: 'center', marginBottom: '4px',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>

      {/* Texte */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
          Mot de passe oublié ?
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
          Entrez l'adresse email associée à votre compte. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      {/* Erreur globale */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: '9px', padding: '11px 13px',
          display: 'flex', alignItems: 'center', gap: '9px',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ fontSize: '13px', color: '#dc2626' }}>{error}</span>
        </div>
      )}

      {/* Champ email */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
          Adresse email <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          autoComplete="email"
          style={{
            width: '100%',
            padding: '11px 14px',
            border: `1.5px solid ${fieldError ? '#ef4444' : '#e5e7eb'}`,
            borderRadius: '9px',
            fontSize: '14px',
            color: '#111827',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => { e.target.style.borderColor = fieldError ? '#ef4444' : '#2563eb'; }}
          onBlur={(e)  => { e.target.style.borderColor = fieldError ? '#ef4444' : '#e5e7eb'; }}
        />
        {fieldError && (
          <span style={{ fontSize: '11.5px', color: '#ef4444' }}>{fieldError}</span>
        )}
      </div>

      {/* Bouton */}
      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%', padding: '12px',
          background: isLoading ? '#93c5fd' : '#2563eb',
          color: '#fff', border: 'none', borderRadius: '9px',
          fontSize: '14px', fontWeight: 600,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = '#1d4ed8'; }}
        onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = '#2563eb'; }}
      >
        {isLoading ? (
          <>
            <div style={{
              width: '14px', height: '14px',
              border: '2px solid rgba(255,255,255,0.4)',
              borderTopColor: '#fff', borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }}/>
            Envoi en cours...
          </>
        ) : 'Envoyer le lien'}
      </button>

      <Link
        to="/login"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px', fontSize: '13px', color: '#6b7280',
          textDecoration: 'none', fontWeight: 500,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Retour à la connexion
      </Link>
    </form>
  );
}

// ============================================================
// ÉTAPE 2 — Confirmation d'envoi
// ============================================================
function ConfirmationScreen({ email, onResend }: { email: string; onResend: () => void }) {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Compte à rebours pour le renvoi
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = () => {
    onResend();
    setCountdown(60);
    setCanResend(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Animation succès */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: '#f0fdf4', border: '2px solid #bbf7d0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
            Email envoyé !
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.65 }}>
            Un lien de réinitialisation a été envoyé à
          </p>
          <p style={{
            fontSize: '14px', fontWeight: 600, color: '#2563eb',
            background: '#eff6ff', padding: '6px 14px', borderRadius: '8px',
            display: 'inline-block', marginTop: '6px',
          }}>
            {email}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        background: '#f8fafc', border: '1px solid #e2e8f0',
        borderRadius: '10px', padding: '16px',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        {[
          { icon: '📬', text: 'Vérifiez votre boîte de réception' },
          { icon: '📁', text: 'Vérifiez aussi votre dossier spam' },
          { icon: '⏱️', text: 'Le lien expire dans 30 minutes' },
        ].map((item) => (
          <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            <span style={{ fontSize: '13px', color: '#475569' }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Renvoi */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>
          Vous n'avez pas reçu l'email ?
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend}
          style={{
            background: 'none', border: 'none', cursor: canResend ? 'pointer' : 'default',
            fontSize: '13px', fontWeight: 600,
            color: canResend ? '#2563eb' : '#9ca3af',
            textDecoration: canResend ? 'underline' : 'none',
            padding: 0,
          }}
        >
          {canResend ? 'Renvoyer l\'email' : `Renvoyer dans ${countdown}s`}
        </button>
      </div>

      <Link
        to="/login"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px', fontSize: '13px', color: '#6b7280',
          textDecoration: 'none', fontWeight: 500,
          padding: '10px', border: '1.5px solid #e5e7eb',
          borderRadius: '9px', transition: 'border-color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#9ca3af')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Retour à la connexion
      </Link>
    </div>
  );
}

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSuccess = (email: string) => {
    setSubmittedEmail(email);
    setSubmitted(true);
  };

  const handleResend = () => {
    setSubmitted(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
          padding: '40px 44px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#2563eb',
            borderRadius: '9px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <path d="M16 8h4l3 5v3h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>GP Transporteurs</span>
        </div>

        {/* Contenu dynamique */}
        {!submitted ? (
          <RequestForm onSuccess={handleSuccess} />
        ) : (
          <ConfirmationScreen email={submittedEmail} onResend={handleResend} />
        )}
      </div>

      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes popIn  { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}