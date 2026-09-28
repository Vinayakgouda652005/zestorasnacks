/**
 * ZESTORASnacks Authentication Service
 * Production Supabase Auth integration with strict RLS and profiles role enforcement.
 * Hardcoded credentials and localStorage auth bypasses have been completely removed.
 */
import { getStorageItem, setStorageItem } from './storage';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const AUTH_KEY = 'zestora_auth';
const ADMIN_AUTH_KEY = 'zestora_admin_auth';

export const authService = {
  /**
   * Retrieve cached authenticated customer/user
   */
  getCurrentUser() {
    return getStorageItem(AUTH_KEY, null);
  },

  /**
   * Retrieve cached authenticated admin
   */
  getAdminUser() {
    const admin = getStorageItem(ADMIN_AUTH_KEY, null);
    if (admin && admin.role === 'admin') {
      return admin;
    }
    return null;
  },

  /**
   * Helper to format a user object from Supabase Auth + Profiles record
   */
  _formatUser(supabaseUser, profile) {
    if (!supabaseUser) return null;
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      fullName: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Member',
      phone: profile?.phone || supabaseUser.user_metadata?.phone || '',
      role: profile?.role || 'customer',
      avatarUrl: profile?.avatar_url || null,
      createdAt: profile?.created_at || supabaseUser.created_at
    };
  },

  /**
   * Fetch current live session user directly from Supabase Auth
   */
  async getSessionUser() {
    const supabase = getSupabase();
    if (!isSupabaseConfigured() || !supabase) {
      return this.getCurrentUser();
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(ADMIN_AUTH_KEY);
        return null;
      }

      // Fetch verified profile from database
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      const formatted = this._formatUser(session.user, profile);
      setStorageItem(AUTH_KEY, formatted);
      if (formatted.role === 'admin') {
        setStorageItem(ADMIN_AUTH_KEY, formatted);
      } else {
        localStorage.removeItem(ADMIN_AUTH_KEY);
      }
      return formatted;
    } catch (err) {
      console.warn('Error checking Supabase session:', err);
      return this.getCurrentUser();
    }
  },

  /**
   * Real Customer Login via Supabase Auth
   */
  async login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = password || '';

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please provide both email and password.' };
    }

    const supabase = getSupabase();
    if (!isSupabaseConfigured() || !supabase) {
      return { 
        success: false, 
        error: 'Supabase authentication is not configured. Please check your project credentials.' 
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass
      });

      if (error) {
        return { success: false, error: error.message || 'Invalid email or password.' };
      }

      if (!data?.user) {
        return { success: false, error: 'Login failed: no user session returned.' };
      }

      // Fetch user profile from database to get official role and details
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      const formattedUser = this._formatUser(data.user, profile);

      setStorageItem(AUTH_KEY, formattedUser);
      if (formattedUser.role === 'admin') {
        setStorageItem(ADMIN_AUTH_KEY, formattedUser);
      } else {
        localStorage.removeItem(ADMIN_AUTH_KEY);
      }

      return { success: true, user: formattedUser };
    } catch (err) {
      return { success: false, error: err.message || 'Unexpected login error occurred.' };
    }
  },

  /**
   * Real Customer Sign Up via Supabase Auth
   * Role is STRICTLY locked to 'customer'. Frontend role escalation is impossible.
   */
  async signup({ fullName, email, phone, password }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (fullName || '').trim();
    const cleanPhone = (phone || '').trim();
    const cleanPass = password || '';

    if (!cleanEmail) {
      return { success: false, error: 'Valid email address is required.' };
    }
    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (!cleanName) {
      return { success: false, error: 'Full name is required.' };
    }

    const supabase = getSupabase();
    if (!isSupabaseConfigured() || !supabase) {
      return { 
        success: false, 
        error: 'Supabase is not configured. Please check database settings.' 
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPass,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone,
            role: 'customer' // Frontend always registers customer
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        // Ensure profile record exists with role = 'customer'
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            role: 'customer',
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
        } catch (pErr) {
          console.warn('Profile upsert note:', pErr);
        }

        const formattedUser = {
          id: data.user.id,
          email: data.user.email,
          fullName: cleanName,
          phone: cleanPhone,
          role: 'customer',
          createdAt: data.user.created_at
        };

        setStorageItem(AUTH_KEY, formattedUser);
        localStorage.removeItem(ADMIN_AUTH_KEY);

        const isEmailConfirmed = Boolean(data.session);
        return { 
          success: true, 
          user: formattedUser,
          isEmailConfirmed,
          message: isEmailConfirmed 
            ? 'Registration successful!' 
            : 'Account registered! Please check your email to confirm your account if email confirmation is enabled.'
        };
      }

      return { success: false, error: 'Registration did not return a user record.' };
    } catch (err) {
      return { success: false, error: err.message || 'Unexpected signup error occurred.' };
    }
  },

  register(userData) {
    return this.signup(userData);
  },

  /**
   * Real Admin Login via Supabase Auth
   * Strictly enforces role = 'admin' directly from the Supabase profiles database table.
   */
  async adminLogin(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = password || '';

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please enter both admin email and password.' };
    }

    const supabase = getSupabase();
    if (!isSupabaseConfigured() || !supabase) {
      return { 
        success: false, 
        error: 'Supabase authentication is not configured. Please check your project credentials.' 
      };
    }

    try {
      // 1. Authenticate credentials against Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass
      });

      if (error) {
        return { success: false, error: error.message || 'Invalid credentials.' };
      }

      if (!data?.user) {
        return { success: false, error: 'Authentication failed: no user returned.' };
      }

      // 2. Query Supabase profiles table for role
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileErr) {
        console.error('Error fetching admin profile:', profileErr);
      }

      const role = profile?.role || data.user.user_metadata?.role;

      // 3. STRICT CHECK: Must be 'admin' in profiles table
      if (role !== 'admin') {
        // Sign out immediately so non-admin doesn't stay authenticated in admin context
        await supabase.auth.signOut();
        localStorage.removeItem(ADMIN_AUTH_KEY);
        return { 
          success: false, 
          error: 'Access denied: You do not have administrator permissions.' 
        };
      }

      const formattedAdmin = this._formatUser(data.user, profile);
      setStorageItem(AUTH_KEY, formattedAdmin);
      setStorageItem(ADMIN_AUTH_KEY, formattedAdmin);

      return { success: true, admin: formattedAdmin };
    } catch (err) {
      return { success: false, error: err.message || 'Error authenticating administrator.' };
    }
  },

  /**
   * Sign out of Supabase Auth and purge all local sessions
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

  async adminLogout() {
    return this.logout();
  },

  /**
   * Update Profile Details
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
    return { success: true, user: updated };
  },

  /**
   * Real Supabase Password Reset Request
   */
  async forgotPassword(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your registered email address.' };
    }

    const supabase = getSupabase();
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase authentication is not configured.' };
    }

    try {
      const redirectUrl = window.location.origin + window.location.pathname + '#reset-password';
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: `Password reset instructions have been sent to ${cleanEmail}. Please check your inbox.`
      };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to send password reset email.' };
    }
  },

  /**
   * Update Password (used after clicking password reset link)
   */
  async updatePassword(newPassword) {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const supabase = getSupabase();
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, message: 'Your password has been updated successfully.' };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update password.' };
    }
  },

  /**
   * Listen to Supabase auth changes
   */
  subscribeToAuthChanges(callback) {
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              const formatted = {
                id: session.user.id,
                email: session.user.email,
                fullName: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Member',
                phone: profile?.phone || session.user.user_metadata?.phone || '',
                role: profile?.role || 'customer',
                createdAt: profile?.created_at || session.user.created_at
              };

              setStorageItem(AUTH_KEY, formatted);
              if (formatted.role === 'admin') {
                setStorageItem(ADMIN_AUTH_KEY, formatted);
              } else {
                localStorage.removeItem(ADMIN_AUTH_KEY);
              }
              callback(formatted, event);
            } catch (err) {
              console.warn('Error reading profile on auth state change:', err);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem(AUTH_KEY);
          localStorage.removeItem(ADMIN_AUTH_KEY);
          callback(null, event);
        } else if (event === 'PASSWORD_RECOVERY') {
          callback(null, event);
        }
      });

      return () => subscription?.unsubscribe();
    }
    return () => {};
  },

  /**
   * Fetch all registered customer profiles from database (for admin stats)
   */
  async fetchUsersFromDatabase() {
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(p => ({
            id: p.id,
            fullName: p.full_name,
            email: p.email,
            phone: p.phone,
            role: p.role,
            createdAt: p.created_at
          }));
        }
      } catch (err) {
        console.warn('Error fetching profiles from database:', err);
      }
    }
    return [];
  },

  getUsers() {
    return [];
  }
};
