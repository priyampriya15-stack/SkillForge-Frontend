import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaFileLines,
  FaClock,
  FaCheck,
  FaXmark,
  FaMagnifyingGlass,
  FaArrowRight,
  FaRotate,
  FaBriefcase,
} from "react-icons/fa6";

import { getMyApplications } from "../../Services/applicationService";

import "./MyApplication.css";

const MyApplication = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // =====================================================
  // LOAD APPLICATIONS
  // =====================================================

  const loadApplications = async () => {
    try {
      setError("");

      const response = await getMyApplications();

      console.log("MY APPLICATIONS PAGE:", response);

      let data = [];

      if (Array.isArray(response)) {
        data = response;
      } else if (Array.isArray(response?.applications)) {
        data = response.applications;
      } else if (Array.isArray(response?.data)) {
        data = response.data;
      } else if (Array.isArray(response?.data?.applications)) {
        data = response.data.applications;
      }

      setApplications(data);
    } catch (err) {
      console.error("LOAD MY APPLICATIONS ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load your applications."
      );

      setApplications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadApplications();
  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    setRefreshing(true);
    loadApplications();
  };

  // =====================================================
  // FILTER + SEARCH + SORT
  // =====================================================

  const filteredApplications = useMemo(() => {
    let result = [...applications];

    // SEARCH
    if (search.trim()) {
      const keyword = search.trim().toLowerCase();

      result = result.filter((application) => {
        const projectTitle =
          application.project?.title ||
          application.projectTitle ||
          "";

        const proposal =
          application.proposal ||
          application.coverLetter ||
          "";

        return (
          projectTitle.toLowerCase().includes(keyword) ||
          proposal.toLowerCase().includes(keyword)
        );
      });
    }

    // STATUS
    if (statusFilter !== "all") {
      result = result.filter(
        (application) =>
          String(application.status || "").toLowerCase() ===
          statusFilter
      );
    }

    // SORT
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

    return result;
  }, [
    applications,
    search,
    statusFilter,
    sortOrder,
  ]);

  // =====================================================
  // STATS
  // =====================================================

  const totalApplications = applications.length;

  const pendingApplications = applications.filter(
    (application) =>
      String(application.status || "").toLowerCase() ===
      "pending"
  ).length;

  const acceptedApplications = applications.filter(
    (application) =>
      String(application.status || "").toLowerCase() ===
      "accepted"
  ).length;

  const rejectedApplications = applications.filter(
    (application) =>
      String(application.status || "").toLowerCase() ===
      "rejected"
  ).length;

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusClass = (status) => {
    const normalized = String(status || "pending").toLowerCase();

    if (normalized === "accepted") {
      return "application-status accepted";
    }

    if (normalized === "rejected") {
      return "application-status rejected";
    }

    return "application-status pending";
  };

  const getStatusIcon = (status) => {
    const normalized = String(status || "pending").toLowerCase();

    if (normalized === "accepted") {
      return <FaCheck />;
    }

    if (normalized === "rejected") {
      return <FaXmark />;
    }

    return <FaClock />;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="applications-page">
        <div className="applications-container">
          <div className="applications-loading">
            <div className="loading-title"></div>
            <div className="loading-subtitle"></div>

            <div className="loading-grid">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="loading-card"
                ></div>
              ))}
            </div>

            <div className="loading-list"></div>
            <div className="loading-list"></div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="applications-page">
      <div className="applications-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="applications-header">

          <div className="applications-title-section">

            <span className="applications-eyebrow">
              APPLICATION ACTIVITY
            </span>

            <h1>My Applications</h1>

            <p>
              Track and manage the projects you have
              applied for.
            </p>

          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <FaRotate
              className={
                refreshing
                  ? "refresh-icon spinning"
                  : "refresh-icon"
              }
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="application-error">
            <div className="error-symbol">!</div>

            <div>
              <strong>Unable to load applications</strong>
              <p>{error}</p>
            </div>
          </div>
        )}


        {/* =================================================
            STATS
        ================================================= */}

        <div className="application-stats">

          <StatCard
            title="Total Applications"
            value={totalApplications}
            icon={<FaFileLines />}
            type="total"
          />

          <StatCard
            title="Pending"
            value={pendingApplications}
            icon={<FaClock />}
            type="pending"
          />

          <StatCard
            title="Accepted"
            value={acceptedApplications}
            icon={<FaCheck />}
            type="accepted"
          />

          <StatCard
            title="Rejected"
            value={rejectedApplications}
            icon={<FaXmark />}
            type="rejected"
          />

        </div>


        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="application-filter-card">

          <div className="search-box">

            <FaMagnifyingGlass />

            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
              >
                <FaXmark />
              </button>
            )}

          </div>


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="accepted">
              Accepted
            </option>

            <option value="rejected">
              Rejected
            </option>
          </select>


          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value)
            }
          >
            <option value="newest">
              Newest
            </option>

            <option value="oldest">
              Oldest
            </option>
          </select>

        </div>


        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="applications-section-header">

          <div>
            <h2>Your Applications</h2>

            <p>
              {filteredApplications.length} application
              {filteredApplications.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

        </div>


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredApplications.length === 0 ? (

          <div className="applications-empty">

            <div className="empty-icon">
              <FaFileLines />
            </div>

            <h3>
              {applications.length === 0
                ? "No applications yet"
                : "No matching applications"}
            </h3>

            <p>
              {applications.length === 0
                ? "Applications you submit for projects will appear here."
                : "Try changing your search or status filter."}
            </p>

            {applications.length === 0 && (
              <button
                type="button"
                className="find-projects-button"
                onClick={() =>
                  navigate(
                    "/freelancer/browse-projects"
                  )
                }
              >
                Find Projects
                <FaArrowRight />
              </button>
            )}

          </div>

        ) : (

          /* =================================================
             APPLICATION LIST
          ================================================= */

          <div className="applications-list">

            {filteredApplications.map(
              (application) => {

                const project =
                  application.project || {};

                const projectTitle =
                  project.title ||
                  application.projectTitle ||
                  "Untitled Project";

                const description =
                  project.description ||
                  "No project description available.";

                const budget =
                  project.budget ||
                  application.bidAmount ||
                  0;

                const bidAmount =
                  application.bidAmount || 0;

                const status =
                  String(
                    application.status ||
                      "pending"
                  ).toLowerCase();

                const appliedDate =
                  application.createdAt
                    ? new Date(
                        application.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "-";

                return (
                  <div
                    className="application-card"
                    key={application._id}
                  >

                    {/* TOP */}
                    <div className="application-card-top">

                      <div className="project-info">

                        <div className="project-icon">
                          <FaBriefcase />
                        </div>

                        <div className="project-content">

                          <h3>
                            {projectTitle}
                          </h3>

                          <p className="project-description">
                            {description}
                          </p>

                          <div className="project-meta">

                            <span>
                              Bid:
                              <strong>
                                ₹
                                {Number(
                                  bidAmount
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </strong>
                            </span>

                            <span>
                              Budget:
                              <strong>
                                ₹
                                {Number(
                                  budget
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </strong>
                            </span>

                            <span>
                              Applied:
                              <strong>
                                {appliedDate}
                              </strong>
                            </span>

                          </div>

                        </div>

                      </div>


                      {/* STATUS */}

                      <div
                        className={getStatusClass(
                          status
                        )}
                      >
                        {getStatusIcon(status)}

                        <span>
                          {status}
                        </span>
                      </div>

                    </div>


                    {/* PROPOSAL */}

                    {(application.proposal ||
                      application.coverLetter) && (
                      <div className="proposal-box">

                        <div className="proposal-label">
                          <FaFileLines />
                          Your Proposal
                        </div>

                        <p>
                          {application.proposal ||
                            application.coverLetter}
                        </p>

                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>
    </div>
  );
};


// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  title,
  value,
  icon,
  type,
}) => {
  return (
    <div className={`stat-card stat-${type}`}>

      <div className="stat-content">

        <span className="stat-title">
          {title}
        </span>

        <strong className="stat-value">
          {value}
        </strong>

      </div>

      <div className="stat-icon">
        {icon}
      </div>

    </div>
  );
};

export default MyApplication;