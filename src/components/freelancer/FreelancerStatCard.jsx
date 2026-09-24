import {
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const FreelancerStatCard = ({
  title = "",
  value = 0,
  icon = null,
  description = "",
  trend = null,
  trendType = "up",
}) => {
  const hasTrend =
    trend !== null &&
    trend !== undefined &&
    trend !== "";

  return (
    <div className="freelancer-stat-card">
      {/* ICON */}
      <div className="freelancer-stat-icon">
        {icon}
      </div>

      {/* CONTENT */}
      <div className="freelancer-stat-content">
        <span className="freelancer-stat-title">
          {title}
        </span>

        <strong className="freelancer-stat-value">
          {value}
        </strong>

        {(description || hasTrend) && (
          <div className="freelancer-stat-bottom">
            {/* TREND */}
            {hasTrend && (
              <span
                className={`freelancer-stat-trend ${
                  trendType === "down"
                    ? "down"
                    : "up"
                }`}
              >
                {trendType === "down" ? (
                  <FaArrowDown />
                ) : (
                  <FaArrowUp />
                )}

                <span>{trend}</span>
              </span>
            )}

            {/* DESCRIPTION */}
            {description && (
              <span className="freelancer-stat-description">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerStatCard;