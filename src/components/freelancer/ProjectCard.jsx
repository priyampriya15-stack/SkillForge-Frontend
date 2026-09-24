import { Link } from "react-router-dom";

import {
  FaBriefcase,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaArrowRight,
  FaCode,
  FaUser,
} from "react-icons/fa";

const ProjectCard = ({
  project = {},
  showClient = true,
  showViewButton = true,
}) => {
  // ---------------------------------------
  // PROJECT ID
  // ---------------------------------------

  const projectId =
    project?._id ||
    project?.id ||
    "";

  // ---------------------------------------
  // PROJECT DETAILS
  // ---------------------------------------

  const title =
    project?.title ||
    "Untitled Project";

  const description =
    project?.description ||
    "No project description available.";

  const category =
    project?.category ||
    "";

  const skills = Array.isArray(
    project?.skills
  )
    ? project.skills
    : [];

  // ---------------------------------------
  // CLIENT
  // ---------------------------------------

  const client =
    project?.client ||
    {};

  const clientName =
    client?.name ||
    client?.username ||
    project?.clientName ||
    "Client";

  const clientInitial =
    clientName
      .charAt(0)
      .toUpperCase();

  // ---------------------------------------
  // STATUS
  // ---------------------------------------

  const projectStatus =
    project?.status ||
    "open";

  // ---------------------------------------
  // FORMAT BUDGET
  // ---------------------------------------

  const formatBudget = (
    budget
  ) => {
    if (
      budget === null ||
      budget === undefined ||
      budget === ""
    ) {
      return "Not specified";
    }

    const amount =
      Number(budget);

    if (
      Number.isNaN(amount)
    ) {
      return String(budget);
    }

    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  };

  // ---------------------------------------
  // FORMAT DATE
  // ---------------------------------------

  const formatDate = (
    date
  ) => {
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

  return (
    <article className="freelancer-project-card">
      {/* -------------------------------- */}
      {/* CARD TOP */}
      {/* -------------------------------- */}

      <div className="freelancer-project-card-top">
        <div className="freelancer-project-icon">
          <FaBriefcase />
        </div>

        <span className="freelancer-project-status">
          {projectStatus}
        </span>
      </div>

      {/* -------------------------------- */}
      {/* TITLE */}
      {/* -------------------------------- */}

      <h3>
        {title}
      </h3>

      {/* -------------------------------- */}
      {/* CATEGORY */}
      {/* -------------------------------- */}

      {category && (
        <span className="freelancer-project-category">
          {category}
        </span>
      )}

      {/* -------------------------------- */}
      {/* DESCRIPTION */}
      {/* -------------------------------- */}

      <p className="freelancer-project-description">
        {description}
      </p>

      {/* -------------------------------- */}
      {/* SKILLS */}
      {/* -------------------------------- */}

      {skills.length > 0 && (
        <div className="freelancer-project-skills">
          <div className="freelancer-skills-label">
            <FaCode />

            <span>
              Required Skills
            </span>
          </div>

          <div className="freelancer-skills-list">
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
              <span className="freelancer-more-skills">
                +{skills.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------- */}
      {/* DIVIDER */}
      {/* -------------------------------- */}

      <div className="freelancer-card-divider" />

      {/* -------------------------------- */}
      {/* PROJECT META */}
      {/* -------------------------------- */}

      <div className="freelancer-project-meta">
        {/* BUDGET */}
        <div className="freelancer-meta-row">
          <div>
            <FaMoneyBillWave />

            <span>
              Budget
            </span>
          </div>

          <strong>
            {formatBudget(
              project?.budget
            )}
          </strong>
        </div>

        {/* DEADLINE */}
        <div className="freelancer-meta-row">
          <div>
            <FaCalendarAlt />

            <span>
              Deadline
            </span>
          </div>

          <span className="freelancer-meta-value">
            {formatDate(
              project?.deadline
            )}
          </span>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* CLIENT */}
      {/* -------------------------------- */}

      {showClient && (
        <div className="freelancer-project-client">
          {client?.profileImage ? (
            <img
              src={
                client.profileImage
              }
              alt={clientName}
            />
          ) : (
            <div className="freelancer-client-avatar">
              {clientInitial || (
                <FaUser />
              )}
            </div>
          )}

          <div className="freelancer-client-info">
            <span>
              Posted by
            </span>

            <strong>
              {clientName}
            </strong>
          </div>
        </div>
      )}

      {/* -------------------------------- */}
      {/* VIEW PROJECT */}
      {/* -------------------------------- */}

      {showViewButton &&
        projectId && (
          <Link
            to={`/freelancer/projects/${projectId}`}
            className="freelancer-view-project-btn"
          >
            <span>
              View Project
            </span>

            <FaArrowRight />
          </Link>
        )}
    </article>
  );
};

export default ProjectCard;