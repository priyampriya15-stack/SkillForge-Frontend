import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// JWT TOKEN INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// GET FREELANCER DASHBOARD
// =====================================================

export const getFreelancerDashboard = async () => {
  try {
    const response = await api.get(
      "/users/freelancer-dashboard"
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET FREELANCER DASHBOARD ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to load freelancer dashboard"
    );
  }
};

// =====================================================
// GET RECOMMENDED PROJECTS
// =====================================================

export const getRecommendedProjects = async () => {
  try {
    const response = await api.get(
      "/recommendations/freelancer/projects"
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET RECOMMENDED PROJECTS ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to load recommended projects"
    );
  }
};

// =====================================================
// GET ALL PROJECTS
// =====================================================

export const getProjects = async ({
  search = "",
  category = "",
  minBudget = "",
  maxBudget = "",
  sort = "",
} = {}) => {
  try {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (category && category !== "All") {
      params.category = category;
    }

    if (minBudget) {
      params.minBudget = minBudget;
    }

    if (maxBudget) {
      params.maxBudget = maxBudget;
    }

    if (sort) {
      params.sort = sort;
    }

    const response = await api.get("/projects", {
      params,
    });

    return response.data;
  } catch (error) {
    console.error(
      "GET FREELANCER PROJECTS ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to load projects"
    );
  }
};

// =====================================================
// GET SINGLE PROJECT
// =====================================================

export const getProjectById = async (projectId) => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const response = await api.get(
      `/projects/${projectId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET PROJECT ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to load project"
    );
  }
};

// =====================================================
// APPLY TO PROJECT
// =====================================================

export const applyToProject = async (
  projectId,
  applicationData
) => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const response = await api.post(
      `/projects/${projectId}/apply`,
      applicationData
    );

    return response.data;
  } catch (error) {
    console.error(
      "APPLY PROJECT ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to apply for project"
    );
  }
};

// =====================================================
// GET MY APPLICATIONS
// =====================================================

export const getMyApplications = async () => {
  try {
    const response = await api.get(
      "/applications/my"
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET MY APPLICATIONS ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to load applications"
    );
  }
};

// =====================================================
// GET MY PROJECTS
// =====================================================

export const getMyProjects = async () => {
  try {
    const response = await api.get(
      "/projects/my-projects"
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET MY PROJECTS ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to load my projects"
    );
  }
};

// =====================================================
// GET FREELANCER PROFILE
// =====================================================

export const getProfile = async () => {
  try {
    const response = await api.get(
      "/users/profile"
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET PROFILE ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to load profile"
    );
  }
};

// =====================================================
// UPDATE FREELANCER PROFILE
// =====================================================

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put(
      "/users/profile",
      profileData
    );

    return response.data;
  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to update profile"
    );
  }
};

// =====================================================
// GET ALL FREELANCERS
// =====================================================

export const getFreelancers = async ({
  search = "",
  skill = "",
  minRating = "",
} = {}) => {
  try {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (skill && skill !== "All") {
      params.skill = skill;
    }

    if (
      minRating &&
      minRating !== "All Ratings"
    ) {
      params.minRating = minRating;
    }

    /*
      IMPORTANT:
      This endpoint should exist in your backend.

      Example:
      GET /api/users/freelancers
    */

    const response = await api.get(
      "/users/freelancers",
      {
        params,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET FREELANCERS ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to load freelancers"
    );
  }
};

// =====================================================
// GET FREELANCER STATS
// =====================================================

export const getFreelancerStats = async () => {
  try {
    const response = await api.get(
      "/users/freelancer-stats"
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET FREELANCER STATS ERROR:",
      error.response?.data || error.message
    );

    /*
      Do not crash the entire Freelancers page
      if the stats endpoint is not available.

      Return empty stats so the frontend can
      calculate fallback values.
    */

    return {
      success: false,
      stats: null,
    };
  }
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  getFreelancerDashboard,
  getRecommendedProjects,
  getProjects,
  getProjectById,
  applyToProject,
  getMyApplications,
  getMyProjects,
  getProfile,
  updateProfile,
  getFreelancers,
  getFreelancerStats,
};