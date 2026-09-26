import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  FileText,
  CheckCircle2,
  Clock3,
  ArrowRight,
  User,
  IndianRupee,
  Star,
  MapPin,
  Mail,
  Phone,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import FreelancerStatCard from "../../components/freelancer/FreelancerStatCard";
import ProjectCard from "../../components/freelancer/ProjectCard";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://skillforge-3-xww8.onrender.com/api";

const FreelancerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Please login to view your dashboard.");
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

      const result = response.data;

      setDashboard(result?.data || result || {});
    } catch (err) {
      console.error("Freelancer dashboard error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load freelancer dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingBox}>
          <RefreshCw size={28} className="spin" />
          <p>Loading freelancer dashboard...</p>
        </div>

        <style>{`
          .spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBox}>
          <AlertCircle size={32} />

          <h2>Unable to load dashboard</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={fetchDashboard}
            style={styles.retryButton}
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const data = dashboard || {};

  const user = data.user || data.freelancer || {};

  const applications = Array.isArray(data.applications)
    ? data.applications
    : [];

  const projects = Array.isArray(data.projects)
    ? data.projects
    : [];

  const recommendedProjects = Array.isArray(
    data.recommendedProjects
  )
    ? data.recommendedProjects
    : [];

  const stats = {
    totalProjects:
      data.totalProjects ??
      data.projectsCount ??
      projects.length ??
      0,

    totalApplications:
      data.totalApplications ??
      data.applicationsCount ??
      applications.length ??
      0,

    completedProjects:
      data.completedProjects ??
      data.completedJobs ??
      data.completedCount ??
      0,

    pendingApplications:
      data.pendingApplications ??
      data.pendingCount ??
      applications.filter(
        (item) =>
          String(item?.status || "").toLowerCase() === "pending"
      ).length ??
      0,
  };

  const name =
    user?.name ||
    user?.fullName ||
    "Freelancer";

  const email = user?.email || "Not available";

  const phone =
    user?.phone ||
    user?.mobile ||
    "Not available";

  const bio =
    user?.bio ||
    "Complete your profile to attract more clients.";

  const location =
    user?.location ||
    "Location not added";

  const skills = Array.isArray(user?.skills)
    ? user.skills
    : typeof user?.skills === "string"
    ? user.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  const rating =
    user?.rating ??
    user?.averageRating ??
    0;

  const hourlyRate =
    user?.hourlyRate ??
    user?.rate ??
    user?.expectedRate ??
    0;

  return (
    <div style={styles.page}>
      {/* Header */}
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>FREELANCER DASHBOARD</p>

          <h1 style={styles.title}>
            Welcome back, {name} 👋
          </h1>

          <p style={styles.subtitle}>
            Track your projects, applications and freelance
            activity from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboard}
          style={styles.refreshButton}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </section>

      {/* Stats */}
      <section style={styles.statsGrid}>
        <FreelancerStatCard
          title="Projects"
          value={stats.totalProjects}
          icon={<BriefcaseBusiness size={22} />}
        />

        <FreelancerStatCard
          title="Applications"
          value={stats.totalApplications}
          icon={<FileText size={22} />}
        />

        <FreelancerStatCard
          title="Completed"
          value={stats.completedProjects}
          icon={<CheckCircle2 size={22} />}
        />

        <FreelancerStatCard
          title="Pending"
          value={stats.pendingApplications}
          icon={<Clock3 size={22} />}
        />
      </section>

      {/* Main Grid */}
      <section style={styles.mainGrid}>
        {/* Profile */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                My Profile
              </h2>

              <p style={styles.cardSubtitle}>
                Your freelancer information
              </p>
            </div>

            <Link
              to="/freelancer/profile"
              style={styles.secondaryButton}
            >
              Edit Profile
            </Link>
          </div>

          <div style={styles.profileTop}>
            <div style={styles.avatar}>
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={name}
                  style={styles.avatarImage}
                />
              ) : (
                <User size={34} />
              )}
            </div>

            <div>
              <h3 style={styles.profileName}>
                {name}
              </h3>

              <p style={styles.profileRole}>
                Freelancer
              </p>
            </div>
          </div>

          <p style={styles.bio}>{bio}</p>

          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <Mail size={17} />
              <span>{email}</span>
            </div>

            <div style={styles.infoItem}>
              <Phone size={17} />
              <span>{phone}</span>
            </div>

            <div style={styles.infoItem}>
              <MapPin size={17} />
              <span>{location}</span>
            </div>

            <div style={styles.infoItem}>
              <Star size={17} />
              <span>
                Rating: {Number(rating).toFixed(1)}
              </span>
            </div>

            <div style={styles.infoItem}>
              <IndianRupee size={17} />
              <span>
                Rate: ₹{Number(hourlyRate).toLocaleString()}
              </span>
            </div>
          </div>

          {skills.length > 0 && (
            <div style={styles.skillsSection}>
              <h3 style={styles.smallTitle}>
                Skills
              </h3>

              <div style={styles.skills}>
                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    style={styles.skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                Quick Actions
              </h2>

              <p style={styles.cardSubtitle}>
                Manage your freelance work
              </p>
            </div>
          </div>

          <div style={styles.actionList}>
            <Link
              to="/browse-projects"
              style={styles.actionButton}
            >
              <div style={styles.actionIcon}>
                <BriefcaseBusiness size={20} />
              </div>

              <div style={styles.actionContent}>
                <strong>Browse Projects</strong>
                <span>
                  Find new projects that match your skills
                </span>
              </div>

              <ArrowRight size={18} />
            </Link>

            <Link
              to="/freelancer/applications"
              style={styles.actionButton}
            >
              <div style={styles.actionIcon}>
                <FileText size={20} />
              </div>

              <div style={styles.actionContent}>
                <strong>My Applications</strong>
                <span>
                  Track your submitted proposals
                </span>
              </div>

              <ArrowRight size={18} />
            </Link>

            <Link
              to="/freelancer/profile"
              style={styles.actionButton}
            >
              <div style={styles.actionIcon}>
                <User size={20} />
              </div>

              <div style={styles.actionContent}>
                <strong>Update Profile</strong>
                <span>
                  Keep your freelancer profile updated
                </span>
              </div>

              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              Recent Applications
            </h2>

            <p style={styles.sectionSubtitle}>
              Your latest project applications
            </p>
          </div>

          <Link
            to="/freelancer/applications"
            style={styles.viewAll}
          >
            View All
            <ArrowRight size={17} />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div style={styles.emptyState}>
            <FileText size={36} />

            <h3>No applications yet</h3>

            <p>
              Start applying to projects that match your
              skills.
            </p>

            <Link
              to="/browse-projects"
              style={styles.primaryButton}
            >
              Browse Projects
            </Link>
          </div>
        ) : (
          <div style={styles.applicationGrid}>
            {applications.slice(0, 6).map((application, index) => {
              const project =
                application?.project ||
                application?.projectId ||
                {};

              return (
                <div
                  key={
                    application?._id ||
                    application?.id ||
                    index
                  }
                  style={styles.applicationCard}
                >
                  <div>
                    <h3 style={styles.applicationTitle}>
                      {project?.title ||
                        application?.title ||
                        "Project Application"}
                    </h3>

                    <p style={styles.applicationDescription}>
                      {application?.proposal
                        ? application.proposal.length > 120
                          ? `${application.proposal.slice(
                              0,
                              120
                            )}...`
                          : application.proposal
                        : "Application submitted successfully."}
                    </p>
                  </div>

                  <div style={styles.applicationFooter}>
                    <span
                      style={{
                        ...styles.status,
                        ...(String(
                          application?.status || ""
                        ).toLowerCase() === "accepted"
                          ? styles.accepted
                          : String(
                              application?.status || ""
                            ).toLowerCase() === "rejected"
                          ? styles.rejected
                          : styles.pending),
                      }}
                    >
                      {application?.status || "Pending"}
                    </span>

                    {application?.bidAmount != null && (
                      <strong>
                        ₹
                        {Number(
                          application.bidAmount
                        ).toLocaleString()}
                      </strong>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recommended Projects */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              Recommended Projects
            </h2>

            <p style={styles.sectionSubtitle}>
              Projects that may match your skills
            </p>
          </div>

          <Link
            to="/browse-projects"
            style={styles.viewAll}
          >
            Browse All
            <ArrowRight size={17} />
          </Link>
        </div>

        {recommendedProjects.length === 0 ? (
          <div style={styles.emptyState}>
            <BriefcaseBusiness size={36} />

            <h3>No recommendations available</h3>

            <p>
              Update your skills and profile to get better
              project recommendations.
            </p>

            <Link
              to="/freelancer/profile"
              style={styles.primaryButton}
            >
              Update Profile
            </Link>
          </div>
        ) : (
          <div style={styles.projectGrid}>
            {recommendedProjects
              .slice(0, 6)
              .map((project, index) => (
                <ProjectCard
                  key={
                    project?._id ||
                    project?.id ||
                    index
                  }
                  project={project}
                />
              ))}
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
    color: "#172033",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "28px",
  },

  eyebrow: {
    margin: "0 0 8px",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1.5px",
    color: "#6366f1",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 800,
    letterSpacing: "-0.8px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "15px",
  },

  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#334155",
    padding: "11px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.35fr) minmax(0, 1fr)",
    gap: "22px",
    marginBottom: "30px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "24px",
    boxShadow:
      "0 8px 30px rgba(15, 23, 42, 0.06)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "22px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: 800,
  },

  cardSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  secondaryButton: {
    textDecoration: "none",
    padding: "9px 13px",
    borderRadius: "9px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "13px",
    fontWeight: 700,
  },

  profileTop: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "18px",
  },

  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#ffffff",
    overflow: "hidden",
    flexShrink: 0,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  profileName: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
  },

  profileRole: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  bio: {
    margin: "0 0 20px",
    color: "#475569",
    fontSize: "14px",
    lineHeight: 1.7,
  },

  infoList: {
    display: "grid",
    gap: "12px",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#64748b",
    fontSize: "13px",
  },

  skillsSection: {
    marginTop: "22px",
    paddingTop: "20px",
    borderTop: "1px solid #eef2f7",
  },

  smallTitle: {
    margin: "0 0 12px",
    fontSize: "14px",
    fontWeight: 800,
  },

  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  skill: {
    padding: "7px 10px",
    borderRadius: "8px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "12px",
    fontWeight: 700,
  },

  actionList: {
    display: "grid",
    gap: "12px",
  },

  actionButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    textDecoration: "none",
    color: "#172033",
    background: "#ffffff",
  },

  actionIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2ff",
    color: "#4f46e5",
    flexShrink: 0,
  },

  actionContent: {
    display: "grid",
    gap: "4px",
    flex: 1,
  },

  section: {
    marginBottom: "30px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "16px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
    fontWeight: 800,
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  viewAll: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
    color: "#4f46e5",
    fontSize: "13px",
    fontWeight: 800,
  },

  applicationGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },

  applicationCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "15px",
    padding: "18px",
    boxShadow:
      "0 6px 20px rgba(15, 23, 42, 0.04)",
  },

  applicationTitle: {
    margin: "0 0 8px",
    fontSize: "16px",
    fontWeight: 800,
  },

  applicationDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.6,
  },

  applicationFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "18px",
    paddingTop: "14px",
    borderTop: "1px solid #eef2f7",
  },

  status: {
    display: "inline-flex",
    padding: "6px 9px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "capitalize",
  },

  pending: {
    background: "#fef3c7",
    color: "#92400e",
  },

  accepted: {
    background: "#dcfce7",
    color: "#166534",
  },

  rejected: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  projectGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },

  emptyState: {
    background: "#ffffff",
    border: "1px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "42px 20px",
    textAlign: "center",
    color: "#64748b",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "14px",
    padding: "10px 16px",
    borderRadius: "9px",
    background: "#4f46e5",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "13px",
  },

  loadingBox: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "12px",
    color: "#4f46e5",
  },

  errorBox: {
    maxWidth: "520px",
    margin: "100px auto",
    padding: "32px",
    borderRadius: "18px",
    background: "#ffffff",
    border: "1px solid #fecaca",
    color: "#991b1b",
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.08)",
  },

  retryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    border: 0,
    borderRadius: "9px",
    padding: "11px 16px",
    background: "#4f46e5",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default FreelancerDashboard;