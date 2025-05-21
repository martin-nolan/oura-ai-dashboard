import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 8000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle errors globally
    return Promise.reject(error);
  }
);

// Removed fetchSleep, fetchActivity, and fetchPersonalInfo as they are no longer used.
// The App.tsx now uses the generic 'api.get(`/oura_data/${endpointPath}` ...)' call.

export { api };
