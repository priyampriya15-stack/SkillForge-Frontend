import API from "./api";

const unwrap = (response) => response.data;

export const getAdminDashboard = async () => unwrap(await API.get("/admin/dashboard"));
export const getAdminAnalytics = async () => unwrap(await API.get("/admin/analytics"));
export const getAdminUsers = async () => unwrap(await API.get("/admin/users"));
export const toggleAdminUser = async (id) => unwrap(await API.put(`/admin/users/${id}/toggle`));

/**
 * Uses the admin projects endpoint when it exists in the backend.
 * No frontend seed/demo data is used as a fallback.
 */
export const getAdminProjects = async () => unwrap(await API.get("/admin/projects"));
export const updateAdminProjectStatus = async (id, status) =>
  unwrap(await API.patch(`/admin/projects/${id}/status`, { status }));
