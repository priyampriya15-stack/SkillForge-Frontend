import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Star,
  BriefcaseBusiness,
  Award,
  Mail,
  UserRound,
  CheckCircle2,
  XCircle,
  Users,
  CalendarDays,
  IndianRupee,
  Code2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import "../Styles/AIRecommendedFreelancers.css";

const API_URL = "http://localhost:5000/api";

const AIRecommendedFreelancers = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [freelancers, setFreelancers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken")
    );
  };

  const fetchRecommendations = async (isRefresh = false) => {
    const token = getToken();

    if (!token) {
      setError("Please login again to continue.");
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/recommendations/projects/${projectId}/freelancers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;

      setProject(data?.project || null);
      setFreelancers(data?.recommendations || []);
    } catch (err) {
      console.error("AI recommendation error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load recommended freelancers."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchRecommendations();
    }
  }, [projectId]);

  const getScore = (score) => {
    if (score === null || score === undefined || Number.isNaN(Number(score))) {
      return 0;
    }

    return Math.max(0, Math.min(100, Number(score)));
  };

  const getExperience = (experience) => {
    if (
      experience === null ||
      experience === undefined ||
      experience === ""
    ) {
      return 0;
    }

    return Number(experience) || 0;
  };

  const getFreelancer = (item) => {
    return item?.freelancer || {};
  };

  const getFreelancerId = (item) => {
    const freelancer = getFreelancer(item);

    return (
      freelancer?._id ||
      freelancer?.id ||
      item?.freelancerId ||
      item?.id
    );
  };

  const getScoreClass = (score) => {
    const value = getScore(score);

    if (value >= 80) return "score-excellent";
    if (value >= 60) return "score-good";
    if (value >= 40) return "score-average";

    return "score-low";
  };

  const getInitials = (name = "Freelancer") => {
    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const handleViewProfile = (freelancerId) => {
    if (!freelancerId) return;

    /*
      Change this route only if your App.jsx has
      a different freelancer profile route.
    */
    navigate(`/freelancers/${freelancerId}`);
  };

  const handleContact = (freelancerId) => {
    if (!freelancerId) return;

    /*
      Existing SkillForge chat route.
    */
    navigate(`/chat/${freelancerId}`);
  };

  if (loading) {
    return (
      <div className="ai-recommended-page">
        <div className="ai-recommended-container">
          <div className="ai-loading-container">
            <div className="ai-loading-card">
              <div className="ai-loading-icon">
                <Sparkles size={30} />
              </div>

              <h3>Finding the best freelancers...</h3>

              <p>
                AI is analyzing skills, experience, ratings and project
                requirements.
              </p>

              <div className="ai-loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-recommended-page">
        <div className="ai-recommended-container">
          <div className="ai-state-container">
            <div className="ai-state-card ai-error-card">
              <div className="ai-state-icon error-icon">
                <AlertCircle size={32} />
              </div>

              <h3>Something went wrong</h3>

              <p>{error}</p>

              <button
                type="button"
                className="ai-retry-button"
                onClick={() => fetchRecommendations()}
              >
                <RefreshCw size={17} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-recommended-page">
      <div className="ai-recommended-container">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="ai-recommended-header">
          <div className="ai-header-left">
            <button
              type="button"
              className="ai-back-button"
              onClick={() => navigate(-1)}
              title="Go back"
            >
              <ArrowLeft size={19} />
            </button>

            <div className="ai-header-icon">
              <Sparkles size={24} />
            </div>

            <div className="ai-header-content">
              <span className="ai-page-eyebrow">
                AI POWERED MATCHING
              </span>

              <h1>Recommended Freelancers</h1>

              <p>
                Find the best freelancers matched to your project.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="ai-refresh-button"
            onClick={() => fetchRecommendations(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={17}
              className={refreshing ? "ai-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {/* =====================================================
            PROJECT SUMMARY
        ====================================================== */}

        {project && (
          <section className="ai-project-summary">
            <div className="ai-project-summary-top">
              <div>
                <span className="ai-project-label">
                  RECOMMENDATIONS FOR
                </span>

                <h2 className="ai-project-title">
                  {project?.title || "Project"}
                </h2>

                {project?.description && (
                  <p className="ai-project-description">
                    {project.description}
                  </p>
                )}
              </div>

              <div className="ai-project-ai-badge">
                <Sparkles size={15} />
                AI Matched
              </div>
            </div>

            <div className="ai-project-stats">
              <div className="ai-project-stat">
                <div className="ai-project-stat-icon">
                  <Code2 size={17} />
                </div>

                <div>
                  <span>Category</span>
                  <strong>
                    {project?.category || "Not specified"}
                  </strong>
                </div>
              </div>

              <div className="ai-project-stat">
                <div className="ai-project-stat-icon">
                  <IndianRupee size={17} />
                </div>

                <div>
                  <span>Budget</span>
                  <strong>
                    ₹{Number(project?.budget || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <div className="ai-project-stat">
                <div className="ai-project-stat-icon">
                  <CalendarDays size={17} />
                </div>

                <div>
                  <span>Deadline</span>
                  <strong>
                    {project?.deadline
                      ? new Date(project.deadline).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Not specified"}
                  </strong>
                </div>
              </div>

              <div className="ai-project-stat">
                <div className="ai-project-stat-icon">
                  <Users size={17} />
                </div>

                <div>
                  <span>Matches</span>
                  <strong>{freelancers.length}</strong>
                </div>
              </div>
            </div>

            {project?.skills?.length > 0 && (
              <div className="ai-required-skills">
                <span className="ai-section-label">
                  Required Skills
                </span>

                <div className="ai-skills-list">
                  {project.skills.map((skill, index) => (
                    <span className="ai-skill-chip" key={`${skill}-${index}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            RESULTS HEADER
        ====================================================== */}

        <div className="ai-results-header">
          <div>
            <h2 className="ai-results-title">
              Top Freelancer Matches
            </h2>

            <p>
              AI analyzed freelancer skills and project requirements.
            </p>
          </div>

          <span className="ai-results-count">
            {freelancers.length}{" "}
            {freelancers.length === 1 ? "match" : "matches"}
          </span>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {freelancers.length === 0 ? (
          <div className="ai-state-container">
            <div className="ai-state-card">
              <div className="ai-state-icon">
                <Users size={32} />
              </div>

              <h3>No matching freelancers found</h3>

              <p>
                We couldn't find freelancers matching this project's
                requirements yet.
              </p>

              <button
                type="button"
                className="ai-retry-button"
                onClick={() => fetchRecommendations()}
              >
                <RefreshCw size={17} />
                Search Again
              </button>
            </div>
          </div>
        ) : (
          /* =====================================================
             FREELANCER GRID
          ====================================================== */

          <div className="ai-freelancer-grid">
            {freelancers.map((item, index) => {
              const freelancer = getFreelancer(item);

              const freelancerId = getFreelancerId(item);

              const score = getScore(item?.matchScore);

              const experience = getExperience(
                freelancer?.experience
              );

              const matchedSkills = item?.matchedSkills || [];

              const missingSkills = item?.missingSkills || [];

              const allSkills = freelancer?.skills || [];

              const rating = Number(freelancer?.rating || 0);

              const completedJobs = Number(
                freelancer?.completedJobs || 0
              );

              const name = freelancer?.name || "Freelancer";

              return (
                <article
                  className="ai-freelancer-card"
                  key={freelancerId || index}
                >
                  {/* Ranking */}
                  <div className="ai-ranking-badge">
                    #{index + 1}
                  </div>

                  {/* Freelancer Header */}
                  <div className="ai-freelancer-info">
                    <div className="ai-avatar-wrapper">
                      {freelancer?.profileImage ? (
                        <img
                          src={freelancer.profileImage}
                          alt={name}
                          className="ai-freelancer-avatar"
                        />
                      ) : (
                        <div className="ai-freelancer-avatar ai-avatar-placeholder">
                          {getInitials(name)}
                        </div>
                      )}

                      {freelancer?.verified && (
                        <span className="ai-verified-badge">
                          <ShieldCheck size={13} />
                        </span>
                      )}
                    </div>

                    <div className="ai-freelancer-details">
                      <h3 className="ai-freelancer-name">
                        {name}
                      </h3>

                      <p className="ai-freelancer-email">
                        <Mail size={13} />
                        {freelancer?.email || "Email unavailable"}
                      </p>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="ai-score-section">
                    <div className="ai-score-header">
                      <span>
                        <Sparkles size={14} />
                        AI Match Score
                      </span>

                      <strong className={getScoreClass(score)}>
                        {score}%
                      </strong>
                    </div>

                    <div className="ai-score-bar">
                      <div
                        className={`ai-score-progress ${getScoreClass(
                          score
                        )}`}
                        style={{
                          width: `${score}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="ai-freelancer-stats">
                    <div className="ai-stat-box">
                      <Star size={16} />

                      <div>
                        <strong>
                          {rating > 0 ? rating.toFixed(1) : "New"}
                        </strong>

                        <span>Rating</span>
                      </div>
                    </div>

                    <div className="ai-stat-box">
                      <BriefcaseBusiness size={16} />

                      <div>
                        <strong>{completedJobs}</strong>
                        <span>Jobs</span>
                      </div>
                    </div>

                    <div className="ai-stat-box">
                      <Award size={16} />

                      <div>
                        <strong>{experience}+</strong>
                        <span>Years</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="ai-skills-section">
                    <span className="ai-section-label">
                      Skills
                    </span>

                    <div className="ai-skills-list">
                      {allSkills.length > 0 ? (
                        allSkills.slice(0, 8).map((skill, skillIndex) => {
                          const isMatched = matchedSkills.some(
                            (matched) =>
                              matched.toLowerCase() ===
                              skill.toLowerCase()
                          );

                          return (
                            <span
                              key={`${skill}-${skillIndex}`}
                              className={
                                isMatched
                                  ? "ai-freelancer-skill ai-matched-skill"
                                  : "ai-freelancer-skill"
                              }
                            >
                              {isMatched && (
                                <CheckCircle2 size={12} />
                              )}

                              {skill}
                            </span>
                          );
                        })
                      ) : (
                        <span className="ai-no-skills">
                          No skills added
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Matched / Missing Skills */}
                  {(matchedSkills.length > 0 ||
                    missingSkills.length > 0) && (
                    <div className="ai-match-details">
                      {matchedSkills.length > 0 && (
                        <div className="ai-match-line matched">
                          <CheckCircle2 size={15} />

                          <span>
                            <strong>
                              {matchedSkills.length}
                            </strong>{" "}
                            matching{" "}
                            {matchedSkills.length === 1
                              ? "skill"
                              : "skills"}
                          </span>
                        </div>
                      )}

                      {missingSkills.length > 0 && (
                        <div className="ai-match-line missing">
                          <XCircle size={15} />

                          <span>
                            <strong>
                              {missingSkills.length}
                            </strong>{" "}
                            skill
                            {missingSkills.length === 1
                              ? ""
                              : "s"} missing
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Reason */}
                  {(item?.reason || item?.aiReason) && (
                    <div className="ai-reason-box">
                      <div className="ai-reason-header">
                        <Sparkles size={15} />
                        <span>Why AI recommends this freelancer</span>
                      </div>

                      <p className="ai-reason-text">
                        {item?.reason || item?.aiReason}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="ai-card-actions">
                    <button
                      type="button"
                      className="ai-action-button ai-view-button"
                      onClick={() =>
                        handleViewProfile(freelancerId)
                      }
                    >
                      <UserRound size={16} />
                      View Profile
                    </button>

                    <button
                      type="button"
                      className="ai-action-button ai-contact-button"
                      onClick={() =>
                        handleContact(freelancerId)
                      }
                    >
                      <Mail size={16} />
                      Contact
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendedFreelancers;