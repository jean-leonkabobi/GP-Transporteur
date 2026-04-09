// utils/validators.ts

/**
 * Valide une adresse email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un numéro de téléphone (format sénégalais ou international)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Nettoie le numéro
  const cleaned = phone.replace(/\s/g, '');
  // Formats acceptés: +221XXXXXXXXX, 77XXXXXXX, 78XXXXXXX, 70XXXXXXX, 76XXXXXXX
  const phoneRegex = /^(\+221|0)?[7][0-8][0-9]{7}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Valide un mot de passe (au moins 6 caractères)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Valide que deux mots de passe correspondent
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

/**
 * Valide un poids (positif, non nul)
 */
export function isValidWeight(weight: number): boolean {
  return weight > 0 && weight <= 50000; // max 50 tonnes
}

/**
 * Valide un volume (positif)
 */
export function isValidVolume(volume: number): boolean {
  return volume >= 0 && volume <= 500; // max 500 m³
}

/**
 * Valide une date (non passée)
 */
export function isValidFutureDate(date: string): boolean {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}

/**
 * Valide un créneau horaire
 */
export function isValidTimeSlot(slot: string): boolean {
  const validSlots = [
    '08h00 - 10h00', '10h00 - 12h00', '12h00 - 14h00',
    '14h00 - 16h00', '16h00 - 18h00', '18h00 - 20h00',
  ];
  return validSlots.includes(slot);
}

/**
 * Valide une destination
 */
export function isValidDestination(destination: string): boolean {
  return destination.trim().length >= 2;
}

/**
 * Valide un prix (positif)
 */
export function isValidPrice(price: number): boolean {
  return price >= 0;
}

/**
 * Valide une note (entre 0 et 5)
 */
export function isValidRating(rating: number): boolean {
  return rating >= 0 && rating <= 5;
}

/**
 * Valide un code postal (format sénégalais)
 */
export function isValidPostalCode(code: string): boolean {
  // Code postal sénégalais: 5 chiffres
  const postalRegex = /^\d{5}$/;
  return postalRegex.test(code);
}

/**
 * Valide un nom (lettres, espaces, tirets)
 */
export function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s-]{2,50}$/;
  return nameRegex.test(name.trim());
}

/**
 * Valide une adresse
 */
export function isValidAddress(address: string): boolean {
  return address.trim().length >= 5;
}

/**
 * Valide un type de marchandise
 */
export function isValidTypeMarchandise(type: string): boolean {
  const validTypes = [
    'Colis standard', 'Marchandises fragiles', 'Produits alimentaires',
    'Matériaux de construction', 'Électroménager', 'Textile / Vêtements',
    'Documents', 'Médicaments', 'Animaux vivants', 'Matières dangereuses', 'Autres',
  ];
  return validTypes.includes(type);
}

/**
 * Valide une description (longueur max)
 */
export function isValidDescription(description: string): boolean {
  return description.length <= 500;
}

/**
 * Interface d'erreurs de validation
 */
export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Valide un formulaire de commande
 */
export function validateCommandeForm(data: {
  type: string;
  poids: number;
  volume?: number;
  adresseCollecte: string;
  destination: string;
  dateCollecte: string;
  creneauCollecte: string;
  transporteurId: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};
  
  if (!data.type) errors.type = 'Le type de marchandise est requis';
  else if (!isValidTypeMarchandise(data.type)) errors.type = 'Type de marchandise invalide';
  
  if (!data.poids) errors.poids = 'Le poids est requis';
  else if (!isValidWeight(data.poids)) errors.poids = 'Le poids doit être compris entre 0.1 et 50000 kg';
  
  if (data.volume && !isValidVolume(data.volume)) errors.volume = 'Le volume doit être compris entre 0 et 500 m³';
  
  if (!data.adresseCollecte) errors.adresseCollecte = "L'adresse de collecte est requise";
  else if (!isValidAddress(data.adresseCollecte)) errors.adresseCollecte = 'Adresse invalide';
  
  if (!data.destination) errors.destination = 'La destination est requise';
  else if (!isValidDestination(data.destination)) errors.destination = 'Destination invalide';
  
  if (!data.dateCollecte) errors.dateCollecte = 'La date de collecte est requise';
  else if (!isValidFutureDate(data.dateCollecte)) errors.dateCollecte = 'La date doit être future';
  
  if (!data.creneauCollecte) errors.creneauCollecte = 'Le créneau horaire est requis';
  else if (!isValidTimeSlot(data.creneauCollecte)) errors.creneauCollecte = 'Créneau horaire invalide';
  
  if (!data.transporteurId) errors.transporteurId = 'Veuillez sélectionner un transporteur';
  
  return errors;
}

/**
 * Valide un formulaire d'inscription
 */
export function validateRegisterForm(data: {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;
  confirmPassword: string;
  role: 'client' | 'transporteur';
}): ValidationErrors {
  const errors: ValidationErrors = {};
  
  if (!data.nom) errors.nom = 'Le nom est requis';
  else if (!isValidName(data.nom)) errors.nom = 'Nom invalide (2-50 caractères, lettres uniquement)';
  
  if (!data.prenom) errors.prenom = 'Le prénom est requis';
  else if (!isValidName(data.prenom)) errors.prenom = 'Prénom invalide (2-50 caractères, lettres uniquement)';
  
  if (!data.email) errors.email = "L'email est requis";
  else if (!isValidEmail(data.email)) errors.email = 'Email invalide';
  
  if (data.telephone && !isValidPhoneNumber(data.telephone)) {
    errors.telephone = 'Numéro de téléphone invalide';
  }
  
  if (!data.password) errors.password = 'Le mot de passe est requis';
  else if (!isValidPassword(data.password)) errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
  
  if (!passwordsMatch(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }
  
  return errors;
}

/**
 * Valide un formulaire de rendez-vous
 */
export function validateRendezVousForm(data: {
  commandeId: string;
  date: string;
  heure: string;
  lieu: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};
  
  if (!data.commandeId) errors.commandeId = 'Veuillez sélectionner une commande';
  
  if (!data.date) errors.date = 'La date est requise';
  else if (!isValidFutureDate(data.date)) errors.date = 'La date doit être future';
  
  if (!data.heure) errors.heure = "L'heure est requise";
  
  if (!data.lieu) errors.lieu = 'Le lieu est requis';
  else if (!isValidAddress(data.lieu)) errors.lieu = 'Adresse invalide';
  
  return errors;
}

/**
 * Valide un formulaire de connexion
 */
export function validateLoginForm(data: {
  email: string;
  password: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};
  
  if (!data.email) errors.email = "L'email est requis";
  else if (!isValidEmail(data.email)) errors.email = 'Email invalide';
  
  if (!data.password) errors.password = 'Le mot de passe est requis';
  
  return errors;
}