import { useEffect, useMemo, useState } from "react";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCode,
  FaGlobe,
  FaGithub,
  FaLinkedin,
  FaCheckCircle,
  FaExclamationCircle,
  FaSave,
  FaSpinner,
  FaCircle,
} from "react-icons/fa";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  location: "",
  title: "",
  bio: "",
  skills: "",
  experience: "",
  hourlyRate: "",
  availability: "Available",
  portfolioUrl: "",
  githubUrl: "",
  linkedinUrl: "",
};

const FreelancerProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState(INITIAL_FORM);

  // =========================================================
  // PROFILE COMPLETION
  // =========================================================

  const completion = useMemo(() => {
    return calculateCompletion(form);
  }, [form]);

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setForm(INITIAL_FORM);
        return;
      }

      let user = {};

      try {
        user = JSON.parse(savedUser) || {};
      } catch (err) {
        console.error("Invalid user data:", err);

        setError("Unable to read saved profile information.");
        setForm(INITIAL_FORM);
        return;
      }

      setForm(createFormFromUser(user));
    } catch (err) {
      console.error("Profile Load Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");

    if (error) {
      setError("");
    }
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = async (event) => {
    event.preventDefault();

    if (saving) return;

    setMessage("");
    setError("");

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const location = form.location.trim();
    const title = form.title.trim();
    const bio = form.bio.trim();

    const skills = form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const experience =
      form.experience === ""
        ? ""
        : Number(form.experience);

    const hourlyRate =
      form.hourlyRate === ""
        ? ""
        : Number(form.hourlyRate);

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!name) {
      setError("Full name is required.");
      return;
    }

    if (name.length < 2) {
      setError("Full name must contain at least 2 characters.");
      return;
    }

    if (!email) {
      setError("Email address is required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (
      experience !== "" &&
      (!Number.isFinite(experience) || experience < 0)
    ) {
      setError("Experience must be a valid positive number.");
      return;
    }

    if (
      hourlyRate !== "" &&
      (!Number.isFinite(hourlyRate) || hourlyRate < 0)
    ) {
      setError("Hourly rate must be a valid positive number.");
      return;
    }

    if (bio.length > 2000) {
      setError("Professional bio cannot exceed 2000 characters.");
      return;
    }

    if (skills.length > 30) {
      setError("You can add a maximum of 30 skills.");
      return;
    }

    // =======================================================
    // SAVE
    // =======================================================

    try {
      setSaving(true);

      const savedUser = localStorage.getItem("user");

      let existingUser = {};

      if (savedUser) {
        try {
          existingUser = JSON.parse(savedUser) || {};
        } catch {
          existingUser = {};
        }
      }

      const updatedUser = {
        ...existingUser,

        name,
        email,
        phone,
        location,
        title,
        bio,
        skills,
        experience,
        hourlyRate,

        availability: form.availability,

        portfolioUrl: form.portfolioUrl.trim(),
        githubUrl: form.githubUrl.trim(),
        linkedinUrl: form.linkedinUrl.trim(),
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setForm(createFormFromUser(updatedUser));

      setMessage("Profile changes saved successfully.");
    } catch (err) {
      console.error("Profile Save Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save profile changes."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <div className="freelancer-profile-page">
          <div className="profile-loading">
            <div className="profile-loading-spinner">
              <FaSpinner />
            </div>

            <h3>Loading profile...</h3>

            <p>
              Please wait while we load your profile
              information.
            </p>
          </div>
        </div>
      </>
    );
  }

  // =========================================================
  // DATA
  // =========================================================

  const initials = getInitials(form.name);

  const skillsList = form.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      <style>{styles}</style>

      <div className="freelancer-profile-page">

        {/* =================================================
            HEADER
        ================================================== */}

        <header className="profile-page-header">

          <div className="profile-page-heading">

            <div className="page-eyebrow">
              ACCOUNT
            </div>

            <h1>My Profile</h1>

            <p>
              Manage your professional profile and
              freelancer information.
            </p>

          </div>

          <div className="profile-status">
            <span className="online-dot" />
            <span>Profile Active</span>
          </div>

        </header>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================== */}

        {message && (
          <div
            className="profile-message success-message"
            role="status"
          >
            <FaCheckCircle />

            <span>{message}</span>

            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Close success message"
            >
              ×
            </button>
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div
            className="profile-message error-message"
            role="alert"
          >
            <FaExclamationCircle />

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}

        {/* =================================================
            FORM
        ================================================== */}

        <form onSubmit={handleSave}>

          <div className="profile-layout">

            {/* =================================================
                LEFT PROFILE CARD
            ================================================== */}

            <aside className="profile-sidebar">

              <div className="profile-card">

                <div className="large-avatar">
                  {initials}
                </div>

                <h2>
                  {form.name || "Freelancer"}
                </h2>

                <p className="profile-title">
                  {form.title ||
                    "Professional Freelancer"}
                </p>

                <div className="profile-divider" />

                {/* MINI INFO */}

                <div className="profile-mini-info">

                  <div className="profile-mini-item">

                    <span className="mini-icon">
                      <FaEnvelope />
                    </span>

                    <div>
                      <small>Email</small>

                      <p>
                        {form.email ||
                          "Email not added"}
                      </p>
                    </div>

                  </div>

                  <div className="profile-mini-item">

                    <span className="mini-icon">
                      <FaMapMarkerAlt />
                    </span>

                    <div>
                      <small>Location</small>

                      <p>
                        {form.location ||
                          "Location not added"}
                      </p>
                    </div>

                  </div>

                  <div className="profile-mini-item">

                    <span className="mini-icon">
                      <FaCircle />
                    </span>

                    <div>
                      <small>Availability</small>

                      <p>
                        {form.availability ||
                          "Not specified"}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="profile-divider" />

                {/* COMPLETION */}

                <div className="profile-completion">

                  <div className="completion-header">

                    <span>
                      Profile Completion
                    </span>

                    <strong>
                      {completion}%
                    </strong>

                  </div>

                  <div
                    className="completion-track"
                    aria-label={`Profile completion ${completion}%`}
                  >
                    <div
                      className="completion-value"
                      style={{
                        width: `${completion}%`,
                      }}
                    />
                  </div>

                  <p className="completion-helper">
                    Complete your profile to give
                    clients a better understanding
                    of your expertise.
                  </p>

                </div>

                {/* SKILLS */}

                {skillsList.length > 0 && (
                  <>
                    <div className="profile-divider" />

                    <div className="sidebar-skills">

                      <div className="sidebar-section-label">
                        <FaCode />
                        <span>Top Skills</span>
                      </div>

                      <div className="sidebar-skill-list">

                        {skillsList
                          .slice(0, 6)
                          .map((skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                            >
                              {skill}
                            </span>
                          ))}

                        {skillsList.length > 6 && (
                          <span>
                            +{skillsList.length - 6}
                          </span>
                        )}

                      </div>

                    </div>
                  </>
                )}

              </div>

            </aside>

            {/* =================================================
                RIGHT CONTENT
            ================================================== */}

            <main className="profile-main">

              {/* =================================================
                  PERSONAL INFORMATION
              ================================================== */}

              <section className="profile-section">

                <SectionHeading
                  icon={<FaUser />}
                  title="Personal Information"
                  description="Your basic contact and personal details."
                />

                <div className="form-grid">

                  <FormField
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    icon={<FaUser />}
                    required
                    disabled={saving}
                  />

                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    icon={<FaEnvelope />}
                    required
                    disabled={saving}
                  />

                  <FormField
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    icon={<FaPhone />}
                    disabled={saving}
                  />

                  <FormField
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    icon={<FaMapMarkerAlt />}
                    disabled={saving}
                  />

                </div>

              </section>

              {/* =================================================
                  PROFESSIONAL INFORMATION
              ================================================== */}

              <section className="profile-section">

                <SectionHeading
                  icon={<FaBriefcase />}
                  title="Professional Information"
                  description="Help clients understand your professional expertise."
                />

                <div className="form-grid">

                  <FormField
                    label="Professional Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Full Stack Developer"
                    icon={<FaBriefcase />}
                    disabled={saving}
                  />

                  <FormField
                    label="Years of Experience"
                    name="experience"
                    type="number"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                    min="0"
                    disabled={saving}
                  />

                  <FormField
                    label="Hourly Rate"
                    name="hourlyRate"
                    type="number"
                    value={form.hourlyRate}
                    onChange={handleChange}
                    placeholder="e.g. 1500"
                    min="0"
                    prefix="₹"
                    disabled={saving}
                  />

                  <div className="form-field">

                    <label htmlFor="availability">
                      Availability
                    </label>

                    <div className="select-wrapper">

                      <FaCircle />

                      <select
                        id="availability"
                        name="availability"
                        value={form.availability}
                        onChange={handleChange}
                        disabled={saving}
                      >
                        <option value="Available">
                          Available
                        </option>

                        <option value="Busy">
                          Busy
                        </option>

                        <option value="Not Available">
                          Not Available
                        </option>
                      </select>

                    </div>

                  </div>

                </div>

                {/* BIO */}

                <div className="form-field full-field">

                  <label htmlFor="bio">
                    Professional Bio
                  </label>

                  <textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell clients about your experience, expertise and the type of work you do..."
                    rows={6}
                    maxLength={2000}
                    disabled={saving}
                  />

                  <div className="field-footer">

                    <small>
                      A clear professional bio helps
                      clients understand your expertise.
                    </small>

                    <span>
                      {form.bio.length}/2000
                    </span>

                  </div>

                </div>

                {/* SKILLS */}

                <div className="form-field full-field">

                  <label htmlFor="skills">
                    Skills
                  </label>

                  <div className="input-with-icon">

                    <span className="field-icon">
                      <FaCode />
                    </span>

                    <input
                      id="skills"
                      type="text"
                      name="skills"
                      value={form.skills}
                      onChange={handleChange}
                      placeholder="React, Node.js, MongoDB, UI/UX"
                      disabled={saving}
                    />

                  </div>

                  <small>
                    Separate each skill with a comma.
                  </small>

                </div>

              </section>

              {/* =================================================
                  SOCIAL LINKS
              ================================================== */}

              <section className="profile-section">

                <SectionHeading
                  icon={<FaGlobe />}
                  title="Portfolio & Social Links"
                  description="Add links that showcase your work and professional presence."
                />

                <div className="form-grid">

                  <FormField
                    label="Portfolio Website"
                    name="portfolioUrl"
                    type="url"
                    value={form.portfolioUrl}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                    icon={<FaGlobe />}
                    disabled={saving}
                  />

                  <FormField
                    label="GitHub"
                    name="githubUrl"
                    type="url"
                    value={form.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    icon={<FaGithub />}
                    disabled={saving}
                  />

                  <FormField
                    label="LinkedIn"
                    name="linkedinUrl"
                    type="url"
                    value={form.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    icon={<FaLinkedin />}
                    disabled={saving}
                  />

                </div>

              </section>

              {/* =================================================
                  SAVE BAR
              ================================================== */}

              <div className="save-bar">

                <div className="save-bar-content">

                  <div className="save-bar-icon">
                    <FaSave />
                  </div>

                  <div>

                    <strong>
                      Keep your profile updated
                    </strong>

                    <p>
                      Updated information helps
                      clients understand your expertise.
                    </p>

                  </div>

                </div>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >

                  {saving ? (
                    <>
                      <FaSpinner className="save-spinner" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaSave />
                      <span>Save Changes</span>
                    </>
                  )}

                </button>

              </div>

            </main>

          </div>

        </form>

      </div>
    </>
  );
};

// =============================================================
// SECTION HEADING
// =============================================================

function SectionHeading({
  icon,
  title,
  description,
}) {
  return (
    <div className="section-heading">

      <div className="section-icon">
        {icon}
      </div>

      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

    </div>
  );
}

// =============================================================
// FORM FIELD
// =============================================================

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  prefix,
  icon,
  required = false,
  disabled = false,
}) {
  return (
    <div className="form-field">

      <label htmlFor={name}>

        {label}

        {required && (
          <span className="required-mark">
            *
          </span>
        )}

      </label>

      {prefix ? (
        <div className="input-prefix">

          <span>{prefix}</span>

          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            disabled={disabled}
          />

        </div>
      ) : (
        <div className="input-with-icon">

          {icon && (
            <span className="field-icon">
              {icon}
            </span>
          )}

          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            disabled={disabled}
          />

        </div>
      )}

    </div>
  );
}

// =============================================================
// NORMALIZE USER
// =============================================================

function createFormFromUser(user = {}) {
  const skills = Array.isArray(user.skills)
    ? user.skills.join(", ")
    : typeof user.skills === "string"
    ? user.skills
    : "";

  return {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || "",

    title:
      user.title ||
      user.professionalTitle ||
      "",

    bio: user.bio || "",

    skills,

    experience:
      user.experience ??
      user.yearsOfExperience ??
      "",

    hourlyRate:
      user.hourlyRate ??
      user.hourly_rate ??
      "",

    availability:
      user.availability ||
      "Available",

    portfolioUrl:
      user.portfolioUrl ||
      user.portfolioURL ||
      "",

    githubUrl:
      user.githubUrl ||
      user.githubURL ||
      "",

    linkedinUrl:
      user.linkedinUrl ||
      user.linkedinURL ||
      "",
  };
}

// =============================================================
// INITIALS
// =============================================================

function getInitials(name) {
  if (!name) {
    return "F";
  }

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    words[0].charAt(0) +
    words[words.length - 1].charAt(0)
  ).toUpperCase();
}

