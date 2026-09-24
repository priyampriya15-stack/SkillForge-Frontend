import {
  FaBriefcase,
  FaClock,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const ApplicationCard = ({ application = {} }) => {
  const project = application?.project || {};

  const title =
    project?.title ||
    project?.name ||
    "Untitled Project";

  const category =
    project?.category ||
    "General";

  const description =
    project?.description ||
    "No project description available.";

  const bidAmount =
    Number(application?.bidAmount || 0);

  const deadline =
    project?.deadline;

  const createdAt =
    application?.createdAt;

  const status =
    String(application?.status || "pending")
      .toLowerCase();

  const client =
    project?.client ||
    project?.postedBy ||
    project?.createdBy ||
    {};

  const clientName =
    client?.name ||
    client?.fullName ||
    client?.username ||
    "Client";

  const formatMoney = (amount) => {
    if (!amount) return "₹0";

    return `₹${Number(amount).toLocaleString(
      "en-IN"
    )}`;
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Not specified";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatus = () => {
    if (status === "accepted") {
      return {
        label: "Accepted",
        className: "application-status accepted",
        icon: <FaCheckCircle />,
      };
    }

    if (status === "rejected") {
      return {
        label: "Rejected",
        className: "application-status rejected",
        icon: <FaTimesCircle />,
      };
    }

    return {
      label: "Pending",
      className: "application-status pending",
      icon: <FaClock />,
    };
  };

  const statusInfo = getStatus();

  const handleViewProject = () => {
    const projectId =
      project?._id ||
      project?.id;

    if (!projectId) return;

    window.location.href =
      `/freelancer/projects/${projectId}`;
  };

  return (
    <div className="application-card">

      {/* HEADER */}

      <div className="application-card-header">

        <div className="application-project-icon">
          <FaBriefcase />
        </div>

        <div className="application-main-info">

          <h3>{title}</h3>

          <span className="application-category">
            {category}
          </span>

        </div>

        <span className={statusInfo.className}>
          {statusInfo.icon}
          {statusInfo.label}
        </span>

      </div>

      {/* DESCRIPTION */}

      <p className="application-description">
        {description.length > 125
          ? `${description.substring(0, 125)}...`
          : description}
      </p>

      {/* DETAILS */}

      <div className="application-details">

        <div className="application-detail">

          <FaMoneyBillWave />

          <div>
            <small>Your Bid</small>

            <strong>
              {formatMoney(bidAmount)}
            </strong>
          </div>

        </div>

        <div className="application-detail">

          <FaCalendarAlt />

          <div>
            <small>Applied On</small>

            <strong>
              {formatDate(createdAt)}
            </strong>
          </div>

        </div>

        <div className="application-detail">

          <FaClock />

          <div>
            <small>Deadline</small>

            <strong>
              {formatDate(deadline)}
            </strong>
          </div>

        </div>

      </div>

      {/* FOOTER */}

      <div className="application-card-footer">

        <div className="application-client">

          <div className="application-client-avatar">
            {clientName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <small>Project posted by</small>
            <strong>{clientName}</strong>
          </div>

        </div>

        <button
          className="application-view-btn"
          onClick={handleViewProject}
        >
          View Project
          <FaArrowRight />
        </button>

      </div>

      <style>{`

        .application-card {
          width: 100%;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 15px;
          background: #ffffff;
          box-shadow:
            0 5px 16px rgba(15, 23, 42, 0.04);
          transition: all .2s ease;
        }

        .application-card:hover {
          transform: translateY(-2px);
          border-color: #c7d2fe;
          box-shadow:
            0 12px 25px rgba(79,70,229,.08);
        }

        .application-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .application-project-icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: #eef2ff;
          color: #4f46e5;
        }

        .application-main-info {
          flex: 1;
          min-width: 0;
        }

        .application-main-info h3 {
          margin: 0;
          overflow: hidden;
          color: #111827;
          font-size: 15px;
          font-weight: 800;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .application-category {
          display: block;
          margin-top: 4px;
          color: #6366f1;
          font-size: 11px;
          font-weight: 700;
        }

        .application-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .application-status.pending {
          background: #fff7ed;
          color: #c2410c;
        }

        .application-status.accepted {
          background: #ecfdf5;
          color: #047857;
        }

        .application-status.rejected {
          background: #fef2f2;
          color: #b91c1c;
        }

        .application-description {
          margin: 14px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
        }

        .application-details {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 16px;
          padding: 14px 0;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
        }

        .application-detail {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .application-detail > svg {
          color: #6366f1;
          font-size: 13px;
        }

        .application-detail small {
          display: block;
          color: #94a3b8;
          font-size: 9px;
        }

        .application-detail strong {
          display: block;
          margin-top: 2px;
          color: #1e293b;
          font-size: 11px;
        }

        .application-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 14px;
        }

        .application-client {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .application-client-avatar {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #312e81;
          color: white;
          font-size: 12px;
          font-weight: 800;
        }

        .application-client small {
          display: block;
          color: #94a3b8;
          font-size: 9px;
        }

        .application-client strong {
          display: block;
          margin-top: 2px;
          color: #334155;
          font-size: 11px;
        }

        .application-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 13px;
          border: 0;
          border-radius: 8px;
          background: #4f46e5;
          color: white;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .application-view-btn:hover {
          background: #4338ca;
        }

        @media (max-width: 700px) {

          .application-details {
            grid-template-columns: 1fr;
          }

          .application-card-header {
            align-items: flex-start;
          }

          .application-status {
            margin-left: auto;
          }

          .application-card-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .application-view-btn {
            justify-content: center;
          }

        }

      `}</style>

    </div>
  );
};

export default ApplicationCard;