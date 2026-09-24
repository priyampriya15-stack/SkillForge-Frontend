import {
  FaBell,
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaArrowRight,
} from "react-icons/fa";

const FreelancerNotification = ({
  notification = {},
  onClick,
  showAction = false,
}) => {
  // ---------------------------------------
  // NOTIFICATION TYPE
  // ---------------------------------------
  const type =
    String(
      notification?.type || "info"
    ).toLowerCase();

  const getNotificationConfig = () => {
    switch (type) {
      case "success":
      case "accepted":
      case "approved":
        return {
          icon: <FaCheckCircle />,
          className:
            "success",
        };

      case "warning":
        return {
          icon: <FaExclamationCircle />,
          className:
            "warning",
        };

      case "error":
      case "rejected":
      case "declined":
        return {
          icon: <FaTimesCircle />,
          className:
            "error",
        };

      case "info":
      case "project":
      case "application":
      default:
        return {
          icon: <FaInfoCircle />,
          className:
            "info",
        };
    }
  };

  const config =
    getNotificationConfig();

  // ---------------------------------------
  // DATA
  // ---------------------------------------
  const title =
    notification?.title ||
    "Notification";

  const message =
    notification?.message ||
    notification?.description ||
    "You have a new notification.";

  const createdAt =
    notification?.createdAt ||
    notification?.date ||
    notification?.timestamp ||
    null;

  const isRead =
    Boolean(notification?.isRead) ||
    Boolean(notification?.read);

  // ---------------------------------------
  // DATE FORMAT
  // ---------------------------------------
  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
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

  // ---------------------------------------
  // TIME FORMAT
  // ---------------------------------------
  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const formattedDate =
    formatDate(createdAt);

  const formattedTime =
    formatTime(createdAt);

  // ---------------------------------------
  // CLICK HANDLER
  // ---------------------------------------
  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick(notification);
    }
  };

  // ---------------------------------------
  // ACTION
  // ---------------------------------------
  const actionLabel =
    notification?.actionLabel ||
    "View";

  // ---------------------------------------
  // RENDER
  // ---------------------------------------
  return (
    <article
      className={`freelancer-notification-card ${
        !isRead ? "unread" : "read"
      }`}
      onClick={
        onClick
          ? handleClick
          : undefined
      }
      role={
        onClick
          ? "button"
          : undefined
      }
      tabIndex={
        onClick
          ? 0
          : undefined
    >
      {/* ICON */}
      <div
        className={`freelancer-notification-icon ${config.className}`}
      >
        {config.icon || (
          <FaBell />
        )}
      </div>

      {/* CONTENT */}
      <div className="freelancer-notification-content">
        <div className="freelancer-notification-header">
          <h4>
            {title}
          </h4>

          {!isRead && (
            <span className="freelancer-notification-unread-dot" />
          )}
        </div>

        <p>
          {message}
        </p>

        {(formattedDate ||
          formattedTime) && (
          <div className="freelancer-notification-time">
            {formattedDate}

            {formattedTime && (
              <>
                <span>•</span>
                {formattedTime}
              </>
            )}
          </div>
        )}
      </div>

      {/* ACTION */}
      {showAction && (
        <button
          type="button"
          className="freelancer-notification-action"
          onClick={(event) => {
            event.stopPropagation();

            if (
              typeof onClick ===
              "function"
            ) {
              onClick(
                notification
              );
            }
          }}
        >
          <span>
            {actionLabel}
          </span>

          <FaArrowRight />
        </button>
      )}
    </article>
  );
};

export default FreelancerNotification;