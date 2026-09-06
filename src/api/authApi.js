import axios from 'axios';
import { getToken } from '../utils/tokenStorage.js';

const BASE_HOST = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_PREFIX = '/api/v1';

const client = axios.create({
  baseURL: `${BASE_HOST}${API_PREFIX}`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the stored admin token as a Bearer header on every request —
// the backend's CORS policy (credentials: false) means cookies never
// reach it cross-origin, but verifyJWT already accepts this header.
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// POST /auth/admin/login — returns { user, accessToken, refreshToken }
export const adminLogin = (email, password) =>
  client
    .post('/auth/admin/login', { email, password })
    .then((res) => res.data.data);

// GET /auth/current-user
export const getCurrentUser = () =>
  client.get('/auth/current-user').then((res) => res.data.data);

// POST /auth/logout
export const logout = () =>
  client.post('/auth/logout').then((res) => res.data);