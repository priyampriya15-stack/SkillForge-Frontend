import { Link } from "react-router-dom";

import {
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaArrowRight,
  FaMoneyBillWave,
  FaUser,
} from "react-icons/fa";


const ApplicationCard = ({
  application = {},
  showProjectLink = true,
  compact = false,
}) => {

  /* =========================================================
     PROJECT DATA
     Supports populated project object or direct fields
     ========================================================= */

  const project =
    application.project ||
    application.projectId ||
    {};

  const projectId =
    project?._id ||
    project?.id ||
    application.projectId ||
    application.project_id ||
    "";

  const projectTitle =
    project?.title ||
    application.projectTitle ||
    application.title ||
    "Untitled Project";


  /* =========================================================
     APPLICATION STATUS
     ========================================================= */

  const rawStatus =
    application.status ||
    "pending";

  const status =
    String(rawStatus).toLowerCase();


  const getStatusConfig = () => {
    switch (status) {
      case "accepted":
      case "approved":
        return {
          label: "Accepted",
          className:
            "freelancer-application-status accepted",
          icon: <FaCheckCircle />,
        };

      case "rejected":
      case "declined":
        return {
          label: "Rejected",
          className:
            "freelancer-application-status rejected",
          icon: <FaTimesCircle />,
        };

      case "completed":
        return {
          label: "Completed",
          className:
            "freelancer-application-status completed",
          icon: <FaCheckCircle />,
        };

      case "withdrawn":
        return {
          label: "Withdrawn",
          className:
            "freelancer-application-status withdrawn",
          icon: <FaTimesCircle />,
        };

      case "reviewing":
        return {
          label: "Under Review",
          className:
            "freelancer-application-status reviewing",
          icon: <FaHourglassHalf />,
        };

      case "pending":
      default:
        return {
          label: "Pending",
          className:
            "freelancer-application-status pending",
          icon: <FaClock />,
        };
    }
  };


  const statusConfig =
    getStatusConfig();


  /* =========================================================
     BUDGET
     ========================================================= */

  const budget =
    application.bidAmount ??
    application.bid ??
    application.proposedBudget ??
    application.amount ??
    project?.budget ??
    null;


  const formatBudget = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Not specified";
    }

    const numericValue =
      Number(value);

    if (Number.isNaN(numericValue)) {
      return String(value);
    }

    return `₹${numericValue.toLocaleString(
      "en-IN"
    )}`;
  };


  /* =========================================================
     DATE FORMATTER
     ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  /* =========================================================
     APPLICATION DATE
     ========================================================= */

  const appliedDate =
    application.createdAt ||
    application.appliedAt ||
    application.applicationDate ||
    null;


  /* =========================================================
     PROJECT DEADLINE
     ========================================================= */

  const deadline =
    project?.deadline ||
    application.deadline ||
    null;


  /* =========================================================
     CLIENT DATA
     ========================================================= */

  const client =
    project?.client ||
    application.client ||
    {};

  const clientName =
    client?.name ||
    client?.username ||
    application.clientName ||
    "Client";


  const clientInitial =
    clientName
      .charAt(0)
      .toUpperCase();


  /* =========================================================
     SKILLS
     ========================================================= */

  const skills = Array.isArray(
    project?.skills
  )
    ? project.skills
    : Array.isArray(
        application.skills
      )
    ? application.skills
    : [];


  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <article
      className={`freelancer-application-card ${
        compact
          ? "compact"
          : ""
      }`}
    >

      {/* =====================================================
          CARD HEADER
          ===================================================== */}

      <div className="freelancer-application-card-header">

        <div className="freelancer-application-project-icon">
          <FaBriefcase />
        </div>


        <div className="freelancer-application-heading">

          <h3>
            {projectTitle}
          </h3>

          {project?.category && (
            <span>
              {project.category}
            </span>
          )}

        </div>


        {/* STATUS */}

        <div
          className={
            statusConfig.className
          }
        >
          {statusConfig.icon}

          <span>
            {statusConfig.label}
          </span>
        </div>

      </div>


      {/* =====================================================
          CLIENT
          ===================================================== */}

      {!compact && (
        <div className="freelancer-application-client">

          {client?.profileImage ? (
            <img
              src={
                client.profileImage
              }
              alt={clientName}
            />
          ) : (
            <div className="freelancer-application-client-avatar">
              {clientInitial || (
                <FaUser />
              )}
            </div>
          )}

          <div>
            <span>
              Project posted by
            </span>

            <strong>
              {clientName}
            </strong>
          </div>

        </div>
      )}


      {/* =====================================================
          APPLICATION DETAILS
          ===================================================== */}

      <div className="freelancer-application-details">

        {/* BID */}

        <div className="freelancer-application-detail">

          <div className="freelancer-application-detail-icon">
            <FaMoneyBillWave />
          </div>

          <div>
            <span>
              Your Bid
            </span>

            <strong>
              {formatBudget(
                budget
              )}
            </strong>
          </div>

        </div>


        {/* APPLIED DATE */}

        <div className="freelancer-application-detail">

          <div className="freelancer-application-detail-icon">
            <FaCalendarAlt />
          </div>

          <div>
            <span>
              Applied On
            </span>

            <strong>
              {formatDate(
                appliedDate
              )}
            </strong>
          </div>

        </div>


        {/* DEADLINE */}

        {deadline && (
          <div className="freelancer-application-detail">

            <div className="freelancer-application-detail-icon">
              <FaClock />
            </div>

            <div>
              <span>
                Deadline
              </span>

              <strong>
                {formatDate(
                  deadline
                )}
              </strong>
            </div>

          </div>
        )}

      </div>


      {/* =====================================================
          SKILLS
          ===================================================== */}

      {!compact &&
        skills.length > 0 && (
          <div className="freelancer-application-skills">

            {skills
              .slice(0, 5)
              .map(
                (
                  skill,
                  index
                ) => (
                  <span
                    key={`${skill}-${index}`}
                  >
                    {skill}
                  </span>
                )
              )}

            {skills.length > 5 && (
              <span>
                +{skills.length - 5}
              </span>
            )}

          </div>
        )}


      {/* =====================================================
          COVER LETTER
          ===================================================== */}

      {!compact &&
        application.coverLetter && (
          <div className="freelancer-application-cover">

            <span>
              Cover Letter
            </span>

            <p>
              {application.coverLetter}
            </p>

          </div>
        )}


      {/* =====================================================
          FOOTER
          ===================================================== */}

      <div className="freelancer-application-card-footer">

        <div className="freelancer-application-footer-status">

          {status === "accepted" ||
          status === "approved" ? (
            <>
              <FaCheckCircle />

              <span>
                Your application was accepted
              </span>
            </>
          ) : status ===
            "rejected" ||
            status ===
              "declined" ? (
            <>
              <FaTimesCircle />

              <span>
                Application was not selected
              </span>
            </>
          ) : (
            <>
              <FaHourglassHalf />

              <span>
                Waiting for client response
              </span>
            </>
          )}

        </div>


        {/* PROJECT LINK */}

        {showProjectLink &&
          projectId && (
            <Link
              to={`/freelancer/projects/${projectId}`}
              className="freelancer-application-view-btn"
            >
              <span>
                View Project
              </span>

              <FaArrowRight />
            </Link>
          )}

      </div>

    </article>
  );
};


export default ApplicationCard;