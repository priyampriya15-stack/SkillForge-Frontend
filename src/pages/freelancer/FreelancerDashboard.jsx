import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaMoneyBillWave,
  FaSearch,
  FaArrowRight,
  FaSpinner,
  FaExclamationCircle,
  FaFolderOpen,
  FaComments,
  FaClock,
  FaCalendarAlt,
  FaRupeeSign,
  FaHourglassHalf,
} from "react-icons/fa";

import FreelancerStatCard from "../../Components/freelancer/freelancerStatCard";
import ProjectCard from "../../Components/freelancer/ProjectCard";

import { getProjects } from "../../Services/projectService";
import { getMyApplications } from "../../Services/applicationService";


/* =========================================================
   HELPERS
========================================================= */

const getClientId = (project = {}) => {
  const directId =
    project?.clientId ||
    project?.client_id ||
    project?.clientUserId ||
    project?.clientUser?.id ||
    project?.clientUser?._id;

  if (directId) return String(directId);

  const client =
    project?.client ||
    project?.postedBy ||
    project?.createdBy ||
    project?.owner ||
    project?.user;

  if (!client) return "";

  const clientId =
    client?._id ||
    client?.id ||
    client?.userId ||
    client?.user?._id ||
    client?.user?.id ||
    client?.$oid;

  return clientId ? String(clientId) : "";
};


const extractProjects = (response) => {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.projects)) {
    return response.projects;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.projects)) {
    return response.data.projects;
  }

  return [];
};


const extractApplications = (response) => {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.applications)) {
    return response.applications;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.applications)) {
    return response.data.applications;
  }

  return [];
};


const formatCurrency = (amount) => {
  const value = Number(amount || 0);

  if (!value || value <= 0) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};


