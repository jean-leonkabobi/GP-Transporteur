// utils/formatters.ts

/**
 * Formate un nombre en prix FCFA
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-FR')} FCFA`;
}

/**
 * Formate une date
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'full' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return 'Date invalide';
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    case 'long':
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    case 'full':
      return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    default:
      return d.toLocaleDateString('fr-FR');
  }
}

/**
 * Formate une heure
 */
export function formatTime(time: string): string {
  return time;
}

/**
 * Formate une date et une heure
 */
export function formatDateTime(date: string | Date, time?: string): string {
  const dateStr = formatDate(date, 'short');
  if (time) return `${dateStr} à ${time}`;
  return dateStr;
}

/**
 * Formate un numéro de téléphone
 */
export function formatPhoneNumber(phone: string): string {
  // Nettoie le numéro
  const cleaned = phone.replace(/\s/g, '');
  
  // Format pour les numéros sénégalais (+221 ...)
  if (cleaned.startsWith('+221')) {
    const rest = cleaned.slice(4);
    if (rest.length === 9) {
      return `+221 ${rest.slice(0, 2)} ${rest.slice(2, 4)} ${rest.slice(4, 6)} ${rest.slice(6, 8)} ${rest.slice(8)}`;
    }
  }
  
  // Format simple
  return cleaned.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

/**
 * Formate un poids
 */
export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} t`;
  }
  return `${kg.toLocaleString('fr-FR')} kg`;
}

/**
 * Formate un volume
 */
export function formatVolume(m3: number): string {
  if (m3 >= 1000) {
    return `${(m3 / 1000).toFixed(1)} m³`;
  }
  return `${m3.toLocaleString('fr-FR')} m³`;
}

/**
 * Formate une durée en texte lisible
 */
export function formatDuration(days: number): string {
  if (days === 0) return 'Même jour';
  if (days === 1) return '1 jour';
  return `${days} jours`;
}

/**
 * Formate une note (étoiles)
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Tronque un texte
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitalise la première lettre
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convertit un statut en texte lisible
 */
export function formatStatut(statut: string): string {
  const mapping: Record<string, string> = {
    'EN_ATTENTE': 'En attente',
    'CONFIRMEE': 'Confirmée',
    'EN_COURS': 'En cours',
    'LIVRE': 'Livré',
    'ANNULEE': 'Annulée',
    'CONFIRME': 'Confirmé',
    'REFUSE': 'Refusé',
    'ANNULE': 'Annulé',
    'TERMINE': 'Terminé',
  };
  return mapping[statut] || statut;
}

/**
 * Génère un ID temporaire (pour mock)
 */
export function generateTempId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}