/**
 * Safe localStorage wrapper for Zestora with in-memory resilient fallback
 */

const inMemoryStore = {};

export const getStorageItem = (key, fallback = null) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      if (item !== null && item !== undefined) {
        return JSON.parse(item);
      }
    }
    if (inMemoryStore[key] !== undefined) {
      return inMemoryStore[key];
    }
    return fallback;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return inMemoryStore[key] !== undefined ? inMemoryStore[key] : fallback;
  }
};

export const setStorageItem = (key, value) => {
  inMemoryStore[key] = value;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    return true;
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error);
    // Even if quota is reached or localStorage blocked, inMemoryStore preserves it for the session
    return true;
  }
};

export const removeStorageItem = (key) => {
  delete inMemoryStore[key];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
    return true;
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
    return true;
  }
};
