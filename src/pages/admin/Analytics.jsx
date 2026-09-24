import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getAdminAnalytics } from "../../Services/adminService";
import "./analytics.css";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminAnalytics();

      setData(
        response?.analytics ||
        response?.data ||
        response
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load analytics from the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-container">
          <div className="analytics-loading">
            <div className="analytics-spinner"></div>
            <strong>Loading analytics...</strong>
            <span>Please wait while we fetch the latest data.</span>
          </div>
        </div>
      </div>
    );
  }

  /* ================= DATA ================= */

  const users = [
    {
      name: "Clients",
      value: Number(data?.users?.clients || 0),
    },
    {
      name: "Freelancers",
      value: Number(data?.users?.freelancers || 0),
    },
  ];

  const projects = [
    {
      name: "Open",
      value: Number(data?.projects?.open || 0),
    },
    {
      name: "In Progress",
      value: Number(data?.projects?.inProgress || 0),
    },
    {
      name: "Completed",
      value: Number(data?.projects?.completed || 0),
    },
    {
      name: "Cancelled",
      value: Number(data?.projects?.cancelled || 0),
    },
  ];

  const proposals = [
    {
      name: "Accepted",
      value: Number(data?.proposals?.accepted || 0),
    },
    {
      name: "Rejected",
      value: Number(data?.proposals?.rejected || 0),
    },
  ];

  const totalUsers = Number(
    data?.users?.total || 0
  );

  const totalProjects = Number(
    data?.projects?.total || 0
  );

  const totalProposals = Number(
    data?.proposals?.total || 0
  );

  const revenue = Number(
    data?.payments?.revenue || 0
  );

  return (
    <div className="analytics-page">
      <div className="analytics-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="analytics-header">

          <div className="analytics-header-content">

            <div className="analytics-eyebrow">
              <span className="analytics-live-dot"></span>
              INSIGHTS
            </div>

            <h1>Marketplace Analytics</h1>

            <p>
              Monitor users, projects, proposals and
              payment activity across SkillForge.
            </p>

          </div>

          <button
            type="button"
            className="analytics-refresh-btn"
            onClick={loadAnalytics}
          >
            <span>↻</span>
            Refresh
          </button>

        </header>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="analytics-error">
            <span>⚠</span>
            {error}
          </div>
        )}


        {/* =================================================
            OVERVIEW
        ================================================= */}

        <section className="analytics-overview">

          {/* USERS */}

          <div className="analytics-overview-card analytics-card-users">

            <div className="analytics-icon">
              👥
            </div>

            <div>
              <span>Total Users</span>
              <strong>{totalUsers}</strong>
            </div>

          </div>


          {/* PROJECTS */}

          <div className="analytics-overview-card analytics-card-projects">

            <div className="analytics-icon">
              💼
            </div>

            <div>
              <span>Total Projects</span>
              <strong>{totalProjects}</strong>
            </div>

          </div>


          {/* PROPOSALS */}

          <div className="analytics-overview-card analytics-card-proposals">

            <div className="analytics-icon">
              📄
            </div>

            <div>
              <span>Total Proposals</span>
              <strong>{totalProposals}</strong>
            </div>

          </div>


          {/* REVENUE */}

          <div className="analytics-overview-card analytics-card-revenue">

            <div className="analytics-icon">
              ₹
            </div>

            <div>
              <span>Total Revenue</span>

              <strong>
                ₹{revenue.toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

        </section>


        {/* =================================================
            CHART GRID
        ================================================= */}

        <div className="analytics-chart-grid">


          {/* =================================================
              USERS BY ROLE
          ================================================= */}

          <section className="analytics-panel analytics-panel-large">

            <div className="analytics-panel-header">

              <div className="analytics-panel-heading">

                <span className="analytics-label">
                  USER DISTRIBUTION
                </span>

                <h2>Users by Role</h2>

                <p>
                  Breakdown of clients and freelancers.
                </p>

              </div>

              <div className="analytics-panel-icon">
                👥
              </div>

            </div>


            <div className="analytics-chart">

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={users}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={105}
                    innerRadius={55}
                    paddingAngle={3}
                    label
                  >

                    {users.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={COLORS[index]}
                      />
                    ))}

                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e7eaf0",
                      boxShadow:
                        "0 10px 30px rgba(22,30,50,0.10)",
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>

            </div>


            <div className="analytics-legend">

              {users.map((item, index) => (
                <div
                  className="analytics-legend-item"
                  key={item.name}
                >

                  <span
                    className="legend-dot"
                    style={{
                      backgroundColor:
                        COLORS[index],
                    }}
                  ></span>

                  <span>{item.name}</span>

                  <strong>{item.value}</strong>

                </div>
              ))}

            </div>

          </section>


          {/* =================================================
              PROJECT STATUS
          ================================================= */}

          <section className="analytics-panel analytics-panel-large">

            <div className="analytics-panel-header">

              <div className="analytics-panel-heading">

                <span className="analytics-label">
                  PROJECT ACTIVITY
                </span>

                <h2>Project Status</h2>

                <p>
                  Current status of marketplace projects.
                </p>

              </div>

              <div className="analytics-panel-icon">
                📊
              </div>

            </div>


            <div className="analytics-chart">

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={projects}
                  margin={{
                    top: 15,
                    right: 10,
                    left: -15,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#7b8494",
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#7b8494",
                      fontSize: 11,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: "rgba(99,102,241,0.05)",
                    }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e7eaf0",
                    }}
                  />

                  <Bar
                    dataKey="value"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                    barSize={42}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </section>


          {/* =================================================
              PROPOSALS
          ================================================= */}

          <section className="analytics-panel">

            <div className="analytics-panel-header">

              <div className="analytics-panel-heading">

                <span className="analytics-label">
                  PROPOSALS
                </span>

                <h2>Proposal Outcomes</h2>

                <p>
                  Accepted versus rejected proposals.
                </p>

              </div>

              <div className="analytics-panel-icon">
                📝
              </div>

            </div>


            <div className="analytics-chart">

              <ResponsiveContainer
                width="100%"
                height={270}
              >

                <PieChart>

                  <Pie
                    data={proposals}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={4}
                    label
                  >

                    {proposals.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={COLORS[index + 3]}
                      />
                    ))}

                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e7eaf0",
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>

            </div>


            <div className="analytics-legend">

              {proposals.map((item, index) => (
                <div
                  className="analytics-legend-item"
                  key={item.name}
                >

                  <span
                    className="legend-dot"
                    style={{
                      backgroundColor:
                        COLORS[index + 3],
                    }}
                  ></span>

                  <span>{item.name}</span>

                  <strong>{item.value}</strong>

                </div>
              ))}

            </div>

          </section>


          {/* =================================================
              PAYMENT SUMMARY
          ================================================= */}

          <section className="analytics-panel">

            <div className="analytics-panel-header">

              <div className="analytics-panel-heading">

                <span className="analytics-label">
                  FINANCIAL OVERVIEW
                </span>

                <h2>Payment Summary</h2>

                <p>
                  Payment activity from the marketplace.
                </p>

              </div>

              <div className="analytics-panel-icon">
                💳
              </div>

            </div>


            <div className="payment-grid">

              <div className="payment-item paid">
                <span>Paid</span>

                <strong>
                  {data?.payments?.paid || 0}
                </strong>
              </div>


              <div className="payment-item pending">
                <span>Pending</span>

                <strong>
                  {data?.payments?.pending || 0}
                </strong>
              </div>


              <div className="payment-item failed">
                <span>Failed</span>

                <strong>
                  {data?.payments?.failed || 0}
                </strong>
              </div>


              <div className="payment-item refunded">
                <span>Refunded</span>

                <strong>
                  {data?.payments?.refunded || 0}
                </strong>
              </div>

            </div>


            {/* REVENUE */}

            <div className="revenue-box">

              <div className="revenue-content">

                <span>Total Revenue</span>

                <strong>
                  ₹{revenue.toLocaleString("en-IN")}
                </strong>

              </div>

              <div className="revenue-icon">
                ₹
              </div>

            </div>

          </section>

        </div>

      </div>
    </div>
  );
}