import axios from "axios";

// =========================================================
// SKILLFORGE API CONFIGURATION
// =========================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// =========================================================
// REQUEST INTERCEPTOR
// =========================================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    console.error("REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    console.error("======================================");
    console.error("API ERROR");
    console.error("======================================");

    console.error("STATUS:", error.response?.status);

    console.error(
      "DATA:",
      error.response?.data
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error("======================================");

    return Promise.reject(error);
  }
);

// =========================================================
// EXPORT
// =========================================================

export default api;