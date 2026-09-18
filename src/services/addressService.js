/**
 * ZESTORA Address Management Service
 * Integrates Supabase PostgreSQL addresses table with local caching.
 */
import { getStorageItem, setStorageItem } from './storage';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const ADDRESSES_KEY = 'zestora_addresses';

const DEFAULT_ADDRESSES = [
  {
    id: 'addr_demo_1',
    userId: 'usr_priya_101',
    fullName: 'Priya Sharma',
    phone: '9880882476',
    house: 'Flat 402, Sunshine Meadows',
    street: '14th Cross, Indiranagar',
    area: 'Indiranagar Stage 2',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    landmark: 'Opposite BDA Complex',
    isDefault: true
  }
];

export const addressService = {
  getAll() {
    const addresses = getStorageItem(ADDRESSES_KEY, null);
    if (!addresses || !Array.isArray(addresses)) {
      setStorageItem(ADDRESSES_KEY, DEFAULT_ADDRESSES);
      return DEFAULT_ADDRESSES;
    }
    return addresses;
  },

  getUserAddresses(userId) {
    if (!userId) return [];
    const all = this.getAll();
    return all.filter(a => a.userId === userId);
  },

  async fetchUserAddresses(userId) {
    if (!userId) return [];
    const supabase = getSupabase();
    if (!isSupabaseConfigured() || !supabase) {
      return this.getUserAddresses(userId);
    }

    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (!error && data) {
        const formatted = data.map(a => ({
          id: a.id,
          userId: a.user_id,
          fullName: a.full_name,
          phone: a.phone,
          house: a.house,
          street: a.street,
          area: a.area,
          city: a.city,
          state: a.state,
          pincode: a.pincode,
          landmark: a.landmark,
          isDefault: Boolean(a.is_default)
        }));

        const all = this.getAll();
        const others = all.filter(a => a.userId !== userId);
        const nextAll = [...formatted, ...others];
        setStorageItem(ADDRESSES_KEY, nextAll);
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase fetchUserAddresses error:', err);
    }
    return this.getUserAddresses(userId);
  },

  addAddress(userId, addressData) {
    if (!userId) return { success: false, error: 'User must be authenticated' };

    const all = this.getAll();
    const userAddrs = all.filter(a => a.userId === userId);
    const isFirst = userAddrs.length === 0;

    const newAddress = {
      id: `addr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId,
      fullName: addressData.fullName || '',
      phone: addressData.phone || '',
      house: addressData.house || '',
      street: addressData.street || '',
      area: addressData.area || '',
      city: addressData.city || '',
      state: addressData.state || 'Karnataka',
      pincode: addressData.pincode || '',
      landmark: addressData.landmark || '',
      isDefault: addressData.isDefault || isFirst
    };

    let updated = all;
    if (newAddress.isDefault) {
      updated = updated.map(a => a.userId === userId ? { ...a, isDefault: false } : a);
    }
    updated = [...updated, newAddress];
    setStorageItem(ADDRESSES_KEY, updated);

    // Sync to Supabase
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          if (newAddress.isDefault) {
            await supabase
              .from('addresses')
              .update({ is_default: false })
              .eq('user_id', userId);
          }

          await supabase.from('addresses').insert({
            user_id: userId,
            full_name: newAddress.fullName,
            phone: newAddress.phone,
            house: newAddress.house,
            street: newAddress.street,
            area: newAddress.area,
            city: newAddress.city,
            state: newAddress.state,
            pincode: newAddress.pincode,
            landmark: newAddress.landmark,
            is_default: newAddress.isDefault
          });
        } catch (err) {
          console.warn('Supabase addAddress error:', err);
        }
      })();
    }

    return { success: true, address: newAddress };
  },

  updateAddress(userId, addressId, addressData) {
    const all = this.getAll();
    let updated = all.map(a => {
      if (a.id === addressId && a.userId === userId) {
        return {
          ...a,
          ...addressData,
          id: a.id,
          userId: a.userId
        };
      }
      return a;
    });

    if (addressData.isDefault) {
      updated = updated.map(a => (a.userId === userId && a.id !== addressId) ? { ...a, isDefault: false } : a);
    }

    setStorageItem(ADDRESSES_KEY, updated);

    // Sync to Supabase
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          if (addressData.isDefault) {
            await supabase
              .from('addresses')
              .update({ is_default: false })
              .eq('user_id', userId);
          }

          await supabase
            .from('addresses')
            .update({
              full_name: addressData.fullName,
              phone: addressData.phone,
              house: addressData.house,
              street: addressData.street,
              area: addressData.area,
              city: addressData.city,
              state: addressData.state,
              pincode: addressData.pincode,
              landmark: addressData.landmark,
              is_default: Boolean(addressData.isDefault),
              updated_at: new Date().toISOString()
            })
            .eq('id', addressId);
        } catch (err) {
          console.warn('Supabase updateAddress error:', err);
        }
      })();
    }

    return { success: true };
  },

  deleteAddress(userId, addressId) {
    const all = this.getAll();
    const target = all.find(a => a.id === addressId && a.userId === userId);
    const updated = all.filter(a => !(a.id === addressId && a.userId === userId));

    if (target?.isDefault) {
      const remainingUser = updated.filter(a => a.userId === userId);
      if (remainingUser.length > 0) {
        remainingUser[0].isDefault = true;
      }
    }

    setStorageItem(ADDRESSES_KEY, updated);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          await supabase.from('addresses').delete().eq('id', addressId);
        } catch (err) {
          console.warn('Supabase deleteAddress error:', err);
        }
      })();
    }

    return { success: true };
  },

  setDefaultAddress(userId, addressId) {
    return this.updateAddress(userId, addressId, { isDefault: true });
  }
};
