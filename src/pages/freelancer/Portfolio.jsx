import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
  FaBriefcase,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaLink,
  FaCheckCircle,
  FaExclamationCircle,
  FaFolderOpen,
  FaSpinner,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import {
  getPortfolio,
  updatePortfolio,
} from "../../Services/portfolioService";

const EMPTY_FORM = {
  title: "",
  url: "",
  description: "",
};

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  // =========================================================
  // HELPERS
  // =========================================================

  const getErrorMessage = (err, fallback) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      fallback
    );
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const showSuccessMessage = (message) => {
    setSuccess(message);

    window.setTimeout(() => {
      setSuccess((current) =>
        current === message ? "" : current
      );
    }, 3500);
  };

  const showErrorMessage = (message) => {
    setError(message);

    window.setTimeout(() => {
      setError((current) =>
        current === message ? "" : current
      );
    }, 5000);
  };

  const normalizePortfolio = (response) => {
    /*
      Supports common backend response shapes without
      changing your existing portfolio service.
    */

    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.portfolio)) {
      return response.portfolio;
    }

    if (Array.isArray(response?.user?.portfolio)) {
      return response.user.portfolio;
    }

    if (Array.isArray(response?.data?.portfolio)) {
      return response.data.portfolio;
    }

    if (Array.isArray(response?.data?.user?.portfolio)) {
      return response.data.user.portfolio;
    }

    if (Array.isArray(response?.data?.data?.portfolio)) {
      return response.data.data.portfolio;
    }

    return [];
  };

  const getPortfolioItemKey = (item, index) => {
    return (
      item?._id ||
      item?.id ||
      item?.portfolioId ||
      `portfolio-${index}`
    );
  };

  // =========================================================
  // LOAD PORTFOLIO
  // =========================================================

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPortfolio();

      const portfolioItems = normalizePortfolio(response);

      setPortfolio(
        portfolioItems.filter(
          (item) => item && typeof item === "object"
        )
      );
    } catch (err) {
      console.error("Portfolio Load Error:", err);

      showErrorMessage(
        getErrorMessage(
          err,
          "Failed to load your portfolio."
        )
      );

      setPortfolio([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setEditingIndex(null);
    setShowForm(false);
  };

  // =========================================================
  // ADD PROJECT
  // =========================================================

  const handleAdd = () => {
    if (saving) return;

    clearMessages();

    setForm({ ...EMPTY_FORM });
    setEditingIndex(null);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // EDIT PROJECT
  // =========================================================

  const handleEdit = (index) => {
    if (saving) return;

    const item = portfolio[index];

    if (!item) return;

    clearMessages();

    setForm({
      title: item?.title || "",
      url: item?.url || "",
      description: item?.description || "",
    });

    setEditingIndex(index);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // VALIDATE URL
  // =========================================================

  const isValidUrl = (value) => {
    try {
      const parsedUrl = new URL(value);

      return (
        parsedUrl.protocol === "http:" ||
        parsedUrl.protocol === "https:"
      );
    } catch {
      return false;
    }
  };

  // =========================================================
  // DELETE PROJECT
  // =========================================================

  const handleDelete = async (index) => {
    if (saving) return;

    const item = portfolio[index];

    if (!item) return;

    const projectTitle =
      item?.title || "this portfolio project";

    const confirmed = window.confirm(
      `Are you sure you want to delete "${projectTitle}"?`
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      clearMessages();

      const updatedPortfolio = portfolio.filter(
        (_, itemIndex) => itemIndex !== index
      );

      await updatePortfolio(updatedPortfolio);

      setPortfolio(updatedPortfolio);

      showSuccessMessage(
        "Portfolio project deleted successfully."
      );
    } catch (err) {
      console.error("Delete Portfolio Error:", err);

      showErrorMessage(
        getErrorMessage(
          err,
          "Failed to delete portfolio project."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // SAVE PROJECT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    clearMessages();

    const title = form.title.trim();
    const url = form.url.trim();
    const description = form.description.trim();

    // -----------------------------------------
    // TITLE VALIDATION
    // -----------------------------------------

    if (!title) {
      showErrorMessage(
        "Project title is required."
      );
      return;
    }

    if (title.length < 3) {
      showErrorMessage(
        "Project title must contain at least 3 characters."
      );
      return;
    }

    if (title.length > 120) {
      showErrorMessage(
        "Project title cannot exceed 120 characters."
      );
      return;
    }

    // -----------------------------------------
    // URL VALIDATION
    // -----------------------------------------

    if (!url) {
      showErrorMessage(
        "Project URL is required."
      );
      return;
    }

    if (!isValidUrl(url)) {
      showErrorMessage(
        "Please enter a valid project URL starting with http:// or https://."
      );
      return;
    }

    // -----------------------------------------
    // DESCRIPTION VALIDATION
    // -----------------------------------------

    if (description.length > 1000) {
      showErrorMessage(
        "Project description cannot exceed 1000 characters."
      );
      return;
    }

    try {
      setSaving(true);

      const newProject = {
        title,
        url,
        description,
      };

      let updatedPortfolio;

      // -----------------------------------------
      // EDIT
      // -----------------------------------------

      if (editingIndex !== null) {
        updatedPortfolio = portfolio.map(
          (item, index) =>
            index === editingIndex
              ? {
                  ...item,
                  ...newProject,
                }
              : item
        );
      }

      // -----------------------------------------
      // ADD
      // -----------------------------------------

      else {
        updatedPortfolio = [
          ...portfolio,
          newProject,
        ];
      }

      await updatePortfolio(updatedPortfolio);

      setPortfolio(updatedPortfolio);

      const message =
        editingIndex !== null
          ? "Portfolio project updated successfully."
          : "Portfolio project added successfully.";

      resetForm();

      showSuccessMessage(message);
    } catch (err) {
      console.error("Save Portfolio Error:", err);

      showErrorMessage(
        getErrorMessage(
          err,
          "Failed to save portfolio project."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="portfolio-page">
        <div className="portfolio-loading">
          <div className="portfolio-spinner">
            <FaSpinner />
          </div>

          <h3>Loading portfolio</h3>

          <p>
            Please wait while we load your projects...
          </p>
        </div>

        <style>{portfolioStyles}</style>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="portfolio-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="portfolio-header">
        <div className="portfolio-header-inner">

          <div className="portfolio-header-content">

            <Link
              to="/freelancer/profile"
              className="portfolio-back"
            >
              <FaArrowLeft size={12} />
              <span>Back to Profile</span>
            </Link>

            <div className="portfolio-title-row">

              <div className="portfolio-icon">
                <FaBriefcase />
              </div>

              <div className="portfolio-heading-text">

                <div className="portfolio-eyebrow">
                  Freelancer Workspace
                </div>

                <h1>
                  Portfolio Management
                </h1>

                <p>
                  Showcase your best work and build trust
                  with potential clients.
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={saving}
            className="portfolio-add-btn"
          >
            <FaPlus />
            <span>Add Project</span>
          </button>

        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="portfolio-container">

        {/* ===================================================
            ALERTS
        ==================================================== */}

        {success && (
          <div
            className="portfolio-alert portfolio-alert-success"
            role="status"
          >
            <FaCheckCircle />

            <span>{success}</span>

            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Close success message"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {error && (
          <div
            className="portfolio-alert portfolio-alert-error"
            role="alert"
          >
            <FaExclamationCircle />

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error message"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* ===================================================
            PORTFOLIO SUMMARY
        ==================================================== */}

        <div className="portfolio-summary">

          <div className="portfolio-summary-icon">
            <FaFolderOpen />
          </div>

          <div>
            <span className="portfolio-summary-label">
              Total Projects
            </span>

            <strong>
              {portfolio.length}
            </strong>
          </div>

          <div className="portfolio-summary-divider" />

          <div className="portfolio-summary-text">
            <strong>
              {portfolio.length === 0
                ? "Start building your portfolio"
                : portfolio.length === 1
                ? "Keep growing your portfolio"
                : "Your work is ready to showcase"}
            </strong>

            <span>
              {portfolio.length === 0
                ? "Add projects that demonstrate your skills."
                : "Make sure your best work is up to date."}
            </span>
          </div>

        </div>

        {/* ===================================================
            FORM
        ==================================================== */}

        {showForm && (
          <section className="portfolio-form-card">

            <div className="portfolio-form-header">

              <div className="portfolio-form-heading">

                <div className="portfolio-form-icon">
                  {editingIndex !== null ? (
                    <FaEdit />
                  ) : (
                    <FaPlus />
                  )}
                </div>

                <div>
                  <h2>
                    {editingIndex !== null
                      ? "Edit Portfolio Project"
                      : "Add Portfolio Project"}
                  </h2>

                  <p>
                    Add a project that represents your
                    skills, experience and expertise.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="portfolio-close-btn"
                aria-label="Close portfolio form"
                title="Close"
              >
                <FaTimes />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="portfolio-form"
              noValidate
            >

              {/* ===========================================
                  TITLE
              ============================================ */}

              <div className="portfolio-field">

                <label htmlFor="portfolio-title">
                  Project Title
                  <span>*</span>
                </label>

                <input
                  id="portfolio-title"
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: E-Commerce Website"
                  maxLength={120}
                  disabled={saving}
                  autoComplete="off"
                />

                <div className="portfolio-field-footer">
                  <small>
                    Give your project a clear and professional
                    title.
                  </small>

                  <span>
                    {form.title.length}/120
                  </span>
                </div>

              </div>

              {/* ===========================================
                  URL
              ============================================ */}

              <div className="portfolio-field">

                <label htmlFor="portfolio-url">
                  Project URL
                  <span>*</span>
                </label>

                <div className="portfolio-input-wrapper">

                  <FaLink />

                  <input
                    id="portfolio-url"
                    type="url"
                    name="url"
                    value={form.url}
                    onChange={handleChange}
                    placeholder="https://your-project.com"
                    disabled={saving}
                    autoComplete="url"
                  />

                </div>

                <div className="portfolio-field-footer">
                  <small>
                    Add a live demo, GitHub repository or
                    project website.
                  </small>
                </div>

              </div>

              {/* ===========================================
                  DESCRIPTION
              ============================================ */}

              <div className="portfolio-field">

                <label htmlFor="portfolio-description">
                  Project Description
                </label>

                <textarea
                  id="portfolio-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  maxLength={1000}
                  placeholder="Describe your project, technologies used, key features and your contribution..."
                  disabled={saving}
                />

                <div className="portfolio-field-footer">
                  <small>
                    Briefly explain what you built and your
                    contribution.
                  </small>

                  <span>
                    {form.description.length}/1000
                  </span>
                </div>

              </div>

              {/* ===========================================
                  FORM ACTIONS
              ============================================ */}

              <div className="portfolio-form-actions">

                <button
                  type="submit"
                  disabled={saving}
                  className="portfolio-save-btn"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="portfolio-button-spinner" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaSave />
                      <span>
                        {editingIndex !== null
                          ? "Update Project"
                          : "Add Project"}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="portfolio-cancel-btn"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>

              </div>

            </form>

          </section>
        )}

        {/* ===================================================
            EMPTY STATE
        ==================================================== */}

        {portfolio.length === 0 ? (

          <section className="portfolio-empty">

            <div className="portfolio-empty-icon">
              <FaBriefcase />
            </div>

            <span className="portfolio-empty-label">
              Portfolio
            </span>

            <h2>
              Your portfolio is empty
            </h2>

            <p>
              Add your best projects to help potential
              clients understand your skills, experience
              and the quality of your work.
            </p>

            {!showForm && (
              <button
                type="button"
                onClick={handleAdd}
                disabled={saving}
                className="portfolio-add-btn"
              >
                <FaPlus />
                <span>Add Your First Project</span>
              </button>
            )}

          </section>

        ) : (

          /* =================================================
             PORTFOLIO GRID
          ================================================== */

          <section className="portfolio-section">

            <div className="portfolio-section-header">

              <div>
                <h2>
                  Your Projects
                </h2>

                <p>
                  Projects you've added to your portfolio.
                </p>
              </div>

              {!showForm && (
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={saving}
                  className="portfolio-secondary-add"
                >
                  <FaPlus />
                  <span>Add Project</span>
                </button>
              )}

            </div>

            <div className="portfolio-grid">

              {portfolio.map((item, index) => (

                <article
                  key={getPortfolioItemKey(item, index)}
                  className="portfolio-card"
                >

                  {/* CARD TOP */}

                  <div className="portfolio-card-top">

                    <div className="portfolio-project-icon">
                      <FaBriefcase />
                    </div>

                    <div className="portfolio-actions">

                      <button
                        type="button"
                        onClick={() => handleEdit(index)}
                        disabled={saving}
                        title="Edit Project"
                        aria-label={`Edit ${
                          item?.title || "project"
                        }`}
                        className="portfolio-edit-btn"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        disabled={saving}
                        title="Delete Project"
                        aria-label={`Delete ${
                          item?.title || "project"
                        }`}
                        className="portfolio-delete-btn"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </div>

                  {/* CARD CONTENT */}

                  <div className="portfolio-card-content">

                    <h3>
                      {item?.title ||
                        "Untitled Project"}
                    </h3>

                    <p className="portfolio-description">
                      {item?.description ||
                        "No description added for this project."}
                    </p>

                  </div>

                  {/* CARD FOOTER */}

                  <div className="portfolio-card-footer">

                    {item?.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio-view-link"
                      >
                        <span>View Project</span>
                        <FaExternalLinkAlt size={10} />
                      </a>
                    ) : (
                      <span className="portfolio-no-link">
                        <FaLink size={10} />
                        No project URL
                      </span>
                    )}

                  </div>

                </article>

              ))}

            </div>

          </section>

        )}

      </main>

      {/* =====================================================
          PAGE CSS
      ====================================================== */}

      <style>{portfolioStyles}</style>
    </div>
  );
};

const portfolioStyles = `

/* =========================================================
   PORTFOLIO PAGE
   ========================================================= */

.portfolio-page {
  min-height: calc(100vh - 72px);
  background:
    radial-gradient(
      circle at 85% 0%,
      rgba(16, 185, 129, 0.055),
      transparent 28%
    ),
    #f8fafc;
  color: #0f172a;
}

/* =========================================================
   HEADER
   ========================================================= */

.portfolio-header {
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid #e2e8f0;
}

.portfolio-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.portfolio-header-content {
  min-width: 0;
}

.portfolio-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  color: #64748b;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  transition: 0.2s ease;
}

.portfolio-back:hover {
  color: #059669;
}

.portfolio-title-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.portfolio-icon {
  width: 54px;
  height: 54px;
  flex: 0 0 54px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ecfdf5;
  color: #059669;
  font-size: 22px;
  border: 1px solid #d1fae5;
}

.portfolio-heading-text {
  min-width: 0;
}

.portfolio-eyebrow {
  margin-bottom: 5px;
  color: #059669;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.portfolio-title-row h1 {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.6px;
  color: #0f172a;
}

.portfolio-title-row p {
  margin: 7px 0 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

/* =========================================================
   BUTTONS
   ========================================================= */

.portfolio-add-btn {
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 44px;
  padding: 12px 18px;
  border-radius: 12px;
  background: #059669;
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 8px 20px rgba(5, 150, 105, 0.18);
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.portfolio-add-btn:hover:not(:disabled) {
  background: #047857;
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(5, 150, 105, 0.22);
}

.portfolio-add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* =========================================================
   CONTAINER
   ========================================================= */

.portfolio-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 24px 60px;
}

/* =========================================================
   ALERTS
   ========================================================= */

.portfolio-alert {
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px 14px;
  margin-bottom: 20px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
}

.portfolio-alert span {
  flex: 1;
}

.portfolio-alert button {
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  cursor: pointer;
  border-radius: 7px;
}

.portfolio-alert button:hover {
  background: rgba(15, 23, 42, 0.06);
}

.portfolio-alert-success {
  color: #047857;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
}

.portfolio-alert-error {
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

/* =========================================================
   SUMMARY
   ========================================================= */

.portfolio-summary {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  margin-bottom: 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 5px 18px rgba(15, 23, 42, 0.035);
}

.portfolio-summary-icon {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ecfdf5;
  color: #059669;
}

.portfolio-summary-label {
  display: block;
  margin-bottom: 2px;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.portfolio-summary strong {
  display: block;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.portfolio-summary-divider {
  width: 1px;
  height: 38px;
  background: #e2e8f0;
  margin: 0 4px;
}

.portfolio-summary-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.portfolio-summary-text strong {
  font-size: 13px;
}

.portfolio-summary-text span {
  color: #64748b;
  font-size: 12px;
}

/* =========================================================
   FORM CARD
   ========================================================= */

.portfolio-form-card {
  margin-bottom: 28px;
  padding: 26px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.055);
}

.portfolio-form-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
}

.portfolio-form-heading {
  display: flex;
  align-items: center;
  gap: 14px;
}

.portfolio-form-icon {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #ecfdf5;
  color: #059669;
}

.portfolio-form-header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 19px;
  font-weight: 800;
}

.portfolio-form-header p {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

.portfolio-close-btn {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border: 0;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s ease;
}

.portfolio-close-btn:hover:not(:disabled) {
  background: #e2e8f0;
  color: #0f172a;
}

.portfolio-close-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* =========================================================
   FORM
   ========================================================= */

.portfolio-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.portfolio-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.portfolio-field label {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
}

.portfolio-field label span {
  color: #dc2626;
}

.portfolio-field input,
.portfolio-field textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 13px 14px;
  background: #f8fafc;
  color: #0f172a;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.portfolio-field input {
  min-height: 46px;
}

.portfolio-field textarea {
  resize: vertical;
  min-height: 130px;
  line-height: 1.6;
}

.portfolio-field input::placeholder,
.portfolio-field textarea::placeholder {
  color: #94a3b8;
}

.portfolio-field input:focus,
.portfolio-field textarea:focus {
  border-color: #10b981;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.11);
}

.portfolio-field input:disabled,
.portfolio-field textarea:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.portfolio-input-wrapper {
  position: relative;
}

.portfolio-input-wrapper > svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
  font-size: 13px;
}

.portfolio-input-wrapper input {
  padding-left: 39px;
}

.portfolio-field-footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
}

.portfolio-field-footer small {
  color: #94a3b8;
  font-size: 11px;
  line-height: 1.5;
}

.portfolio-field-footer > span {
  flex: 0 0 auto;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
}

/* =========================================================
   FORM ACTIONS
   ========================================================= */

.portfolio-form-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 4px;
}

.portfolio-save-btn,
.portfolio-cancel-btn {
  min-height: 43px;
  border: 0;
  padding: 11px 17px;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.portfolio-save-btn {
  background: #059669;
  color: #ffffff;
  box-shadow: 0 7px 16px rgba(5, 150, 105, 0.16);
}

.portfolio-save-btn:hover:not(:disabled) {
  background: #047857;
  transform: translateY(-1px);
}

.portfolio-save-btn:disabled,
.portfolio-cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.portfolio-cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.portfolio-cancel-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.portfolio-button-spinner {
  animation: portfolioSpin 0.8s linear infinite;
}

/* =========================================================
   SECTION HEADER
   ========================================================= */

.portfolio-section {
  width: 100%;
}

.portfolio-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}

.portfolio-section-header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 20px;
  font-weight: 800;
}

.portfolio-section-header p {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 13px;
}

.portfolio-secondary-add {
  border: 1px solid #d1fae5;
  background: #ecfdf5;
  color: #047857;
  min-height: 39px;
  padding: 9px 14px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.portfolio-secondary-add:hover:not(:disabled) {
  background: #d1fae5;
  border-color: #a7f3d0;
}

.portfolio-secondary-add:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* =========================================================
   GRID
   ========================================================= */

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

/* =========================================================
   CARD
   ========================================================= */

.portfolio-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 22px;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.portfolio-card:hover {
  transform: translateY(-3px);
  border-color: #a7f3d0;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.075);
}

.portfolio-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 19px;
}

.portfolio-project-icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #d1fae5;
}

.portfolio-actions {
  display: flex;
  gap: 7px;
}

.portfolio-edit-btn,
.portfolio-delete-btn {
  width: 35px;
  height: 35px;
  border: 0;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s ease;
}

.portfolio-edit-btn {
  background: #f1f5f9;
  color: #475569;
}

.portfolio-edit-btn:hover:not(:disabled) {
  background: #059669;
  color: #ffffff;
}

.portfolio-delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.portfolio-delete-btn:hover:not(:disabled) {
  background: #dc2626;
  color: #ffffff;
}

.portfolio-edit-btn:disabled,
.portfolio-delete-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* =========================================================
   CARD CONTENT
   ========================================================= */

.portfolio-card-content {
  flex: 1;
}

.portfolio-card h3 {
  margin: 0 0 9px;
  color: #0f172a;
  font-size: 18px;
  line-height: 1.4;
  font-weight: 800;
  word-break: break-word;
}

.portfolio-description {
  margin: 0;
  min-height: 72px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.75;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

/* =========================================================
   CARD FOOTER
   ========================================================= */

.portfolio-card-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.portfolio-view-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #059669;
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;
  transition: 0.2s ease;
}

.portfolio-view-link:hover {
  color: #047857;
  gap: 10px;
}

.portfolio-no-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

.portfolio-empty {
  padding: 72px 25px;
  text-align: center;
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 20px;
}

.portfolio-empty-icon {
  width: 68px;
  height: 68px;
  margin: 0 auto 15px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ecfdf5;
  color: #059669;
  font-size: 25px;
  border: 1px solid #d1fae5;
}

.portfolio-empty-label {
  display: block;
  margin-bottom: 6px;
  color: #059669;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.portfolio-empty h2 {
  margin: 0 0 9px;
  color: #0f172a;
  font-size: 21px;
  font-weight: 800;
}

.portfolio-empty p {
  max-width: 530px;
  margin: 0 auto 24px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.75;
}

/* =========================================================
   LOADING
   ========================================================= */

.portfolio-loading {
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  color: #64748b;
}

.portfolio-spinner {
  width: 42px;
  height: 42px;
  margin-bottom: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  font-size: 25px;
  animation: portfolioSpin 0.9s linear infinite;
}

.portfolio-loading h3 {
  margin: 0 0 6px;
  color: #334155;
  font-size: 16px;
  font-weight: 800;
}

.portfolio-loading p {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}

/* =========================================================
   ANIMATION
   ========================================================= */

@keyframes portfolioSpin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 900px) {

  .portfolio-header-inner {
    align-items: flex-start;
  }

  .portfolio-grid {
    grid-template-columns: 1fr;
  }

}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 650px) {

  .portfolio-header-inner {
    flex-direction: column;
    padding: 22px 18px;
  }

  .portfolio-header-content {
    width: 100%;
  }

  .portfolio-add-btn {
    width: 100%;
  }

  .portfolio-container {
    padding: 22px 18px 45px;
  }

  .portfolio-title-row {
    align-items: flex-start;
  }

  .portfolio-title-row h1 {
    font-size: 23px;
  }

  .portfolio-title-row p {
    font-size: 13px;
  }

  .portfolio-summary {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .portfolio-summary-divider {
    display: none;
  }

  .portfolio-summary-text {
    width: calc(100% - 60px);
  }

  .portfolio-form-card {
    padding: 20px;
  }

  .portfolio-form-heading {
    align-items: flex-start;
  }

  .portfolio-form-header p {
    line-height: 1.6;
  }

  .portfolio-section-header {
    align-items: flex-start;
  }

  .portfolio-secondary-add {
    display: none;
  }

}

/* =========================================================
   SMALL MOBILE
   ========================================================= */

@media (max-width: 480px) {

  .portfolio-header-inner,
  .portfolio-container {
    padding-left: 14px;
    padding-right: 14px;
  }

  .portfolio-title-row {
    gap: 12px;
  }

  .portfolio-icon {
    width: 46px;
    height: 46px;
    flex-basis: 46px;
    font-size: 18px;
    border-radius: 13px;
  }

  .portfolio-title-row h1 {
    font-size: 20px;
  }

  .portfolio-title-row p {
    font-size: 12px;
  }

  .portfolio-eyebrow {
    font-size: 9px;
  }

  .portfolio-summary {
    padding: 16px;
  }

  .portfolio-form-card {
    padding: 17px;
    border-radius: 16px;
  }

  .portfolio-form-header {
    gap: 12px;
  }

  .portfolio-form-heading {
    gap: 10px;
  }

  .portfolio-form-icon {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
  }

  .portfolio-form-header h2 {
    font-size: 16px;
  }

  .portfolio-form-header p {
    font-size: 12px;
  }

  .portfolio-form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .portfolio-save-btn,
  .portfolio-cancel-btn {
    width: 100%;
  }

  .portfolio-card {
    padding: 18px;
  }

  .portfolio-empty {
    padding: 55px 18px;
  }

  .portfolio-empty h2 {
    font-size: 19px;
  }

  .portfolio-empty p {
    font-size: 13px;
  }

}
`;

export default Portfolio;