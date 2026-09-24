import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaProjectDiagram,
  FaUserTie,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowRight,
  FaChartLine,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import API from "../../Services/api";
import "./admin.css";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/admin/dashboard");

      setDashboard(response.data?.dashboard || response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const getValue = (...values) => {
    for (const value of values) {
      if (value !== undefined && value !== null) return value;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-error">
          <FaShieldAlt />
          <h3>Unable to load dashboard</h3>
          <p>{error}</p>

          <button onClick={fetchDashboard} className="admin-primary-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalUsers = getValue(
    dashboard?.totalUsers,
    dashboard?.users,
    dashboard?.counts?.users
  );

  const totalFreelancers = getValue(
    dashboard?.totalFreelancers,
    dashboard?.freelancers,
    dashboard?.counts?.freelancers
  );

  const totalClients = getValue(
    dashboard?.totalClients,
    dashboard?.clients,
    dashboard?.counts?.clients
  );

  const totalProjects = getValue(
    dashboard?.totalProjects,
    dashboard?.projects,
    dashboard?.counts?.projects
  );

  const completedProjects = getValue(
    dashboard?.completedProjects,
    dashboard?.completed,
    dashboard?.counts?.completedProjects
  );

  const activeProjects = getValue(
    dashboard?.activeProjects,
    dashboard?.inProgressProjects,
    dashboard?.counts?.activeProjects
  );

  const revenue = getValue(
    dashboard?.revenue,
    dashboard?.totalRevenue,
    dashboard?.payments?.revenue
  );

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <FaUsers />,
      link: "/admin/users",
    },
    {
      title: "Freelancers",
      value: totalFreelancers,
      icon: <FaUserTie />,
      link: "/admin/users",
    },
    {
      title: "Clients",
      value: totalClients,
      icon: <FaUsers />,
      link: "/admin/users",
    },
    {
      title: "Total Projects",
      value: totalProjects,
      icon: <FaProjectDiagram />,
      link: "/admin/projects",
    },
    {
      title: "Active Projects",
      value: activeProjects,
      icon: <FaChartLine />,
      link: "/admin/projects",
    },
    {
      title: "Completed Projects",
      value: completedProjects,
      icon: <FaCheckCircle />,
      link: "/admin/projects",
    },
    {
      title: "Revenue",
      value: `₹${Number(revenue || 0).toLocaleString("en-IN")}`,
      icon: <FaMoneyBillWave />,
      link: "/admin/analytics",
    },
  ];

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* Header */}
        <div className="admin-header">
          <div>
            <span className="admin-eyebrow">
              <FaShieldAlt /> ADMIN PANEL
            </span>

            <h1>Admin Dashboard</h1>

            <p>
              Monitor SkillForge users, projects, activity and platform
              performance.
            </p>
          </div>

          <button
            className="admin-refresh-btn"
            onClick={fetchDashboard}
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats-grid">
          {stats.map((stat, index) => (
            <Link
              to={stat.link}
              className="admin-stat-card"
              key={index}
            >
              <div className="admin-stat-top">
                <div className="admin-stat-icon">
                  {stat.icon}
                </div>

                <span className="admin-stat-arrow">
                  <FaArrowUp />
                </span>
              </div>

              <div className="admin-stat-value">
                {stat.value}
              </div>

              <div className="admin-stat-title">
                {stat.title}
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage important areas of the platform.</p>
            </div>
          </div>

          <div className="admin-action-grid">

            <Link to="/admin/users" className="admin-action-card">
              <div className="admin-action-icon">
                <FaUsers />
              </div>

              <div>
                <h3>Manage Users</h3>
                <p>
                  View, activate or deactivate platform users.
                </p>
              </div>

              <FaArrowRight />
            </Link>

            <Link to="/admin/projects" className="admin-action-card">
              <div className="admin-action-icon">
                <FaProjectDiagram />
              </div>

              <div>
                <h3>Manage Projects</h3>
                <p>
                  Review and manage client projects.
                </p>
              </div>

              <FaArrowRight />
            </Link>

            <Link to="/admin/analytics" className="admin-action-card">
              <div className="admin-action-icon">
                <FaChartLine />
              </div>

              <div>
                <h3>View Analytics</h3>
                <p>
                  Analyze platform activity and revenue.
                </p>
              </div>

              <FaArrowRight />
            </Link>

          </div>
        </section>

        {/* System Status */}
        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <h2>Platform Status</h2>
              <p>Current SkillForge system overview.</p>
            </div>
          </div>

          <div className="admin-status-grid">

            <div className="admin-status-card">
              <div className="status-dot active"></div>
              <div>
                <strong>User Management</strong>
                <span>Operational</span>
              </div>
            </div>

            <div className="admin-status-card">
              <div className="status-dot active"></div>
              <div>
                <strong>Project Management</strong>
                <span>Operational</span>
              </div>
            </div>

            <div className="admin-status-card">
              <div className="status-dot active"></div>
              <div>
                <strong>Analytics</strong>
                <span>Operational</span>
              </div>
            </div>

            <div className="admin-status-card">
              <div className="status-dot active"></div>
              <div>
                <strong>Authentication</strong>
                <span>Operational</span>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;