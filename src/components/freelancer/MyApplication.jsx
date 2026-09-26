import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBriefcase,
  FaCircleCheck,
  FaClock,
  FaFileCircleXmark,
  FaRotate,
  FaTriangleExclamation,
} from "react-icons/fa6";

import ApplicationCard from "../../components/freelancer/ApplicationCard";
import { getMyApplications } from "../../Services/freelancerServices";

const MyApplication = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // NORMALIZE API RESPONSE
  // =========================================================
  const normalizeApplications = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.applications)) {
      return response.applications;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.applications)) {
      return response.data.applications;
    }

    if (Array.isArray(response?.results)) {
      return response.results;
    }

    return [];
  };

  // =========================================================
  // FETCH APPLICATIONS
  // =========================================================
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyApplications();
      const data = normalizeApplications(response);

      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);

      setApplications([]);

      setError(
        err?.message ||
          err?.error ||
          "Unable to load your applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // =========================================================
  // GET STATUS
  // =========================================================
  const getApplicationStatus = (application) => {
    const status =
      application?.status ||
      application?.applicationStatus ||
      application?.state ||
      "pending";

    return String(status).toLowerCase().trim();
  };

  // =========================================================
  // FILTER APPLICATIONS
  // =========================================================
  const filteredApplications = useMemo(() => {
    if (activeFilter === "all") {
      return applications;
    }

    return applications.filter((application) => {
      const status = getApplicationStatus(application);

      if (activeFilter === "pending") {
        return [
          "pending",
          "reviewing",
          "under review",
          "shortlisted",
        ].includes(status);
      }

      if (activeFilter === "accepted") {
        return [
          "accepted",
          "approved",
          "selected",
          "active",
        ].includes(status);
      }

      if (activeFilter === "rejected") {
        return [
          "rejected",
          "declined",
          "cancelled",
        ].includes(status);
      }

      if (activeFilter === "completed") {
        return ["completed", "complete"].includes(status);
      }

      return true;
    });
  }, [applications, activeFilter]);

  // =========================================================
  // COUNTS
  // =========================================================
  const counts = useMemo(() => {
    let pending = 0;
    let accepted = 0;
    let rejected = 0;
    let completed = 0;

    applications.forEach((application) => {
      const status = getApplicationStatus(application);

      if (
        [
          "pending",
          "reviewing",
          "under review",
          "shortlisted",
        ].includes(status)
      ) {
        pending += 1;
      }

      if (
        [
          "accepted",
          "approved",
          "selected",
          "active",
        ].includes(status)
      ) {
        accepted += 1;
      }

      if (
        [
          "rejected",
          "declined",
          "cancelled",
        ].includes(status)
      ) {
        rejected += 1;
      }

      if (["completed", "complete"].includes(status)) {
        completed += 1;
      }
    });

    return {
      total: applications.length,
      pending,
      accepted,
      rejected,
      completed,
    };
  }, [applications]);

  // =========================================================
  // GET PROJECT ID
  // =========================================================
  const getProjectId = (application) => {
    const project =
      application?.project ||
      application?.projectId ||
      application?.projectID;

    if (!project) {
      return null;
    }

    if (typeof project === "object") {
      return project?._id || project?.id || null;
    }

    return project;
  };

  // =========================================================
  // OPEN PROJECT
  // =========================================================
  const handleViewProject = (application) => {
    const projectId = getProjectId(application);

    if (!projectId) {
      return;
    }

    navigate(`/freelancer/projects/${projectId}`);
  };

  // =========================================================
  // FILTER CONFIG
  // =========================================================
  const filters = [
    {
      key: "all",
      label: "All Applications",
      count: counts.total,
    },
    {
      key: "pending",
      label: "Pending",
      count: counts.pending,
    },
    {
      key: "accepted",
      label: "Accepted",
      count: counts.accepted,
    },
    {
      key: "rejected",
      label: "Rejected",
      count: counts.rejected,
    },
    {
      key: "completed",
      label: "Completed",
      count: counts.completed,
    },
  ];

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="my-applications-page">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}
      <section className="applications-header">
        <div>
          <div className="page-eyebrow">
            <FaBriefcase />
            Freelancer Workspace
          </div>

          <h1>My Applications</h1>

          <p>
            Track the projects you have applied for and monitor
            your application status.
          </p>
        </div>

        <button
          type="button"
          className="browse-projects-btn"
          onClick={() => navigate("/freelancer/projects")}
        >
          Browse Projects
          <FaArrowRight />
        </button>
      </section>

      {/* =====================================================
          SUMMARY CARDS
          ===================================================== */}
      <section className="application-stats">
        <div className="application-stat-card">
          <div className="application-stat-icon total">
            <FaBriefcase />
          </div>

          <div>
            <span>Total Applications</span>
            <strong>{counts.total}</strong>
          </div>
        </div>

        <div className="application-stat-card">
          <div className="application-stat-icon pending">
            <FaClock />
          </div>

          <div>
            <span>Pending</span>
            <strong>{counts.pending}</strong>
          </div>
        </div>

        <div className="application-stat-card">
          <div className="application-stat-icon accepted">
            <FaCircleCheck />
          </div>

          <div>
            <span>Accepted</span>
            <strong>{counts.accepted}</strong>
          </div>
        </div>

        <div className="application-stat-card">
          <div className="application-stat-icon completed">
            <FaCircleCheck />
          </div>

          <div>
            <span>Completed</span>
            <strong>{counts.completed}</strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          FILTERS
          ===================================================== */}
      <section className="applications-toolbar">
        <div className="filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={
                activeFilter === filter.key
                  ? "filter-tab active"
                  : "filter-tab"
              }
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}

              <span>{filter.count}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={fetchApplications}
          disabled={loading}
        >
          <FaRotate className={loading ? "spin" : ""} />
          Refresh
        </button>
      </section>

      {/* =====================================================
          ERROR
          ===================================================== */}
      {error && !loading && (
        <section className="applications-message error-message">
          <div className="message-icon">
            <FaTriangleExclamation />
          </div>

          <div className="message-content">
            <h3>Unable to load applications</h3>
            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={fetchApplications}
            className="retry-btn"
          >
            <FaRotate />
            Try Again
          </button>
        </section>
      )}

      {/* =====================================================
          LOADING
          ===================================================== */}
      {loading && (
        <section className="applications-list">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="application-skeleton"
            >
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-text" />
              <div className="skeleton-line skeleton-small" />

              <div className="skeleton-bottom">
                <div className="skeleton-pill" />
                <div className="skeleton-button" />
              </div>
            </div>
          ))}
        </section>
      )}

      {/* =====================================================
          EMPTY STATE
          ===================================================== */}
      {!loading &&
        !error &&
        filteredApplications.length === 0 && (
          <section className="applications-empty">
            <div className="empty-icon">
              <FaFileCircleXmark />
            </div>

            {applications.length === 0 ? (
              <>
                <h2>No applications yet</h2>

                <p>
                  You have not applied to any projects yet.
                  Browse available projects and submit your
                  first application.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/freelancer/projects")
                  }
                  className="empty-action-btn"
                >
                  Browse Projects
                  <FaArrowRight />
                </button>
              </>
            ) : (
              <>
                <h2>No matching applications</h2>

                <p>
                  There are no applications under the{" "}
                  <strong>
                    {filters.find(
                      (filter) =>
                        filter.key === activeFilter
                    )?.label || "selected"}
                  </strong>{" "}
                  filter.
                </p>

                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className="empty-action-btn secondary"
                >
                  View All Applications
                </button>
              </>
            )}
          </section>
        )}

      {/* =====================================================
          APPLICATION LIST
          ===================================================== */}
      {!loading &&
        !error &&
        filteredApplications.length > 0 && (
          <section className="applications-list">
            <div className="applications-list-header">
              <div>
                <h2>Your Applications</h2>

                <p>
                  Showing{" "}
                  <strong>
                    {filteredApplications.length}
                  </strong>{" "}
                  application
                  {filteredApplications.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>
            </div>

            <div className="application-cards">
              {filteredApplications.map(
                (application, index) => (
                  <div
                    className="application-card-wrapper"
                    key={
                      application?._id ||
                      application?.id ||
                      `application-${index}`
                    }
                  >
                    <ApplicationCard
                      application={application}
                    />

                    {/* Optional project navigation */}
                    {getProjectId(application) && (
                      <button
                        type="button"
                        className="application-project-link"
                        onClick={() =>
                          handleViewProject(application)
                        }
                      >
                        View Project Details
                        <FaArrowRight />
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          </section>
        )}
    </div>
  );
};

export default MyApplication;

/* =========================================================
   STYLES
   ========================================================= */

const style = document.createElement("style");

style.textContent = `
  .my-applications-page {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 8px 0 40px;
  }

  /* =======================================================
     HEADER
     ======================================================= */

  .applications-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 28px;
  }

  .page-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    color: #6366f1;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .applications-header h1 {
    margin: 0;
    color: #111827;
    font-size: clamp(28px, 3vw, 38px);
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .applications-header p {
    margin: 9px 0 0;
    max-width: 650px;
    color: #6b7280;
    font-size: 15px;
    line-height: 1.7;
  }

  .browse-projects-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-height: 44px;
    padding: 0 18px;
    border: 0;
    border-radius: 12px;
    background: #4f46e5;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      background 0.2s ease,
      box-shadow 0.2s ease;
    white-space: nowrap;
  }

  .browse-projects-btn:hover {
    background: #4338ca;
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(79, 70, 229, 0.2);
  }

  /* =======================================================
     STATS
     ======================================================= */

  .application-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 26px;
  }

  .application-stat-card {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 100px;
    padding: 20px;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 5px 18px rgba(15, 23, 42, 0.04);
  }

  .application-stat-icon {
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 17px;
  }

  .application-stat-icon.total {
    background: #eef2ff;
    color: #4f46e5;
  }

  .application-stat-icon.pending {
    background: #fff7ed;
    color: #ea580c;
  }

  .application-stat-icon.accepted {
    background: #ecfdf5;
    color: #059669;
  }

  .application-stat-icon.completed {
    background: #f0fdf4;
    color: #16a34a;
  }

  .application-stat-card span {
    display: block;
    margin-bottom: 4px;
    color: #6b7280;
    font-size: 12px;
    font-weight: 600;
  }

  .application-stat-card strong {
    color: #111827;
    font-size: 25px;
    font-weight: 800;
  }

  /* =======================================================
     TOOLBAR
     ======================================================= */

  .applications-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 20px;
    padding: 8px;
    border: 1px solid #e5e7eb;
    border-radius: 15px;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.035);
  }

  .filter-tabs {
    display: flex;
    align-items: center;
    gap: 4px;
    overflow-x: auto;
    scrollbar-width: thin;
  }

  .filter-tab {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 12px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: #6b7280;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition:
      background 0.2s ease,
      color 0.2s ease;
  }

  .filter-tab:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .filter-tab.active {
    background: #eef2ff;
    color: #4f46e5;
  }

  .filter-tab span {
    min-width: 22px;
    padding: 2px 6px;
    border-radius: 999px;
    background: #f3f4f6;
    color: #6b7280;
    font-size: 11px;
    text-align: center;
  }

  .filter-tab.active span {
    background: #ffffff;
    color: #4f46e5;
  }

  .refresh-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 38px;
    padding: 0 13px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #ffffff;
    color: #374151;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
  }

  .refresh-btn:hover:not(:disabled) {
    border-color: #c7d2fe;
    background: #f8faff;
    color: #4f46e5;
  }

  .refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spin {
    animation: application-spin 0.9s linear infinite;
  }

  @keyframes application-spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  /* =======================================================
     ERROR / MESSAGE
     ======================================================= */

  .applications-message {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 18px;
    border: 1px solid #fecaca;
    border-radius: 14px;
    background: #fef2f2;
    margin-bottom: 22px;
  }

  .message-icon {
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 11px;
    background: #fee2e2;
    color: #dc2626;
  }

  .message-content {
    flex: 1;
  }

  .message-content h3 {
    margin: 0 0 4px;
    color: #991b1b;
    font-size: 14px;
    font-weight: 800;
  }

  .message-content p {
    margin: 0;
    color: #b91c1c;
    font-size: 13px;
    line-height: 1.5;
  }

  .retry-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 13px;
    border: 1px solid #fecaca;
    border-radius: 9px;
    background: #ffffff;
    color: #b91c1c;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  /* =======================================================
     APPLICATION LIST
     ======================================================= */

  .applications-list {
    width: 100%;
  }

  .applications-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .applications-list-header h2 {
    margin: 0;
    color: #111827;
    font-size: 18px;
    font-weight: 800;
  }

  .applications-list-header p {
    margin: 4px 0 0;
    color: #6b7280;
    font-size: 13px;
  }

  .applications-list-header strong {
    color: #374151;
  }

  .application-cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .application-card-wrapper {
    position: relative;
    min-width: 0;
  }

  .application-project-link {
    width: calc(100% - 32px);
    margin: -4px 16px 16px;
    padding: 11px 14px;
    border: 1px solid #e5e7eb;
    border-top: 0;
    border-radius: 0 0 11px 11px;
    background: #ffffff;
    color: #4f46e5;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    transition:
      background 0.2s ease,
      color 0.2s ease;
  }

  .application-project-link:hover {
    background: #eef2ff;
    color: #4338ca;
  }

  /* =======================================================
     EMPTY STATE
     ======================================================= */

  .applications-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 360px;
    padding: 45px 25px;
    border: 1px dashed #d1d5db;
    border-radius: 18px;
    background: #ffffff;
    text-align: center;
  }

  .empty-icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
    border-radius: 18px;
    background: #f3f4f6;
    color: #9ca3af;
    font-size: 24px;
  }

  .applications-empty h2 {
    margin: 0;
    color: #111827;
    font-size: 20px;
    font-weight: 800;
  }

  .applications-empty p {
    max-width: 520px;
    margin: 8px 0 20px;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.7;
  }

  .empty-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 17px;
    border: 0;
    border-radius: 11px;
    background: #4f46e5;
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
  }

  .empty-action-btn:hover {
    background: #4338ca;
  }

  .empty-action-btn.secondary {
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #4f46e5;
  }

  .empty-action-btn.secondary:hover {
    background: #eef2ff;
  }

  /* =======================================================
     SKELETON
     ======================================================= */

  .application-skeleton {
    min-height: 230px;
    padding: 22px;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    background: #ffffff;
    overflow: hidden;
  }

  .skeleton-line,
  .skeleton-pill,
  .skeleton-button {
    position: relative;
    overflow: hidden;
    background: #e5e7eb;
    border-radius: 8px;
  }

  .skeleton-line::after,
  .skeleton-pill::after,
  .skeleton-button::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.7),
      transparent
    );
    animation: skeleton-loading 1.4s infinite;
  }

  .skeleton-title {
    width: 65%;
    height: 22px;
    margin-bottom: 18px;
  }

  .skeleton-text {
    width: 90%;
    height: 13px;
    margin-bottom: 10px;
  }

  .skeleton-small {
    width: 55%;
    height: 13px;
  }

  .skeleton-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
  }

  .skeleton-pill {
    width: 85px;
    height: 28px;
  }

  .skeleton-button {
    width: 120px;
    height: 36px;
  }

  @keyframes skeleton-loading {
    100% {
      transform: translateX(100%);
    }
  }

  /* =======================================================
     RESPONSIVE
     ======================================================= */

  @media (max-width: 1100px) {
    .application-stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .application-cards {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .my-applications-page {
      padding: 4px 0 30px;
    }

    .applications-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .browse-projects-btn {
      width: 100%;
    }

    .application-stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .application-stat-card {
      padding: 15px;
    }

    .applications-toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .filter-tabs {
      width: 100%;
      padding-bottom: 3px;
    }

    .refresh-btn {
      width: 100%;
    }

    .applications-message {
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .retry-btn {
      width: 100%;
    }
  }

  @media (max-width: 520px) {
    .application-stats {
      grid-template-columns: 1fr;
    }

    .applications-header h1 {
      font-size: 28px;
    }

    .applications-header p {
      font-size: 14px;
    }

    .application-stat-card {
      min-height: 82px;
    }

    .application-stat-card strong {
      font-size: 22px;
    }

    .applications-empty {
      min-height: 320px;
      padding: 30px 18px;
    }
  }
`;

if (!document.getElementById("my-applications-page-styles")) {
  style.id = "my-applications-page-styles";
  document.head.appendChild(style);
}