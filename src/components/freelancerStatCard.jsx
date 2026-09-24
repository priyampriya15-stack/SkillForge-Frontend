
import React from "react";

const FreelancerStatCard = ({
  title = "Statistic",
  value = 0,
  icon = null,
}) => {
  return (
    <div className="freelancer-stat-card">

      {/* Icon */}
      <div className="freelancer-stat-card-icon">
        {icon}
      </div>

      {/* Content */}
      <div className="freelancer-stat-card-content">

        <p className="freelancer-stat-card-title">
          {title}
        </p>

        <h3 className="freelancer-stat-card-value">
          {value}
        </h3>

      </div>

    </div>
  );
};

export default FreelancerStatCard;


/* =========================================================
   STYLES
   ========================================================= */

const style = document.createElement("style");

style.innerHTML = `
  .freelancer-stat-card {
    width: 100%;
    min-height: 120px;

    display: flex;
    align-items: center;
    gap: 15px;

    padding: 20px;

    background: #ffffff;

    border: 1px solid #e5e7eb;

    border-radius: 16px;

    box-shadow:
      0 6px 18px rgba(15, 23, 42, 0.05);

    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }


  .freelancer-stat-card:hover {
    transform: translateY(-3px);

    box-shadow:
      0 12px 25px rgba(15, 23, 42, 0.08);
  }


  .freelancer-stat-card-icon {
    width: 48px;
    height: 48px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 12px;

    background: #eef2ff;

    color: #4f46e5;

    font-size: 20px;
  }


  .freelancer-stat-card-content {
    min-width: 0;
  }


  .freelancer-stat-card-title {
    margin: 0 0 5px;

    color: #64748b;

    font-size: 12px;

    font-weight: 700;

    letter-spacing: 0.02em;
  }


  .freelancer-stat-card-value {
    margin: 0;

    color: #111827;

    font-size: 25px;

    font-weight: 800;

    line-height: 1.2;
  }


  @media (max-width: 600px) {

    .freelancer-stat-card {
      min-height: 100px;

      padding: 16px;
    }


    .freelancer-stat-card-icon {
      width: 42px;
      height: 42px;

      font-size: 17px;
    }


    .freelancer-stat-card-value {
      font-size: 21px;
    }

  }
`;

document.head.appendChild(style);

