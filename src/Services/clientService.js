// =========================================================
// SKILLFORGE CLIENT SERVICE
// =========================================================

import api from "./api";

// =========================================================
// CREATE PROJECT
// POST /api/projects
// =========================================================

export const createProject = async (projectData) => {
  try {
    console.log("======================================");
    console.log("CREATE PROJECT DATA:");
    console.log(projectData);
    console.log("======================================");

    if (!projectData || typeof projectData !== "object") {
      throw new Error("Project data is required.");
    }

    const payload = {
      title: projectData.title?.trim() || "",
      description: projectData.description?.trim() || "",
      category: projectData.category?.trim() || "",
      budget: Number(projectData.budget) || 0,
      deadline: projectData.deadline || "",
    };

    // Skills irundha mattum send pannum
    if (
      Array.isArray(projectData.skills) &&
      projectData.skills.length > 0
    ) {
      payload.skills = projectData.skills
        .map((skill) => String(skill).trim())
        .filter(Boolean);
    }

    console.log("======================================");
    console.log("FINAL PAYLOAD:");
    console.log(payload);
    console.log("======================================");

    const response = await api.post(
      "/projects",
      payload
    );

    console.log("======================================");
    console.log("PROJECT CREATED:");
    console.log(response.data);
    console.log("======================================");

    return response.data;
  } catch (error) {
    console.error("======================================");
    console.error("CREATE PROJECT ERROR:");
    console.error(
      error.response?.data || error.message
    );
    console.error("======================================");

    throw error;
  }
};

// =========================================================
// GET CLIENT DASHBOARD
// GET /api/projects
// =========================================================

export const getClientDashboard = async () => {
  try {
    const response = await api.get("/projects");

    console.log(
      "CLIENT DASHBOARD:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET CLIENT DASHBOARD ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// GET CLIENT PROJECTS
// GET /api/projects
// =========================================================

export const getClientProjects = async () => {
  try {
    const response = await api.get("/projects");

    console.log(
      "CLIENT PROJECTS:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET CLIENT PROJECTS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// GET PROJECT BY ID
// GET /api/projects/:id
// =========================================================

export const getProjectById = async (projectId) => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required.");
    }

    const response = await api.get(
      `/projects/${projectId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET PROJECT BY ID ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// UPDATE PROJECT
// PUT /api/projects/:id
// =========================================================

export const updateProject = async (
  projectId,
  projectData
) => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required.");
    }

    const response = await api.put(
      `/projects/${projectId}`,
      projectData
    );

    console.log(
      "PROJECT UPDATED:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "UPDATE PROJECT ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// DELETE PROJECT
// DELETE /api/projects/:id
// =========================================================

export const deleteProject = async (projectId) => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required.");
    }

    const response = await api.delete(
      `/projects/${projectId}`
    );

    console.log(
      "PROJECT DELETED:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "DELETE PROJECT ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// GET PROJECT APPLICATIONS
// GET /api/applications/project/:projectId
// =========================================================

export const getProjectApplications = async (
  projectId
) => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required.");
    }

    console.log(
      "======================================"
    );
    console.log(
      "GET PROJECT APPLICATIONS"
    );
    console.log(
      "Project ID:",
      projectId
    );
    console.log(
      "Endpoint:",
      `/applications/project/${projectId}`
    );
    console.log(
      "======================================"
    );

    const response = await api.get(
      `/applications/project/${projectId}`
    );

    console.log(
      "PROJECT APPLICATIONS RESPONSE:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET PROJECT APPLICATIONS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// UPDATE APPLICATION STATUS
// PUT /api/applications/:id/status
// =========================================================

export const updateApplicationStatus = async (
  applicationId,
  status
) => {
  try {
    if (!applicationId) {
      throw new Error(
        "Application ID is required."
      );
    }

    if (!status) {
      throw new Error(
        "Application status is required."
      );
    }

    if (
      !["accepted", "rejected"].includes(status)
    ) {
      throw new Error(
        "Invalid application status."
      );
    }

    const response = await api.put(
      `/applications/${applicationId}/status`,
      {
        status,
      }
    );

    console.log(
      "APPLICATION STATUS UPDATED:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "UPDATE APPLICATION STATUS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// GET CLIENT PROFILE
// GET /api/users/profile
// =========================================================

export const getClientProfile = async () => {
  try {
    const response = await api.get(
      "/users/profile"
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET CLIENT PROFILE ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// UPDATE CLIENT PROFILE
// PUT /api/users/profile
// =========================================================

export const updateClientProfile = async (
  profileData
) => {
  try {
    const response = await api.put(
      "/users/profile",
      profileData
    );

    return response.data;
  } catch (error) {
    console.error(
      "UPDATE CLIENT PROFILE ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// GET CLIENT PAYMENTS
// GET /api/payments
// =========================================================

export const getClientPayments = async () => {
  try {
    const response = await api.get(
      "/payments"
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET CLIENT PAYMENTS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// GET CLIENT REVIEWS
// GET /api/reviews
// =========================================================

export const getClientReviews = async () => {
  try {
    const response = await api.get(
      "/reviews"
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET CLIENT REVIEWS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// GET CLIENT MILESTONES
// GET /api/milestones
// =========================================================

export const getClientMilestones = async () => {
  try {
    const response = await api.get(
      "/milestones"
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET CLIENT MILESTONES ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};
