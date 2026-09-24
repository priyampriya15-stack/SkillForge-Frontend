
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaProjectDiagram,
  FaSearch,
  FaTrash,
  FaEye,
  FaSyncAlt,
  FaCalendarAlt,
  FaRupeeSign,
} from "react-icons/fa";
import API from "../../Services/api";
import "./admin.css";

const Projects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  // =========================
  // FETCH ALL PROJECTS
  // =========================
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/admin/projects");

      setProjects(
        response.data?.projects ||
          response.data?.data ||
          []
      );
    } catch (err) {
      console.error("Fetch projects error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE PROJECT
  // =========================
  const deleteProject = async (project) => {
    const id = project._id || project.id;

    const confirmed = window.confirm(
      `Delete "${project.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await API.delete(`/admin/projects/${id}`);

      setProjects((prev) =>
        prev.filter(
          (item) => (item._id || item.id) !== id
        )
      );
    } catch (err) {
      console.error("Delete project error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete project."
      );
    }
  };

  // =========================
  // SEARCH + STATUS FILTER
  // =========================
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        project.title
          ?.toLowerCase()
          .includes(query) ||
        project.description
          ?.toLowerCase()
          .includes(query) ||
        project.client?.name
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "all" ||
        project.status?.toLowerCase() === status;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, status]);

  // =========================
  // FORMAT BUDGET
  // =========================
  const formatBudget = (budget) => {
    if (
      budget === undefined ||
      budget === null ||
      budget === ""
    ) {
      return "Not specified";
    }

    return `₹${Number(budget).toLocaleString("en-IN")}`;
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // VIEW PROJECT DETAILS
  // =========================
  const handleViewDetails = (project) => {
    const id = project._id || project.id;

    if (!id) {
      setError("Project ID is missing.");
      return;
    }

    console.log("Opening project details:", id);

    navigate(`/admin/projects/${id}`);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* =========================
            HEADER
        ========================= */}
        <div className="admin-header">
          <div>
            <span className="admin-eyebrow">
              <FaProjectDiagram /> PROJECT MANAGEMENT
            </span>

            <h1>Projects</h1>

            <p>
              Monitor and manage projects posted on SkillForge.
            </p>
          </div>

          <button
            className="admin-refresh-btn"
            onClick={fetchProjects}
            type="button"
          >
            <FaSyncAlt /> Refresh
          </button>
        </div>

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="admin-alert">
            {error}
          </div>
        )}

        {/* =========================
            FILTERS
        ========================= */}
        <div className="admin-toolbar">

          <div className="admin-search">
            <FaSearch />

            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            className="admin-select"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="open">
              Open
            </option>

            <option value="in_progress">
              In Progress
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>

        </div>

        {/* =========================
            PROJECT COUNT
        ========================= */}
        <div className="admin-result-count">
          Showing{" "}
          <strong>
            {filteredProjects.length}
          </strong>{" "}
          project
          {filteredProjects.length !== 1
            ? "s"
            : ""}
        </div>

        {/* =========================
            LOADING
        ========================= */}
        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>

            <p>
              Loading projects...
            </p>
          </div>

        ) : filteredProjects.length === 0 ? (

          /* =========================
             EMPTY
          ========================= */
          <div className="admin-empty">
            <FaProjectDiagram />

            <h3>
              No projects found
            </h3>

            <p>
              There are no projects matching
              your filters.
            </p>
          </div>

        ) : (

          /* =========================
             PROJECT GRID
          ========================= */
          <div className="admin-project-grid">

            {filteredProjects.map((project) => {

              const id =
                project._id || project.id;

              return (
                <div
                  className="admin-project-card"
                  key={id}
                >

                  {/* =========================
                      CARD TOP
                  ========================= */}
                  <div className="admin-project-card-top">

                    <span
                      className={`admin-status ${
                        project.status || "open"
                      }`}
                    >
                      {(project.status || "open")
                        .replace("_", " ")}
                    </span>

                    <button
                      type="button"
                      className="admin-delete-btn"
                      onClick={() =>
                        deleteProject(project)
                      }
                      title="Delete project"
                    >
                      <FaTrash />
                    </button>

                  </div>

                  {/* =========================
                      TITLE
                  ========================= */}
                  <h3>
                    {project.title ||
                      "Untitled Project"}
                  </h3>

                  {/* =========================
                      DESCRIPTION
                  ========================= */}
                  <p className="admin-project-description">
                    {project.description ||
                      "No description available."}
                  </p>

                  {/* =========================
                      CLIENT
                  ========================= */}
                  <div className="admin-project-client">

                    <div className="admin-avatar small">
                      {project.client?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "C"}
                    </div>

                    <div>
                      <span>
                        Client
                      </span>

                      <strong>
                        {project.client?.name ||
                          "Unknown Client"}
                      </strong>
                    </div>

                  </div>

                  {/* =========================
                      META
                  ========================= */}
                  <div className="admin-project-meta">

                    <div>
                      <FaRupeeSign />

                      <span>
                        {formatBudget(
                          project.budget
                        )}
                      </span>
                    </div>

                    <div>
                      <FaCalendarAlt />

                      <span>
                        {formatDate(
                          project.deadline
                        )}
                      </span>
                    </div>

                  </div>

                  {/* =========================
                      SKILLS
                  ========================= */}
                  <div className="admin-project-skills">

                    {Array.isArray(
                      project.skills
                    ) &&
                    project.skills.length > 0 ? (

                      project.skills
                        .slice(0, 4)
                        .map(
                          (skill, index) => (
                            <span key={index}>
                              {typeof skill ===
                              "string"
                                ? skill
                                : skill?.name ||
                                  "Skill"}
                            </span>
                          )
                        )

                    ) : (

                      <span>
                        No skills listed
                      </span>

                    )}

                  </div>

                  {/* =========================
                      VIEW DETAILS
                  ========================= */}
                  <button
                    type="button"
                    className="admin-project-view"
                    onClick={() =>
                      handleViewDetails(project)
                    }
                  >
                    <FaEye />
                    View Details
                  </button>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default Projects;

