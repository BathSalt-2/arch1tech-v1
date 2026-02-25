const GROQ_API_KEY_STORAGE_KEY = 'arch1tech-groq-key';

let inMemoryGroqKey: string | null = null;

const isBrowser = typeof window !== 'undefined';

const migrateLegacyLocalStorageKey = (): void => {
  if (!isBrowser) return;

  const legacyKey = window.localStorage.getItem(GROQ_API_KEY_STORAGE_KEY);
  if (!legacyKey) return;

  const normalized = legacyKey.trim();
  if (normalized) {
    window.sessionStorage.setItem(GROQ_API_KEY_STORAGE_KEY, normalized);
    inMemoryGroqKey = normalized;
  }

  window.localStorage.removeItem(GROQ_API_KEY_STORAGE_KEY);
};

export const getGroqApiKey = (): string | null => {
  if (!isBrowser) {
    return inMemoryGroqKey;
  }

  migrateLegacyLocalStorageKey();

  const sessionKey = window.sessionStorage.getItem(GROQ_API_KEY_STORAGE_KEY);
  if (sessionKey && sessionKey.trim()) {
    inMemoryGroqKey = sessionKey.trim();
    return inMemoryGroqKey;
  }

  return inMemoryGroqKey;
};

export const setGroqApiKey = (key: string): void => {
  const normalized = key.trim();

  if (!normalized) {
    clearGroqApiKey();
    return;
  }

  inMemoryGroqKey = normalized;

  if (isBrowser) {
    window.sessionStorage.setItem(GROQ_API_KEY_STORAGE_KEY, normalized);
    window.localStorage.removeItem(GROQ_API_KEY_STORAGE_KEY);
  }
};

export const clearGroqApiKey = (): void => {
  inMemoryGroqKey = null;

  if (isBrowser) {
    window.sessionStorage.removeItem(GROQ_API_KEY_STORAGE_KEY);
    window.localStorage.removeItem(GROQ_API_KEY_STORAGE_KEY);
  }
};
