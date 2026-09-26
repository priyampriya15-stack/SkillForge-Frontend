import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    FaPlus,
    FaSpinner,
    FaCheck,
    FaClock,
    FaLayerGroup,
    FaMoneyBillWave,
    FaCircleCheck,
    FaRocket,
    FaCalendarDays,
    FaUserCheck,
    FaPaperPlane,
    FaArrowLeft,
    FaChevronDown,
} from "react-icons/fa6";

import { getProjects } from "../../Services/projectService";

import {
    getMilestones,
    createMilestone,
    updateMilestone,
} from "../../Services/milestoneServices";

import "./Milestones.css";


const Milestones = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");

    const [milestones, setMilestones] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingMilestones, setLoadingMilestones] = useState(false);

    const [creating, setCreating] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");


    // =====================================================
    // LOAD PROJECTS
    // =====================================================

    useEffect(() => {
        loadProjects();
    }, []);


    const loadProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getProjects();

            const data =
                response?.data?.projects ||
                response?.data?.data ||
                response?.data ||
                response?.projects ||
                [];

            const projectList = Array.isArray(data)
                ? data
                : [];

            setProjects(projectList);

            if (projectList.length > 0) {
                const firstProject =
                    projectList[0]?._id ||
                    projectList[0]?.id;

                setSelectedProject(firstProject || "");
            }

        } catch (err) {
            console.error("Failed to load projects:", err);

            setError(
                err?.response?.data?.message ||
                "Failed to load projects."
            );
        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // SELECTED PROJECT
    // =====================================================

    const selectedProjectData = useMemo(() => {

        return projects.find((project) => {

            const projectId =
                project?._id ||
                project?.id;

            return String(projectId) === String(selectedProject);

        });

    }, [projects, selectedProject]);


    // =====================================================
    // FREELANCER
    // =====================================================

    const selectedFreelancer = useMemo(() => {

        if (!selectedProjectData) {
            return null;
        }

        return (
            selectedProjectData.freelancer ||
            selectedProjectData.assignedFreelancer ||
            selectedProjectData.selectedFreelancer ||
            selectedProjectData.freelancerId ||
            null
        );

    }, [selectedProjectData]);


    const hasSelectedFreelancer = Boolean(
        selectedFreelancer
    );


    // =====================================================
    // LOAD MILESTONES
    // =====================================================

    useEffect(() => {

        if (!selectedProject) {
            setMilestones([]);
            return;
        }

        loadMilestones(selectedProject);

    }, [selectedProject]);


    const loadMilestones = async (projectId) => {

        try {

            setLoadingMilestones(true);
            setError("");

            const response =
                await getMilestones(projectId);

            const data =
                response?.data?.milestones ||
                response?.data?.data ||
                response?.data ||
                response?.milestones ||
                [];

            setMilestones(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load milestones:",
                err
            );

            setMilestones([]);

            setError(
                err?.response?.data?.message ||
                "Failed to load milestones."
            );

        } finally {

            setLoadingMilestones(false);

        }
    };


    // =====================================================
    // CREATE MILESTONE
    // =====================================================

    const handleCreateMilestone = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!selectedProject) {
            setError("Please select a project.");
            return;
        }

        if (!title.trim()) {
            setError("Milestone title is required.");
            return;
        }

        if (!amount || Number(amount) <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        if (!dueDate) {
            setError("Please select a due date.");
            return;
        }


        try {

            setCreating(true);

            const payload = {
                projectId: selectedProject,
                title: title.trim(),
                description: description.trim(),
                amount: Number(amount),
                dueDate,
            };

            console.log(
                "Creating milestone:",
                payload
            );

            await createMilestone(payload);

            setSuccess(
                "Milestone created successfully."
            );

            // Reset form
            setTitle("");
            setDescription("");
            setAmount("");
            setDueDate("");

            // Refresh milestones
            await loadMilestones(
                selectedProject
            );

        } catch (err) {

            console.error(
                "Create milestone error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create milestone."
            );

        } finally {

            setCreating(false);

        }
    };


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    const handleStatusUpdate = async (
        milestoneId,
        status
    ) => {

        try {

            setUpdatingId(milestoneId);
            setError("");
            setSuccess("");

            await updateMilestone(
                milestoneId,
                { status }
            );

            setSuccess(
                status === "approved"
                    ? "Milestone approved successfully."
                    : "Milestone completed successfully."
            );

            await loadMilestones(
                selectedProject
            );

        } catch (err) {

            console.error(
                "Update milestone error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update milestone."
            );

        } finally {

            setUpdatingId(null);

        }
    };


    // =====================================================
    // AUTO HIDE MESSAGES
    // =====================================================

    useEffect(() => {

        if (!success && !error) {
            return;
        }

        const timer = setTimeout(() => {
            setSuccess("");
            setError("");
        }, 4000);

        return () => clearTimeout(timer);

    }, [success, error]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const completedCount = milestones.filter(
        (item) =>
            item?.status === "completed"
    ).length;


    const inProgressCount = milestones.filter(
        (item) =>
            item?.status === "in_progress"
    ).length;


    const submittedCount = milestones.filter(
        (item) =>
            item?.status === "submitted"
    ).length;


    const pendingCount = milestones.filter(
        (item) =>
            !item?.status ||
            item?.status === "pending"
    ).length;


    const totalMilestoneAmount =
        milestones.reduce(
            (total, milestone) =>
                total +
                Number(
                    milestone?.amount || 0
                ),
            0
        );


    const progress =
        milestones.length > 0
            ? Math.round(
                  (completedCount /
                      milestones.length) *
                      100
              )
            : 0;


    // =====================================================
    // STATUS LABEL
    // =====================================================

    const getStatusLabel = (status) => {

        const labels = {
            pending: "Pending",
            in_progress: "In Progress",
            submitted: "Submitted",
            approved: "Approved",
            completed: "Completed",
        };

        return (
            labels[status] ||
            "Pending"
        );
    };


    // =====================================================
    // STATUS ICON
    // =====================================================

    const getStatusIcon = (status) => {

        switch (status) {

            case "completed":
                return <FaCircleCheck />;

            case "approved":
                return <FaCheck />;

            case "submitted":
                return <FaPaperPlane />;

            case "in_progress":
                return <FaRocket />;

            default:
                return <FaClock />;
        }
    };


    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "No date";
        }

        const parsedDate =
            new Date(date);

        if (Number.isNaN(
            parsedDate.getTime()
        )) {
            return "Invalid date";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="milestones-page">

            <div className="milestones-container">

                {/* BACK */}

                <Link
                    to="/client/dashboard"
                    className="milestone-back"
                >
                    <FaArrowLeft />
                    Back to Dashboard
                </Link>


                {/* HERO */}

                <section className="milestone-hero">

                    <div className="hero-left">

                        <div className="hero-icon">
                            <FaRocket />
                        </div>

                        <div>

                            <div className="hero-badge">
                                <span className="pulse-dot"></span>
                                PROJECT MANAGEMENT
                            </div>

                            <h1>
                                Project Milestones
                            </h1>

                            <p>
                                Plan deliverables, monitor
                                progress and manage freelancer
                                payments from one place.
                            </p>

                        </div>

                    </div>


                    <div className="project-selector">

                        <label>
                            ACTIVE PROJECT
                        </label>

                        {loading ? (

                            <div className="loading-select">

                                <FaSpinner className="spin" />

                                Loading projects...

                            </div>

                        ) : projects.length > 0 ? (

                            <div className="select-wrapper">

                                <select
                                    value={selectedProject}
                                    onChange={(e) => {

                                        setSelectedProject(
                                            e.target.value
                                        );

                                        setSuccess("");
                                        setError("");

                                    }}
                                >

                                    {projects.map(
                                        (project) => {

                                            const projectId =
                                                project?._id ||
                                                project?.id;

                                            return (

                                                <option
                                                    key={projectId}
                                                    value={projectId}
                                                >
                                                    {project?.title ||
                                                        "Untitled Project"}
                                                </option>

                                            );

                                        }
                                    )}

                                </select>

                                <FaChevronDown />

                            </div>

                        ) : (

                            <div className="no-project-select">
                                No projects found
                            </div>

                        )}

                    </div>

                </section>


                {/* NO PROJECT */}

                {!loading &&
                    projects.length === 0 && (

                    <section className="empty-project">

                        <div className="empty-icon">
                            <FaLayerGroup />
                        </div>

                        <h2>
                            No projects available
                        </h2>

                        <p>
                            Create your first project
                            before adding milestones.
                        </p>

                        <Link
                            to="/client/post-project"
                            className="primary-button"
                        >
                            <FaPlus />
                            Create Project
                        </Link>

                    </section>

                )}


                {/* PROJECT */}

                {selectedProjectData && (

                    <>

                        {/* FREELANCER */}

                        <section className="freelancer-card">

                            <div className="freelancer-info">

                                <div className="freelancer-avatar">
                                    <FaUserCheck />
                                </div>

                                <div>

                                    <span>
                                        ASSIGNED FREELANCER
                                    </span>

                                    <h3>

                                        {hasSelectedFreelancer

                                            ? typeof selectedFreelancer ===
                                              "object"

                                                ? selectedFreelancer.name ||
                                                  selectedFreelancer.fullName ||
                                                  selectedFreelancer.username ||
                                                  "Freelancer Selected"

                                                : "Freelancer Selected"

                                            : "No freelancer selected"}

                                    </h3>

                                    <p>

                                        {hasSelectedFreelancer

                                            ? "Freelancer is assigned to this project"

                                            : "Select a freelancer before starting the project"}

                                    </p>

                                </div>

                            </div>


                            {!hasSelectedFreelancer && (

                                <Link
                                    to="/client/applications"
                                    className="secondary-button"
                                >
                                    View Applications
                                </Link>

                            )}

                        </section>


                        {/* STATS */}

                        <section className="stats-grid">

                            <div className="stat-card purple">

                                <div>
                                    <span>
                                        TOTAL MILESTONES
                                    </span>

                                    <strong>
                                        {milestones.length}
                                    </strong>
                                </div>

                                <div className="stat-icon">
                                    <FaLayerGroup />
                                </div>

                            </div>


                            <div className="stat-card gray">

                                <div>
                                    <span>
                                        PENDING
                                    </span>

                                    <strong>
                                        {pendingCount}
                                    </strong>
                                </div>

                                <div className="stat-icon">
                                    <FaClock />
                                </div>

                            </div>


                            <div className="stat-card orange">

                                <div>
                                    <span>
                                        IN PROGRESS
                                    </span>

                                    <strong>
                                        {inProgressCount}
                                    </strong>
                                </div>

                                <div className="stat-icon">
                                    <FaRocket />
                                </div>

                            </div>


                            <div className="stat-card violet">

                                <div>
                                    <span>
                                        SUBMITTED
                                    </span>

                                    <strong>
                                        {submittedCount}
                                    </strong>
                                </div>

                                <div className="stat-icon">
                                    <FaPaperPlane />
                                </div>

                            </div>


                            <div className="stat-card green">

                                <div>
                                    <span>
                                        TOTAL VALUE
                                    </span>

                                    <strong>
                                        ₹
                                        {totalMilestoneAmount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>

                                <div className="stat-icon">
                                    <FaMoneyBillWave />
                                </div>

                            </div>

                        </section>


                        {/* PROGRESS */}

                        <section className="progress-card">

                            <div className="progress-header">

                                <div>

                                    <span>
                                        PROJECT PROGRESS
                                    </span>

                                    <h2>
                                        Overall Completion
                                    </h2>

                                    <p>
                                        {completedCount} of{" "}
                                        {milestones.length}{" "}
                                        milestones completed
                                    </p>

                                </div>

                                <div className="progress-number">
                                    {progress}%
                                </div>

                            </div>


                            <div className="progress-track">

                                <div
                                    className="progress-fill"
                                    style={{
                                        width:
                                            `${progress}%`,
                                    }}
                                />

                            </div>

                        </section>


                        {/* MAIN */}

                        <div className="milestone-main-grid">


                            {/* CREATE */}

                            <section className="create-card">

                                <div className="section-heading">

                                    <div className="heading-icon">
                                        <FaPlus />
                                    </div>

                                    <div>

                                        <h2>
                                            Add Milestone
                                        </h2>

                                        <p>
                                            Create a clear
                                            deliverable for
                                            your freelancer.
                                        </p>

                                    </div>

                                </div>


                                {!hasSelectedFreelancer && (

                                    <div className="warning-box">

                                        <div className="warning-symbol">
                                            !
                                        </div>

                                        <div>

                                            <strong>
                                                No freelancer assigned
                                            </strong>

                                            <p>
                                                You can still create
                                                milestones for this
                                                project.
                                            </p>

                                        </div>

                                    </div>

                                )}


                                <form
                                    onSubmit={
                                        handleCreateMilestone
                                    }
                                    className="milestone-form"
                                >

                                    <div className="form-group">

                                        <label>
                                            Milestone Title
                                        </label>

                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g. UI Design"
                                            required
                                            disabled={creating}
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Description
                                        </label>

                                        <textarea
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Describe the expected deliverable..."
                                            rows={4}
                                            disabled={creating}
                                        />

                                    </div>


                                    <div className="form-row">

                                        <div className="form-group">

                                            <label>
                                                Amount
                                            </label>

                                            <div className="input-with-icon">

                                                <span>
                                                    ₹
                                                </span>

                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) =>
                                                        setAmount(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="5000"
                                                    min="1"
                                                    required
                                                    disabled={creating}
                                                />

                                            </div>

                                        </div>


                                        <div className="form-group">

                                            <label>
                                                Due Date
                                            </label>

                                            <div className="input-with-icon">

                                                <FaCalendarDays />

                                                <input
                                                    type="date"
                                                    value={dueDate}
                                                    onChange={(e) =>
                                                        setDueDate(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    disabled={creating}
                                                    min={
                                                        new Date()
                                                            .toISOString()
                                                            .split("T")[0]
                                                    }
                                                />

                                            </div>

                                        </div>

                                    </div>


                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="create-button"
                                    >

                                        {creating ? (

                                            <>
                                                <FaSpinner className="spin" />
                                                Creating...
                                            </>

                                        ) : (

                                            <>
                                                <FaPlus />
                                                Create Milestone
                                            </>

                                        )}

                                    </button>

                                </form>

                            </section>


                            {/* TIMELINE */}

                            <section className="timeline-section">

                                <div className="timeline-header">

                                    <div>

                                        <span>
                                            MILESTONE TRACKER
                                        </span>

                                        <h2>
                                            Milestone Timeline
                                        </h2>

                                        <p>
                                            Track every deliverable
                                            and payment
                                        </p>

                                    </div>

                                    <div className="items-count">
                                        {milestones.length} items
                                    </div>

                                </div>


                                {loadingMilestones ? (

                                    <div className="timeline-empty">

                                        <FaSpinner
                                            className="spin large-spinner"
                                        />

                                        <h3>
                                            Loading milestones
                                        </h3>

                                        <p>
                                            Fetching project
                                            progress...
                                        </p>

                                    </div>

                                ) : milestones.length === 0 ? (

                                    <div className="timeline-empty">

                                        <div className="empty-timeline-icon">
                                            <FaLayerGroup />
                                        </div>

                                        <h3>
                                            No milestones yet
                                        </h3>

                                        <p>
                                            Create your first
                                            milestone using
                                            the form.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="timeline-list">

                                        {milestones.map(
                                            (milestone, index) => {

                                                const status =
                                                    milestone?.status ||
                                                    "pending";

                                                const isCompleted =
                                                    status ===
                                                    "completed";

                                                const isSubmitted =
                                                    status ===
                                                    "submitted";

                                                const isApproved =
                                                    status ===
                                                    "approved";

                                                const isUpdating =
                                                    updatingId ===
                                                    milestone?._id;


                                                return (

                                                    <article
                                                        key={
                                                            milestone?._id ||
                                                            index
                                                        }
                                                        className={
                                                            `milestone-item status-${status}`
                                                        }
                                                    >

                                                        <div className="timeline-number">
                                                            {index + 1}
                                                        </div>


                                                        <div className="milestone-content">

                                                            <div className="milestone-top">

                                                                <div className="milestone-title-area">

                                                                    <div
                                                                        className={
                                                                            `milestone-status-icon ${
                                                                                isCompleted
                                                                                    ? "completed"
                                                                                    : isSubmitted
                                                                                    ? "submitted"
                                                                                    : isApproved
                                                                                    ? "approved"
                                                                                    : status ===
                                                                                      "in_progress"
                                                                                    ? "in-progress"
                                                                                    : "pending"
                                                                            }`
                                                                        }
                                                                    >
                                                                        {getStatusIcon(
                                                                            status
                                                                        )}
                                                                    </div>


                                                                    <div>

                                                                        <h3>
                                                                            {
                                                                                milestone?.title
                                                                            }
                                                                        </h3>

                                                                        <p>
                                                                            {
                                                                                milestone?.description ||
                                                                                "No description provided."
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                </div>


                                                                <span
                                                                    className={
                                                                        `status-badge ${status}`
                                                                    }
                                                                >

                                                                    {getStatusIcon(
                                                                        status
                                                                    )}

                                                                    {getStatusLabel(
                                                                        status
                                                                    )}

                                                                </span>

                                                            </div>


                                                            <div className="milestone-meta">

                                                                <div className="meta-box">

                                                                    <span>
                                                                        AMOUNT
                                                                    </span>

                                                                    <strong>
                                                                        ₹
                                                                        {Number(
                                                                            milestone?.amount ||
                                                                            0
                                                                        ).toLocaleString(
                                                                            "en-IN"
                                                                        )}
                                                                    </strong>

                                                                </div>


                                                                <div className="meta-box">

                                                                    <span>
                                                                        DUE DATE
                                                                    </span>

                                                                    <strong>

                                                                        <FaCalendarDays />

                                                                        {formatDate(
                                                                            milestone?.dueDate
                                                                        )}

                                                                    </strong>

                                                                </div>


                                                                <div className="meta-box">

                                                                    <span>
                                                                        PAYMENT
                                                                    </span>

                                                                    <strong
                                                                        className={
                                                                            milestone?.paymentStatus ===
                                                                            "paid"
                                                                                ? "paid"
                                                                                : "unpaid"
                                                                        }
                                                                    >
                                                                        {milestone?.paymentStatus ===
                                                                        "paid"
                                                                            ? "Paid"
                                                                            : "Pending"}
                                                                    </strong>

                                                                </div>


                                                                <div className="milestone-actions">

                                                                    {isSubmitted && (

                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                isUpdating
                                                                            }
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    milestone._id,
                                                                                    "approved"
                                                                                )
                                                                            }
                                                                            className="approve-button"
                                                                        >

                                                                            {isUpdating ? (
                                                                                <FaSpinner className="spin" />
                                                                            ) : (
                                                                                <FaCheck />
                                                                            )}

                                                                            Approve

                                                                        </button>

                                                                    )}


                                                                    {isApproved && (

                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                isUpdating
                                                                            }
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    milestone._id,
                                                                                    "completed"
                                                                                )
                                                                            }
                                                                            className="complete-button"
                                                                        >

                                                                            {isUpdating ? (
                                                                                <FaSpinner className="spin" />
                                                                            ) : (
                                                                                <FaCircleCheck />
                                                                            )}

                                                                            Complete

                                                                        </button>

                                                                    )}

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </article>

                                                );

                                            }
                                        )}

                                    </div>

                                )}

                            </section>

                        </div>

                    </>

                )}

            </div>


            {/* SUCCESS */}

            {success && (

                <div className="toast success-toast">

                    <div className="toast-icon">
                        <FaCheck />
                    </div>

                    <div>

                        <strong>
                            Success
                        </strong>

                        <p>
                            {success}
                        </p>

                    </div>

                </div>

            )}


            {/* ERROR */}

            {error && (

                <div className="toast error-toast">

                    <div className="toast-icon">
                        !
                    </div>

                    <div>

                        <strong>
                            Something went wrong
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            )}

        </div>

    );
};


export default Milestones;