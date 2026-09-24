import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  Code2,
  Clock3,
  IndianRupee,
  FolderOpen,
  Loader2,
  X,
  BriefcaseBusiness,
  CheckCircle2,
} from "lucide-react";

import { getProjects } from "../Services/projectService";

import "./Projects.css";

// =====================================================
// PROJECTS PAGE
// =====================================================

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PROJECTS
  // =====================================================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProjects();

        console.log("PROJECTS RESPONSE:", response);

        const data =
          response?.projects ||
          response?.data?.projects ||
          response?.data ||
          [];

        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("PROJECTS ERROR:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load projects from the backend."
        );

        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        projects
          .map((project) => project.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [projects]);

  // =====================================================
  // FILTER PROJECTS
  // =====================================================

  const filteredProjects = useMemo(() => {
    const keyword = q.toLowerCase().trim();

    return projects.filter((project) => {
      const skills = Array.isArray(project.skills)
        ? project.skills.join(" ")
        : "";

      const searchableText = `
        ${project.title || ""}
        ${project.description || ""}
        ${project.category || ""}
        ${skills}
      `.toLowerCase();

      const matchesSearch =
        !keyword || searchableText.includes(keyword);

      const matchesCategory =
        category === "All" ||
        project.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [projects, q, category]);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setQ("");
    setCategory("All");
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT BUDGET
  // =====================================================

  const formatBudget = (budget) => {
    if (
      budget === undefined ||
      budget === null ||
      budget === ""
    ) {
      return "—";
    }

    return Number(budget).toLocaleString("en-IN");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="projects-page">

        <section className="projects-loading-section">
          <div className="projects-loading-box">

            <div className="loading-icon">
              <Loader2 size={25} />
            </div>

            <h1>Loading Projects</h1>

            <p>
              Fetching the latest projects from SkillForge...
            </p>

          </div>
        </section>

      </main>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <main className="projects-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="projects-hero">

        <div className="projects-container">

          <div className="projects-hero-content">

            {/* LABEL */}

            <div className="projects-label">

              <BriefcaseBusiness size={14} />

              <span>
                Project Marketplace
              </span>

            </div>

            {/* TITLE */}

            <h1>
              Find projects that match
              <span> your skills.</span>
            </h1>

            {/* DESCRIPTION */}

            <p className="projects-hero-description">
              Discover live freelance projects published by
              clients and find opportunities that match your
              expertise.
            </p>

            {/* SEARCH */}

            <div className="projects-search-wrapper">

              <Search
                size={19}
                className="projects-search-icon"
              />

              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search projects, skills or technologies..."
              />

              {q && (
                <button
                  type="button"
                  className="projects-search-clear"
                  onClick={() => setQ("")}
                >
                  <X size={16} />
                </button>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="projects-content">

        <div className="projects-container">

          {/* =================================================
              TOP BAR
          ================================================= */}

          <div className="projects-topbar">

            <div>

              <div className="projects-heading">

                <SlidersHorizontal size={16} />

                <h2>
                  Browse Projects
                </h2>

              </div>

              <p>
                {filteredProjects.length}{" "}
                {filteredProjects.length === 1
                  ? "project"
                  : "projects"}{" "}
                available
              </p>

            </div>

            {(q || category !== "All") && (
              <button
                type="button"
                className="clear-filter-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}

          </div>


          {/* =================================================
              CATEGORY FILTERS
          ================================================= */}

          <div className="project-filters">

            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={
                  category === item
                    ? "project-filter active"
                    : "project-filter"
                }
              >
                {item}
              </button>
            ))}

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="projects-error">

              <div className="projects-error-icon">
                <X size={18} />
              </div>

              <div>
                <h3>
                  Unable to load projects
                </h3>

                <p>
                  {error}
                </p>
              </div>

            </div>
          )}


          {/* =================================================
              PROJECT GRID
          ================================================= */}

          {!error && filteredProjects.length > 0 ? (

            <div className="projects-grid">

              {filteredProjects.map((project) => {

                const projectId =
                  project._id || project.id;

                const skills = Array.isArray(
                  project.skills
                )
                  ? project.skills
                  : [];

                const isOpen =
                  String(
                    project.status || "open"
                  ).toLowerCase() === "open";

                return (

                  <article
                    key={projectId}
                    className="project-card"
                  >

                    {/* ================================
                        CARD TOP
                    ================================= */}

                    <div className="project-card-header">

                      <div className="project-card-meta">

                        <span className="project-category">
                          {project.category || "Project"}
                        </span>

                        <span
                          className={
                            isOpen
                              ? "project-status open"
                              : "project-status closed"
                          }
                        >
                          <span className="status-dot"></span>

                          {project.status || "Open"}
                        </span>

                      </div>


                      {/* TITLE */}

                      <h2>
                        {project.title ||
                          "Untitled Project"}
                      </h2>


                      {/* DESCRIPTION */}

                      <p>
                        {project.description ||
                          "No description provided."}
                      </p>

                    </div>


                    {/* ================================
                        CARD BODY
                    ================================= */}

                    <div className="project-card-body">

                      {/* SKILLS */}

                      <div className="project-skills-section">

                        <p className="project-section-label">
                          Skills Required
                        </p>

                        {skills.length > 0 ? (

                          <div className="project-skills">

                            {skills
                              .slice(0, 4)
                              .map((skill, index) => (

                                <span
                                  key={`${skill}-${index}`}
                                  className="project-skill"
                                >
                                  <Code2 size={11} />
                                  {skill}
                                </span>

                              ))}

                            {skills.length > 4 && (
                              <span className="project-more-skills">
                                +{skills.length - 4}
                              </span>
                            )}

                          </div>

                        ) : (

                          <p className="no-skills">
                            No specific skills listed
                          </p>

                        )}

                      </div>


                      {/* PROJECT INFO */}

                      <div className="project-info">

                        {/* BUDGET */}

                        <div className="project-info-item">

                          <span className="project-info-label">
                            Budget
                          </span>

                          <strong>
                            <IndianRupee size={13} />

                            {formatBudget(
                              project.budget
                            )}
                          </strong>

                        </div>


                        {/* DEADLINE */}

                        <div className="project-info-item">

                          <span className="project-info-label">
                            Deadline
                          </span>

                          <strong className="deadline-value">
                            <Clock3 size={13} />

                            {formatDate(
                              project.deadline
                            )}
                          </strong>

                        </div>

                      </div>


                      {/* VIEW PROJECT */}

                      <Link
                        to={`/projects/${projectId}`}
                        className="view-project-btn"
                      >
                        <span>
                          View Project
                        </span>

                        <ArrowRight size={14} />
                      </Link>

                    </div>

                  </article>

                );
              })}

            </div>

          ) : !error ? (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="projects-empty">

              <div className="empty-icon">
                <FolderOpen size={27} />
              </div>

              <h2>
                No projects found
              </h2>

              <p>
                No projects match your current
                search or category filter.
              </p>

              {(q || category !== "All") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="empty-clear-btn"
                >
                  Clear Filters
                </button>
              )}

            </div>

          ) : null}

        </div>

      </section>


      {/* =================================================
          BOTTOM CTA
      ================================================= */}

      {!error && projects.length > 0 && (

        <section className="projects-cta-section">

          <div className="projects-container">

            <div className="projects-cta">

              <div className="projects-cta-content">

                <div className="cta-title-row">

                  <CheckCircle2 size={18} />

                  <h3>
                    Ready to start freelancing?
                  </h3>

                </div>

                <p>
                  Create your SkillForge profile and
                  start applying for projects that
                  match your skills.
                </p>

              </div>

              <Link
                to="/register"
                className="cta-button"
              >
                Get Started

                <ArrowRight size={15} />
              </Link>

            </div>

          </div>

        </section>

      )}

    </main>
  );
}