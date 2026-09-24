import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBriefcase,
  FaClock,
  FaCheckCircle,
  FaMoneyBillWave,
  FaSearch,
  FaArrowRight,
  FaCalendarAlt,
  FaUser,
  FaCircle,
  FaFolderOpen,
} from "react-icons/fa";

import { getMyApplications } from "../../Services/applicationService";

const MyProjects = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // =========================================================
  // LOAD MY APPLICATIONS
  // =========================================================

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);

      const response = await getMyApplications();

      console.log("MY PROJECTS RESPONSE:", response);

      let data = [];

      if (Array.isArray(response)) {
        data = response;
      } else if (Array.isArray(response?.data)) {
        data = response.data;
      } else if (Array.isArray(response?.applications)) {
        data = response.applications;
      } else if (Array.isArray(response?.data?.applications)) {
        data = response.data.applications;
      }

      setApplications(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GET PROJECT FROM APPLICATION
  // =========================================================

  const getProject = (application) => {
    if (!application) return null;

    if (application.project && typeof application.project === "object") {
      return application.project;
    }

    if (application.projectDetails) {
      return application.projectDetails;
    }

    return null;
  };

  // =========================================================
  // ACTIVE PROJECTS
  // =========================================================

  const myProjects = useMemo(() => {
    return applications
      .filter((application) => {
        const status = String(application?.status || "").toLowerCase();

        return (
          status === "accepted" ||
          status === "in progress" ||
          status === "active" ||
          status === "completed"
        );
      })
      .map((application) => {
        const project = getProject(application);

        return {
          ...application,
          project,
        };
      })
      .filter((item) => item.project);
  }, [applications]);

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredProjects = useMemo(() => {
    let result = [...myProjects];

    // SEARCH
    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter((item) => {
        const project = item.project;

        return (
          project?.title?.toLowerCase().includes(keyword) ||
          project?.description?.toLowerCase().includes(keyword) ||
          project?.category?.toLowerCase().includes(keyword)
        );
      });
    }

    // FILTER
    if (filter === "active") {
      result = result.filter((item) => {
        const status = String(item?.status || "").toLowerCase();

        return (
          status === "accepted" ||
          status === "active" ||
          status === "in progress"
        );
      });
    }

    if (filter === "completed") {
      result = result.filter((item) => {
        const status = String(item?.status || "").toLowerCase();

        return status === "completed";
      });
    }

    return result;
  }, [myProjects, search, filter]);

  // =========================================================
  // STATS
  // =========================================================

  const totalProjects = myProjects.length;

  const activeProjects = myProjects.filter((item) => {
    const status = String(item?.status || "").toLowerCase();

    return (
      status === "accepted" ||
      status === "active" ||
      status === "in progress"
    );
  }).length;

  const completedProjects = myProjects.filter((item) => {
    return String(item?.status || "").toLowerCase() === "completed";
  }).length;

  const totalValue = myProjects.reduce((sum, item) => {
    const amount =
      Number(item?.bidAmount) ||
      Number(item?.project?.budget) ||
      Number(item?.amount) ||
      0;

    return sum + amount;
  }, 0);

  // =========================================================
  // FORMAT MONEY
  // =========================================================

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // STATUS
  // =========================================================

  const getStatus = (application) => {
    const status = String(application?.status || "").toLowerCase();

    if (status === "completed") {
      return {
        label: "Completed",
        className: "completed",
      };
    }

    return {
      label: "Active",
      className: "active",
    };
  };

  // =========================================================
  // OPEN PROJECT
  // =========================================================

  const openProject = (application) => {
    const project = application?.project;

    const projectId =
      project?._id ||
      project?.id ||
      application?.projectId;

    if (!projectId) {
      console.error("Project ID not found");
      return;
    }

    navigate(`/freelancer/projects/${projectId}`);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="my-projects-page">
        <div className="projects-loading">
          <div className="loading-spinner"></div>
          <p>Loading your projects...</p>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="my-projects-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="projects-container">

        <div className="projects-hero">

          <div className="hero-content">

            <span className="hero-label">
              FREELANCER WORKSPACE
            </span>

            <h1>My Projects</h1>

            <p>
              Manage projects that clients have assigned to you.
            </p>

          </div>

          <button
            className="browse-projects-btn"
            onClick={() => navigate("/browse-projects")}
          >
            <FaSearch />
            Browse Projects
          </button>

        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="stats-grid">

          {/* TOTAL */}

          <div className="stat-card">

            <div className="stat-icon total-icon">
              <FaBriefcase />
            </div>

            <div className="stat-content">
              <span>Total Projects</span>
              <strong>{totalProjects}</strong>
            </div>

          </div>

          {/* ACTIVE */}

          <div className="stat-card">

            <div className="stat-icon active-icon">
              <FaClock />
            </div>

            <div className="stat-content">
              <span>Active Projects</span>
              <strong>{activeProjects}</strong>
            </div>

          </div>

          {/* COMPLETED */}

          <div className="stat-card">

            <div className="stat-icon completed-icon">
              <FaCheckCircle />
            </div>

            <div className="stat-content">
              <span>Completed</span>
              <strong>{completedProjects}</strong>
            </div>

          </div>

          {/* VALUE */}

          <div className="stat-card">

            <div className="stat-icon money-icon">
              <FaMoneyBillWave />
            </div>

            <div className="stat-content">
              <span>Total Value</span>
              <strong>{formatMoney(totalValue)}</strong>
            </div>

          </div>

        </div>

        {/* =====================================================
            SEARCH + FILTER
        ===================================================== */}

        <div className="toolbar">

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search your projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="filter-buttons">

            <button
              className={filter === "all" ? "filter-active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={filter === "active" ? "filter-active" : ""}
              onClick={() => setFilter("active")}
            >
              Active
            </button>

            <button
              className={filter === "completed" ? "filter-active" : ""}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>

          </div>

        </div>

        {/* =====================================================
            PROJECT LIST
        ===================================================== */}

        {filteredProjects.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              <FaFolderOpen />
            </div>

            <h2>No projects found</h2>

            <p>
              {search
                ? "Try changing your search keyword."
                : "You don't have any assigned projects yet."}
            </p>

            {!search && (
              <button
                className="empty-btn"
                onClick={() => navigate("/browse-projects")}
              >
                Browse Projects
                <FaArrowRight />
              </button>
            )}

          </div>

        ) : (

          <div className="projects-grid">

            {filteredProjects.map((application) => {

              const project = application.project;
              const status = getStatus(application);

              const projectBudget =
                Number(application?.bidAmount) ||
                Number(project?.budget) ||
                Number(application?.amount) ||
                0;

              const client =
                project?.client ||
                project?.clientId ||
                application?.client;

              const clientName =
                typeof client === "object"
                  ? client?.name ||
                    client?.fullName ||
                    client?.username ||
                    "Client"
                  : "Client";

              return (

                <div
                  className="project-card"
                  key={application?._id || project?._id}
                  onClick={() => openProject(application)}
                >

                  {/* CARD TOP */}

                  <div className="project-card-top">

                    <div className="project-icon">
                      <FaBriefcase />
                    </div>

                    <span className={`status-badge ${status.className}`}>
                      <FaCircle />
                      {status.label}
                    </span>

                  </div>

                  {/* TITLE */}

                  <div className="project-main">

                    <h2>
                      {project?.title || "Untitled Project"}
                    </h2>

                    <p>
                      {project?.description
                        ? project.description.length > 130
                          ? `${project.description.substring(0, 130)}...`
                          : project.description
                        : "No project description available."}
                    </p>

                  </div>

                  {/* DETAILS */}

                  <div className="project-details">

                    <div className="detail-item">

                      <FaMoneyBillWave />

                      <div>
                        <small>Budget</small>
                        <strong>
                          {formatMoney(projectBudget)}
                        </strong>
                      </div>

                    </div>

                    <div className="detail-item">

                      <FaCalendarAlt />

                      <div>
                        <small>Deadline</small>
                        <strong>
                          {formatDate(
                            project?.deadline ||
                            project?.dueDate
                          )}
                        </strong>
                      </div>

                    </div>

                    <div className="detail-item">

                      <FaUser />

                      <div>
                        <small>Client</small>
                        <strong>{clientName}</strong>
                      </div>

                    </div>

                  </div>

                  {/* VIEW */}

                  <div className="project-footer">

                    <span>
                      View Project
                    </span>

                    <FaArrowRight />

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

      <style>{styles}</style>
    </div>
  );
};

// =============================================================
// WHITE THEME CSS
// =============================================================

const styles = `

/* ============================================================
   GLOBAL PAGE
============================================================ */

.my-projects-page {
  min-height: 100vh;
  width: 100%;
  padding: 32px;
  box-sizing: border-box;

  background: #ffffff !important;

  color: #111827;
}


/* ============================================================
   CONTAINER
============================================================ */

.projects-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}


/* ============================================================
   HERO
============================================================ */

.projects-hero {
  min-height: 150px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 30px;

  padding: 32px;

  margin-bottom: 24px;

  background: #ffffff !important;

  border: 1px solid #e5e7eb;

  border-radius: 18px;

  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}


.hero-content {
  flex: 1;
}


.hero-label {
  display: block;

  margin-bottom: 8px;

  color: #4f46e5;

  font-size: 12px;

  font-weight: 800;

  letter-spacing: 0.8px;
}


.hero-content h1 {
  margin: 0 0 8px;

  color: #111827;

  font-size: 32px;

  font-weight: 800;

  line-height: 1.2;
}


.hero-content p {
  margin: 0;

  color: #64748b;

  font-size: 15px;
}


.browse-projects-btn {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 10px;

  padding: 13px 20px;

  border: 1px solid #4f46e5;

  border-radius: 11px;

  background: #ffffff;

  color: #4f46e5;

  font-size: 14px;

  font-weight: 700;

  cursor: pointer;

  transition: all 0.2s ease;
}


.browse-projects-btn:hover {
  background: #4f46e5;

  color: #ffffff;

  transform: translateY(-1px);

  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.2);
}


/* ============================================================
   STATS
============================================================ */

.stats-grid {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 16px;

  margin-bottom: 22px;
}


.stat-card {
  min-height: 88px;

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 18px;

  box-sizing: border-box;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 15px;

  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
}


.stat-icon {
  width: 48px;
  height: 48px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 13px;

  font-size: 19px;
}


.total-icon {
  background: #eef2ff;

  color: #4f46e5;
}


.active-icon {
  background: #ecfdf5;

  color: #059669;
}


.completed-icon {
  background: #eff6ff;

  color: #2563eb;
}


.money-icon {
  background: #fff7ed;

  color: #ea580c;
}


.stat-content {
  display: flex;

  flex-direction: column;

  gap: 5px;
}


.stat-content span {
  color: #64748b;

  font-size: 13px;
}


.stat-content strong {
  color: #111827;

  font-size: 20px;

  font-weight: 800;
}


/* ============================================================
   TOOLBAR
============================================================ */

.toolbar {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 18px;

  padding: 14px;

  margin-bottom: 22px;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 15px;

  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
}


.search-box {
  flex: 1;

  max-width: 620px;

  height: 44px;

  display: flex;

  align-items: center;

  gap: 11px;

  padding: 0 14px;

  background: #ffffff;

  border: 1px solid #dbe2ea;

  border-radius: 9px;

  box-sizing: border-box;
}


.search-box svg {
  flex-shrink: 0;

  color: #94a3b8;

  font-size: 15px;
}


.search-box input {
  width: 100%;

  border: none;

  outline: none;

  background: transparent;

  color: #111827;

  font-size: 14px;
}


.search-box input::placeholder {
  color: #94a3b8;
}


.filter-buttons {
  display: flex;

  align-items: center;

  gap: 8px;
}


.filter-buttons button {
  height: 44px;

  padding: 0 18px;

  border: 1px solid #dbe2ea;

  border-radius: 9px;

  background: #ffffff;

  color: #64748b;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  transition: all 0.2s ease;
}


.filter-buttons button:hover {
  border-color: #818cf8;

  color: #4f46e5;
}


.filter-buttons button.filter-active {
  background: #4f46e5;

  border-color: #4f46e5;

  color: #ffffff;

  box-shadow: 0 5px 12px rgba(79, 70, 229, 0.2);
}


/* ============================================================
   PROJECT GRID
============================================================ */

.projects-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 18px;
}


/* ============================================================
   PROJECT CARD
============================================================ */

.project-card {
  padding: 20px;

  background: #ffffff;

  border: 1px solid #e1e7ef;

  border-radius: 16px;

  cursor: pointer;

  box-shadow: 0 5px 20px rgba(15, 23, 42, 0.04);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}


.project-card:hover {
  transform: translateY(-3px);

  border-color: #c7d2fe;

  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.09);
}


/* ============================================================
   CARD TOP
============================================================ */

.project-card-top {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 18px;
}


.project-icon {
  width: 44px;
  height: 44px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: #eef2ff;

  color: #4f46e5;

  font-size: 17px;
}


.status-badge {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 7px 11px;

  border-radius: 999px;

  font-size: 12px;

  font-weight: 700;
}


.status-badge svg {
  font-size: 7px;
}


.status-badge.active {
  background: #ecfdf5;

  color: #047857;
}


.status-badge.completed {
  background: #eff6ff;

  color: #2563eb;
}


/* ============================================================
   PROJECT MAIN
============================================================ */

.project-main h2 {
  margin: 0 0 8px;

  color: #111827;

  font-size: 19px;

  font-weight: 800;
}


.project-main p {
  min-height: 42px;

  margin: 0;

  color: #64748b;

  font-size: 13px;

  line-height: 1.6;
}


/* ============================================================
   PROJECT DETAILS
============================================================ */

.project-details {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 12px;

  margin-top: 20px;

  padding-top: 17px;

  border-top: 1px solid #edf0f4;
}


.detail-item {
  display: flex;

  align-items: center;

  gap: 8px;

  min-width: 0;
}


.detail-item > svg {
  flex-shrink: 0;

  color: #64748b;

  font-size: 14px;
}


.detail-item div {
  display: flex;

  flex-direction: column;

  min-width: 0;
}


.detail-item small {
  margin-bottom: 3px;

  color: #94a3b8;

  font-size: 10px;

  font-weight: 600;
}


.detail-item strong {
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  color: #1e293b;

  font-size: 12px;
}


/* ============================================================
   FOOTER
============================================================ */

.project-footer {
  display: flex;

  align-items: center;

  justify-content: flex-end;

  gap: 8px;

  margin-top: 17px;

  padding-top: 14px;

  border-top: 1px solid #edf0f4;

  color: #4f46e5;

  font-size: 13px;

  font-weight: 700;
}


.project-footer svg {
  font-size: 12px;

  transition: transform 0.2s ease;
}


.project-card:hover .project-footer svg {
  transform: translateX(4px);
}


/* ============================================================
   EMPTY
============================================================ */

.empty-state {
  display: flex;

  align-items: center;

  flex-direction: column;

  justify-content: center;

  min-height: 330px;

  padding: 40px;

  text-align: center;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 16px;
}


.empty-icon {
  width: 65px;
  height: 65px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-bottom: 15px;

  border-radius: 50%;

  background: #eef2ff;

  color: #4f46e5;

  font-size: 25px;
}


.empty-state h2 {
  margin: 0 0 7px;

  color: #111827;

  font-size: 20px;
}


.empty-state p {
  margin: 0 0 20px;

  color: #64748b;

  font-size: 14px;
}


.empty-btn {
  display: flex;

  align-items: center;

  gap: 9px;

  padding: 11px 18px;

  border: none;

  border-radius: 9px;

  background: #4f46e5;

  color: #ffffff;

  font-weight: 700;

  cursor: pointer;
}


/* ============================================================
   LOADING
============================================================ */

.projects-loading {
  min-height: 500px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-direction: column;

  gap: 14px;

  background: #ffffff;
}


.projects-loading p {
  color: #64748b;

  font-size: 14px;
}


.loading-spinner {
  width: 35px;
  height: 35px;

  border: 3px solid #e5e7eb;

  border-top-color: #4f46e5;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;
}


@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


/* ============================================================
   RESPONSIVE
============================================================ */

@media (max-width: 1100px) {

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

}


@media (max-width: 850px) {

  .my-projects-page {
    padding: 20px;
  }

  .projects-hero {
    flex-direction: column;

    align-items: flex-start;
  }

  .browse-projects-btn {
    width: 100%;
  }

  .toolbar {
    flex-direction: column;

    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .filter-buttons {
    width: 100%;
  }

  .filter-buttons button {
    flex: 1;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

}


@media (max-width: 600px) {

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .my-projects-page {
    padding: 14px;
  }

  .projects-hero {
    padding: 22px;
  }

  .hero-content h1 {
    font-size: 26px;
  }

  .project-details {
    grid-template-columns: 1fr;
  }

}
`;

export default MyProjects;