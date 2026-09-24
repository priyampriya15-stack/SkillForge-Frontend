import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    Sparkles,
    BriefcaseBusiness,
    Clock3,
    IndianRupee,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Code2,
} from "lucide-react";

import "../styles/AIRecommendedProjects.css";


// =============================================================
// API URL
// =============================================================

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";


// =============================================================
// AI RECOMMENDED PROJECTS
// =============================================================

const AIRecommendedProjects = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [recommendations, setRecommendations] = useState([]);
    const [freelancer, setFreelancer] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // GET AI RECOMMENDATIONS
    // =========================================================

    const getRecommendations = async () => {

        try {

            setLoading(true);
            setError("");


            // -------------------------------------------------
            // GET LOGIN TOKEN
            // -------------------------------------------------

            const token = localStorage.getItem("token");


            if (!token) {

                setError(
                    "Please login as freelancer to view AI recommendations."
                );

                setRecommendations([]);
                setFreelancer(null);

                return;
            }


            // -------------------------------------------------
            // API CALL
            // -------------------------------------------------

            const response = await axios.get(
                `${API_URL}/api/recommendations/freelancer/projects`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            console.log(
                "AI RECOMMENDATION RESPONSE:",
                response.data
            );


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            if (response.data?.success) {

                setFreelancer(
                    response.data.freelancer || null
                );

                setRecommendations(
                    Array.isArray(
                        response.data.recommendations
                    )
                        ? response.data.recommendations
                        : []
                );

            } else {

                setFreelancer(null);
                setRecommendations([]);

                setError(
                    response.data?.message ||
                    "Unable to load recommendations."
                );

            }

        } catch (err) {

            console.error(
                "AI RECOMMENDATION ERROR:",
                err
            );


            // -------------------------------------------------
            // UNAUTHORIZED
            // -------------------------------------------------

            if (err.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            }


            // -------------------------------------------------
            // FORBIDDEN
            // -------------------------------------------------

            else if (err.response?.status === 403) {

                setError(
                    "You must login as a freelancer to view recommendations."
                );

            }


            // -------------------------------------------------
            // NOT FOUND
            // -------------------------------------------------

            else if (err.response?.status === 404) {

                setError(
                    "Recommendation service was not found. Please check the backend server."
                );

            }


            // -------------------------------------------------
            // SERVER ERROR
            // -------------------------------------------------

            else if (err.response?.status >= 500) {

                setError(
                    "Server error. Please try again later."
                );

            }


            // -------------------------------------------------
            // NETWORK ERROR
            // -------------------------------------------------

            else if (err.request && !err.response) {

                setError(
                    "Unable to connect to the server. Please make sure the backend is running."
                );

            }


            // -------------------------------------------------
            // NORMAL ERROR
            // -------------------------------------------------

            else {

                setError(
                    err.response?.data?.message ||
                    "Failed to load AI recommendations."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // LOAD WHEN COMPONENT MOUNTS
    // =========================================================

    useEffect(() => {

        getRecommendations();

    }, []);


    // =========================================================
    // LOADING UI
    // =========================================================

    if (loading) {

        return (

            <section className="ai-recommendation-section">

                {/* HEADER */}

                <div className="ai-section-header">

                    <div className="ai-header-left">

                        <div className="ai-title-icon">
                            <Sparkles size={22} />
                        </div>

                        <div>

                            <h2>
                                AI Recommended Projects
                            </h2>

                            <p>
                                Finding projects that match your skills...
                            </p>

                        </div>

                    </div>

                </div>


                {/* SKELETON */}

                <div className="ai-project-grid">

                    {[1, 2, 3].map((item) => (

                        <div
                            className="ai-project-skeleton"
                            key={item}
                        >

                            <div className="skeleton skeleton-card-title" />

                            <div className="skeleton skeleton-line" />

                            <div className="skeleton skeleton-line short" />

                            <div className="skeleton skeleton-bottom" />

                        </div>

                    ))}

                </div>

            </section>

        );

    }


    // =========================================================
    // ERROR UI
    // =========================================================

    if (error) {

        return (

            <section className="ai-recommendation-section">

                <div className="ai-error-box">

                    <div className="ai-error-icon">

                        <AlertCircle size={24} />

                    </div>


                    <div className="ai-error-content">

                        <h3>
                            Unable to load recommendations
                        </h3>

                        <p>
                            {error}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={getRecommendations}
                        className="ai-refresh-btn"
                    >

                        <RefreshCw size={16} />

                        Retry

                    </button>

                </div>

            </section>

        );

    }


    // =========================================================
    // EMPTY UI
    // =========================================================

    if (!recommendations.length) {

        return (

            <section className="ai-recommendation-section">

                <div className="ai-empty-box">

                    <div className="ai-empty-icon">

                        <Sparkles size={28} />

                    </div>


                    <h3>
                        No AI recommendations yet
                    </h3>


                    <p>
                        Add more skills to your freelancer
                        profile to get personalized project
                        recommendations.
                    </p>


                    <button
                        type="button"
                        onClick={getRecommendations}
                        className="ai-refresh-btn"
                    >

                        <RefreshCw size={16} />

                        Refresh

                    </button>

                </div>

            </section>

        );

    }


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <section className="ai-recommendation-section">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="ai-section-header">

                <div className="ai-header-left">

                    <div className="ai-title-icon">

                        <Sparkles size={22} />

                    </div>


                    <div>

                        <h2>
                            AI Recommended Projects
                        </h2>

                        <p>
                            Projects matched with your
                            skills and experience.
                        </p>

                    </div>

                </div>


                {/* REFRESH */}

                <button
                    type="button"
                    onClick={getRecommendations}
                    className="ai-refresh-btn"
                    title="Refresh recommendations"
                >

                    <RefreshCw size={16} />

                    Refresh

                </button>

            </div>


            {/* =================================================
                FREELANCER INFORMATION
            ================================================= */}

            {freelancer && (

                <div className="ai-profile-bar">


                    {/* PROFILE */}

                    <div className="ai-profile-info">

                        <div className="ai-avatar">

                            {freelancer.name
                                ?.charAt(0)
                                ?.toUpperCase() || "F"}

                        </div>


                        <div>

                            <span>
                                Recommendations for
                            </span>

                            <strong>
                                {freelancer.name || "Freelancer"}
                            </strong>

                        </div>

                    </div>


                    {/* SKILLS */}

                    {Array.isArray(freelancer.skills) &&
                        freelancer.skills.length > 0 && (

                            <div className="ai-skills">

                                {freelancer.skills.map(
                                    (skill, index) => (

                                        <span
                                            key={`${skill}-${index}`}
                                            className="ai-skill-tag"
                                        >

                                            {skill}

                                        </span>

                                    )
                                )}

                            </div>

                        )}

                </div>

            )}


            {/* =================================================
                PROJECT COUNT
            ================================================= */}

            <div className="ai-results-info">

                <span>

                    <Sparkles size={15} />

                    {recommendations.length}{" "}
                    {recommendations.length === 1
                        ? "project"
                        : "projects"}{" "}
                    matched for you

                </span>

            </div>


            {/* =================================================
                PROJECT GRID
            ================================================= */}

            <div className="ai-project-grid">

                {recommendations.map(
                    (project, index) => (

                        <ProjectCard
                            key={
                                project.id ||
                                project._id ||
                                index
                            }
                            project={project}
                        />

                    )
                )}

            </div>

        </section>

    );

};


// =============================================================
// PROJECT CARD
// =============================================================

const ProjectCard = ({ project }) => {

    const navigate = useNavigate();


    // =========================================================
    // MATCH SCORE
    // =========================================================

    const score = Math.min(
        Math.max(
            Number(project.matchScore) || 0,
            0
        ),
        100
    );


    // =========================================================
    // SCORE CLASS
    // =========================================================

    const scoreClass =
        score >= 80
            ? "excellent"
            : score >= 60
                ? "good"
                : "low";


    // =========================================================
    // NORMALIZE SKILL
    // =========================================================

    const normalizeSkill = (skill) => {

        return String(skill || "")
            .toLowerCase()
            .replace(/\.js$/i, "")
            .replace(/\s+/g, "")
            .trim();

    };


    // =========================================================
    // CHECK MATCHED SKILL
    // =========================================================

    const isSkillMatched = (skill) => {

        if (
            !Array.isArray(project.matchedSkills) ||
            !project.matchedSkills.length
        ) {

            return false;

        }


        const currentSkill =
            normalizeSkill(skill);


        return project.matchedSkills.some(
            (matchedSkill) =>
                normalizeSkill(matchedSkill) ===
                currentSkill
        );

    };


    // =========================================================
    // VIEW PROJECT
    // =========================================================

    const handleViewProject = () => {

        const projectId =
            project.id || project._id;


        if (!projectId) {

            console.error(
                "Project ID not found:",
                project
            );

            return;
        }


        navigate(
            `/freelancer/projects/${projectId}`
        );

    };


    // =========================================================
    // FORMAT BUDGET
    // =========================================================

    const formattedBudget =
        Number(project.budget || 0)
            .toLocaleString("en-IN");


    // =========================================================
    // FORMAT DEADLINE
    // =========================================================

    const formattedDeadline =
        project.deadline
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
            : "No deadline";


    // =========================================================
    // PROJECT DESCRIPTION
    // =========================================================

    const description =
        project.description
            ? project.description.length > 150
                ? `${project.description.substring(
                    0,
                    150
                )}...`
                : project.description
            : "No project description available.";


    // =========================================================
    // REQUIRED SKILLS
    // =========================================================

    const requiredSkills =
        Array.isArray(project.skills)
            ? project.skills
            : [];


    // =========================================================
    // MATCHED SKILLS
    // =========================================================

    const matchedSkills =
        Array.isArray(project.matchedSkills)
            ? project.matchedSkills
            : [];


    // =========================================================
    // MISSING SKILLS
    // =========================================================

    const missingSkills =
        Array.isArray(project.missingSkills)
            ? project.missingSkills
            : [];


    // =========================================================
    // PROJECT CARD
    // =========================================================

    return (

        <article className="ai-project-card">


            {/* =================================================
                CARD TOP
            ================================================= */}

            <div className="ai-card-top">


                {/* PROJECT ICON */}

                <div className="ai-project-icon">

                    <BriefcaseBusiness size={20} />

                </div>


                {/* MATCH BADGE */}

                <div
                    className={`ai-match-badge ${scoreClass}`}
                >

                    <Sparkles size={14} />

                    {score}% Match

                </div>

            </div>


            {/* =================================================
                PROJECT TITLE
            ================================================= */}

            <h3 className="ai-project-title">

                {project.title || "Untitled Project"}

            </h3>


            {/* =================================================
                CATEGORY
            ================================================= */}

            {project.category && (

                <span className="ai-category">

                    {project.category}

                </span>

            )}


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p className="ai-project-description">

                {description}

            </p>


            {/* =================================================
                PROJECT DETAILS
            ================================================= */}

            <div className="ai-project-details">


                {/* BUDGET */}

                <div className="ai-detail">

                    <IndianRupee size={16} />

                    <span>

                        ₹{formattedBudget}

                    </span>

                </div>


                {/* DEADLINE */}

                <div className="ai-detail">

                    <Clock3 size={16} />

                    <span>

                        {formattedDeadline}

                    </span>

                </div>

            </div>


            {/* =================================================
                REQUIRED SKILLS
            ================================================= */}

            {requiredSkills.length > 0 && (

                <div className="ai-project-skills">


                    <div className="ai-skills-heading">

                        <Code2 size={15} />

                        Required Skills

                    </div>


                    <div className="ai-skill-list">

                        {requiredSkills.map(
                            (skill, index) => {

                                const matched =
                                    isSkillMatched(skill);


                                return (

                                    <span
                                        key={`${skill}-${index}`}
                                        className={
                                            matched
                                                ? "project-skill matched"
                                                : "project-skill missing"
                                        }
                                    >

                                        {matched ? (

                                            <CheckCircle2
                                                size={13}
                                            />

                                        ) : (

                                            <AlertCircle
                                                size={13}
                                            />

                                        )}

                                        {skill}

                                    </span>

                                );

                            }
                        )}

                    </div>


                    {/* MATCHED SKILLS INFO */}

                    {matchedSkills.length > 0 && (

                        <div className="ai-skill-summary">

                            <CheckCircle2 size={14} />

                            <span>

                                {matchedSkills.length}{" "}
                                {matchedSkills.length === 1
                                    ? "skill"
                                    : "skills"}{" "}
                                matched

                            </span>

                        </div>

                    )}


                    {/* MISSING SKILLS INFO */}

                    {missingSkills.length > 0 && (

                        <div className="ai-missing-summary">

                            <AlertCircle size={14} />

                            <span>

                                Missing:{" "}

                                {missingSkills.join(", ")}

                            </span>

                        </div>

                    )}

                </div>

            )}


            {/* =================================================
                AI REASON
            ================================================= */}

            {project.aiReason && (

                <div className="ai-reason">


                    <div className="ai-reason-icon">

                        <Sparkles size={15} />

                    </div>


                    <p>

                        {project.aiReason}

                    </p>

                </div>

            )}


            {/* =================================================
                MATCH SCORE
            ================================================= */}

            <div className="ai-score-section">


                <div className="ai-score-header">

                    <span>
                        AI Match Score
                    </span>


                    <strong
                        className={scoreClass}
                    >

                        {score}%

                    </strong>

                </div>


                <div className="ai-score-bar">

                    <div
                        className={`ai-score-fill ${scoreClass}`}
                        style={{
                            width: `${score}%`,
                        }}
                    />

                </div>

            </div>


            {/* =================================================
                VIEW PROJECT BUTTON
            ================================================= */}

            <button
                type="button"
                className="ai-view-project-btn"
                onClick={handleViewProject}
            >

                View Project

                <ArrowRight size={17} />

            </button>

        </article>

    );

};


export default AIRecommendedProjects;