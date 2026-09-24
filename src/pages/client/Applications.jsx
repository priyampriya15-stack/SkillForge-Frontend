import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FiFolder,
    FiClock,
    FiCheckCircle,
    FiDollarSign,
    FiPlus,
    FiArrowRight,
    FiFileText,
    FiMessageCircle,
    FiUsers,
    FiSend,
    FiChevronRight,
    FiAlertCircle,
    FiRefreshCw,
} from "react-icons/fi";

import { getClientDashboard } from "../../Services/clientService";

import "../../Styles/ClientChat.css";


// =====================================================
// CLIENT DASHBOARD
// =====================================================

export default function Dashboard() {

    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [chatError, setChatError] = useState("");

    const [refreshing, setRefreshing] = useState(false);


    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    const loadDashboard = async () => {

        try {

            setLoading(true);

            setError("");

            console.log("=================================");
            console.log("LOADING CLIENT DASHBOARD...");
            console.log("=================================");


            const response =
                await getClientDashboard();


            console.log(
                "CLIENT DASHBOARD RESPONSE:",
                response
            );


            // =================================================
            // IMPORTANT
            // BACKEND RETURNS:
            //
            // {
            //   success: true,
            //   count: 5,
            //   projects: [...]
            // }
            // =================================================

            let projectList = [];


            if (Array.isArray(response)) {

                projectList = response;

            } else if (
                Array.isArray(response?.projects)
            ) {

                projectList = response.projects;

            } else if (
                Array.isArray(response?.data)
            ) {

                projectList = response.data;

            } else if (
                Array.isArray(response?.data?.projects)
            ) {

                projectList =
                    response.data.projects;

            } else if (
                Array.isArray(response?.dashboard?.projects)
            ) {

                projectList =
                    response.dashboard.projects;

            }


            console.log(
                "CLIENT PROJECTS:",
                projectList
            );

            console.log(
                "PROJECT COUNT:",
                projectList.length
            );


            setProjects(projectList);


        } catch (err) {

            console.error(
                "CLIENT DASHBOARD ERROR:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load dashboard."
            );


            setProjects([]);

        } finally {

            setLoading(false);

            setRefreshing(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadDashboard();

    }, []);


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = async () => {

        setRefreshing(true);

        await loadDashboard();

    };


    // =====================================================
    // PROJECT STATUS
    // =====================================================

    const getProjectStatus = (project) => {

        return String(
            project?.status || "open"
        )
            .toLowerCase()
            .trim();

    };


    // =====================================================
    // TOTAL PROJECTS
    // =====================================================

    const totalProjects =
        projects.length;


    // =====================================================
    // ACTIVE PROJECTS
    // =====================================================

    const activeProjects =
        projects.filter((project) => {

            const status =
                getProjectStatus(project);

            return (
                status === "active" ||
                status === "in progress" ||
                status === "in_progress"
            );

        }).length;


    // =====================================================
    // COMPLETED PROJECTS
    // =====================================================

    const completedProjects =
        projects.filter((project) => {

            const status =
                getProjectStatus(project);

            return status === "completed";

        }).length;


    // =====================================================
    // TOTAL SPENT
    // =====================================================

    const totalSpent =
        projects
            .filter((project) => {

                const status =
                    getProjectStatus(project);

                return status === "completed";

            })
            .reduce(
                (total, project) => {

                    return (
                        total +
                        Number(
                            project?.budget || 0
                        )
                    );

                },
                0
            );


    // =====================================================
    // FREELANCER
    // =====================================================

    const getFreelancer = (project) => {

        if (!project) {
            return null;
        }

        return (
            project?.selectedFreelancer ||
            project?.freelancer ||
            project?.assignedFreelancer ||
            project?.selected_freelancer ||
            project?.assigned_freelancer ||
            null
        );

    };


    // =====================================================
    // FREELANCER ID
    // =====================================================

    const getFreelancerId = (project) => {

        const freelancer =
            getFreelancer(project);


        if (!freelancer) {
            return null;
        }


        if (
            typeof freelancer === "string"
        ) {

            return freelancer;

        }


        return (
            freelancer?._id ||
            freelancer?.id ||
            freelancer?.userId ||
            freelancer?.user?._id ||
            freelancer?.user?.id ||
            null
        );

    };


    // =====================================================
    // FREELANCER NAME
    // =====================================================

    const getFreelancerName = (project) => {

        const freelancer =
            getFreelancer(project);


        if (!freelancer) {
            return null;
        }


        if (
            typeof freelancer === "string"
        ) {

            return "Assigned Freelancer";

        }


        return (
            freelancer?.name ||
            freelancer?.fullName ||
            freelancer?.username ||
            freelancer?.user?.name ||
            freelancer?.user?.fullName ||
            freelancer?.email ||
            "Assigned Freelancer"
        );

    };


    // =====================================================
    // OPEN CHAT
    // =====================================================

    const openChat = (project) => {

        setChatError("");


        const freelancerId =
            getFreelancerId(project);


        console.log(
            "OPEN CHAT FREELANCER ID:",
            freelancerId
        );


        if (!freelancerId) {

            setChatError(
                "No freelancer is assigned to this project yet. Please select a freelancer from Applications first."
            );

            return;

        }


        navigate(
            `/chat/${freelancerId}`
        );

    };


    // =====================================================
    // GET CHAT PROJECT
    // =====================================================

    const getChatProject = () => {

        return (
            projects.find(
                (project) =>
                    Boolean(
                        getFreelancerId(project)
                    )
            ) || null
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="client-loading">

                <div className="client-spinner" />

                <p>
                    Loading your dashboard...
                </p>

            </div>

        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="client-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="client-topbar">

                <div>

                    <span className="client-eyebrow">
                        CLIENT WORKSPACE
                    </span>

                    <h1>
                        Welcome back 👋
                    </h1>

                    <p>
                        Manage your projects, proposals,
                        messages and payments from one place.
                    </p>

                </div>


                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                    }}
                >

                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="client-secondary-btn"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                        }}
                    >

                        <FiRefreshCw
                            className={
                                refreshing
                                    ? "client-refresh-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>


                    {/* POST PROJECT */}

                    <Link
                        to="/client/post-project"
                        className="client-primary-btn"
                    >

                        <FiPlus size={18} />

                        Post a Project

                    </Link>

                </div>

            </header>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="client-error">

                    <FiAlertCircle />

                    {error}

                </div>

            )}


            {/* =================================================
                CHAT ERROR
            ================================================= */}

            {chatError && (

                <div className="client-chat-error">

                    <FiAlertCircle size={18} />

                    <span>
                        {chatError}
                    </span>

                    <Link
                        to="/client/applications"
                        className="client-chat-error-link"
                    >
                        Go to Applications
                    </Link>

                </div>

            )}


            {/* =================================================
                STATS
            ================================================= */}

            <section className="client-stats-grid">


                {/* TOTAL */}

                <div className="client-stat-card">

                    <div className="client-stat-icon purple">

                        <FiFolder />

                    </div>

                    <div>

                        <span>
                            Total Projects
                        </span>

                        <strong>
                            {totalProjects}
                        </strong>

                    </div>

                </div>


                {/* ACTIVE */}

                <div className="client-stat-card">

                    <div className="client-stat-icon blue">

                        <FiClock />

                    </div>

                    <div>

                        <span>
                            Active Projects
                        </span>

                        <strong>
                            {activeProjects}
                        </strong>

                    </div>

                </div>


                {/* COMPLETED */}

                <div className="client-stat-card">

                    <div className="client-stat-icon green">

                        <FiCheckCircle />

                    </div>

                    <div>

                        <span>
                            Completed
                        </span>

                        <strong>
                            {completedProjects}
                        </strong>

                    </div>

                </div>


                {/* SPENT */}

                <div className="client-stat-card">

                    <div className="client-stat-icon orange">

                        <FiDollarSign />

                    </div>

                    <div>

                        <span>
                            Total Spent
                        </span>

                        <strong>
                            ₹
                            {Number(
                                totalSpent
                            ).toLocaleString("en-IN")}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                MAIN GRID
            ================================================= */}

            <section className="client-dashboard-grid">


                {/* =================================================
                    RECENT PROJECTS
                ================================================= */}

                <div className="client-panel">

                    <div className="client-panel-header">

                        <div>

                            <span className="client-panel-label">
                                PROJECTS
                            </span>

                            <h2>
                                My Projects
                            </h2>

                        </div>


                        <Link
                            to="/client/projects"
                        >

                            View all

                            <FiArrowRight
                                size={15}
                            />

                        </Link>

                    </div>


                    {/* PROJECT LIST */}

                    <div className="client-project-list">


                        {projects.length > 0 ? (

                            projects
                                .slice(0, 5)
                                .map(
                                    (project) => {

                                        const freelancerId =
                                            getFreelancerId(
                                                project
                                            );


                                        const freelancerName =
                                            getFreelancerName(
                                                project
                                            );


                                        const status =
                                            getProjectStatus(
                                                project
                                            );


                                        return (

                                            <div
                                                className="client-project-row"
                                                key={
                                                    project._id
                                                }
                                            >


                                                {/* PROJECT INFO */}

                                                <div className="client-project-main">

                                                    <div className="client-project-icon">

                                                        <FiFolder />

                                                    </div>


                                                    <div>

                                                        <h3>
                                                            {
                                                                project?.title ||
                                                                "Untitled Project"
                                                            }
                                                        </h3>


                                                        <p>

                                                            {
                                                                project?.category ||
                                                                "Project"
                                                            }

                                                        </p>


                                                        {project?.budget && (

                                                            <small>

                                                                Budget: ₹
                                                                {Number(
                                                                    project.budget
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}

                                                            </small>

                                                        )}


                                                        {freelancerName && (

                                                            <small
                                                                className="client-assigned-user"
                                                            >

                                                                <FiUsers
                                                                    size={
                                                                        13
                                                                    }
                                                                />

                                                                {
                                                                    freelancerName
                                                                }

                                                            </small>

                                                        )}

                                                    </div>

                                                </div>


                                                {/* ACTIONS */}

                                                <div className="client-project-actions">


                                                    {/* STATUS */}

                                                    <span
                                                        className={`client-status ${status.replace(
                                                            /\s+/g,
                                                            "-"
                                                        )}`}
                                                    >

                                                        {status
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase() +
                                                            status.slice(
                                                                1
                                                            )}

                                                    </span>


                                                    {/* APPLICATIONS / CHAT */}

                                                    {freelancerId ? (

                                                        <button
                                                            type="button"
                                                            className="client-chat-btn"
                                                            onClick={() =>
                                                                openChat(
                                                                    project
                                                                )
                                                            }
                                                        >

                                                            <FiMessageCircle
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            Chat

                                                        </button>

                                                    ) : (

                                                        <Link
                                                            to="/client/applications"
                                                            className="client-chat-btn secondary"
                                                        >

                                                            <FiUsers
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            Applications

                                                        </Link>

                                                    )}

                                                </div>

                                            </div>

                                        );

                                    }
                                )

                        ) : (

                            <div className="client-empty">

                                <FiFolder
                                    size={30}
                                />

                                <h3>
                                    No projects yet
                                </h3>

                                <p>
                                    Start by posting your
                                    first project.
                                </p>


                                <Link
                                    to="/client/post-project"
                                    className="client-secondary-btn"
                                >

                                    <FiPlus />

                                    Post Project

                                </Link>

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    PROPOSAL SUMMARY
                ================================================= */}

                <div className="client-panel">

                    <div className="client-panel-header">

                        <div>

                            <span className="client-panel-label">
                                FREELANCERS
                            </span>

                            <h2>
                                Proposal Summary
                            </h2>

                        </div>


                        <Link
                            to="/client/applications"
                        >

                            View all

                            <FiArrowRight
                                size={15}
                            />

                        </Link>

                    </div>


                    <div className="client-proposal-stats">


                        <div>

                            <span>
                                Received
                            </span>

                            <strong>
                                0
                            </strong>

                        </div>


                        <div>

                            <span>
                                Accepted
                            </span>

                            <strong>
                                0
                            </strong>

                        </div>


                        <div>

                            <span>
                                Pending
                            </span>

                            <strong>
                                0
                            </strong>

                        </div>


                    </div>


                    <div className="client-info-box">

                        <FiFileText />

                        <span>
                            Review freelancer proposals
                            and select the right person
                            for your project.
                        </span>

                    </div>


                    <Link
                        to="/client/applications"
                        className="client-message-btn"
                        style={{
                            marginTop: "18px",
                            display: "inline-flex",
                        }}
                    >

                        <FiUsers />

                        Review Applications

                        <FiChevronRight />

                    </Link>

                </div>

            </section>


            {/* =================================================
                MESSAGES
            ================================================= */}

            <section className="client-panel client-messages-panel">


                {/* HEADER */}

                <div className="client-panel-header">

                    <div>

                        <span className="client-panel-label">
                            COMMUNICATION
                        </span>

                        <h2>
                            Messages
                        </h2>

                    </div>


                    <div className="client-chat-header-icon">

                        <FiMessageCircle />

                    </div>

                </div>


                {/* CONTENT */}

                <div className="client-message-content">


                    <div className="client-message-icon">

                        <FiMessageCircle
                            size={28}
                        />

                    </div>


                    <div className="client-message-text">

                        <h3>
                            Chat with your freelancers
                        </h3>

                        <p>
                            Communicate with selected
                            freelancers in real time about
                            your projects, milestones and
                            deliverables.
                        </p>

                    </div>


                    <div className="client-message-actions">


                        <Link
                            to="/client/applications"
                            className="client-message-btn secondary"
                        >

                            <FiUsers
                                size={17}
                            />

                            View Applications

                            <FiChevronRight
                                size={15}
                            />

                        </Link>


                        <button
                            type="button"
                            className="client-message-btn"
                            onClick={() => {

                                const project =
                                    getChatProject();


                                if (!project) {

                                    setChatError(
                                        "No freelancer is assigned to your projects yet. Please select a freelancer from Applications."
                                    );

                                    return;

                                }


                                openChat(project);

                            }}
                        >

                            <FiSend
                                size={17}
                            />

                            Start Chat

                        </button>

                    </div>

                </div>


                {/* STATUS */}

                <div className="client-chat-status">

                    <div className="client-chat-status-dot" />

                    <span>
                        Real-time communication is available
                        with your selected freelancers.
                    </span>

                </div>

            </section>


        </div>

    );

}