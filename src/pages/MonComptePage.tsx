// pages/MonComptePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useHasRole } from '../hooks/useAuth';

export default function MonComptePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isTransporteur = useHasRole('transporteur');
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    telephone: user?.telephone || '',
    adresse: user?.adresse || '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Simulation sauvegarde
    await new Promise(resolve => setTimeout(resolve, 800));
    setSuccessMessage('Informations mises à jour avec succès !');
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const InfoRow = ({ label, value }: { label: string; value: string | undefined }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #f1f5f9',
    }}>
      <span style={{ fontSize: '13px', color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>{value || '—'}</span>
    </div>
  );

  const EditableField = ({ label, field, type = 'text' }: { label: string; field: keyof typeof formData; type?: string }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #f1f5f9',
    }}>
      <span style={{ fontSize: '13px', color: '#64748b' }}>{label}</span>
      {isEditing ? (
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          style={{
            padding: '6px 10px',
            border: '1.5px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '13px',
            width: '60%',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
        />
      ) : (
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>{formData[field] || '—'}</span>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', display: 'flex', alignItems: 'center',
              gap: '6px', fontSize: '13px', fontWeight: 500, padding: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Accueil
          </button>
          <span style={{ color: '#e2e8f0' }}>|</span>
          <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Mon compte
          </h1>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: '#fff',
            color: '#dc2626',
            border: '1.5px solid #fecaca',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fef2f2';
            e.currentTarget.style.borderColor = '#fca5a5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.borderColor = '#fecaca';
          }}
        >
          Déconnexion
        </button>
      </div>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Carte principale */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          {/* En-tête avec avatar */}
          <div style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            padding: '32px 32px 48px 32px',
            color: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                border: '3px solid rgba(255,255,255,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 700,
              }}>
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
                  {user?.prenom} {user?.nom}
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '6px',
                }}>
                  <span style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}>
                    {isTransporteur ? 'Transporteur' : 'Client'}
                  </span>
                  <span style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}>
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div style={{ padding: '32px' }}>
            {/* Message de succès */}
            {successMessage && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span style={{ fontSize: '13px', color: '#16a34a' }}>{successMessage}</span>
              </div>
            )}

            {/* Informations personnelles */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                  Informations personnelles
                </h3>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  style={{
                    padding: '6px 14px',
                    background: isEditing ? '#16a34a' : '#f1f5f9',
                    color: isEditing ? '#fff' : '#374151',
                    border: 'none',
                    borderRadius: '7px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (isEditing) e.currentTarget.style.background = '#15803d';
                    else e.currentTarget.style.background = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    if (isEditing) e.currentTarget.style.background = '#16a34a';
                    else e.currentTarget.style.background = '#f1f5f9';
                  }}
                >
                  {isEditing ? 'Sauvegarder' : 'Modifier'}
                </button>
              </div>

              <EditableField label="Nom" field="nom" />
              <EditableField label="Prénom" field="prenom" />
              <EditableField label="Téléphone" field="telephone" type="tel" />
              <EditableField label="Adresse" field="adresse" />
              
              {!isEditing && (
                <InfoRow label="Email" value={user?.email} />
              )}
              
              <InfoRow label="Membre depuis" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : undefined} />
            </div>

            {/* Statistiques */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              marginTop: '24px',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
                Statistiques
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                {isTransporteur ? (
                  <>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#2563eb' }}>8</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Commandes effectuées</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#16a34a' }}>4.8</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Note moyenne</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#d97706' }}>95%</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Taux de ponctualité</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#2563eb' }}>6</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Commandes passées</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#16a34a' }}>4</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Livraisons terminées</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#d97706' }}>2</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Rendez-vous à venir</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bouton de déconnexion supplémentaire */}
            {!isEditing && (
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  marginTop: '24px',
                  padding: '12px',
                  background: '#fff',
                  color: '#dc2626',
                  border: '1.5px solid #fecaca',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                  e.currentTarget.style.borderColor = '#fca5a5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#fecaca';
                }}
              >
                Se déconnecter
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}