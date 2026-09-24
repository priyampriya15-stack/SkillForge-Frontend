import API from "./api";

// LOGIN
export const loginUser = async (userData) => {
  try {
    const response = await API.post("/auth/login", userData);

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Login failed",
    };
  }
};

// REGISTER
export const registerUser = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData);

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Registration failed",
    };
  }
};

// GET CURRENT USER
export const getCurrentUser = async (token) => {
  try {
    const response = await API.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Unable to get user",
    };
  }
};