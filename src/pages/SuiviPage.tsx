// pages/SuiviPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHasRole } from '../hooks/useAuth';

// Types
interface SuiviEtape {
  id: number;
  titre: string;
  description: string;
  date: string;
  statut: 'completed' | 'current' | 'pending';
}

interface Position {
  lat: number;
  lng: number;
  address: string;
}

// Mock données
const MOCK_SUIVI = {
  commandeId: 'CMD-001',
  transporteur: 'Ndiaye Express',
  chauffeur: 'Modou Ndiaye',
  chauffeurTel: '+221 77 111 22 33',
  vehicule: 'Camion 5T - AB-123-CD',
  statut: 'En cours',
  positionActuelle: {
    lat: 14.7667,
    lng: -17.3667,
    address: 'Route nationale 1, près de Pout',
  },
  destination: {
    lat: 14.7917,
    lng: -16.9167,
    address: 'Thiès, Sénégal',
  },
  etapes: [
    {
      id: 1,
      titre: 'Collecte effectuée',
      description: 'Colis récupéré à Dakar',
      date: '08/04/2026 09:30',
      statut: 'completed' as const,
    },
    {
      id: 2,
      titre: 'En transit',
      description: 'En route vers Thiès',
      date: '08/04/2026 10:15',
      statut: 'current' as const,
    },
    {
      id: 3,
      titre: 'Arrivée à destination',
      description: 'Livraison prévue',
      date: '08/04/2026 14:00',
      statut: 'pending' as const,
    },
    {
      id: 4,
      titre: 'Livraison effectuée',
      description: 'Bon de livraison signé',
      date: '08/04/2026',
      statut: 'pending' as const,
    },
  ],
  miseAJour: 'Dernière mise à jour : 08/04/2026 10:45',
};

// Carte SVG simplifiée
function SimpleMap({ start, end, current }: { start: Position; end: Position; current: Position }) {
  return (
    <div style={{
      background: '#f0f9ff',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #e2e8f0',
    }}>
      <svg
        viewBox="0 0 600 200"
        width="100%"
        style={{ display: 'block', borderRadius: '8px' }}
      >
        {/* Fond */}
        <rect x="0" y="0" width="600" height="200" fill="#dbeafe" rx="8"/>
        
        {/* Route */}
        <path
          d="M 50 100 Q 300 60 550 100"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="40"
          strokeLinecap="round"
        />
        <path
          d="M 50 100 Q 300 60 550 100"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeDasharray="10 8"
        />
        
        {/* Point départ */}
        <circle cx="50" cy="100" r="10" fill="#16a34a" stroke="#fff" strokeWidth="3"/>
        <text x="50" y="135" textAnchor="middle" fontSize="10" fill="#166534" fontWeight="bold">
          Départ
        </text>
        <text x="50" y="148" textAnchor="middle" fontSize="8" fill="#15803d">
          Dakar
        </text>
        
        {/* Point actuel */}
        <circle cx="300" cy="76" r="12" fill="#2563eb" stroke="#fff" strokeWidth="3"/>
        <circle cx="300" cy="76" r="5" fill="#fff"/>
        <text x="300" y="50" textAnchor="middle" fontSize="9" fill="#1d4ed8" fontWeight="bold">
          Position actuelle
        </text>
        <text x="300" y="62" textAnchor="middle" fontSize="8" fill="#2563eb">
          {current.address.split(',')[0]}
        </text>
        
        {/* Point arrivée */}
        <circle cx="550" cy="100" r="10" fill="#d97706" stroke="#fff" strokeWidth="3"/>
        <text x="550" y="135" textAnchor="middle" fontSize="10" fill="#92400e" fontWeight="bold">
          Arrivée
        </text>
        <text x="550" y="148" textAnchor="middle" fontSize="8" fill="#b45309">
          Thiès
        </text>
      </svg>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '12px',
        padding: '0 8px',
      }}>
        <div style={{ fontSize: '11px', color: '#64748b' }}>
          📍 {start.address}
        </div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>
          🎯 {end.address}
        </div>
      </div>
    </div>
  );
}