const formatDate = (date) => {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "N/A";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


/* =========================================================
   APPLICATION CARD
========================================================= */

const DashboardApplicationCard = ({ application }) => {
  const navigate = useNavigate();

  const project = application?.project || {};

  const title =
    project?.title ||
    project?.name ||
    "Untitled Project";

  const category =
    project?.category ||
    "Software Development";

  const status =
    String(application?.status || "pending").toLowerCase();

  const clientName =
    project?.client?.name ||
    project?.client?.fullName ||
    project?.postedBy?.name ||
    "Client";

  const bidAmount =
    Number(application?.bidAmount || 0);

  const appliedDate =
    application?.createdAt;

  const deadline =
    project?.deadline;

  const proposal =
    application?.proposal ||
    "No proposal added.";

  const getStatusClass = () => {
    if (status === "accepted") return "accepted";
    if (status === "rejected") return "rejected";
    return "pending";
  };

  const getStatusLabel = () => {
    if (status === "accepted") return "Accepted";
    if (status === "rejected") return "Rejected";
    return "Pending";
  };

  const handleViewProject = () => {
    const projectId =
      project?._id ||
      project?.id;

    if (!projectId) return;

    navigate(`/freelancer/projects/${projectId}`);
  };

  return (
    <div className="dashboard-application-card">

      {/* TOP */}
      <div className="dashboard-application-top">

        <div className="dashboard-application-title-area">

          <div className="dashboard-application-icon">
            <FaBriefcase />
          </div>

          <div>
            <h3>{title}</h3>

            <span className="dashboard-application-category">
              {category}
            </span>
          </div>

        </div>

        <span
          className={`dashboard-application-status ${getStatusClass()}`}
        >
          <span className="dashboard-status-dot"></span>
          {getStatusLabel()}
        </span>

      </div>


      {/* CLIENT */}
      <div className="dashboard-application-client">

        <FaBriefcase />

        <span>
          Project posted by{" "}
          <strong>{clientName}</strong>
        </span>

      </div>


      {/* DETAILS */}
      <div className="dashboard-application-details">

        <div className="dashboard-application-detail">

          <div className="dashboard-detail-icon green">
            <FaRupeeSign />
          </div>

          <div>
            <small>Your Bid</small>

            <strong>
              {formatCurrency(bidAmount)}
            </strong>
          </div>

        </div>


        <div className="dashboard-application-detail">

          <div className="dashboard-detail-icon purple">
            <FaCalendarAlt />
          </div>

          <div>
            <small>Applied On</small>

            <strong>
              {formatDate(appliedDate)}
            </strong>
          </div>

        </div>


        <div className="dashboard-application-detail">

          <div className="dashboard-detail-icon orange">
            <FaClock />
          </div>

          <div>
            <small>Deadline</small>

            <strong>
              {formatDate(deadline)}
            </strong>
          </div>

        </div>

      </div>


      {/* PROPOSAL */}
      <div className="dashboard-application-proposal">

        <div className="dashboard-proposal-icon">
          <FaFileAlt />
        </div>

        <div>
          <span>Proposal</span>

          <p>
            {proposal}
          </p>
        </div>

      </div>


      {/* FOOTER */}
      <div className="dashboard-application-footer">

        <div className="dashboard-application-waiting">

          {status === "pending" ? (
            <>
              <FaHourglassHalf />
              <span>Waiting for client response</span>
            </>
          ) : status === "accepted" ? (
            <>
              <FaCheckCircle />
              <span>Application accepted</span>
            </>
          ) : (
            <>
              <FaExclamationCircle />
              <span>Application rejected</span>
            </>
          )}

        </div>


        <button
          type="button"
          onClick={handleViewProject}
          className="dashboard-view-project-btn"
        >
          View Project
          <FaArrowRight />
        </button>

      </div>

    </div>
  );
};


/* =========================================================
   ACTIVE PROJECT
========================================================= */

const ActiveProject = ({ application }) => {
  const navigate = useNavigate();

  const project =
    application?.project || {};

  const projectId =
    project?._id ||
    project?.id ||
    "";

  const title =
    project?.title ||
    "Untitled Project";

  const budget =
    Number(
      project?.budget ||
      application?.bidAmount ||
      0
    );

  const clientId =
    getClientId(project);

  const clientName =
    project?.client?.name ||
    project?.client?.fullName ||
    project?.postedBy?.name ||
    "Client";

  const handleProjectClick = () => {
    if (!projectId) return;

    navigate(
      `/freelancer/projects/${projectId}`
    );
  };

  const handleChat = (event) => {
    event.stopPropagation();

    if (!clientId) {
      alert(
        "Client information is not available."
      );
      return;
    }

    navigate(`/chat/${clientId}`);
  };

  return (
    <div className="dashboard-active-project-wrapper">

      <button
        type="button"
        className="dashboard-active-project"
        onClick={handleProjectClick}
      >

        <div className="dashboard-active-top">

          <div className="dashboard-active-icon">
            <FaBriefcase />
          </div>

          <div className="dashboard-active-info">

            <h3>{title}</h3>

            <span>
              {formatCurrency(budget)}
            </span>

          </div>

          <FaArrowRight
            className="dashboard-active-arrow"
          />

        </div>


        <div className="dashboard-progress">

          <div className="dashboard-progress-top">

            <span>Project progress</span>

            <strong>0%</strong>

          </div>

          <div className="dashboard-progress-track">

            <div
              className="dashboard-progress-fill"
              style={{
                width: "0%",
              }}
            />

          </div>

        </div>

      </button>


      {clientId && (
        <button
          type="button"
          className="dashboard-chat-btn"
          onClick={handleChat}
        >
          <FaComments />
          Chat with {clientName}
        </button>
      )}

    </div>
  );
};


/* =========================================================
   MAIN DASHBOARD
========================================================= */

const FreelancerDashboard = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [projects, setProjects] =
    useState([]);

  const [applications, setApplications] =
    useState([]);


  /* =======================================================
     LOAD USER
  ======================================================= */

  const loadUser = () => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        setUser({});
        return;
      }

      const parsed =
        JSON.parse(storedUser);

      setUser(
        parsed &&
        typeof parsed === "object"
          ? parsed
          : {}
      );

    } catch (error) {

      console.error(
        "USER LOAD ERROR:",
        error
      );

      setUser({});

    }
  };


  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  const loadDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      loadUser();


      /* -----------------------------------------------
         LOAD PROJECTS
      ------------------------------------------------ */

      console.log(
        "Loading freelancer dashboard..."
      );

      const projectResponse =
        await getProjects({
          status: "open",
        });

      console.log(
        "Freelancer projects response:",
        projectResponse
      );

      const projectList =
        extractProjects(projectResponse);

      console.log(
        "Projects:",
        projectList
      );

      setProjects(projectList);


      /* -----------------------------------------------
         LOAD APPLICATIONS
      ------------------------------------------------ */

      console.log(
        "GETTING MY APPLICATIONS..."
      );

      const applicationResponse =
        await getMyApplications();

      console.log(
        "MY APPLICATIONS RESPONSE:",
        applicationResponse
      );

      const applicationList =
        extractApplications(
          applicationResponse
        );

      console.log(
        "MY APPLICATION LIST:",
        applicationList
      );

      setApplications(
        applicationList
      );

    } catch (error) {

      console.error(
        "FREELANCER DASHBOARD ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load dashboard."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadDashboard();
  }, []);


  /* =======================================================
     USER NAME
  ======================================================= */

  const firstName = useMemo(() => {

    const name =
      user?.name ||
      user?.username ||
      user?.fullName ||
      "Freelancer";

    return (
      String(name)
        .trim()
        .split(/\s+/)[0] ||
      "Freelancer"
    );

  }, [user]);


  /* =======================================================
     RECOMMENDED PROJECTS
  ======================================================= */

  const recommendedProjects =
    useMemo(() => {

      return projects
        .filter((project) => {

          const status =
            String(
              project?.status || ""
            ).toLowerCase();

          return (
            status === "open" ||
            status === "active"
          );

        })
        .slice(0, 4);

    }, [projects]);


  /* =======================================================
     ACCEPTED APPLICATIONS
  ======================================================= */

  const acceptedApplications =
    useMemo(() => {

      return applications.filter(
        (application) =>
          String(
            application?.status || ""
          ).toLowerCase() === "accepted"
      );

    }, [applications]);


  /* =======================================================
     RECENT APPLICATIONS
  ======================================================= */

  const recentApplications =
    useMemo(() => {

      return [...applications]
        .sort(
          (a, b) =>
            new Date(
              b?.createdAt || 0
            ) -
            new Date(
              a?.createdAt || 0
            )
        )
        .slice(0, 3);

    }, [applications]);


  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {

    const completed =
      applications.filter(
        (application) => {

          const projectStatus =
            String(
              application?.project?.status ||
              ""
            ).toLowerCase();

          return (
            projectStatus ===
            "completed"
          );

        }
      ).length;


    const earnings =
      acceptedApplications.reduce(
        (total, application) => {

          const amount =
            Number(
              application?.bidAmount || 0
            );

          return total + amount;

        },
        0
      );


    return {

      applications:
        applications.length,

      activeProjects:
        acceptedApplications.length,

      completedProjects:
        completed,

      earnings,

    };

  }, [
    applications,
    acceptedApplications,
  ]);


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const handleBrowseProjects = () => {

    navigate(
      "/freelancer/browse-projects"
    );

  };


  const handleApplications = () => {

    navigate(
      "/freelancer/my-applications"
    );

  };


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <div className="freelancer-dashboard-loading">

        <FaSpinner
          className="freelancer-dashboard-spinner"
        />

        <p>
          Loading your dashboard...
        </p>

        <style>{dashboardStyles}</style>

      </div>

    );

  }


  /* =======================================================
     UI
  ======================================================= */

  return (

    <div className="freelancer-dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="freelancer-dashboard-header">

        <div>

          <p className="freelancer-dashboard-eyebrow">
            Freelancer Workspace
          </p>

          <h1>
            Welcome back, {firstName} 👋
          </h1>

          <p className="dashboard-header-description">
            Find projects, manage your work,
            and connect with clients.
          </p>

        </div>


        <button
          type="button"
          className="freelancer-dashboard-browse-btn"
          onClick={handleBrowseProjects}
        >

          <FaSearch />

          Browse Projects

        </button>

      </section>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="freelancer-dashboard-error">

          <FaExclamationCircle />

          <span>{error}</span>

          <button
            type="button"
            onClick={loadDashboard}
          >
            Retry
          </button>

        </div>

      )}


      {/* =================================================
          STATS
      ================================================= */}

      <section className="freelancer-dashboard-stats">

        <FreelancerStatCard
          title="Applications"
          value={stats.applications}
          icon={<FaFileAlt />}
        />

        <FreelancerStatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<FaBriefcase />}
        />

        <FreelancerStatCard
          title="Completed Projects"
          value={stats.completedProjects}
          icon={<FaCheckCircle />}
        />

        <FreelancerStatCard
          title="Total Earnings"
          value={formatCurrency(stats.earnings)}
          icon={<FaMoneyBillWave />}
        />

      </section>


      {/* =================================================
          RECOMMENDED PROJECTS
      ================================================= */}

      <section className="freelancer-dashboard-section">

        <div className="freelancer-dashboard-section-header">

          <div>

            <span className="freelancer-dashboard-section-label">
              Opportunities
            </span>

            <h2>
              Recommended Projects
            </h2>

          </div>

          <button
            type="button"
            className="freelancer-dashboard-view-btn"
            onClick={handleBrowseProjects}
          >
            View all
            <FaArrowRight />
          </button>

        </div>


        {recommendedProjects.length > 0 ? (

          <div className="freelancer-dashboard-project-grid">

            {recommendedProjects.map(
              (project, index) => (

                <ProjectCard
                  key={
                    project?._id ||
                    project?.id ||
                    index
                  }
                  project={project}
                />

              )
            )}

          </div>

        ) : (

          <div className="freelancer-dashboard-empty">

            <FaFolderOpen />

            <h3>
              No projects available
            </h3>

            <p>
              New projects will appear here
              when they become available.
            </p>

            <button
              type="button"
              onClick={handleBrowseProjects}
            >
              Browse Projects
            </button>

          </div>

        )}

      </section>


      {/* =================================================
          ACTIVE PROJECTS
      ================================================= */}

      <section className="freelancer-dashboard-section">

        <div className="freelancer-dashboard-section-header">

          <div>

            <span className="freelancer-dashboard-section-label">
              Your Work
            </span>

            <h2>
              Active Projects
            </h2>

          </div>

        </div>


        {acceptedApplications.length > 0 ? (

          <div className="dashboard-active-list">

            {acceptedApplications
              .slice(0, 3)
              .map(
                (application, index) => (

                  <ActiveProject
                    key={
                      application?._id ||
                      index
                    }
                    application={
                      application
                    }
                  />

                )
              )}

          </div>

        ) : (

          <div className="freelancer-dashboard-empty">

            <FaBriefcase />

            <h3>
              No active projects
            </h3>

            <p>
              Your active projects will
              appear here after a client
              accepts your application.
            </p>

            <button
              type="button"
              onClick={handleBrowseProjects}
            >
              Find a Project
            </button>

          </div>

        )}

      </section>


      {/* =================================================
          RECENT APPLICATIONS
      ================================================= */}

      <section className="freelancer-dashboard-section">

        <div className="freelancer-dashboard-section-header">

          <div>

            <span className="freelancer-dashboard-section-label">
              Applications
            </span>

            <h2>
              Recent Applications
            </h2>

          </div>


          <button
            type="button"
            className="freelancer-dashboard-view-btn"
            onClick={handleApplications}
          >
            View all
            <FaArrowRight />
          </button>

        </div>


        {recentApplications.length > 0 ? (

          <div className="dashboard-applications-list">

            {recentApplications.map(
              (application, index) => (

                <DashboardApplicationCard
                  key={
                    application?._id ||
                    index
                  }
                  application={
                    application
                  }
                />

              )
            )}

          </div>

        ) : (

          <div className="freelancer-dashboard-empty">

            <FaFileAlt />

            <h3>
              No recent applications
            </h3>

            <p>
              Applications you submit will
              appear here.
            </p>

            <button
              type="button"
              onClick={handleBrowseProjects}
            >
              Browse Projects
            </button>

          </div>

        )}

      </section>


      <style>{dashboardStyles}</style>

    </div>

  );
};


