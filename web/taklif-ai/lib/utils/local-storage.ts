export type StorageKey = 'PDF_FILE' | 'DIFFICULTY' | 'INTERESTS';

export const storage = {
  saveProgress: (key: StorageKey, value: any) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  },

  getProgress: (key: StorageKey) => {
    if (typeof window === 'undefined') return null;

    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error retrieving ${key} from storage:`, error);
      return null;
    }
  },

  clearProgress: () => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem('PDF_FILE');
      localStorage.removeItem('DIFFICULTY');
      localStorage.removeItem('INTERESTS');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};