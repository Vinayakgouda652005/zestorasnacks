/**
 * ZESTORA Address Management Service
 */
import { getStorageItem, setStorageItem } from './storage';

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
    return { success: true };
  },

  deleteAddress(userId, addressId) {
    const all = this.getAll();
    const target = all.find(a => a.id === addressId && a.userId === userId);
    const updated = all.filter(a => !(a.id === addressId && a.userId === userId));

    // If the deleted address was default, set next address as default
    if (target?.isDefault) {
      const remainingUser = updated.filter(a => a.userId === userId);
      if (remainingUser.length > 0) {
        remainingUser[0].isDefault = true;
      }
    }

    setStorageItem(ADDRESSES_KEY, updated);
    return { success: true };
  },

  setDefaultAddress(userId, addressId) {
    const all = this.getAll();
    const updated = all.map(a => {
      if (a.userId === userId) {
        return { ...a, isDefault: a.id === addressId };
      }
      return a;
    });
    setStorageItem(ADDRESSES_KEY, updated);
    return { success: true };
  }
};
