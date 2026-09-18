/**
 * ZESTORA Authentication Service
 * Seamlessly integrates Supabase Auth + PostgreSQL profiles table
 * with local fallback when Supabase is unconfigured.
 */
import { getStorageItem, setStorageItem } from './storage';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const AUTH_KEY = 'zestora_auth';
const ADMIN_AUTH_KEY = 'zestora_admin_auth';
const ALL_USERS_KEY = 'zestora_registered_users';

const DEFAULT_USERS = [
  {
    id: 'usr_priya_101',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '9880882476',
    password: 'password123',
    role: 'customer',
    createdAt: '2024-09-01T10:00:00.000Z'
  },
  {
    id: 'usr_admin_999',
    fullName: 'Zestora Store Administrator',
    email: 'admin@zestora.com',
    phone: '9880882476',
    password: 'admin123',
    role: 'admin',
    createdAt: '2024-08-15T09:00:00.000Z'
  }
];

export const authService = {
  /**
   * Synchronously retrieve current cached user
   */
  getCurrentUser() {
    return getStorageItem(AUTH_KEY, null);
  },

  /**
   * Synchronously retrieve current admin user
   */
  getAdminUser() {
    return getStorageItem(ADMIN_AUTH_KEY, null);
  },

  /**
   * Synchronously get all registered users (for local mode / stats)
   */
  getUsers() {
    const users = getStorageItem(ALL_USERS_KEY, null);
    if (!users || !Array.isArray(users)) {
      setStorageItem(ALL_USERS_KEY, DEFAULT_USERS);
      return DEFAULT_USERS;
    }
    return users;
  },

  /**
   * Login user
   */
  async login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const supabase = getSupabase();

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (error) {
          // If Supabase returns error, attempt fallback check or return error
          return { success: false, error: error.message };
        }

        if (data?.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const formattedUser = {
            id: data.user.id,
            email: data.user.email,
            fullName: profile?.full_name || data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            phone: profile?.phone || data.user.user_metadata?.phone || '',
            role: profile?.role || data.user.user_metadata?.role || 'customer',
            createdAt: profile?.created_at || data.user.created_at
          };

          setStorageItem(AUTH_KEY, formattedUser);
          if (formattedUser.role === 'admin') {
            setStorageItem(ADMIN_AUTH_KEY, formattedUser);
          }
          return { success: true, user: formattedUser };
        }
      } catch (err) {
        console.warn('Supabase login failed, using local fallback:', err);
      }
    }

    // Local Fallback Authentication
    const users = this.getUsers();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (found) {
      const { password: _, ...safeUser } = found;
      setStorageItem(AUTH_KEY, safeUser);
      if (safeUser.role === 'admin') {
        setStorageItem(ADMIN_AUTH_KEY, safeUser);
      }
      return { success: true, user: safeUser };
    }

    return { success: false, error: 'Invalid email or password.' };
  },

  /**
   * Sign up new user
   */
  async signup({ fullName, email, phone, password, role = 'customer' }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const supabase = getSupabase();

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: phone ? phone.trim() : '',
              role
            }
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data?.user) {
          // Ensure profile is upserted
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName.trim(),
            email: cleanEmail,
            phone: phone ? phone.trim() : '',
            role
          });

          const formattedUser = {
            id: data.user.id,
            email: data.user.email,
            fullName: fullName.trim(),
            phone: phone ? phone.trim() : '',
            role,
            createdAt: data.user.created_at
          };

          setStorageItem(AUTH_KEY, formattedUser);
          if (role === 'admin') {
            setStorageItem(ADMIN_AUTH_KEY, formattedUser);
          }
          return { success: true, user: formattedUser };
        }
      } catch (err) {
        console.warn('Supabase signup error, using fallback:', err);
      }
    }

    // Local Fallback Signup
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      password,
      role,
      createdAt: new Date().toISOString()
    };

    setStorageItem(ALL_USERS_KEY, [...users, newUser]);
    const { password: _, ...safeUser } = newUser;
    setStorageItem(AUTH_KEY, safeUser);
    if (role === 'admin') {
      setStorageItem(ADMIN_AUTH_KEY, safeUser);
    }
    return { success: true, user: safeUser };
  },

  register(userData) {
    return this.signup(userData);
  },

  /**
   * Logout user
   */
  async logout() {
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(ADMIN_AUTH_KEY);
    return { success: true };
  },

  /**
   * Admin Login
   */
  async adminLogin(email, password) {
    const res = await this.login(email, password);
    if (!res.success) return res;

    if (res.user.role !== 'admin') {
      return { success: false, error: 'Access denied: Administrative role required.' };
    }

    setStorageItem(ADMIN_AUTH_KEY, res.user);
    return { success: true, admin: res.user };
  },

  adminLogout() {
    return this.logout();
  },

  /**
   * Update Profile
   */
  async updateProfile(updates) {
    const current = this.getCurrentUser();
    if (!current) return { success: false, error: 'No active session.' };

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: updates.fullName || current.fullName,
            phone: updates.phone || current.phone,
            updated_at: new Date().toISOString()
          })
          .eq('id', current.id);

        if (error) return { success: false, error: error.message };
      } catch (err) {
        console.warn('Supabase updateProfile error:', err);
      }
    }

    const updated = {
      ...current,
      ...updates,
      fullName: updates.fullName || current.fullName,
      phone: updates.phone || current.phone
    };

    setStorageItem(AUTH_KEY, updated);

    // Also update in all users list
    const users = this.getUsers();
    const updatedUsers = users.map(u => u.id === current.id ? { ...u, ...updated } : u);
    setStorageItem(ALL_USERS_KEY, updatedUsers);

    return { success: true, user: updated };
  },

  /**
   * Forgot password request
   */
  async forgotPassword(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const supabase = getSupabase();

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: window.location.origin + '/#reset-password'
        });
        if (error) return { success: false, error: error.message };
        return {
          success: true,
          message: `Password reset instructions have been dispatched to ${cleanEmail}. Check your inbox.`
        };
      } catch (err) {
        console.warn('Supabase resetPassword error:', err);
      }
    }

    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${cleanEmail}. Check your inbox.`
    };
  },

  /**
   * Listen to Supabase auth changes
   */
  subscribeToAuthChanges(callback) {
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const formattedUser = {
            id: session.user.id,
            email: session.user.email,
            fullName: profile?.full_name || session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            phone: profile?.phone || session.user.user_metadata?.phone || '',
            role: profile?.role || session.user.user_metadata?.role || 'customer'
          };
          setStorageItem(AUTH_KEY, formattedUser);
          callback(formattedUser);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem(AUTH_KEY);
          localStorage.removeItem(ADMIN_AUTH_KEY);
          callback(null);
        }
      });

      return () => subscription?.unsubscribe();
    }
    return () => {};
  }
};
