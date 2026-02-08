const STORAGE_KEY = 'eai_user_id';

export const getOrCreateUserId = () => {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = globalThis.crypto?.randomUUID?.() || `user_${Date.now()}`;
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
};
