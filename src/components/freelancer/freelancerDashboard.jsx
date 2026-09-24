import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  FileText,
  CheckCircle2,
  Clock3,
  Search,
  ArrowRight,
  UserRound,
} from "lucide-react";

// Production API URL
// Vercel will use VITE_API_URL from Environment Variables.
// Local fallback is the Render backend.
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://skillforge-3-xww8.onrender.com/api";

const FreelancerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken");

        if (!token) {
          setError("Please login to view your freelancer dashboard.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/freelancer/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Freelancer Dashboard API:", response.data);

        setDashboard(response.data);
      } catch (err) {
        console.error("Freelancer dashboard error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load freelancer dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Support different backend response structures
  const data = dashboard?.data || dashboard || {};

  // Real statistics from backend
  const stats = [
    {
      title: "Total Projects",
      value:
        data.totalProjects ??
        data.projectsCount ??
        data.projects?.length ??
        0,
      icon: BriefcaseBusiness,
    },
    {
      title: "Applications",
      value:
        data.totalApplications ??
        data.applicationsCount ??
        data.applications?.length ??
        0,
      icon: FileText,
    },
    {
      title: "Completed",
      value:
        data.completedProjects ??
        data.completedJobs ??
        data.completedCount ??
        0,
      icon: CheckCircle2,
    },
    {
      title: "Pending",
      value:
        data.pendingApplications ??
        data.pendingCount ??
        0,
      icon: Clock3,
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="freelancer-dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading freelancer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="freelancer-dashboard-page">

      {/* ================= HEADER ================= */}
      <div className="dashboard-header">
        <div>
          <span className="dashboard-label">
            FREELANCER DASHBOARD
          </span>

          <h1>
            Welcome back
            {data.user?.name ? `, ${data.user.name}` : ""} 👋
          </h1>

          <p>
            Manage your projects, applications and freelance
            activities from one place.
          </p>
        </div>

        <Link
          to="/browse-projects"
          className="browse-project-btn"
        >
          <Search size={18} />
          Browse Projects
        </Link>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* ================= STATS ================= */}
      <div className="dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              className="stat-card"
              key={stat.title}
            >
              <div className="stat-icon">
                <Icon size={22} />
              </div>

              <div>
                <p>{stat.title}</p>
                <h2>{stat.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="dashboard-grid">

        {/* PROFILE */}
        <div className="dashboard-card profile-card">

          <div className="card-header">
            <div>
              <h2>My Profile</h2>
              <p>
                Keep your freelancer profile updated.
              </p>
            </div>

            <UserRound size={22} />
          </div>

          <div className="profile-content">

            <div className="profile-avatar">
              {(data.user?.name || "F")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h3>
                {data.user?.name || "Freelancer"}
              </h3>

              <p>
                {data.user?.email ||
                  "Freelancer account"}
              </p>

              {data.user?.skills?.length > 0 && (
                <div className="skills-list">
                  {data.user.skills
                    .slice(0, 5)
                    .map((skill) => (
                      <span key={skill}>
                        {skill}
                      </span>
                    ))}
                </div>
              )}
            </div>

          </div>

          <Link
            to="/freelancer/profile"
            className="card-link"
          >
            View Profile
            <ArrowRight size={16} />
          </Link>

        </div>

        {/* QUICK ACTIONS */}
        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Quick Actions</h2>
              <p>
                Access your most used freelancer features.
              </p>
            </div>
          </div>

          <div className="quick-actions">

            <Link to="/browse-projects">
              <Search size={18} />
              <span>Browse Projects</span>
              <ArrowRight size={16} />
            </Link>

            <Link to="/freelancer/applications">
              <FileText size={18} />
              <span>My Applications</span>
              <ArrowRight size={16} />
            </Link>

            <Link to="/freelancer/profile">
              <UserRound size={18} />
              <span>Edit Profile</span>
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>
      </div>

      {/* ================= RECENT APPLICATIONS ================= */}
      <div className="dashboard-card recent-card">

        <div className="card-header">

          <div>
            <h2>Recent Applications</h2>
            <p>
              Your latest project applications.
            </p>
          </div>

          <Link to="/freelancer/applications">
            View All
          </Link>

        </div>

        {data.applications?.length > 0 ? (

          <div className="applications-list">

            {data.applications
              .slice(0, 5)
              .map((application) => (

                <div
                  className="application-row"
                  key={application._id}
                >

                  <div>
                    <h3>
                      {application.project?.title ||
                        application.title ||
                        "Project"}
                    </h3>

                    <span>
                      Status:{" "}
                      {application.status ||
                        "pending"}
                    </span>
                  </div>

                  <Link
                    to={`/projects/${
                      application.project?._id ||
                      application.project ||
                      ""
                    }`}
                  >
                    View
                    <ArrowRight size={15} />
                  </Link>

                </div>

              ))}

          </div>

        ) : (

          <div className="empty-state">

            <FileText size={40} />

            <h3>
              No applications yet
            </h3>

            <p>
              Browse available projects and
              submit your first proposal.
            </p>

            <Link to="/browse-projects">
              Browse Projects
              <ArrowRight size={16} />
            </Link>

          </div>

        )}

      </div>

      {/* ================= STYLES ================= */}
      <style>{`

        .freelancer-dashboard-page {
          min-height: 100vh;
          padding: 32px;
          background: #f7f8fc;
          color: #172033;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          margin-bottom: 28px;
        }

        .dashboard-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.2px;
          color: #6366f1;
        }

        .dashboard-header h1 {
          margin: 8px 0;
          font-size: 32px;
          font-weight: 800;
        }

        .dashboard-header p {
          margin: 0;
          color: #697386;
        }

        .browse-project-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: 10px;
          background: #4f46e5;
          color: white;
          text-decoration: none;
          font-weight: 600;
        }

        .browse-project-btn:hover {
          background: #4338ca;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 24px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 22px;
          background: white;
          border: 1px solid #e7e9f0;
          border-radius: 14px;
        }

        .stat-icon {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #eef2ff;
          color: #4f46e5;
        }

        .stat-card p {
          margin: 0 0 5px;
          color: #747b8c;
          font-size: 13px;
        }

        .stat-card h2 {
          margin: 0;
          font-size: 24px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .dashboard-card {
          background: white;
          border: 1px solid #e7e9f0;
          border-radius: 14px;
          padding: 24px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 20px;
        }

        .card-header h2 {
          margin: 0 0 5px;
          font-size: 19px;
        }

        .card-header p {
          margin: 0;
          color: #7a8191;
          font-size: 13px;
        }

        .profile-content {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .profile-avatar {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #4f46e5;
          color: white;
          font-size: 22px;
          font-weight: 700;
        }

        .profile-content h3 {
          margin: 0 0 5px;
        }

        .profile-content p {
          margin: 0;
          color: #7a8191;
          font-size: 13px;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }

        .skills-list span {
          padding: 5px 9px;
          border-radius: 6px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 11px;
          font-weight: 600;
        }

        .card-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #4f46e5;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .quick-actions a {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px;
          border: 1px solid #eceef4;
          border-radius: 9px;
          color: #30384a;
          text-decoration: none;
        }

        .quick-actions a span {
          flex: 1;
        }

        .quick-actions a:hover {
          background: #f8f9ff;
          color: #4f46e5;
        }

        .recent-card {
          margin-bottom: 20px;
        }

        .recent-card .card-header > a {
          color: #4f46e5;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .applications-list {
          display: flex;
          flex-direction: column;
        }

        .application-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 16px 0;
          border-top: 1px solid #eceef4;
        }

        .application-row h3 {
          margin: 0 0 6px;
          font-size: 15px;
        }

        .application-row span {
          color: #7a8191;
          font-size: 13px;
        }

        .application-row a {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #4f46e5;
          text-decoration: none;
          font-weight: 600;
          font-size: 13px;
        }

        .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #7a8191;
        }

        .empty-state h3 {
          color: #30384a;
          margin: 12px 0 5px;
        }

        .empty-state p {
          margin: 0 0 18px;
        }

        .empty-state a {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 15px;
          border-radius: 8px;
          background: #4f46e5;
          color: white;
          text-decoration: none;
          font-weight: 600;
        }

        .dashboard-loading {
          min-height: 500px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 12px;
          color: #697386;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .dashboard-error {
          margin-bottom: 20px;
          padding: 14px 16px;
          border-radius: 9px;
          background: #fff1f2;
          color: #be123c;
          border: 1px solid #fecdd3;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .freelancer-dashboard-page {
            padding: 18px;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .dashboard-stats {
            grid-template-columns: 1fr;
          }
        }

      `}</style>
    </div>
  );
};

export default FreelancerDashboard;