import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showApply, setShowApply] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    coverLetter: "",
    bidAmount: "",
    deliveryTime: "",
  });

  // =========================================================
  // API CONFIG
  // =========================================================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  // =========================================================
  // AUTH CONFIG
  // =========================================================

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

  // =========================================================
  // FETCH PROJECT
  // =========================================================

  const fetchProject = async () => {
    if (!id) {
      setError("Project ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("====================================");
      console.log("FETCHING FREELANCER PROJECT");
      console.log("Project ID:", id);
      console.log("API:", `${API_URL}/projects/${id}`);
      console.log("====================================");

      const response = await axios.get(
        `${API_URL}/projects/${id}`,
        getAuthConfig()
      );

      console.log(
        "PROJECT API RESPONSE:",
        response.data
      );

      const responseData = response.data;

      // -----------------------------------------------------
      // HANDLE DIFFERENT RESPONSE STRUCTURES
      // -----------------------------------------------------

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
        throw new Error(
          "Project data not found in API response."
        );
      }

      setProject(projectData);

    } catch (err) {
      console.error("====================================");
      console.error("FETCH PROJECT ERROR");
      console.error("Status:", err?.response?.status);
      console.error("Response:", err?.response?.data);
      console.error("Message:", err?.message);
      console.error("====================================");

      if (err?.response?.status === 404) {
        setError(
          "Project not found. The project may have been deleted."
        );
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
            "Unable to load project details."
        );
      }

      setProject(null);

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD PROJECT
  // =========================================================

  useEffect(() => {
    fetchProject();
  }, [id]);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // OPEN APPLY MODAL
  // =========================================================

  const openApplyModal = () => {
    setShowApply(true);
  };

  // =========================================================
  // CLOSE APPLY MODAL
  // =========================================================

  const closeApplyModal = () => {
    if (submitting) return;

    setShowApply(false);
  };

  // =========================================================
  // SUBMIT APPLICATION
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!form.coverLetter.trim()) {
      alert("Please enter your cover letter.");
      return;
    }

    if (!form.bidAmount) {
      alert("Please enter your bid amount.");
      return;
    }

    if (Number(form.bidAmount) <= 0) {
      alert("Bid amount must be greater than 0.");
      return;
    }

    if (!form.deliveryTime) {
      alert("Please enter your delivery time.");
      return;
    }

    if (Number(form.deliveryTime) <= 0) {
      alert("Delivery time must be greater than 0.");
      return;
    }

    try {
      setSubmitting(true);

      // -----------------------------------------------------
      // IMPORTANT
      //
      // Backend expects:
      //
      // POST /api/applications/:projectId
      //
      // Body:
      // {
      //   proposal,
      //   bidAmount
      // }
      //
      // deliveryTime is currently only frontend UI data.
      // -----------------------------------------------------

      const applicationData = {
        proposal: form.coverLetter.trim(),
        bidAmount: Number(form.bidAmount),
      };

      console.log("====================================");
      console.log("SUBMITTING APPLICATION");
      console.log("Project ID:", id);
      console.log(
        "Application Data:",
        applicationData
      );
      console.log(
        "API:",
        `${API_URL}/applications/${id}`
      );
      console.log("====================================");

      // -----------------------------------------------------
      // CORRECT BACKEND ENDPOINT
      // -----------------------------------------------------

      const response = await axios.post(
        `${API_URL}/applications/${id}`,
        applicationData,
        getAuthConfig()
      );

      console.log(
        "APPLICATION RESPONSE:",
        response.data
      );

      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      alert(
        response.data?.message ||
          "Application submitted successfully!"
      );

      setShowApply(false);

      setForm({
        coverLetter: "",
        bidAmount: "",
        deliveryTime: "",
      });

      // Go to freelancer applications
      navigate("/freelancer/my-applications");

    } catch (err) {
      console.error("====================================");
      console.error("APPLICATION ERROR");
      console.error("Status:", err?.response?.status);
      console.error(
        "Response:",
        err?.response?.data
      );
      console.error(
        "Message:",
        err?.message
      );
      console.error("====================================");

      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to submit application."
      );

    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <div className="project-details-page">

          <div className="details-loading">

            <div className="loading-spinner"></div>

            <h3>
              Loading project...
            </h3>

            <p>
              Please wait while we fetch
              the project details.
            </p>

          </div>

        </div>
      </>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <>
        <style>{styles}</style>

        <div className="project-details-page">

          <button
            className="back-btn"
            onClick={() =>
              navigate(
                "/freelancer/browse-projects"
              )
            }
          >
            ← Back to Projects
          </button>

          <div className="details-state error-state">

            <div className="state-icon">
              !
            </div>

            <h2>
              Unable to load project
            </h2>

            <p>
              {error}
            </p>

            <div className="state-actions">

              <button
                className="primary-btn"
                onClick={fetchProject}
              >
                Try Again
              </button>

              <button
                className="secondary-btn"
                onClick={() =>
                  navigate(
                    "/freelancer/browse-projects"
                  )
                }
              >
                Browse Projects
              </button>

            </div>

          </div>

        </div>
      </>
    );
  }

  // =========================================================
  // PROJECT NOT FOUND
  // =========================================================

  if (!project) {
    return (
      <>
        <style>{styles}</style>

        <div className="project-details-page">

          <button
            className="back-btn"
            onClick={() =>
              navigate(
                "/freelancer/browse-projects"
              )
            }
          >
            ← Back to Projects
          </button>

          <div className="details-state">

            <div className="state-icon">
              📁
            </div>

            <h2>
              Project not found
            </h2>

            <p>
              The requested project could
              not be found.
            </p>

            <button
              className="primary-btn"
              onClick={() =>
                navigate(
                  "/freelancer/browse-projects"
                )
              }
            >
              Browse Projects
            </button>

          </div>

        </div>
      </>
    );
  }

  // =========================================================
  // NORMALIZE PROJECT DATA
  // =========================================================

  const skills = Array.isArray(project.skills)
    ? project.skills
    : [];

  const client =
    project.client ||
    project.owner ||
    project.postedBy ||
    {};

  const applicationsCount =
    project.applicationsCount ??
    (Array.isArray(project.applications)
      ? project.applications.length
      : 0);

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      <style>{styles}</style>

      <div className="project-details-page">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          className="back-btn"
          onClick={() =>
            navigate(
              "/freelancer/browse-projects"
            )
          }
        >
          ← Back to Projects
        </button>

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="project-header-card">

          <div className="project-header-content">

            <div className="category-badge">
              {project.category || "Project"}
            </div>

            <h1>
              {project.title ||
                "Untitled Project"}
            </h1>

            <p className="project-short-description">
              {project.description ||
                "No project description available."}
            </p>

            <div className="project-meta">

              <span>
                📅 Posted{" "}
                {project.createdAt
                  ? new Date(
                      project.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "Recently"}
              </span>

              <span>
                📍{" "}
                {project.location ||
                  "Remote"}
              </span>

              <span>
                👥{" "}
                {applicationsCount}{" "}
                Applications
              </span>

            </div>

          </div>

          {/* BUDGET */}

          <div className="header-action">

            <div className="budget-label">
              Project Budget
            </div>

            <div className="budget-value">
              ₹
              {Number(
                project.budget || 0
              ).toLocaleString("en-IN")}
            </div>

            <button
              className="apply-main-btn"
              onClick={openApplyModal}
            >
              Apply Now →
            </button>

          </div>

        </section>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="details-grid">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="details-main">

            {/* DESCRIPTION */}

            <section className="detail-card">

              <div className="section-title">

                <span className="title-icon">
                  📄
                </span>

                <h2>
                  Project Description
                </h2>

              </div>

              <div className="description-text">
                {project.description ||
                  "No description provided."}
              </div>

            </section>

            {/* SKILLS */}

            <section className="detail-card">

              <div className="section-title">

                <span className="title-icon">
                  ⚡
                </span>

                <h2>
                  Required Skills
                </h2>

              </div>

              <div className="skills-container">

                {skills.length > 0 ? (
                  skills.map(
                    (skill, index) => (
                      <span
                        className="skill-tag"
                        key={index}
                      >
                        {typeof skill === "string"
                          ? skill
                          : skill?.name ||
                            skill?.title ||
                            "Skill"}
                      </span>
                    )
                  )
                ) : (
                  <p className="muted-text">
                    No specific skills
                    listed.
                  </p>
                )}

              </div>

            </section>

            {/* REQUIREMENTS */}

            <section className="detail-card">

              <div className="section-title">

                <span className="title-icon">
                  ✓
                </span>

                <h2>
                  Project Requirements
                </h2>

              </div>

              {project.requirements ? (
                <div className="description-text">
                  {project.requirements}
                </div>
              ) : (
                <p className="muted-text">
                  No additional
                  requirements provided.
                </p>
              )}

            </section>

          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="details-sidebar">

            {/* BUDGET */}

            <section className="side-card">

              <h3>
                Project Budget
              </h3>

              <div className="side-budget">
                ₹
                {Number(
                  project.budget || 0
                ).toLocaleString("en-IN")}
              </div>

              <div className="budget-type">
                {project.budgetType ||
                  "Fixed Price"}
              </div>

            </section>

            {/* DEADLINE */}

            <section className="side-card">

              <h3>
                Deadline
              </h3>

              <div className="deadline">

                <span className="deadline-icon">
                  🗓
                </span>

                <div>

                  <strong>
                    {project.deadline
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

                  <small>
                    Expected completion
                    date
                  </small>

                </div>

              </div>

            </section>

            {/* CLIENT */}

            <section className="side-card">

              <h3>
                About the Client
              </h3>

              <div className="client-box">

                <div className="client-avatar">

                  {client?.name
                    ? client.name
                        .charAt(0)
                        .toUpperCase()
                    : "C"}

                </div>

                <div>

                  <strong>
                    {client?.name ||
                      client?.fullName ||
                      "Client"}
                  </strong>

                  <span>
                    {client?.company ||
                      "SkillForge Client"}
                  </span>

                </div>

              </div>

              <div className="client-info">

                <div>
                  <span>📍</span>
                  {client?.location ||
                    "Location not specified"}
                </div>

                <div>
                  <span>📅</span>
                  Member since{" "}
                  {client?.createdAt
                    ? new Date(
                        client.createdAt
                      ).getFullYear()
                    : "N/A"}
                </div>

              </div>

            </section>

            {/* APPLY */}

            <section className="apply-side-card">

              <h3>
                Interested in this
                project?
              </h3>

              <p>
                Send your proposal and
                let the client know why
                you're the right freelancer.
              </p>

              <button
                className="apply-main-btn full"
                onClick={openApplyModal}
              >
                Apply Now →
              </button>

            </section>

          </aside>

        </div>

        {/* =================================================
            APPLY MODAL
        ================================================= */}

        {showApply && (
          <div
            className="modal-overlay"
            onClick={closeApplyModal}
          >

            <div
              className="apply-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="modal-header">

                <div>

                  <span className="modal-label">
                    APPLICATION
                  </span>

                  <h2>
                    Apply for Project
                  </h2>

                  <p>
                    Submit your proposal
                    to the client.
                  </p>

                </div>

                <button
                  className="close-btn"
                  disabled={submitting}
                  onClick={closeApplyModal}
                >
                  ×
                </button>

              </div>

              {/* FORM */}

              <form onSubmit={handleSubmit}>

                {/* COVER LETTER */}

                <div className="form-group">

                  <label>
                    Cover Letter
                    <span>*</span>
                  </label>

                  <textarea
                    name="coverLetter"
                    value={form.coverLetter}
                    onChange={handleChange}
                    placeholder="Explain why you're the right freelancer for this project..."
                    rows="6"
                    disabled={submitting}
                  />

                  <small>
                    Introduce yourself and
                    explain how you would
                    approach the project.
                  </small>

                </div>

                {/* BID + DELIVERY */}

                <div className="form-two-column">

                  <div className="form-group">

                    <label>
                      Your Bid Amount
                      <span>*</span>
                    </label>

                    <div className="input-with-symbol">

                      <span>
                        ₹
                      </span>

                      <input
                        type="number"
                        name="bidAmount"
                        value={form.bidAmount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        min="1"
                        disabled={submitting}
                      />

                    </div>

                  </div>

                  <div className="form-group">

                    <label>
                      Delivery Time
                      <span>*</span>
                    </label>

                    <div className="input-with-symbol">

                      <input
                        type="number"
                        name="deliveryTime"
                        value={
                          form.deliveryTime
                        }
                        onChange={handleChange}
                        placeholder="Days"
                        min="1"
                        disabled={submitting}
                      />

                      <span>
                        days
                      </span>

                    </div>

                  </div>

                </div>

                {/* SUMMARY */}

                <div className="application-summary">

                  <div>
                    <span>
                      Project Budget
                    </span>

                    <strong>
                      ₹
                      {Number(
                        project.budget || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Your Bid
                    </span>

                    <strong>
                      ₹
                      {Number(
                        form.bidAmount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Delivery
                    </span>

                    <strong>
                      {form.deliveryTime || 0}{" "}
                      days
                    </strong>
                  </div>

                </div>

                {/* ACTIONS */}

                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    disabled={submitting}
                    onClick={closeApplyModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit Application →"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = `
.project-details-page {
  min-height: calc(100vh - 80px);
  padding: 28px 32px 50px;
  background: #f8fafc;
  color: #0f172a;
}

.back-btn {
  border: none;
  background: transparent;
  color: #475569;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 6px 0;
}

.back-btn:hover {
  color: #059669;
}

.project-header-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.04);
}

.project-header-content {
  flex: 1;
}

.category-badge {
  display: inline-flex;
  padding: 7px 12px;
  border-radius: 999px;
  background: #ecfdf5;
  color: #047857;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 14px;
}

.project-header-card h1 {
  font-size: 30px;
  margin: 0 0 12px;
  line-height: 1.2;
}

.project-short-description {
  color: #64748b;
  line-height: 1.7;
  max-width: 760px;
  margin: 0;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 20px;
  color: #64748b;
  font-size: 13px;
}

.header-action {
  min-width: 220px;
  padding: 20px;
  border-radius: 16px;
  background: #f8fafc;
  text-align: center;
}

.budget-label {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.budget-value {
  font-size: 28px;
  font-weight: 900;
  margin: 7px 0 16px;
}

.apply-main-btn {
  width: 100%;
  border: none;
  border-radius: 11px;
  padding: 13px 18px;
  background: #059669;
  color: white;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
}

.apply-main-btn:hover {
  background: #047857;
  transform: translateY(-1px);
}

.apply-main-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.details-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 24px;
  margin-top: 24px;
}

.details-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-card,
.side-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 25px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.section-title h2 {
  font-size: 18px;
  margin: 0;
}

.title-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #ecfdf5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.description-text {
  color: #475569;
  line-height: 1.8;
  white-space: pre-line;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.skill-tag {
  padding: 8px 12px;
  background: #f1f5f9;
  color: #334155;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
}

.muted-text {
  color: #94a3b8;
  font-size: 14px;
}

.details-sidebar {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.side-card h3 {
  margin: 0 0 15px;
  font-size: 15px;
}

.side-budget {
  font-size: 25px;
  font-weight: 900;
}

.budget-type {
  color: #64748b;
  font-size: 12px;
  margin-top: 5px;
}

.deadline {
  display: flex;
  gap: 12px;
  align-items: center;
}

.deadline-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #ecfdf5;
}

.deadline strong,
.deadline small {
  display: block;
}

.deadline strong {
  font-size: 14px;
}

.deadline small {
  color: #94a3b8;
  margin-top: 4px;
}

.client-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.client-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #d1fae5;
  color: #047857;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.client-box strong,
.client-box span {
  display: block;
}

.client-box strong {
  font-size: 14px;
}

.client-box span {
  color: #64748b;
  font-size: 12px;
  margin-top: 3px;
}

.client-info {
  margin-top: 18px;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 11px;
  color: #64748b;
  font-size: 12px;
}

.client-info span {
  margin-right: 7px;
}

.apply-side-card {
  background: #0b1220;
  color: white;
  border-radius: 18px;
  padding: 24px;
}

.apply-side-card h3 {
  margin: 0 0 10px;
  font-size: 17px;
}

.apply-side-card p {
  color: #cbd5e1;
  line-height: 1.6;
  font-size: 13px;
}

.apply-main-btn.full {
  margin-top: 8px;
}

.details-loading,
.details-state {
  min-height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.details-state {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 40px;
}

.details-state p {
  max-width: 550px;
  color: #64748b;
  line-height: 1.7;
}

.loading-spinner {
  width: 42px;
  height: 42px;
  border: 4px solid #d1fae5;
  border-top-color: #059669;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 18px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.state-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: #ecfdf5;
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 900;
  margin-bottom: 18px;
}

.error-state .state-icon {
  background: #fef2f2;
  color: #dc2626;
}

.state-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn {
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
}

.primary-btn {
  background: #059669;
  color: white;
}

.secondary-btn {
  background: #f1f5f9;
  color: #334155;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.apply-modal {
  width: min(700px, 100%);
  max-height: 92vh;
  overflow-y: auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  padding: 26px 28px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-label {
  color: #059669;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
}

.modal-header h2 {
  margin: 5px 0;
  font-size: 22px;
}

.modal-header p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.close-btn {
  width: 34px;
  height: 34px;
  border: none;
  background: #f1f5f9;
  border-radius: 9px;
  font-size: 23px;
  cursor: pointer;
}

.close-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.apply-modal form {
  padding: 26px 28px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 8px;
}

.form-group label span {
  color: #dc2626;
  margin-left: 3px;
}

.form-group textarea,
.form-group input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 12px 13px;
  font: inherit;
  outline: none;
  color: #0f172a;
  background: white;
}

.form-group textarea {
  resize: vertical;
}

.form-group textarea:focus,
.form-group input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-group small {
  display: block;
  color: #94a3b8;
  font-size: 11px;
  margin-top: 6px;
}

.form-group input:disabled,
.form-group textarea:disabled {
  background: #f8fafc;
  cursor: not-allowed;
}

.form-two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.input-with-symbol {
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  overflow: hidden;
}

.input-with-symbol:focus-within {
  border-color: #10b981;
}

.input-with-symbol span {
  padding: 0 12px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.input-with-symbol input {
  border: none;
  border-radius: 0;
}

.input-with-symbol input:focus {
  box-shadow: none;
}

.application-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #e2e8f0;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 22px;
}

.application-summary div {
  background: #f8fafc;
  padding: 13px;
}

.application-summary span,
.application-summary strong {
  display: block;
}

.application-summary span {
  color: #64748b;
  font-size: 11px;
}

.application-summary strong {
  margin-top: 5px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn,
.submit-btn {
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  font-weight: 800;
  cursor: pointer;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.submit-btn {
  background: #059669;
  color: white;
}

.submit-btn:hover {
  background: #047857;
}

.submit-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .details-grid {
    grid-template-columns: 1fr;
  }

  .project-header-card {
    flex-direction: column;
  }

  .header-action {
    width: auto;
  }
}

@media (max-width: 650px) {
  .project-details-page {
    padding: 20px 15px 40px;
  }

  .project-header-card,
  .detail-card,
  .side-card {
    padding: 20px;
  }

  .project-header-card h1 {
    font-size: 24px;
  }

  .form-two-column {
    grid-template-columns: 1fr;
  }

  .application-summary {
    grid-template-columns: 1fr;
  }

  .modal-header,
  .apply-modal form {
    padding: 20px;
  }
}
`;

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ProjectDetails;