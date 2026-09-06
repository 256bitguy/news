const KEY = 'penverse_admin_access_token';

export const getToken = () => localStorage.getItem(KEY);

export const setToken = (token) => {
  if (token) localStorage.setItem(KEY, token);
};

export const clearToken = () => localStorage.removeItem(KEY);