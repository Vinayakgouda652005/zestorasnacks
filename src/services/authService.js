/**
 * ZESTORA Authentication Service (Local / Prototype Layer)
 * Ready for future backend/OAuth/Firebase integration.
 */
import { getStorageItem, setStorageItem, removeStorageItem } from './storage';

const USERS_KEY = 'zestora_users';
const AUTH_KEY = 'zestora_auth';
const ADMIN_AUTH_KEY = 'zestora_admin_auth';

// Initial demo users
const DEFAULT_USERS = [
  {
    id: 'admin_zestora_01',
    fullName: 'Zestora Store Administrator',
    email: 'admin@zestora.com',
    phone: '9880882476',
    password: 'admin123',
    role: 'admin',
    createdAt: '2024-08-01T10:00:00.000Z'
  },
  {
    id: 'usr_priya_101',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '9880882476',
    password: 'password123',
    role: 'customer',
    createdAt: '2024-08-15T10:00:00.000Z'
  }
];

export const authService = {
  getUsers() {
    const users = getStorageItem(USERS_KEY, null);
    if (!users || !Array.isArray(users) || users.length === 0) {
      setStorageItem(USERS_KEY, DEFAULT_USERS);
      return DEFAULT_USERS;
    }

    // Ensure default admin user exists
    const hasAdmin = users.some(u => u.email?.toLowerCase() === 'admin@zestora.com');
    if (!hasAdmin) {
      const updated = [DEFAULT_USERS[0], ...users];
      setStorageItem(USERS_KEY, updated);
      return updated;
    }

    return users;
  },

  getCurrentUser() {
    return getStorageItem(AUTH_KEY, null);
  },

  login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = this.getUsers();
    let user = users.find(u => u.email?.toLowerCase() === cleanEmail);

    // Fallback check for built-in admin credentials
    if (!user && (cleanEmail === 'admin@zestora.com' || cleanEmail === 'admin') && password === 'admin123') {
      user = DEFAULT_USERS[0];
      setStorageItem(USERS_KEY, [user, ...users]);
    }

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }
    if (user.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    const sessionUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role || 'customer'
    };

    setStorageItem(AUTH_KEY, sessionUser);
    return { success: true, user: sessionUser };
  },

  signup({ fullName, email, phone, password, role = 'customer' }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const rawPhone = (phone || '').trim().replace(/\D/g, '');
    const cleanPhone = rawPhone.length >= 10 ? rawPhone : (role === 'admin' ? '9880882476' : rawPhone);
    const users = this.getUsers();

    if (users.some(u => u.email?.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    if (!fullName || fullName.trim().length < 2) {
      return { success: false, error: 'Please enter a valid full name.' };
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    if (cleanPhone.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit phone number.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must contain at least 6 characters.' };
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: password,
      role: role || 'customer',
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setStorageItem(USERS_KEY, updatedUsers);

    const sessionUser = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role
    };

    setStorageItem(AUTH_KEY, sessionUser);
    return { success: true, user: sessionUser };
  },

  register(userData) {
    return this.signup(userData);
  },

  logout() {
    removeStorageItem(AUTH_KEY);
    return { success: true };
  },

  updateProfile(updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, error: 'Not authenticated' };

    const users = this.getUsers();
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          fullName: updates.fullName !== undefined ? updates.fullName.trim() : u.fullName,
          phone: updates.phone !== undefined ? updates.phone.trim() : u.phone
        };
      }
      return u;
    });

    setStorageItem(USERS_KEY, updatedUsers);

    const updatedSession = {
      ...currentUser,
      fullName: updates.fullName !== undefined ? updates.fullName.trim() : currentUser.fullName,
      phone: updates.phone !== undefined ? updates.phone.trim() : currentUser.phone
    };
    setStorageItem(AUTH_KEY, updatedSession);

    return { success: true, user: updatedSession };
  },

  forgotPassword(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = this.getUsers();
    const user = users.find(u => u.email?.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'No account registered under this email address.' };
    }
    // Simulation: Password reset link
    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${cleanEmail}. (Demo reset: you can log in with password: "${user.password}")`
    };
  },

  // ADMIN AUTHENTICATION
  getAdminUser() {
    return getStorageItem(ADMIN_AUTH_KEY, null);
  },

  adminLogin(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    // Default admin credentials
    if (
      (cleanEmail === 'admin@zestora.com' && password === 'admin123') ||
      (cleanEmail === 'admin' && password === 'admin123')
    ) {
      const adminSession = {
        id: 'admin_zestora_01',
        name: 'Zestora Operations Admin',
        email: 'admin@zestora.com',
        role: 'admin'
      };
      setStorageItem(ADMIN_AUTH_KEY, adminSession);
      return { success: true, admin: adminSession };
    }
    return { success: false, error: 'Invalid admin credentials. Use admin@zestora.com / admin123' };
  },

  adminLogout() {
    removeStorageItem(ADMIN_AUTH_KEY);
    return { success: true };
  }
};
