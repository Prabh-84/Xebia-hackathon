import axios from 'axios';

const http = axios.create({ baseURL: import.meta.env.VITE_API_URL });

http.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  // Backend authMiddleware currently expects raw token without "Bearer "
  if (t) cfg.headers.Authorization = t;
  return cfg;
});

export const getDashboard       = ()  => http.get('/dashboard');
export const getUsage           = ()  => http.get('/usage');
export const getCarbon          = ()  => http.get('/carbon');
export const getForecast        = ()  => http.get('/forecast');
export const getRecommendations = ()  => http.get('/recommendations');
export const getGreenScore      = ()  => http.get('/green-score');
export const getProjects        = ()  => http.get('/projects');
export const register           = (payload) => http.post('/register', payload);
export const login              = (payload) => http.post('/login', payload);
export const askCopilot         = (query) => http.get('/copilot', { params: { query } });
