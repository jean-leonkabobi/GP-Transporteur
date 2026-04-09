import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHasRole } from '../hooks/useAuth';

// ============================================================
// TYPES
// ============================================================
type StatutRDV = 'En attente' | 'Confirmé' | 'Refusé' | 'Annulé' | 'Terminé';

interface RendezVous {
  id: string;
  commandeId: string;
  date: string;        // 'YYYY-MM-DD'
  heure: string;       // 'HH:MM'
  lieu: string;
  notes: string;
  statut: StatutRDV;
  client: string;
  clientTel: string;
  transporteur: string;
  transporteurTel: string;
  destination: string;
  type: string;
}

interface NouveauRDVForm {
  commandeId: string;
  date: string;
  heure: string;
  lieu: string;
  notes: string;
}

type FormErrors = Partial<Record<keyof NouveauRDVForm, string>>;

// ============================================================
// MOCK DONNÉES
// ============================================================
const MOCK_RDV: RendezVous[] = [
  {
    id: 'RDV-001', commandeId: 'CMD-001',
    date: '2026-04-10', heure: '09:00',
    lieu: '12 Rue Carnot, Dakar',
    notes: 'Sonner à l\'interphone, 2ème étage',
    statut: 'Confirmé',
    client: 'Amadou Diallo', clientTel: '+221 77 000 00 01',
    transporteur: 'Ndiaye Express', transporteurTel: '+221 77 111 22 33',
    destination: 'Thiès', type: 'Colis standard',
  },
  {
    id: 'RDV-002', commandeId: 'CMD-003',
    date: '2026-04-14', heure: '14:00',
    lieu: 'Marché Sandaga, Dakar',
    notes: 'Entrée côté ouest, stand B12',
    statut: 'En attente',
    client: 'Amadou Diallo', clientTel: '+221 77 000 00 01',
    transporteur: '—', transporteurTel: '—',
    destination: 'Ziguinchor', type: 'Produits alimentaires',
  },
  {
    id: 'RDV-003', commandeId: 'CMD-004',
    date: '2026-04-09', heure: '10:30',
    lieu: 'Gare routière de Thiès',
    notes: '',
    statut: 'En attente',
    client: 'Mariama Sow', clientTel: '+221 77 999 88 77',
    transporteur: 'Ndiaye Express', transporteurTel: '+221 77 111 22 33',
    destination: 'Dakar', type: 'Textile / Vêtements',
  },
  {
    id: 'RDV-004', commandeId: 'CMD-002',
    date: '2026-04-06', heure: '08:00',
    lieu: 'Entrepôt Zone Industrielle, Dakar',
    notes: 'Matériel fragile, manipulation avec soin',
    statut: 'Terminé',
    client: 'Amadou Diallo', clientTel: '+221 77 000 00 01',
    transporteur: 'Sénégal Transport Co.', transporteurTel: '+221 77 222 33 44',
    destination: 'Saint-Louis', type: 'Marchandises fragiles',
  },
  {
    id: 'RDV-005', commandeId: 'CMD-006',
    date: '2026-04-11', heure: '16:00',
    lieu: '45 Avenue Cheikh Anta Diop, Mbour',
    notes: 'Accès par portail bleu',
    statut: 'Confirmé',
    client: 'Fatou Ndiaye', clientTel: '+221 77 777 66 55',
    transporteur: 'Ndiaye Express', transporteurTel: '+221 77 111 22 33',
    destination: 'Touba', type: 'Électroménager',
  },
];

const MOCK_COMMANDES_SANS_RDV = [
  { id: 'CMD-003', destination: 'Ziguinchor', type: 'Produits alimentaires' },
];

const HEURES_DISPO = [
  '07:00','08:00','09:00','10:00','10:30','11:00',
  '12:00','13:00','14:00','15:00','16:00','17:00','18:00',
];

