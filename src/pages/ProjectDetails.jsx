import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  Users,
  UserRound,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Target,
  MessageSquare,
  Pencil,
  Trash2,
  AlertCircle,
  CreditCard,
  Loader2,
  RefreshCw,
} from "lucide-react";

import "./ProjectDetails.css";

// ============================================================
// API
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ============================================================
// PROJECT DETAILS
// ============================================================

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // AUTH CONFIG
  // ==========================================================

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");

    return {
      headers: {
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    };
  };

  // ==========================================================
  // LOAD PROJECT
  // ==========================================================

  const loadProject = async () => {
    if (!id) {
      setError("Project ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("=================================");
      console.log("LOADING PROJECT");
      console.log("Project ID:", id);
      console.log("API URL:", `${API_URL}/projects/${id}`);
      console.log("=================================");

      const response = await axios.get(
        `${API_URL}/projects/${id}`,
        getAuthConfig()
      );

      console.log(
        "PROJECT DETAILS RESPONSE:",
        response.data
      );

      // ======================================================
      // HANDLE DIFFERENT BACKEND RESPONSE FORMATS
      // ======================================================

      const responseData = response?.data;

      let projectData = null;

      if (responseData?.project) {
        projectData = responseData.project;
      } else if (responseData?.data?.project) {
        projectData = responseData.data.project;
      } else if (responseData?.data) {
        projectData = responseData.data;
      } else {
        projectData = responseData;
      }

      console.log(
        "FINAL PROJECT DATA:",
        projectData
      );

      if (!projectData || !projectData._id) {
        throw new Error("Project not found");
      }

      setProject(projectData);
    } catch (err) {
      console.error("=================================");
      console.error(
        "FAILED TO LOAD PROJECT"
      );
      console.error(
        "Status:",
        err?.response?.status
      );
      console.error(
        "Response:",
        err?.response?.data
      );
      console.error(
        "Message:",
        err?.message
      );
      console.error("=================================");

      if (err?.response?.status === 404) {
        setError("Project not found.");
      } else if (err?.response?.status === 401) {
        setError(
          "Please login again to view this project."
        );
      } else if (err?.response?.status === 403) {
        setError(
          "You don't have permission to view this project."
        );
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load project."
        );
      }

      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // USE EFFECT
  // ==========================================================

  useEffect(() => {
    loadProject();
  }, [id]);

  // ==========================================================
  // DELETE PROJECT
  // ==========================================================

  const handleDeleteProject = async () => {
    if (!project?._id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      console.log(
        "Deleting project:",
        project._id
      );

      await axios.delete(
        `${API_URL}/projects/${project._id}`,
        getAuthConfig()
      );

      alert("Project deleted successfully.");

      navigate("/client/projects");
    } catch (err) {
      console.error(
        "DELETE PROJECT ERROR:",
        err?.response?.data || err
      );

      alert(
        err?.response?.data?.message ||
          "Failed to delete project."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================================
  // OPEN CHAT
  // ==========================================================

  const openChat = (application) => {
    console.log(
      "APPLICATION SELECTED FOR CHAT:",
      application
    );

    const freelancer =
      application?.freelancer ||
      application?.user ||
      application?.applicant ||
      {};

    const freelancerId =
      freelancer?._id ||
      freelancer?.id ||
      application?.freelancerId ||
      application?.userId;

    console.log(
      "FREELANCER ID:",
      freelancerId
    );

    if (!freelancerId) {
      alert(
        "Freelancer information is not available."
      );
      return;
    }

    navigate(`/chat/${freelancerId}`);
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="pd-loading-page">
        <div className="pd-loading-card">
          <div className="pd-loading-icon">
            <Loader2
              size={30}
              className="pd-spinner"
            />
          </div>

          <h2>
            Loading project details
          </h2>

          <p>
            Please wait while we fetch the
            project information.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR / NOT FOUND
  // ==========================================================

  if (!project) {
    return (
      <div className="pd-empty-page">
        <div className="pd-empty-card">

          <div className="pd-error-icon">
            <AlertCircle size={38} />
          </div>

          <h2>
            {error || "Project not found"}
          </h2>

          <p>
            We couldn't load the requested
            project.
          </p>

          <div className="pd-empty-actions">

            <button
              type="button"
              className="pd-retry-btn"
              onClick={loadProject}
            >
              <RefreshCw size={16} />
              Retry
            </button>

            <button
              type="button"
              className="pd-back-empty-btn"
              onClick={() =>
                navigate("/client/projects")
              }
            >
              <ArrowLeft size={16} />
              Back to Projects
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================================
  // APPLICATIONS
  // ==========================================================

  const applications = Array.isArray(
    project?.applications
  )
    ? project.applications
    : [];

  // ==========================================================
  // PROJECT STATUS
  // ==========================================================

  const projectStatus =
    project?.status || "Open";

  const normalizedStatus =
    String(projectStatus).toLowerCase();

  const isOpen =
    normalizedStatus === "open";

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="project-details-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="pd-header">

        <div className="pd-container">

          {/* BACK */}

          <button
            type="button"
            className="pd-back-btn"
            onClick={() =>
              navigate("/client/projects")
            }
          >
            <ArrowLeft size={17} />

            <span>
              Back to Projects
            </span>
          </button>

          {/* TITLE AREA */}

          <div className="pd-header-main">

            <div className="pd-title-area">

              <div className="pd-label">
                <BriefcaseBusiness
                  size={13}
                />

                <span>
                  PROJECT DETAILS
                </span>
              </div>

              <h1>
                {project?.title ||
                  "Untitled Project"}
              </h1>

              <p>
                {project?.description ||
                  "No project description available."}
              </p>

            </div>

            {/* ACTIONS */}

            <div className="pd-header-actions">

              <button
                type="button"
                className="pd-edit-btn"
                onClick={() =>
                  navigate(
                    `/client/projects/${project._id}/edit`
                  )
                }
              >
                <Pencil size={15} />

                <span>
                  Edit
                </span>
              </button>

              <button
                type="button"
                className="pd-delete-btn"
                disabled={deleting}
                onClick={
                  handleDeleteProject
                }
              >
                {deleting ? (
                  <Loader2
                    size={15}
                    className="pd-spinner"
                  />
                ) : (
                  <Trash2 size={15} />
                )}

                <span>
                  {deleting
                    ? "Deleting..."
                    : "Delete"}
                </span>
              </button>

            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="pd-container pd-main-layout">

        {/* ===================================================
            LEFT CONTENT
        =================================================== */}

        <div className="pd-main-content">

          {/* =================================================
              OVERVIEW
          ================================================= */}

          <section className="pd-card">

            <div className="pd-card-header">

              <div>
                <span className="pd-kicker">
                  OVERVIEW
                </span>

                <h2>
                  Project Overview
                </h2>
              </div>

              <div className="pd-card-icon purple">
                <BriefcaseBusiness
                  size={19}
                />
              </div>

            </div>

            <div className="pd-description">

              <p>
                {project?.description ||
                  "No project description available."}
              </p>

            </div>

          </section>


          {/* =================================================
              PROJECT INFORMATION
          ================================================= */}

          <section className="pd-card">

            <div className="pd-card-header">

              <div>
                <span className="pd-kicker">
                  INFORMATION
                </span>

                <h2>
                  Project Information
                </h2>
              </div>

              <div className="pd-card-icon blue">
                <FileText size={19} />
              </div>

            </div>


            <div className="pd-info-grid">

              {/* BUDGET */}

              <div className="pd-info-box budget">

                <div className="pd-info-icon">
                  <DollarSign size={19} />
                </div>

                <div>
                  <span>
                    Budget
                  </span>

                  <strong>
                    ₹
                    {Number(
                      project?.budget || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

              </div>


              {/* DEADLINE */}

              <div className="pd-info-box deadline">

                <div className="pd-info-icon">
                  <CalendarDays
                    size={19}
                  />
                </div>

                <div>
                  <span>
                    Deadline
                  </span>

                  <strong>
                    {project?.deadline
                      ? new Date(
                          project.deadline
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Not specified"}
                  </strong>
                </div>

              </div>


              {/* CATEGORY */}

              <div className="pd-info-box category">

                <div className="pd-info-icon">
                  <Target size={19} />
                </div>

                <div>
                  <span>
                    Category
                  </span>

                  <strong>
                    {project?.category ||
                      "General"}
                  </strong>
                </div>

              </div>


              {/* STATUS */}

              <div className="pd-info-box status">

                <div className="pd-info-icon">
                  <Clock3 size={19} />
                </div>

                <div>
                  <span>
                    Status
                  </span>

                  <strong>
                    {projectStatus}
                  </strong>
                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              SKILLS
          ================================================= */}

          {Array.isArray(
            project?.skills
          ) &&
            project.skills.length > 0 && (

              <section className="pd-card">

                <div className="pd-card-header">

                  <div>
                    <span className="pd-kicker">
                      REQUIREMENTS
                    </span>

                    <h2>
                      Required Skills
                    </h2>
                  </div>

                  <div className="pd-card-icon green">
                    <Target size={19} />
                  </div>

                </div>

                <div className="pd-skills">

                  {project.skills.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="pd-skill"
                      >
                        {typeof skill ===
                        "string"
                          ? skill
                          : skill?.name ||
                            skill?.title ||
                            "Skill"}
                      </span>

                    )
                  )}

                </div>

              </section>

            )}


          {/* =================================================
              APPLICATIONS
          ================================================= */}

          <section
            className="pd-card"
            id="applications"
          >

            <div className="pd-card-header">

              <div>
                <span className="pd-kicker">
                  FREELANCERS
                </span>

                <h2>
                  Applications
                </h2>
              </div>

              <div className="pd-card-icon orange">
                <Users size={19} />
              </div>

            </div>


            {applications.length > 0 ? (

              <div className="pd-applications">

                {applications
                  .slice(0, 10)
                  .map(
                    (
                      application,
                      index
                    ) => {

                      const freelancer =
                        application?.freelancer ||
                        application?.user ||
                        application?.applicant ||
                        {};

                      const freelancerId =
                        freelancer?._id ||
                        freelancer?.id ||
                        application?.freelancerId ||
                        application?.userId;

                      return (
                        <div
                          key={
                            application?._id ||
                            application?.id ||
                            index
                          }
                          className="pd-application"
                        >

                          {/* AVATAR */}

                          <div className="pd-avatar">

                            {freelancer?.profileImage ? (

                              <img
                                src={
                                  freelancer.profileImage
                                }
                                alt={
                                  freelancer?.name ||
                                  "Freelancer"
                                }
                              />

                            ) : (

                              <UserRound
                                size={19}
                              />

                            )}

                          </div>


                          {/* INFO */}

                          <div className="pd-application-info">

                            <strong>
                              {freelancer?.name ||
                                freelancer?.fullName ||
                                application?.freelancerName ||
                                "Freelancer"}
                            </strong>

                            <span>
                              {application?.status ||
                                "Application submitted"}
                            </span>

                          </div>


                          {/* CHAT */}

                          <button
                            type="button"
                            className="pd-chat-btn"
                            disabled={
                              !freelancerId
                            }
                            onClick={() =>
                              openChat(
                                application
                              )
                            }
                          >
                            <MessageSquare
                              size={15}
                            />

                            <span>
                              Chat
                            </span>
                          </button>

                          <ChevronRight
                            size={17}
                            className="pd-application-arrow"
                          />

                        </div>
                      );
                    }
                  )}

              </div>

            ) : (

              <div className="pd-no-applications">

                <div className="pd-no-app-icon">
                  <Users size={28} />
                </div>

                <h3>
                  No applications yet
                </h3>

                <p>
                  Freelancers who apply to
                  this project will appear
                  here.
                </p>

              </div>

            )}

          </section>

        </div>


        {/* ===================================================
            RIGHT SIDEBAR
        =================================================== */}

        <aside className="pd-sidebar">

          {/* =================================================
              STATUS CARD
          ================================================= */}

          <div className="pd-sidebar-card">

            <div className="pd-sidebar-heading">

              <div className="pd-sidebar-icon purple">
                <ShieldCheck size={18} />
              </div>

              <div>
                <strong>
                  Project Status
                </strong>

                <span>
                  Current project state
                </span>
              </div>

            </div>


            <div
              className={
                isOpen
                  ? "pd-status-badge open"
                  : "pd-status-badge closed"
              }
            >

              <CheckCircle2 size={16} />

              <span>
                {projectStatus}
              </span>

            </div>

          </div>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div className="pd-sidebar-card">

            <div className="pd-sidebar-heading">

              <div className="pd-sidebar-icon blue">
                <Sparkles size={18} />
              </div>

              <div>
                <strong>
                  Quick Actions
                </strong>

                <span>
                  Manage your project
                </span>
              </div>

            </div>


            {/* APPLICATIONS */}

            <button
              type="button"
              className="pd-quick-action"
              onClick={() => {

                const element =
                  document.getElementById(
                    "applications"
                  );

                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }

              }}
            >

              <div className="pd-quick-icon blue">
                <Users size={16} />
              </div>

              <div className="pd-quick-content">

                <strong>
                  Applications
                </strong>

                <span>
                  View freelancer applications
                </span>

              </div>

              <ChevronRight size={15} />

            </button>


            {/* MESSAGES */}

            <button
              type="button"
              className="pd-quick-action"
              onClick={() => {

                if (
                  applications.length === 0
                ) {
                  alert(
                    "No freelancer applications available."
                  );

                  return;
                }

                openChat(
                  applications[0]
                );

              }}
            >

              <div className="pd-quick-icon orange">
                <MessageSquare size={16} />
              </div>

              <div className="pd-quick-content">

                <strong>
                  Messages
                </strong>

                <span>
                  Communicate with freelancers
                </span>

              </div>

              <ChevronRight size={15} />

            </button>


            {/* PAYMENTS */}

            <button
              type="button"
              className="pd-quick-action"
              onClick={() =>
                navigate(
                  "/client/payments"
                )
              }
            >

              <div className="pd-quick-icon green">
                <CreditCard size={16} />
              </div>

              <div className="pd-quick-content">

                <strong>
                  Payments
                </strong>

                <span>
                  Manage project payments
                </span>

              </div>

              <ChevronRight size={15} />

            </button>

          </div>


          {/* =================================================
              APPLICATION COUNT
          ================================================= */}

          <div className="pd-sidebar-card pd-count-card">

            <div className="pd-count-icon">
              <Users size={21} />
            </div>

            <div>
              <span>
                Total Applications
              </span>

              <strong>
                {applications.length}
              </strong>
            </div>

          </div>

        </aside>

      </main>

    </div>
  );
};

export default ProjectDetails;