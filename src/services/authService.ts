import type {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  AuthResponse,
  User,
} from '../types/auth.types';

// ============================================================
// SIMULATION DU DÉLAI RÉSEAU
// ============================================================
const fakeDelay = (ms = 800) => new Promise((res) => setTimeout(res, ms));

// ============================================================
// BASE DE DONNÉES MOCK (remplacera les vrais appels API)
// ============================================================
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'usr-001',
    email: 'client@demo.com',
    password: 'password123',
    nom: 'Diallo',
    prenom: 'Amadou',
    role: 'client',
    telephone: '+221 77 000 00 01',
    adresse: 'Dakar, Sénégal',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'usr-002',
    email: 'transporteur@demo.com',
    password: 'password123',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    role: 'transporteur',
    telephone: '+221 77 000 00 02',
    adresse: 'Thiès, Sénégal',
    createdAt: '2024-02-10T08:30:00Z',
  },
];

// Stockage en mémoire des utilisateurs inscrits durant la session
let mockUsersDB = [...MOCK_USERS];

// Stockage en mémoire des tokens de réinitialisation
const resetTokens: Record<string, string> = {};

// ============================================================
// HELPERS
// ============================================================

// Génère un token JWT-like factice
const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Date.now(),
      exp: Date.now() + 3600 * 1000, // 1h
    })
  );
  const signature = btoa(`mock-signature-${userId}`);
  return `${header}.${payload}.${signature}`;
};

// Retire le mot de passe avant d'exposer l'utilisateur
const sanitizeUser = (user: (typeof mockUsersDB)[0]): User => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safeUser } = user;
  return safeUser;
};

// ============================================================
// SERVICE
// ============================================================
const authService = {

  // ----------------------------------------------------------
  // LOGIN
  // ----------------------------------------------------------
  async login(payload: LoginPayload): Promise<AuthResponse> {
    await fakeDelay();

    const found = mockUsersDB.find(
      (u) =>
        u.email.toLowerCase() === payload.email.toLowerCase() &&
        u.password === payload.password
    );

    if (!found) {
      throw new Error('Email ou mot de passe incorrect.');
    }

    const token = generateMockToken(found.id);

    return {
      user: sanitizeUser(found),
      token,
      expiresIn: 3600,
    };
  },

  // ----------------------------------------------------------
  // REGISTER
  // ----------------------------------------------------------
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await fakeDelay();

    const emailExists = mockUsersDB.some(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase()
    );

    if (emailExists) {
      throw new Error('Un compte existe déjà avec cet email.');
    }

    if (payload.password !== payload.confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas.');
    }

    if (payload.password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email: payload.email,
      password: payload.password,
      nom: payload.nom,
      prenom: payload.prenom,
      role: payload.role,
      telephone: payload.telephone ?? '',
      adresse: '',
      createdAt: new Date().toISOString(),
    };

    mockUsersDB.push(newUser);

    const token = generateMockToken(newUser.id);

    return {
      user: sanitizeUser(newUser),
      token,
      expiresIn: 3600,
    };
  },

  // ----------------------------------------------------------
  // MOT DE PASSE OUBLIÉ
  // ----------------------------------------------------------
  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    await fakeDelay();

    const found = mockUsersDB.find(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase()
    );

    // On ne révèle pas si l'email existe ou non (sécurité)
    if (found) {
      const resetToken = btoa(`reset-${found.id}-${Date.now()}`);
      resetTokens[resetToken] = found.id;
      // En vrai : envoi d'un email. Ici on log juste en console.
      console.info(`[MOCK] Lien de réinitialisation : /reset-password?token=${resetToken}`);
    }

    return {
      message:
        'Si cet email est associé à un compte, vous recevrez un lien de réinitialisation.',
    };
  },

  // ----------------------------------------------------------
  // RÉINITIALISATION DU MOT DE PASSE
  // ----------------------------------------------------------
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    await fakeDelay();

    const userId = resetTokens[token];

    if (!userId) {
      throw new Error('Lien de réinitialisation invalide ou expiré.');
    }

    const userIndex = mockUsersDB.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new Error('Utilisateur introuvable.');
    }

    mockUsersDB[userIndex].password = newPassword;
    delete resetTokens[token];

    return { message: 'Mot de passe réinitialisé avec succès.' };
  },

  // ----------------------------------------------------------
  // LOGOUT (côté client uniquement pour le mock)
  // ----------------------------------------------------------
  async logout(): Promise<void> {
    await fakeDelay(300);
    // En vrai : appel DELETE /auth/logout pour invalider le token côté serveur
    // Ici : rien à faire côté mock, le nettoyage se fait dans AuthContext
  },

  // ----------------------------------------------------------
  // RÉCUPÉRATION DU PROFIL (via token stocké)
  // ----------------------------------------------------------
  async getMe(token: string): Promise<User> {
    await fakeDelay(400);

    try {
      const payloadBase64 = token.split('.')[1];
      const decoded = JSON.parse(atob(payloadBase64));
      const userId: string = decoded.sub;

      // Vérification expiration
      if (decoded.exp < Date.now()) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      const found = mockUsersDB.find((u) => u.id === userId);

      if (!found) {
        throw new Error('Utilisateur introuvable.');
      }

      return sanitizeUser(found);
    } catch {
      throw new Error('Token invalide. Veuillez vous reconnecter.');
    }
  },
};

export default authService;