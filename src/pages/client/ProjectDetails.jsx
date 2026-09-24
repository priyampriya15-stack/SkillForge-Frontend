import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "../../Styles/client.css";
import "../../Styles/ProjectDetails.css";

// IMPORTANT:
// ProjectDetails.jsx -> pages/client/
// components folder -> src/components/
import CreateMilestone from "../../components/CreateMilestone";

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
  Milestone,
  UserCheck,
} from "lucide-react";

import {
  getProjectById,
  deleteProject,
} from "../../Services/clientService";


/* =========================================================
   RAZORPAY API ENDPOINTS
   ========================================================= */

const CREATE_ORDER_URL =
  "http://localhost:5000/api/payments/create-order";

const VERIFY_PAYMENT_URL =
  "http://localhost:5000/api/payments/verify-payment";


/* =========================================================
   LOAD RAZORPAY CHECKOUT SCRIPT
   ========================================================= */

const loadRazorpayScript = () => {
  return new Promise((resolve) => {

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};


/* =========================================================
   PROJECT DETAILS COMPONENT
   ========================================================= */

const ProjectDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();


  /* =======================================================
     PROJECT STATES
     ======================================================= */

  const [project, setProject] = useState(null);

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");


  /* =======================================================
     PAYMENT STATES
     ======================================================= */

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [paymentSuccess, setPaymentSuccess] =
    useState(false);

  const [paymentError, setPaymentError] =
    useState("");

  const [paymentMessage, setPaymentMessage] =
    useState("");


  /* =======================================================
     FETCH PROJECT
     ======================================================= */

  useEffect(() => {

    if (id) {
      fetchProject();
    }

  }, [id]);


  const fetchProject = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await getProjectById(id);

      console.log(
        "PROJECT DETAILS RESPONSE:",
        response
      );


      const data =
        response?.project ||
        response?.data ||
        response;


      console.log(
        "PROJECT DATA:",
        data
      );


      setProject(data);

    } catch (err) {

      console.error(
        "Failed to fetch project:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load project details."
      );

    } finally {

      setLoading(false);

    }
  };


  /* =========================================================
     MILESTONE CREATED
     ========================================================= */

  const handleMilestoneCreated = (
    milestone
  ) => {

    console.log(
      "NEW MILESTONE CREATED:",
      milestone
    );

    /*
      Project data refresh pannrom.
      So new milestone related data
      backend-la irundhu latest-a varum.
    */

    fetchProject();

  };


  /* =========================================================
     DELETE PROJECT
     ========================================================= */

  const handleDelete = async () => {

    if (!project?._id && !project?.id) {
      return;
    }


    const projectId =
      project?._id ||
      project?.id;


    const confirmed =
      window.confirm(
        "Are you sure you want to delete this project?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeleting(true);


      await deleteProject(projectId);


      navigate("/client/my-projects");

    } catch (err) {

      console.error(
        "Delete project failed:",
        err
      );


      alert(
        err?.response?.data?.message ||
        "Failed to delete project."
      );

    } finally {

      setDeleting(false);

    }
  };


  /* =========================================================
     RAZORPAY PAYMENT
     ========================================================= */

  const handlePayment = async () => {

    setPaymentError("");

    setPaymentMessage("");

    setPaymentSuccess(false);


    /* -------------------------------------------------------
       CHECK PROJECT
       ------------------------------------------------------- */

    if (!project) {

      setPaymentError(
        "Project information is not available."
      );

      return;
    }


    /* -------------------------------------------------------
       PROJECT ID
       ------------------------------------------------------- */

    const projectId =
      project?._id ||
      project?.id;


    if (!projectId) {

      setPaymentError(
        "Project ID is missing."
      );

      return;
    }


    /* -------------------------------------------------------
       PROJECT BUDGET
       ------------------------------------------------------- */

    const projectBudget =
      Number(project?.budget || 0);


    if (
      !projectBudget ||
      projectBudget <= 0
    ) {

      setPaymentError(
        "This project does not have a valid payment amount."
      );

      return;
    }


    try {

      setPaymentLoading(true);


      /* =====================================================
         STEP 1
         LOAD RAZORPAY
         ===================================================== */

      setPaymentMessage(
        "Loading secure payment..."
      );


      const razorpayLoaded =
        await loadRazorpayScript();


      if (!razorpayLoaded) {

        setPaymentError(
          "Razorpay Checkout could not be loaded. Please check your internet connection."
        );

        setPaymentMessage("");

        setPaymentLoading(false);

        return;
      }


      /* =====================================================
         STEP 2
         GET AUTH TOKEN
         ===================================================== */

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken");


      /* =====================================================
         STEP 3
         CREATE RAZORPAY ORDER
         ===================================================== */

      setPaymentMessage(
        "Creating secure payment order..."
      );


      const orderResponse =
        await fetch(
          CREATE_ORDER_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
            },

            body: JSON.stringify({
              projectId: projectId,
              amount: projectBudget,
            }),
          }
        );


      const orderData =
        await orderResponse.json();


      console.log(
        "RAZORPAY ORDER RESPONSE:",
        orderData
      );


      /* =====================================================
         CHECK ORDER RESPONSE
         ===================================================== */

      if (!orderResponse.ok) {

        throw new Error(
          orderData?.message ||
          "Failed to create Razorpay order."
        );
      }


      if (!orderData?.success) {

        throw new Error(
          orderData?.message ||
          "Razorpay order creation failed."
        );
      }


      /* =====================================================
         STEP 4
         GET RAZORPAY ORDER DETAILS
         ===================================================== */

      const razorpayOrder =
        orderData?.order;

      const keyId =
        orderData?.keyId;


      if (!razorpayOrder?.id) {

        throw new Error(
          "Razorpay order ID was not returned by the server."
        );
      }


      if (!razorpayOrder?.amount) {

        throw new Error(
          "Razorpay order amount was not returned by the server."
        );
      }


      if (!keyId) {

        throw new Error(
          "Razorpay Key ID was not returned by the server."
        );
      }


      console.log(
        "RAZORPAY ORDER ID:",
        razorpayOrder.id
      );

      console.log(
        "RAZORPAY AMOUNT:",
        razorpayOrder.amount
      );

      console.log(
        "RAZORPAY KEY ID:",
        keyId
      );


      /* =====================================================
         STEP 5
         RAZORPAY CHECKOUT OPTIONS
         ===================================================== */

      const options = {

        key: keyId,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency ||
          "INR",

        name:
          "SkillForge",

        description:
          project.title ||
          "Project Payment",

        order_id:
          razorpayOrder.id,


        /* ---------------------------------------------------
           PREFILL
           --------------------------------------------------- */

        prefill: {

          name:
            project?.client?.name ||
            "SkillForge Client",

          email:
            project?.client?.email ||
            "",
        },


        /* ---------------------------------------------------
           NOTES
           --------------------------------------------------- */

        notes: {

          projectId:
            String(projectId),

          projectTitle:
            project?.title ||
            "Project",
        },


        /* ---------------------------------------------------
           THEME
           --------------------------------------------------- */

        theme: {
          color: "#4f46e5",
        },


        /* ---------------------------------------------------
           PAYMENT SUCCESS
           --------------------------------------------------- */

        handler:
          async function (
            razorpayResponse
          ) {

            console.log(
              "RAZORPAY PAYMENT SUCCESS:",
              razorpayResponse
            );


            try {

              setPaymentMessage(
                "Payment received. Verifying payment..."
              );

              setPaymentError("");


              /* =============================================
                 VERIFY PAYMENT
                 ============================================= */

              const verifyResponse =
                await fetch(
                  VERIFY_PAYMENT_URL,
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",

                      ...(token
                        ? {
                            Authorization:
                              `Bearer ${token}`,
                          }
                        : {}),
                    },

                    body: JSON.stringify({

                      razorpay_order_id:
                        razorpayResponse
                          .razorpay_order_id,

                      razorpay_payment_id:
                        razorpayResponse
                          .razorpay_payment_id,

                      razorpay_signature:
                        razorpayResponse
                          .razorpay_signature,

                      projectId:
                        projectId,

                    }),
                  }
                );


              const verifyData =
                await verifyResponse.json();


              console.log(
                "PAYMENT VERIFICATION RESPONSE:",
                verifyData
              );


              if (!verifyResponse.ok) {

                throw new Error(
                  verifyData?.message ||
                  "Payment verification failed."
                );

              }


              if (!verifyData?.success) {

                throw new Error(
                  verifyData?.message ||
                  "Payment verification failed."
                );

              }


              /* =============================================
                 PAYMENT VERIFIED
                 ============================================= */

              setPaymentSuccess(true);

              setPaymentError("");

              setPaymentMessage(
                "Payment successful and verified!"
              );


            } catch (verifyError) {

              console.error(
                "Payment verification failed:",
                verifyError
              );


              setPaymentSuccess(false);

              setPaymentError(
                verifyError?.message ||
                "Payment was completed, but verification failed. Please contact support."
              );

              setPaymentMessage("");

            } finally {

              setPaymentLoading(false);

            }
          },


        /* ---------------------------------------------------
           MODAL CLOSED
           --------------------------------------------------- */

        modal: {

          ondismiss:
            function () {

              setPaymentLoading(false);

              setPaymentMessage("");

            },
        },
      };


      /* =====================================================
         STEP 7
         CREATE RAZORPAY INSTANCE
         ===================================================== */

      const razorpay =
        new window.Razorpay(
          options
        );


      /* =====================================================
         PAYMENT FAILED
         ===================================================== */

      razorpay.on(
        "payment.failed",
        function (response) {

          console.error(
            "RAZORPAY PAYMENT FAILED:",
            response
          );


          setPaymentSuccess(false);

          setPaymentError(
            response?.error?.description ||
            "Payment failed. Please try again."
          );

          setPaymentMessage("");

          setPaymentLoading(false);

        }
      );


      /* =====================================================
         STEP 8
         OPEN CHECKOUT
         ===================================================== */

      setPaymentMessage(
        "Opening secure payment..."
      );


      razorpay.open();


    } catch (err) {

      console.error(
        "Payment failed:",
        err
      );


      setPaymentSuccess(false);

      setPaymentError(
        err?.message ||
        "Unable to start payment."
      );

      setPaymentMessage("");

      setPaymentLoading(false);

    }
  };


  /* =========================================================
     FORMAT DATE
     ========================================================= */

  const formatDate = (date) => {

    if (!date) {
      return "Not specified";
    }


    try {

      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    } catch {

      return "Not specified";

    }
  };


  /* =========================================================
     STATUS CLASS
     ========================================================= */

  const getStatusClass = (
    status
  ) => {

    const value =
      String(
        status || ""
      ).toLowerCase();


    if (value === "open") {
      return "open";
    }

    if (value === "active") {
      return "active";
    }

    if (value === "completed") {
      return "completed";
    }

    if (value === "cancelled") {
      return "cancelled";
    }

    if (value === "closed") {
      return "closed";
    }

    return "default";
  };


  /* =========================================================
     PROJECT DATA
     ========================================================= */

  const projectId =
    project?._id ||
    project?.id;


  const projectSkills =
    Array.isArray(project?.skills)
      ? project.skills
      : [];


  const applications =
    Array.isArray(project?.applications)
      ? project.applications
      : [];


  const projectBudget =
    Number(
      project?.budget || 0
    );


  /* =========================================================
     SELECTED FREELANCER
     ========================================================= */

  const selectedFreelancer =
    project?.selectedFreelancer ||
    project?.freelancer ||
    null;


  const hasSelectedFreelancer =
    Boolean(selectedFreelancer);


  /* =========================================================
     LOADING UI
     ========================================================= */

  if (loading) {

    return (

      <div className="client-page">

        <div className="client-container">

          <div className="client-loading-state">

            <div className="client-loading-spinner" />

            <p>
              Loading project details...
            </p>

          </div>

        </div>

      </div>

    );
  }


  /* =========================================================
     ERROR UI
     ========================================================= */

  if (error || !project) {

    return (

      <div className="client-page">

        <div className="client-container">

          <div className="client-error-card">

            <div className="client-error-icon">

              <AlertCircle
                size={28}
              />

            </div>


            <h2>

              {error ||
                "Project not found"}

            </h2>


            <p>

              We couldn't load the project details.

            </p>


            <button
              type="button"
              onClick={() =>
                navigate(
                  "/client/my-projects"
                )
              }
              className="client-primary-btn"
            >

              <ArrowLeft
                size={17}
              />

              Back to My Projects

            </button>

          </div>

        </div>

      </div>

    );
  }


  /* =========================================================
     MAIN UI
     ========================================================= */

  return (

    <div className="client-page">

      <div className="client-container">


        {/* ===================================================
            BACK BUTTON
            =================================================== */}

        <div className="client-back-row">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/client/my-projects"
              )
            }
            className="client-back-btn"
          >

            <ArrowLeft size={17} />

            Back to My Projects

          </button>

        </div>


        {/* ===================================================
            PROJECT HERO
            =================================================== */}

        <div className="client-project-hero">

          <div className="client-project-hero-content">

            <div className="client-project-category">

              <BriefcaseBusiness
                size={15}
              />

              {project.category ||
                "General"}

            </div>


            <h1>

              {project.title ||
                "Untitled Project"}

            </h1>


            <p>

              {project.description ||
                "No project description available."}

            </p>


            <div className="client-project-meta">

              <span>

                <CalendarDays size={16} />

                Deadline:{" "}

                {formatDate(
                  project.deadline
                )}

              </span>


              <span>

                <DollarSign size={16} />

                Budget: ₹
                {projectBudget.toLocaleString(
                  "en-IN"
                )}

              </span>


              <span>

                <Users size={16} />

                {applications.length}
                {" "}
                Applications

              </span>

            </div>

          </div>


          {/* STATUS */}

          <div className="client-project-status-box">

            <span className="client-status-label">

              PROJECT STATUS

            </span>


            <div
              className={`client-project-status ${getStatusClass(
                project.status
              )}`}
            >

              <CheckCircle2 size={17} />

              {project.status
                ? String(
                    project.status
                  )
                    .charAt(0)
                    .toUpperCase() +
                  String(
                    project.status
                  ).slice(1)
                : "Open"}

            </div>

          </div>

        </div>


        {/* ===================================================
            PAYMENT MESSAGE
            =================================================== */}

        {(paymentError ||
          paymentMessage ||
          paymentSuccess) && (

          <div
            className={`client-payment-message ${
              paymentSuccess
                ? "success"
                : paymentError
                ? "error"
                : "info"
            }`}
          >

            {paymentSuccess ? (

              <CheckCircle2
                size={19}
              />

            ) : paymentError ? (

              <AlertCircle
                size={19}
              />

            ) : (

              <Loader2
                size={19}
                className="payment-spin"
              />

            )}


            <span>

              {paymentError ||
                paymentMessage}

            </span>

          </div>

        )}


        {/* ===================================================
            CONTENT GRID
            =================================================== */}

        <div className="client-project-details-grid">


          {/* =================================================
              LEFT COLUMN
              ================================================= */}

          <div className="client-project-main">


            {/* =================================================
                PROJECT DESCRIPTION
                ================================================= */}

            <section className="client-detail-card">

              <div className="client-detail-card-header">

                <div>

                  <span className="client-section-eyebrow">

                    PROJECT DETAILS

                  </span>

                  <h2>

                    Project Description

                  </h2>

                </div>

                <FileText size={21} />

              </div>


              <div className="client-description-content">

                <p>

                  {project.description ||
                    "No description has been added for this project."}

                </p>

              </div>

            </section>


            {/* =================================================
                PROJECT STATS
                ================================================= */}

            <section className="client-project-stats">


              <div className="client-project-stat">

                <div className="client-project-stat-icon purple">

                  <DollarSign size={19} />

                </div>

                <div>

                  <span>
                    Budget
                  </span>

                  <strong>

                    ₹
                    {projectBudget.toLocaleString(
                      "en-IN"
                    )}

                  </strong>

                </div>

              </div>


              <div className="client-project-stat">

                <div className="client-project-stat-icon blue">

                  <CalendarDays size={19} />

                </div>

                <div>

                  <span>
                    Deadline
                  </span>

                  <strong>

                    {formatDate(
                      project.deadline
                    )}

                  </strong>

                </div>

              </div>


              <div className="client-project-stat">

                <div className="client-project-stat-icon green">

                  <Users size={19} />

                </div>

                <div>

                  <span>
                    Applications
                  </span>

                  <strong>

                    {applications.length}

                  </strong>

                </div>

              </div>


              <div className="client-project-stat">

                <div className="client-project-stat-icon orange">

                  <Clock3 size={19} />

                </div>

                <div>

                  <span>
                    Status
                  </span>

                  <strong>

                    {project.status ||
                      "Open"}

                  </strong>

                </div>

              </div>


            </section>


            {/* =================================================
                REQUIRED SKILLS
                ================================================= */}

            <section className="client-detail-card">

              <div className="client-detail-card-header">

                <div>

                  <span className="client-section-eyebrow">

                    REQUIREMENTS

                  </span>

                  <h2>

                    Required Skills

                  </h2>

                </div>

                <BriefcaseBusiness size={21} />

              </div>


              <div className="client-skills-list">

                {projectSkills.length > 0 ? (

                  projectSkills.map(
                    (
                      skill,
                      index
                    ) => (

                      <span
                        key={`${skill}-${index}`}
                        className="client-skill-tag"
                      >

                        {skill}

                      </span>

                    )
                  )

                ) : (

                  <span className="client-empty-text">

                    No specific skills added.

                  </span>

                )}

              </div>

            </section>


            {/* =================================================
                PROJECT INFORMATION
                ================================================= */}

            <section className="client-detail-card">

              <div className="client-detail-card-header">

                <div>

                  <span className="client-section-eyebrow">

                    OVERVIEW

                  </span>

                  <h2>

                    Project Information

                  </h2>

                </div>

                <Target size={21} />

              </div>


              <div className="client-info-grid">


                <div className="client-info-item">

                  <span>

                    <BriefcaseBusiness size={15} />

                    Category

                  </span>

                  <strong>

                    {project.category ||
                      "Not specified"}

                  </strong>

                </div>


                <div className="client-info-item">

                  <span>

                    <DollarSign size={15} />

                    Budget

                  </span>

                  <strong>

                    ₹
                    {projectBudget.toLocaleString(
                      "en-IN"
                    )}

                  </strong>

                </div>


                <div className="client-info-item">

                  <span>

                    <CalendarDays size={15} />

                    Deadline

                  </span>

                  <strong>

                    {formatDate(
                      project.deadline
                    )}

                  </strong>

                </div>


                <div className="client-info-item">

                  <span>

                    <Clock3 size={15} />

                    Status

                  </span>

                  <strong>

                    {project.status ||
                      "Open"}

                  </strong>

                </div>


              </div>

            </section>


            {/* =================================================
                SELECTED FREELANCER
                ================================================= */}

            <section className="client-detail-card">

              <div className="client-detail-card-header">

                <div>

                  <span className="client-section-eyebrow">

                    ASSIGNED FREELANCER

                  </span>

                  <h2>

                    Project Freelancer

                  </h2>

                </div>

                <UserCheck size={21} />

              </div>


              {hasSelectedFreelancer ? (

                <div
                  className="client-application-row"
                  style={{
                    marginTop: "16px"
                  }}
                >

                  <div className="client-application-avatar">

                    {selectedFreelancer?.profileImage ? (

                      <img
                        src={
                          selectedFreelancer.profileImage
                        }
                        alt={
                          selectedFreelancer?.name ||
                          "Freelancer"
                        }
                      />

                    ) : (

                      <UserRound
                        size={19}
                      />

                    )}

                  </div>


                  <div className="client-application-info">

                    <strong>

                      {selectedFreelancer?.name ||
                        selectedFreelancer?.fullName ||
                        "Selected Freelancer"}

                    </strong>

                    <span>

                      Freelancer assigned to this project

                    </span>

                  </div>

                </div>

              ) : (

                <div className="client-empty-state">

                  <UserRound size={24} />

                  <h3>

                    No freelancer selected

                  </h3>

                  <p>

                    Select a freelancer from the
                    applications before creating
                    project milestones.

                  </p>


                  <Link
                    to="/client/applications"
                    className="client-primary-btn"
                    style={{
                      marginTop: "12px",
                      textDecoration: "none"
                    }}
                  >

                    <Users size={17} />

                    Review Applications

                  </Link>

                </div>

              )}

            </section>


            {/* =================================================
                MILESTONE SECTION
                ================================================= */}

            <section className="client-detail-card">

              <div className="client-detail-card-header">

                <div>

                  <span className="client-section-eyebrow">

                    PROJECT MANAGEMENT

                  </span>

                  <h2>

                    Project Milestones

                  </h2>

                  <p
                    style={{
                      marginTop: "6px",
                      marginBottom: 0,
                      color: "#64748b",
                      fontSize: "14px"
                    }}
                  >

                    Break the project into
                    manageable stages and track
                    freelancer progress.

                  </p>

                </div>

                <Target size={21} />

              </div>


              {/* ---------------------------------------------
                  FREELANCER SELECTED
                  --------------------------------------------- */}

              {hasSelectedFreelancer ? (

                <div
                  style={{
                    marginTop: "20px"
                  }}
                >

                  <CreateMilestone
                    projectId={projectId}
                    onCreated={
                      handleMilestoneCreated
                    }
                  />

                </div>

              ) : (

                <div
                  className="client-empty-state"
                  style={{
                    marginTop: "20px"
                  }}
                >

                  <Milestone size={28} />

                  <h3>

                    Freelancer Required

                  </h3>

                  <p>

                    You can create milestones
                    after assigning a freelancer
                    to this project.

                  </p>

                </div>

              )}

            </section>


            {/* =================================================
                APPLICATIONS
                ================================================= */}

            <section className="client-detail-card">

              <div className="client-detail-card-header">

                <div>

                  <span className="client-section-eyebrow">

                    FREELANCERS

                  </span>

                  <h2>

                    Applications

                  </h2>

                </div>


                <Link
                  to="/client/applications"
                  className="client-view-all-link"
                >

                  View All

                  <ChevronRight size={15} />

                </Link>

              </div>


              {applications.length > 0 ? (

                <div className="client-application-preview">

                  {applications
                    .slice(0, 3)
                    .map(
                      (
                        application,
                        index
                      ) => {

                        const freelancer =
                          application.freelancer ||
                          application.user ||
                          {};


                        return (

                          <div
                            key={
                              application._id ||
                              application.id ||
                              index
                            }
                            className="client-application-row"
                          >

                            <div className="client-application-avatar">

                              {freelancer.profileImage ? (

                                <img
                                  src={
                                    freelancer.profileImage
                                  }
                                  alt={
                                    freelancer.name ||
                                    "Freelancer"
                                  }
                                />

                              ) : (

                                <UserRound
                                  size={19}
                                />

                              )}

                            </div>


                            <div className="client-application-info">

                              <strong>

                                {freelancer.name ||
                                  application.freelancerName ||
                                  "Freelancer"}

                              </strong>

                              <span>

                                {application.status ||
                                  "Application submitted"}

                              </span>

                            </div>


                            <ChevronRight
                              size={17}
                            />

                          </div>

                        );

                      }
                    )}

                </div>

              ) : (

                <div className="client-empty-state">

                  <Users size={24} />

                  <h3>

                    No applications yet

                  </h3>

                  <p>

                    Freelancers who apply to this
                    project will appear here.

                  </p>

                </div>

              )}

            </section>

          </div>


          {/* =================================================
              RIGHT SIDEBAR
              ================================================= */}

          <aside className="client-project-sidebar">


            {/* =================================================
                QUICK ACTIONS
                ================================================= */}

            <div className="client-side-card">

              <div className="client-side-card-title">

                <span>

                  QUICK ACTIONS

                </span>

              </div>


              <div className="client-quick-actions">


                {/* AI RECOMMENDATION */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/client/projects/${projectId}/recommended-freelancers`
                    )
                  }
                  className="client-quick-action ai-recommendation"
                >

                  <div className="client-quick-action-icon client-ai-icon">

                    <Sparkles size={17} />

                  </div>


                  <div>

                    <strong>

                      AI Recommended Freelancers

                    </strong>

                    <span>

                      Find the best talent for this project

                    </span>

                  </div>


                  <ChevronRight size={15} />

                </button>


                {/* APPLICATIONS */}

                <Link
                  to="/client/applications"
                  className="client-quick-action"
                >

                  <div className="client-quick-action-icon purple">

                    <Users size={17} />

                  </div>


                  <div>

                    <strong>

                      Applications

                    </strong>

                    <span>

                      Review freelancers

                    </span>

                  </div>


                  <ChevronRight size={15} />

                </Link>


                {/* MILESTONES */}

                <Link
                  to="/client/milestones"
                  className="client-quick-action"
                >

                  <div className="client-quick-action-icon blue">

                    <Target size={17} />

                  </div>


                  <div>

                    <strong>

                      Milestones

                    </strong>

                    <span>

                      Track project progress

                    </span>

                  </div>


                  <ChevronRight size={15} />

                </Link>


                {/* PAYMENTS */}

                <Link
                  to="/client/payments"
                  className="client-quick-action"
                >

                  <div className="client-quick-action-icon green">

                    <DollarSign size={17} />

                  </div>


                  <div>

                    <strong>

                      Payments

                    </strong>

                    <span>

                      Manage project payments

                    </span>

                  </div>


                  <ChevronRight size={15} />

                </Link>


                {/* MESSAGES */}

                <Link
                  to="/chat"
                  className="client-quick-action"
                >

                  <div className="client-quick-action-icon orange">

                    <MessageSquare size={17} />

                  </div>


                  <div>

                    <strong>

                      Messages

                    </strong>

                    <span>

                      Communicate with freelancers

                    </span>

                  </div>


                  <ChevronRight size={15} />

                </Link>

              </div>

            </div>


            {/* =================================================
                PROJECT PAYMENT CARD
                ================================================= */}

            <div className="client-side-card client-payment-card">


              <div className="client-side-card-title">

                <span>

                  PROJECT PAYMENT

                </span>

              </div>


              <div className="client-payment-card-content">

                <div className="client-payment-icon">

                  <CreditCard size={23} />

                </div>


                <div className="client-payment-info">

                  <span>

                    Amount to Pay

                  </span>

                  <strong>

                    ₹
                    {projectBudget.toLocaleString(
                      "en-IN"
                    )}

                  </strong>

                </div>

              </div>


              {!paymentSuccess ? (

                <button
                  type="button"
                  className="client-pay-now-btn"
                  onClick={handlePayment}
                  disabled={
                    paymentLoading ||
                    projectBudget <= 0
                  }
                >

                  {paymentLoading ? (

                    <>

                      <Loader2
                        size={18}
                        className="payment-spin"
                      />

                      Processing...

                    </>

                  ) : (

                    <>

                      <CreditCard size={18} />

                      Pay ₹
                      {projectBudget.toLocaleString(
                        "en-IN"
                      )}

                    </>

                  )}

                </button>

              ) : (

                <div className="client-payment-completed">

                  <CheckCircle2 size={19} />

                  <span>

                    Payment Completed

                  </span>

                </div>

              )}


              <p className="client-payment-secure-text">

                <ShieldCheck size={14} />

                Secure payment powered by Razorpay

              </p>

            </div>


            {/* =================================================
                SECURITY CARD
                ================================================= */}

            <div className="client-side-card client-security-card">

              <div className="client-security-icon">

                <ShieldCheck size={22} />

              </div>


              <div>

                <h3>

                  Safe & Secure

                </h3>

                <p>

                  Your project information is protected
                  and securely managed.

                </p>

              </div>

            </div>


            {/* =================================================
                PROJECT OWNER
                ================================================= */}

            <div className="client-side-card">

              <div className="client-side-card-title">

                <span>

                  PROJECT OWNER

                </span>

              </div>


              <div className="client-owner">

                <div className="client-owner-avatar">

                  {project.client?.profileImage ? (

                    <img
                      src={
                        project.client.profileImage
                      }
                      alt={
                        project.client.name ||
                        "Client"
                      }
                    />

                  ) : (

                    <UserRound size={21} />

                  )}

                </div>


                <div className="client-owner-info">

                  <strong>

                    {project.client?.name ||
                      "You"}

                  </strong>

                  <span>

                    Project Client

                  </span>

                </div>

              </div>

            </div>


            {/* =================================================
                PROJECT ACTIONS
                ================================================= */}

            <div className="client-side-card">

              <div className="client-side-card-title">

                <span>

                  PROJECT ACTIONS

                </span>

              </div>


              <div className="client-project-actions">


                {/* EDIT */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/client/projects/${projectId}/edit`
                    )
                  }
                  className="client-action-btn edit"
                >

                  <Pencil size={16} />

                  Edit Project

                </button>


                {/* DELETE */}

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="client-action-btn delete"
                >

                  <Trash2 size={16} />

                  {deleting
                    ? "Deleting..."
                    : "Delete Project"}

                </button>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </div>

  );
};


export default ProjectDetails;