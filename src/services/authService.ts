export interface AdminSession {
  username: string;
  loginTime: string;
  token: string;
}

const AUTH_STORAGE_KEY = 'earthsmile_admin_credentials_v1';
const SESSION_STORAGE_KEY = 'earthsmile_admin_session_v1';

// Default initial admin credentials
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'earthsmile@admin2026',
};

export const authService = {
  getCredentials(): { username: string; passwordHash: string } {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return {
      username: DEFAULT_ADMIN.username,
      passwordHash: DEFAULT_ADMIN.password,
    };
  },

  login(usernameInput: string, passwordInput: string): { success: boolean; error?: string } {
    const creds = this.getCredentials();
    const cleanUser = usernameInput.trim().toLowerCase();

    // Check username (accepts 'admin' or 'admin@earthsmile.in')
    const validUsernames = [creds.username.toLowerCase(), 'admin@earthsmile.in'];
    if (!validUsernames.includes(cleanUser)) {
      return { success: false, error: 'Invalid administrator username or email.' };
    }

    // Check password
    if (passwordInput !== creds.passwordHash) {
      return { success: false, error: 'Incorrect administrator password. Please try again.' };
    }

    // Create session
    const session: AdminSession = {
      username: creds.username,
      loginTime: new Date().toISOString(),
      token: `es_admin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      // Also store in localStorage with expiration hint so tab refresh works reliably
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }

    return { success: true };
  },

  logout(): void {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  isAuthenticated(): boolean {
    try {
      const sess = sessionStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(SESSION_STORAGE_KEY);
      if (!sess) return false;
      const parsed = JSON.parse(sess);
      return !!parsed.token;
    } catch {
      return false;
    }
  },

  getSession(): AdminSession | null {
    try {
      const sess = sessionStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(SESSION_STORAGE_KEY);
      if (!sess) return null;
      return JSON.parse(sess);
    } catch {
      return null;
    }
  },

  changePassword(currentPass: string, newPass: string): { success: boolean; error?: string } {
    const creds = this.getCredentials();
    if (currentPass !== creds.passwordHash) {
      return { success: false, error: 'Current password is incorrect.' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    const updated = {
      username: creds.username,
      passwordHash: newPass,
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to update credentials in storage.' };
    }
  },

  resetCredentials(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
};
