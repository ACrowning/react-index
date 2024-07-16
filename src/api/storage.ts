export const storage = {
  get: (key: string): string | null => {
    return localStorage.getItem(key);
  },
  set: (key: string, value: string | null): void => {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  },
};
