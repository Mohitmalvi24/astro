import AsyncStorage from '@react-native-async-storage/async-storage';

const inMemoryStore: Record<string, string> = {};

export const SafeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.warn(`[SafeStorage] Fallback getItem for ${key}:`, e);
      return inMemoryStore[key] || null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[SafeStorage] Fallback setItem for ${key}:`, e);
      inMemoryStore[key] = value;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`[SafeStorage] Fallback removeItem for ${key}:`, e);
      delete inMemoryStore[key];
    }
  },
};