// ============================================================
// CONFIG STATUTS
// ============================================================
const STATUT_CFG: Record<StatutRDV, { color: string; bg: string; border: string; icon: string }> = {
  'En attente': { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '⏳' },
  'Confirmé':   { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '✅' },
  'Refusé':     { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: '❌' },
  'Annulé':     { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', icon: '🚫' },
  'Terminé':    { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: '🏁' },
};

// ============================================================
// HELPERS CALENDRIER
// ============================================================
const MOIS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const JOURS_FR = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Lundi = 0
}
function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ============================================================
// SOUS-COMPOSANTS
// ============================================================
function StatutBadge({ statut }: { statut: StatutRDV }) {
  const cfg = STATUT_CFG[statut];
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600, color: cfg.color,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      padding: '3px 9px', borderRadius: '20px',
      whiteSpace: 'nowrap', display: 'inline-flex',
      alignItems: 'center', gap: '4px',
    }}>
      <span style={{ fontSize: '10px' }}>{cfg.icon}</span>
      {statut}
    </span>
  );
}

// --- Calendrier mensuel ---
function CalendrierMensuel({
  rdvList,
  onSelectDate,
  selectedDate,
}: {
  rdvList: RendezVous[];
  onSelectDate: (date: string) => void;
  selectedDate: string | null;
}) {
  const today = new Date();
  const [annee, setAnnee] = useState(today.getFullYear());
  const [mois, setMois]   = useState(today.getMonth());

  const nbJours     = getDaysInMonth(annee, mois);
  const premierJour = getFirstDayOfMonth(annee, mois);
  const todayStr    = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const rdvParDate: Record<string, RendezVous[]> = {};
  rdvList.forEach((r) => {
    if (!rdvParDate[r.date]) rdvParDate[r.date] = [];
    rdvParDate[r.date].push(r);
  });

  const prevMois = () => {
    if (mois === 0) { setMois(11); setAnnee((a) => a - 1); }
    else setMois((m) => m - 1);
  };
  const nextMois = () => {
    if (mois === 11) { setMois(0); setAnnee((a) => a + 1); }
    else setMois((m) => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(premierJour).fill(null),
    ...Array.from({ length: nbJours }, (_, i) => i + 1),
  ];
  // Compléter pour avoir des rangées complètes
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: '12px', overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      {/* Navigation */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '14px 18px',
        borderBottom: '1px solid #f1f5f9',
      }}>
        <button onClick={prevMois} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', borderRadius: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
          {MOIS_FR[mois]} {annee}
        </span>
        <button onClick={nextMois} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', borderRadius: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Jours de la semaine */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '8px 12px 4px' }}>
        {JOURS_FR.map((j) => (
          <div key={j} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#94a3b8', padding: '4px 0' }}>
            {j}
          </div>
        ))}
      </div>

      {/* Jours */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 12px 12px', gap: '2px' }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`}/>;
          const dateStr   = toDateStr(annee, mois, day);
          const rdvsJour  = rdvParDate[dateStr] ?? [];
          const isToday   = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const hasRDV    = rdvsJour.length > 0;

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              style={{
                padding: '6px 4px', textAlign: 'center',
                borderRadius: '8px', cursor: 'pointer',
                background: isSelected ? '#2563eb' : isToday ? '#eff6ff' : 'transparent',
                border: isToday && !isSelected ? '1.5px solid #bfdbfe' : '1.5px solid transparent',
                transition: 'all 0.1s',
                position: 'relative',
              }}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = isToday ? '#eff6ff' : 'transparent'; }}
            >
              <span style={{
                fontSize: '13px', fontWeight: isToday || isSelected ? 700 : 400,
                color: isSelected ? '#fff' : isToday ? '#2563eb' : '#374151',
                display: 'block',
              }}>
                {day}
              </span>
              {hasRDV && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '3px' }}>
                  {rdvsJour.slice(0, 3).map((r) => (
                    <div key={r.id} style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: isSelected ? 'rgba(255,255,255,0.8)' : STATUT_CFG[r.statut].color,
                    }}/>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div style={{
        padding: '10px 16px', borderTop: '1px solid #f1f5f9',
        display: 'flex', flexWrap: 'wrap', gap: '10px',
      }}>
        {(Object.keys(STATUT_CFG) as StatutRDV[]).map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: STATUT_CFG[s].color }}/>
            <span style={{ fontSize: '10px', color: '#64748b' }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Carte RDV ---
function RDVCard({
  rdv, isTransporteur, onConfirmer, onRefuser, onAnnuler,
}: {
  rdv: RendezVous;
  isTransporteur: boolean;
  onConfirmer: (id: string) => void;
  onRefuser:   (id: string) => void;
  onAnnuler:   (id: string) => void;
}) {
  const cfg = STATUT_CFG[rdv.statut];
  const dateObj = new Date(rdv.date + 'T' + rdv.heure);
  const dateFormatee = dateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{
      background: '#fff', border: `1px solid ${cfg.border}`,
      borderLeft: `4px solid ${cfg.color}`,
      borderRadius: '10px', padding: '16px 18px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>{rdv.id}</span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>→</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{rdv.commandeId}</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
            {rdv.destination} — {rdv.type}
          </div>
        </div>
        <StatutBadge statut={rdv.statut} />
      </div>

      {/* Infos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <InfoItem icon="📅" label="Date" value={dateFormatee} />
        <InfoItem icon="⏰" label="Heure" value={rdv.heure} />
        <InfoItem icon="📍" label="Lieu" value={rdv.lieu} />
        <InfoItem
          icon="👤"
          label={isTransporteur ? 'Client' : 'Transporteur'}
          value={isTransporteur ? `${rdv.client} · ${rdv.clientTel}` : `${rdv.transporteur} · ${rdv.transporteurTel}`}
        />
      </div>

      {rdv.notes && (
        <div style={{
          background: '#f8fafc', borderRadius: '8px',
          padding: '9px 12px', marginBottom: '12px',
          fontSize: '12px', color: '#475569', lineHeight: 1.5,
        }}>
          📝 {rdv.notes}
        </div>
      )}

      {/* Actions transporteur */}
      {isTransporteur && rdv.statut === 'En attente' && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onConfirmer(rdv.id)}
            style={{
              flex: 1, padding: '8px',
              background: '#f0fdf4', color: '#16a34a',
              border: '1.5px solid #bbf7d0', borderRadius: '8px',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#dcfce7')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f0fdf4')}
          >
            ✅ Confirmer
          </button>
          <button
            onClick={() => onRefuser(rdv.id)}
            style={{
              flex: 1, padding: '8px',
              background: '#fef2f2', color: '#dc2626',
              border: '1.5px solid #fecaca', borderRadius: '8px',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fef2f2')}
          >
            ❌ Refuser
          </button>
        </div>
      )}

      {/* Annuler client */}
      {!isTransporteur && ['En attente', 'Confirmé'].includes(rdv.statut) && (
        <button
          onClick={() => onAnnuler(rdv.id)}
          style={{
            width: '100%', padding: '8px',
            background: '#fff', color: '#64748b',
            border: '1.5px solid #e2e8f0', borderRadius: '8px',
            fontSize: '12px', fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#374151'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
        >
          Annuler le rendez-vous
        </button>
      )}
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
      <span style={{ fontSize: '13px', marginTop: '1px' }}>{icon}</span>
      <div>
        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#374151', fontWeight: 500, lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  );
}

// --- Modal nouveau RDV ---
function ModalNouveauRDV({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (form: NouveauRDVForm) => void;
}) {
  const [form, setForm] = useState<NouveauRDVForm>({
    commandeId: '', date: '', heure: '', lieu: '', notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const set = (f: keyof NouveauRDVForm) => (v: string) => {
    setForm((p) => ({ ...p, [f]: v }));
    setErrors((e) => ({ ...e, [f]: undefined }));
  };

  const validate = () => {
    const e: FormErrors = {};
    if (!form.commandeId) e.commandeId = 'Sélectionnez une commande.';
    if (!form.date)       e.date       = 'La date est requise.';
    if (!form.heure)      e.heure      = "L'heure est requise.";
    if (!form.lieu.trim()) e.lieu      = 'Le lieu est requis.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onSubmit(form);
  };

  const labelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 500, color: '#374151' };
  const inp = (err?: string): React.CSSProperties => ({
    padding: '9px 12px', border: `1.5px solid ${err ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: '8px', fontSize: '13px', color: '#111827',
    outline: 'none', width: '100%', boxSizing: 'border-box',
    transition: 'border-color 0.15s', background: '#fff',
  });

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '16px',
          width: '100%', maxWidth: '480px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          animation: 'popIn 0.2s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
            📅 Nouveau rendez-vous
          </h2>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '7px', padding: '7px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Commande */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={labelStyle}>Commande <span style={{ color: '#ef4444' }}>*</span></label>
            <select
              value={form.commandeId}
              onChange={(e) => set('commandeId')(e.target.value)}
              style={{ ...inp(errors.commandeId), color: form.commandeId ? '#111827' : '#9ca3af' }}
              onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
              onBlur={(e)  => (e.target.style.borderColor = errors.commandeId ? '#ef4444' : '#e5e7eb')}
            >
              <option value="">Sélectionner une commande...</option>
              {MOCK_COMMANDES_SANS_RDV.map((c) => (
                <option key={c.id} value={c.id}>{c.id} — {c.destination} ({c.type})</option>
              ))}
            </select>
            {errors.commandeId && <span style={{ fontSize: '11.5px', color: '#ef4444' }}>{errors.commandeId}</span>}
          </div>

          {/* Date + Heure */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={labelStyle}>Date <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={form.date}
                onChange={(e) => set('date')(e.target.value)}
                style={inp(errors.date)}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e)  => (e.target.style.borderColor = errors.date ? '#ef4444' : '#e5e7eb')}
              />
              {errors.date && <span style={{ fontSize: '11.5px', color: '#ef4444' }}>{errors.date}</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={labelStyle}>Heure <span style={{ color: '#ef4444' }}>*</span></label>
              <select
                value={form.heure}
                onChange={(e) => set('heure')(e.target.value)}
                style={{ ...inp(errors.heure), color: form.heure ? '#111827' : '#9ca3af' }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e)  => (e.target.style.borderColor = errors.heure ? '#ef4444' : '#e5e7eb')}
              >
                <option value="">Choisir...</option>
                {HEURES_DISPO.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              {errors.heure && <span style={{ fontSize: '11.5px', color: '#ef4444' }}>{errors.heure}</span>}
            </div>
          </div>

          {/* Lieu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={labelStyle}>Lieu de rendez-vous <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              placeholder="Ex : 12 Rue Carnot, Dakar"
              value={form.lieu}
              onChange={(e) => set('lieu')(e.target.value)}
              style={inp(errors.lieu)}
              onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
              onBlur={(e)  => (e.target.style.borderColor = errors.lieu ? '#ef4444' : '#e5e7eb')}
            />
            {errors.lieu && <span style={{ fontSize: '11.5px', color: '#ef4444' }}>{errors.lieu}</span>}
          </div>

          {/* Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={labelStyle}>Notes / Instructions</label>
            <textarea
              rows={3}
              placeholder="Code d'accès, précisions sur le lieu..."
              value={form.notes}
              onChange={(e) => set('notes')(e.target.value)}
              style={{ ...inp(), resize: 'vertical', lineHeight: 1.5 }}
              onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
              onBlur={(e)  => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid #f1f5f9',
          display: 'flex', gap: '10px',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '10px',
              background: '#fff', color: '#374151',
              border: '1.5px solid #e2e8f0', borderRadius: '8px',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 2, padding: '10px',
              background: loading ? '#93c5fd' : '#2563eb',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
            }}
          >
            {loading ? (
              <>
                <div style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}/>
                Création...
              </>
            ) : 'Créer le rendez-vous'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function RendezVousPage() {
  const navigate = useNavigate();
  const isTransporteur = useHasRole('transporteur');

  const [rdvList, setRdvList] = useState<RendezVous[]>(MOCK_RDV);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filtreStatut, setFiltreStatut] = useState<StatutRDV | 'Tous'>('Tous');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]   = useState<string | null>(null);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Filtrage
  const rdvFiltres = rdvList.filter((r) => {
    const matchDate   = !selectedDate || r.date === selectedDate;
    const matchStatut = filtreStatut === 'Tous' || r.statut === filtreStatut;
    return matchDate && matchStatut;
  });

  // Stats rapides
  const enAttente = rdvList.filter((r) => r.statut === 'En attente').length;
  const confirmes = rdvList.filter((r) => r.statut === 'Confirmé').length;
  const total     = rdvList.length;

  // Actions
  const handleConfirmer = (id: string) => {
    setRdvList((prev) => prev.map((r) => r.id === id ? { ...r, statut: 'Confirmé' as StatutRDV } : r));
    showToastMsg('Rendez-vous confirmé.');
  };
  const handleRefuser = (id: string) => {
    setRdvList((prev) => prev.map((r) => r.id === id ? { ...r, statut: 'Refusé' as StatutRDV } : r));
    showToastMsg('Rendez-vous refusé.');
  };
  const handleAnnuler = (id: string) => {
    setRdvList((prev) => prev.map((r) => r.id === id ? { ...r, statut: 'Annulé' as StatutRDV } : r));
    showToastMsg('Rendez-vous annulé.');
  };

  const handleNouveauRDV = (form: NouveauRDVForm) => {
    const nouveau: RendezVous = {
      id: `RDV-00${rdvList.length + 1}`,
      commandeId: form.commandeId,
      date: form.date, heure: form.heure,
      lieu: form.lieu, notes: form.notes,
      statut: 'En attente',
      client: 'Amadou Diallo', clientTel: '+221 77 000 00 01',
      transporteur: '—', transporteurTel: '—',
      destination: 'Ziguinchor', type: 'Produits alimentaires',
    };
    setRdvList((prev) => [nouveau, ...prev]);
    setShowModal(false);
    showToastMsg('Rendez-vous créé avec succès !');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ====== HEADER ====== */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        padding: '14px 32px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, padding: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Accueil
          </button>
          <span style={{ color: '#e2e8f0' }}>|</span>
          <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
            {isTransporteur ? 'Demandes de rendez-vous' : 'Mes rendez-vous'}
          </h1>
        </div>
        {!isTransporteur && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '9px 18px', background: '#2563eb', color: '#fff',
              border: 'none', borderRadius: '9px', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '7px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouveau rendez-vous
          </button>
        )}
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total', value: total, color: '#374151', bg: '#f1f5f9' },
            { label: 'En attente', value: enAttente, color: '#d97706', bg: '#fffbeb' },
            { label: 'Confirmés', value: confirmes, color: '#16a34a', bg: '#f0fdf4' },
          ].map((s) => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '14px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Grille calendrier + liste */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' }}>

          {/* Calendrier */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <CalendrierMensuel
              rdvList={rdvList}
              selectedDate={selectedDate}
              onSelectDate={(d) => setSelectedDate(d === selectedDate ? null : d)}
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                style={{
                  marginTop: '8px', width: '100%', padding: '8px',
                  background: '#f1f5f9', color: '#64748b',
                  border: 'none', borderRadius: '8px',
                  fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                }}
              >
                Effacer le filtre de date
              </button>
            )}
          </div>

          {/* Liste */}
          <div>
            {/* Filtre statut */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {(['Tous', 'En attente', 'Confirmé', 'Refusé', 'Annulé', 'Terminé'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFiltreStatut(s)}
                  style={{
                    padding: '5px 12px',
                    background: filtreStatut === s ? '#2563eb' : '#fff',
                    color: filtreStatut === s ? '#fff' : '#374151',
                    border: `1px solid ${filtreStatut === s ? '#2563eb' : '#e2e8f0'}`,
                    borderRadius: '20px', fontSize: '12px',
                    fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Titre section */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                {selectedDate
                  ? `${rdvFiltres.length} rendez-vous le ${new Date(selectedDate + 'T12:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
                  : `${rdvFiltres.length} rendez-vous au total`}
              </p>
            </div>

            {/* Cards */}
            {rdvFiltres.length === 0 ? (
              <div style={{
                background: '#fff', border: '1px dashed #e2e8f0',
                borderRadius: '12px', padding: '48px 24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Aucun rendez-vous
                </p>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                  {selectedDate ? 'Aucun rendez-vous ce jour.' : 'Aucun rendez-vous dans cette catégorie.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rdvFiltres
                  .sort((a, b) => a.date.localeCompare(b.date) || a.heure.localeCompare(b.heure))
                  .map((rdv) => (
                    <RDVCard
                      key={rdv.id}
                      rdv={rdv}
                      isTransporteur={isTransporteur}
                      onConfirmer={handleConfirmer}
                      onRefuser={handleRefuser}
                      onAnnuler={handleAnnuler}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <ModalNouveauRDV
          onClose={() => setShowModal(false)}
          onSubmit={handleNouveauRDV}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%',
          transform: 'translateX(-50%)',
          background: '#111827', color: '#fff',
          padding: '12px 20px', borderRadius: '10px',
          fontSize: '13px', fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          animation: 'fadeUp 0.3s ease', zIndex: 300,
          whiteSpace: 'nowrap',
        }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes popIn  { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
    </div>
  );
}