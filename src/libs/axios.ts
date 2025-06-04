import axios from 'axios';

console.log('import.meta.env.VITE_API_WITH_CREDENTIALS > ', import.meta.env.VITE_API_WITH_CREDENTIALS);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: import.meta.env.VITE_API_WITH_CREDENTIALS || true,
});

export default api;