// Timeline étape
function TimelineStep({ etape, isLast }: { etape: SuiviEtape; isLast: boolean }) {
  const getIcon = () => {
    if (etape.statut === 'completed') return '✅';
    if (etape.statut === 'current') return '🚚';
    return '⏳';
  };
  
  const getColor = () => {
    if (etape.statut === 'completed') return '#16a34a';
    if (etape.statut === 'current') return '#2563eb';
    return '#94a3b8';
  };
  
  return (
    <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
      {/* Ligne de connexion */}
      {!isLast && (
        <div style={{
          position: 'absolute',
          left: '15px',
          top: '32px',
          width: '2px',
          height: 'calc(100% - 20px)',
          background: etape.statut === 'completed' ? '#16a34a' : '#e2e8f0',
        }} />
      )}
      
      {/* Icône */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: getColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        color: '#fff',
        zIndex: 1,
        flexShrink: 0,
      }}>
        {getIcon()}
      </div>
      
      {/* Contenu */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '4px',
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: etape.statut === 'current' ? 700 : 600,
            color: etape.statut === 'current' ? '#2563eb' : '#111827',
          }}>
            {etape.titre}
          </span>
          {etape.date && (
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{etape.date}</span>
          )}
        </div>
        <p style={{
          fontSize: '13px',
          color: '#64748b',
          margin: 0,
          lineHeight: 1.5,
        }}>
          {etape.description}
        </p>
      </div>
    </div>
  );
}

export default function SuiviPage() {
  const navigate = useNavigate();
  const isTransporteur = useHasRole('transporteur');
  const [suivi] = useState(MOCK_SUIVI);
  const [commandes, setCommandes] = useState<{ id: string; destination: string }[]>([]);
  const [commandeSelectionnee, setCommandeSelectionnee] = useState(suivi.commandeId);

  // Simulation chargement commandes
  useEffect(() => {
    const mockCommandes = [
      { id: 'CMD-001', destination: 'Thiès' },
      { id: 'CMD-002', destination: 'Saint-Louis' },
      { id: 'CMD-004', destination: 'Dakar' },
    ];
    setCommandes(mockCommandes);
  }, []);

  const statutConfig: Record<string, { color: string; bg: string; label: string }> = {
    'En cours': { color: '#2563eb', bg: '#eff6ff', label: 'En cours de livraison' },
    'Livré': { color: '#16a34a', bg: '#f0fdf4', label: 'Livré avec succès' },
    'En attente': { color: '#d97706', bg: '#fffbeb', label: 'En attente de prise en charge' },
  };

  const currentConfig = statutConfig[suivi.statut] || statutConfig['En cours'];

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
        gap: '16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
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
          Suivi de livraison
        </h1>
      </div>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 24px' }}>
        {/* Sélecteur de commande */}
        {commandes.length > 1 && (
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
          }}>
            <label style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#374151',
              display: 'block',
              marginBottom: '8px',
            }}>
              Sélectionner une commande
            </label>
            <select
              value={commandeSelectionnee}
              onChange={(e) => setCommandeSelectionnee(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '9px',
                fontSize: '13px',
                outline: 'none',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              {commandes.map(cmd => (
                <option key={cmd.id} value={cmd.id}>
                  {cmd.id} - {cmd.destination}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Carte statut */}
        <div style={{
          background: currentConfig.bg,
          border: `1px solid ${currentConfig.color}20`,
          borderRadius: '14px',
          padding: '20px 24px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: currentConfig.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}>
              {suivi.statut === 'En cours' ? '🚚' : suivi.statut === 'Livré' ? '✅' : '⏳'}
            </div>
            <div>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: currentConfig.color,
              }}>
                {currentConfig.label}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Commande {suivi.commandeId}
              </div>
            </div>
          </div>
        </div>

        {/* Grille info transporteur + carte */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '20px',
          marginBottom: '32px',
        }}>
          {/* Infos transporteur */}
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '16px',
            }}>
              Informations transporteur
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 700,
                color: '#2563eb',
              }}>
                {suivi.transporteur.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                  {suivi.transporteur}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {suivi.vehicule}
                </div>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <InfoItem icon="👨‍✈️" label="Chauffeur" value={suivi.chauffeur} />
              <InfoItem icon="📞" label="Contact" value={suivi.chauffeurTel} />
            </div>
            
            {isTransporteur && (
              <button
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '9px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#374151',
                  cursor: 'pointer',
                }}
              >
                Mettre à jour la position
              </button>
            )}
          </div>
          
          {/* Carte */}
          <div>
            <SimpleMap
              start={{ lat: 14.6937, lng: -17.4441, address: 'Dakar, Sénégal' }}
              end={suivi.destination}
              current={suivi.positionActuelle}
            />
            <p style={{
              fontSize: '11px',
              color: '#94a3b8',
              textAlign: 'center',
              marginTop: '8px',
            }}>
              {suivi.miseAJour}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '20px',
          }}>
            Suivi de la livraison
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {suivi.etapes.map((etape, index) => (
              <TimelineStep
                key={etape.id}
                etape={etape}
                isLast={index === suivi.etapes.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Section aide */}
        <div style={{
          marginTop: '20px',
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>❓</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                Besoin d'aide ?
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Notre équipe est à votre disposition
              </div>
            </div>
          </div>
          <button
            style={{
              padding: '8px 20px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
          >
            Contacter le support
          </button>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 0',
    }}>
      <span style={{ fontSize: '14px' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{label}</div>
        <div style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
}