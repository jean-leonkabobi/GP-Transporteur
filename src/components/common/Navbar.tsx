// components/common/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useHasRole } from '../../hooks/useAuth';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const isTransporteur = useHasRole('transporteur');
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Gardé pour le responsive

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = isTransporteur
    ? [
        { label: 'Commandes', path: '/commandes' },
        { label: 'Rendez-vous', path: '/rendez-vous' },
        { label: 'Suivi', path: '/suivi' },
        { label: 'Mon compte', path: '/mon-compte' },
      ]
    : [
        { label: 'Rechercher', path: '/recherche' },
        { label: 'Mes commandes', path: '/commandes' },
        { label: 'Rendez-vous', path: '/rendez-vous' },
        { label: 'Mon compte', path: '/mon-compte' },
      ];

   return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <div style={{
          width: '34px',
          height: '34px',
          background: '#2563eb',
          borderRadius: '9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13" rx="2"/>
            <path d="M16 8h4l3 5v3h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
          GP Transporteurs
        </span>
      </Link>

      {/* Bouton menu mobile (visible uniquement sur mobile) */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          display: 'none', // Cache par défaut, à afficher avec media query
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
        }}
        className="mobile-menu-button"
      >
        ☰
      </button>

      {/* Desktop Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '13px',
              color: '#374151',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Menu mobile (affiché quand ouvert) */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '60px',
          left: 0,
          right: 0,
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 99,
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}



      {/* User Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: isTransporteur ? '#fffbeb' : '#eff6ff',
            border: `2px solid ${isTransporteur ? '#fcd34d' : '#93c5fd'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            color: isTransporteur ? '#d97706' : '#2563eb',
          }}>
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              {user?.prenom} {user?.nom}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              {isTransporteur ? 'Transporteur' : 'Client'}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: '1px solid #e2e8f0',
            borderRadius: '7px',
            padding: '5px 11px',
            fontSize: '12px',
            color: '#64748b',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ef4444';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}