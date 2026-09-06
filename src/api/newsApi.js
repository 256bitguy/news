import axios from 'axios';
import { getToken } from '../utils/tokenStorage.js';

// Root host only — e.g. http://localhost:5000 (no /api/v1 here)
const BASE_HOST = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_PREFIX = '/api/v1';

const client = axios.create({
  baseURL: `${BASE_HOST}${API_PREFIX}`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the admin's Bearer token when present — required for the
// create/update/delete routes, harmless (and unused) on public reads.
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GET bankingawareness/date/:date
export const getNewsByDate = (date) =>
  client.get(`bankingawareness/date/${date}`).then((res) => res.data);

// GET bankingawareness/important
export const getImportantNews = () =>
  client.get('bankingawareness/important').then((res) => res.data);

// GET bankingawareness/search/title?title=...
export const searchNewsByTitle = (title) =>
  client
    .get('bankingawareness/search/title', { params: { title } })
    .then((res) => res.data);

// GET bankingawareness/:id
export const getNewsById = (id) =>
  client.get(`bankingawareness/${id}`).then((res) => res.data);

// POST bankingawareness — date, title, content etc. all travel in the body
export const createNews = (payload) => {
  console.log('POST', `${client.defaults.baseURL}bankingawareness`);
  console.log('body:', payload);
  return client.post('bankingawareness', payload).then((res) => res.data);
};

// PUT bankingawareness/:id
export const updateNews = (id, payload) =>
  client.put(`bankingawareness/${id}`, payload).then((res) => res.data);

// DELETE bankingawareness/:id
export const deleteNews = (id) =>
  client.delete(`bankingawareness/${id}`).then((res) => res.data);