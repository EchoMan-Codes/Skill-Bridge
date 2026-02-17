import axios from 'axios';

// Always call backend directly (avoids proxy 404 when backend not same host)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