// =============================================================
// PROFILE COMPLETION
// =============================================================

function calculateCompletion(form) {
  const fields = [
    form.name,
    form.email,
    form.phone,
    form.location,
    form.title,
    form.bio,
    form.skills,
    form.experience,
    form.hourlyRate,
    form.portfolioUrl,
  ];

  const completed = fields.filter(
    (field) =>
      field !== undefined &&
      field !== null &&
      String(field).trim() !== ""
  ).length;

  return Math.round(
    (completed / fields.length) * 100
  );
}

// =============================================================
// EMAIL VALIDATION
// =============================================================

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

// =============================================================
// STYLES
// =============================================================

const styles = `
* {
  box-sizing: border-box;
}

.freelancer-profile-page {
  min-height: calc(100vh - 80px);
  padding: 30px 32px 55px;

  background:
    radial-gradient(
      circle at 90% 0%,
      rgba(16, 185, 129, 0.06),
      transparent 28%
    ),
    #f8fafc;

  color: #0f172a;
}

/* HEADER */

.profile-page-header {
  max-width: 1240px;
  margin: 0 auto 25px;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 25px;
}

.page-eyebrow {
  margin-bottom: 6px;

  color: #059669;

  font-size: 10px;
  font-weight: 900;

  letter-spacing: 0.14em;
}

.profile-page-header h1 {
  margin: 0;

  color: #0f172a;

  font-size: 30px;
  line-height: 1.2;
  font-weight: 850;

  letter-spacing: -0.7px;
}

.profile-page-header p {
  margin: 8px 0 0;

  color: #64748b;

  font-size: 13px;
  line-height: 1.6;
}

.profile-status {
  display: inline-flex;
  align-items: center;

  gap: 8px;

  padding: 9px 13px;

  border: 1px solid #a7f3d0;
  border-radius: 999px;

  background: #ecfdf5;

  color: #047857;

  font-size: 11px;
  font-weight: 800;

  white-space: nowrap;
}

.online-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #10b981;

  box-shadow:
    0 0 0 3px rgba(16, 185, 129, 0.12);
}

/* MESSAGES */

.profile-message {
  max-width: 1240px;

  margin: 0 auto 20px;

  min-height: 47px;

  padding: 11px 13px;

  border-radius: 11px;

  display: flex;
  align-items: center;

  gap: 10px;

  font-size: 13px;
  font-weight: 700;
}

.profile-message span {
  flex: 1;
}

.profile-message button {
  width: 27px;
  height: 27px;

  border: 0;
  border-radius: 7px;

  background: transparent;

  color: inherit;

  font-size: 18px;

  cursor: pointer;
}

.success-message {
  border: 1px solid #a7f3d0;

  background: #ecfdf5;

  color: #047857;
}

.error-message {
  border: 1px solid #fecaca;

  background: #fef2f2;

  color: #b91c1c;
}

/* LAYOUT */

.profile-layout {
  max-width: 1240px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    285px
    minmax(0, 1fr);

  align-items: start;

  gap: 22px;
}

.profile-sidebar {
  position: sticky;
  top: 96px;
}

.profile-card {
  padding: 26px 21px;

  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 19px;

  box-shadow:
    0 6px 22px rgba(15, 23, 42, 0.035);

  text-align: center;
}

/* AVATAR */

.large-avatar {
  width: 88px;
  height: 88px;

  margin: 0 auto 15px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      135deg,
      #111827,
      #064e3b
    );

  color: #ffffff;

  font-size: 27px;
  font-weight: 900;

  box-shadow:
    0 10px 25px rgba(15, 23, 42, 0.15);
}

.profile-card h2 {
  margin: 0;

  color: #0f172a;

  font-size: 19px;
  font-weight: 800;

  word-break: break-word;
}

.profile-title {
  margin: 6px 0 0;

  color: #059669;

  font-size: 12px;
  line-height: 1.5;
  font-weight: 700;

  word-break: break-word;
}

.profile-divider {
  height: 1px;

  margin: 21px 0;

  background: #e2e8f0;
}

/* MINI INFO */

.profile-mini-info {
  display: flex;

  flex-direction: column;

  gap: 15px;

  text-align: left;
}

.profile-mini-item {
  display: flex;

  align-items: flex-start;

  gap: 10px;

  min-width: 0;
}

.mini-icon {
  width: 27px;
  height: 27px;

  flex: 0 0 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;

  background: #ecfdf5;

  color: #059669;

  font-size: 11px;
}

.profile-mini-item div {
  min-width: 0;
}

.profile-mini-item small {
  display: block;

  margin-bottom: 3px;

  color: #94a3b8;

  font-size: 9px;
  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 0.05em;
}

.profile-mini-item p {
  margin: 0;

  color: #475569;

  font-size: 11px;
  line-height: 1.5;

  word-break: break-word;
}

/* COMPLETION */

.profile-completion {
  text-align: left;
}

.completion-header {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 8px;
}

.completion-header span {
  color: #64748b;

  font-size: 11px;
  font-weight: 700;
}

.completion-header strong {
  color: #059669;

  font-size: 11px;
  font-weight: 900;
}

.completion-track {
  height: 7px;

  overflow: hidden;

  border-radius: 999px;

  background: #e2e8f0;
}

.completion-value {
  height: 100%;

  border-radius: inherit;

  background:
    linear-gradient(
      90deg,
      #10b981,
      #059669
    );

  transition: width 0.3s ease;
}

.completion-helper {
  margin: 8px 0 0;

  color: #94a3b8;

  font-size: 9px;
  line-height: 1.55;
}

/* SKILLS */

.sidebar-section-label {
  display: flex;

  align-items: center;

  gap: 7px;

  margin-bottom: 10px;

  color: #64748b;

  font-size: 10px;
  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 0.05em;
}

.sidebar-section-label svg {
  color: #059669;
}

.sidebar-skill-list {
  display: flex;

  flex-wrap: wrap;

  gap: 6px;
}

.sidebar-skill-list span {
  padding: 5px 8px;

  border: 1px solid #d1fae5;

  border-radius: 7px;

  background: #ecfdf5;

  color: #047857;

  font-size: 9px;
  font-weight: 700;
}

/* MAIN */

.profile-main {
  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 20px;
}

.profile-section {
  padding: 25px;

  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 18px;

  box-shadow:
    0 5px 18px rgba(15, 23, 42, 0.025);
}

/* SECTION HEADING */

.section-heading {
  display: flex;

  align-items: flex-start;

  gap: 12px;

  margin-bottom: 22px;
}

.section-icon {
  width: 38px;
  height: 38px;

  flex: 0 0 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  border: 1px solid #d1fae5;

  border-radius: 10px;

  background: #ecfdf5;

  color: #059669;

  font-size: 13px;
}

.section-heading h2 {
  margin: 0;

  color: #0f172a;

  font-size: 17px;
  line-height: 1.4;

  font-weight: 800;
}

.section-heading p {
  margin: 4px 0 0;

  color: #64748b;

  font-size: 11px;

  line-height: 1.5;
}

/* FORM GRID */

.form-grid {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 18px;
}

.form-field {
  min-width: 0;
}

.form-field label {
  display: flex;

  align-items: center;

  gap: 3px;

  margin-bottom: 7px;

  color: #334155;

  font-size: 11px;
  font-weight: 800;
}

.required-mark {
  color: #dc2626;
}

.full-field {
  margin-top: 18px;
}

/* INPUTS */

.input-with-icon {
  position: relative;
}

.field-icon {
  position: absolute;

  top: 50%;
  left: 13px;

  z-index: 1;

  display: flex;

  align-items: center;

  color: #94a3b8;

  font-size: 11px;

  pointer-events: none;

  transform: translateY(-50%);
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;

  border: 1px solid #cbd5e1;

  border-radius: 10px;

  outline: none;

  background: #ffffff;

  color: #0f172a;

  font-family: inherit;

  font-size: 13px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.form-field input {
  height: 43px;

  padding: 10px 12px;
}

.input-with-icon input {
  padding-left: 35px;
}

.form-field textarea {
  min-height: 135px;

  padding: 12px;

  resize: vertical;

  line-height: 1.65;
}

.form-field select {
  height: 43px;

  padding: 10px 12px;

  appearance: none;

  cursor: pointer;
}

.form-field input::placeholder,
.form-field textarea::placeholder {
  color: #94a3b8;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  border-color: #10b981;

  background: #ffffff;

  box-shadow:
    0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-field input:disabled,
.form-field textarea:disabled,
.form-field select:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* PREFIX */

.input-prefix {
  display: flex;

  align-items: center;

  overflow: hidden;

  border: 1px solid #cbd5e1;

  border-radius: 10px;

  background: #ffffff;
}

.input-prefix:focus-within {
  border-color: #10b981;

  box-shadow:
    0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input-prefix > span {
  min-width: 40px;

  padding: 0 10px;

  color: #64748b;

  font-size: 13px;

  font-weight: 800;

  text-align: center;
}

.input-prefix input {
  flex: 1;

  border: 0;

  border-radius: 0;
}

.input-prefix input:focus {
  box-shadow: none;
}

/* SELECT */

.select-wrapper {
  position: relative;
}

.select-wrapper > svg {
  position: absolute;

  top: 50%;
  left: 14px;

  z-index: 1;

  width: 7px;

  color: #10b981;

  pointer-events: none;

  transform: translateY(-50%);
}

.select-wrapper select {
  padding-left: 31px;
}

/* FIELD FOOTER */

.field-footer {
  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  gap: 15px;

  margin-top: 6px;
}

.form-field small {
  display: block;

  margin-top: 6px;

  color: #94a3b8;

  font-size: 9px;

  line-height: 1.5;
}

.field-footer small {
  margin-top: 0;
}

.field-footer > span {
  flex: 0 0 auto;

  color: #94a3b8;

  font-size: 9px;

  font-weight: 700;
}

/* SAVE BAR */

.save-bar {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 19px 21px;

  border-radius: 17px;

  background:
    linear-gradient(
      135deg,
      #0b1220,
      #111827
    );

  color: #ffffff;

  box-shadow:
    0 10px 25px rgba(15, 23, 42, 0.12);
}

.save-bar-content {
  display: flex;

  align-items: center;

  gap: 12px;
}

.save-bar-icon {
  width: 38px;
  height: 38px;

  flex: 0 0 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: rgba(16, 185, 129, 0.12);

  color: #34d399;
}

.save-bar strong {
  display: block;

  color: #ffffff;

  font-size: 13px;
}

.save-bar p {
  margin: 4px 0 0;

  color: #94a3b8;

  font-size: 10px;

  line-height: 1.5;
}

.save-btn {
  min-height: 42px;

  border: 0;

  border-radius: 10px;

  padding: 11px 18px;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  background:
    linear-gradient(
      135deg,
      #10b981,
      #059669
    );

  color: #ffffff;

  font-family: inherit;

  font-size: 12px;

  font-weight: 900;

  cursor: pointer;

  white-space: nowrap;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);

  box-shadow:
    0 8px 18px rgba(16, 185, 129, 0.25);
}

.save-btn:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

.save-spinner {
  animation:
    profileSpin 0.8s linear infinite;
}

/* LOADING */

.profile-loading {
  max-width: 1240px;

  min-height: 500px;

  margin: 0 auto;

  padding: 30px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  border: 1px solid #e2e8f0;

  border-radius: 18px;

  background: #ffffff;

  text-align: center;
}

.profile-loading-spinner {
  width: 40px;
  height: 40px;

  margin-bottom: 16px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #059669;

  font-size: 26px;

  animation:
    profileSpin 0.8s linear infinite;
}

.profile-loading h3 {
  margin: 0 0 6px;

  color: #334155;

  font-size: 16px;

  font-weight: 800;
}

.profile-loading p {
  margin: 0;

  color: #94a3b8;

  font-size: 12px;
}

/* ANIMATION */

@keyframes profileSpin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* TABLET */

@media (max-width: 1050px) {
  .profile-layout {
    grid-template-columns:
      250px
      minmax(0, 1fr);
  }

  .profile-sidebar {
    position: static;
  }
}

/* TABLET / MOBILE */

@media (max-width: 850px) {
  .freelancer-profile-page {
    padding: 24px 20px 45px;
  }

  .profile-page-header {
    align-items: flex-start;

    flex-direction: column;
  }

  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-card {
    text-align: left;
  }

  .large-avatar {
    margin: 0 0 15px;
  }

  .profile-mini-info {
    display: grid;

    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

/* MOBILE */

@media (max-width: 650px) {
  .freelancer-profile-page {
    padding: 20px 15px 40px;
  }

  .profile-page-header h1 {
    font-size: 26px;
  }

  .profile-status {
    align-self: flex-start;
  }

  .profile-layout {
    gap: 17px;
  }

  .profile-section {
    padding: 20px 17px;

    border-radius: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;

    gap: 16px;
  }

  .full-field {
    margin-top: 16px;
  }

  .save-bar {
    align-items: flex-start;

    flex-direction: column;
  }

  .save-bar-content {
    align-items: flex-start;
  }

  .save-btn {
    width: 100%;
  }
}

/* SMALL MOBILE */

@media (max-width: 480px) {
  .profile-page-header h1 {
    font-size: 23px;
  }

  .profile-page-header p {
    font-size: 12px;
  }

  .profile-card {
    padding: 21px 17px;
  }

  .profile-mini-info {
    grid-template-columns: 1fr;
  }

  .section-heading {
    gap: 10px;
  }

  .section-icon {
    width: 34px;
    height: 34px;

    flex-basis: 34px;
  }

  .section-heading h2 {
    font-size: 15px;
  }

  .section-heading p {
    font-size: 10px;
  }

  .field-footer {
    flex-direction: column;

    gap: 4px;
  }

  .save-bar {
    padding: 17px;
  }
}
`;

export default FreelancerProfile;