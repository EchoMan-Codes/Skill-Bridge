import axios from 'axios';

// In dev: use same origin so Vite proxy sends /api to backend (no CORS, no "backend not reachable" from wrong host)
// In production: use env or deployed backend URL
const baseURL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Check if backend is reachable (for showing a clear message before register/login) */
export async function checkBackendHealth() {
  try {
    const { data } = await api.get('/api/health', { timeout: 5000 });
    return data?.status === 'ok';
  } catch {
    return false;
  }
}

export const getApiBaseUrl = () => baseURL;
export const isLocalHost = () =>
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export async function register({ name, email, password }) {
  const { data } = await api.post('/api/auth/register', { name, email, password });
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
}

export async function submitAssessment({ name, skills, careerGoal }) {
  const { data } = await api.post('/api/user/assessment', { name, skills, careerGoal });
  return data;
}

export async function generateRoadmap({ userSkills, careerGoal, missingSkills }) {
  const { data } = await api.post('/api/roadmap/generate', {
    userSkills,
    careerGoal,
    missingSkills,
  });
  return data;
}

export async function sendChatMessage(messages) {
  const { data } = await api.post('/api/chat', { messages });
  return data;
}

export default api;
