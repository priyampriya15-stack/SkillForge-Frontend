import { useEffect, useMemo, useState } from "react";

import {
  FaSearch,
  FaBriefcase,
  FaFilter,
  FaSpinner,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";

import { getProjects } from "../../Services/projectService";

import ProjectCard from "../../components/freelancer/ProjectCard";

const BrowseProjects = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All Categories");

  const [skill, setSkill] =
    useState("All Skills");

  // ==========================================
  // FETCH PROJECTS
  // ==========================================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getProjects({
          search: search.trim(),
          category:
            category === "All Categories"
              ? ""
              : category,
          skill:
            skill === "All Skills"
              ? ""
              : skill,
          status: "open",
        });

      // ----------------------------------------
      // SUPPORT COMMON API RESPONSE STRUCTURES
      // ----------------------------------------

      let projectList = [];

      if (Array.isArray(response)) {
        projectList = response;
      } else if (
        Array.isArray(response?.projects)
      ) {
        projectList =
          response.projects;
      } else if (
        Array.isArray(response?.data)
      ) {
        projectList =
          response.data;
      } else if (
        Array.isArray(
          response?.data?.projects
        )
      ) {
        projectList =
          response.data.projects;
      }

      // ----------------------------------------
      // API SUCCESS CHECK
      // ----------------------------------------

      if (
        response?.success === false &&
        projectList.length === 0
      ) {
        setProjects([]);

        setError(
          response?.message ||
            "Failed to load projects."
        );

        return;
      }

      setProjects(projectList);
    } catch (err) {
      console.error(
        "Browse projects error:",
        err
      );

      setProjects([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load projects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchProjects();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (event) => {
    event.preventDefault();

    fetchProjects();
  };

  // ==========================================
  // RESET FILTERS
  // ==========================================

  const handleReset = () => {
    setSearch("");
    setCategory("All Categories");
    setSkill("All Skills");

    // Fetch without old filter values
    fetchProjectsWithFilters(
      "",
      "All Categories",
      "All Skills"
    );
  };

  // ==========================================
  // FETCH WITH SPECIFIC FILTERS
  // ==========================================

  const fetchProjectsWithFilters =
    async (
      searchValue,
      categoryValue,
      skillValue
    ) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getProjects({
            search:
              searchValue.trim(),
            category:
              categoryValue ===
              "All Categories"
                ? ""
                : categoryValue,
            skill:
              skillValue === "All Skills"
                ? ""
                : skillValue,
            status: "open",
          });

        let projectList = [];

        if (Array.isArray(response)) {
          projectList = response;
        } else if (
          Array.isArray(
            response?.projects
          )
        ) {
          projectList =
            response.projects;
        } else if (
          Array.isArray(response?.data)
        ) {
          projectList =
            response.data;
        } else if (
          Array.isArray(
            response?.data?.projects
          )
        ) {
          projectList =
            response.data.projects;
        }

        if (
          response?.success === false &&
          projectList.length === 0
        ) {
          setProjects([]);

          setError(
            response?.message ||
              "Failed to load projects."
          );

          return;
        }

        setProjects(projectList);
      } catch (err) {
        console.error(
          "Reset projects error:",
          err
        );

        setProjects([]);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = useMemo(() => {
    const values = projects
      .map(
        (project) =>
          project?.category
      )
      .filter(Boolean);

    return [
      ...new Set(values),
    ];
  }, [projects]);

  // ==========================================
  // SKILLS
  // ==========================================

  const skills = useMemo(() => {
    const values =
      projects.flatMap(
        (project) =>
          Array.isArray(
            project?.skills
          )
            ? project.skills
            : []
      );

    return [
      ...new Set(
        values
          .filter(Boolean)
          .map((item) =>
            String(item)
          )
      ),
    ];
  }, [projects]);

  // ==========================================
  // LOCAL FILTER
  // ==========================================

  const filteredProjects =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return projects.filter(
        (project) => {
          const title =
            String(
              project?.title || ""
            ).toLowerCase();

          const description =
            String(
              project?.description ||
                ""
            ).toLowerCase();

          const projectSkills =
            Array.isArray(
              project?.skills
            )
              ? project.skills.map(
                  (item) =>
                    String(
                      item
                    ).toLowerCase()
                )
              : [];

          const matchesSearch =
            !searchValue ||
            title.includes(
              searchValue
            ) ||
            description.includes(
              searchValue
            ) ||
            projectSkills.some(
              (item) =>
                item.includes(
                  searchValue
                )
            );

          const matchesCategory =
            category ===
              "All Categories" ||
            project?.category ===
              category;

          const matchesSkill =
            skill === "All Skills" ||
            projectSkills.includes(
              skill.toLowerCase()
            );

          return (
            matchesSearch &&
            matchesCategory &&
            matchesSkill
          );
        }
      );
    }, [
      projects,
      search,
      category,
      skill,
    ]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="freelancer-page freelancer-browse-page">
        <div className="freelancer-loading">
          <FaSpinner className="freelancer-spinner" />

          <h2>
            Finding projects...
          </h2>

          <p>
            Loading available
            freelance projects.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="freelancer-page freelancer-browse-page">
      <div className="freelancer-page-container">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="freelancer-page-header">

          <div className="freelancer-page-heading">

            <div className="freelancer-page-icon">
              <FaBriefcase />
            </div>

            <div>
              <span className="freelancer-eyebrow">
                OPPORTUNITIES
              </span>

              <h1>
                Browse Projects
              </h1>

              <p>
                Find projects that match
                your skills and expertise.
              </p>
            </div>

          </div>

          <div className="freelancer-project-count">

            <strong>
              {
                filteredProjects.length
              }
            </strong>

            <span>
              Open Projects
            </span>

          </div>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="freelancer-alert freelancer-alert-error">

            <div className="freelancer-alert-icon">
              <FaExclamationCircle />
            </div>

            <div className="freelancer-alert-content">

              <strong>
                Unable to load projects
              </strong>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={
                  fetchProjects
                }
              >
                Try Again
              </button>

            </div>

          </div>
        )}

        {/* ======================================
            SEARCH & FILTER
        ====================================== */}

        <div className="freelancer-filter-card">

          <div className="freelancer-filter-title">

            <div className="freelancer-filter-icon">
              <FaFilter />
            </div>

            <div>
              <strong>
                Find your next project
              </strong>

              <span>
                Search and filter available
                opportunities
              </span>
            </div>

          </div>

          <form
            onSubmit={handleSearch}
            className="freelancer-filter-form"
          >

            {/* SEARCH */}

            <div className="freelancer-search-field">

              <FaSearch />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search projects, skills..."
                aria-label="Search projects"
              />

            </div>

            {/* CATEGORY */}

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              className="freelancer-filter-select"
            >
              <option value="All Categories">
                All Categories
              </option>

              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            {/* SKILL */}

            <select
              value={skill}
              onChange={(event) =>
                setSkill(
                  event.target.value
                )
              }
              className="freelancer-filter-select"
            >
              <option value="All Skills">
                All Skills
              </option>

              {skills.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            {/* SEARCH BUTTON */}

            <button
              type="submit"
              className="freelancer-filter-button"
            >
              <FaSearch />

              <span>
                Search
              </span>
            </button>

          </form>

          {/* RESET */}

          {(search ||
            category !==
              "All Categories" ||
            skill !==
              "All Skills") && (
            <div className="freelancer-filter-reset">

              <button
                type="button"
                onClick={
                  handleReset
                }
              >
                <FaTimes />

                Clear Filters
              </button>

            </div>
          )}

        </div>

        {/* ======================================
            RESULT HEADER
        ====================================== */}

        <div className="freelancer-result-header">

          <div>

            <span className="freelancer-section-label">
              PROJECTS
            </span>

            <h2>
              Available Projects
            </h2>

            <p>
              {
                filteredProjects.length
              }{" "}
              project
              {filteredProjects.length !==
              1
                ? "s"
                : ""}{" "}
              available for you
            </p>

          </div>

          <div className="freelancer-open-label">

            <span />

            Open projects only

          </div>

        </div>

        {/* ======================================
            PROJECTS
        ====================================== */}

        {filteredProjects.length ===
        0 ? (
          <div className="freelancer-empty">

            <div className="freelancer-empty-icon">
              <FaBriefcase />
            </div>

            <h2>
              No projects found
            </h2>

            <p>
              No open projects match your
              current search or filters.
              Try changing your search
              criteria.
            </p>

            <button
              type="button"
              onClick={
                handleReset
              }
              className="freelancer-primary-btn"
            >
              Clear Filters
            </button>

          </div>
        ) : (
          <div className="freelancer-project-grid">

            {filteredProjects.map(
              (project) => (
                <ProjectCard
                  key={
                    project?._id ||
                    project?.id
                  }
                  project={project}
                  showClient={true}
                  showViewButton={true}
                />
              )
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default BrowseProjects;