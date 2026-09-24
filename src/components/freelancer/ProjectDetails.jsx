import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getProjectById,
  applyToProject,
} from "../../Services/projectService";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [project, setProject] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showApply, setShowApply] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    coverLetter: "",
    bidAmount: "",
    deliveryTime: "",
  });

  // =====================================================
  // HELPERS
  // =====================================================

  const formatCurrency = (value) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
      return "₹0";
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (value, fallback = "Not specified") => {
    if (!value) {
      return fallback;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return fallback;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getYear = (value) => {
    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.getFullYear();
  };

  const normalizeSkills = (skills) => {
    if (Array.isArray(skills)) {
      return skills
        .map((skill) => {
          if (typeof skill === "string") {
            return skill.trim();
          }

          if (skill && typeof skill === "object") {
            return (
              skill.name ||
              skill.title ||
              skill.label ||
              ""
            ).trim();
          }

          return "";
        })
        .filter(Boolean);
    }

    if (typeof skills === "string") {
      return skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    return [];
  };

  const extractProject = (response) => {
    if (!response) {
      return null;
    }

    // Backend:
    // { success: true, project: {...} }
    if (response.project) {
      return response.project;
    }

    // Backend:
    // { success: true, data: {...} }
    if (
      response.data &&
      typeof response.data === "object" &&
      !Array.isArray(response.data)
    ) {
      if (response.data.project) {
        return response.data.project;
      }

      return response.data;
    }

    // Backend directly returns project object
    if (
      typeof response === "object" &&
      !Array.isArray(response)
    ) {
      return response;
    }

    return null;
  };

  const getClient = () => {
    if (!project) {
      return null;
    }

    return (
      project.client ||
      project.clientId ||
      project.owner ||
      project.createdBy ||
      null
    );
  };

  // =====================================================
  // FETCH PROJECT
  // =====================================================

  const fetchProject = useCallback(async () => {
    if (!id) {
      setProject(null);
      setError("Project ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await getProjectById(id);

      const projectData = extractProject(response);

      if (!projectData) {
        setProject(null);
        setError("Project details could not be found.");
        return;
      }

      setProject(projectData);
    } catch (err) {
      console.error("PROJECT DETAILS ERROR:", err);

      setProject(null);

      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Unable to load project details."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // =====================================================
  // ESCAPE KEY FOR MODAL
  // =====================================================

  useEffect(() => {
    if (!showApply) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        closeApplyModal();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [showApply, submitting]);

  // =====================================================
  // FORM
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const resetApplicationForm = () => {
    setForm({
      coverLetter: "",
      bidAmount: "",
      deliveryTime: "",
    });

    setFormError("");
  };

  const openApplyModal = () => {
    setFormError("");
    setSuccessMessage("");
    setShowApply(true);
  };

  const closeApplyModal = () => {
    if (submitting) {
      return;
    }

    setShowApply(false);
    resetApplicationForm();
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateApplication = () => {
    const coverLetter = form.coverLetter.trim();

    const bidAmount = Number(form.bidAmount);

    const deliveryTime = Number(
      form.deliveryTime
    );

    if (!coverLetter) {
      return "Please enter your cover letter.";
    }

    if (coverLetter.length < 30) {
      return "Your cover letter should contain at least 30 characters.";
    }

    if (!form.bidAmount) {
      return "Please enter your bid amount.";
    }

    if (
      !Number.isFinite(bidAmount) ||
      bidAmount <= 0
    ) {
      return "Please enter a valid bid amount.";
    }

    if (!form.deliveryTime) {
      return "Please enter your delivery time.";
    }

    if (
      !Number.isFinite(deliveryTime) ||
      deliveryTime <= 0
    ) {
      return "Please enter a valid delivery time.";
    }

    return "";
  };

  // =====================================================
  // SUBMIT APPLICATION
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const validationError =
      validateApplication();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (!id) {
      setFormError(
        "Project ID is missing. Please try again."
      );
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      setSuccessMessage("");

      const payload = {
        coverLetter: form.coverLetter.trim(),
        bidAmount: Number(form.bidAmount),
        deliveryTime: Number(
          form.deliveryTime
        ),
      };

      const response = await applyToProject(
        id,
        payload
      );

      console.log(
        "APPLICATION SUBMITTED:",
        response
      );

      setSuccessMessage(
        "Your application has been submitted successfully."
      );

      setForm({
        coverLetter: "",
        bidAmount: "",
        deliveryTime: "",
      });

      setTimeout(() => {
        setShowApply(false);
        setSuccessMessage("");
      }, 1500);
    } catch (err) {
      console.error(
        "APPLICATION SUBMISSION ERROR:",
        err
      );

      setFormError(
        err?.message ||
          err?.response?.data?.message ||
          "Unable to submit your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // PROJECT DATA
  // =====================================================

  const skills = useMemo(() => {
    return normalizeSkills(
      project?.skills
    );
  }, [project]);

  const client = getClient();

  const clientName =
    client?.name ||
    client?.fullName ||
    client?.username ||
    "Client";

  const clientCompany =
    client?.company ||
    client?.companyName ||
    client?.organization ||
    "Company";

  const clientLocation =
    client?.location ||
    client?.city ||
    project?.clientLocation ||
    "Location not specified";

  const clientInitial =
    clientName.charAt(0).toUpperCase() ||
    "C";

  const projectStatus =
    project?.status ||
    "open";

  const isProjectClosed =
    !["open", "active", "published"].includes(
      String(projectStatus).toLowerCase()
    );

  const budget = Number(
    project?.budget || 0
  );

  const budgetType =
    project?.budgetType ||
    project?.paymentType ||
    "Fixed Price";

  // =====================================================
  // LOADING
  // =====================================================

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
              Please wait while we fetch the
              project details.
            </p>
          </div>
        </div>
      </>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <>
        <style>{styles}</style>

        <div className="project-details-page">
          <button
            type="button"
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
              Something went wrong
            </h2>

            <p>{error}</p>

            <button
              type="button"
              className="primary-btn"
              onClick={fetchProject}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  // =====================================================
  // PROJECT NOT FOUND
  // =====================================================

  if (!project) {
    return (
      <>
        <style>{styles}</style>

        <div className="project-details-page">
          <button
            type="button"
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
              This project may have been
              removed or is no longer
              available.
            </p>

            <button
              type="button"
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

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <>
      <style>{styles}</style>

      <div className="project-details-page">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
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
            SUCCESS MESSAGE
        ================================================= */}

        {successMessage && (
          <div className="page-success">
            <span className="success-check">
              ✓
            </span>

            <span>
              {successMessage}
            </span>
          </div>
        )}

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="project-header-card">

          <div className="project-header-content">

            <div className="header-top-row">

              <span className="category-badge">
                {project.category ||
                  "Project"}
              </span>

              <span
                className={`status-badge ${
                  isProjectClosed
                    ? "closed"
                    : "open"
                }`}
              >
                <span className="status-dot"></span>

                {isProjectClosed
                  ? "Closed"
                  : "Open"}
              </span>

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
                {formatDate(
                  project.createdAt,
                  "Recently"
                )}
              </span>

              <span>
                📍{" "}
                {project.location ||
                  "Remote"}
              </span>

              <span>
                👥{" "}
                {project.applicationsCount ||
                  project.applicationCount ||
                  project.applications?.length ||
                  0}{" "}
                Applications
              </span>

            </div>

          </div>

          <div className="header-action">

            <div className="budget-label">
              Project Budget
            </div>

            <div className="budget-value">
              {formatCurrency(budget)}
            </div>

            <div className="budget-type-header">
              {budgetType}
            </div>

            <button
              type="button"
              className="apply-main-btn"
              onClick={openApplyModal}
              disabled={isProjectClosed}
            >
              {isProjectClosed
                ? "Applications Closed"
                : "Apply Now →"}
            </button>

          </div>

        </section>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="details-grid">

          {/* =================================================
              LEFT CONTENT
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
                        key={`${skill}-${index}`}
                      >
                        {skill}
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

            {/* ADDITIONAL PROJECT INFO */}

            <section className="detail-card">

              <div className="section-title">
                <span className="title-icon">
                  ℹ
                </span>

                <h2>
                  Project Information
                </h2>
              </div>

              <div className="info-grid">

                <div className="info-item">
                  <span>
                    Project Type
                  </span>

                  <strong>
                    {budgetType}
                  </strong>
                </div>

                <div className="info-item">
                  <span>
                    Location
                  </span>

                  <strong>
                    {project.location ||
                      "Remote"}
                  </strong>
                </div>

                <div className="info-item">
                  <span>
                    Posted On
                  </span>

                  <strong>
                    {formatDate(
                      project.createdAt
                    )}
                  </strong>
                </div>

                <div className="info-item">
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
                {formatCurrency(budget)}
              </div>

              <div className="budget-type">
                {budgetType}
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
                    {formatDate(
                      project.deadline
                    )}
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
                  {clientInitial}
                </div>

                <div className="client-details">

                  <strong>
                    {clientName}
                  </strong>

                  <span>
                    {clientCompany}
                  </span>

                </div>

              </div>

              <div className="client-info">

                <div>
                  <span>📍</span>
                  {clientLocation}
                </div>

                <div>
                  <span>📅</span>

                  Member since{" "}
                  {getYear(
                    client?.createdAt ||
                      client?.createdDate
                  )}
                </div>

              </div>

            </section>

            {/* APPLY CTA */}

            <section className="apply-side-card">

              <div className="cta-icon">
                ✦
              </div>

              <h3>
                Interested in this
                project?
              </h3>

              <p>
                Send your proposal and
                let the client know why
                you're the right
                freelancer.
              </p>

              <button
                type="button"
                className="apply-main-btn full"
                onClick={openApplyModal}
                disabled={isProjectClosed}
              >
                {isProjectClosed
                  ? "Applications Closed"
                  : "Apply Now →"}
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
            onClick={() => {
              if (!submitting) {
                closeApplyModal();
              }
            }}
          >

            <div
              className="apply-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div className="modal-header">

                <div>
                  <span className="modal-label">
                    APPLICATION
                  </span>

                  <h2>
                    Apply for Project
                  </h2>

                  <p>
                    Submit a professional
                    proposal to the client.
                  </p>
                </div>

                <button
                  type="button"
                  className="close-btn"
                  onClick={closeApplyModal}
                  disabled={submitting}
                  aria-label="Close application modal"
                >
                  ×
                </button>

              </div>

              {/* MODAL BODY */}

              <form
                onSubmit={handleSubmit}
                noValidate
              >

                {/* ERROR */}

                {formError && (
                  <div className="form-error">
                    <span>!</span>
                    <p>{formError}</p>
                  </div>
                )}

                {/* COVER LETTER */}

                <div className="form-group">

                  <label htmlFor="coverLetter">
                    Cover Letter
                    <span>*</span>
                  </label>

                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={form.coverLetter}
                    onChange={handleChange}
                    placeholder="Explain why you're the right freelancer for this project..."
                    rows={6}
                    maxLength={3000}
                    disabled={submitting}
                  />

                  <div className="field-footer">

                    <small>
                      Introduce yourself and
                      explain how you would
                      approach the project.
                    </small>

                    <small>
                      {form.coverLetter.length}
                      /3000
                    </small>

                  </div>

                </div>

                {/* BID + DELIVERY */}

                <div className="form-two-column">

                  <div className="form-group">

                    <label htmlFor="bidAmount">
                      Your Bid Amount
                      <span>*</span>
                    </label>

                    <div className="input-with-symbol">

                      <span>
                        ₹
                      </span>

                      <input
                        id="bidAmount"
                        type="number"
                        name="bidAmount"
                        value={form.bidAmount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        min="1"
                        step="1"
                        inputMode="numeric"
                        disabled={submitting}
                      />

                    </div>

                  </div>

                  <div className="form-group">

                    <label htmlFor="deliveryTime">
                      Delivery Time
                      <span>*</span>
                    </label>

                    <div className="input-with-symbol">

                      <input
                        id="deliveryTime"
                        type="number"
                        name="deliveryTime"
                        value={
                          form.deliveryTime
                        }
                        onChange={handleChange}
                        placeholder="Days"
                        min="1"
                        step="1"
                        inputMode="numeric"
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
                      {formatCurrency(
                        budget
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Your Bid
                    </span>

                    <strong>
                      {form.bidAmount
                        ? formatCurrency(
                            form.bidAmount
                          )
                        : "₹0"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Delivery
                    </span>

                    <strong>
                      {form.deliveryTime
                        ? `${form.deliveryTime} days`
                        : "0 days"}
                    </strong>
                  </div>

                </div>

                {/* ACTIONS */}

                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={
                      closeApplyModal
                    }
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="button-spinner"></span>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application →"
                    )}
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

// =====================================================
// STYLES
// =====================================================

const styles = `
* {
  box-sizing: border-box;
}

.project-details-page {
  min-height: calc(100vh - 80px);
  padding: 28px 32px 50px;
  background:
    radial-gradient(
      circle at 90% 0%,
      rgba(16, 185, 129, 0.05),
      transparent 28%
    ),
    #f8fafc;
  color: #0f172a;
}

/* =====================================================
   BACK BUTTON
===================================================== */

.back-btn {
  border: none;
  background: transparent;
  color: #475569;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 6px 0;
  transition: 0.2s ease;
}

.back-btn:hover {
  color: #059669;
  transform: translateX(-2px);
}

/* =====================================================
   SUCCESS MESSAGE
===================================================== */

.page-success {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #047857;
  border-radius: 12px;
  padding: 13px 16px;
  margin-bottom: 18px;
  font-size: 13px;
  font-weight: 700;
}

.success-check {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #059669;
  color: white;
  font-size: 13px;
}

/* =====================================================
   HEADER
===================================================== */

.project-header-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  box-shadow:
    0 4px 15px rgba(15, 23, 42, 0.04);
}

.project-header-content {
  flex: 1;
  min-width: 0;
}

.header-top-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 999px;
  background: #ecfdf5;
  color: #047857;
  font-size: 12px;
  font-weight: 800;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.status-badge.open {
  background: #effdf5;
  color: #047857;
}

.status-badge.closed {
  background: #fef2f2;
  color: #b91c1c;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.project-header-card h1 {
  font-size: 30px;
  margin: 0 0 12px;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.project-short-description {
  color: #64748b;
  line-height: 1.7;
  max-width: 760px;
  margin: 0;
  white-space: pre-line;
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
  width: 230px;
  min-width: 230px;
  padding: 20px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  text-align: center;
  align-self: flex-start;
}

.budget-label {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.budget-value {
  font-size: 28px;
  font-weight: 900;
  margin: 7px 0 2px;
  letter-spacing: -0.5px;
}

.budget-type-header {
  color: #94a3b8;
  font-size: 11px;
  margin-bottom: 16px;
}

/* =====================================================
   BUTTONS
===================================================== */

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
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;
}

.apply-main-btn:hover:not(:disabled) {
  background: #047857;
  transform: translateY(-1px);
}

.apply-main-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
}

/* =====================================================
   MAIN GRID
===================================================== */

.details-grid {
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    330px;
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
  box-shadow:
    0 2px 8px rgba(15, 23, 42, 0.025);
}

/* =====================================================
   SECTION TITLE
===================================================== */

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.section-title h2 {
  font-size: 18px;
  margin: 0;
  letter-spacing: -0.2px;
}

.title-icon {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #ecfdf5;
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
}

.description-text {
  color: #475569;
  line-height: 1.8;
  white-space: pre-line;
  font-size: 14px;
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
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
}

.muted-text {
  color: #94a3b8;
  font-size: 14px;
  margin: 0;
}

/* =====================================================
   INFO GRID
===================================================== */

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.info-item {
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  padding: 14px;
}

.info-item span,
.info-item strong {
  display: block;
}

.info-item span {
  color: #94a3b8;
  font-size: 11px;
  font-weight: 600;
}

.info-item strong {
  color: #334155;
  margin-top: 5px;
  font-size: 13px;
}

/* =====================================================
   SIDEBAR
===================================================== */

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
  letter-spacing: -0.3px;
}

.budget-type {
  color: #64748b;
  font-size: 12px;
  margin-top: 5px;
}

/* =====================================================
   DEADLINE
===================================================== */

.deadline {
  display: flex;
  gap: 12px;
  align-items: center;
}

.deadline-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
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
  font-size: 11px;
}

/* =====================================================
   CLIENT
===================================================== */

.client-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.client-avatar {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #d1fae5;
  color: #047857;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.client-details {
  min-width: 0;
}

.client-box strong,
.client-box span {
  display: block;
}

.client-box strong {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.client-info div {
  line-height: 1.5;
}

.client-info span {
  margin-right: 7px;
}

/* =====================================================
   APPLY CTA
===================================================== */

.apply-side-card {
  background:
    linear-gradient(
      145deg,
      #0b1220,
      #111827
    );
  color: white;
  border-radius: 18px;
  padding: 24px;
  box-shadow:
    0 12px 30px rgba(15, 23, 42, 0.12);
}

.cta-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 15px;
  color: #a7f3d0;
}

.apply-side-card h3 {
  margin: 0 0 10px;
  font-size: 17px;
}

.apply-side-card p {
  color: #cbd5e1;
  line-height: 1.6;
  font-size: 13px;
  margin: 0 0 14px;
}

.apply-main-btn.full {
  margin-top: 4px;
}

/* =====================================================
   LOADING / EMPTY / ERROR
===================================================== */

.details-loading,
.details-state {
  min-height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.details-loading h3 {
  margin: 0 0 6px;
}

.details-loading p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.details-state {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 40px;
}

.details-state h2 {
  margin: 0 0 8px;
}

.details-state p {
  max-width: 500px;
  color: #64748b;
  line-height: 1.7;
  font-size: 14px;
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

.primary-btn {
  border: none;
  background: #059669;
  color: white;
  padding: 12px 18px;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.primary-btn:hover {
  background: #047857;
  transform: translateY(-1px);
}

.loading-spinner {
  width: 38px;
  height: 38px;
  border: 4px solid #d1fae5;
  border-top-color: #059669;
  border-radius: 50%;
  animation: projectDetailsSpin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes projectDetailsSpin {
  to {
    transform: rotate(360deg);
  }
}

/* =====================================================
   MODAL
===================================================== */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(5px);
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
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.2);
  animation: modalAppear 0.2s ease;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.99);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
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
  flex-shrink: 0;
  border: none;
  background: #f1f5f9;
  color: #475569;
  border-radius: 9px;
  font-size: 23px;
  cursor: pointer;
  transition: 0.2s ease;
}

.close-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.close-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.apply-modal form {
  padding: 26px 28px;
}

/* =====================================================
   FORM ERROR
===================================================== */

.form-error {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 11px;
  padding: 12px 13px;
  margin-bottom: 20px;
}

.form-error span {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #dc2626;
  color: white;
  font-size: 11px;
  font-weight: 900;
}

.form-error p {
  margin: 1px 0 0;
  font-size: 12px;
  line-height: 1.5;
}

/* =====================================================
   FORM
===================================================== */

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 8px;
  color: #334155;
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
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group textarea {
  resize: vertical;
  min-height: 140px;
}

.form-group textarea:focus,
.form-group input:focus {
  border-color: #10b981;
  box-shadow:
    0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-group textarea:disabled,
.form-group input:disabled {
  background: #f8fafc;
  cursor: not-allowed;
}

.field-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
}

.form-group small {
  display: block;
  color: #94a3b8;
  font-size: 11px;
  line-height: 1.5;
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
  transition: 0.2s ease;
}

.input-with-symbol:focus-within {
  border-color: #10b981;
  box-shadow:
    0 0 0 3px rgba(16, 185, 129, 0.1);
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

/* =====================================================
   APPLICATION SUMMARY
===================================================== */

.application-summary {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
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

/* =====================================================
   MODAL ACTIONS
===================================================== */

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
  transition: 0.2s ease;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.cancel-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.submit-btn {
  min-width: 180px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #059669;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #047857;
  transform: translateY(-1px);
}

.submit-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.button-spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: projectDetailsSpin 0.7s linear infinite;
}

/* =====================================================
   SCROLLBAR
===================================================== */

.apply-modal::-webkit-scrollbar {
  width: 7px;
}

.apply-modal::-webkit-scrollbar-track {
  background: #f8fafc;
}

.apply-modal::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 1100px) {
  .details-grid {
    grid-template-columns:
      minmax(0, 1fr)
      300px;
  }

  .header-action {
    width: 210px;
    min-width: 210px;
  }
}

@media (max-width: 900px) {
  .details-grid {
    grid-template-columns: 1fr;
  }

  .details-sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  .apply-side-card {
    grid-column: 1 / -1;
  }

  .project-header-card {
    flex-direction: column;
  }

  .header-action {
    width: 100%;
    min-width: 0;
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

  .project-meta {
    flex-direction: column;
    gap: 8px;
  }

  .details-sidebar {
    display: flex;
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

  .modal-actions {
    flex-direction: column-reverse;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .field-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }
}

@media (max-width: 420px) {
  .project-details-page {
    padding-left: 12px;
    padding-right: 12px;
  }

  .project-header-card,
  .detail-card,
  .side-card {
    border-radius: 15px;
  }

  .project-header-card h1 {
    font-size: 22px;
  }

  .project-meta {
    font-size: 12px;
  }

  .apply-modal {
    border-radius: 16px;
  }

  .modal-header h2 {
    font-size: 20px;
  }
}
`;