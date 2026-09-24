import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiPlus,
  FiFolder,
  FiArrowRight,
  FiRefreshCw,
  FiUsers,
} from "react-icons/fi";

import { getClientProjects } from "../../Services/clientService";

export default function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PROJECTS
  // =====================================================

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getClientProjects();

      console.log("CLIENT PROJECTS RESPONSE:", response);

      const result =
        response?.projects ||
        response?.data ||
        response;

      setProjects(
        Array.isArray(result) ? result : []
      );
    } catch (error) {
      console.error(
        "LOAD CLIENT PROJECTS ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load projects."
      );

      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VIEW PROJECT
  // =====================================================

  const handleViewProject = (projectId) => {
    if (!projectId) return;

    navigate(`/client/projects/${projectId}`);
  };

  // =====================================================
  // VIEW APPLICATIONS
  // =====================================================

  const handleViewApplications = (projectId) => {
    if (!projectId) return;

    navigate(
      `/client/projects/${projectId}/applications`
    );
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    return String(status || "open")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // =====================================================
  // FORMAT BUDGET
  // =====================================================

  const formatBudget = (budget) => {
    return Number(budget || 0).toLocaleString("en-IN");
  };

  // =====================================================
  // FORMAT STATUS
  // =====================================================

  const formatStatus = (status) => {
    if (!status) return "Open";

    return (
      String(status).charAt(0).toUpperCase() +
      String(status).slice(1)
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="client-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="client-topbar">

        <div>

          <span className="client-eyebrow">
            PROJECT MANAGEMENT
          </span>

          <h1>
            My Projects
          </h1>

          <p>
            Manage projects you have posted and
            review freelancer applications.
          </p>

        </div>

        <Link
          to="/client/post-project"
          className="client-primary-btn"
        >
          <FiPlus size={18} />
          Post Project
        </Link>

      </header>

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div className="client-error">

          <div>
            {error}
          </div>

          <button
            type="button"
            onClick={loadProjects}
            className="client-secondary-btn"
          >
            <FiRefreshCw size={15} />
            Retry
          </button>

        </div>
      )}

      {/* =================================================
          MAIN PANEL
      ================================================= */}

      <div className="client-panel">

        {/* =================================================
            PANEL HEADER
        ================================================= */}

        <div className="client-panel-header">

          <div>

            <span className="client-panel-label">
              ALL PROJECTS
            </span>

            <h2>
              Your Projects
            </h2>

          </div>

          <span className="client-count">
            {projects.length}{" "}
            {projects.length === 1
              ? "Project"
              : "Projects"}
          </span>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="client-loading-box">

            <div className="client-loading-spinner">
              <FiRefreshCw size={22} />
            </div>

            <p>
              Loading projects...
            </p>

          </div>

        ) : projects.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="client-empty">

            <div className="client-empty-icon">
              <FiFolder size={34} />
            </div>

            <h3>
              No projects found
            </h3>

            <p>
              You haven't posted any projects yet.
              Post your first project and start
              working with freelancers.
            </p>

            <Link
              to="/client/post-project"
              className="client-secondary-btn"
            >
              <FiPlus size={16} />
              Create Project
            </Link>

          </div>

        ) : (

          /* =================================================
             PROJECT TABLE
          ================================================= */

          <div className="client-table-wrapper">

            <table className="client-table">

              <thead>

                <tr>

                  <th>
                    Project
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Budget
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Applications
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {projects.map((project) => (

                  <tr
                    key={project._id}
                  >

                    {/* =====================================
                        PROJECT
                    ===================================== */}

                    <td>

                      <div className="client-table-project">

                        <div className="client-project-icon">
                          <FiFolder size={18} />
                        </div>

                        <div>

                          <strong>
                            {project.title ||
                              "Untitled Project"}
                          </strong>

                          <span>
                            {project.description
                              ? project.description.length > 55
                                ? `${project.description.slice(
                                    0,
                                    55
                                  )}...`
                                : project.description
                              : "No description"}
                          </span>

                        </div>

                      </div>

                    </td>

                    {/* =====================================
                        CATEGORY
                    ===================================== */}

                    <td>
                      {project.category || "-"}
                    </td>

                    {/* =====================================
                        BUDGET
                    ===================================== */}

                    <td>
                      ₹{formatBudget(project.budget)}
                    </td>

                    {/* =====================================
                        STATUS
                    ===================================== */}

                    <td>

                      <span
                        className={`client-status ${getStatusClass(
                          project.status
                        )}`}
                      >
                        {formatStatus(project.status)}
                      </span>

                    </td>

                    {/* =====================================
                        APPLICATIONS
                    ===================================== */}

                    <td>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewApplications(
                            project._id
                          )
                        }
                        className="client-action-btn"
                      >

                        <FiUsers size={14} />

                        Applications

                        <FiArrowRight size={14} />

                      </button>

                    </td>

                    {/* =====================================
                        VIEW PROJECT
                    ===================================== */}

                    <td>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewProject(
                            project._id
                          )
                        }
                        className="client-action-btn"
                      >

                        View

                        <FiArrowRight
                          size={14}
                        />

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}