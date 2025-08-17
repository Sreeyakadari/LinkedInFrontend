// frontend/src/config/index.jsx
import axios from "axios";

export const BASE_URL = "http://localhost:9090";

// Use this key name if your app already stores the JWT under it.
// If you currently use a different key, adjust here.
const TOKEN_STORAGE_KEY = "token";

export const clientServer = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// Add Authorization header automatically
clientServer.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
  } catch {
    delete config.headers.Authorization;
  }
  return config;
});
