// import API from "./api";

// // =====================================================
// // GET APPLICATIONS FOR A PROJECT
// // GET /api/applications/project/:projectId
// // =====================================================

// export const getProjectApplications = async (projectId) => {
//   try {
//     if (!projectId) {
//       throw new Error("Project ID is required");
//     }

//     console.log(
//       "GET PROJECT APPLICATIONS:",
//       projectId
//     );

//     const response = await API.get(
//       `/applications/project/${projectId}`
//     );

//     console.log(
//       "PROJECT APPLICATIONS RESPONSE:",
//       response.data
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "GET PROJECT APPLICATIONS ERROR:",
//       error.response?.data || error.message
//     );

//     throw (
//       error.response?.data || {
//         message: "Failed to load project applications",
//       }
//     );
//   }
// };

// // =====================================================
// // UPDATE APPLICATION STATUS
// // PUT /api/applications/:id/status
// // =====================================================

// export const updateApplicationStatus = async (
//   applicationId,
//   status
// ) => {
//   try {
//     if (!applicationId) {
//       throw new Error("Application ID is required");
//     }

//     if (!status) {
//       throw new Error("Application status is required");
//     }

//     if (!["accepted", "rejected"].includes(status)) {
//       throw new Error(
//         "Status must be accepted or rejected"
//       );
//     }

//     const payload = {
//       status,
//     };

//     console.log(
//       "UPDATE APPLICATION STATUS:",
//       applicationId,
//       payload
//     );

//     const response = await API.put(
//       `/applications/${applicationId}/status`,
//       payload
//     );

//     console.log(
//       "STATUS UPDATE RESPONSE:",
//       response.data
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "UPDATE APPLICATION STATUS ERROR:",
//       error.response?.data || error.message
//     );

//     throw (
//       error.response?.data || {
//         message: "Failed to update application status",
//       }
//     );
//   }
// };

// // =====================================================
// // GET MY APPLICATIONS
// // GET /api/applications/my-applications
// // =====================================================

// export const getMyApplications = async () => {
//   try {
//     const response = await API.get(
//       "/applications/my-applications"
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "GET MY APPLICATIONS ERROR:",
//       error.response?.data || error.message
//     );

//     throw (
//       error.response?.data || {
//         message: "Failed to load my applications",
//       }
//     );
//   }
// };
import API from "./api";

export const getMyApplications = async () => {
  try {
    console.log("GETTING MY APPLICATIONS...");

    const response = await API.get("/applications/my-applications");

    console.log("MY APPLICATIONS RESPONSE:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "GET MY APPLICATIONS ERROR:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        message: "Failed to load my applications",
      }
    );
  }
};

export const getProjectApplications = async (projectId) => {
  try {
    const response = await API.get(
      `/applications/project/${projectId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET PROJECT APPLICATIONS ERROR:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        message: "Failed to load project applications",
      }
    );
  }
};

export const updateApplicationStatus = async (
  applicationId,
  status
) => {
  try {
    const response = await API.put(
      `/applications/${applicationId}/status`,
      { status }
    );

    return response.data;
  } catch (error) {
    console.error(
      "UPDATE APPLICATION STATUS ERROR:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        message: "Failed to update application status",
      }
    );
  }
};