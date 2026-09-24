import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../../Services/clientService";
import "../../styles/PostProject.css";


import {
  ArrowLeft,
  Plus,
  X,
  BriefcaseBusiness,
  FileText,
  Tags,
  IndianRupee,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const PostProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    skills: [],
    budget: "",
    deadline: "",
  });

  const [skillInput, setSkillInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  // =====================================================
  // ADD SKILL
  // =====================================================

  const handleAddSkill = () => {
    const skill = skillInput.trim();

    if (!skill) {
      return;
    }

    const exists = formData.skills.some(
      (item) =>
        item.toLowerCase() === skill.toLowerCase()
    );

    if (exists) {
      setSkillInput("");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      skills: [
        ...previous.skills,
        skill,
      ],
    }));

    setSkillInput("");

    setErrorMessage("");
  };

  // =====================================================
  // REMOVE SKILL
  // =====================================================

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((previous) => ({
      ...previous,
      skills: previous.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  // =====================================================
  // ENTER KEY FOR SKILL
  // =====================================================

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      handleAddSkill();
    }
  };

  // =====================================================
  // VALIDATE
  // =====================================================

  const validateForm = () => {
    if (!formData.title.trim()) {
      return "Project title is required.";
    }

    if (!formData.description.trim()) {
      return "Project description is required.";
    }

    if (!formData.category.trim()) {
      return "Project category is required.";
    }

    // BACKEND REQUIRES SKILLS
    if (
      !Array.isArray(formData.skills) ||
      formData.skills.length === 0
    ) {
      return "Please add at least one skill.";
    }

    if (
      formData.budget === "" ||
      formData.budget === null
    ) {
      return "Project budget is required.";
    }

    const budget = Number(formData.budget);

    if (
      Number.isNaN(budget) ||
      budget <= 0
    ) {
      return "Budget must be greater than ₹0.";
    }

    if (!formData.deadline) {
      return "Project deadline is required.";
    }

    const selectedDate =
      new Date(formData.deadline);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "Deadline cannot be in the past.";
    }

    return null;
  };

  // =====================================================
  // SUBMIT PROJECT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const validationError =
      validateForm();

    if (validationError) {
      setErrorMessage(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const projectData = {
      title: formData.title.trim(),

      description:
        formData.description.trim(),

      category:
        formData.category.trim(),

      skills: formData.skills,

      budget: Number(formData.budget),

      deadline: formData.deadline,
    };

    console.log(
      "======================================"
    );

    console.log(
      "CREATE PROJECT DATA:"
    );

    console.log(projectData);

    console.log(
      "======================================"
    );

    try {
      setLoading(true);

      const response =
        await createProject(
          projectData
        );

      console.log(
        "PROJECT CREATED:",
        response
      );

      setSuccessMessage(
        "Project posted successfully!"
      );

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        skills: [],
        budget: "",
        deadline: "",
      });

      setSkillInput("");

      // Go to projects page
      setTimeout(() => {
        navigate(
          "/client/projects"
        );
      }, 1200);

    } catch (error) {
      console.error(
        "POST PROJECT ERROR:",
        error
      );

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.msg ||
        error.message;

      setErrorMessage(
        backendMessage ||
          "Failed to post project. Please try again."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    navigate("/client/projects");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="client-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>
          <button
            type="button"
            onClick={handleCancel}
            className="back-button"
          >
            <ArrowLeft size={18} />

            Back to Projects
          </button>

          <h1>
            Post a New Project
          </h1>

          <p>
            Tell freelancers what you need
            and find the right person for
            your project.
          </p>
        </div>

      </div>

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {successMessage && (
        <div className="alert success-alert">

          <CheckCircle2 size={20} />

          <span>
            {successMessage}
          </span>

        </div>
      )}

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {errorMessage && (
        <div className="alert error-alert">

          <AlertCircle size={20} />

          <span>
            {errorMessage}
          </span>

        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="project-form"
      >

        {/* =================================================
            BASIC INFORMATION
        ================================================= */}

        <div className="form-card">

          <div className="form-card-header">

            <div className="form-icon">
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <h2>
                Project Information
              </h2>

              <p>
                Provide the basic details
                about your project.
              </p>
            </div>

          </div>

          {/* TITLE */}

          <div className="form-group">

            <label htmlFor="title">
              Project Title
              <span>*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. E-Commerce Website Development"
              disabled={loading}
            />

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label htmlFor="description">
              Project Description
              <span>*</span>
            </label>

            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project requirements..."
              disabled={loading}
            />

            <small>
              Explain clearly what you
              want the freelancer to build.
            </small>

          </div>

          {/* CATEGORY */}

          <div className="form-group">

            <label htmlFor="category">
              Category
              <span>*</span>
            </label>

            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, MongoDB"
              disabled={loading}
            />

          </div>

        </div>

        {/* =================================================
            SKILLS
        ================================================= */}

        <div className="form-card">

          <div className="form-card-header">

            <div className="form-icon">
              <Tags size={20} />
            </div>

            <div>
              <h2>
                Required Skills
              </h2>

              <p>
                Add the skills required
                for this project.
              </p>
            </div>

          </div>

          <div className="form-group">

            <label htmlFor="skills">
              Skills
              <span>*</span>
            </label>

            <div className="skill-input-wrapper">

              <input
                id="skills"
                type="text"
                value={skillInput}
                onChange={(event) =>
                  setSkillInput(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleSkillKeyDown
                }
                placeholder="Enter a skill and press Enter"
                disabled={loading}
              />

              <button
                type="button"
                onClick={handleAddSkill}
                disabled={loading}
                className="add-skill-button"
              >
                <Plus size={18} />

                Add
              </button>

            </div>

            {/* SKILL TAGS */}

            {formData.skills.length > 0 && (
              <div className="skills-list">

                {formData.skills.map(
                  (skill) => (
                    <div
                      key={skill}
                      className="skill-tag"
                    >

                      <span>
                        {skill}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveSkill(
                            skill
                          )
                        }
                        disabled={loading}
                      >
                        <X size={14} />
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

            {formData.skills.length === 0 && (
              <small className="skill-hint">
                Add at least one skill.
                Example: React, Node.js,
                MongoDB, Express
              </small>
            )}

          </div>

        </div>

        {/* =================================================
            BUDGET & DEADLINE
        ================================================= */}

        <div className="form-card">

          <div className="form-card-header">

            <div className="form-icon">
              <IndianRupee size={20} />
            </div>

            <div>
              <h2>
                Budget & Deadline
              </h2>

              <p>
                Set your project budget
                and expected completion date.
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* BUDGET */}

            <div className="form-group">

              <label htmlFor="budget">
                Budget
                <span>*</span>
              </label>

              <div className="input-with-icon">

                <IndianRupee size={18} />

                <input
                  id="budget"
                  name="budget"
                  type="number"
                  min="1"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="10000"
                  disabled={loading}
                />

              </div>

            </div>

            {/* DEADLINE */}

            <div className="form-group">

              <label htmlFor="deadline">
                Deadline
                <span>*</span>
              </label>

              <div className="input-with-icon">

                <CalendarDays size={18} />

                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            PREVIEW
        ================================================= */}

        <div className="form-card preview-card">

          <div className="form-card-header">

            <div className="form-icon">
              <FileText size={20} />
            </div>

            <div>
              <h2>
                Project Preview
              </h2>

              <p>
                Review your project before
                posting it.
              </p>
            </div>

          </div>

          <div className="preview-content">

            <h3>
              {formData.title ||
                "Your Project Title"}
            </h3>

            <p>
              {formData.description ||
                "Your project description will appear here."}
            </p>

            <div className="preview-meta">

              <span>
                <strong>
                  Category:
                </strong>{" "}
                {formData.category ||
                  "Not specified"}
              </span>

              <span>
                <strong>
                  Budget:
                </strong>{" "}
                ₹
                {formData.budget ||
                  "0"}
              </span>

              <span>
                <strong>
                  Deadline:
                </strong>{" "}
                {formData.deadline ||
                  "Not specified"}
              </span>

            </div>

            {formData.skills.length >
              0 && (
              <div className="preview-skills">

                {formData.skills.map(
                  (skill) => (
                    <span
                      key={skill}
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>
            )}

          </div>

        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="spin"
                />

                Posting...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />

                Post Project
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
};

export default PostProject;