/* =========================================================
   WHITE DASHBOARD STYLES
========================================================= */

const dashboardStyles = `

/* =========================================================
   PAGE
========================================================= */

.freelancer-dashboard {
  width: 100%;
  min-height: 100vh;

  padding: 28px;

  background: #ffffff !important;

  color: #111827;
}


/* =========================================================
   HEADER - WHITE
========================================================= */

.freelancer-dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 25px;

  margin-bottom: 26px;
  padding: 30px;

  border: 1px solid #e5e7eb;

  border-radius: 18px;

  background: #ffffff !important;

  color: #111827 !important;

  box-shadow:
    0 8px 25px
    rgba(15, 23, 42, 0.06);
}


.freelancer-dashboard-eyebrow {
  margin: 0 0 7px;

  color: #6366f1;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 0.1em;

  text-transform: uppercase;
}


.freelancer-dashboard-header h1 {
  margin: 0;

  color: #111827 !important;

  font-size: 27px;

  font-weight: 800;
}


.dashboard-header-description {
  margin: 8px 0 0;

  color: #64748b !important;

  font-size: 14px;
}


/* =========================================================
   BROWSE BUTTON
========================================================= */

.freelancer-dashboard-browse-btn {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 9px;

  padding: 13px 18px;

  border: 1px solid #4f46e5;

  border-radius: 10px;

  background: #ffffff;

  color: #4f46e5;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;

  transition: all 0.2s ease;
}


.freelancer-dashboard-browse-btn:hover {
  background: #4f46e5;

  color: #ffffff;

  box-shadow:
    0 7px 18px
    rgba(79, 70, 229, 0.18);

  transform: translateY(-1px);
}


/* =========================================================
   ERROR
========================================================= */

.freelancer-dashboard-error {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 22px;

  padding: 14px 17px;

  border: 1px solid #fecaca;

  border-radius: 12px;

  background: #fef2f2;

  color: #b91c1c;

  font-size: 13px;
}


.freelancer-dashboard-error button {
  margin-left: auto;

  border: 0;

  background: transparent;

  color: #991b1b;

  font-weight: 800;

  cursor: pointer;
}


/* =========================================================
   STATS
========================================================= */

.freelancer-dashboard-stats {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 17px;

  margin-bottom: 26px;
}


/* =========================================================
   SECTION
========================================================= */

.freelancer-dashboard-section {
  margin-bottom: 26px;

  padding: 22px;

  border: 1px solid #e5e7eb;

  border-radius: 18px;

  background: #ffffff !important;

  box-shadow:
    0 5px 18px
    rgba(15, 23, 42, 0.045);
}


.freelancer-dashboard-section-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  margin-bottom: 19px;
}


.freelancer-dashboard-section-label {
  display: block;

  margin-bottom: 5px;

  color: #6366f1;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 0.1em;

  text-transform: uppercase;
}


.freelancer-dashboard-section-header h2 {
  margin: 0;

  color: #111827;

  font-size: 20px;

  font-weight: 800;
}


.freelancer-dashboard-view-btn {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  border: 0;

  background: transparent;

  color: #4f46e5;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;
}


/* =========================================================
   PROJECT GRID
========================================================= */

.freelancer-dashboard-project-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 18px;
}


/* =========================================================
   EMPTY
========================================================= */

.freelancer-dashboard-empty {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  min-height: 190px;

  padding: 30px;

  border: 1px dashed #cbd5e1;

  border-radius: 14px;

  background: #ffffff !important;

  text-align: center;
}


.freelancer-dashboard-empty > svg {
  margin-bottom: 11px;

  color: #94a3b8;

  font-size: 31px;
}


.freelancer-dashboard-empty h3 {
  margin: 0;

  color: #334155;

  font-size: 16px;
}


.freelancer-dashboard-empty p {
  max-width: 450px;

  margin: 7px 0 16px;

  color: #64748b;

  font-size: 13px;
}


.freelancer-dashboard-empty button {
  padding: 10px 17px;

  border: 0;

  border-radius: 9px;

  background: #4f46e5;

  color: #ffffff;

  font-size: 12px;

  font-weight: 800;

  cursor: pointer;
}


/* =========================================================
   APPLICATION LIST
========================================================= */

.dashboard-applications-list {
  display: flex;

  flex-direction: column;

  gap: 15px;
}


/* =========================================================
   APPLICATION CARD
========================================================= */

.dashboard-application-card {
  overflow: hidden;

  border: 1px solid #e5e7eb;

  border-radius: 15px;

  background: #ffffff !important;

  box-shadow:
    0 4px 14px
    rgba(15, 23, 42, 0.045);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}


.dashboard-application-card:hover {
  transform: translateY(-2px);

  box-shadow:
    0 10px 25px
    rgba(15, 23, 42, 0.08);
}


/* =========================================================
   APPLICATION TOP
========================================================= */

.dashboard-application-top {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 15px;

  padding: 17px 18px;

  border-bottom: 1px solid #f1f5f9;

  background: #ffffff;
}


.dashboard-application-title-area {
  display: flex;

  align-items: center;

  gap: 12px;

  min-width: 0;
}


.dashboard-application-icon {
  width: 43px;
  height: 43px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 11px;

  background: #eef2ff;

  color: #4f46e5;

  font-size: 17px;
}


.dashboard-application-title-area h3 {
  margin: 0;

  color: #111827;

  font-size: 15px;

  font-weight: 800;
}


.dashboard-application-category {
  display: block;

  margin-top: 4px;

  color: #64748b;

  font-size: 12px;
}


/* =========================================================
   STATUS
========================================================= */

.dashboard-application-status {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  flex-shrink: 0;

  padding: 6px 10px;

  border-radius: 999px;

  font-size: 11px;

  font-weight: 800;
}


.dashboard-application-status.pending {
  background: #fff7ed;

  color: #c2410c;
}


.dashboard-application-status.accepted {
  background: #ecfdf5;

  color: #047857;
}


.dashboard-application-status.rejected {
  background: #fef2f2;

  color: #b91c1c;
}


.dashboard-status-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: currentColor;
}


/* =========================================================
   CLIENT
========================================================= */

.dashboard-application-client {
  display: flex;

  align-items: center;

  gap: 8px;

  padding: 13px 18px;

  background: #ffffff;

  color: #64748b;

  font-size: 12px;
}


.dashboard-application-client svg {
  color: #6366f1;
}


.dashboard-application-client strong {
  color: #111827;
}


/* =========================================================
   DETAILS
========================================================= */

.dashboard-application-details {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 12px;

  padding: 16px 18px;

  background: #ffffff;
}


.dashboard-application-detail {
  display: flex;

  align-items: center;

  gap: 9px;

  min-width: 0;
}


.dashboard-detail-icon {
  width: 34px;
  height: 34px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 9px;

  font-size: 13px;
}


.dashboard-detail-icon.green {
  background: #ecfdf5;

  color: #059669;
}


.dashboard-detail-icon.purple {
  background: #f5f3ff;

  color: #7c3aed;
}


.dashboard-detail-icon.orange {
  background: #fff7ed;

  color: #ea580c;
}


.dashboard-application-detail small {
  display: block;

  margin-bottom: 3px;

  color: #94a3b8;

  font-size: 10px;
}


.dashboard-application-detail strong {
  display: block;

  color: #1e293b;

  font-size: 12px;
}


/* =========================================================
   PROPOSAL
========================================================= */

.dashboard-application-proposal {
  display: flex;

  gap: 10px;

  margin: 0 18px;

  padding: 13px;

  border: 1px solid #f1f5f9;

  border-radius: 10px;

  background: #ffffff;
}


.dashboard-proposal-icon {
  color: #6366f1;

  font-size: 14px;
}


.dashboard-application-proposal span {
  color: #475569;

  font-size: 11px;

  font-weight: 800;
}


.dashboard-application-proposal p {
  margin: 4px 0 0;

  color: #64748b;

  font-size: 11px;

  line-height: 1.5;
}


/* =========================================================
   APPLICATION FOOTER
========================================================= */

.dashboard-application-footer {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  margin-top: 14px;

  padding: 13px 18px;

  border-top: 1px solid #f1f5f9;

  background: #ffffff;
}


.dashboard-application-waiting {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #64748b;

  font-size: 11px;

  font-weight: 700;
}


.dashboard-application-waiting svg {
  color: #f59e0b;
}


.dashboard-view-project-btn {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  padding: 8px 12px;

  border: 0;

  border-radius: 8px;

  background: #eef2ff;

  color: #4f46e5;

  font-size: 11px;

  font-weight: 800;

  cursor: pointer;
}


.dashboard-view-project-btn:hover {
  background: #e0e7ff;
}


/* =========================================================
   ACTIVE PROJECTS
========================================================= */

.dashboard-active-list {
  display: flex;

  flex-direction: column;

  gap: 14px;
}


.dashboard-active-project-wrapper {
  padding-bottom: 14px;

  border-bottom: 1px solid #f1f5f9;
}


.dashboard-active-project-wrapper:last-child {
  padding-bottom: 0;

  border-bottom: 0;
}


.dashboard-active-project {
  width: 100%;

  padding: 15px;

  border: 1px solid #e5e7eb;

  border-radius: 12px;

  background: #ffffff;

  text-align: left;

  cursor: pointer;

  transition: all 0.2s ease;
}


.dashboard-active-project:hover {
  background: #f8fafc;

  border-color: #c7d2fe;
}


.dashboard-active-top {
  display: flex;

  align-items: center;

  gap: 12px;
}


.dashboard-active-icon {
  width: 40px;
  height: 40px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #eef2ff;

  color: #4f46e5;
}


.dashboard-active-info {
  flex: 1;
}


.dashboard-active-info h3 {
  margin: 0;

  color: #111827;

  font-size: 14px;

  font-weight: 800;
}


.dashboard-active-info span {
  display: block;

  margin-top: 4px;

  color: #64748b;

  font-size: 12px;
}


.dashboard-active-arrow {
  color: #94a3b8;
}


/* =========================================================
   PROGRESS
========================================================= */

.dashboard-progress {
  margin-top: 14px;
}


.dashboard-progress-top {
  display: flex;

  justify-content: space-between;

  margin-bottom: 6px;

  color: #64748b;

  font-size: 11px;
}


.dashboard-progress-top strong {
  color: #4f46e5;
}


.dashboard-progress-track {
  height: 7px;

  overflow: hidden;

  border-radius: 999px;

  background: #e2e8f0;
}


.dashboard-progress-fill {
  height: 100%;

  border-radius: inherit;

  background:
    linear-gradient(
      90deg,
      #6366f1,
      #8b5cf6
    );
}


/* =========================================================
   CHAT BUTTON
========================================================= */

.dashboard-chat-btn {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  margin-top: 8px;

  margin-left: 52px;

  padding: 8px 13px;

  border: 1px solid #a7f3d0;

  border-radius: 8px;

  background: #ecfdf5;

  color: #047857;

  font-size: 11px;

  font-weight: 800;

  cursor: pointer;
}


/* =========================================================
   LOADING
========================================================= */

.freelancer-dashboard-loading {
  min-height: 60vh;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 12px;

  background: #ffffff;

  color: #64748b;
}


.freelancer-dashboard-spinner {
  color: #4f46e5;

  font-size: 30px;

  animation:
    freelancerDashboardSpin
    1s linear infinite;
}


@keyframes freelancerDashboardSpin {

  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }

}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1100px) {

  .freelancer-dashboard-stats {
    grid-template-columns:
      repeat(2, 1fr);
  }

}


@media (max-width: 800px) {

  .freelancer-dashboard {
    padding: 18px;
  }


  .freelancer-dashboard-header {
    flex-direction: column;

    align-items: flex-start;
  }


  .freelancer-dashboard-project-grid {
    grid-template-columns: 1fr;
  }


  .dashboard-application-details {
    grid-template-columns: 1fr;
  }

}


@media (max-width: 560px) {

  .freelancer-dashboard-stats {
    grid-template-columns: 1fr;
  }


  .freelancer-dashboard-section {
    padding: 15px;
  }


  .dashboard-application-top {
    flex-direction: column;
  }


  .dashboard-application-footer {
    flex-direction: column;

    align-items: flex-start;
  }


  .dashboard-chat-btn {
    width: 100%;

    margin-left: 0;

    justify-content: center;
  }

}
`;


export default FreelancerDashboard;