import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT token automatically attach
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ==========================================
// GET PORTFOLIO
// ==========================================
export const getPortfolio = async () => {
  try {
    const response = await api.get(
      "/freelancer/portfolio"
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET PORTFOLIO ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to load portfolio"
    );
  }
};


// ==========================================
// UPDATE PORTFOLIO
// ==========================================
export const updatePortfolio = async (portfolio) => {
  try {
    const response = await api.put(
      "/freelancer/portfolio",
      {
        portfolio,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "UPDATE PORTFOLIO ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to update portfolio"
    );
  }
};


export default {
  getPortfolio,
  updatePortfolio,
};