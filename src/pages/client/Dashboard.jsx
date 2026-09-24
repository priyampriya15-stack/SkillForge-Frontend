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

import "../../styles/ClientChat.css";


// =====================================================
// CLIENT DASHBOARD
// =====================================================

export default function Dashboard() {

    const navigate = useNavigate();

    // =====================================================
    // STATES
    // =====================================================

    const [data, setData] = useState({
        projects: {
            total: 0,
            active: 0,
            completed: 0,
        },

        recentProjects: [],

        proposals: {
            total: 0,
            accepted: 0,
            pending: 0,
        },

        payments: {
            totalSpent: 0,
        },
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [chatError, setChatError] = useState("");


    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    useEffect(() => {
        loadDashboard();
    }, []);


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getClientDashboard();

            console.log("=================================");
            console.log("CLIENT DASHBOARD RESPONSE:", response);
            console.log("=================================");


            // =================================================
            // GET PROJECTS FROM BACKEND
            //
            // Backend response:
            //
            // {
            //    success: true,
            //    count: 5,
            //    projects: [...]
            // }
            // =================================================

            const projects = Array.isArray(response?.projects)
                ? response.projects
                : [];


            console.log(
                "CLIENT PROJECTS:",
                projects
            );


            console.log(
                "PROJECT COUNT:",
                projects.length
            );


            // =================================================
            // TOTAL PROJECTS
            // =================================================

            const totalProjects =
                response?.count ??
                projects.length;


            // =================================================
            // ACTIVE PROJECTS
            // =================================================

            const activeProjects =
                projects.filter((project) => {

                    const status = String(
                        project?.status || ""
                    )
                        .toLowerCase()
                        .trim();


                    return (
                        status === "active" ||
                        status === "in progress" ||
                        status === "in_progress"
                    );

                }).length;


            // =================================================
            // COMPLETED PROJECTS
            // =================================================

            const completedProjects =
                projects.filter((project) => {

                    const status = String(
                        project?.status || ""
                    )
                        .toLowerCase()
                        .trim();


                    return status === "completed";

                }).length;


            // =================================================
            // CREATE DASHBOARD DATA
            // =================================================

            const dashboardData = {

                projects: {

                    total:
                        totalProjects,

                    active:
                        activeProjects,

                    completed:
                        completedProjects,

                },


                // Show latest 5 projects

                recentProjects:
                    projects.slice(0, 5),


                // -------------------------------------------------
                // Proposal data
                // -------------------------------------------------
                //
                // Current dashboard API does not return proposal
                // statistics, so keep safe defaults.
                //

                proposals: {

                    total: 0,

                    accepted: 0,

                    pending: 0,

                },


                // -------------------------------------------------
                // Payment data
                // -------------------------------------------------
                //
                // Current dashboard API does not return payment
                // statistics, so keep safe default.
                //

                payments: {

                    totalSpent: 0,

                },

            };


            console.log(
                "================================="
            );


            console.log(
                "FINAL CLIENT DASHBOARD DATA:",
                dashboardData
            );


            console.log(
                "================================="
            );


            setData(
                dashboardData
            );


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


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // GET FREELANCER
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
    // GET FREELANCER ID
    // =====================================================

    const getFreelancerId = (project) => {

        const freelancer =
            getFreelancer(project);


        if (!freelancer) {
            return null;
        }


        // Backend can return ObjectId directly

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
    // GET FREELANCER NAME
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
    // GET PROJECT FOR CHAT
    // =====================================================

    const getChatProject = () => {

        const projects =
            data?.recentProjects || [];


        const project =
            projects.find((item) => {

                const freelancerId =
                    getFreelancerId(item);


                return Boolean(
                    freelancerId
                );

            });


        return project || null;

    };


    // =====================================================
    // OPEN CHAT
    // =====================================================

    const openChat = (project) => {

        console.log(
            "================================="
        );


        console.log(
            "OPEN CHAT PROJECT:",
            project
        );


        const freelancer =
            getFreelancer(project);


        console.log(
            "FREELANCER:",
            freelancer
        );


        const freelancerId =
            getFreelancerId(project);


        console.log(
            "FREELANCER ID:",
            freelancerId
        );


        console.log(
            "================================="
        );


        setChatError("");


        // -------------------------------------------------
        // No freelancer assigned
        // -------------------------------------------------

        if (!freelancerId) {

            setChatError(
                "No freelancer is assigned to this project yet. Please select a freelancer from Applications first."
            );

            return;

        }


        // -------------------------------------------------
        // Open chat
        // -------------------------------------------------

        navigate(
            `/chat/${freelancerId}`
        );

    };


    // =====================================================
    // PROJECT CHAT CLICK
    // =====================================================

    const handleProjectChat = (project) => {

        openChat(project);

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
    // DASHBOARD
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
                        gap: "10px",
                        alignItems: "center",
                    }}
                >

                    {/* REFRESH */}

                    <button
                        type="button"
                        className="client-secondary-btn"
                        onClick={loadDashboard}
                        title="Refresh dashboard"
                    >

                        <FiRefreshCw
                            size={16}
                        />

                        Refresh

                    </button>


                    {/* POST PROJECT */}

                    <Link
                        to="/client/post-project"
                        className="client-primary-btn"
                    >

                        <FiPlus
                            size={18}
                        />

                        Post a Project

                    </Link>

                </div>

            </header>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="client-error">

                    <FiAlertCircle
                        size={18}
                    />

                    {error}

                </div>

            )}


            {/* =================================================
                CHAT ERROR
            ================================================= */}

            {chatError && (

                <div className="client-chat-error">

                    <FiAlertCircle
                        size={18}
                    />


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


                {/* TOTAL PROJECTS */}

                <div className="client-stat-card">

                    <div className="client-stat-icon purple">

                        <FiFolder />

                    </div>


                    <div>

                        <span>
                            Total Projects
                        </span>


                        <strong>
                            {data?.projects?.total ?? 0}
                        </strong>

                    </div>

                </div>


                {/* ACTIVE PROJECTS */}

                <div className="client-stat-card">

                    <div className="client-stat-icon blue">

                        <FiClock />

                    </div>


                    <div>

                        <span>
                            Active Projects
                        </span>


                        <strong>
                            {data?.projects?.active ?? 0}
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
                            {data?.projects?.completed ?? 0}
                        </strong>

                    </div>

                </div>


                {/* TOTAL SPENT */}

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
                                data?.payments?.totalSpent || 0
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


                    {/* HEADER */}

                    <div className="client-panel-header">

                        <div>

                            <span className="client-panel-label">
                                PROJECTS
                            </span>


                            <h2>
                                Recent Projects
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

                        {data?.recentProjects?.length > 0 ? (

                            data.recentProjects.map(
                                (project) => {

                                    const freelancerId =
                                        getFreelancerId(
                                            project
                                        );


                                    const freelancerName =
                                        getFreelancerName(
                                            project
                                        );


                                    return (

                                        <div
                                            className="client-project-row"
                                            key={project._id}
                                        >


                                            {/* PROJECT INFO */}

                                            <div className="client-project-main">


                                                <div className="client-project-icon">

                                                    <FiFolder />

                                                </div>


                                                <div>

                                                    <h3>
                                                        {project.title ||
                                                            "Untitled Project"}
                                                    </h3>


                                                    <p>
                                                        {project.category ||
                                                            "Project"}
                                                    </p>


                                                    {/* FREELANCER */}

                                                    {freelancerName && (

                                                        <small className="client-assigned-user">

                                                            <FiUsers
                                                                size={13}
                                                            />

                                                            {freelancerName}

                                                        </small>

                                                    )}

                                                </div>

                                            </div>


                                            {/* ACTIONS */}

                                            <div className="client-project-actions">


                                                {/* STATUS */}

                                                <span
                                                    className={`client-status ${
                                                        String(
                                                            project.status ||
                                                            "open"
                                                        )
                                                            .toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "-"
                                                            )
                                                    }`}
                                                >

                                                    {project.status ||
                                                        "Open"}

                                                </span>


                                                {/* CHAT / APPLICATION */}

                                                {freelancerId ? (

                                                    <button
                                                        type="button"
                                                        className="client-chat-btn"
                                                        onClick={() =>
                                                            handleProjectChat(
                                                                project
                                                            )
                                                        }
                                                    >

                                                        <FiMessageCircle
                                                            size={16}
                                                        />

                                                        Chat

                                                    </button>

                                                ) : (

                                                    <Link
                                                        to="/client/applications"
                                                        className="client-chat-btn secondary"
                                                    >

                                                        <FiUsers
                                                            size={16}
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

                            /* =================================================
                               EMPTY STATE
                            ================================================= */

                            <div className="client-empty">

                                <FiFolder
                                    size={30}
                                />


                                <h3>
                                    No projects yet
                                </h3>


                                <p>
                                    Start by posting your first project.
                                </p>


                                <Link
                                    to="/client/post-project"
                                    className="client-secondary-btn"
                                >

                                    <FiPlus
                                        size={16}
                                    />

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


                    {/* HEADER */}

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


                    {/* PROPOSAL STATS */}

                    <div className="client-proposal-stats">


                        <div>

                            <span>
                                Received
                            </span>


                            <strong>
                                {data?.proposals?.total ?? 0}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Accepted
                            </span>


                            <strong>
                                {data?.proposals?.accepted ?? 0}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Pending
                            </span>


                            <strong>
                                {data?.proposals?.pending ?? 0}
                            </strong>

                        </div>

                    </div>


                    {/* INFO */}

                    <div className="client-info-box">

                        <FiFileText />


                        <span>
                            Review freelancer proposals and
                            select the right person for your project.
                        </span>

                    </div>

                </div>

            </section>


            {/* =================================================
                MESSAGES / CHAT
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


                {/* CHAT CONTENT */}

                <div className="client-message-content">


                    {/* ICON */}

                    <div className="client-message-icon">

                        <FiMessageCircle
                            size={28}
                        />

                    </div>


                    {/* TEXT */}

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


                    {/* ACTIONS */}

                    <div className="client-message-actions">


                        {/* APPLICATIONS */}

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


                        {/* START CHAT */}

                        <button
                            type="button"
                            className="client-message-btn"
                            onClick={() => {

                                const project =
                                    getChatProject();


                                if (!project) {

                                    setChatError(
                                        "No freelancer is assigned to your recent projects yet. Please select a freelancer from Applications."
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


                {/* CHAT STATUS */}

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