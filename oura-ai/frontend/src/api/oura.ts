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

export const fetchSleep = async () => {
  const res = await api.get("/sleep");
  return res.data;
};

export const fetchActivity = async (start_date: string, end_date: string) => {
  const res = await api.get(
    `/daily_activity?start_date=${start_date}&end_date=${end_date}`
  );
  return res.data;
};

export const fetchPersonalInfo = async () => {
  const res = await api.get("/personal_info");
  return res.data;
};

export { api };
