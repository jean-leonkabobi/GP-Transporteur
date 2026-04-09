// components/common/Footer.tsx
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: '#fff',
      borderTop: '1px solid #e2e8f0',
      padding: '32px 24px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '32px',
      }}>
        {/* Logo & description */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: '#2563eb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4l3 5v3h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>GP Transporteurs</span>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
            La plateforme de mise en relation entre clients et transporteurs au Sénégal.
          </p>
        </div>

        {/* Liens rapides */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
            Liens rapides
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/recherche" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>
                Rechercher un transporteur
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/commandes" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>
                Mes commandes
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/rendez-vous" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>
                Rendez-vous
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
            Contact
          </h4>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
            📧 contact@gptransporteurs.sn
          </p>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
            📞 +221 33 123 45 67
          </p>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            📍 Dakar, Sénégal
          </p>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        paddingTop: '24px',
        marginTop: '24px',
        borderTop: '1px solid #f1f5f9',
        fontSize: '11px',
        color: '#94a3b8',
      }}>
        © {currentYear} GP Transporteurs. Tous droits réservés.
      </div>
    </footer>
  );
}