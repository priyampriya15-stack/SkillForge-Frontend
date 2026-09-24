import API from "./api";

// ==========================================
// GET ALL PROJECTS
// GET /api/projects
// ==========================================
export const getProjects = async ({
  search = "",
  category = "",
  skill = "",
  status = "open",
} = {}) => {
  try {
    const params = {};

    // Search
    if (search?.trim()) {
      params.search = search.trim();
    }

    // Category
    if (category && category !== "All Categories") {
      params.category = category;
    }

    // Skill
    if (skill && skill !== "All Skills") {
      params.skill = skill;
    }

    // Status
    if (status) {
      params.status = status;
    }

    const response = await API.get("/projects", {
      params,
    });

    return response.data;
  } catch (error) {
    console.error(
      "GET PROJECTS ERROR:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        message: "Failed to fetch projects",
      }
    );
  }
};

// ==========================================
// GET PROJECT BY ID
// GET /api/projects/:id
// ==========================================
export const getProjectById = async (id) => {
  try {
    if (!id) {
      throw new Error("Project ID is required");
    }

    const response = await API.get(`/projects/${id}`);

    return response.data;
  } catch (error) {
    console.error(
      "GET PROJECT BY ID ERROR:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        message: "Failed to fetch project",
      }
    );
  }
};

// ==========================================
// APPLY FOR PROJECT
// POST /api/applications/:projectId
// ==========================================
export const applyToProject = async (
  projectId,
  applicationData
) => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    if (!applicationData?.proposal?.trim()) {
      throw new Error("Proposal is required");
    }

    if (
      applicationData?.bidAmount === undefined ||
      applicationData?.bidAmount === null ||
      applicationData?.bidAmount === ""
    ) {
      throw new Error("Bid amount is required");
    }

    const payload = {
      proposal: applicationData.proposal.trim(),
      bidAmount: Number(applicationData.bidAmount),
    };

    // Debug
    console.log("======================================");
    console.log("APPLY PROJECT");
    console.log("Project ID:", projectId);
    console.log("Payload:", payload);
    console.log("======================================");

    const response = await API.post(
      `/applications/${projectId}`,
      payload
    );

    console.log(
      "APPLICATION SUCCESS:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "APPLY PROJECT ERROR:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        message: "Failed to apply for project",
      }
    );
  }
};

// ==========================================
// CREATE PROJECT
// POST /api/projects
// ==========================================
export const createProject = async (projectData) => {
  try {
    if (!projectData) {
      throw new Error("Project data is required");
    }

    const response = await API.post(
      "/projects",
      projectData
    );

    return response.data;
  } catch (error) {
    console.error(
      "CREATE PROJECT ERROR:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        message: "Failed to create project",
      }
    );
  }
};

// ==========================================
// UPDATE PROJECT
// PUT /api/projects/:id
// ==========================================
export const updateProject = async (
  projectId,
  projectData
) => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    if (!projectData) {
      throw new Error("Project data is required");
    }

    const response = await API.put(
      `/projects/${projectId}`,
      projectData
    );

    return response.data;
  } catch (error) {
    console.error(
      "UPDATE PROJECT ERROR:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        message: "Failed to update project",
      }
    );
  }
};

// ==========================================
// DELETE PROJECT
// DELETE /api/projects/:id
// ==========================================
export const deleteProject = async (projectId) => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const response = await API.delete(
      `/projects/${projectId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "DELETE PROJECT ERROR:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        message: "Failed to delete project",
      }
    );
  }
};

// ==========================================
// OPTIONAL HELPER
// GET MY APPLICATIONS
// GET /api/applications/my-applications
// ==========================================
export const getMyApplications = async () => {
  try {
    const response = await API.get(
      "/applications/my-applications"
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET MY APPLICATIONS ERROR:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        message: "Failed to fetch applications",
      }
    );
  }
};