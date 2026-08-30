const configuredUrl = import.meta.env.VITE_API_URL?.trim();
const defaultUrl = import.meta.env.DEV
  ? 'http://localhost:5000'
  : 'https://fil-du-savoir-backend.onrender.com';

export const API_URL = (configuredUrl || defaultUrl).replace(/\/$/, '');
